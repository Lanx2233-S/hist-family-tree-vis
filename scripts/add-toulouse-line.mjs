import fs from "node:fs";

const raymondVId = "c9040000-0000-4000-8000-000000000004";
const peopleFile = "src/data/people/temporary-toulouse.json";
const titleFile = "src/data/titles/county-of-toulouse.json";
const source = "https://en.wikipedia.org/wiki/Count_of_Toulouse";

const cards = [
  ["c9050000-0000-4000-8000-000000000001", "Frédelon de Toulouse", "Frédelon, Count of Toulouse", "图卢兹的弗里德隆", 810, 852, 849, 852, 5, "", ""],
  ["c9060000-0000-4000-8000-000000000002", "Raymond I de Toulouse", "Raymond I, Count of Toulouse", "图卢兹的雷蒙一世", 815, 865, 852, 863, 6, "", ""],
  ["c9070000-0000-4000-8000-000000000003", "Bernard II de Toulouse", "Bernard II, Count of Toulouse", "图卢兹的贝尔纳二世", 840, 877, 865, 877, 5, "c9060000-0000-4000-8000-000000000002", ""],
  ["c9080000-0000-4000-8000-000000000004", "Bernard Plantevelue", "Bernard Plantevelue, Count of Toulouse", "贝尔纳·普朗特韦吕", 841, 886, 877, 886, 5, "", ""],
  ["c9090000-0000-4000-8000-000000000005", "Eudes de Toulouse", "Eudes, Count of Toulouse", "图卢兹的厄德", 845, 918, 886, 918, 5, "c9060000-0000-4000-8000-000000000002", ""],
  ["c9100000-0000-4000-8000-000000000006", "Raymond II de Toulouse", "Raymond II, Count of Toulouse", "图卢兹的雷蒙二世", 880, 924, 918, 924, 5, "c9090000-0000-4000-8000-000000000005", ""],
  ["c9110000-0000-4000-8000-000000000007", "Raymond Pons de Toulouse", "Raymond Pons, Count of Toulouse", "图卢兹的雷蒙·蓬斯", 900, 950, 924, 950, 6, "c9100000-0000-4000-8000-000000000006", ""],
  ["c9120000-0000-4000-8000-000000000008", "Guillaume III Taillefer", "Guillaume III Taillefer, Count of Toulouse", "图卢兹的吉耶姆三世·塔耶费尔", 930, 1037, 950, 1037, 6, "c9110000-0000-4000-8000-000000000007", ""],
  ["c9130000-0000-4000-8000-000000000009", "Pons de Toulouse", "Pons, Count of Toulouse", "图卢兹的蓬斯", 990, 1060, 1037, 1060, 6, "c9120000-0000-4000-8000-000000000008", ""],
  ["c9140000-0000-4000-8000-000000000010", "Guillaume IV de Toulouse", "Guillaume IV, Count of Toulouse", "图卢兹的吉耶姆四世", 1040, 1094, 1060, 1094, 6, "c9130000-0000-4000-8000-000000000009", ""],
  ["c9150000-0000-4000-8000-000000000011", "Raymond IV de Toulouse", "Raymond IV of Saint-Gilles, Count of Toulouse", "图卢兹的雷蒙四世（圣吉尔）", 1042, 1105, 1094, 1105, 8, "c9130000-0000-4000-8000-000000000009", ""],
  ["c9160000-0000-4000-8000-000000000012", "Bertrand de Toulouse", "Bertrand, Count of Toulouse", "图卢兹的贝特朗", 1065, 1112, 1105, 1112, 5, "c9150000-0000-4000-8000-000000000011", ""],
  ["c9170000-0000-4000-8000-000000000013", "Alphonse Jourdain", "Alphonse Jourdain, Count of Toulouse", "阿方斯·茹尔丹", 1103, 1148, 1112, 1148, 7, "c9150000-0000-4000-8000-000000000011", raymondVId],
].map(([id, displayName, fullName, displayNameCn, birthYear, deathYear, startYear, endYear, historicalRating, fatherId, childId], index) => ({
  id, firstName: displayName.split(" ")[0], lastName: "de Toulouse", displayName, fullName, displayNameCn, fullNameCn: fullName,
  nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear, deathYear,
  birthPlace: "County of Toulouse", birthPlaceCn: "图卢兹伯国", deathPlace: "", deathPlaceCn: "", gender: "male",
  dynasty: "House of Toulouse", house: "House of Toulouse", culture: "Occitan", faith: "Catholic",
  primaryTitle: "Count of Toulouse", primaryTitleCn: "图卢兹伯爵",
  titles: [{ title: "Count of Toulouse", titleCn: "图卢兹伯爵", startYear, endYear }],
  tags: ["count", "noble"], rank: "count", importanceScore: historicalRating * 10, historicalRating,
  relationships: { fatherId, motherId: "", spouseIds: [], partnerIds: [], childIds: childId ? [childId] : [] },
  events: [], wikiUrl: source, portraitUrl: "", sourceUrl: source,
  sourceNote: "Basic card for the County of Toulouse succession. The ninth- and tenth-century succession and numbering are partly disputed in modern scholarship.",
  notes: "Added for the Toulouse main succession from Frédelon to Raymond V.", createdDate: "20260822", createdOrder: index + 13,
}));

