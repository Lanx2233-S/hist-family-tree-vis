import { useState } from "react";
import type { Person, PersonEvent } from "../../types";

export type Language = "en" | "cn";

export const tagLabels: Record<string, string> = {
  all: "All", monarch: "Monarch", commander: "Commander", duke: "Duke", queen: "Queen", crusader: "Crusader", noble: "Noble", consort: "Consort", conqueror: "Conqueror", administrator: "Administrator", duchess: "Duchess", clergy: "Clergy", illegitimate: "Illegitimate", partner: "Partner",
};

export const cnTagLabels: Record<string, string> = {
  all: "全部", monarch: "君主", commander: "指挥官", duke: "公爵", queen: "王后", crusader: "十字军", noble: "贵族", consort: "配偶", conqueror: "征服者", administrator: "行政者", duchess: "女公爵", clergy: "教士", illegitimate: "私生子女", partner: "伴侣",
};

export const copy = {
  en: { language: "Language", filters: "Filters", tagFilter: "Tags", tagSearch: "Search tag", genderFilter: "Gender", search: "Search people", male: "Male", female: "Female", culture: "Culture", faith: "Faith", born: "Born", died: "Died", titles: "Titles", events: "Events", topEvents: "Top events", viewAllEvents: "View timeline", wiki: "Open English Wikipedia", eventTag: "Event tag", year: "Year", tags: "Tags", unknown: "Unknown", note: "Note", close: "Close", select: "Select", unionLabel: "MARRIAGE", rootLabel: "FAMILY FOCUS", ariaTree: "Family tree", zoomIn: "Zoom in", zoomOut: "Zoom out", resetZoom: "Reset zoom" },
  cn: { language: "语言", filters: "筛选", tagFilter: "标签", tagSearch: "搜索标签", genderFilter: "性别", search: "搜索人物", male: "男性", female: "女性", culture: "文化", faith: "信仰", born: "出生地", died: "死亡地", titles: "头衔", events: "事件", topEvents: "重要事件", viewAllEvents: "展开时间线", wiki: "打开英文维基百科", eventTag: "事件标签", year: "年份", tags: "标签", unknown: "未知", note: "注释", close: "关闭", select: "选择", unionLabel: "婚姻", rootLabel: "家族焦点", ariaTree: "家谱树", zoomIn: "放大", zoomOut: "缩小", resetZoom: "重置缩放" },
};

const eventTagLabels: Record<string, Record<Language, string>> = {
  title: { en: "TITLE", cn: "头衔" }, marriage: { en: "MARRIAGE", cn: "婚姻" }, alliance: { en: "ALLIANCE", cn: "联盟" }, battle: { en: "BATTLE", cn: "会战" }, campaign: { en: "CAMPAIGN", cn: "战役" }, coronation: { en: "CORONATION", cn: "加冕" }, childbirth: { en: "CHILDBIRTH", cn: "生育" }, dynasty: { en: "DYNASTY", cn: "王朝" }, government: { en: "GOVERNMENT", cn: "政务" }, death: { en: "DEATH", cn: "死亡" }, partner: { en: "PARTNER", cn: "伴侣" }, crusade: { en: "CRUSADE", cn: "十字军" }, conquest: { en: "CONQUEST", cn: "征服" }, commander: { en: "COMMANDER", cn: "指挥官" }, king: { en: "KING", cn: "国王" }, queen: { en: "QUEEN", cn: "王后" }, duke: { en: "DUKE", cn: "公爵" }, law: { en: "LAW", cn: "法令" }, rebellion: { en: "REBELLION", cn: "叛乱" }, administration: { en: "ADMINISTRATION", cn: "行政" }, legal: { en: "LEGAL", cn: "法律" }, politics: { en: "POLITICS", cn: "政治" },
};

export function shortEnglishName(person: Person) {
  if (!person.nickname || person.displayName.toLowerCase().includes(person.nickname.toLowerCase())) return person.displayName;
  return `${person.displayName} ${person.nickname}`;
}

export function textFor(person: Person, _language: Language) {
  return { displayName: person.displayName, fullName: shortEnglishName(person), nickname: person.nickname, primaryTitle: person.primaryTitle, dynasty: person.dynasty, culture: person.culture, faith: person.faith, birthPlace: person.birthPlace, deathPlace: person.deathPlace, title: (title: string) => title, event: (label: string) => label };
}

