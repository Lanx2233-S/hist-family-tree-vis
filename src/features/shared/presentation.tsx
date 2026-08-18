import { useState } from "react";
import type { Person, PersonEvent, Title } from "../../types";

export type Locale = "en" | "cn";
export type Language = Locale;
export type UiCopy = { en: string; cn: string };

// Unified tag labels: one entry per tag, carrying both languages.
export const tagCopy: Record<string, UiCopy> = {
  all: { en: "All", cn: "全部" },
  monarch: { en: "Monarch", cn: "君主" },
  commander: { en: "Commander", cn: "指挥官" },
  duke: { en: "Duke", cn: "公爵" },
  count: { en: "Count", cn: "伯爵" },
  countess: { en: "Countess", cn: "女伯爵" },
  queen: { en: "Queen", cn: "王后" },
  crusader: { en: "Crusader", cn: "十字军" },
  noble: { en: "Noble", cn: "贵族" },
  consort: { en: "Consort", cn: "配偶" },
  conqueror: { en: "Conqueror", cn: "征服者" },
  administrator: { en: "Administrator", cn: "行政者" },
  duchess: { en: "Duchess", cn: "女公爵" },
  clergy: { en: "Clergy", cn: "教士" },
  illegitimate: { en: "Illegitimate", cn: "私生子女" },
  partner: { en: "Partner", cn: "伴侣" },
  emperor: { en: "Emperor", cn: "皇帝" },
  empress: { en: "Empress", cn: "皇后" },
};

// Backward-compatible English/Chinese tag maps.
export const tagLabels: Record<string, string> = Object.fromEntries(
  Object.entries(tagCopy).map(([key, value]) => [key, value.en]),
);
export const cnTagLabels: Record<string, string> = Object.fromEntries(
  Object.entries(tagCopy).map(([key, value]) => [key, value.cn]),
);

export function tagText(tag: string, language: Locale) {
  return tagCopy[tag]?.[language] ?? tag;
}