const extensionCards = [
  { id: "c9180000-0000-4000-8000-000000000014", displayName: "Raymond VI de Toulouse", fullName: "Raymond VI, Count of Toulouse", displayNameCn: "图卢兹的雷蒙六世", birthYear: 1156, deathYear: 1222, startYear: 1194, endYear: 1222, historicalRating: 8, fatherId: raymondVId, childIds: ["c9190000-0000-4000-8000-000000000015"] },
  { id: "c9190000-0000-4000-8000-000000000015", displayName: "Raymond VII de Toulouse", fullName: "Raymond VII, Count of Toulouse", displayNameCn: "图卢兹的雷蒙七世", birthYear: 1197, deathYear: 1249, startYear: 1222, endYear: 1249, historicalRating: 8, fatherId: "c9180000-0000-4000-8000-000000000014", childIds: ["c9200000-0000-4000-8000-000000000016"] },
  { id: "c9200000-0000-4000-8000-000000000016", displayName: "Jeanne of Toulouse", fullName: "Jeanne, Countess of Toulouse", displayNameCn: "图卢兹的让娜", birthYear: 1220, deathYear: 1271, startYear: 1249, endYear: 1271, historicalRating: 7, fatherId: "c9190000-0000-4000-8000-000000000015", childIds: [], spouseIds: ["c9210000-0000-4000-8000-000000000017"], rank: "countess", primaryTitle: "Countess of Toulouse", primaryTitleCn: "图卢兹女伯爵" },
  { id: "c9210000-0000-4000-8000-000000000017", displayName: "Alphonse of Poitiers", fullName: "Alphonse of Poitiers, Count of Toulouse", displayNameCn: "普瓦捷的阿方斯", birthYear: 1220, deathYear: 1271, startYear: 1249, endYear: 1271, historicalRating: 7, fatherId: "96b01b93-0b97-494a-896e-2d7abb07e05c", motherId: "0736f259-d8fa-4263-9a07-73475f48bfd3", childIds: [], spouseIds: ["c9200000-0000-4000-8000-000000000016"], primaryTitle: "Count of Poitiers and Toulouse", primaryTitleCn: "普瓦捷与图卢兹伯爵" },
].map((person, index) => ({
  ...person, firstName: person.displayName.split(" ")[0], lastName: "de Toulouse", fullNameCn: person.fullName,
  nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthPlace: "County of Toulouse", birthPlaceCn: "图卢兹伯国", deathPlace: "", deathPlaceCn: "", gender: person.displayName === "Jeanne of Toulouse" ? "female" : "male",
  dynasty: person.displayName === "Alphonse of Poitiers" ? "House of Capet" : "House of Toulouse", house: person.displayName === "Alphonse of Poitiers" ? "House of Capet" : "House of Toulouse", culture: person.displayName === "Alphonse of Poitiers" ? "French" : "Occitan", faith: "Catholic",
  primaryTitle: person.primaryTitle ?? "Count of Toulouse", primaryTitleCn: person.primaryTitleCn ?? "图卢兹伯爵", titles: [{ title: person.primaryTitle ?? "Count of Toulouse", titleCn: person.primaryTitleCn ?? "图卢兹伯爵", startYear: person.startYear, endYear: person.endYear }],
  tags: ["count", "noble"], rank: person.rank ?? "count", importanceScore: person.historicalRating * 10,
  relationships: { fatherId: person.fatherId, motherId: person.motherId ?? "", spouseIds: person.spouseIds ?? [], partnerIds: [], childIds: person.childIds },
  events: [], wikiUrl: source, portraitUrl: "", sourceUrl: source,
  sourceNote: "Basic card for the final Toulouse succession; after 1229 the county was subject to the Meaux-Paris settlement and prepared for Capetian annexation.",
  notes: "Added for the Toulouse succession from Raymond VI through Jeanne's 1271 inheritance." , createdDate: "20260822", createdOrder: index + 26,
}));
cards.push(...extensionCards);

const existing = JSON.parse(fs.readFileSync(peopleFile, "utf8"));
const merged = [...existing.filter((person) => !cards.some((card) => card.id === person.id)), ...cards];
const raymondV = merged.find((person) => person.id === raymondVId);
const alphonseJourdain = cards.find((person) => person.id === "c9170000-0000-4000-8000-000000000013");
raymondV.relationships.fatherId = alphonseJourdain.id;
if (!alphonseJourdain.relationships.childIds.includes(raymondVId)) alphonseJourdain.relationships.childIds.push(raymondVId);
const byId = new Map(merged.map((person) => [person.id, person]));
for (const child of cards) {
  if (!child.relationships.fatherId) continue;
  const father = byId.get(child.relationships.fatherId);
  if (father && !father.relationships.childIds.includes(child.id)) father.relationships.childIds.push(child.id);
}
for (const spouse of extensionCards) {
  for (const spouseId of spouse.relationships.spouseIds) {
    const partner = byId.get(spouseId);
    if (partner && !partner.relationships.spouseIds.includes(spouse.id)) partner.relationships.spouseIds.push(spouse.id);
  }
}
fs.writeFileSync(peopleFile, JSON.stringify(merged, null, 2) + "\n");

