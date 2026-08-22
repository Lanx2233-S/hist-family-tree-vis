import fs from "node:fs";

const file = "src/data/people/temporary-louis-vi-children.json";
const fatherId = "d2dd406e-702b-425c-b3dc-2dcac8e8163d";
const entries = [
  ["Philip of France", "Philip, King of the Franks", "腓力（法兰克国王）", "King of the Franks", 1116, 1131, "king"],
  ["Henry of France", "Henry, Archbishop of Reims", "亨利（兰斯大主教）", "Archbishop of Reims", 1121, 1175, "bishop"],
  ["Hugh of France", "Hugh, son of Louis VI", "于格（路易六世之子）", "French prince", 1122, 1125, "noble"],
  ["Robert I of Dreux", "Robert I, Count of Dreux", "德勒伯爵罗贝尔一世", "Count of Dreux", 1123, 1188, "count"],
  ["Peter of Courtenay", "Peter of Courtenay", "皮埃尔·德·库尔特奈", "Lord of Courtenay", 1126, 1183, "noble"],
  ["Constance of France", "Constance of France, Countess of Toulouse", "法兰西的康斯坦丝", "Countess of Toulouse", 1128, 1176, "count"],
  ["Philip of Paris", "Philip, Archdeacon of Paris", "腓力（巴黎副主教）", "Archdeacon of Paris", 1132, 1160, "bishop"],
  ["Isabelle of France", "Isabelle of France", "法兰西的伊莎贝尔", "Lady of Chaumont", 1105, 1175, "noble"]
];
const ids = entries.map((_, i) => `c8${String(i + 1).padStart(2, "0")}0000-0000-4000-8000-0000000000${String(i + 1).padStart(2, "0")}`);
const cards = entries.map((v, i) => {
  const [displayName, fullName, displayNameCn, primaryTitle, birthYear, deathYear, rank] = v;
  const order = i + 1;
  return { id: ids[i], firstName: displayName, lastName: "Capet", displayName, fullName, displayNameCn, fullNameCn: fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear, deathYear, birthPlace: "Kingdom of France", birthPlaceCn: "法兰西王国", deathPlace: "Kingdom of France", deathPlaceCn: "法兰西王国", gender: displayName.startsWith("Constance") || displayName.startsWith("Isabelle") ? "female" : "male", dynasty: "House of Capet", house: "House of Capet", culture: "French", faith: "Catholic", primaryTitle, primaryTitleCn: primaryTitle, titles: [{ title: primaryTitle, titleCn: primaryTitle, startYear: "", endYear: "" }], tags: [rank === "king" ? "monarch" : "noble"], rank, importanceScore: rank === "king" ? 78 : 55, historicalRating: rank === "king" ? 7 : 5, relationships: { fatherId, motherId: "", spouseIds: [], partnerIds: [], childIds: [] }, events: [{ year: birthYear, type: "childbirth", tags: ["childbirth", "dynasty"], weight: 55, label: "Born, child of Louis VI", labelCn: "出生，为路易六世之子女", wikiUrl: "https://en.wikipedia.org/wiki/Louis_VI_of_France" }, { year: deathYear, type: "death", tags: ["death"], weight: 55, label: "Died", labelCn: "去世", wikiUrl: "https://en.wikipedia.org/wiki/Louis_VI_of_France" }], wikiUrl: "https://en.wikipedia.org/wiki/Louis_VI_of_France", portraitUrl: "", sourceUrl: "https://en.wikipedia.org/wiki/Louis_VI_of_France", sourceNote: "Child of Louis VI and Adelaide of Maurienne; basic card added to complete the family branch.", notes: displayName === "Isabelle of France" ? "Daughter attributed to Louis VI; her mother's identity is uncertain in the sources." : "Child of Louis VI and Adelaide of Maurienne.", createdDate: "20260822", createdOrder: order };
});
fs.writeFileSync(file, JSON.stringify(cards, null, 2) + "\n");
const manifest = JSON.parse(fs.readFileSync("src/data/people/manifest.json", "utf8"));
if (!manifest.files.includes("temporary-louis-vi-children.json")) manifest.files.push("temporary-louis-vi-children.json");
for (const card of cards) if (!manifest.order.includes(card.id)) manifest.order.push(card.id);
fs.writeFileSync("src/data/people/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
const indexPath = "src/data/people/index.ts";
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes('import temporaryLouisViChildren from "./temporary-louis-vi-children.json";')) {
  index = index.replace('import temporaryChampagne from "./temporary-champagne.json";', 'import temporaryChampagne from "./temporary-champagne.json";\nimport temporaryLouisViChildren from "./temporary-louis-vi-children.json";').replace("...temporaryChampagne];", "...temporaryChampagne, ...temporaryLouisViChildren];");
  fs.writeFileSync(indexPath, index);
}
const capetPath = "src/data/people/capet.json";
const capet = JSON.parse(fs.readFileSync(capetPath, "utf8"));
const louis = capet.find((p) => p.id === fatherId);
for (const card of cards) if (!louis.relationships.childIds.includes(card.id)) louis.relationships.childIds.push(card.id);
fs.writeFileSync(capetPath, JSON.stringify(capet, null, 2) + "\n");
console.log(`Added ${cards.length} children of Louis VI.`);