// The single source of UI copy. Every entry carries both languages so a
// missing translation is a type error rather than a silent English fallback.
export const copy = {
  // Toolbar / chrome
  language: { en: "Language", cn: "语言" },
  filters: { en: "Filters", cn: "筛选" },
  tagFilter: { en: "Tags", cn: "标签" },
  tagSearch: { en: "Search tag", cn: "搜索标签" },
  genderFilter: { en: "Gender", cn: "性别" },
  search: { en: "Search people", cn: "搜索人物" },
  male: { en: "Male", cn: "男性" },
  female: { en: "Female", cn: "女性" },
  all: { en: "All", cn: "全部" },
  noMatchingPeople: { en: "No matching people", cn: "无匹配人物" },
  addPerson: { en: "+ Person", cn: "+ 人物" },
  familyTree: { en: "Family Tree", cn: "家族树" },
  documentTitle: { en: "Historical Family Tree", cn: "历史人物家谱" },
  tagsPlaceholder: { en: "monarch, commander, noble", cn: "如 monarch, commander, noble" },
  // Detail panel
  culture: { en: "Culture", cn: "文化" },
  faith: { en: "Faith", cn: "信仰" },
  born: { en: "Born", cn: "出生地" },
  died: { en: "Died", cn: "死亡地" },
  titles: { en: "Titles", cn: "头衔" },
  events: { en: "Events", cn: "事件" },
  topEvents: { en: "Top events", cn: "重要事件" },
  viewAllEvents: { en: "View timeline", cn: "展开时间线" },
  wiki: { en: "Open English Wikipedia", cn: "打开英文维基百科" },
  eventTag: { en: "Event tag", cn: "事件标签" },
  year: { en: "Year", cn: "年份" },
  tags: { en: "Tags", cn: "标签" },
  unknown: { en: "Unknown", cn: "未知" },
  note: { en: "Note", cn: "注释" },
  close: { en: "Close", cn: "关闭" },
  select: { en: "Select", cn: "选择" },
  unionLabel: { en: "MARRIAGE", cn: "婚姻" },
  rootLabel: { en: "FAMILY FOCUS", cn: "家族焦点" },
  ariaTree: { en: "Family tree", cn: "家谱树" },
  zoomIn: { en: "Zoom in", cn: "放大" },
  zoomOut: { en: "Zoom out", cn: "缩小" },
  resetZoom: { en: "Reset zoom", cn: "重置缩放" },
  // Tree navigation controls
  back: { en: "Back", cn: "返回" },
  home: { en: "Home", cn: "首页" },
  reset: { en: "reset", cn: "重置" },
  generationUnit: { en: "gen", cn: "代" },
  generationDepth: { en: "Generation depth", cn: "世代深度" },
  treeNavigation: { en: "Tree navigation", cn: "家谱导航" },
  zoomControls: { en: "Zoom controls", cn: "缩放控制" },
  centerFocus: { en: "Center focused person", cn: "聚焦当前人物" },
  partner: { en: "PARTNER", cn: "伴侣" },
  formerUnion: { en: "FORMER UNION", cn: "前婚" },
  // Page tabs
  pages: { en: "Pages", cn: "页面" },
  homePage: { en: "Home Page", cn: "首页" },
  treePage: { en: "Tree Page", cn: "家谱页" },
  titlesPage: { en: "Titles", cn: "头衔谱系" },
  // Title lineage page
  titleLineage: { en: "Title Lineage", cn: "头衔谱系" },
  currentTitle: { en: "Current Title", cn: "当前头衔" },
  nameEvolution: { en: "Name Evolution", cn: "名称演变" },
  titleHolders: { en: "Holders", cn: "持有者" },
  reignYears: { en: "Reign", cn: "在位" },
  titlePersonMissing: { en: "Person record not found", cn: "未找到人物记录" },
  treeIntro: { en: "Start with William I, or search for any historical figure.", cn: "从征服者威廉开始，或搜索任意历史人物。" },
  treeCatalogIntro: { en: "Choose a house, or search for any historical figure.", cn: "选择一个家族入口，或搜索任意历史人物。" },
  titleIntro: { en: "Start with a title, then follow how it passed between rulers.", cn: "从一项头衔开始，追踪它如何在统治者之间传承。" },
  searchTitles: { en: "Search titles", cn: "搜索头衔" },
  noMatchingTitles: { en: "No matching titles", cn: "没有匹配的头衔" },
  // Protagonist page
  historicalFamilyTree: { en: "Historical Family Tree", cn: "历史人物家谱" },
  selectHighlightedProtagonist: { en: "Select Highlighted Protagonist", cn: "选择主角人物" },
  chooseYourHistoricalFocus: { en: "Choose Your Historical Focus", cn: "选择你的历史焦点" },
  startFromFeaturedRuler: { en: "Start from a featured ruler or queen, then enter the family tree with that character centered.", cn: "从一位知名统治者或王后开始，随后以该人物为中心进入家谱。" },
  historicalRegions: { en: "Historical regions", cn: "历史区域" },
  realm: { en: "Realm", cn: "王国" },
  england: { en: "England", cn: "英格兰" },
  france: { en: "France", cn: "法兰西" },
  englandLines: { en: "Norman, Plantagenet, Yorkist, and Tudor lines", cn: "诺曼、金雀花、约克与都铎世系" },
  frenchLines: { en: "Capetian, Valois, and Bourbon lines", cn: "卡佩、瓦卢瓦与波旁世系" },
  collectionOpeningSoon: { en: "Collection opening soon", cn: "即将开放" },
  featuredFigures: { en: "Featured figures", cn: "精选人物" },
  previousEnglandProtagonists: { en: "Previous England protagonists", cn: "上一组英格兰主角" },
  nextEnglandProtagonists: { en: "Next England protagonists", cn: "下一组英格兰主角" },
  previousProtagonists: { en: "Previous protagonists", cn: "上一组主角" },
  nextProtagonists: { en: "Next protagonists", cn: "下一组主角" },
  frenchFamilyTrees: { en: "French family trees", cn: "法国家族树" },
  realmReserved: { en: "This realm is reserved for the next collection.", cn: "此区域保留给下一批收藏。" },
  returnToEngland: { en: "Return to England", cn: "返回英格兰" },
  enterTree: { en: "Enter tree", cn: "进入家谱" },
  phase: { en: "Phase", cn: "阶段" },
  pickToneNorman: { en: "Conquest, succession, and the first English crown of the Norman line.", cn: "征服、继承，以及诺曼世系的第一顶英格兰王冠。" },
  pickToneAngevin: { en: "Aquitaine, two crowns, rebellion, and the Plantagenet succession storm.", cn: "阿基坦、两顶王冠、叛乱，以及金雀花的继承风暴。" },
  pickTonePlantagenet: { en: "From Edward I through Edward III, the Black Prince, and Richard II.", cn: "从爱德华一世经爱德华三世、黑太子，到理查二世。" },
  pickToneYorkist: { en: "The Clarence-Mortimer line into Edward IV and the Wars of the Roses.", cn: "克莱伦斯—莫蒂默世系通向爱德华四世与玫瑰战争。" },
  pickToneTudor: { en: "From the Yorkist succession to the last Tudor monarch and the Elizabethan age.", cn: "从约克继承到末代都铎君主与伊丽莎白时代。" },
  pickToneFrenchLouis: { en: "The Capetian crown takes root around Paris and the royal domain begins to consolidate.", cn: "卡佩王冠在巴黎周边扎根，王室领地开始逐步巩固。" },
  pickToneFrenchPhilip: { en: "Philip Augustus turns the Capetian monarchy into a dominant French power.", cn: "腓力·奥古斯都将卡佩王权塑造成法兰西的主导力量。" },
  pickToneCharlemagne: { en: "The Frankish kingdom becomes a Carolingian empire spanning western Europe.", cn: "法兰克王国扩展为横跨西欧的加洛林帝国。" },
  // Person form
  databaseEntry: { en: "DATABASE ENTRY", cn: "数据库条目" },
  addPersonTitle: { en: "Add person", cn: "添加人物" },
  firstName: { en: "First name", cn: "名" },
  lastName: { en: "Last name", cn: "姓" },
  displayName: { en: "Display name", cn: "显示名" },
  fullName: { en: "Full name", cn: "全名" },
  birthYear: { en: "Born", cn: "出生年份" },
  deathYear: { en: "Died", cn: "卒年" },
  gender: { en: "Gender", cn: "性别" },
  rank: { en: "Rank", cn: "等级" },
  dynasty: { en: "Dynasty", cn: "王朝" },
  primaryTitle: { en: "Primary title", cn: "主头衔" },
  father: { en: "Father", cn: "父亲" },
  mother: { en: "Mother", cn: "母亲" },
  tagsLabel: { en: "Tags", cn: "标签" },
  englishWikipedia: { en: "English Wikipedia", cn: "英文维基百科" },
  idLabel: { en: "ID", cn: "ID" },
  cancel: { en: "Cancel", cn: "取消" },
  savePerson: { en: "Save person", cn: "保存人物" },
  saving: { en: "Saving", cn: "保存中" },
  couldNotSave: { en: "Could not save person.", cn: "无法保存人物。" },
  untitled: { en: "Untitled", cn: "无头衔" },
  count: { en: "Count", cn: "伯爵" },
  duke: { en: "Duke", cn: "公爵" },
  king: { en: "King", cn: "国王" },
  queen: { en: "Queen", cn: "王后" },
  emperor: { en: "Emperor", cn: "皇帝" },
  // Relationship, death-cause, and timeline copy
  show: { en: "Show", cn: "显示" },
  previousSpouse: { en: "Previous spouse", cn: "上一个配偶" },
  nextSpouse: { en: "Next spouse", cn: "下一个配偶" },
  toggleParents: { en: "Toggle parents", cn: "切换父母" },
  toggleSpouses: { en: "Toggle spouses", cn: "切换配偶" },
  toggleChildren: { en: "Toggle children", cn: "切换子女" },
  toggleDescendants: { en: "Toggle descendants", cn: "切换后代" },
  toggleRelationshipsFor: { en: "Toggle relationships for {name}", cn: "切换 {name} 的配偶" },
  collapseAncestorsAbove: { en: "Collapse ancestors above {name}", cn: "收起 {name} 上方的祖先" },
  extendAncestorsFrom: { en: "Extend ancestors from {name}", cn: "从 {name} 展开祖先" },
  extendAncestorLineFrom: { en: "Extend ancestor line from {name}", cn: "从 {name} 展开祖先世系" },
  extendAncestorLine: { en: "Extend ancestor line", cn: "展开祖先世系" },
  collapseAncestorLine: { en: "Collapse ancestor line", cn: "收起祖先世系" },
  hide: { en: "Hide {name}", cn: "隐藏 {name}" },
  extendDescendantsFrom: { en: "Extend descendants from {name}", cn: "展开 {name} 的后代" },
  collapseActiveAncestorFirst: { en: "Collapse the active ancestor branch first", cn: "请先收起当前祖先分支" },
  deathCause: { en: "Death Cause", cn: "死亡原因" },
  culprit: { en: "Culprit", cn: "元凶" },
  namedFigureDisputedIntent: { en: "Named figure / disputed intent", cn: "具名人物 / 意图存疑" },
  showDeathCauseFor: { en: "Show death cause for {name}", cn: "显示 {name} 的死因" },
  deathCauseAria: { en: "{name} death cause", cn: "{name} 的死因" },
  age: { en: "Age", cn: "年龄" },
  yearsUnit: { en: "years", cn: "岁" },
} as const;

