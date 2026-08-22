import fs from "node:fs";

const file = "src/data/people/temporary-anjou.json";
const foulquesId = "c9250000-0000-4000-8000-000000000021";
const geoffroyMartelId = "c9260000-0000-4000-8000-000000000022";
const geoffroyGatinaisId = "c9270000-0000-4000-8000-000000000023";
const geoffroyBarbuId = "c9280000-0000-4000-8000-000000000024";
const foulquesRechinId = "c9290000-0000-4000-8000-000000000025";
const source = "https://www.larousse.fr/archives/histoire_de_france/page/479";

const additions = [
  { id: "c9310000-0000-4000-8000-000000000027", displayName: "Élisabeth de Vendôme", fullName: "Élisabeth de Vendôme, Countess of Anjou", displayNameCn: "旺多姆的伊丽莎白", birthYear: 970, deathYear: 1000, title: "Countess of Anjou", titleCn: "安茹伯爵夫人", rating: 5, spouseIds: [foulquesId], childIds: ["c9320000-0000-4000-8000-000000000028"] },
  { id: "c9320000-0000-4000-8000-000000000028", displayName: "Adèle de Vendôme-Anjou", fullName: "Adèle de Vendôme-Anjou, Countess of Vendôme", displayNameCn: "旺多姆—安茹的阿黛勒", birthYear: 990, deathYear: 1020, title: "Countess of Vendôme", titleCn: "旺多姆女伯爵", rating: 5, fatherId: foulquesId, motherId: "c9310000-0000-4000-8000-000000000027" },
  { id: "c9330000-0000-4000-8000-000000000029", displayName: "Hildegarde de Sundgau", fullName: "Hildegarde de Sundgau, Countess of Anjou", displayNameCn: "松特高的希尔德加德", birthYear: 980, deathYear: 1046, title: "Countess of Anjou", titleCn: "安茹伯爵夫人", rating: 6, spouseIds: [foulquesId], childIds: [geoffroyMartelId, "c9340000-0000-4000-8000-000000000030"] },
  { id: "c9340000-0000-4000-8000-000000000030", displayName: "Ermengarde-Blanche d'Anjou", fullName: "Ermengarde-Blanche of Anjou", displayNameCn: "安茹的埃芒加德-布朗什", birthYear: 1018, deathYear: 1076, title: "Countess of Gâtinais", titleCn: "加蒂奈伯爵夫人", rating: 6, fatherId: foulquesId, motherId: "c9330000-0000-4000-8000-000000000029", spouseIds: [geoffroyGatinaisId], childIds: [geoffroyBarbuId, foulquesRechinId] },
].map((person, index) => ({
  ...person, firstName: person.displayName.split(" ")[0], lastName: "d'Anjou", fullNameCn: person.fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthPlace: "County of Anjou", birthPlaceCn: "安茹伯国", deathPlace: "", deathPlaceCn: "", gender: "female", dynasty: "House of Anjou", house: "House of Anjou", culture: "French", faith: "Catholic", primaryTitle: person.title, primaryTitleCn: person.titleCn, titles: [{ title: person.title, titleCn: person.titleCn, startYear: "", endYear: person.deathYear }], tags: person.spouseIds ? ["count", "consort", "noble"] : ["count", "noble"], rank: "count", importanceScore: person.rating * 10, historicalRating: person.rating, relationships: { fatherId: person.fatherId ?? "", motherId: person.motherId ?? "", spouseIds: person.spouseIds ?? [], partnerIds: [], childIds: person.childIds ?? [] }, events: [], wikiUrl: source, portraitUrl: "", sourceUrl: source, sourceNote: "Basic family card for Foulques III Nerra's documented wives and children.", notes: "Added while completing Foulques III Nerra's family.", createdDate: "20260822", createdOrder: index + 39,
}));

const people = JSON.parse(fs.readFileSync(file, "utf8"));
const byId = new Map(people.map((person) => [person.id, person]));
const foulques = byId.get(foulquesId);
foulques.nickname = "Nerra";
foulques.nicknameCn = "黑者";
foulques.nicknameTags = ["the Black", "castle builder"];
foulques.tags = [...new Set([...foulques.tags, "commander"])];
foulques.importanceScore = 86;
foulques.historicalRating = 8;
foulques.relationships.spouseIds = additions.filter((person) => person.relationships.spouseIds.includes(foulquesId)).map((person) => person.id);
foulques.relationships.childIds = ["c9320000-0000-4000-8000-000000000028", geoffroyMartelId, "c9340000-0000-4000-8000-000000000030"];
foulques.events = [
  { year: 987, type: "succession", tags: ["succession", "title"], weight: 92, label: "Succeeded as Count of Anjou", labelCn: "继承安茹伯爵", wikiUrl: source },
  { year: 992, type: "battle", tags: ["battle", "commander"], weight: 94, label: "Victory at Conquereuil", labelCn: "孔克勒伊战役获胜", wikiUrl: "https://www.larousse.fr/encyclopedie/groupe-homonymes/Foulques/120030" },
  { year: 994, type: "government", tags: ["administration", "castle"], weight: 86, label: "Fortified the Angevin frontier", labelCn: "强化安茹边境要塞体系", wikiUrl: source },
  { year: 1001, type: "conquest", tags: ["conquest", "commander"], weight: 88, label: "Expanded Angevin control toward Vendôme and Gâtinais", labelCn: "向旺多姆与加蒂奈扩张安茹势力", wikiUrl: source },
  { year: 1002, type: "crusade", tags: ["pilgrimage", "faith"], weight: 72, label: "First pilgrimage to Jerusalem", labelCn: "首次耶路撒冷朝圣", wikiUrl: source },
  { year: 1040, type: "death", tags: ["death"], weight: 76, label: "Died at Metz", labelCn: "卒于梅斯", wikiUrl: source },
];
foulques.sourceNote = "Detailed card: military founder of Angevin territorial power, castle builder, and four-time pilgrim to Jerusalem.";
foulques.notes = "Foulques III Nerra forged Angevin territorial power through warfare, fortification and lordship over neighbouring lands. The dramatic accounts surrounding his first wife Elisabeth are contested; they are not recorded as a definite death cause.";

const geoffroyMartel = byId.get(geoffroyMartelId);
geoffroyMartel.relationships.motherId = "c9330000-0000-4000-8000-000000000029";
const geoffroyGatinais = byId.get(geoffroyGatinaisId);
geoffroyGatinais.relationships.spouseIds = ["c9340000-0000-4000-8000-000000000030"];
for (const childId of [geoffroyBarbuId, foulquesRechinId]) byId.get(childId).relationships.motherId = "c9340000-0000-4000-8000-000000000030";

const merged = [...people.filter((person) => !additions.some((addition) => addition.id === person.id)), ...additions];
fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
const manifestPath = "src/data/people/manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const person of additions) if (!manifest.order.includes(person.id)) manifest.order.push(person.id);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Enhanced Foulques III and added ${additions.length} family cards.`);
