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

const father = byId.get("727f5266-97af-45ee-8a21-c986aaf039dd");
const mother = byId.get("6a94fc7a-dd9f-4031-87ac-701daf55e26e");
if (!father || !mother) throw new Error("Barbarossa or Beatrice I is missing");
const source = "https://en.wikipedia.org/wiki/Frederick_Barbarossa";
const deathCause = (summary, summaryCn, kind = "uncertain") => ({ kind, summary, summaryCn, detail: summary, detailCn: summaryCn, wikiUrl: source });
const event = (year, type, tags, label, labelCn, weight = 62, note = "") => ({ year, type, tags, weight, label, labelCn, wikiUrl: source, ...(note ? { note } : {}) });
const basic = ({ id, firstName, displayName, displayNameCn, gender = "male", birthYear, deathYear, deathPlace = "", deathPlaceCn = "", primaryTitle = "Prince of the Holy Roman Empire", primaryTitleCn = "神圣罗马帝国亲王", titles = [], tags = ["noble"], rank = "noble", events = [], cause, notes, alsoKnownAs = [] }) => ({
  id, firstName, lastName: "of Hohenstaufen", displayName, fullName: displayName, displayNameCn, fullNameCn: displayNameCn, nickname: "", nicknameCn: "", alsoKnownAs, nicknameTags: [], birthYear, deathYear, birthPlace: "", birthPlaceCn: "", deathPlace, deathPlaceCn, gender, dynasty: "Hohenstaufen dynasty", house: "Hohenstaufen dynasty", culture: "German", faith: "Catholic", primaryTitle, primaryTitleCn, titles, tags, rank, importanceScore: 50, historicalRating: 5,
  relationships: { fatherId: father.id, motherId: mother.id, spouseIds: [], partnerIds: [], childIds: [] }, events, ...(cause ? { deathCause: cause } : {}), wikiUrl: source, portraitUrl: "", sourceUrl: source, sourceNote: "Basic card for a documented child of Frederick I Barbarossa and Beatrice I of Burgundy.", notes, createdDate: "20260823", createdOrder: 0,
});

