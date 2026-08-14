import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Pool } from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const people = JSON.parse(await readFile(resolve(here, "../people.normandy.json"), "utf8"));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function nullable(value) {
  return value === "" || value === undefined ? null : value;
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const person of people) {
      await client.query(
        `INSERT INTO people (id, first_name, last_name, display_name, full_name, nickname, also_known_as, nickname_tags, birth_year, death_year, birth_place, death_place, gender, dynasty, house, culture, faith, primary_title, rank, importance_score, wiki_url, portrait_url, source_url, source_note, notes, death_cause, created_date, created_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
         ON CONFLICT (id) DO UPDATE SET
           display_name = EXCLUDED.display_name,
           full_name = EXCLUDED.full_name,
           primary_title = EXCLUDED.primary_title,
           birth_year = EXCLUDED.birth_year,
           death_year = EXCLUDED.death_year,
           updated_at = now()`,
        [
          person.id, person.firstName, person.lastName, person.displayName, person.fullName, person.nickname,
          person.alsoKnownAs ?? [], person.nicknameTags ?? [], nullable(person.birthYear), nullable(person.deathYear),
          person.birthPlace, person.deathPlace, person.gender, person.dynasty, person.house, person.culture, person.faith,
          person.primaryTitle, person.rank, person.importanceScore, person.wikiUrl, person.portraitUrl, person.sourceUrl,
          person.sourceNote, person.notes, person.deathCause ? JSON.stringify(person.deathCause) : null, person.createdDate, person.createdOrder,
        ],
      );
    }
    for (const person of people) {
      const { fatherId, motherId, spouseIds, partnerIds } = person.relationships;
      if (fatherId || motherId) {
        await client.query(
          `INSERT INTO person_parentage (child_id, father_id, mother_id) VALUES ($1,$2,$3)
           ON CONFLICT (child_id) DO UPDATE SET father_id = EXCLUDED.father_id, mother_id = EXCLUDED.mother_id`,
          [person.id, nullable(fatherId), nullable(motherId)],
        );
      }
      for (const title of person.titles) {
        await client.query(
          "INSERT INTO person_titles (person_id, title, start_year, end_year) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING",
          [person.id, title.title, nullable(title.startYear), nullable(title.endYear)],
        );
      }
      for (const tag of person.tags) await client.query("INSERT INTO person_tags (person_id, tag) VALUES ($1,$2) ON CONFLICT DO NOTHING", [person.id, tag]);
      for (const event of person.events) {
        await client.query(
          "INSERT INTO person_events (person_id, year, month, day, event_type, tags, weight, label, wiki_url, note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING",
          [person.id, nullable(event.year), nullable(event.month), nullable(event.day), event.type, event.tags ?? [], event.weight ?? 0, event.label, event.wikiUrl, event.note ?? ""],
        );
      }
      for (const [ids, unionType] of [[spouseIds, "marriage"], [partnerIds, "partner"]]) {
        for (const otherId of ids) {
          const [personA, personB] = [person.id, otherId].sort();
          await client.query(
            "INSERT INTO person_unions (person_a_id, person_b_id, union_type) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
            [personA, personB, unionType],
          );
        }
      }
    }
    await client.query("COMMIT");
    console.log(`Seeded ${people.length} people.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
