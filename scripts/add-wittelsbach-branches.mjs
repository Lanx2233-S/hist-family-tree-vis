import fs from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const dir = `${root}src/data/people/`;
const manifestPath = `${dir}manifest.json`;
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const files = {
  palatinate: "house-house-of-wittelsbach-palatinate.json",
  landshut: "house-house-of-wittelsbach-landshut.json",
  munich: "house-house-of-wittelsbach-munich.json",
};
for (const file of Object.values(files)) {
  if (!manifest.files.includes(file)) manifest.files.push(file);
}
const loaded = Object.fromEntries(Object.values(files).map((file) => [file, fs.existsSync(`${dir}${file}`) ? JSON.parse(fs.readFileSync(`${dir}${file}`, "utf8")) : []]));
loaded["house-house-of-wittelsbach.json"] = JSON.parse(fs.readFileSync(`${dir}house-house-of-wittelsbach.json`, "utf8"));
const ids = {
  rudolf: "9d0fbaca-2e34-43ba-9082-1c737627212a",
  frederick: "b867f239-ba20-4bf0-97b7-426929b771e7",
  john: "48f1c061-7a7c-4fc1-8a6b-cb6f5234cda5",
  louis2: "603e7aa9-1520-4412-b6aa-c949cc871d4f",
  louis4: "02a7f7ff-44ee-4cf7-b770-fe1ea9a59893",
  stephen2: "c3a4c21b-7783-4f3d-8528-2b8962e1d9cc",
};
const wiki = (name) => `https://en.wikipedia.org/wiki/${name.replaceAll(" ", "_")}`;
const event = (year, type, label, labelCn, tags = [type], weight = 70, url) => ({ year, type, tags, weight, label, labelCn, wikiUrl: url ?? wiki(label) });
const card = ({ id, firstName, lastName = "of Bavaria", displayName, fullName, cn, birthYear, deathYear, house, primaryTitle, primaryTitleCn, titleStart, titles, fatherId, childIds, events, notes, sourceNote }) => ({
  id, firstName, lastName, displayName, fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], displayNameCn: cn, fullNameCn: cn,
  birthYear, deathYear, birthPlace: "Bavaria", birthPlaceCn: "巴伐利亚", deathPlace: "", deathPlaceCn: "", gender: "male", dynasty: "Wittelsbach dynasty", house,
  culture: "German", faith: "Catholic", primaryTitle, primaryTitleCn,
  titles: titles ?? [{ title: primaryTitle, titleCn: primaryTitleCn, startYear: titleStart, endYear: deathYear }], tags: ["duke", "noble"], rank: "duke", importanceScore: 60, historicalRating: 6,
  relationships: { fatherId: fatherId ?? "", motherId: "", spouseIds: [], partnerIds: [], childIds: childIds ?? [] }, events,
  wikiUrl: wiki(displayName), portraitUrl: "", sourceUrl: wiki(displayName), sourceNote, notes, createdDate: "20260823", createdOrder: 0,
});
const cards = [
  card({ id: ids.rudolf, firstName: "Rudolf", lastName: "Count Palatine of the Rhine", displayName: "Rudolf I, Count Palatine of the Rhine", fullName: "Rudolf I, Count Palatine of the Rhine", cn: "莱茵行宫伯爵鲁道夫一世", birthYear: 1274, deathYear: 1319, house: "House of Wittelsbach-Palatinate", primaryTitle: "Count Palatine of the Rhine", primaryTitleCn: "莱茵行宫伯爵", titleStart: 1294, fatherId: ids.louis2,
    childIds: [], events: [event(1294, "succession", "Became Count Palatine of the Rhine", "成为莱茵行宫伯爵", ["succession", "title"], 82, wiki("Rudolf_I,_Duke_of_Bavaria")), event(1301, "government", "Shared Upper Bavaria with Louis IV", "与路易四世共治上巴伐利亚", ["government", "dynasty"], 78, wiki("Rudolf_I,_Duke_of_Bavaria")), event(1319, "death", "Died at Dachau", "在达豪去世", ["death"], 68, wiki("Rudolf_I,_Duke_of_Bavaria"))], notes: "Elder son of Louis II and elder brother of Louis IV; father-line founder of the Wittelsbach Palatinate branch. The Treaty of Pavia (1329) was concluded by his sons after his death.", sourceNote: "Son of Louis II, elder brother of Emperor Louis IV, and ancestor of the Palatine Wittelsbach line." }),
  card({ id: ids.frederick, firstName: "Frederick", displayName: "Frederick of Bavaria-Landshut", fullName: "Frederick, Duke of Bavaria-Landshut", cn: "巴伐利亚-兰茨胡特的腓特烈", birthYear: 1339, deathYear: 1393, house: "House of Wittelsbach-Landshut", primaryTitle: "Duke of Bavaria-Landshut", primaryTitleCn: "巴伐利亚-兰茨胡特公爵", titleStart: 1375, fatherId: ids.stephen2, events: [event(1375, "succession", "Inherited Bavaria jointly with his brothers", "与兄弟共同继承巴伐利亚", ["succession", "dynasty"], 78, wiki("Frederick,_Duke_of_Bavaria")), event(1392, "partition", "Received Bavaria-Landshut in the partition", "在分割中取得巴伐利亚-兰茨胡特", ["territory", "succession"], 84, wiki("Partition_of_Bavaria")), event(1393, "death", "Died at Budweis", "在布德韦斯去世", ["death"], 68, wiki("Frederick,_Duke_of_Bavaria"))], notes: "Second son of Stephen II; first Duke of Bavaria-Landshut after the 1392 partition, and brother of Stephen III and John II.", sourceNote: "Second son of Stephen II; founder of the Bavaria-Landshut branch in 1392." }),
  card({ id: ids.john, firstName: "John", displayName: "John II of Bavaria-Munich", fullName: "John II, Duke of Bavaria-Munich", cn: "巴伐利亚-慕尼黑的约翰二世", birthYear: 1341, deathYear: 1397, house: "House of Wittelsbach-Munich", primaryTitle: "Duke of Bavaria-Munich", primaryTitleCn: "巴伐利亚-慕尼黑公爵", titleStart: 1375, fatherId: ids.stephen2, events: [event(1375, "succession", "Inherited Bavaria jointly with his brothers", "与兄弟共同继承巴伐利亚", ["succession", "dynasty"], 78, wiki("John_II,_Duke_of_Bavaria")), event(1392, "partition", "Received Bavaria-Munich in the partition", "在分割中取得巴伐利亚-慕尼黑", ["territory", "succession"], 84, wiki("Partition_of_Bavaria")), event(1397, "death", "Died at Munich", "在慕尼黑去世", ["death"], 68, wiki("John_II,_Duke_of_Bavaria"))], notes: "Eldest son of Stephen II; first Duke of Bavaria-Munich after the 1392 partition, and brother of Stephen III and Frederick.", sourceNote: "Eldest son of Stephen II; founder of the Bavaria-Munich branch in 1392." }),
];
const all = () => Object.values(loaded).flat();
const nextOrder = Math.max(0, ...all().map((p) => Number(p.createdOrder) || 0)) + 1;
for (const p of cards) {
  p.createdOrder = nextOrder + cards.indexOf(p);
  const file = p.id === ids.rudolf ? files.palatinate : p.id === ids.frederick ? files.landshut : files.munich;
  const target = loaded[file]; const old = target.find((x) => x.id === p.id); if (old) Object.assign(old, p); else target.push(p);
  if (!manifest.order.includes(p.id)) manifest.order.push(p.id);
}
const byId = Object.fromEntries(all().map((p) => [p.id, p]));
for (const child of [ids.rudolf]) if (!byId[ids.louis2].relationships.childIds.includes(child)) byId[ids.louis2].relationships.childIds.push(child);
for (const child of [ids.frederick, ids.john]) if (!byId[ids.stephen2].relationships.childIds.includes(child)) byId[ids.stephen2].relationships.childIds.push(child);
for (const [file, people] of Object.entries(loaded)) fs.writeFileSync(`${dir}${file}`, `${JSON.stringify(people, null, 2)}\n`);
fs.writeFileSync(`${dir}manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
const w = "src/data/people/index.ts";
let index = fs.readFileSync(`${root}${w}`, "utf8");
const imports = `import houseHouseOfWittelsbachLandshut from "./${files.landshut}";\nimport houseHouseOfWittelsbachMunich from "./${files.munich}";\nimport houseHouseOfWittelsbachPalatinate from "./${files.palatinate}";\n`;
if (!index.includes("houseHouseOfWittelsbachLandshut")) index = index.replace('import houseHouseOfWittelsbachIngolstadt from "./house-house-of-wittelsbach-ingolstadt.json";\n', 'import houseHouseOfWittelsbachIngolstadt from "./house-house-of-wittelsbach-ingolstadt.json";\n' + imports);
index = index.replace("...houseHouseOfWittelsbachIngolstadt, ...houseHouseOfWittelsbachStraubing,", "...houseHouseOfWittelsbachIngolstadt, ...houseHouseOfWittelsbachLandshut, ...houseHouseOfWittelsbachMunich, ...houseHouseOfWittelsbachPalatinate, ...houseHouseOfWittelsbachStraubing,");
fs.writeFileSync(`${root}${w}`, index);
console.log("[add-wittelsbach-branches] added 3 cards and linked existing parents");
