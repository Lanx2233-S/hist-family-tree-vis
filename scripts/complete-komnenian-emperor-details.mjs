import fs from "node:fs";

const file = "src/data/people/house-house-of-komnenos.json";
const people = JSON.parse(fs.readFileSync(file, "utf8"));
const id = { alexios: "1ce160f2-c91e-4a3c-9c39-01f49c7c221e", john: "553a9d7d-4b84-4e4b-92ba-364ba957f16b", manuel: "b894fb91-7dd5-4462-a0b8-df3846062080" };
const url = {
  alexios: "https://en.wikipedia.org/wiki/Alexios_I_Komnenos", john: "https://en.wikipedia.org/wiki/John_II_Komnenos", manuel: "https://en.wikipedia.org/wiki/Manuel_I_Komnenos",
  dyrrhachium: "https://en.wikipedia.org/wiki/Battle_of_Dyrrhachium_(1081)", levounion: "https://en.wikipedia.org/wiki/Battle_of_Levounion", devol: "https://en.wikipedia.org/wiki/Treaty_of_Devol", beroia: "https://en.wikipedia.org/wiki/Battle_of_Beroia", myriokephalon: "https://en.wikipedia.org/wiki/Battle_of_Myriokephalon", sirmium: "https://en.wikipedia.org/wiki/Battle_of_Sirmium", venetians: "https://en.wikipedia.org/wiki/Byzantine%E2%80%93Venetian_war_of_1171",
};
const e = (year, month, day, type, tags, weight, label, labelCn, wikiUrl, note) => ({ year, ...(month ? { month } : {}), ...(day ? { day } : {}), type, tags, weight, label, labelCn, wikiUrl, ...(note ? { note } : {}) });
const byId = new Map(people.map((p) => [p.id, p]));

const alexios = byId.get(id.alexios);
alexios.alsoKnownAs = ["Alexius I Comnenus", "Alexios Komnenos"];
alexios.birthPlace = "Constantinople, Byzantine Empire"; alexios.birthPlaceCn = "拜占庭帝国君士坦丁堡"; alexios.deathPlace = "Constantinople, Byzantine Empire"; alexios.deathPlaceCn = "拜占庭帝国君士坦丁堡";
alexios.events = [
  e(1081, 2, 14, "politics", ["politics", "succession"], 82, "Left Constantinople to secure the throne", "离开君士坦丁堡以争取皇位", url.alexios),
  e(1081, 4, 1, "succession", ["succession", "monarch"], 96, "Entered Constantinople and took power", "进入君士坦丁堡并夺取政权", url.alexios),
  e(1081, 4, 4, "coronation", ["coronation", "monarch"], 96, "Crowned Byzantine Emperor", "加冕为拜占庭皇帝", url.alexios),
  e(1081, 10, 18, "battle", ["battle", "defeat"], 90, "Defeated at Dyrrhachium by Robert Guiscard", "在迪拉基乌姆败于罗贝尔·吉斯卡尔", url.dyrrhachium),
  e(1083, null, null, "battle", ["battle", "defense"], 84, "Defeated the Normans at Larissa", "在拉里萨击败诺曼人", url.alexios, "The campaign is securely dated to 1083; a precise day is not established."),
  e(1091, 4, 29, "battle", ["battle", "defense"], 94, "Defeated the Pechenegs at Levounion", "在勒沃尼翁击败佩切涅格人", url.levounion),
  e(1095, 3, 1, "diplomacy", ["diplomacy", "alliance"], 86, "Appealed for western military aid at Piacenza", "在皮亚琴察请求西方军事援助", "https://crusadesatlas.org/kisi/i-aleksios-komnenos", "Alexios's appeal was made during the council held 1–7 March."),
  e(1097, 6, 19, "conquest", ["conquest", "territory"], 88, "Recovered Nicaea during the First Crusade", "在第一次十字军东征中收复尼西亚", url.alexios),
  e(1098, 6, 28, "battle", ["battle", "defense"], 82, "Defeated Kerbogha outside Antioch", "在安条克城外击败克尔博加", url.alexios, "The victory was won by the crusader army; Alexios's campaign formed part of the wider imperial recovery effort."),
  e(1108, 9, null, "treaty", ["treaty", "diplomacy"], 90, "Concluded the Treaty of Devol with Bohemond", "与博希蒙德缔结德沃尔条约", url.devol, "The treaty is securely dated to September 1108; no reliable day is given."),
  e(1116, null, null, "battle", ["battle", "defense"], 86, "Defeated the Seljuks at Philomelion", "在菲洛梅利翁击败塞尔柱人", url.alexios, "The campaign is dated to 1116; a precise day is not established."),
  e(1118, 8, 15, "death", ["death"], 78, "Died in Constantinople", "在君士坦丁堡去世", url.alexios),
];
alexios.sourceNote = "Anna Komnene, Alexiad; Crusades Research Atlas; modern Komnenian scholarship. Exact day-level fields are used only where the chronology is secure.";
alexios.notes = "Alexios I founded the Komnenian restoration after seizing the throne in 1081. He rebuilt imperial capacity after the Norman invasion and the Pecheneg threat, then managed the First Crusade while recovering key Anatolian territory. The Treaty of Devol placed Bohemond under nominal imperial vassalage, although its terms were never fully implemented.";
alexios.deathCause = { kind: "normal", summary: "Died after illness in Constantinople", summaryCn: "在君士坦丁堡患病去世", detail: "Alexios died on 15 August 1118; the surviving accounts record his final illness but do not permit a modern diagnosis.", detailCn: "阿莱克修斯于 1118 年 8 月 15 日去世；现存记载提到其末期疾病，但不足以作出现代医学诊断。", wikiUrl: url.alexios };

