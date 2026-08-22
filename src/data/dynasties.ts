export const DYNASTY_HOUSES = {
  "Capetian dynasty": [
    "House of Capet",
    "House of Valois",
    "House of Vermandois",
    "Capetian House of Anjou",
    "House of Valois-Anjou",
    "House of Valois-Burgundy",
    "Elder House of Burgundy",
    "House of Évreux",
    "House of Bourbon",
  ],
  "Blois dynasty": [
    "House of Blois",
    "House of Blois-Champagne",
    "House of Blois-Navarre",
    "House of Champagne",
  ],
  "Plantagenet dynasty": [
    "House of Plantagenet",
    "House of Lancaster",
    "House of York",
  ],
  "Reginar dynasty": ["House of Reginar", "House of Leuven"],
  "Wittelsbach dynasty": [
    "House of Wittelsbach",
    "House of Wittelsbach — Bavaria-Ingolstadt",
  ],
  "Ivrea dynasty": ["House of Burgundy (Iberian)"],
  "Jiménez dynasty": ["House of Jiménez"],
} as const;

export type DynastyName = keyof typeof DYNASTY_HOUSES;
export type DynastyHouse = (typeof DYNASTY_HOUSES)[DynastyName][number];
