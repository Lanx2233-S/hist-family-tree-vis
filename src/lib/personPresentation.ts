import type { Person } from "../types";

export function years(person: Person) {
  return `${person.birthYear || "?"}-${person.deathYear || "?"}`;
}

export function genderMark(person: Person) {
  return person.gender === "male" ? "♂" : person.gender === "female" ? "♀" : "";
}

export function initials(person: Person, language?: "en" | "cn") {
  // CN mode: the first two characters of the Chinese display name; EN mode:
  // uppercase initials from the English display name, capped at three.
  if (language === "cn") return (person.displayNameCn || person.displayName).replace(/\s+/g, "").slice(0, 2);
  const name = person.displayName || person.firstName;
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

export function titleTier(person: Person) {
  // Religious sovereign styling is tag-led rather than title-string-led:
  // caliphs retain the green sovereign fill, while prophets remain a unique
  // exceptional tier so future special figures can receive their own rules.
  if (person.tags.includes("prophet")) return "prophet";
  if (person.tags.includes("caliph")) return "caliph";
  const title = `${person.rank} ${person.primaryTitle}`.toLowerCase();
  if (title.includes("emperor") || title.includes("empress")) return "emperor";
  if (title.includes("king") || title.includes("queen")) return "king";
  if (title.includes("grand duke") || title.includes("grand duchess")) return "grand-duke";
  if (title.includes("duke") || title.includes("duchess")) return "duke";
  if (title.includes("count") || title.includes("countess") || title.includes("earl")) return "count";
  return "untitled";
}
