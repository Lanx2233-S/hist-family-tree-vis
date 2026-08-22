import fs from "node:fs";
import path from "node:path";

const directory = "src/data/people";
const manifestPath = path.join(directory, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const records = new Map();
const filesById = new Map();

for (const file of manifest.files) {
  const filePath = path.join(directory, file);
  const people = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const person of people) {
    records.set(person.id, person);
    filesById.set(person.id, { filePath, people });
  }
}

const source = "https://en.wikipedia.org/wiki/Count_of_Hainaut";
const event = (year, type, label, labelCn, weight = 72, note) => ({ year, type, tags: [type, "title"], weight, label, labelCn, wikiUrl: source, ...(note ? { note } : {}) });
const hainautEvents = {
  "f1010000-0000-4000-8000-000000000001": [event(1051, "succession", "Became Countess of Hainaut", "成为埃诺女伯爵", 82), event(1071, "regency", "Continued rule with Baldwin II", "继续与鲍德温二世共同执政", 72)],
  "f1010000-0000-4000-8000-000000000002": [event(1071, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1096, "crusade", "Joined the First Crusade", "参加第一次十字军东征", 74)],
  "f1010000-0000-4000-8000-000000000003": [event(1098, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 80), event(1120, "death", "Died", "去世", 68)],
  "f1010000-0000-4000-8000-000000000004": [event(1120, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 80), event(1171, "death", "Died", "去世", 68)],
  "f1010000-0000-4000-8000-000000000005": [event(1171, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1191, "title_acquired", "Became Count of Flanders jure uxoris", "以妻权成为佛兰德伯爵", 78)],
  "f1010000-0000-4000-8000-000000000006": [event(1195, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1204, "title_acquired", "Became Latin Emperor of Constantinople", "成为君士坦丁堡拉丁皇帝", 90)],
  "f1010000-0000-4000-8000-000000000007": [event(1205, "succession", "Succeeded as Countess of Hainaut", "继承埃诺女伯爵", 82), event(1244, "death", "Died without surviving issue", "无存活子嗣而去世", 72)],
  "f1010000-0000-4000-8000-000000000008": [event(1244, "succession", "Succeeded as Countess of Hainaut", "继承埃诺女伯爵", 82), event(1246, "succession", "Hainaut awarded to the Avesnes line", "埃诺判归阿韦讷支系", 80)],
  "f1010000-0000-4000-8000-000000000009": [event(1280, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1299, "title_acquired", "Became Count of Holland and Zeeland", "成为荷兰与泽兰伯爵", 78)],
  "f1010000-0000-4000-8000-000000000010": [event(1304, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1328, "marriage", "Daughter Philippa married Edward III of England", "女儿菲利帕与英格兰的爱德华三世成婚", 74)],
  "f1010000-0000-4000-8000-000000000011": [event(1337, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1345, "death", "Died in the Battle of Warns", "在瓦尔讷斯战役中阵亡", 82)],
  "f1010000-0000-4000-8000-000000000012": [event(1345, "succession", "Succeeded as Countess of Hainaut", "继承埃诺女伯爵", 82), event(1356, "death", "Died", "去世", 68)],
  "f1010000-0000-4000-8000-000000000013": [event(1358, "regency", "Became regent during William III's incapacity", "在威廉三世失能期间出任摄政", 80), event(1389, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82)],
  "f1010000-0000-4000-8000-000000000014": [event(1404, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 82), event(1417, "death", "Died", "去世", 68)],
  "f1010000-0000-4000-8000-000000000015": [event(1417, "succession", "Succeeded as Countess of Hainaut", "继承埃诺女伯爵", 84), event(1433, "abdication", "Relinquished Hainaut to Philip the Good", "向好人腓力放弃埃诺", 88)],
};

for (const [id, events] of Object.entries(hainautEvents)) records.get(id).events = events;

const mother = records.get("f1010000-0000-4000-8000-000000000012");
const father = records.get("02a7f7ff-44ee-4cf7-b770-fe1ea9a59893");
const williamId = "f1010000-0000-4000-8000-000000000016";
const william = {
  id: williamId, firstName: "William", lastName: "of Bavaria-Straubing", displayName: "William III of Hainaut", fullName: "William III of Bavaria-Straubing, Count of Hainaut", displayNameCn: "埃诺的威廉三世", fullNameCn: "埃诺伯爵、巴伐利亚-施特劳宾的威廉三世", nickname: "the Mad", nicknameCn: "狂人", alsoKnownAs: ["William I, Duke of Bavaria"], nicknameTags: [], birthYear: 1330, deathYear: 1389, birthPlace: "Frankfurt", birthPlaceCn: "法兰克福", deathPlace: "Le Quesnoy, County of Hainaut", deathPlaceCn: "埃诺伯国勒凯努瓦", gender: "male", dynasty: "Wittelsbach dynasty", house: "House of Wittelsbach-Straubing", culture: "Flemish", faith: "Catholic", primaryTitle: "Count of Hainaut", primaryTitleCn: "埃诺伯爵", titles: [{ title: "Duke of Bavaria-Straubing", titleCn: "巴伐利亚-施特劳宾公爵", startYear: 1353, endYear: 1389 }, { title: "Count of Hainaut", titleCn: "埃诺伯爵", startYear: 1356, endYear: 1389 }], tags: ["count", "duke", "noble"], rank: "count", importanceScore: 50, historicalRating: 5, relationships: { fatherId: father.id, motherId: mother.id, spouseIds: [], partnerIds: [], childIds: [] }, events: [event(1356, "succession", "Succeeded as Count of Hainaut", "继承埃诺伯爵", 84), event(1358, "government", "Became incapacitated; Albert I began the regency", "失能后由阿尔布雷希特一世开始摄政", 80), event(1389, "death", "Died", "去世", 68)], wikiUrl: "https://en.wikipedia.org/wiki/William_I,_Duke_of_Bavaria", portraitUrl: "", sourceUrl: "https://en.wikipedia.org/wiki/William_I,_Duke_of_Bavaria", sourceNote: "William I, Duke of Bavaria; County of Hainaut ruler list.", notes: "Son of Louis IV and Margaret II of Hainaut. He inherited Hainaut in 1356; incapacity from 1358 placed his brother Albert I in regency until his death.", createdDate: "20260823", createdOrder: 534,
};

for (const person of [mother, father]) if (!person.relationships.childIds.includes(williamId)) person.relationships.childIds.push(williamId);
for (const id of ["f1010000-0000-4000-8000-000000000013", "f1010000-0000-4000-8000-000000000014", "f1010000-0000-4000-8000-000000000015"]) records.get(id).house = "House of Wittelsbach-Straubing";

const target = filesById.get("f1010000-0000-4000-8000-000000000013");
target.people.push(william);
const changedFiles = new Map();
for (const { filePath, people } of filesById.values()) changedFiles.set(filePath, people);
for (const [filePath, people] of changedFiles) fs.writeFileSync(filePath, `${JSON.stringify(people, null, 2)}\n`);
manifest.order.push(williamId);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