export type CopyKey = keyof typeof copy;

export function copyFor(language: Locale): Record<CopyKey, string> {
  return Object.fromEntries(
    (Object.keys(copy) as CopyKey[]).map((key) => [key, copy[key][language]]),
  ) as Record<CopyKey, string>;
}

export function uiText(language: Locale, key: CopyKey): string {
  return copy[key][language];
}

export function fillCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

const eventTagLabels: Record<string, Record<Locale, string>> = {
  all: { en: "All", cn: "全部" },
  title: { en: "TITLE", cn: "头衔" }, marriage: { en: "MARRIAGE", cn: "婚姻" }, alliance: { en: "ALLIANCE", cn: "联盟" }, battle: { en: "BATTLE", cn: "会战" }, campaign: { en: "CAMPAIGN", cn: "战役" }, coronation: { en: "CORONATION", cn: "加冕" }, childbirth: { en: "CHILDBIRTH", cn: "生育" }, dynasty: { en: "DYNASTY", cn: "王朝" }, government: { en: "GOVERNMENT", cn: "政务" }, death: { en: "DEATH", cn: "死亡" }, partner: { en: "PARTNER", cn: "伴侣" }, crusade: { en: "CRUSADE", cn: "十字军" }, conquest: { en: "CONQUEST", cn: "征服" }, commander: { en: "COMMANDER", cn: "指挥官" }, king: { en: "KING", cn: "国王" }, queen: { en: "QUEEN", cn: "王后" }, duke: { en: "DUKE", cn: "公爵" }, law: { en: "LAW", cn: "法令" }, rebellion: { en: "REBELLION", cn: "叛乱" }, administration: { en: "ADMINISTRATION", cn: "行政" }, legal: { en: "LEGAL", cn: "法律" }, politics: { en: "POLITICS", cn: "政治" },
  annulment: { en: "ANNULMENT", cn: "婚姻无效" },
  church: { en: "CHURCH", cn: "教会" },
  defeat: { en: "DEFEAT", cn: "战败" },
  defense: { en: "DEFENSE", cn: "防御" },
  diplomacy: { en: "DIPLOMACY", cn: "外交" },
  dynastic_alliance: { en: "DYNASTIC ALLIANCE", cn: "王朝联姻" },
  imprisonment: { en: "IMPRISONMENT", cn: "囚禁" },
  main_commander: { en: "MAIN COMMANDER", cn: "主帅" },
  monarch: { en: "MONARCH", cn: "君主" },
  noble: { en: "NOBLE", cn: "贵族" },
  pacification: { en: "PACIFICATION", cn: "平定" },
  political_crisis: { en: "POLITICAL CRISIS", cn: "政治危机" },
  reformation: { en: "REFORMATION", cn: "宗教改革" },
  regency: { en: "REGENCY", cn: "摄政" },
  religion: { en: "RELIGION", cn: "宗教" },
  succession: { en: "SUCCESSION", cn: "继承" },
  territory: { en: "TERRITORY", cn: "领土" },
  title_acquired: { en: "TITLE ACQUIRED", cn: "获得头衔" },
  treaty: { en: "TREATY", cn: "条约" },
  uncertain: { en: "UNCERTAIN", cn: "存疑" },
  violent: { en: "VIOLENT", cn: "非自然死亡" },
};

