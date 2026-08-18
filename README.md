# hist-family-tree-vis

`hist-family-tree-vis` is an interactive historical genealogy project inspired by the readable relationship views of Crusader Kings III (CK3). It presents people, family relationships, title succession, events, and historical context as navigable visual records.

The project began with medieval England and the Norman period, and now extends across Wessex, Normandy, Carolingian, Capetian, Plantagenet, Poitevin, and related lines. The current local dataset contains 144 people and is stored in `people.normandy.json`; PostgreSQL is supported for durable records and future expansion.

The app uses React for exploration and PostgreSQL for durable person records. The JSON remains the local demo fallback until a database is configured and seeded.

## Current experience

- **Home** — featured historical entry points grouped by realm and dynasty.
- **Tree** — an interactive family tree with search, relationship navigation, zoom, generations, bilingual labels, and person details.
- **Titles** — title succession as a dedicated lineage, with evolving name forms such as *King of the English* and *King of England*.
- **Data-first records** — people, titles, events, relationships, sources, and bilingual display fields remain separate from presentation code.

## Historical wording

When a detail is uncertain, describe it naturally with terms such as “reportedly” or “so-called”; preserve the uncertainty without flattening the historical voice into overly cautious AI-style prose.

## Local development

1. Create a PostgreSQL database named `hist_family_tree`.
2. Set `DATABASE_URL` from `.env.example` in your shell.
3. Apply `server/schema.sql` with your PostgreSQL client.
4. Run `npm run db:seed` once to import the current historical data.
5. Start the API with `npm run api` and the web app with `npm run dev`.

The person form saves through `POST /api/people`. If the API or database is unavailable, it reports a save error and leaves the current JSON-backed tree unchanged.

## Boundaries

- `src/components/PersonFormModal.tsx`: reusable person-entry form.
- `src/api/peopleApi.ts`: browser-to-API client.
- `src/features/people/peopleSearch.ts`: person search and fuzzy matching.
- `server/index.mjs`: PostgreSQL HTTP API.
- `server/schema.sql`: normalized person, parentage, union, title, tag, and event tables.
- `server/seed.mjs`: idempotent import of `people.normandy.json`.
