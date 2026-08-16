import crypto from "node:crypto";
import fs from "node:fs";

const people = JSON.parse(fs.readFileSync(new URL("../people.normandy.json", import.meta.url), "utf8"));
const mapping = Object.fromEntries(people.map(({ id }) => [id, crypto.randomUUID()]));
const output = {
  description: "Backup mapping from legacy custom person IDs to UUID v4.",
  generatedAt: new Date().toISOString(),
  count: Object.keys(mapping).length,
  mapping,
};
fs.writeFileSync(new URL("../id-uuid-mapping.backup.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${output.count} ID mappings.`);
