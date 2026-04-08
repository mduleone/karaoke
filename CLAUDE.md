# Karaoke App

Next.js karaoke song library. Live at mykaraoke.info, deployed on Netlify from `main`.

## Stack
- **Framework:** Next.js (App Router)
- **DB:** Neon (serverless Postgres) + Drizzle ORM — schema in `db/schema.ts`
- **Hosting:** Netlify (not Vercel — moral preference, free tier)
- **Auth:** username + PIN, bcrypt — improvement is a future stretch goal
- **Backups:** GitHub Actions nightly cron, commits JSON to `backups` orphan branch

## Data model (3 tables)
- `songs` — id (uuid), artist, title, notes, username, favorite/duet/learn/retry/avoid (booleans), tags (text[]), createdAt, updatedAt
- `simple_users` — username (PK), passwordHash, createdAt
- `singing_records` — id (uuid), songId (FK→songs), songName, songArtist, username, sungAt

## Dev commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Coding style
- 2-space indentation, single quotes, trailing commas (Prettier enforced)
- Server actions in `app/actions/`, one file per action, exported with verb-forward camelCase
- Reusable components in `app/ui/` with matching `.module.scss` styles
- Prefer TypeScript for new components (`.tsx`)

## Commit preferences
- Short one-line imperative messages — no multi-paragraph descriptions
- Do not add `Co-Authored-By: Claude` trailers
- Do not proactively commit — only commit when explicitly asked

## Future ideas
- Editable `sungAt` on singing records
- UUID FK for user association instead of username string
- Auth improvement (email + password reset via Resend)

## Related paths
- `../MIGRATION.md` — full migration history
- `../karaoke-harper/` — frozen snapshot of the old HarperDB setup
