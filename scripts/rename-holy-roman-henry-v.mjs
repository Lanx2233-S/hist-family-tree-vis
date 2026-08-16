import fs from "node:fs";

const dataFile = new URL("../people.normandy.json", import.meta.url);
const logFile = new URL("../people-entry-log.md", import.meta.url);
const people = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const person = people.find((item) => item.fullName === "Henry V, Holy Roman Emperor");
if (!person) throw new Error("Holy Roman Emperor Henry V not found");
person.firstName = "Heinrich";
person.displayName = "Heinrich V";
person.fullName = "Heinrich V, Holy Roman Emperor";
person.displayNameCn = "海因里希五世";
person.fullNameCn = "神圣罗马帝国皇帝海因里希五世";
person.wikiUrl = "https://en.wikipedia.org/wiki/Henry_V,_Holy_Roman_Emperor";
person.sourceUrl = person.wikiUrl;
fs.writeFileSync(dataFile, `${JSON.stringify(people, null, 2)}\n`);

let log = fs.readFileSync(logFile, "utf8");
log = log.replaceAll("| Henry V | 亨利五世 | `12H260815E018`", "| Heinrich V | 海因里希五世 | `12H260815E018`");
fs.writeFileSync(logFile, log);
console.log(`Renamed ${person.id} to ${person.displayName}（${person.displayNameCn}）.`);
