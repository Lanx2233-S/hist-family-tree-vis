import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const peopleDir = "src/data/people";
const dynasty = "Plantagenet dynasty";
const lancasterIds = new Set([
  "99624b56-5c00-405f-83c3-d7ff73eb4bb9", // John of Gaunt
  "2254ea97-3d35-4264-a60e-3b9e9f78eaab", // Henry IV
  "631cfa58-52bf-4273-b3b5-38ae2abed850", // Henry V
  "0a1a85b3-53e9-45fa-a90f-2b07d78191c4", // Henry VI
]);
const yorkIds = new Set([
  "1299a0d9-153e-4a1d-a90f-27ae608c44ae", // Richard of York
  "423d8a6a-a3f5-4502-abc7-5b6943dcfac6", // Edward IV
  "738a5858-9506-4f77-b5ed-7539c01d7bbc", // Edward V
]);
const richardIII = "62f8458b-9497-45fd-8ccc-7930f38c7ae8";

const plantagenet = read(`${peopleDir}/plantagenet.json`);
const york = read(`${peopleDir}/york.json`);
const other = read(`${peopleDir}/other.json`);
const decorate = (person, house) => ({ ...person, dynasty, house });

const lancaster = plantagenet.filter((person) => lancasterIds.has(person.id)).map((person) => decorate(person, "House of Lancaster"));
const yorkFromPlantagenet = plantagenet.filter((person) => yorkIds.has(person.id)).map((person) => decorate(person, "House of York"));
const richard = other.find((person) => person.id === richardIII);
if (!richard) throw new Error("Richard III not found in other.json");

const main = plantagenet
  .filter((person) => !lancasterIds.has(person.id) && !yorkIds.has(person.id))
  .map((person) => decorate(person, "House of Plantagenet"));
const yorkMerged = [
  ...york.filter((person) => !yorkIds.has(person.id) && person.id !== richardIII).map((person) => decorate(person, "House of York")),
  ...yorkFromPlantagenet,
  decorate(richard, "House of York"),
];

write(`${peopleDir}/plantagenet.json`, main);
write(`${peopleDir}/lancaster.json`, lancaster);
write(`${peopleDir}/york.json`, yorkMerged);
write(`${peopleDir}/other.json`, other.filter((person) => person.id !== richardIII));

console.log(`Plantagenet split: main=${main.length}, Lancaster=${lancaster.length}, York=${yorkMerged.length}.`);
