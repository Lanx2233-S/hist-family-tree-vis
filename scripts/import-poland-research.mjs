import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const peopleDir = path.join(root, "src/data/people");
const stagingPath = path.join(root, "temporary-person-research.md");
const manifestPath = path.join(peopleDir, "manifest.json");
const targetFile = "house-house-of-piast.json";
const marker = "## User paste staging area — agent clears this after completing the matching person-card task";
const staging = fs.readFileSync(stagingPath, "utf8");

if (process.argv.includes("--clear-staging")) {
  const at = staging.indexOf(marker);
  if (at < 0) throw new Error("Staging area marker not found");
  fs.writeFileSync(stagingPath, `${staging.slice(0, at + marker.length)}\n`);
  console.log("Cleared User paste staging area.");
  process.exit(0);
}

const start = staging.indexOf("\n[", staging.indexOf(marker));
const end = staging.lastIndexOf("\n]");
if (start < 0 || end < start) throw new Error("Poland staging JSON not found");
const records = JSON.parse(staging.slice(start, end + 2));
if (records.length !== 21) throw new Error(`Expected 21 Poland records; found ${records.length}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const files = new Map(manifest.files.map((file) => [file, JSON.parse(fs.readFileSync(path.join(peopleDir, file), "utf8"))]));
const allPeople = [...files.values()].flat();
const byId = new Map(allPeople.map((person) => [person.id, person]));
const byName = new Map();
for (const person of allPeople) {
  for (const name of [person.displayName, person.fullName, ...(person.alsoKnownAs ?? [])]) {
    if (!name) continue;
    const key = name.toLocaleLowerCase();
    byName.set(key, [...(byName.get(key) ?? []), person]);
  }
}

for (const record of records) {
  if (byId.has(record.id)) throw new Error(`UUID already exists: ${record.id}`);
  const candidates = new Set();
  for (const name of [record.canonicalName, record.fullName, ...(record.alsoKnownAs ?? [])]) {
    for (const person of byName.get(name.toLocaleLowerCase()) ?? []) candidates.add(person);
  }
  for (const person of allPeople) {
    if (person.birthYear === (record.birthYear ?? "") && person.deathYear === (record.deathYear ?? "") && person.primaryTitle === record.primaryTitle) candidates.add(person);
  }
  if (candidates.size) throw new Error(`Duplicate candidate for ${record.canonicalName}: ${[...candidates].map((person) => person.id).join(", ")}`);
}

const ids = new Map(records.map((record) => [record.canonicalName, record.id]));
const linkedNames = new Set(records.map((record) => record.canonicalName));
const oldOrders = allPeople.filter((person) => person.createdDate === "20260827").length;

function tagAndRank(record) {
  const title = record.primaryTitle.toLocaleLowerCase();
  if (title.includes("king")) return { tags: ["monarch", "king", "noble"], rank: "king" };
  if (title.includes("duke")) return { tags: ["duke", "noble"], rank: "duke" };
  return { tags: ["noble"], rank: "noble" };
}
function deathCause(record) {
  if (!record.deathCause) return undefined;
  const violent = /murdered|assassinated|killed/i.test(record.deathCause);
  return {
    kind: violent ? "violent" : "uncertain",
    summary: record.deathCause,
    summaryCn: record.deathCauseCn || "",
    detail: record.deathCause,
    detailCn: record.deathCauseCn || "",
    wikiUrl: record.sourceUrl,
  };
}
function unlinkedFamily(record) {
  const family = record.familyByName ?? {};
  const names = [family.father, family.mother, ...(family.spouses ?? []), ...(family.children ?? [])]
    .filter((name) => name && !linkedNames.has(name));
  return names.length ? `\n\nUnlinked family: ${names.map((name) => `${name} (not uniquely matched in the roster)`).join("; ")}.` : "";
}
function card(record, index) {
  const { tags, rank } = tagAndRank(record);
  return {
    id: record.id,
    firstName: record.canonicalName.split(" ")[0],
    lastName: "",
    displayName: record.canonicalName,
    fullName: record.fullName,
    nickname: "",
    alsoKnownAs: record.alsoKnownAs ?? [],
    nicknameTags: [],
    displayNameCn: record.displayNameCn,
    fullNameCn: record.fullNameCn,
    nicknameCn: "",
    birthYear: record.birthYear ?? "",
    deathYear: record.deathYear ?? "",
    birthPlace: record.birthPlace ?? "",
    birthPlaceCn: record.birthPlaceCn ?? "",
    deathPlace: record.deathPlace ?? "",
    deathPlaceCn: record.deathPlaceCn ?? "",
    gender: record.gender,
    dynasty: "Piast dynasty",
    house: "House of Piast",
    culture: record.culture,
    faith: record.faith,
    primaryTitle: record.primaryTitle,
    primaryTitleCn: record.primaryTitleCn,
    titles: record.titles,
    tags,
    rank,
    importanceScore: record.importanceScore,
    historicalRating: record.historicalRating,
    relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] },
    events: record.events,
    wikiUrl: record.sourceUrl,
    portraitUrl: "",
    sourceUrl: record.sourceUrl,
    sourceNote: record.sourceNote,
    notes: `${record.notes}\n\nConfidence / caveats: ${record.confidenceCaveats}${unlinkedFamily(record)}`,
    createdDate: "20260827",
    createdOrder: oldOrders + index + 1,
    ...(deathCause(record) ? { deathCause: deathCause(record) } : {}),
  };
}

const piasts = records.map(card);
for (const person of piasts) byId.set(person.id, person);

function parentChild(parentName, childName) {
  const parentId = ids.get(parentName);
  const childId = ids.get(childName);
  const parent = byId.get(parentId);
  const child = byId.get(childId);
  if (!parent || !child) throw new Error(`Cannot link ${parentName} → ${childName}`);
  if (parent.gender === "male") {
    if (child.relationships.fatherId && child.relationships.fatherId !== parentId) throw new Error(`Conflicting father for ${childName}`);
    child.relationships.fatherId = parentId;
  } else {
    if (child.relationships.motherId && child.relationships.motherId !== parentId) throw new Error(`Conflicting mother for ${childName}`);
    child.relationships.motherId = parentId;
  }
  if (!parent.relationships.childIds.includes(childId)) parent.relationships.childIds.push(childId);
}

[
  ["Mieszko I", "Bolesław I the Brave"],
  ["Bolesław I the Brave", "Mieszko II Lambert"],
  ["Bolesław I the Brave", "Bezprym"],
  ["Mieszko II Lambert", "Casimir I the Restorer"],
  ["Casimir I the Restorer", "Bolesław II the Bold"],
  ["Casimir I the Restorer", "Władysław I Herman"],
  ["Władysław I Herman", "Bolesław III Wrymouth"],
  ["Bolesław III Wrymouth", "Władysław II the Exile"],
  ["Bolesław III Wrymouth", "Bolesław IV the Curly"],
  ["Bolesław III Wrymouth", "Mieszko III the Old"],
  ["Bolesław III Wrymouth", "Casimir II the Just"],
  ["Mieszko III the Old", "Władysław III Spindleshanks"],
  ["Casimir II the Just", "Leszek I the White"],
  ["Casimir II the Just", "Konrad I of Masovia"],
  ["Leszek I the White", "Bolesław V the Chaste"],
  ["Henry I the Bearded", "Henry II the Pious"],
].forEach(([parent, child]) => parentChild(parent, child));

if (files.has(targetFile)) throw new Error(`${targetFile} already exists; refusing to overwrite`);
files.set(targetFile, piasts);
manifest.files.push(targetFile);
manifest.order.push(...records.map((record) => record.id));
fs.writeFileSync(path.join(peopleDir, targetFile), `${JSON.stringify(piasts, null, 2)}\n`);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Imported ${piasts.length} Piast cards and ${16} parent-child relationships.`);
