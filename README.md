# Student Record Viewer

A Vite + React student dashboard built from the supplied guided-project references. Bootstrap provides the interface, while an optional Express + MongoDB API supplies persisted records.

## Included features

- Reusable `StudentCard` and `StudentList` components
- Controlled search and section-filter inputs
- `reduce()`-based average calculation and derived 75% pass/fail status
- Filtered-record, passing-record, and class-average summaries
- Bootstrap responsive cards, forms, badges, and empty state
- MongoDB model, seed script, and `GET /api/students` endpoint

## Run with local starter data

```bash
npm run dev
```

The starter records load by default, so no database is required to explore the UI.

## Enable MongoDB

1. In `server`, copy `env.example` to `.env` and set `MONGODB_URI` (local MongoDB or Atlas).
2. Run `npm install --prefix server`.
3. Seed the database with `npm run seed`.
4. Start the API with `npm run server`.
5. In the project root, copy `env.example` to `.env` and set `VITE_USE_API=true`.
6. Start the Vite app with `npm run dev`.

The React app will then fetch `VITE_API_URL` instead of using its bundled starter records. If that API is unavailable, it gracefully falls back to the starter data.
