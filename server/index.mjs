import http from "node:http";
import { Pool } from "pg";

const port = Number(process.env.PORT ?? 8787);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function send(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function dateCode() {
  const date = new Date();
  return `${String(date.getUTCFullYear()).slice(-2)}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
}

// Chinese display fields are returned from the localized JSONB column using an
// explicit whitelist, so database content can never override canonical fields.
const localizedCnKeys = ["displayNameCn", "fullNameCn", "nicknameCn", "primaryTitleCn", "birthPlaceCn", "deathPlaceCn"];

function asPerson(row) {
  const localized = row.localized ?? {};
  const cnFields = {};
  for (const key of localizedCnKeys) {
    const value = localized[key];
    if (typeof value === "string" && value) cnFields[key] = value;
  }
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    displayName: row.display_name,
    fullName: row.full_name,
    nickname: row.nickname,
    alsoKnownAs: row.also_known_as ?? [],
    nicknameTags: row.nickname_tags ?? [],
    ...cnFields,
    birthYear: row.birth_year ?? "",
    deathYear: row.death_year ?? "",
    birthPlace: row.birth_place,
    deathPlace: row.death_place,
    deathCause: row.death_cause ?? undefined,
    gender: row.gender,
    dynasty: row.dynasty,
    house: row.house,
    culture: row.culture,
    faith: row.faith,
    primaryTitle: row.primary_title,
    titles: [],
    tags: [],
    rank: row.rank,
    importanceScore: row.importance_score,
    relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] },
    events: [],
    wikiUrl: row.wiki_url,
    portraitUrl: row.portrait_url,
    sourceUrl: row.source_url,
    sourceNote: row.source_note,
    notes: row.notes,
    createdDate: row.created_date,
    createdOrder: row.created_order,
  };
}

async function listPeople() {
  const [peopleResult, parentageResult, titlesResult, tagsResult, unionsResult, eventsResult] = await Promise.all([
    pool.query("SELECT * FROM people ORDER BY created_order"),
    pool.query("SELECT child_id, father_id, mother_id FROM person_parentage"),
    pool.query("SELECT person_id, title, title_cn, start_year, end_year FROM person_titles ORDER BY start_year NULLS LAST"),
    pool.query("SELECT person_id, tag FROM person_tags ORDER BY tag"),
    pool.query("SELECT person_a_id, person_b_id, union_type FROM person_unions"),
    pool.query("SELECT person_id, year, month, day, event_type, tags, weight, label, label_cn, wiki_url, note FROM person_events ORDER BY year, month, day"),
  ]);
  const byId = new Map(peopleResult.rows.map((row) => [row.id, asPerson(row)]));

  parentageResult.rows.forEach((row) => {
    const child = byId.get(row.child_id);
    if (!child) return;
    child.relationships.fatherId = row.father_id ?? "";
    child.relationships.motherId = row.mother_id ?? "";
    [row.father_id, row.mother_id].filter(Boolean).forEach((parentId) => byId.get(parentId)?.relationships.childIds.push(row.child_id));
  });
  titlesResult.rows.forEach((row) => byId.get(row.person_id)?.titles.push({ title: row.title, titleCn: row.title_cn || undefined, startYear: row.start_year ?? "", endYear: row.end_year ?? "" }));
  tagsResult.rows.forEach((row) => byId.get(row.person_id)?.tags.push(row.tag));
  unionsResult.rows.forEach((row) => {
    const a = byId.get(row.person_a_id);
    const b = byId.get(row.person_b_id);
    if (!a || !b) return;
    const key = row.union_type === "partner" ? "partnerIds" : "spouseIds";
    a.relationships[key].push(b.id);
    b.relationships[key].push(a.id);
  });
  eventsResult.rows.forEach((row) => byId.get(row.person_id)?.events.push({
    year: row.year ?? "",
    month: row.month ?? undefined,
    day: row.day ?? undefined,
    type: row.event_type,
    tags: row.tags ?? [],
    weight: row.weight,
    label: row.label,
    labelCn: row.label_cn || undefined,
    wikiUrl: row.wiki_url,
    note: row.note || undefined,
  }));
  return [...byId.values()];
}

async function createPerson(input) {
  const displayName = String(input.displayName ?? "").trim();
  const fullName = String(input.fullName ?? displayName).trim();
  const id = String(input.id ?? "").trim();
  if (!displayName || !fullName || !/^[A-Za-z0-9_-]{6,64}$/.test(id)) throw new Error("A valid id, display name, and full name are required.");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query("SELECT COALESCE(MAX(created_order), 0) + 1 AS next_order FROM people");
    const createdOrder = Number(orderResult.rows[0].next_order);
    const values = [
      id, String(input.firstName ?? displayName), String(input.lastName ?? ""), displayName, fullName,
      String(input.nickname ?? ""), input.birthYear || null, input.deathYear || null,
      String(input.birthPlace ?? ""), String(input.deathPlace ?? ""), String(input.gender ?? "unknown"),
      String(input.dynasty ?? ""), String(input.house ?? input.dynasty ?? ""), String(input.culture ?? ""), String(input.faith ?? ""),
      String(input.primaryTitle ?? ""), String(input.rank ?? "untitled"), Number(input.importanceScore ?? 0),
      String(input.wikiUrl ?? ""), String(input.sourceUrl ?? input.wikiUrl ?? ""), String(input.notes ?? ""),
      dateCode(), createdOrder,
    ];
    await client.query(
      `INSERT INTO people (id, first_name, last_name, display_name, full_name, nickname, birth_year, death_year, birth_place, death_place, gender, dynasty, house, culture, faith, primary_title, rank, importance_score, wiki_url, source_url, notes, created_date, created_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
      values,
    );
    if (input.fatherId || input.motherId) {
      await client.query("INSERT INTO person_parentage (child_id, father_id, mother_id) VALUES ($1,$2,$3)", [id, input.fatherId || null, input.motherId || null]);
    }
    for (const tag of input.tags ?? []) await client.query("INSERT INTO person_tags (person_id, tag) VALUES ($1,$2)", [id, tag]);
    if (input.primaryTitle) await client.query("INSERT INTO person_titles (person_id, title, start_year, end_year) VALUES ($1,$2,$3,$4)", [id, input.primaryTitle, input.titleStartYear || null, input.titleEndYear || null]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return (await listPeople()).find((person) => person.id === id);
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") return send(response, 204, {});
  try {
    if (request.method === "GET" && request.url === "/api/health") return send(response, 200, { ok: true });
    if (request.method === "GET" && request.url === "/api/people") return send(response, 200, { people: await listPeople() });
    if (request.method === "POST" && request.url === "/api/people") return send(response, 201, { person: await createPerson(await readBody(request)) });
    return send(response, 404, { error: "Not found" });
  } catch (error) {
    return send(response, 500, { error: error instanceof Error ? error.message : "Database request failed" });
  }
});

server.listen(port, () => console.log(`Family tree API listening on http://127.0.0.1:${port}`));