export function shortEnglishName(person: Person) {
  if (!person.nickname || person.displayName.toLowerCase().includes(person.nickname.toLowerCase())) return person.displayName;
  return `${person.displayName} ${person.nickname}`;
}

// Static Chinese mappings for shared vocabulary. These live in the
// presentation layer (not per-record data) because the strings repeat across
// many people and the DB schema intentionally stays English-only.
const titleCnMap: Record<string, string> = {
  "Archbishop of York": "约克大主教",
  "Bishop-elect of Durham": "达勒姆主教当选人",
  "Count of Anjou": "安茹伯爵",
  "Count of Poitiers": "普瓦捷伯爵",
  "Count of Rouen": "鲁昂伯爵",
  "Countess of Anjou": "安茹伯爵夫人",
  "Countess of Blois": "布卢瓦伯爵夫人",
  "Countess of Champagne": "香槟伯爵夫人",
  "Countess of Ulster": "阿尔斯特伯爵夫人",
  "Duchess of Aquitaine": "阿基坦女公爵",
  "Duchess of Normandy": "诺曼底女公爵",
  "Duchess of Saxony": "萨克森公爵夫人",
  "Duke of Aquitaine": "阿基坦公爵",
  "Duke of Brittany": "布列塔尼公爵",
  "Duke of Clarence": "克拉伦斯公爵",
  "Duke of Lancaster": "兰开斯特公爵",
  "Duke of Normandy": "诺曼底公爵",
  "Duke of York": "约克公爵",
  "Earl of March": "马奇伯爵",
  "Earl of Salisbury": "索尔兹伯里伯爵",
  "English prince": "英格兰王子",
  "Holy Roman Emperor": "神圣罗马帝国皇帝",
  "Holy Roman Empress": "神圣罗马帝国皇后",
  "Junior King of England": "英格兰共治国王",
  "King of England": "英格兰国王",
  "King of France": "法兰西国王",
  "King of Germany": "德意志国王",
  "King of Ireland": "爱尔兰国王",
  "King of Wessex": "威塞克斯国王",
  "King of the Anglo-Saxons": "盎格鲁-撒克逊人的国王",
  "King of the English": "英格兰人的国王",
  "King of the Franks": "法兰克人国王",
  "King of West Francia": "西法兰克国王",
  "Lady of the English": "英格兰人的夫人",
  "Lord of Ireland": "爱尔兰领主",
  Noblewoman: "女贵族",
  "Partner of Henry II": "亨利二世的伴侣",
  "Prince of Wales": "威尔士亲王",
  "Queen of Castile": "卡斯蒂利亚王后",
  "Queen of England": "英格兰王后",
  "Queen of France": "法兰西王后",
  "Queen of Scotland": "苏格兰王后",
  "Queen of Sicily": "西西里王后",
};

