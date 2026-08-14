# hist-family-tree-vis

`hist-family-tree-vis` is a historical family-tree project inspired by Crusader Kings III (CK3). It integrates historical-person records and presents family relationships, titles, events, and other context through an interactive visualization.

The project begins with medieval England, using the Norman period as its first source area. The current dataset contains 47 people and is stored in `people.normandy.json`; PostgreSQL is supported for durable records and future expansion.

The app uses React for exploration and PostgreSQL for durable person records. The existing JSON remains the local demo fallback until a database is configured and seeded.

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
