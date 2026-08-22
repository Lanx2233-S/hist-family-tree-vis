import fs from "node:fs";

const louisId = "6ae9afe1-d639-482e-b9ea-13d27778f842";
const cards = [
  { id: "c9010000-0000-4000-8000-000000000001", displayName: "Constance of Castile", fullName: "Constance of Castile, Queen of France", displayNameCn: "卡斯蒂利亚的康斯坦萨", primaryTitle: "Queen of France", birthYear: 1136, deathYear: 1160, rank: "queen", order: 9 },
  { id: "c9020000-0000-4000-8000-000000000002", displayName: "Margaret of France", fullName: "Margaret of France, Queen of England and Hungary", displayNameCn: "法兰西的玛格丽特", primaryTitle: "Queen of England and Hungary", birthYear: 1158, deathYear: 1197, rank: "queen", order: 10 },
  { id: "c9030000-0000-4000-8000-000000000003", displayName: "Alys of France", fullName: "Alys of France, Countess of Ponthieu", birthYear: 1160, deathYear: 1220, rank: "count", order: 11 }
].map((v) => ({ ...v, firstName: v.displayName, lastName: "Capet", fullNameCn: v.fullName, nickname: "", nicknameCn: "", alsoKnownAs: v.displayName === "Alys of France" ? ["Alice of France"] : [], nicknameTags: [], birthPlace: "Kingdom of France", birthPlaceCn: "法兰西王国", deathPlace: "Kingdom of France", deathPlaceCn: "法兰西王国", gender: v.displayName === "Constance of Castile" || v.displayName.startsWith("Margaret") || v.displayName.startsWith("Alys") ? "female" : "male", dynasty: "House of Capet", house: "House of Capet", culture: "French", faith: "Catholic", primaryTitleCn: v.primaryTitle, titles: [{ title: v.primaryTitle, titleCn: v.primaryTitle, startYear: "", endYear: v.deathYear }], tags: v.rank === "queen" ? ["queen", "consort", "noble"] : ["noble"], importanceScore: v.rank === "queen" ? 70 : 60, historicalRating: 6, relationships: { fatherId: v.displayName === "Constance of Castile" ? "" : louisId, motherId: v.displayName === "Constance of Castile" ? "" : "c9010000-0000-4000-8000-000000000001", spouseIds: v.displayName === "Constance of Castile" ? [louisId] : [], partnerIds: [], childIds: [] }, events: [{ year: v.birthYear, type: "childbirth", tags: ["childbirth", "dynasty"], weight: 55, label: "Born", labelCn: "出生", wikiUrl: "https://en.wikipedia.org/wiki/Louis_VII_of_France" }, { year: v.deathYear, type: "death", tags: ["death"], weight: 55, label: "Died", labelCn: "去世", wikiUrl: "https://en.wikipedia.org/wiki/Louis_VII_of_France" }], wikiUrl: "https://en.wikipedia.org/wiki/Louis_VII_of_France", portraitUrl: "", sourceUrl: "https://en.wikipedia.org/wiki/Louis_VII_of_France", sourceNote: "Basic family card for Louis VII's second marriage and its children.", notes: "Child or spouse in the Louis VII / Constance of Castile branch.", createdDate: "20260822", createdOrder: v.order }));
const file = "src/data/people/temporary-louis-vii-constance.json";
fs.writeFileSync(file, JSON.stringify(cards, null, 2) + "\n");
const manifest = JSON.parse(fs.readFileSync("src/data/people/manifest.json", "utf8"));
if (!manifest.files.includes("temporary-louis-vii-constance.json")) manifest.files.push("temporary-louis-vii-constance.json");
for (const card of cards) if (!manifest.order.includes(card.id)) manifest.order.push(card.id);
fs.writeFileSync("src/data/people/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
const indexPath = "src/data/people/index.ts";
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes('import temporaryLouisViiConstance from "./temporary-louis-vii-constance.json";')) {
  index = index.replace('import temporaryLouisViChildren from "./temporary-louis-vi-children.json";', 'import temporaryLouisViChildren from "./temporary-louis-vi-children.json";\nimport temporaryLouisViiConstance from "./temporary-louis-vii-constance.json";').replace("...temporaryLouisViChildren];", "...temporaryLouisViChildren, ...temporaryLouisViiConstance];");
  fs.writeFileSync(indexPath, index);
}
const capetPath = "src/data/people/capet.json";
const capet = JSON.parse(fs.readFileSync(capetPath, "utf8"));
const louis = capet.find((p) => p.id === louisId);
if (!louis.relationships.spouseIds.includes(cards[0].id)) louis.relationships.spouseIds.splice(1, 0, cards[0].id);
for (const card of cards.slice(1)) if (!louis.relationships.childIds.includes(card.id)) louis.relationships.childIds.push(card.id);
fs.writeFileSync(capetPath, JSON.stringify(capet, null, 2) + "\n");
const children = JSON.parse(fs.readFileSync(file, "utf8"));
children[0].relationships.childIds = [cards[1].id, cards[2].id];
fs.writeFileSync(file, JSON.stringify(children, null, 2) + "\n");
console.log("Added Constance of Castile and her two daughters.");