const children = [
  basic({ id: "45baa722-7fe8-4c5c-b533-e37544328a75", firstName: "Beatrice", displayName: "Beatrice of Hohenstaufen", displayNameCn: "霍恩斯陶芬的贝阿特丽斯", gender: "female", birthYear: 1163, deathYear: "", tags: ["noble"], events: [event(1173, "diplomacy", ["diplomacy", "marriage"], "Marriage negotiations with William II of Sicily", "与西西里国王威廉二世进行婚姻谈判", 64)], cause: deathCause("Death date and cause are not reliably recorded.", "卒年与死因均无可靠记载。"), notes: "Daughter of Frederick I Barbarossa and Beatrice I. Marriage negotiations with William II of Sicily did not result in a marriage." }),
  basic({ id: "c3b0687b-179f-47b6-9ea7-ccfea2629c05", firstName: "Frederick", displayName: "Frederick V, Duke of Swabia", displayNameCn: "施瓦本公爵腓特烈五世", birthYear: 1164, deathYear: 1170, primaryTitle: "Duke of Swabia", primaryTitleCn: "施瓦本公爵", titles: [{ title: "Duke of Swabia", titleCn: "施瓦本公爵", startYear: 1167, endYear: 1170 }], tags: ["duke", "noble"], rank: "duke", events: [event(1167, "title_acquired", ["title", "duke"], "Became Duke of Swabia", "成为施瓦本公爵", 70)], cause: deathCause("Cause of death is not reliably recorded.", "死因无可靠记载。"), notes: "Eldest surviving son of Frederick I and Beatrice I; his death transferred the Swabian duchy to his younger brother Conrad." }),
  basic({ id: "4447ca0f-a12f-494a-95ee-9875ff063099", firstName: "Frederick", displayName: "Frederick VI, Duke of Swabia", displayNameCn: "施瓦本公爵腓特烈六世", birthYear: 1167, deathYear: 1191, deathPlace: "Acre, Kingdom of Jerusalem", deathPlaceCn: "耶路撒冷王国阿卡", primaryTitle: "Duke of Swabia", primaryTitleCn: "施瓦本公爵", titles: [{ title: "Duke of Swabia", titleCn: "施瓦本公爵", startYear: 1170, endYear: 1191 }], tags: ["duke", "noble"], rank: "duke", alsoKnownAs: ["Conrad of Hohenstaufen"], events: [event(1170, "title_acquired", ["title", "duke"], "Succeeded as Duke of Swabia", "继承施瓦本公爵", 72), event(1189, "crusade", ["crusade", "commander"], "Joined the Third Crusade", "参加第三次十字军东征", 76)], cause: deathCause("Died at Acre during the Third Crusade; a specific cause is not securely recorded.", "第三次十字军东征期间卒于阿卡；具体死因无可靠记载。"), notes: "Born Conrad, he was renamed Frederick after succeeding his elder brother as Duke of Swabia." }),
  basic({ id: "966b3670-1197-4552-b765-7cdc54455363", firstName: "Judith", displayName: "Judith of Hohenstaufen", displayNameCn: "霍恩斯陶芬的朱迪丝", gender: "female", birthYear: 1168, deathYear: 1184, tags: ["noble"], events: [event(1173, "diplomacy", ["diplomacy", "marriage"], "Betrothed to Richard, Count of Poitou", "与普瓦捷伯爵理查订婚", 66, "The name Judith is uncertain in modern scholarship; she died before the marriage.")], cause: deathCause("Cause of death is not reliably recorded.", "死因无可靠记载。"), notes: "Daughter attributed to Frederick I and Beatrice I; her personal name is uncertain and is conventionally given as Judith." }),
  basic({ id: "58f15fda-c80f-4439-876b-ff4f047da3b2", firstName: "Otto", displayName: "Otto I, Count of Burgundy", displayNameCn: "勃艮第伯爵奥托一世", birthYear: 1170, deathYear: 1200, deathPlace: "Besançon, County of Burgundy", deathPlaceCn: "勃艮第伯国贝桑松", primaryTitle: "Count Palatine of Burgundy", primaryTitleCn: "勃艮第行宫伯爵", titles: [{ title: "Count Palatine of Burgundy", titleCn: "勃艮第行宫伯爵", startYear: 1190, endYear: 1200 }], tags: ["count", "noble"], rank: "count", events: [event(1190, "succession", ["succession", "title"], "Succeeded as Count Palatine of Burgundy", "继承勃艮第行宫伯爵", 74)], cause: deathCause("Killed at Besançon.", "在贝桑松遇害。", "violent"), notes: "Son of Frederick I and Beatrice I; he inherited his mother's Burgundian county after the imperial succession passed to Henry VI." }),
  basic({ id: "3a26b97e-3345-4100-801e-3d5deb589bd6", firstName: "Conrad", displayName: "Conrad II, Duke of Swabia", displayNameCn: "施瓦本公爵康拉德二世", birthYear: 1172, deathYear: 1196, deathPlace: "Durlach, Duchy of Swabia", deathPlaceCn: "施瓦本公国杜拉赫", primaryTitle: "Duke of Swabia", primaryTitleCn: "施瓦本公爵", titles: [{ title: "Duke of Swabia", titleCn: "施瓦本公爵", startYear: 1191, endYear: 1196 }], tags: ["duke", "noble"], rank: "duke", events: [event(1191, "title_acquired", ["title", "duke"], "Became Duke of Swabia", "成为施瓦本公爵", 70)], cause: deathCause("Killed at Durlach.", "在杜拉赫遇害。", "violent"), notes: "Younger son of Frederick I and Beatrice I; he succeeded his brother Frederick VI as Duke of Swabia." }),
  basic({ id: "6c8157b1-bdab-4012-afcd-b4e817686195", firstName: "Rainald", displayName: "Rainald of Hohenstaufen", displayNameCn: "霍恩斯陶芬的雷纳尔德", birthYear: 1173, deathYear: "", tags: ["noble"], events: [event(1174, "church", ["church", "dynasty"], "Buried at Lorch Abbey", "葬于洛尔希修道院", 56, "His death is only bounded between 1174 and shortly after 1178.")], cause: deathCause("Died in childhood; the cause and exact year are not reliably recorded.", "幼年去世；死因与确切年份均无可靠记载。"), notes: "Son of Frederick I and Beatrice I, known only from dynastic records and burial at Lorch Abbey." }),
  basic({ id: "0bd54372-1bb7-4d4e-8281-e8834a3bdedc", firstName: "William", displayName: "William of Hohenstaufen", displayNameCn: "霍恩斯陶芬的威廉", birthYear: 1175, deathYear: "", tags: ["noble"], events: [event(1178, "church", ["church", "dynasty"], "Buried at Lorch Abbey", "葬于洛尔希修道院", 56, "He died soon after October 1178.")], cause: deathCause("Died in childhood; the cause and exact date are not reliably recorded.", "幼年去世；死因与确切日期均无可靠记载。"), notes: "Son of Frederick I and Beatrice I, known only from dynastic records and burial at Lorch Abbey." }),
  basic({ id: "a4797c56-9e7d-42ad-bcce-653c8dd42eb6", firstName: "Agnes", displayName: "Agnes of Hohenstaufen", displayNameCn: "霍恩斯陶芬的阿格妮丝", gender: "female", birthYear: 1179, deathYear: 1184, tags: ["noble"], events: [event(1184, "diplomacy", ["diplomacy", "marriage"], "Betrothed to Emeric of Hungary", "与匈牙利的埃默里克订婚", 64)], cause: deathCause("Cause of death is not reliably recorded.", "死因无可靠记载。"), notes: "Youngest documented daughter of Frederick I and Beatrice I; she died before her proposed marriage to Emeric of Hungary." }),
];

const target = [...files.entries()].find(([, people]) => people.some((person) => person.id === father.id));
if (!target) throw new Error("Could not locate Hohenstaufen source file");
const [targetPath, targetPeople] = target;
for (const child of children) {
  if (byId.has(child.id)) throw new Error(`Duplicate UUID ${child.id}`);
  targetPeople.push(child);
  father.relationships.childIds.push(child.id);
  mother.relationships.childIds.push(child.id);
  manifest.order.push(child.id);
}
for (const [filePath, people] of files) fs.writeFileSync(filePath, `${JSON.stringify(people, null, 2)}\n`);
fs.writeFileSync(path.join(directory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Added ${children.length} children of Frederick I Barbarossa.`);