const john = byId.get(id.john);
john.alsoKnownAs = ["John II Comnenus", "John Komnenos the Beautiful"];
john.birthPlace = "Constantinople, Byzantine Empire"; john.birthPlaceCn = "拜占庭帝国君士坦丁堡"; john.deathPlace = "Cilicia, Byzantine Empire"; john.deathPlaceCn = "拜占庭帝国奇里乞亚";
john.events = [
  e(1087, 9, 13, "childbirth", ["dynasty", "monarch"], 58, "Born in Constantinople", "出生于君士坦丁堡", url.john),
  e(1118, 8, 15, "succession", ["succession", "monarch"], 94, "Succeeded Alexios I as Byzantine Emperor", "继承阿莱克修斯一世成为拜占庭皇帝", url.john),
  e(1122, 4, null, "battle", ["battle", "defense"], 88, "Defeated the Pechenegs at Beroia", "在贝罗亚击败佩切涅格人", url.beroia, "The battle is dated to April 1122, but scholars differ over the exact day."),
  e(1124, null, null, "politics", ["politics", "diplomacy"], 76, "Began the conflict with Venice over commercial privileges", "因商业特权问题与威尼斯爆发冲突", url.john, "The conflict began in 1124; a precise starting day is not securely recorded."),
  e(1126, 8, null, "treaty", ["treaty", "diplomacy"], 78, "Renewed Venetian privileges", "重新确认威尼斯特权", url.john, "The renewal is dated to August 1126; no reliable day is given."),
  e(1133, null, null, "conquest", ["conquest", "territory"], 82, "Recovered Paphlagonia and celebrated a triumph", "收复帕夫拉戈尼亚并举行凯旋式", url.john, "The recovery and triumph are dated to 1133; a precise day is not established."),
  e(1137, 8, 29, "siege", ["battle", "territory"], 88, "Reached Antioch and imposed imperial suzerainty", "抵达安条克并迫使其承认帝国宗主权", url.john),
  e(1138, 4, null, "campaign", ["campaign", "diplomacy"], 80, "Led the joint Syrian campaign against Shaizar", "率领联军进攻舍伊扎尔", url.john, "The Shaizar campaign took place in spring 1138; its exact day sequence is not secure."),
  e(1142, null, null, "campaign", ["campaign", "politics"], 76, "Renewed the Antioch expedition", "再度发动安条克远征", url.john, "The campaign is dated to 1142; no precise day is securely recorded."),
  e(1143, 4, 8, "death", ["death"], 82, "Died after a hunting accident in Cilicia", "在奇里乞亚狩猎事故后去世", url.john),
];
john.sourceNote = "John Kinnamos and Niketas Choniates; modern study of John II's reign; exact dates retained only where securely attested.";
john.notes = "John II consolidated the gains of Alexios I and carried the empire's power into the Balkans, Anatolia and Syria. His restoration of influence over Antioch was a high point of Komnenian diplomacy, though the city was not permanently absorbed. He chose his younger son Manuel as successor shortly before his death.";
john.deathCause = { kind: "normal", summary: "Fatal infection after a hunting accident", summaryCn: "狩猎事故后感染致死", detail: "John accidentally wounded his hand with a poisoned arrow while hunting in Cilicia. The wound became infected, and he died on 8 April 1143; assassination theories lack firm contemporary support.", detailCn: "约翰在奇里乞亚狩猎时被毒箭意外划伤手部，伤口感染后于 1143 年 4 月 8 日去世；谋杀说缺乏可靠的同时代证据。", wikiUrl: url.john };