const cultureCnMap: Record<string, string> = {
  Norman: "诺曼人",
  Flemish: "佛兰德人",
  German: "德意志人",
  Angevin: "安茹人",
  Occitan: "奥克人",
  English: "英格兰人",
  French: "法兰西人",
  "Anglo-Norman": "盎格鲁-诺曼人",
  Welsh: "威尔士人",
  Norse: "诺斯人",
  "Anglo-Saxon": "盎格鲁-撒克逊人",
  Scottish: "苏格兰人",
};

const faithCnMap: Record<string, string> = {
  Catholic: "天主教",
  Anglican: "圣公会",
};

const dynastyCnMap: Record<string, string> = {
  "House of Normandy": "诺曼王朝",
  "House of Flanders": "佛兰德家族",
  "Salian dynasty": "萨利安王朝",
  "House of Plantagenet": "金雀花王朝",
  "House of Poitiers": "普瓦捷家族",
  "House of Capet": "卡佩王朝",
  "House of Mortimer": "莫蒂默家族",
  "House of Wessex": "威塞克斯王朝",
  "House of Dunkeld": "邓凯尔德王朝",
  "House of York": "约克家族",
  "House of Tudor": "都铎王朝",
};

export function titleCn(title: string) {
  return titleCnMap[title] ?? title;
}

