# Repository Guidelines

## Project Structure & Module Organization
The Next.js app lives under `app/`, following the App Router layout. Shared server actions are centralized in `app/actions.js`, while route-specific UI and data fetching live in `app/dogs/` and other route directories. Reusable components reside in `app/ui/` with matching `.module.scss` styles, and global tokens load from `app/reset.scss` and `app/styles/`. Deployment configuration for `@harperdb/nextjs` is defined in `config.yaml`, and `resources.js` lists the HarperDB resources consumed by server actions.

## Build, Test, and Development Commands
- `npm run dev`: Starts the HarperDB-coupled Next.js dev server on port 9926, bootstrapping the local Harper instance.
- `npm run build`: Creates an optimized production bundle via `harperdb-nextjs build`.
- `npm run start`: Serves the prebuilt bundle; use after running `npm run build`.
- `npm run lint`: Runs `next lint` with the repo ESLint config; resolves TypeScript and JSX issues.
- `npm run format`: Applies the shared Prettier profile to all project files.

## Coding Style & Naming Conventions
Prettier preferences are inherited from `@harperdb/code-guidelines/prettier`, enforcing 2-space indentation, single quotes where possible, and trailing commas. ESLint (configured in `eslint.config.mjs`) should report clean prior to submission. Prefer TypeScript for new components (`.tsx`) and colocate styles as `.module.scss` files mirroring component names. In SCSS, leverage the shared `toRem` helper from `app/styles/_functions.scss`—use rems for sizing by passing pixel values to `toRem` (for example, `toRem(4)` equals `4px`). Server actions should remain in `app/actions.js` and be exported with verb-forward camelCase names (e.g., `listDogs`).

## Testing Guidelines
No automated test suite ships today. New features should include component or integration tests using your team’s selected framework (Vitest, Jest, or Playwright) and expose a matching `npm test` script. Test files should sit alongside source files with `.test.ts(x)` suffixes, and cover primary states (loading, success, failure). Ensure HarperDB interactions are mocked to keep tests deterministic.

## Commit & Pull Request Guidelines
Follow the existing short imperative commit style (`Make updates to start karaoke`). Group logical changes together and keep commits scoped. Pull requests should detail the change, list test evidence (`npm run lint`, custom tests), and link any HarperDB deployment notes or issue trackers. Include screenshots or recordings when altering UI flows, especially within `app/dogs/`.
