import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const peopleDir = path.join(root, "src/data/people");
const stagingPath = path.join(root, "temporary-person-research.md");
const manifestPath = path.join(peopleDir, "manifest.json");
const indexPath = path.join(peopleDir, "index.ts");
const staging = fs.readFileSync(stagingPath, "utf8");
if (process.argv.includes("--clear-staging")) {
  const marker = "## User paste staging area — agent clears this after completing the matching person-card task";
  const at = staging.indexOf(marker);
  if (at < 0) throw new Error("Staging area marker not found");
  fs.writeFileSync(stagingPath, `${staging.slice(0, at + marker.length)}\n`);
  console.log("Cleared User paste staging area.");
  process.exit(0);
}
const records = JSON.parse(staging.slice(staging.indexOf("[\n  {", staging.indexOf("## User paste staging area"))));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const files = Object.fromEntries(manifest.files.map((file) => [file, JSON.parse(fs.readFileSync(path.join(peopleDir, file), "utf8"))]));
const people = Object.values(files).flat();
const byId = new Map(people.map((p) => [p.id, p]));

const existingByCanonical = new Map([["John of Bohemia", "581b42bc-541c-4083-aefb-5dd9e2249430"]]);
const route = {
  "Henry V the Blond": "house-house-of-luxembourg.json", "Henry VI of Luxembourg": "house-house-of-luxembourg.json",
  "John Henry of Moravia": "house-house-of-luxembourg.json", "Jobst of Moravia": "house-house-of-luxembourg.json",
  "John of Görlitz": "house-house-of-luxembourg.json", "Elisabeth of Görlitz": "house-house-of-luxembourg.json",
  "Margaret of Bar": "house-house-of-bar.json", "Beatrice of Avesnes": "house-house-of-avesnes.json",
  "Margaret of Brabant": "house-house-of-leuven.json", "Elisabeth of Bohemia": "house-house-of-premyslid.json",
  "Anna of Świdnica": "house-silesian-piasts-swidnica-jawor-branch.json", "Elisabeth of Pomerania": "house-house-of-griffin-pomerania-stolp-branch.json",
};
const established = {
  "Henry VII, Holy Roman Emperor": "ec618819-cd33-44bb-b8f8-fb50e97cbdb9", "Charles IV, Holy Roman Emperor": "80b3801a-ffca-4136-ba92-293b6b976e85",
  "Wenceslaus IV of Bohemia": "3d893516-a8da-469f-a546-67c603ec62e2", "Sigismund, Holy Roman Emperor": "7b1aea91-a048-4a69-bacd-b6f0358bf573",
  "Anne of Bohemia": "d8867112-cd68-4100-91e2-f42de19d273c", "Antony, Duke of Brabant": "c1015000-0000-4000-8000-000000000000",
  "John I, Duke of Brabant": "c1010000-0000-4000-8000-000000000000",
};
const ids = Object.fromEntries(records.map((record) => [record.canonicalName, existingByCanonical.get(record.canonicalName) ?? record.id]));

for (const record of records) {
  const terms = new Set([record.canonicalName, ...record.alsoKnownAs].map((x) => x.toLowerCase()));
  const hits = people.filter((p) => terms.has(p.displayName.toLowerCase()) || terms.has(p.fullName.toLowerCase()) || p.alsoKnownAs?.some((x) => terms.has(x.toLowerCase())) || (p.birthYear === record.birthYear && p.deathYear === record.deathYear && p.primaryTitle === record.primaryTitle));
  if (existingByCanonical.has(record.canonicalName)) {
    if (!hits.some((p) => p.id === existingByCanonical.get(record.canonicalName))) throw new Error(`Expected reuse target missing: ${record.canonicalName}`);
  } else if (hits.length) throw new Error(`Duplicate candidate for ${record.canonicalName}: ${hits.map((p) => p.id).join(", ")}`);
}

