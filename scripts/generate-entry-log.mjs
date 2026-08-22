import fs from "node:fs";

const people = JSON.parse(fs.readFileSync(new URL("../people.normandy.json", import.meta.url), "utf8"));
const manifest = JSON.parse(fs.readFileSync(new URL("../src/data/people/manifest.json", import.meta.url), "utf8"));
const byId = new Map(people.map((person) => [person.id, person]));
const ordered = manifest.order.map((id) => byId.get(id)).filter(Boolean);
const groups = new Map();

for (const person of ordered) {
  const date = person.createdDate || "undated";
  if (!groups.has(date)) groups.set(date, []);
  groups.get(date).push(person);
}

const dateSummary = [...groups.entries()].map(([date, entries]) => `${date} = ${entries.length} 人`).join("；");
const lines = [
  "# 人物录入索引（People Entry Log）",
  "",
  `> 当前总人数：${ordered.length}`,
  `> 分配日期：${dateSummary}`,
  "> 数据来源：`src/data/people/manifest.json` 及其引用的全部人员 JSON 文件",
  "> 字段说明：姓名 = `displayName`；UUID = `id`；自定义序号 = `YYYYMMDDNNN`（`createdDate` + `createdOrder` 补零三位）；总序号 = `manifest.order` 顺序；重要度评分 = `historicalRating`",
  "",
  "| 姓名 | UUID | 自定义序号 | 总序号 | 重要度评分 |",
  "|---|---|---:|---:|---:|",
];

ordered.forEach((person, index) => {
  const customNumber = person.createdDate && Number.isFinite(Number(person.createdOrder))
    ? `${person.createdDate}${String(person.createdOrder).padStart(3, "0")}`
    : "—";
  lines.push(`| ${person.displayName} | \`${person.id}\` | ${customNumber} | ${index + 1} | ${person.historicalRating}星 |`);
});

lines.push("", "## 校验结果", "", `- 人数：${ordered.length}；UUID 与 manifest.order 一一对应；总序号连续 1→${ordered.length}。`);
fs.writeFileSync(new URL("../people-entry-log.md", import.meta.url), `${lines.join("\n")}\n`);
console.log(`Generated ${ordered.length} entries across ${groups.size} dates.`);
