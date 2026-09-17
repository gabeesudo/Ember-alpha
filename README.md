# Kaizen — v0.1.0-alpha "Ember"

A React web app for missions, XP, character attributes, and personal progress.
Built with React, TypeScript, TanStack Start, Tailwind CSS, and Supabase.
Development and production builds do not require Lovable or Lovable credits.
This is a responsive web app; native Android/iOS packages are not included.

## Run here

Use Node.js 22.16 or newer and npm (package-lock.json is the canonical lockfile).

1. Run npm ci.
2. Copy .env.example to .env only if you do not already have .env.
3. Fill in the public and server Supabase URL/key pairs for the same project.
4. Run npm run dev -- --host 0.0.0.0 --port 5173.
5. Open http://localhost:5173.

The existing local .env has been preserved. Never commit it. VITE_ settings are
public and embedded at build time; never put a service-role key under that prefix.

## Build and host

Run npm run typecheck, npm run build, then npm start.
The production Node server serves both the React app and its server functions on
port 3000 (or PORT). npm start loads a local .env when present; a hosting service
can provide the same settings as environment variables instead.

Deploy to a Node-capable host: install with npm ci, build with npm run build,
and start with npm start. Supply VITE_SUPABASE_URL and
VITE_SUPABASE_PUBLISHABLE_KEY during the build, and SUPABASE_URL and
SUPABASE_PUBLISHABLE_KEY at runtime. Deploy source plus dependencies and build it,
or deploy the complete .output directory and start .output/server/index.mjs.
The current preset is node-server. This app needs a server; GitHub Pages alone
cannot run its authenticated server functions. Nothing has been deployed yet.

## Edit with GitHub.dev or Codespaces

This imported folder does not currently have a Git remote. Create or choose a
GitHub repository and push these source files to it, excluding .env, .ember,
node_modules, and generated build output. Preserve any existing remote history.
Open the repository on GitHub and press . to edit in github.dev and commit changes.
GitHub.dev has no terminal or running app preview. Use Codespaces (configuration
included) or this local workspace for npm commands and live previews. The included
GitHub Actions workflow checks TypeScript and builds changes with dummy public
configuration; it does not deploy or access your database.

## Design with Figma

Figma is a design source, not the runtime for this app. Share a frame or design
reference here to implement it in React. There is no automatic two-way sync.
Edit src/styles.css for colors, typography, and layout; src/components/ui for
shared controls; src/components/ember-chrome.tsx for branding; src/routes for pages.

## Visual editing with Plasmic

This codebase is linked to the `Kaizen` Plasmic project through `plasmic.json`.
The integration uses Plasmic's TanStack codegen workflow and keeps the original
application routes and Supabase logic in Ember.

- `src/routes/plasmic-host.tsx` is the private app-host route used by Plasmic Studio.
- `src/components/plasmic-ember-components.tsx` exposes the Ember desktop, glass
  windows, pixel icons, and adventurer as visual building blocks.
- `/plasmic-home` renders the Plasmic-managed Homepage. The original landing page
  remains at `/` so a blank Plasmic starter page cannot replace the app entry point.

Run `npm run dev -- --host 127.0.0.1 --port 5173`, then set the Plasmic project's
custom app host to `http://localhost:5173/plasmic-host` while developing. For a
local production preview, `npm start` serves the same route on port 3000.

To pull published Plasmic changes into the repository, run `npx plasmic sync` and
review generated files before committing. Plasmic pages are generated under
`src/components/plasmic-linked`; do not edit those generated files directly.
The `Sync Plasmic designs` GitHub Action can do this automatically for manual
runs or Plasmic `repository_dispatch` events. Add a repository secret named
`PLASMIC_AUTH_JSON` containing the JSON from your local `.plasmic.auth` file;
the file itself and project API tokens are intentionally not committed.

### Vercel deployment

Import `gabeesudo/Ember-alpha` into Vercel and deploy the `main` branch. The
repository sets the TanStack Start framework and npm build commands in
`vercel.json`. Nitro uses the Vercel preset when Vercel's `VERCEL` environment
variable is present, and the standalone Node server preset for local builds.

Before deploying, set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_URL`, and `SUPABASE_PUBLISHABLE_KEY` in the Vercel project's Production
and Preview environments, using the same Supabase project as the local app.
After deployment, set the Plasmic project's custom app host to
`https://YOUR-PRODUCTION-DOMAIN/plasmic-host`. Verify this URL is accessible to
Plasmic Studio; a deployment behind Vercel authentication cannot serve as its
public app host.

## Ember Glass dashboard

The authenticated dashboard blends translucent sage glass with classic desktop
title bars, inset controls, segmented XP, and an animated pixel warrior. Shared
tokens and responsive styles live in `src/styles/glass.css`; the shell is
`src/components/glass-desktop.tsx` and the main panel is
`src/components/dashboard-panel.tsx`.

For a local design review, run the dev server and open
`http://127.0.0.1:5173/design`. This development-only preview uses in-memory sample
data: create and complete quests, change weeks, and try leveling up. Reloading
resets the sample data. The `/dashboard` route uses the signed-in account's real
profile and missions. The preview returns not found in production.

The week starts on Monday. Scheduled quests are grouped by their due date;
undated pending quests appear today, and undated completed quests appear on
their local completion date. Reduced-motion preferences disable the warrior's
animation and interface transitions.

## Database independence

The app uses the existing Supabase-compatible backend directly. Changing the
build does not move its database, users, or account ownership. If that backend
is managed through Lovable Cloud, full account independence still requires a
migration to a Supabase project you control.

For a NEW EMPTY Supabase project, review and run
 drizzle/migrations/0000_create_profiles_and_tasks.sql
in its SQL editor. It contains the tables, RLS policies, profile signup trigger,
and reward/attribute functions used by this app. Do not run the initial migration
against your populated existing database. Set the four environment values above
to the new project, configure its Auth site URL and allowed redirect URLs to match
your local/production URLs, then rebuild. A fresh project starts with no users or
tasks. Preserving existing accounts/data requires an authenticated export/import
and validation; that migration has not been performed. Verify signup, signin,
mission completion and attribute spending before switching production traffic.

## References

- [TanStack hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [GitHub.dev limitations](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor)
