import fs from "node:fs";
import path from "node:path";

const directory = "src/data/people";
const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
const files = new Map();
const byId = new Map();

for (const filename of manifest.files) {
  const filePath = path.join(directory, filename);
  const people = JSON.parse(fs.readFileSync(filePath, "utf8"));
  files.set(filePath, people);
  for (const person of people) byId.set(person.id, person);
}

const source = "https://en.wikipedia.org/wiki/Frederick_Barbarossa";
const event = (year, type, tags, label, labelCn, weight, note, wikiUrl = source) => ({ year, type, tags, weight, label, labelCn, wikiUrl, note });
const ratings = {
  "45baa722-7fe8-4c5c-b533-e37544328a75": 4,
  "c3b0687b-179f-47b6-9ea7-ccfea2629c05": 4,
  "4447ca0f-a12f-494a-95ee-9875ff063099": 6,
  "966b3670-1197-4552-b765-7cdc54455363": 3,
  "58f15fda-c80f-4439-876b-ff4f047da3b2": 6,
  "3a26b97e-3345-4100-801e-3d5deb589bd6": 5,
  "6c8157b1-bdab-4012-afcd-b4e817686195": 3,
  "0bd54372-1bb7-4d4e-8281-e8834a3bdedc": 3,
  "a4797c56-9e7d-42ad-bcce-653c8dd42eb6": 4,
};

for (const [id, rating] of Object.entries(ratings)) {
  const person = byId.get(id);
  if (!person) throw new Error(`Missing ${id}`);
  person.historicalRating = rating;
  person.importanceScore = rating * 10;
}

const frederick = byId.get("4447ca0f-a12f-494a-95ee-9875ff063099");
frederick.events.push(
  event(1190, "government", ["crusade", "commander"], "Assumed command of the German crusader contingent", "接掌德意志十字军队伍指挥权", 80, "After Frederick I's death, he led the remaining German force toward the Levant."),
  event(1190, "crusade", ["crusade", "campaign"], "Reached Acre with the remaining German crusaders", "率余部抵达阿卡", 76, "The depleted German contingent joined the siege of Acre in the autumn of 1190.")
);

const otto = byId.get("58f15fda-c80f-4439-876b-ff4f047da3b2");
otto.events.push(
  event(1190, "marriage", ["marriage", "dynastic_alliance"], "Married Margaret of Blois", "与布卢瓦的玛格丽特成婚", 72, "The marriage linked the Burgundian count to the Blois-Champagne family.", "https://www.deutsche-biographie.de/sfz74124.html"),
  event(1196, "title_acquired", ["title", "territory"], "Became Count of Luxembourg", "成为卢森堡伯爵", 72, "He briefly held the County of Luxembourg from 1196 to 1197.", "https://en.wikipedia.org/wiki/Otto_I,_Count_of_Burgundy")
);

for (const [filePath, people] of files) fs.writeFileSync(filePath, `${JSON.stringify(people, null, 2)}\n`);
console.log("Rebalanced ratings and added two events each for Frederick VI and Otto I.");
