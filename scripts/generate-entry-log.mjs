import fs from "node:fs";

const people = JSON.parse(fs.readFileSync(new URL("../people.normandy.json", import.meta.url), "utf8"));
const backup = JSON.parse(fs.readFileSync(new URL("../id-uuid-mapping.backup.json", import.meta.url), "utf8"));
const mappedIds = new Set(Object.keys(backup.mapping));
const groups = new Map();

for (const person of people) {
  if (!mappedIds.has(person.id)) continue;
  const match = person.id.match(/^\d{2}[A-Z](\d{6})/);
  if (!match) throw new Error(`Cannot decode entry date from ${person.id}`);
  const raw = match[1];
  const date = `20${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4, 6)}`;
  if (!groups.has(date)) groups.set(date, []);
  groups.get(date).push(person);
}

const lines = [
  "# 人物录入日志",
  "",
  "> 来源：`id-uuid-mapping.backup.json` 对应的全部人物。日期从自定义 ID 的日期段解析，格式为 `YYYY-MM-DD`；姓名以英文拉丁拼写为主，附中文名。",
  "",
  `共 ${mappedIds.size} 人，${groups.size} 个录入日。`,
  "",
];

for (const date of [...groups.keys()].sort()) {
  const entries = groups.get(date);
  lines.push(`## ${date}`, "", "| 序号 | 英文 / Latin spelling | 中文 | 自定义 ID | UUID |", "|---:|---|---|---|---|");
  entries.forEach((person, index) => {
    lines.push(`| ${index + 1} | ${person.displayName} | ${person.displayNameCn || "—"} | \`${person.id}\` | \`${backup.mapping[person.id]}\` |`);
  });
  lines.push("");
}

fs.writeFileSync(new URL("../people-entry-log.md", import.meta.url), `${lines.join("\n")}\n`);
console.log(`Generated ${mappedIds.size} entries across ${groups.size} dates.`);