const manuel = byId.get(id.manuel);
manuel.alsoKnownAs = ["Manuel I Comnenus", "Manuel Komnenos"];
manuel.birthPlace = "Constantinople, Byzantine Empire"; manuel.birthPlaceCn = "拜占庭帝国君士坦丁堡"; manuel.deathPlace = "Constantinople, Byzantine Empire"; manuel.deathPlaceCn = "拜占庭帝国君士坦丁堡";
manuel.events = [
  e(1118, 11, 28, "childbirth", ["dynasty", "monarch"], 58, "Born in Constantinople", "出生于君士坦丁堡", url.manuel),
  e(1143, 4, 8, "succession", ["succession", "monarch"], 96, "Succeeded John II as Byzantine Emperor", "继承约翰二世成为拜占庭皇帝", url.manuel),
  e(1146, null, null, "marriage", ["marriage", "dynastic_alliance"], 80, "Married Bertha of Sulzbach", "与苏尔茨巴赫的贝尔塔成婚", url.manuel, "The marriage is dated to 1146; a precise day is not securely attested."),
  e(1147, null, null, "diplomacy", ["diplomacy", "crusade"], 86, "Managed the passage of the Second Crusade", "应对第二次十字军东征过境", url.manuel, "The crucial negotiations and movements occurred across 1147; no single day represents the episode."),
  e(1149, null, null, "defense", ["defense", "battle"], 80, "Recovered Corfu after the Norman raid", "在诺曼袭击后收复科孚", url.manuel, "The recovery campaign is dated to 1149; the exact day is not securely recorded."),
  e(1155, null, null, "campaign", ["campaign", "conquest"], 84, "Launched the Italian expedition against Sicily", "发动反西西里的意大利远征", url.manuel, "The expedition ran from 1155 to 1157; its opening day is not securely recorded."),
  e(1158, null, null, "treaty", ["treaty", "diplomacy"], 78, "Made peace with William I of Sicily", "与西西里的威廉一世议和", url.manuel, "The agreement is dated to 1158; a precise day is not securely attested."),
  e(1159, null, null, "diplomacy", ["diplomacy", "territory"], 84, "Entered Antioch and received recognition of suzerainty", "进入安条克并获承认宗主权", url.manuel, "The ceremonial entry is dated to 1159; the exact day is not securely established."),
  e(1161, null, null, "marriage", ["marriage", "dynastic_alliance"], 82, "Married Maria of Antioch", "与安条克的玛丽亚成婚", "https://en.wikipedia.org/wiki/Maria_of_Antioch", "The marriage is dated to 1161; a precise day is not securely attested."),
  e(1167, 7, 8, "battle", ["battle", "defense"], 88, "Won the Battle of Sirmium", "赢得锡尔米乌姆战役", url.sirmium),
  e(1169, 9, 14, "childbirth", ["dynasty", "succession"], 80, "Birth of heir Alexios II", "继承人阿莱克修斯二世出生", "https://en.wikipedia.org/wiki/Alexios_II_Komnenos", "The date has alternatives in the sources; 14 September 1169 is the convention used here."),
  e(1171, 3, 12, "politics", ["politics", "diplomacy"], 84, "Ordered the arrest of Venetian merchants", "下令逮捕威尼斯商人", url.venetians),
  e(1176, 9, 17, "battle", ["battle", "defeat"], 92, "Defeated at Myriokephalon", "在密里奥刻法隆战败", url.myriokephalon),
  e(1180, 9, 24, "death", ["death"], 82, "Died in Constantinople", "在君士坦丁堡去世", url.manuel),
];
manuel.sourceNote = "Niketas Choniates and John Kinnamos; World History Encyclopedia timeline; modern scholarship on Manuel's reign. Exact day-level fields are used only where securely attested.";
manuel.notes = "Manuel I brought the Komnenian restoration to its widest diplomatic reach. He intervened in Italy, the crusader states, Hungary and the Balkans, while balancing Latin, Seljuk and Venetian interests. The defeat at Myriokephalon did not immediately destroy Byzantine power, but it curtailed his larger Anatolian ambitions and became a defining limit of the reign.";
manuel.deathCause = { kind: "normal", summary: "Died after illness in Constantinople", summaryCn: "在君士坦丁堡患病去世", detail: "Manuel died on 24 September 1180 after an illness; the precise diagnosis is not securely known.", detailCn: "曼努埃尔于 1180 年 9 月 24 日患病去世；具体病因无法可靠确定。", wikiUrl: url.manuel };

fs.writeFileSync(file, `${JSON.stringify(people, null, 2)}\n`);
console.log("[complete-komnenian-emperor-details] expanded Alexios I, John II, and Manuel I timelines");