export function cultureCn(culture: string) {
  return cultureCnMap[culture] ?? culture;
}

export function faithCn(faith: string) {
  return faithCnMap[faith] ?? faith;
}

export function dynastyCn(dynasty: string) {
  return dynastyCnMap[dynasty] ?? dynasty;
}

const heraldryByDynasty: Record<string, string> = {
  "House of Normandy": "/images/Normandy.png",
  "House of Plantagenet": "/images/Plantagenet.png",
  "House of Capet": "/images/Capet.png",
  "House of Poitiers": "/images/Poitiers.png",
  "Carolingian dynasty": "/images/Charlemagne.png",
  "House of Wessex": "/images/Wessex.png",
};

// Geoffrey V's documented blue shield with six gold lions needs its own asset,
// so do not substitute the later English three-lions arms for him.
export function heraldryFor(person: Person) {
  if (person.id === "cc0cb400-e684-4bdb-b477-9a8fb578f4f5") return undefined;
  const src = heraldryByDynasty[person.dynasty];
  return src ? { src, alt: `${person.dynasty} heraldry` } : undefined;
}

// The single source of localized person display. In CN mode every field uses
// its Chinese counterpart when recorded, and falls back to the English
// canonical value otherwise (e.g. people created through the form or loaded
// from the database before CN fields exist there).
export function textFor(person: Person, language: Language) {
  const useCn = language === "cn";
  return {
    displayName: useCn ? person.displayNameCn || person.displayName : person.displayName,
    fullName: useCn ? person.fullNameCn || shortEnglishName(person) : shortEnglishName(person),
    nickname: useCn ? person.nicknameCn || person.nickname : person.nickname,
    primaryTitle: useCn ? person.primaryTitleCn || titleCn(person.primaryTitle) : person.primaryTitle,
    dynasty: useCn ? dynastyCn(person.dynasty) : person.dynasty,
    culture: useCn ? cultureCn(person.culture) : person.culture,
    faith: useCn ? faithCn(person.faith) : person.faith,
    birthPlace: useCn ? person.birthPlaceCn || person.birthPlace : person.birthPlace,
    deathPlace: useCn ? person.deathPlaceCn || person.deathPlace : person.deathPlace,
    // Title objects carry their own optional titleCn (e.g. database rows);
    // prefer it over the static map, which stays as the shared-vocabulary fallback.
    title: (title: Title) => useCn ? title.titleCn || titleCn(title.title) : title.title,
    event: (label: string) => label,
  };
}

export function eventLabelText(event: PersonEvent, language: Language) {
  return language === "cn" ? event.labelCn || event.label : event.label;
}

