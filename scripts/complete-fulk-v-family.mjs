import fs from "node:fs";

const file = "src/data/people/temporary-anjou.json";
const fulkId = "c9300000-0000-4000-8000-000000000026";
const geoffroyVId = "cc0cb400-e684-4bdb-b477-9a8fb578f4f5";
const source = "https://en.wikipedia.org/wiki/Fulk_V,_Count_of_Anjou";

const additions = [
  ["c9350000-0000-4000-8000-000000000031", "Ermengarde of Maine", "Ermengarde of Maine, Countess of Anjou", "曼恩的埃芒加德", 1096, 1126, "Countess of Anjou", "安茹伯爵夫人", 5, "", "", [fulkId], [geoffroyVId, "c9360000-0000-4000-8000-000000000032", "c9370000-0000-4000-8000-000000000033", "c9380000-0000-4000-8000-000000000034"]],
  ["c9360000-0000-4000-8000-000000000032", "Matilda of Anjou", "Matilda of Anjou, Countess of Flanders", "安茹的玛蒂尔达", 1102, 1154, "Countess of Flanders", "佛兰德女伯爵", 6, fulkId, "c9350000-0000-4000-8000-000000000031", [], []],
  ["c9370000-0000-4000-8000-000000000033", "Sibylla of Anjou", "Sibylla of Anjou, Countess of Flanders", "安茹的西比拉", 1112, 1165, "Countess of Flanders", "佛兰德女伯爵", 6, fulkId, "c9350000-0000-4000-8000-000000000031", [], []],
  ["c9380000-0000-4000-8000-000000000034", "Elias II of Maine", "Elias II, Count of Maine", "曼恩的埃利亚斯二世", 1113, 1151, "Count of Maine", "曼恩伯爵", 5, fulkId, "c9350000-0000-4000-8000-000000000031", [], []],
  ["c9390000-0000-4000-8000-000000000035", "Melisende of Jerusalem", "Melisende, Queen of Jerusalem", "耶路撒冷的梅丽桑德", 1105, 1161, "Queen of Jerusalem", "耶路撒冷女王", 8, "", "", [fulkId], ["c9400000-0000-4000-8000-000000000036", "c9410000-0000-4000-8000-000000000037"]],
  ["c9400000-0000-4000-8000-000000000036", "Baldwin III of Jerusalem", "Baldwin III, King of Jerusalem", "耶路撒冷的博杜安三世", 1130, 1163, "King of Jerusalem", "耶路撒冷国王", 8, fulkId, "c9390000-0000-4000-8000-000000000035", [], []],
  ["c9410000-0000-4000-8000-000000000037", "Amalric I of Jerusalem", "Amalric I, King of Jerusalem", "耶路撒冷的阿马尔里克一世", 1136, 1174, "King of Jerusalem", "耶路撒冷国王", 8, fulkId, "c9390000-0000-4000-8000-000000000035", ["c9420000-0000-4000-8000-000000000038"], ["c9440000-0000-4000-8000-000000000040", "c9450000-0000-4000-8000-000000000041"]],
  ["c9420000-0000-4000-8000-000000000038", "Agnes of Courtenay", "Agnes of Courtenay, Queen of Jerusalem", "库特奈的艾格尼丝", 1136, 1184, "Queen of Jerusalem", "耶路撒冷王后", 7, "", "", ["c9410000-0000-4000-8000-000000000037"], ["c9440000-0000-4000-8000-000000000040", "c9450000-0000-4000-8000-000000000041"]],
  ["c9430000-0000-4000-8000-000000000039", "Maria Komnene", "Maria Komnene, Queen of Jerusalem", "科穆宁的玛丽亚", 1152, 1182, "Queen of Jerusalem", "耶路撒冷王后", 7, "", "", ["c9410000-0000-4000-8000-000000000037"], ["c9460000-0000-4000-8000-000000000042"]],
  ["c9440000-0000-4000-8000-000000000040", "Baldwin IV of Jerusalem", "Baldwin IV, King of Jerusalem", "耶路撒冷的博杜安四世", 1161, 1185, "King of Jerusalem", "耶路撒冷国王", 9, "c9410000-0000-4000-8000-000000000037", "c9420000-0000-4000-8000-000000000038", [], []],
  ["c9450000-0000-4000-8000-000000000041", "Sibylla of Jerusalem", "Sibylla, Queen of Jerusalem", "耶路撒冷的西比拉", 1159, 1190, "Queen of Jerusalem", "耶路撒冷女王", 8, "c9410000-0000-4000-8000-000000000037", "c9420000-0000-4000-8000-000000000038", [], []],
  ["c9460000-0000-4000-8000-000000000042", "Isabella I of Jerusalem", "Isabella I, Queen of Jerusalem", "耶路撒冷的伊莎贝拉一世", 1172, 1205, "Queen of Jerusalem", "耶路撒冷女王", 8, "c9410000-0000-4000-8000-000000000037", "c9430000-0000-4000-8000-000000000039", [], []],
].map(([id, displayName, fullName, displayNameCn, birthYear, deathYear, title, titleCn, rating, fatherId, motherId, spouseIds, childIds], index) => ({
  id, firstName: displayName.split(" ")[0], lastName: "of Jerusalem", displayName, fullName, displayNameCn, fullNameCn: fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear, deathYear, birthPlace: "Latin East", birthPlaceCn: "拉丁东方", deathPlace: "", deathPlaceCn: "", gender: ["Baldwin III of Jerusalem", "Amalric I of Jerusalem", "Baldwin IV of Jerusalem"].includes(displayName) ? "male" : "female", dynasty: "House of Anjou", house: "House of Anjou", culture: "Frankish", faith: "Catholic", primaryTitle: title, primaryTitleCn: titleCn, titles: [{ title, titleCn, startYear: "", endYear: deathYear }], tags: title.includes("King") ? ["king", "monarch", "noble"] : title.includes("Queen") ? (["Sibylla of Jerusalem", "Isabella I of Jerusalem"].includes(displayName) ? ["queen", "monarch", "noble"] : ["queen", "consort", "noble"]) : ["count", "noble"], rank: title.includes("King") ? "king" : title.includes("Queen") ? "queen" : "count", importanceScore: rating * 10, historicalRating: rating, relationships: { fatherId: fatherId || "", motherId: motherId || "", spouseIds, partnerIds: [], childIds }, events: [], wikiUrl: source, portraitUrl: "", sourceUrl: source, sourceNote: "Basic family card for the Angevin and Jerusalem succession.", notes: "Added to connect Foulques V of Anjou with the Jerusalem royal family.", createdDate: "20260822", createdOrder: index + 43,
}));

