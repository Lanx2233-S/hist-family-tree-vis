import fs from "node:fs";

const file = "src/data/people/temporary-anjou.json";
const manifestFile = "src/data/people/manifest.json";
const people = JSON.parse(fs.readFileSync(file, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const template = people.find((p) => p.displayName === "William of Montferrat");
const id = (n) => `c${n}0000-0000-4000-8000-000000000000`;
const make = (n, displayName, fullName, cn, gender, birth, death, title, rank, house, tags) => ({
  ...structuredClone(template), id: id(n), firstName: displayName.split(" ")[0], lastName: "of Montferrat", displayName, fullName,
  displayNameCn: cn, fullNameCn: fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear: birth, deathYear: death,
  gender, dynasty: house, house, primaryTitle: title, primaryTitleCn: title, titles: [{ title, titleCn: title, startYear: "", endYear: death }],
  tags, rank, importanceScore: 45, historicalRating: 5, relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] }, events: [],
  sourceNote: "Basic family card for the Montferrat and Jerusalem lineage.", notes: "Added while completing the Montferrat family.", createdDate: "20260822", createdOrder: 404 + n - 947,
});
const add = (p) => { if (!people.some((x) => x.id === p.id)) people.push(p); };
add(make(964, "William V of Montferrat", "William V, Marquis of Montferrat", "蒙费拉托的威廉五世（长者）", "male", 1115, 1191, "Marquis of Montferrat", "marquis", "House of Aleramici", ["noble", "commander"]));
add(make(965, "Judith of Babenberg", "Judith of Babenberg, Marchioness of Montferrat", "巴本堡的朱迪思", "female", 1120, 1191, "Marchioness of Montferrat", "marchioness", "House of Babenberg", ["noble", "consort"]));
add(make(966, "Boniface I of Montferrat", "Boniface I, Marquis of Montferrat and King of Thessalonica", "蒙费拉托的博尼法斯一世", "male", 1150, 1207, "Marquis of Montferrat", "marquis", "House of Aleramici", ["monarch", "noble", "commander"]));
add(make(967, "Frederick of Montferrat", "Frederick of Montferrat, Bishop of Alba", "蒙费拉托的腓特烈", "male", 1155, 1180, "Bishop of Alba", "bishop", "House of Aleramici", ["noble"]));
add(make(968, "Renier of Montferrat", "Renier of Montferrat, Caesar of the Byzantine Empire", "蒙费拉托的雷涅尔", "male", 1162, 1183, "Caesar of the Byzantine Empire", "noble", "House of Aleramici", ["noble"]));
add(make(969, "Agnes of Montferrat", "Agnes of Montferrat, Countess of Modigliana", "蒙费拉托的阿涅丝", "female", 1155, 1202, "Countess of Modigliana", "countess", "House of Aleramici", ["noble"]));
add(make(970, "Azalaïs of Montferrat", "Azalaïs of Montferrat, Marchioness of Saluzzo", "蒙费拉托的阿扎莱", "female", 1160, 1232, "Marchioness of Saluzzo", "marchioness", "House of Aleramici", ["noble"]));
add(make(971, "Unnamed daughter of William V", "Unnamed daughter of William V of Montferrat", "威廉五世的无名女儿", "female", "", "", "Noblewoman of Montferrat", "noble", "House of Aleramici", ["noble"]));
add(make(972, "Theodora Angelina", "Theodora Angelina", "狄奥多拉·安格洛斯", "female", 1165, "", "Byzantine noblewoman", "noble", "House of Angelos", ["noble", "consort"]));
const byName = (name) => people.find((p) => p.displayName === name);
const setRel = (name, rel) => Object.assign(byName(name).relationships, rel);
setRel("William V of Montferrat", { spouseIds: [id(965)], childIds: ["c9500000-0000-4000-8000-000000000000", "c9560000-0000-4000-8000-000000000000", id(966), id(967), id(968), id(969), id(970), id(971)] });
setRel("Judith of Babenberg", { spouseIds: [id(964)], childIds: ["c9500000-0000-4000-8000-000000000000", "c9560000-0000-4000-8000-000000000000", id(966), id(967), id(968), id(969), id(970), id(971)] });
setRel("William of Montferrat", { fatherId: id(964), motherId: id(965), spouseIds: ["c9450000-0000-4000-8000-000000000041"], childIds: ["c9520000-0000-4000-8000-000000000000"] });
setRel("Conrad of Montferrat", { fatherId: id(964), motherId: id(965), spouseIds: [id(972), "c9460000-0000-4000-8000-000000000042"], childIds: ["c9590000-0000-4000-8000-000000000000"] });
setRel("Theodora Angelina", { spouseIds: ["c9560000-0000-4000-8000-000000000000"] });
for (const [name, rel] of [["Boniface I of Montferrat", { fatherId: id(964), motherId: id(965) }], ["Frederick of Montferrat", { fatherId: id(964), motherId: id(965) }], ["Renier of Montferrat", { fatherId: id(964), motherId: id(965) }], ["Agnes of Montferrat", { fatherId: id(964), motherId: id(965) }], ["Azalaïs of Montferrat", { fatherId: id(964), motherId: id(965) }], ["Unnamed daughter of William V", { fatherId: id(964), motherId: id(965) }]]) setRel(name, rel);
const boniface = byName("Boniface I of Montferrat");
boniface.primaryTitle = "King of Thessalonica";
boniface.primaryTitleCn = "塞萨洛尼基国王";
boniface.titles = [
  { title: "Marquis of Montferrat", titleCn: "蒙费拉托侯爵", startYear: "", endYear: 1207 },
  { title: "King of Thessalonica", titleCn: "塞萨洛尼基国王", startYear: 1205, endYear: 1207 },
];
boniface.fullName = "Boniface I, King of Thessalonica and Marquis of Montferrat";
boniface.fullNameCn = "塞萨洛尼基国王兼蒙费拉托侯爵博尼法斯一世";
for (const n of [964, 965, 966, 967, 968, 969, 970, 971, 972]) if (!manifest.order.includes(id(n))) manifest.order.push(id(n));
fs.writeFileSync(file, `${JSON.stringify(people, null, 2)}\n`);
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[montferrat] ${people.length} records`);
