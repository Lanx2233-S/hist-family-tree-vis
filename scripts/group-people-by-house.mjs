import fs from "node:fs";
import path from "node:path";

const directory = "src/data/people";
const manifestPath = path.join(directory, "manifest.json");
const indexPath = path.join(directory, "index.ts");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const sourceFiles = manifest.files;
const groups = new Map();

for (const file of sourceFiles) {
  const source = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  const people = Array.isArray(source) ? source : source.people;
  if (!Array.isArray(people)) throw new Error(`${file} is not a people array`);
  for (const person of people) {
    if (!person.house) throw new Error(`${person.fullName} has no house`);
    const group = groups.get(person.house) ?? [];
    group.push(person);
    groups.set(person.house, group);
  }
}

const slug = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const camel = (value) => value.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());

const used = new Set();
const entries = [...groups.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([house, people]) => {
    const root = `house-${slug(house)}`;
    let filename = `${root}.json`;
    let suffix = 2;
    while (used.has(filename)) filename = `${root}-${suffix++}.json`;
    used.add(filename);
    return { house, people, filename, variable: camel(filename.replace(/\.json$/, "")) };
  });

for (const entry of entries) {
  fs.writeFileSync(path.join(directory, entry.filename), `${JSON.stringify(entry.people, null, 2)}\n`);
}

const targetFiles = new Set(entries.map((entry) => entry.filename));
for (const file of sourceFiles) {
  const target = path.join(directory, file);
  if (!targetFiles.has(file) && fs.existsSync(target)) fs.unlinkSync(target);
}

manifest.files = entries.map((entry) => entry.filename);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const imports = entries.map((entry) => `import ${entry.variable} from "./${entry.filename}";`).join("\n");
const arrays = entries.map((entry) => `...${entry.variable}`).join(", ");
const index = `import type { Person } from "../../types";\n${imports}\n\n/** House-grouped source data; manifest.order preserves the UI's historical ordering. */\nimport manifest from "./manifest.json";\nconst ORIGINAL_ORDER: string[] = manifest.order;\n\nconst all = [${arrays}];\nconst byId = new Map<string, Person>();\nfor (const record of all) byId.set(record.id, record as Person);\n\nconst ordered = ORIGINAL_ORDER.map((id) => byId.get(id)).filter((p): p is Person => p !== undefined);\nconst extras = [...byId.values()].filter((p) => !ORIGINAL_ORDER.includes(p.id));\nif (extras.length > 0) console.warn(\`[data/people] \${extras.length} person(s) not in ORIGINAL_ORDER — appended at end.\`);\n\nexport const people: Person[] = [...ordered, ...extras];\nexport default people;\n`;
fs.writeFileSync(indexPath, index);

console.log(`Grouped ${[...groups.values()].flat().length} people into ${entries.length} house files.`);
