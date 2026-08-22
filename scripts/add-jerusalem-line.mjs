import fs from "node:fs";

const file = "src/data/people/temporary-anjou.json";
const people = JSON.parse(fs.readFileSync(file, "utf8"));
const byName = (name) => people.find((p) => p.displayName === name);
const id = (n) => `c${n}0000-0000-4000-8000-000000000000`;
const template = people.find((p) => p.displayName === "Melisende of Jerusalem");
const make = (n, displayName, fullName, cn, gender, birth, death, title, rank, tags = [rank, "noble"]) => ({
  ...structuredClone(template), id: id(n), firstName: displayName.split(" ")[0], lastName: "of Jerusalem", displayName, fullName,
  displayNameCn: cn, fullNameCn: fullName, nickname: "", nicknameCn: "", alsoKnownAs: [], nicknameTags: [], birthYear: birth, deathYear: death,
  gender, dynasty: "House of Anjou", house: "House of Anjou", primaryTitle: title, primaryTitleCn: title, titles: [{ title, titleCn: title, startYear: "", endYear: death },
  ], tags, rank, importanceScore: 50, historicalRating: 5, relationships: { fatherId: "", motherId: "", spouseIds: [], partnerIds: [], childIds: [] }, events: [],
  sourceNote: "Basic family card for the Kingdom of Jerusalem lineage.", notes: "Added for the Jerusalem title lineage.", createdDate: "20260822", createdOrder: 404 + n - 947,
});
const add = (p) => { if (!people.some((x) => x.id === p.id)) people.push(p); };
add(make(947, "Godfrey of Bouillon", "Godfrey of Bouillon, King of Jerusalem", "戈弗雷·德·布永", "male", 1060, 1100, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(948, "Baldwin I of Jerusalem", "Baldwin I, King of Jerusalem", "耶路撒冷的鲍德温一世", "male", 1058, 1118, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(949, "Baldwin II of Jerusalem", "Baldwin II, King of Jerusalem", "耶路撒冷的鲍德温二世", "male", 1075, 1131, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(950, "William of Montferrat", "William of Montferrat, Count of Jaffa and Ascalon", "蒙费拉的威廉（古列尔莫）", "male", 1136, 1177, "Count of Jaffa and Ascalon", "count", ["noble", "commander"]));
add(make(951, "Guy of Lusignan", "Guy of Lusignan, King of Jerusalem", "居伊·德·吕西尼昂", "male", 1150, 1194, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(952, "Baldwin V of Jerusalem", "Baldwin V, King of Jerusalem", "耶路撒冷的鲍德温五世", "male", 1177, 1186, "King of Jerusalem", "king", ["monarch", "noble"]));
add(make(953, "Alice of Jerusalem", "Alice of Jerusalem", "耶路撒冷的爱丽丝", "female", 1180, 1233, "Princess of Jerusalem", "princess", ["princess", "noble"]));
add(make(954, "Maria of Jerusalem", "Maria of Jerusalem", "耶路撒冷的玛丽亚", "female", 1182, 1212, "Princess of Jerusalem", "princess", ["princess", "noble"]));
add(make(955, "Humphrey IV of Toron", "Humphrey IV of Toron", "托龙的翁弗鲁瓦四世", "male", 1166, 1192, "Lord of Toron", "lord", ["noble", "commander"]));
add(make(956, "Conrad of Montferrat", "Conrad of Montferrat, King of Jerusalem", "蒙费拉的康拉德", "male", 1145, 1192, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(957, "Henry II of Champagne", "Henry II, Count of Champagne and King of Jerusalem", "香槟的亨利二世", "male", 1166, 1197, "King of Jerusalem", "king", ["monarch", "noble"]));
add(make(958, "Aimery of Lusignan", "Aimery of Lusignan, King of Jerusalem", "吕西尼昂的埃默里", "male", 1145, 1205, "King of Jerusalem", "king", ["monarch", "commander", "noble"]));
add(make(959, "Maria of Montferrat", "Maria of Montferrat, Queen of Jerusalem", "蒙费拉的玛丽亚", "female", 1192, 1212, "Queen of Jerusalem", "queen", ["monarch", "queen", "noble"]));
add(make(960, "Alice of Champagne", "Alice of Champagne", "香槟的爱丽丝", "female", 1195, 1246, "Princess of Jerusalem", "princess", ["princess", "noble"]));
add(make(961, "Philippa of Champagne", "Philippa of Champagne", "香槟的菲莉帕", "female", 1197, 1250, "Princess of Jerusalem", "princess", ["princess", "noble"]));
add(make(962, "Sibylla of Lusignan", "Sibylla of Lusignan", "吕西尼昂的西比拉", "female", 1198, 1230, "Princess of Jerusalem", "princess", ["princess", "noble"]));
add(make(963, "Melisende of Lusignan", "Melisende of Lusignan", "吕西尼昂的梅利桑德", "female", 1200, 1249, "Princess of Jerusalem", "princess", ["princess", "noble"]));
const setRel = (name, rel) => Object.assign(byName(name).relationships, rel);
setRel("Baldwin I of Jerusalem", { childIds: [] });
setRel("Baldwin II of Jerusalem", { childIds: ["c9390000-0000-4000-8000-000000000035"] });
setRel("Melisende of Jerusalem", { fatherId: id(949), spouseIds: ["c9300000-0000-4000-8000-000000000026"], childIds: ["c9400000-0000-4000-8000-000000000036", "c9410000-0000-4000-8000-000000000037"] });
setRel("Sibylla of Jerusalem", { fatherId: "c9410000-0000-4000-8000-000000000037", spouseIds: [id(950), id(951)], childIds: [id(952), id(953), id(954)] });
setRel("Baldwin V of Jerusalem", { fatherId: id(950), motherId: "c9450000-0000-4000-8000-000000000041" });
setRel("Isabella I of Jerusalem", { spouseIds: [id(955), id(956), id(957), id(958)], childIds: [id(959), id(960), id(961), id(962), id(963)] });
setRel("Alice of Jerusalem", { fatherId: id(951), motherId: "c9450000-0000-4000-8000-000000000041" });
setRel("Maria of Jerusalem", { fatherId: id(951), motherId: "c9450000-0000-4000-8000-000000000041" });
setRel("Maria of Montferrat", { fatherId: id(956), motherId: "c9460000-0000-4000-8000-000000000042" });
setRel("Alice of Champagne", { fatherId: id(957), motherId: "c9460000-0000-4000-8000-000000000042" });
setRel("Philippa of Champagne", { fatherId: id(957), motherId: "c9460000-0000-4000-8000-000000000042" });
setRel("Sibylla of Lusignan", { fatherId: id(958), motherId: "c9460000-0000-4000-8000-000000000042" });
setRel("Melisende of Lusignan", { fatherId: id(958), motherId: "c9460000-0000-4000-8000-000000000042" });
for (const [parent, children] of [["William of Montferrat", [id(952)]], ["Guy of Lusignan", [id(953), id(954)]], ["Humphrey IV of Toron", []], ["Conrad of Montferrat", [id(959)]], ["Henry II of Champagne", [id(960), id(961)]], ["Aimery of Lusignan", [id(962), id(963)]], ["Baldwin IV of Jerusalem", []]]) setRel(parent, { childIds: children });
for (const [name, spouse] of [["Sibylla of Jerusalem", [id(950), id(951)]], ["William of Montferrat", ["c9450000-0000-4000-8000-000000000041"]], ["Guy of Lusignan", ["c9450000-0000-4000-8000-000000000041"]], ["Isabella I of Jerusalem", [id(955), id(956), id(957), id(958)]], ["Humphrey IV of Toron", ["c9460000-0000-4000-8000-000000000042"]], ["Conrad of Montferrat", ["c9460000-0000-4000-8000-000000000042"]], ["Henry II of Champagne", ["c9460000-0000-4000-8000-000000000042"]], ["Aimery of Lusignan", ["c9460000-0000-4000-8000-000000000042"]]]) setRel(name, { spouseIds: spouse });
for (let n = 947; n <= 963; n += 1) people.find((p) => p.id === id(n)).createdOrder = 404 + n - 947;
for (const [n, house] of [[947, "House of Bouillon"], [948, "House of Boulogne"], [949, "House of Rethel"], [950, "House of Montferrat"], [951, "House of Lusignan"], [952, "House of Jerusalem"], [953, "House of Jerusalem"], [954, "House of Jerusalem"], [955, "House of Toron"], [956, "House of Montferrat"], [957, "House of Champagne"], [958, "House of Lusignan"], [959, "House of Montferrat"], [960, "House of Champagne"], [961, "House of Champagne"], [962, "House of Lusignan"], [963, "House of Lusignan"]]) {
  const person = people.find((p) => p.id === id(n));
  person.dynasty = house;
  person.house = house;
}
fs.writeFileSync(file, `${JSON.stringify(people, null, 2)}\n`);
console.log(`[jerusalem] ${people.length} records in ${file}`);
