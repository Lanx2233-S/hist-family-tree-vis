import type { Person } from "../types";

export type CreatePersonInput = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  fullName: string;
  gender: "male" | "female" | "unknown";
  birthYear?: number;
  deathYear?: number;
  dynasty?: string;
  primaryTitle?: string;
  rank?: string;
  historicalRating?: number;
  wikiUrl?: string;
  fatherId?: string;
  motherId?: string;
  tags?: string[];
  titleStartYear?: number;
  titleEndYear?: number;
};

export async function createPerson(input: CreatePersonInput) {
  const response = await fetch("/api/people", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await response.json() as { person?: Person; error?: string };
  if (!response.ok || !payload.person) throw new Error(payload.error ?? "Could not save person.");
  return payload.person;
}

export async function loadPeopleFromApi() {
  const response = await fetch("/api/people");
  if (!response.ok) throw new Error("Could not load people.");
  const payload = await response.json() as { people?: Person[] };
  return payload.people ?? [];
}
