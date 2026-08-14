import type { Person } from "../types";

export function years(person: Person) {
  return `${person.birthYear || "?"}-${person.deathYear || "?"}`;
}

export function genderMark(person: Person) {
  return person.gender === "male" ? "♂" : person.gender === "female" ? "♀" : "";
}

export function initials(person: Person) {
  const name = person.displayName || person.firstName;
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

export function titleTier(person: Person) {
  const title = `${person.rank} ${person.primaryTitle}`.toLowerCase();
  if (title.includes("emperor") || title.includes("empress")) return "emperor";
  if (title.includes("king") || title.includes("queen")) return "king";
  if (title.includes("grand duke") || title.includes("grand duchess")) return "grand-duke";
  if (title.includes("duke") || title.includes("duchess")) return "duke";
  if (title.includes("count") || title.includes("countess") || title.includes("earl")) return "count";
  return "untitled";
}
