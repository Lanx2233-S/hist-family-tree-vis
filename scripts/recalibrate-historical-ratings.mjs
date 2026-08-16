import fs from "node:fs";

const dataFile = new URL("../people.normandy.json", import.meta.url);
const logFile = new URL("../people-entry-log.md", import.meta.url);
const people = JSON.parse(fs.readFileSync(dataFile, "utf8"));

const overrides = {
  "Henry VII": 9,
  "Richard I": 10,
  "William II": 8,
  "Henry I": 8,
  "Empress Matilda": 8,
  "John": 8,
  "Edward the Black Prince": 8,
  "Henry IV": 8,
  "Edward IV": 8,
  "Rollo": 8,
  "Edmund II": 8,
  "Saint Margaret of Scotland": 8,
  "Matilda of Scotland": 8,
  "Elizabeth of York": 8,
  "Pepin the Short": 8,
  "Henry II": 8,
  "Roger Mortimer": 7,
  "Richard of York": 7,
  "Geoffroy V": 7,
  "Guilhem IX": 7,
  "Henry the Young King": 7,
  "Edward II": 7,
  "Richard II": 7,
  "John of Gaunt": 7,
  "Henry VI": 7,
};
for (const person of people) if (overrides[person.displayName] !== undefined) person.historicalRating = overrides[person.displayName];
fs.writeFileSync(dataFile, `${JSON.stringify(people, null, 2)}\n`);

let log = fs.readFileSync(logFile, "utf8");
const byUuid = new Map(people.map((person) => [person.id, person.historicalRating]));
log = log.split("\n").map((line) => {
  if (!/^\| \d+ \|/.test(line) || line.includes("评分")) return line;
  const uuid = line.match(/`([0-9a-f-]{36})`/i)?.[1];
  const rating = uuid ? byUuid.get(uuid) : undefined;
  return rating === undefined ? line : line.replace(/\| \d+星 \|$/, `| ${rating}星 |`);
}).join("\n");
const start = log.indexOf("## 历史评分与人物卡填充规则");
if (start >= 0) log = log.slice(0, start).trimEnd();
const count = (predicate) => people.filter(predicate).length;
log += `\n\n## 历史评分与人物卡填充规则\n\n- 字段：\`historicalRating\`，范围 0–10 星；评分是“史料详细度 + 后世影响力 + 英语国家/国际公众知名度”的综合判断。\n- **10 星：国民级/世界级知名度**。普通公众通常无需历史专业背景即可识别；人物、事件或时代已进入国家级公共记忆。必须同时具备极高史料可见度与跨世代影响力。\n- **9 星：国家级知名度或文明史级影响力**。在本国公众、学校教育和主流文化中高度可识别；或对国家/王朝/欧洲史产生决定性影响，但大众知名度略低于 10 星。\n- **8 星：广为人知的核心历史人物**。在本国及历史爱好者中稳定知名，史料和影响力都很强，但通常不是全民级文化符号。\n- **7 星：重要专业史人物**。对王朝、战争、制度或谱系有明显影响，史料较充足；公众知名度有限，主要由受教育群体或专业读者识别。\n- **6 星：区域或专题关键人物**。对某一地区、家族或政治阶段有实质影响，资料可支撑基本人物卡，但后世传播范围较窄。\n- **5 星：值得完整录入的人物**。有可靠身份和可整理的生平，且对当前家谱主线有明确价值；优先补齐基本事件、称号和关系。\n- **4 星：资料或影响力有限**。可以保留基本身份和关系，人物卡使用普通边框，作为待补充档案。\n- **3 星：低知名度或资料稀疏**。仅保留能确认的基础信息，人物卡不填充边框，使用虚线空卡。\n- **2 星：边缘记录人物**。史料极少、身份或事迹有限，仅在家谱关系确有必要时保留。\n- **1 星：极弱证据人物**。只保留最小身份记录，并在来源说明中标注不确定性。\n- **0 星：夭折婴儿、幼年死亡且几乎无独立历史影响者**。仅用于保持亲子关系完整。\n- 人物卡规则：0–3 星为空卡；4 星为普通边框；5–10 星为填充边框。\n- 新增人物规则：每次录入优先保证 5 星及以上人物的姓名、年代、关系、称号和主要事件完整；低于 5 星者先保留可核实的最小字段。\n\n| 统计 | 数量 |\n|---|---:|\n| 总人物 | ${people.length} |\n| 10 星 | ${count((p) => p.historicalRating === 10)} |\n| 9 星 | ${count((p) => p.historicalRating === 9)} |\n| 8 星 | ${count((p) => p.historicalRating === 8)} |\n| 7 星 | ${count((p) => p.historicalRating === 7)} |\n| 6 星 | ${count((p) => p.historicalRating === 6)} |\n| 5 星及以上 | ${count((p) => p.historicalRating >= 5)} |\n| 0–3 星空卡 | ${count((p) => p.historicalRating < 4)} |\n`;
fs.writeFileSync(logFile, log);
console.log(JSON.stringify(Object.fromEntries([...Array(11).keys()].reverse().map((rating) => [rating, count((p) => p.historicalRating === rating)])), null, 2));