export function years(person: Person) { return `${person.birthYear || "?"}-${person.deathYear || "?"}`; }
export function lifespan(person: Person) { return person.birthYear && person.deathYear ? `${Number(person.deathYear) - Number(person.birthYear)} years` : "UNKNOWN"; }
export function genderMark(person: Person) { return person.gender === "male" ? "♂" : person.gender === "female" ? "♀" : ""; }
export function initials(person: Person) { return `${person.firstName[0] ?? ""}${person.displayName.match(/\b[IVX]+\b/)?.[0] ?? ""}`; }
export function nodeNameLines(name: string) { if (name.length <= 16) return [name]; const words = name.split(" "); const midpoint = Math.ceil(words.length / 2); return words.length < 2 ? [name] : [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")]; }
export function titleTier(person: Person) { const combined = `${person.rank} ${person.primaryTitle} ${person.titles.map((item) => item.title).join(" ")}`.toLowerCase(); if (combined.includes("emperor")) return "emperor"; if (combined.includes("king") || combined.includes("queen")) return "king"; if (combined.includes("grand duke") || combined.includes("grand duchess")) return "grand-duke"; if (combined.includes("duke") || combined.includes("duchess")) return "duke"; if (combined.includes("count") || combined.includes("countess") || combined.includes("earl")) return "count"; return "untitled"; }
export function eventDateValue(event: PersonEvent) { return Number(event.year || 0) * 10000 + Number(event.month || 1) * 100 + Number(event.day || 1); }
export function byImportance(events: PersonEvent[]) { return [...events].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0) || eventDateValue(a) - eventDateValue(b)); }
export function eventTagText(tag: string, language: Language) { return eventTagLabels[tag]?.[language] ?? tag; }
export function sortPeopleByBirth<T extends { person: Person }>(items: T[]) { return [...items].sort((a, b) => (typeof a.person.birthYear === "number" ? a.person.birthYear : Number.MAX_SAFE_INTEGER) - (typeof b.person.birthYear === "number" ? b.person.birthYear : Number.MAX_SAFE_INTEGER) || a.person.createdOrder - b.person.createdOrder); }
export function eventDateText(event: PersonEvent) { if (!event.year) return "?"; if (event.month && event.day) return `${event.year}.${String(event.month).padStart(2, "0")}.${String(event.day).padStart(2, "0")}`; if (event.month) return `${event.year}.${String(event.month).padStart(2, "0")}`; return String(event.year); }
export function eventAge(person: Person, event: PersonEvent) { return person.birthYear && event.year ? `Age ${Number(event.year) - Number(person.birthYear)}` : ""; }

export function EventNote({ note }: { note?: string }) { return note ? <details className="event-note"><summary>NOTE</summary><p>{note}</p></details> : null; }

export function DeathCauseButton({ person }: { person: Person }) {
  const [isOpen, setOpen] = useState(false);
  const cause = person.deathCause;
  if (!cause) return null;
  const marker = cause.kind === "violent" ? "●" : cause.kind === "violent_uncertain" ? "●?" : cause.kind === "uncertain" ? "○?" : "○";
  return <>{<button type="button" className={`death-cause-button ${cause.kind}`} onClick={() => setOpen(true)} aria-label={`Show death cause for ${person.displayName}`}>{marker}</button>}{isOpen && <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}><section className={`death-modal ${cause.kind}`} role="dialog" aria-modal="true" aria-label={`${person.displayName} death cause`} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Death Cause</p><h3>{person.displayName}</h3></div><button type="button" onClick={() => setOpen(false)}>Close</button></div><p className="death-summary">{cause.summary}</p>{cause.culprit && <p className="death-culprit">{cause.kind === "violent_uncertain" ? "Named figure / disputed intent" : "Culprit"}: {cause.culprit}</p>}<p>{cause.detail}</p>{cause.wikiUrl && <a className="wiki-link" href={cause.wikiUrl} target="_blank" rel="noreferrer">Open English Wikipedia</a>}</section></div>}</>;
}