const holders = [
  ...cards.slice(0, 2).map((person) => ({ kind: "person", personId: person.id, startYear: person.titles[0].startYear, endYear: person.titles[0].endYear, titleForm: "Count of Toulouse", note: person.displayNameCn === "图卢兹的弗里德隆" ? "First hereditary count of the Toulouse line." : "Succeeded his brother Frédelon.", noteCn: person.displayNameCn === "图卢兹的弗里德隆" ? "图卢兹世袭伯爵线的首任伯爵。" : "继承其兄弗里德隆。" })),
  { kind: "gap", personId: null, startYear: 863, endYear: 865, titleForm: "Disputed control", titleFormCn: "争夺控制期", note: "Humfrid and Sunyer held Toulouse by conquest or appointment before the Rouergue line was restored.", noteCn: "翁弗雷与苏涅尔曾以征服或任命方式控制图卢兹，之后鲁埃格支系复归。" },
  ...cards.slice(2, 13).map((person) => ({ kind: "person", personId: person.id, startYear: person.titles[0].startYear, endYear: person.titles[0].endYear, titleForm: "Count of Toulouse", note: person.id === "c9080000-0000-4000-8000-000000000004" ? "Succeeded after Bernard II's assassination." : person.id === "c9090000-0000-4000-8000-000000000005" ? "The Toulouse line was restored after Bernard Plantevelue." : "Succeeded as Count of Toulouse.", noteCn: person.id === "c9080000-0000-4000-8000-000000000004" ? "贝尔纳二世遇刺后继任。" : person.id === "c9090000-0000-4000-8000-000000000005" ? "贝尔纳·普朗特韦吕之后，图卢兹本支复归。" : "继任图卢兹伯爵。" })),
  { kind: "person", personId: raymondVId, startYear: 1148, endYear: 1194, titleForm: "Count of Toulouse", note: "Succeeded Alphonse Jourdain.", noteCn: "继承阿方斯·茹尔丹。" },
  { kind: "person", personId: extensionCards[0].id, startYear: 1194, endYear: 1222, titleForm: "Count of Toulouse", note: "Succeeded Raymond V; his reign encompassed the opening of the Albigensian Crusade.", noteCn: "继承雷蒙五世；其在位期间爆发阿尔比十字军。" },
  { kind: "person", personId: extensionCards[1].id, startYear: 1222, endYear: 1249, titleForm: "Count of Toulouse", note: "The Treaty of Meaux-Paris (1229) curtailed the county and fixed the Capetian succession.", noteCn: "1229 年《默—巴黎条约》大幅限制伯国，并确定卡佩继承安排。" },
  { kind: "person", personId: extensionCards[2].id, startYear: 1249, endYear: 1271, titleForm: "Countess of Toulouse", note: "Countess in her own right; governed with Alphonse of Poitiers.", noteCn: "以自身权利为女伯爵，与普瓦捷的阿方斯共同统治。" },
  { kind: "person", personId: extensionCards[3].id, startYear: 1249, endYear: 1271, titleForm: "Count of Toulouse", note: "Capetian co-ruler through his marriage to Jeanne; the county entered the royal domain after their deaths without issue.", noteCn: "因婚姻成为卡佩共同持有人；二人无嗣去世后，伯国并入王室领地。" },
  { kind: "gap", personId: null, startYear: 1271, endYear: "", titleForm: "Royal domain of France", titleFormCn: "法国王室领地", note: "The county was annexed to the French royal domain; the autonomous Toulouse fief ended.", noteCn: "伯国并入法国王室领地，图卢兹自治封建采邑至此终结。" },
];
fs.writeFileSync(titleFile, JSON.stringify({ id: "9e6f6d10-9e9e-4db9-b5e3-8af4e6e6f9b1", canonicalName: "County of Toulouse", canonicalNameCn: "图卢兹伯国", form: "hereditary county", aliases: ["Count of Toulouse", "Toulouse", "Comté de Toulouse"], nameForms: [{ name: "County of Toulouse", nameCn: "图卢兹伯国", fromYear: 849, untilYear: 1271, note: "The hereditary Toulouse line from Frédelon to Raymond V, then a curtailed succession under the Meaux-Paris settlement until royal annexation.", noteCn: "自弗里德隆至雷蒙五世的图卢兹世袭伯爵主线；其后在《默—巴黎条约》限制下延续，直至并入王室领地。" }], holders }, null, 2) + "\n");

const manifestPath = "src/data/people/manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const card of cards) if (!manifest.order.includes(card.id)) manifest.order.push(card.id);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Added ${cards.length} Toulouse succession cards.`);
