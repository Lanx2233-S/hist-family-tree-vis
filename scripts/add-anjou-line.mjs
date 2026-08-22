import fs from "node:fs";

const geoffroyVId = "cc0cb400-e684-4bdb-b477-9a8fb578f4f5";
const henryIIId = "29e2abba-321e-4090-a35d-10f0bd6a420a";
const peopleFile = "src/data/people/temporary-anjou.json";
const titleFile = "src/data/titles/county-of-anjou.json";
const source = "https://www.larousse.fr/encyclopedie/groupe-personnage/Plantagen%C3%AAt/138392";

const rows = [
  ["c9220000-0000-4000-8000-000000000018", "Foulques I le Roux", "Foulques I the Red, Count of Anjou", "安茹的富尔克一世（红发）", 870, 942, "Count of Anjou", 929, 942, 6, "", ""],
  ["c9230000-0000-4000-8000-000000000019", "Foulques II le Bon", "Foulques II the Good, Count of Anjou", "安茹的富尔克二世（善人）", 910, 960, "Count of Anjou", 942, 960, 6, "c9220000-0000-4000-8000-000000000018", ""],
  ["c9240000-0000-4000-8000-000000000020", "Geoffroy I Grisegonelle", "Geoffroy I Grisegonelle, Count of Anjou", "安茹的若弗鲁瓦一世（灰斗篷）", 940, 987, "Count of Anjou", 960, 987, 7, "c9230000-0000-4000-8000-000000000019", ""],
  ["c9250000-0000-4000-8000-000000000021", "Foulques III Nerra", "Foulques III Nerra, Count of Anjou", "安茹的富尔克三世（内拉）", 972, 1040, "Count of Anjou", 987, 1040, 8, "c9240000-0000-4000-8000-000000000020", ""],
  ["c9260000-0000-4000-8000-000000000022", "Geoffroy II Martel", "Geoffroy II Martel, Count of Anjou", "安茹的若弗鲁瓦二世（铁锤）", 1006, 1060, "Count of Anjou", 1040, 1060, 7, "c9250000-0000-4000-8000-000000000021", ""],
  ["c9270000-0000-4000-8000-000000000023", "Geoffroy de Gâtinais", "Geoffroy de Gâtinais, Count of Gâtinais", "加蒂奈的若弗鲁瓦", 1000, 1043, "Count of Gâtinais", 1020, 1043, 6, "", ""],
  ["c9280000-0000-4000-8000-000000000024", "Geoffroy III le Barbu", "Geoffroy III the Bearded, Count of Anjou", "安茹的若弗鲁瓦三世（大胡子）", 1040, 1096, "Count of Anjou", 1060, 1068, 5, "c9270000-0000-4000-8000-000000000023", ""],
  ["c9290000-0000-4000-8000-000000000025", "Foulques IV le Réchin", "Foulques IV le Réchin, Count of Anjou", "安茹的富尔克四世（争执者）", 1043, 1109, "Count of Anjou", 1068, 1109, 6, "c9270000-0000-4000-8000-000000000023", ""],
  ["c9300000-0000-4000-8000-000000000026", "Foulques V le Jeune", "Foulques V the Young, Count of Anjou", "安茹的富尔克五世（青年）", 1092, 1143, "Count of Anjou", 1109, 1129, 8, "c9290000-0000-4000-8000-000000000025", geoffroyVId],
].map(([id, displayName, fullName, displayNameCn, birthYear, deathYear, primaryTitle, startYear, endYear, historicalRating, fatherId, childId], index) => ({
  id, firstName: displayName.split(" ")[0], lastName: "d'Anjou", displayName, fullName, displayNameCn, fullNameCn: fullName,
  nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear, deathYear, birthPlace: "County of Anjou", birthPlaceCn: "安茹伯国", deathPlace: "", deathPlaceCn: "", gender: "male",
  dynasty: "House of Anjou", house: "House of Anjou", culture: "French", faith: "Catholic", primaryTitle, primaryTitleCn: primaryTitle === "Count of Anjou" ? "安茹伯爵" : "加蒂奈伯爵", titles: [{ title: primaryTitle, titleCn: primaryTitle === "Count of Anjou" ? "安茹伯爵" : "加蒂奈伯爵", startYear, endYear }],
  tags: ["count", "noble"], rank: "count", importanceScore: historicalRating * 10, historicalRating,
  relationships: { fatherId, motherId: "", spouseIds: [], partnerIds: [], childIds: childId ? [childId] : [] }, events: [], wikiUrl: source, portraitUrl: "", sourceUrl: source,
  sourceNote: "Basic card for the Angevin paternal line and the County of Anjou succession.", notes: "Added for Henry II's Angevin paternal ancestry.", createdDate: "20260822", createdOrder: index + 30,
}));