export function years(person: Person) { return `${person.birthYear || "?"}-${person.deathYear || "?"}`; }
export function lifespan(person: Person, language: Locale) { const t = copyFor(language); return person.birthYear && person.deathYear ? `${Number(person.deathYear) - Number(person.birthYear)} ${t.yearsUnit}` : t.unknown; }
export function genderMark(person: Person) { return person.gender === "male" ? "♂" : person.gender === "female" ? "♀" : ""; }
export function initials(person: Person, language?: Language) {
  // CN mode: the first two characters of the Chinese display name fit the
  // avatar circle; EN mode keeps the initial + regnal-number pattern.
  if (language === "cn") return (person.displayNameCn || person.displayName).replace(/\s+/g, "").slice(0, 2);
  return `${person.firstName[0] ?? ""}${person.displayName.match(/\b[IVX]+\b/)?.[0] ?? ""}`;
}
export function nodeNameLines(name: string) { if (name.length <= 16) return [name]; const words = name.split(" "); const midpoint = Math.ceil(words.length / 2); return words.length < 2 ? [name] : [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")]; }
export function titleTier(person: Person) {
  // Henry VI's French claim is retained as historical data, but does not
  // control card styling in the current English-focused lineage.
  if (person.id === "0a1a85b3-53e9-45fa-a90f-2b07d78191c4") return "king";
  const combined = `${person.rank} ${person.primaryTitle} ${person.titles.map((item) => item.title).join(" ")}`.toLowerCase();
  if (combined.includes("empress")) return "empress";
  if (combined.includes("emperor")) return "emperor";
  if (person.tags.includes("consort") && combined.includes("queen")) return "queen-consort";
  if (combined.includes("king of france")) return "supreme-king";
  if (combined.includes("queen of france")) return "france-queen";
  if (combined.includes("grand duke") || combined.includes("grand duchess")) return "king";
  if (combined.includes("king") || combined.includes("queen")) return "king";
  if (combined.includes("duke") || combined.includes("duchess")) return "duke";
  if (combined.includes("count") || combined.includes("countess") || combined.includes("earl")) return "count";
  return "untitled";
}
export function eventDateValue(event: PersonEvent) { return Number(event.year || 0) * 10000 + Number(event.month || 1) * 100 + Number(event.day || 1); }
export function byImportance(events: PersonEvent[]) { return [...events].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0) || eventDateValue(a) - eventDateValue(b)); }
export function eventTagText(tag: string, language: Locale) { return eventTagLabels[tag]?.[language] ?? tag; }
export function sortPeopleByBirth<T extends { person: Person }>(items: T[]) { return [...items].sort((a, b) => (typeof a.person.birthYear === "number" ? a.person.birthYear : Number.MAX_SAFE_INTEGER) - (typeof b.person.birthYear === "number" ? b.person.birthYear : Number.MAX_SAFE_INTEGER) || a.person.createdOrder - b.person.createdOrder); }
export function eventDateText(event: PersonEvent) { if (!event.year) return "?"; if (event.month && event.day) return `${event.year}.${String(event.month).padStart(2, "0")}.${String(event.day).padStart(2, "0")}`; if (event.month) return `${event.year}.${String(event.month).padStart(2, "0")}`; return String(event.year); }
export function eventAge(person: Person, event: PersonEvent, language: Locale) { return person.birthYear && event.year ? `${copyFor(language).age} ${Number(event.year) - Number(person.birthYear)}` : ""; }

export function EventNote({ note, language }: { note?: string; language: Locale }) { return note ? <details className="event-note"><summary>{copyFor(language).note}</summary><p>{note}</p></details> : null; }

export function DeathCauseButton({ person, language }: { person: Person; language: Locale }) {
  const [isOpen, setOpen] = useState(false);
  const t = copyFor(language);
  const cause = person.deathCause;
  if (!cause) return null;
  const useCn = language === "cn";
  const name = useCn ? person.displayNameCn || person.displayName : person.displayName;
  const summary = useCn ? cause.summaryCn || cause.summary : cause.summary;
  const detail = useCn ? cause.detailCn || cause.detail : cause.detail;
  const culprit = useCn ? cause.culpritCn || cause.culprit : cause.culprit;
  const marker = cause.kind === "violent" ? "●" : cause.kind === "violent_uncertain" ? "●?" : cause.kind === "uncertain" ? "○?" : "○";
  return <>{<button type="button" className={`death-cause-button ${cause.kind}`} onClick={() => setOpen(true)} aria-label={fillCopy(t.showDeathCauseFor, { name })}>{marker}</button>}{isOpen && <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}><section className={`death-modal ${cause.kind}`} role="dialog" aria-modal="true" aria-label={fillCopy(t.deathCauseAria, { name })} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">{t.deathCause}</p><h3>{name}</h3></div><button type="button" onClick={() => setOpen(false)}>{t.close}</button></div><p className="death-summary">{summary}</p>{culprit && <p className="death-culprit">{cause.kind === "violent_uncertain" ? t.namedFigureDisputedIntent : t.culprit}: {culprit}</p>}<p>{detail}</p>{cause.wikiUrl && <a className="wiki-link" href={cause.wikiUrl} target="_blank" rel="noreferrer">{t.wiki}</a>}</section></div>}</>;
}
