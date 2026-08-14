export type Title = {
  title: string;
  startYear: number | "";
  endYear: number | "";
};

export type PersonEvent = {
  year: number | "";
  month?: number | "";
  day?: number | "";
  type: string;
  tags?: string[];
  weight?: number;
  label: string;
  wikiUrl: string;
  note?: string;
};

export type DeathCause = {
  kind: "normal" | "violent" | "violent_uncertain" | "uncertain";
  summary: string;
  detail: string;
  culprit?: string;
  wikiUrl?: string;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  fullName: string;
  nickname: string;
  alsoKnownAs: string[];
  nicknameTags: string[];
  birthYear: number | "";
  deathYear: number | "";
  birthPlace: string;
  deathPlace: string;
  deathCause?: DeathCause;
  gender: string;
  dynasty: string;
  house: string;
  culture: string;
  faith: string;
  primaryTitle: string;
  titles: Title[];
  tags: string[];
  rank: string;
  importanceScore: number;
  relationships: {
    fatherId: string;
    motherId: string;
    spouseIds: string[];
    partnerIds: string[];
    childIds: string[];
  };
  events: PersonEvent[];
  wikiUrl: string;
  portraitUrl: string;
  sourceUrl: string;
  sourceNote: string;
  notes: string;
  createdDate: string;
  createdOrder: number;
};

export type TreeNode = {
  id: string;
  person?: Person;
  name: string;
  type: "person" | "union";
  children?: TreeNode[];
};