const people = JSON.parse(fs.readFileSync(file, "utf8"));
const byId = new Map(people.map((person) => [person.id, person]));
for (const person of additions) byId.set(person.id, person);
const fulk = byId.get(fulkId);
fulk.relationships.spouseIds = [additions[0].id, additions[4].id];
fulk.relationships.childIds = [geoffroyVId, additions[1].id, additions[2].id, additions[3].id, additions[5].id, additions[6].id];
fulk.tags = [...new Set([...fulk.tags, "commander", "monarch"])];
fulk.nickname = "the Young";
fulk.nicknameCn = "青年";
fulk.events = [
  { year: 1109, type: "succession", tags: ["succession", "title"], weight: 84, label: "Succeeded as Count of Anjou", labelCn: "继承安茹伯爵", wikiUrl: source },
  { year: 1110, type: "marriage", tags: ["marriage", "dynastic_alliance"], weight: 78, label: "Married Ermengarde of Maine", labelCn: "与曼恩的埃芒加德成婚", wikiUrl: source },
  { year: 1129, type: "marriage", tags: ["marriage", "dynastic_alliance"], weight: 90, label: "Married Melisende of Jerusalem", labelCn: "与耶路撒冷的梅丽桑德成婚", wikiUrl: source },
  { year: 1131, type: "coronation", tags: ["title", "monarch"], weight: 88, label: "Crowned King of Jerusalem", labelCn: "加冕为耶路撒冷国王", wikiUrl: source },
  { year: 1143, type: "death", tags: ["death"], weight: 76, label: "Died in the Kingdom of Jerusalem", labelCn: "卒于耶路撒冷王国", wikiUrl: source },
];
fulk.sourceNote = "Detailed card: Count of Anjou and King of Jerusalem; father of Geoffrey V and of the Jerusalem kings Baldwin III and Amalric I.";
fulk.notes = "Transferred the Angevin county to his son Geoffrey V before becoming king of Jerusalem through his marriage to Melisende. His Jerusalem sons Baldwin III and Amalric I continued the royal line.";

for (const person of additions) {
  const father = byId.get(person.relationships.fatherId); if (father && !father.relationships.childIds.includes(person.id)) father.relationships.childIds.push(person.id);
  const mother = byId.get(person.relationships.motherId); if (mother && !mother.relationships.childIds.includes(person.id)) mother.relationships.childIds.push(person.id);
  for (const spouseId of person.relationships.spouseIds) { const spouse = byId.get(spouseId); if (spouse && !spouse.relationships.spouseIds.includes(person.id)) spouse.relationships.spouseIds.push(person.id); }
  for (const childId of person.relationships.childIds) {
    const child = byId.get(childId); if (!child) continue;
    if (person.id === fulkId) child.relationships.fatherId = person.id;
    else child.relationships.motherId = person.id;
  }
}
const merged = [...people.filter((person) => !additions.some((addition) => addition.id === person.id)), ...additions];
fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
const manifestPath = "src/data/people/manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const person of additions) if (!manifest.order.includes(person.id)) manifest.order.push(person.id);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Completed Foulques V family and Jerusalem sibling bridge with ${additions.length} cards.`);