const rowsById = new Map(rows.map((person) => [person.id, person]));
for (const child of rows) {
  const father = rowsById.get(child.relationships.fatherId);
  if (father && !father.relationships.childIds.includes(child.id)) father.relationships.childIds.push(child.id);
}
rowsById.get("c9260000-0000-4000-8000-000000000022").relationships.motherId = "c9330000-0000-4000-8000-000000000029";
rowsById.get("c9280000-0000-4000-8000-000000000024").relationships.motherId = "c9340000-0000-4000-8000-000000000030";
rowsById.get("c9290000-0000-4000-8000-000000000025").relationships.motherId = "c9340000-0000-4000-8000-000000000030";
rowsById.get("c9270000-0000-4000-8000-000000000023").relationships.spouseIds = ["c9340000-0000-4000-8000-000000000030"];

const plantagenetPath = "src/data/people/plantagenet.json";
const plantagenet = JSON.parse(fs.readFileSync(plantagenetPath, "utf8"));
const geoffroyV = plantagenet.find((person) => person.id === geoffroyVId);
const henryII = plantagenet.find((person) => person.id === henryIIId);
geoffroyV.relationships.fatherId = rows.at(-1).id;
if (!rows.at(-1).relationships.childIds.includes(geoffroyVId)) rows.at(-1).relationships.childIds.push(geoffroyVId);
if (!geoffroyV.relationships.childIds.includes(henryIIId)) geoffroyV.relationships.childIds.push(henryIIId);
if (!henryII.relationships.fatherId) henryII.relationships.fatherId = geoffroyVId;
fs.writeFileSync(plantagenetPath, JSON.stringify(plantagenet, null, 2) + "\n");

const existing = fs.existsSync(peopleFile) ? JSON.parse(fs.readFileSync(peopleFile, "utf8")) : [];
fs.writeFileSync(peopleFile, JSON.stringify([...existing.filter((person) => !rows.some((row) => row.id === person.id)), ...rows], null, 2) + "\n");

const holders = [
  ...rows.filter((person) => person.primaryTitle === "Count of Anjou").map((person) => ({ kind: "person", personId: person.id, startYear: person.titles[0].startYear, endYear: person.titles[0].endYear, titleForm: "Count of Anjou", note: "Succeeded as Count of Anjou.", noteCn: "继任安茹伯爵。" })),
  { kind: "person", personId: geoffroyVId, startYear: 1129, endYear: 1151, titleForm: "Count of Anjou", note: "Succeeded Foulques V before uniting Anjou with Normandy through his marriage to Matilda.", noteCn: "继承富尔克五世；后通过与玛蒂尔达的婚姻将安茹与诺曼底结合。" },
  { kind: "person", personId: henryIIId, startYear: 1151, endYear: 1189, titleForm: "Count of Anjou", note: "Succeeded his father Geoffrey V; became King of England in 1154.", noteCn: "继承父亲若弗鲁瓦五世；1154 年成为英格兰国王。" },
];
fs.writeFileSync(titleFile, JSON.stringify({ id: "b4d6b5c0-d1ea-4d4c-af7a-1c903a3b315d", canonicalName: "County of Anjou", canonicalNameCn: "安茹伯国", form: "hereditary county", aliases: ["Count of Anjou", "Anjou", "Comté d'Anjou"], nameForms: [{ name: "County of Anjou", nameCn: "安茹伯国", fromYear: 929, untilYear: 1189, note: "The first Angevin house, from Foulques I to Henry II.", noteCn: "第一安茹家族，自富尔克一世至亨利二世。" }], holders }, null, 2) + "\n");

const manifestPath = "src/data/people/manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (!manifest.files.includes("temporary-anjou.json")) manifest.files.push("temporary-anjou.json");
for (const person of rows) if (!manifest.order.includes(person.id)) manifest.order.push(person.id);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Added ${rows.length} Angevin cards.`);
