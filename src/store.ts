import { create } from "zustand";
import peopleData from "../people.normandy.json";
import type { Person } from "./types";

type FamilyState = {
  people: Person[];
  selectedId: string;
  activeTag: string;
  activeGender: "all" | "male" | "female";
  searchQuery: string;
  language: "en" | "cn";
  zoom: number;
  setSelectedId: (id: string) => void;
  upsertPerson: (person: Person) => void;
  replacePeople: (people: Person[]) => void;
  setActiveTag: (tag: string) => void;
  setActiveGender: (gender: "all" | "male" | "female") => void;
  setSearchQuery: (query: string) => void;
  setLanguage: (language: "en" | "cn") => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
};

export const useFamilyStore = create<FamilyState>((set) => ({
  people: peopleData as Person[],
  selectedId: "21b5ec21-1812-4731-8b03-721988be302f",
  activeTag: "all",
  activeGender: "all",
  searchQuery: "",
  language: "en",
  zoom: 1,
  setSelectedId: (selectedId) => set({ selectedId }),
  upsertPerson: (person) => set((state) => ({
    people: state.people.some((item) => item.id === person.id)
      ? state.people.map((item) => item.id === person.id ? person : item)
      : [...state.people, person],
  })),
  replacePeople: (people) => set({ people }),
  setActiveTag: (activeTag) => set({ activeTag }),
  setActiveGender: (activeGender) => set({ activeGender }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLanguage: (language) => set({ language }),
  zoomIn: () => set((state) => ({ zoom: Math.min(1.6, Number((state.zoom + 0.1).toFixed(2))) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(0.5, Number((state.zoom - 0.1).toFixed(2))) })),
  resetZoom: () => set({ zoom: 1 }),
  // Programmatic zoom used by the fit-to-viewport logic when entering the
  // tree page; clamped to the same range as the manual controls.
  setZoom: (zoom) => set({ zoom: Math.min(1.6, Math.max(0.5, Number(zoom.toFixed(2)))) }),
}));
