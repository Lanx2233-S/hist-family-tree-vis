import fs from "node:fs";
import path from "node:path";

const directory = "src/data/people";
const manifestPath = path.join(directory, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const byId = new Map();
const files = new Map();

for (const filename of manifest.files) {
  const filePath = path.join(directory, filename);
  const people = JSON.parse(fs.readFileSync(filePath, "utf8"));
  files.set(filePath, people);
  for (const person of people) byId.set(person.id, person);
}

const perDate = new Map();
for (const id of manifest.order) {
  const person = byId.get(id);
  if (!person) throw new Error(`manifest.order references missing person ${id}`);
  if (!/^\d{8}$/.test(String(person.createdDate))) throw new Error(`${person.displayName} has invalid createdDate`);
  const next = (perDate.get(person.createdDate) ?? 0) + 1;
  perDate.set(person.createdDate, next);
  person.createdOrder = next;
}

for (const [filePath, people] of files) fs.writeFileSync(filePath, `${JSON.stringify(people, null, 2)}\n`);
console.log(`Reindexed ${manifest.order.length} people across ${perDate.size} dates by manifest.order.`);
