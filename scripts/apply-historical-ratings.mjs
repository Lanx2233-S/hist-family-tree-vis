import fs from "node:fs";

const dataFile = new URL("../people.normandy.json", import.meta.url);
const logFile = new URL("../people-entry-log.md", import.meta.url);
const people = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const overrides = new Map([["Charlemagne", 10], ["Philippe II Augustus", 9], ["Philip II", 9]]);
for (const person of people) {
  const lifespan = person.birthYear !== "" && person.deathYear !== "" ? person.deathYear - person.birthYear : 99;
  const infant = lifespan <= 2;
  person.historicalRating = infant ? 0 : overrides.get(person.displayName) ?? Math.max(0, Math.min(10, Math.round((person.importanceScore ?? 0) / 10)));
}
fs.writeFileSync(dataFile, `${JSON.stringify(people, null, 2)}\n`);

const byUuid = new Map(people.map((person) => [person.id, person.historicalRating]));
let log = fs.readFileSync(logFile, "utf8");
log = log.split("\n").map((line) => {
  if (!/^\| \d+ \|/.test(line) || line.includes("评分")) return line;
  const uuid = line.match(/`([0-9a-f-]{36})`/i)?.[1];
  const rating = uuid ? byUuid.get(uuid) : undefined;
  return rating === undefined ? line : `${line.slice(0, -1)} ${rating}星 |`;
}).join("\n");
log += `\n\n## 历史评分与人物卡填充规则\n\n- 字段：\`historicalRating\`，范围 0–10 星。\n- 评分依据：现存史料详细度与后世历史影响力综合判断。\n- 10 星：查理曼级别；9 星：腓力二世·奥古斯都级别。\n- 夭折婴儿统一为 0 星。\n- 0–3 星：人物卡保留，但边框不填充，使用虚线空卡。\n- 4 星：保留普通边框，作为待补充档案。\n- 5–10 星：填充人物卡边框；每次新增人物优先保证 5 星及以上人物的资料完整。\n\n| 统计 | 数量 |\n|---|---:|\n| 总人物 | ${people.length} |\n| 5 星及以上 | ${people.filter((person) => person.historicalRating >= 5).length} |\n| 0–3 星空卡 | ${people.filter((person) => person.historicalRating < 4).length} |\n`;
fs.writeFileSync(logFile, log);
console.log(`Rated ${people.length} people and updated the entry log.`);
