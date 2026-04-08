# Repository Guidelines

## Project Structure
The Next.js app uses the App Router. Key directories:
- `app/` — routes, layout, global styles
- `app/actions/` — server actions, one file per action (verb-forward camelCase, e.g. `listSongs.ts`)
- `app/components/` — reusable components
- `app/styles/` — global tokens and SCSS helpers
- `db/schema.ts` — Drizzle ORM schema (3 tables: `songs`, `simple_users`, `singing_records`)
- `scripts/` — utility scripts (e.g. backup)
- `.github/workflows/` — GitHub Actions (nightly backup cron)

## Build & Dev Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Coding Style
- 2-space indentation, single quotes, trailing commas (Prettier enforced via `prettier.config.js`)
- ESLint config in `eslint.config.mjs` — should be clean before submitting
- Prefer TypeScript for new files; colocate styles as `.module.scss`
- In SCSS, use the `toRem` helper from `app/styles/_functions.scss` for sizing
- Server actions live in `app/actions/`, one file per action, exported with verb-forward camelCase

## Commit Guidelines
- Short one-line imperative messages (e.g. `Add retry flag to songs table`)
- No `Co-Authored-By` trailers
- Group logical changes; keep commits scoped
