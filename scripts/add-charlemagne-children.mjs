import crypto from "node:crypto";
import fs from "node:fs";

const root = new URL("..", import.meta.url);
const dataFile = new URL("../people.normandy.json", import.meta.url);
const mapFile = new URL("../id-uuid-mapping.backup.json", import.meta.url);
const logFile = new URL("../people-entry-log.md", import.meta.url);
const people = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const backup = JSON.parse(fs.readFileSync(mapFile, "utf8"));
const charlemagne = people.find((person) => person.displayName === "Charlemagne");
const existingNames = new Set(people.map((person) => person.displayName));
const entries = [
  ["Pepin the Hunchback", "驼背丕平", 769, 811, "Pepin the Hunchback", "illegitimate; mother traditionally identified as Himiltrude"],
  ["Charles the Younger", "小查理", 772, 811, "Charles the Younger", "son of Charlemagne; mother traditionally identified as Hildegard"],
  ["Adalhaid", "阿达莱德", 774, 774, "Adalhaid", "attributed daughter; mother traditionally identified as Hildegard"],
  ["Rotrude", "罗特鲁德", 775, 810, "Rotrude", "daughter of Charlemagne; mother traditionally identified as Hildegard"],
  ["Lothair", "洛泰尔", 778, 778, "Lothair", "twin of Louis the Pious; died in infancy"],
  ["Bertha", "贝尔塔", 779, 823, "Bertha", "daughter of Charlemagne; mother traditionally identified as Hildegard"],
  ["Gisela", "吉塞拉", 781, 808, "Gisela", "daughter of Charlemagne; mother traditionally identified as Hildegard"],
  ["Hildegard", "希尔德加德", 782, 783, "Hildegard", "daughter of Charlemagne; died young"],
  ["Theodrada", "特奥德拉达", 785, 844, "Theodrada", "daughter of Charlemagne; mother traditionally identified as Fastrada"],
  ["Hiltrude", "希尔特鲁德", 787, 800, "Hiltrude", "daughter of Charlemagne; mother traditionally identified as Fastrada"],
  ["Adaltrude", "阿达尔特鲁德", 790, 814, "Adaltrude", "daughter traditionally attributed to Gersuinda"],
  ["Ruothild", "鲁奥希尔德", 790, 852, "Ruothild", "daughter traditionally attributed to Madelgard"],
  ["Drogo", "德罗戈", 801, 855, "Drogo of Metz", "son traditionally attributed to Regina"],
  ["Hugh", "于格", 802, 844, "Hugh, Abbot of Saint-Quentin", "son traditionally attributed to Regina"],
  ["Theodoric", "特奥多里克", 807, 818, "Theodoric", "son traditionally attributed to Adallind"],
  ["Hruodhaid", "赫鲁奥德海德", 787, 852, "Hruodhaid", "daughter; mother not identified in Einhard's account"],
  ["Bernard", "伯纳德", 797, 818, "Bernard of Italy", "already represented in the project as Pepin of Italy's son; no duplicate created"],
];

const additions = entries.filter(([name]) => !existingNames.has(name) && name !== "Bernard");
let nextOrder = Math.max(...people.map((person) => person.createdOrder)) + 1;
const newLogRows = [];
for (let i = 0; i < additions.length; i += 1) {
  const [name, nameCn, birthYear, deathYear, wikiName, note] = additions[i];
  const id = `20260817${String(35 + i).padStart(3, "0")}`;
  const uuid = crypto.randomUUID();
  const person = {
    id: uuid, firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" "), displayName: name,
    fullName: name, nickname: "", alsoKnownAs: [], nicknameTags: [], displayNameCn: nameCn, fullNameCn: nameCn,
    birthYear, deathYear, birthPlace: "", deathPlace: "", gender: "unknown", dynasty: "Carolingian dynasty",
    house: "Carolingian dynasty", culture: "Frankish", faith: "Catholic", primaryTitle: "", titles: [], tags: ["noble"],
    rank: "noble", importanceScore: 35, relationships: { fatherId: charlemagne.id, motherId: "", spouseIds: [], partnerIds: [], childIds: [] },
    events: [], wikiUrl: `https://en.wikipedia.org/wiki/${wikiName.replaceAll(" ", "_")}`, portraitUrl: "", sourceUrl: `https://en.wikipedia.org/wiki/${wikiName.replaceAll(" ", "_")}`,
    sourceNote: `Child of Charlemagne. ${note}.`, notes: "Added in the Charlemagne children expansion; spouse and partner data intentionally omitted.", createdDate: "20260817", createdOrder: nextOrder++,
  };
  people.push(person); charlemagne.relationships.childIds.push(uuid); backup.mapping[id] = uuid; newLogRows.push(`| ${35 + i} | ${name} | ${nameCn} | \`${id}\` | \`${uuid}\` |`);
}

fs.writeFileSync(dataFile, `${JSON.stringify(people, null, 2)}\n`);
backup.count = Object.keys(backup.mapping).length; backup.generatedAt = new Date().toISOString();
fs.writeFileSync(mapFile, `${JSON.stringify(backup, null, 2)}\n`);
const log = fs.readFileSync(logFile, "utf8").trimEnd();
const section = `\n\n## 2026-08-17（查理曼子女补录）\n\n| 序号 | 英文 / Latin spelling | 中文 | 自定义 ID | UUID |\n|---:|---|---|---|---|\n${newLogRows.join("\n")}\n`;
fs.writeFileSync(logFile, `${log}${section}`);
console.log(`Added ${additions.length} people; existing Bernard was not duplicated.`);
