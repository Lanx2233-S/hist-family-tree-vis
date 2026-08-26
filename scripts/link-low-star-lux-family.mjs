import { readFile, writeFile } from 'node:fs/promises';

const peopleDir = new URL('../src/data/people/', import.meta.url);
const load = async (file) => JSON.parse(await readFile(new URL(file, peopleDir), 'utf8'));
const save = async (file, data) => writeFile(new URL(file, peopleDir), `${JSON.stringify(data, null, 2)}\n`);

const luxFile = 'house-house-of-luxembourg.json';
const burgundyFile = 'house-house-of-valois-burgundy.json';
const barFile = 'house-house-of-bar.json';
const avesnesFile = 'house-house-of-avesnes.json';
const manifestFile = 'manifest.json';

const lux = await load(luxFile);
const burgundy = await load(burgundyFile);
const bar = await load(barFile);
const avesnes = await load(avesnesFile);
const manifest = await load(manifestFile);

const walI = 'b3ca17c5-7d25-4af3-ba7e-cf52dba0ebc7';
const wal = 'b461f739-f808-4cab-98ab-95cc89ba824d';
const william = '8b233cc8-e4dd-4f26-97d8-bf5ef6f176fc';
const henryV = 'ea407d24-5168-4822-8223-7084318eaa3a';
const margaretBar = '8f0a169f-0eba-48d5-8593-1e0e9e340e26';
const henryVI = '4c98a079-295a-4554-b6c6-96c8e947cd11';
const beatrice = '22f4d5e6-90f8-4638-8526-97fb3651f6e1';
const antony = 'c1015000-0000-4000-8000-000000000000';
const elisabeth = 'da3659e6-83af-4afa-a772-f0c508664dfc';

const basic = (overrides) => ({
  firstName: '', lastName: '', displayName: '', fullName: '', nickname: '', alsoKnownAs: [],
  nicknameTags: [], displayNameCn: '', fullNameCn: '', nicknameCn: '', birthYear: null, deathYear: null,
  birthPlace: '', birthPlaceCn: '', deathPlace: '', deathPlaceCn: '', gender: '', dynasty: '', house: '',
  culture: '', faith: '', primaryTitle: '', primaryTitleCn: '', titles: [], tags: ['noble'], rank: 'noble',
  importanceScore: 0, relationships: { fatherId: '', motherId: '', spouseIds: [], partnerIds: [], childIds: [] },
  events: [], wikiUrl: '', portraitUrl: '', sourceUrl: '', sourceNote: '', notes: '', historicalRating: 1,
  createdDate: '20260823', createdOrder: null, ...overrides,
});

const addIfMissing = (people, person) => {
  if (!people.some(({ id }) => id === person.id)) people.push(person);
};
const byId = (people, id) => {
  const person = people.find((candidate) => candidate.id === id);
  if (!person) throw new Error(`Missing person ${id}`);
  return person;
};
const addChild = (person, childId) => {
  if (!person.relationships.childIds.includes(childId)) person.relationships.childIds.push(childId);
};
const removeUnlinked = (person, phrase) => {
  person.notes = person.notes.replace(`Unlinked family: ${phrase} (not uniquely matched in the roster); `, 'Unlinked family: ');
  person.notes = person.notes.replace(`; ${phrase} (not uniquely matched in the roster)`, '');
  person.notes = person.notes.replace(`Unlinked family: ${phrase} (not uniquely matched in the roster).`, '');
};

addIfMissing(lux, basic({
  id: walI, firstName: 'Waleran', lastName: 'of Luxembourg', displayName: 'Waleran I, Lord of Ligny',
  fullName: 'Waleran I of Luxembourg, Lord of Ligny', displayNameCn: '利尼领主瓦勒兰一世',
  fullNameCn: '利尼领主卢森堡的瓦勒兰一世', gender: 'male', dynasty: 'Luxembourg dynasty',
  house: 'House of Luxembourg', culture: 'Lotharingian-German', faith: 'Catholic',
  primaryTitle: 'Lord of Ligny', primaryTitleCn: '利尼领主',
  relationships: { fatherId: henryV, motherId: margaretBar, spouseIds: [], partnerIds: [], childIds: [] },
  importanceScore: 28, historicalRating: 3, sourceUrl: 'https://www.deutsche-biographie.de/gnd124958524.html',
  sourceNote: 'Named in the local Henry V and Margaret of Bar research notes as their son and Lord of Ligny.',
  notes: 'Basic card created solely from the locally recorded family identification; dates are not supplied there.',
}));
addIfMissing(lux, basic({
  id: wal, firstName: 'Waleran', lastName: 'of Luxembourg', displayName: 'Waleran of Luxembourg',
  fullName: 'Waleran of Luxembourg', displayNameCn: '卢森堡的瓦勒兰', fullNameCn: '卢森堡的瓦勒兰',
  gender: 'male', dynasty: 'Luxembourg dynasty', house: 'House of Luxembourg', culture: 'Lotharingian-German',
  faith: 'Catholic', relationships: { fatherId: henryVI, motherId: beatrice, spouseIds: [], partnerIds: [], childIds: [] },
  importanceScore: 18, historicalRating: 2, sourceUrl: 'https://www.deutsche-biographie.de/gnd137945345.html',
  sourceNote: 'Named in the local Henry VI and Beatrice of Avesnes research notes as their child.',
  notes: 'Basic card created solely from the locally recorded family identification; dates and title are not supplied there.',
}));
addIfMissing(burgundy, basic({
  id: william, firstName: 'William', lastName: 'of Brabant', displayName: 'William of Brabant',
  fullName: 'William of Brabant', displayNameCn: '布拉班特的威廉', fullNameCn: '布拉班特的威廉',
  birthYear: 1410, deathYear: 1410, gender: 'male', dynasty: 'Capetian dynasty', house: 'House of Valois-Burgundy',
  culture: 'French', faith: 'Catholic',
  relationships: { fatherId: antony, motherId: elisabeth, spouseIds: [], partnerIds: [], childIds: [] },
  importanceScore: 5, historicalRating: 1, sourceUrl: 'https://www.deutsche-biographie.de/gnd136846629.html',
  sourceNote: 'Named in the local Elisabeth of Görlitz research note as the son from her first marriage, born and died in 1410.',
  notes: 'Basic card created solely from the local note. Some modern summaries describe the marriage as childless; the source note records this child with that caveat.',
}));

addChild(byId(lux, henryV), walI);
addChild(byId(bar, margaretBar), walI);
addChild(byId(lux, henryVI), wal);
addChild(byId(avesnes, beatrice), wal);
addChild(byId(burgundy, antony), william);
addChild(byId(lux, elisabeth), william);

removeUnlinked(byId(lux, henryV), 'Waleran I, Lord of Ligny');
removeUnlinked(byId(bar, margaretBar), 'Waleran I, Lord of Ligny');
removeUnlinked(byId(lux, henryVI), 'Waleran of Luxembourg');
removeUnlinked(byId(avesnes, beatrice), 'Waleran of Luxembourg');
removeUnlinked(byId(lux, elisabeth), 'William of Brabant');

for (const id of [walI, wal, william]) {
  if (!manifest.order.includes(id)) manifest.order.push(id);
}

await Promise.all([
  save(luxFile, lux), save(burgundyFile, burgundy), save(barFile, bar), save(avesnesFile, avesnes), save(manifestFile, manifest),
]);
