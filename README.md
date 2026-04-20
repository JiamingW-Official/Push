# Push

Vertical AI for local commerce — coffee shops and neighborhood merchants pay creators only for verified customer acquisition.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router + Turbopack) |
| Runtime | React 19.2 |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| Auth | Supabase Auth + session cookies |
| Deployment | Vercel (Edge middleware for auth + internal-API gating) |
| Tests | Jest |
| Styling | Vanilla CSS with design tokens (see [Design.md](./Design.md)) |

## Quick start

```bash
npm install
cp .env.local.example .env.local    # fill in Supabase project + keys
npm run dev                          # http://localhost:3000
```

## Scripts

```bash
npm run dev           # dev server (Turbopack)
npm run build         # production build
npm run type-check    # tsc --noEmit
npm run lint          # ESLint
npm run test          # Jest
```

## Project layout

```
app/                    # Next.js App Router
  (admin)/              # Admin portal (internal team)
  (creator)/            # Creator workspace + dashboard
  (merchant)/           # Merchant dashboard + campaigns
  (marketing)/          # Public marketing pages
  (public)/             # Public utility pages (scan, verify)
  api/                  # Route handlers — see docs/API.md
lib/
  db/                   # Supabase clients — browser / server / service-role
    browser.ts          #   Client Components
    server.ts           #   Server Components, route handlers, Server Actions
    index.ts            #   Service-role client + CRUD helpers (RLS bypass)
  api/                  # API response helpers (success/badRequest/etc.)
  services/             # Stateless domain services (AI verification, reports)
components/             # React components
middleware.ts           # Auth + internal-API secret gate (Edge)
docs/
  API.md                # Route reference
  DEPLOYMENT.md         # Vercel + Supabase setup
  env-vars.md           # Env var contract
  project-structure.md  # Deeper architecture notes
  schema.sql            # DB schema of record
```

## Environment variables

Production requires all of these set on Vercel. See [docs/env-vars.md](./docs/env-vars.md) for details.

| Variable | Scope | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | all | ✅ | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | all | ✅ | Anon / publishable key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | server | ✅ (prod) | RLS-bypass key — hard throws at boot if missing in production |
| `INTERNAL_API_SECRET` | server | ✅ | Server-to-server secret for `/api/internal/*` |
| `NEXT_PUBLIC_USE_MOCK` | build | optional | `"1"` enables mock data paths (non-prod only) |

## Deployment

```bash
vercel --prod --yes                                  # deploy current branch to production
bash scripts/push-env-to-vercel.sh                   # sync local .env.local → Vercel production
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full runbook including env var setup and post-deploy smoke tests.

## Contributing

- Conventional commits: `feat:` / `fix:` / `refactor:` / `chore:` / `docs:` / `style:`
- Before touching UI: read [Design.md](./Design.md) (design system is enforced)
- Before touching backend: read [CLAUDE.md](./CLAUDE.md) (backend standards)
- All PRs: `npm run type-check && npm run test && npm run build` must pass

## License

Proprietary. © Push 2026.
