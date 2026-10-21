# ChronoGlobe 🌍

**The world is your timeline.** ChronoGlobe is an educational history explorer built around an interactive 3D globe, event discovery, a chronological timeline, and saved learning items.

> This repository is a starter/demo edition. The bundled event records are sample content; verify dates, claims, and citations before using them for academic work.

## Features

- Interactive 3D globe with country selection and historical event markers.
- Search and category filters for the included sample events.
- Event detail drawer with context, impact categories, animation placeholder, and source sections.
- Chronological timeline with era filters.
- Saved events/collections stored in this browser in demo mode.
- Signup and login screens wired for optional Supabase Auth.
- Responsive layout, keyboard focus indicators, reduced-motion support, and PWA manifest.
- Supabase schema with user-scoped RLS policies for profiles, favorites, and classroom tables.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Supabase variables are optional for exploring the sample dataset. Authentication requires valid Supabase credentials.

## Supabase setup (optional)

1. Create a project at [supabase.com](https://supabase.com/).
2. Copy the project URL and anon/public key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Configure the Supabase Auth redirect URL to include `http://localhost:3000/auth/callback` and your deployed domain's callback.
5. Test sign-up and sign-in before relying on account features.

Never put a Supabase service-role key in client-side variables or commit real secrets. Demo favorites are local browser storage; cross-device syncing is not wired in this starter yet.

## Scripts

```bash
npm run dev        # local development
npm run typecheck  # TypeScript checks
npm run lint       # Next.js lint command (requires ESLint configuration/package)
npm run build      # production build
npm start          # serve production build
```

## Project structure

```text
app/                  Next.js App Router pages and API route
components/globe/     3D globe view
components/events/    Event drawer and animation placeholder
components/auth/      Supabase login/signup form
data/                 Sample historical event records
lib/                  Shared types and Supabase client
public/               PWA manifest and icon
supabase/schema.sql   Database bootstrap and RLS policies
```

## Deployment

1. Push this project to a GitHub repository.
2. Import the repository into [Vercel](https://vercel.com/).
3. Set Supabase environment variables in Vercel if using authentication.
4. Deploy and test the globe, auth redirects, mobile layout, and source links on the live URL.

The GitHub repository URL and the deployed website URL are different. A successful GitHub push does not automatically mean the website is deployed.

## Known limitations

- The event catalogue is intentionally small and contains placeholder source entries in the starter data. Replace those with checked sources before public educational use.
- Globe imagery and country boundaries are fetched from public URLs and require an internet connection.
- Favorites are local to this browser; cloud sync is not yet integrated.
- PWA manifest is provided; full offline caching/service-worker behavior is not included.
- Teacher classroom tables are a database foundation, not a complete classroom management feature.

## Contributing

Open an issue to discuss a bug or feature before making a large change. Keep sample data clearly labeled, never commit secrets, and run type checks/builds before submitting changes.