function lineage(record) {
  if (record.canonicalName === "Margaret of Brabant") return ["Reginar dynasty", "House of Leuven"];
  if (record.canonicalName === "Anna of Świdnica") return ["Piast dynasty", "Silesian Piasts, Świdnica-Jawor branch"];
  if (record.canonicalName === "Elisabeth of Pomerania") return ["Griffin dynasty", "House of Griffin, Pomerania-Stolp branch"];
  if (record.canonicalName === "Elisabeth of Bohemia") return ["Přemyslid dynasty", "House of Přemyslid"];
  if (record.canonicalName === "Margaret of Bar") return ["Scarponnois dynasty", "House of Bar"];
  if (record.canonicalName === "Beatrice of Avesnes") return ["Avesnes dynasty", "House of Avesnes"];
  return ["Luxembourg dynasty", "House of Luxembourg"];
}
function tags(record) {
  const title = record.primaryTitle.toLowerCase();
  if (title.includes("empress")) return ["empress", "consort", "noble"];
  if (title.includes("queen")) return ["queen", "consort", "noble"];
  if (title.includes("king")) return ["monarch", "king", "noble"];
  if (title.includes("duke") || title.includes("margrave")) return ["duke", "noble"];
  if (title.includes("count")) return ["count", "noble"];
  return ["noble"];
}
function rank(record) {
  const title = record.primaryTitle.toLowerCase();
  if (title.includes("empress")) return "empress";
  if (title.includes("queen")) return "queen";
  if (title.includes("king")) return "king";
  if (title.includes("duke") || title.includes("margrave")) return "duke";
  if (title.includes("count")) return "count";
  return "noble";
}
function unlinked(record) {
  const linked = new Set(Object.keys(ids).concat(Object.keys(established)));
  const names = [record.familyByName.father, record.familyByName.mother, ...record.familyByName.spouses, ...record.familyByName.children].filter((name) => name && !linked.has(name));
  return names.length ? `\n\nUnlinked family: ${names.map((name) => `${name} (not uniquely matched in the roster)`).join("; ")}.` : "";
}
function card(record) {
  const [dynasty, house] = lineage(record);
  const deathCause = record.deathCause ? { kind: record.deathCause === "killed in battle" ? "violent" : "normal", summary: record.deathCause, summaryCn: record.deathCauseCn, detail: record.deathCause, detailCn: record.deathCauseCn, wikiUrl: record.sourceUrl } : undefined;
  return { id: record.id, firstName: record.canonicalName.split(" ")[0], lastName: "", displayName: record.canonicalName, fullName: record.fullName, nickname: "", alsoKnownAs: record.alsoKnownAs, nicknameTags: [], displayNameCn: record.displayNameCn, fullNameCn: record.fullNameCn, nicknameCn: "", birthYear: record.birthYear ?? "", deathYear: record.deathYear ?? "", birthPlace: record.birthPlace, birthPlaceCn: record.birthPlaceCn, deathPlace: record.deathPlace, deathPlaceCn: record.deathPlaceCn, gender: record.gender, dynasty, house, culture: record.culture, faith: record.faith, primaryTitle: record.primaryTitle, primaryTitleCn: record.primaryTitleCn, titles: record.titles, tags: tags(record), rank: rank(record), importanceScore: record.importanceScore, historicalRating: record.historicalRating, relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] }, events: record.events, wikiUrl: record.sourceUrl, portraitUrl: "", sourceUrl: record.sourceUrl, sourceNote: record.sourceNote, notes: `${record.notes}\n\nConfidence / caveats: ${record.confidenceCaveats}${unlinked(record)}`, createdDate: "20260823", deathCause };
}
for (const record of records) if (!existingByCanonical.has(record.canonicalName)) {
  const file = route[record.canonicalName]; if (!files[file]) { files[file] = []; manifest.files.push(file); }
  files[file].push(card(record)); byId.set(record.id, files[file].at(-1)); manifest.order.push(record.id);
}
function relate(child, father = "", mother = "", spouses = [], children = []) {
  const p = byId.get(child); if (!p) throw new Error(`Missing relationship target ${child}`);
  if (father) { p.relationships.fatherId = father; const parent = byId.get(father); if (!parent.relationships.childIds.includes(child)) parent.relationships.childIds.push(child); }
  if (mother) { p.relationships.motherId = mother; const parent = byId.get(mother); if (!parent.relationships.childIds.includes(child)) parent.relationships.childIds.push(child); }
  for (const spouse of spouses) { if (!p.relationships.spouseIds.includes(spouse)) p.relationships.spouseIds.push(spouse); const q = byId.get(spouse); if (!q.relationships.spouseIds.includes(child)) q.relationships.spouseIds.push(child); }
  for (const kid of children) { if (!p.relationships.childIds.includes(kid)) p.relationships.childIds.push(kid); const q = byId.get(kid); if (!q.relationships.fatherId && p.gender === "male") q.relationships.fatherId = child; if (!q.relationships.motherId && p.gender === "female") q.relationships.motherId = child; }
}
relate(ids["Henry V the Blond"], "", "", [ids["Margaret of Bar"]], [ids["Henry VI of Luxembourg"]]);
relate(ids["Margaret of Bar"], "", "", [ids["Henry V the Blond"]], [ids["Henry VI of Luxembourg"]]);
relate(ids["Henry VI of Luxembourg"], ids["Henry V the Blond"], ids["Margaret of Bar"], [ids["Beatrice of Avesnes"]], [established["Henry VII, Holy Roman Emperor"]]);
relate(ids["Beatrice of Avesnes"], "", "", [ids["Henry VI of Luxembourg"]], [established["Henry VII, Holy Roman Emperor"]]);
relate(ids["Margaret of Brabant"], established["John I, Duke of Brabant"], "", [established["Henry VII, Holy Roman Emperor"]], [ids["John of Bohemia"]]);
relate(ids["John of Bohemia"], established["Henry VII, Holy Roman Emperor"], ids["Margaret of Brabant"], [ids["Elisabeth of Bohemia"]], [established["Charles IV, Holy Roman Emperor"], ids["John Henry of Moravia"]]);
relate(ids["Elisabeth of Bohemia"], "", "", [ids["John of Bohemia"]], [established["Charles IV, Holy Roman Emperor"], ids["John Henry of Moravia"]]);
relate(ids["John Henry of Moravia"], ids["John of Bohemia"], ids["Elisabeth of Bohemia"], [], [ids["Jobst of Moravia"]]);
relate(ids["Jobst of Moravia"], ids["John Henry of Moravia"]);
relate(ids["Anna of Świdnica"], "", "", [established["Charles IV, Holy Roman Emperor"]], [established["Wenceslaus IV of Bohemia"]]);
relate(ids["Elisabeth of Pomerania"], "", "", [established["Charles IV, Holy Roman Emperor"]], [established["Anne of Bohemia"], established["Sigismund, Holy Roman Emperor"], ids["John of Görlitz"]]);
relate(ids["John of Görlitz"], established["Charles IV, Holy Roman Emperor"], ids["Elisabeth of Pomerania"], [], [ids["Elisabeth of Görlitz"]]);
relate(ids["Elisabeth of Görlitz"], ids["John of Görlitz"], "", [established["Antony, Duke of Brabant"]]);

const john = byId.get(ids["John of Bohemia"]); const source = records.find((r) => r.canonicalName === "John of Bohemia");
john.events = [...john.events, ...source.events]; john.notes = `${john.notes}\n\nResearch intake retained: ${source.notes}\n\nConfidence / caveats: ${source.confidenceCaveats}${unlinked(source)}`;
for (const [file, entries] of Object.entries(files)) fs.writeFileSync(path.join(peopleDir, file), `${JSON.stringify(entries, null, 2)}\n`);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
let index = fs.readFileSync(indexPath, "utf8");
for (const file of manifest.files) { const variable = file.replace(/\.json$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()); if (!index.includes(`from "./${file}"`)) index = index.replace('/** House-grouped source data;', `import ${variable} from "./${file}";\n\n/** House-grouped source data;`); }
const allNames = manifest.files.map((file) => file.replace(/\.json$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
index = index.replace(/const all = \[[\s\S]*?\];/, `const all = [${allNames.map((name) => `...${name}`).join(", ")}];`);
fs.writeFileSync(indexPath, index);
console.log(`Imported ${records.length - 1} new cards; reused John of Bohemia.`);
