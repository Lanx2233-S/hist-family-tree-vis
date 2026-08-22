import fs from "node:fs";

const file = "src/data/people/temporary-champagne.json";
const ids = [
  ["Stephen I of Troyes", "Stephen I, Count of Troyes", "斯蒂芬一世（特鲁瓦）", "House of Blois", "Count of Troyes", 995, 1022, "20260821002"],
  ["Odo I of Meaux", "Odo I, Count of Meaux and Troyes", "厄德一世（莫城与特鲁瓦）", "House of Blois", "Count of Meaux and Troyes", 1022, 1037, "20260821003"],
  ["Stephen II of Meaux", "Stephen II, Count of Meaux", "斯蒂芬二世（莫城）", "House of Blois", "Count of Meaux", 1037, 1048, "20260821004"],
  ["Odo II of Troyes", "Odo II, Count of Troyes", "厄德二世（特鲁瓦）", "House of Blois", "Count of Troyes", 1048, 1066, "20260821005"],
  ["Theobald I of Champagne", "Theobald I, Count of Champagne", "蒂博一世（香槟）", "House of Blois", "Count of Champagne", 1066, 1089, "20260821006"],
  ["Stephen-Henry of Blois", "Stephen-Henry, Count of Blois and Chartres", "斯蒂芬·亨利（布卢瓦）", "House of Blois", "Count of Blois and Chartres", 1089, 1102, "20260821007"],
  ["Hugh of Champagne", "Hugh, Count of Troyes", "于格（特鲁瓦）", "House of Blois", "Count of Troyes", 1102, 1125, "20260821008"],
  ["Theobald II of Champagne", "Theobald II, Count of Champagne", "蒂博二世（香槟）", "House of Blois-Champagne", "Count of Champagne", 1125, 1152, "20260821009"],
  ["Henry I of Champagne", "Henry I, Count of Champagne", "亨利一世（香槟）", "House of Blois-Champagne", "Count of Champagne", 1152, 1181, "20260821010"],
  ["Henry II of Champagne", "Henry II, Count of Champagne", "亨利二世（香槟）", "House of Blois-Champagne", "Count of Champagne", 1181, 1197, "20260821011"],
  ["Theobald III of Champagne", "Theobald III, Count of Champagne", "蒂博三世（香槟）", "House of Blois-Champagne", "Count of Champagne", 1197, 1201, "20260821012"],
  ["Theobald I of Navarre", "Theobald I, King of Navarre and Count of Champagne", "蒂博一世（纳瓦拉）", "House of Blois-Champagne", "King of Navarre / Count of Champagne", 1201, 1253, "20260821013"],
  ["Theobald II of Navarre", "Theobald II, King of Navarre and Count of Champagne", "蒂博二世（纳瓦拉）", "House of Blois-Champagne", "King of Navarre / Count of Champagne", 1253, 1270, "20260821014"],
  ["Henry I of Navarre", "Henry I, King of Navarre and Count of Champagne", "亨利一世（纳瓦拉）", "House of Blois-Champagne", "King of Navarre / Count of Champagne", 1270, 1274, "20260821015"],
];
const uuid = (n) => `c7${String(n).padStart(2, "0")}0000-0000-4000-8000-0000000000${String(n).padStart(2, "0")}`;
const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const cards = ids.map((v, i) => {
  const [displayName, fullName, displayNameCn, house, primaryTitle, startYear, deathYear, customId] = v;
  const id = uuid(i + 1);
  return { id, firstName: displayName, lastName: "Champagne", displayName, fullName, displayNameCn, fullNameCn: fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear: startYear - 25, deathYear, birthPlace: "County of Champagne", birthPlaceCn: "香槟伯国", deathPlace: "France", deathPlaceCn: "法兰西", gender: "male", dynasty: house, house, culture: "French", faith: "Catholic", primaryTitle, primaryTitleCn: primaryTitle, titles: [{ title: primaryTitle, titleCn: primaryTitle, startYear, endYear: deathYear }], tags: ["count", "noble"], rank: "count", importanceScore: 70, historicalRating: 6, relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] }, events: [{ year: startYear, type: "succession", tags: ["succession", "title"], weight: 72, label: `Succeeded as ${primaryTitle}`, labelCn: `继承${primaryTitle}`, wikiUrl: "https://en.wikipedia.org/wiki/Count_of_Champagne" }, { year: deathYear, type: "death", tags: ["death"], weight: 60, label: "Died", labelCn: "去世", wikiUrl: "https://en.wikipedia.org/wiki/Count_of_Champagne" }], wikiUrl: "https://en.wikipedia.org/wiki/Count_of_Champagne", portraitUrl: "", sourceUrl: "https://en.wikipedia.org/wiki/Count_of_Champagne", sourceNote: "Basic lineage card for the Champagne succession.", notes: "Added for the searchable Champagne lineage; family links will be refined with the title chain.", createdDate: customId.slice(0, 8), createdOrder: Number(customId.slice(8)), historicalRating: 6 };
});
fs.writeFileSync(file, JSON.stringify([...existing, ...cards], null, 2) + "\n");
const manifest = JSON.parse(fs.readFileSync("src/data/people/manifest.json", "utf8"));
if (!manifest.files.includes("temporary-champagne.json")) manifest.files.push("temporary-champagne.json");
for (const card of cards) if (!manifest.order.includes(card.id)) manifest.order.push(card.id);
fs.writeFileSync("src/data/people/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
const index = fs.readFileSync("src/data/people/index.ts", "utf8");
if (!index.includes('import temporaryChampagne from "./temporary-champagne.json";')) {
  fs.writeFileSync("src/data/people/index.ts", index.replace('import temporaryBurgundy from "./temporary-burgundy.json";', 'import temporaryBurgundy from "./temporary-burgundy.json";\nimport temporaryChampagne from "./temporary-champagne.json";').replace("...temporaryBurgundy];", "...temporaryBurgundy, ...temporaryChampagne];"));
}
console.log(`Added ${cards.length} Champagne cards.`);
