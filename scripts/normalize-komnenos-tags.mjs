import fs from "node:fs";
const file = "src/data/people/house-house-of-komnenos.json";
const people = JSON.parse(fs.readFileSync(file, "utf8"));
for (const person of people) for (const event of person.events) {
  event.tags = event.tags.filter((tag) => tag !== "war" && tag !== "siege" && tag !== "reform");
  if (event.type === "siege") event.type = "battle";
  if (event.label.includes("siege") || event.labelCn.includes("要塞")) event.tags.push("battle");
  if (event.label.includes("administration") || event.labelCn.includes("行政")) event.tags.push("government");
  event.tags = [...new Set(event.tags)];
}
fs.writeFileSync(file, `${JSON.stringify(people, null, 2)}\n`);
