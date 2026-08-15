import type { Person } from "../../types";

function normalizedSearchText(value: string) {
  // Keep Unicode letters (CJK included) and numbers; drop punctuation, spaces,
  // and case so both English and Chinese queries normalize consistently.
  return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function editDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const stored = previous[column];
      previous[column] = Math.min(previous[column] + 1, previous[column - 1] + 1, diagonal + (left[row - 1] === right[column - 1] ? 0 : 1));
      diagonal = stored;
    }
  }
  return previous[right.length];
}

export function peopleSearchResults(people: Person[], query: string) {
  const normalizedQuery = normalizedSearchText(query.trim());
  if (!normalizedQuery) return [];

  return people
    .map((person) => {
      // English canonical fields plus Chinese display fields, so the same
      // query matches in either language.
      const normalizedValues = [
        person.displayName, person.fullName, ...person.alsoKnownAs,
        person.displayNameCn ?? "", person.fullNameCn ?? "", person.nicknameCn ?? "", person.primaryTitleCn ?? "",
      ].map(normalizedSearchText).filter(Boolean);
      const directMatch = normalizedValues.reduce((best, value) => {
        const index = value.indexOf(normalizedQuery);
        return index >= 0 ? Math.min(best, index) : best;
      }, Number.POSITIVE_INFINITY);
      const closestDistance = normalizedValues.reduce((best, value) => Math.min(best, editDistance(normalizedQuery, value)), Number.POSITIVE_INFINITY);
      const fuzzyLimit = Math.max(1, Math.min(3, Math.floor(normalizedQuery.length / 3) + 1));
      if (!Number.isFinite(directMatch) && closestDistance > fuzzyLimit) return null;
      return { person, directMatch, closestDistance };
    })
    .filter((result): result is { person: Person; directMatch: number; closestDistance: number } => Boolean(result))
    .sort((left, right) => {
      const leftDirect = Number.isFinite(left.directMatch);
      const rightDirect = Number.isFinite(right.directMatch);
      if (leftDirect !== rightDirect) return leftDirect ? -1 : 1;
      if (left.directMatch !== right.directMatch) return left.directMatch - right.directMatch;
      if (left.closestDistance !== right.closestDistance) return left.closestDistance - right.closestDistance;
      return left.person.createdOrder - right.person.createdOrder;
    })
    .slice(0, 7);
}
