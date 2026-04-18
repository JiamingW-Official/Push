# Supabase — Push Backend

Backend migration is in progress. See [`../.claude/schema-v1.md`](../.claude/schema-v1.md) for the design rationale and open questions.

## Structure

```
supabase/
├── config.toml                          # CLI + local stack config (major_version 17)
└── migrations/
    └── 20260417000000_schema_v1.sql     # 6 core tables + RLS + triggers
```

## Schema v1 — what's live

| table | purpose | RLS summary |
|-------|---------|-------------|
| `profiles` | 1:1 with `auth.users`, carries role | Self read/update; admin all |
| `creators` | Creator profile + tier + score | Public read; self update; admin all |
| `merchants` | Merchant profile + geo | Public read; self update; admin all |
| `campaigns` | Offer listings with tiered slots + budget | Active rows public; merchant full on own; admin all |
| `qr_codes` | Creator × campaign binding (`short_code` printed on poster) | Public read; creator/merchant full on own; admin all |
| `scans` | Unified event log (scan / verify / conversion) | Public INSERT; creator/merchant scoped read; admin all |

Every mutable table has a `trigger_set_updated_at` trigger. `scans` is append-only (no trigger).

## Local development

```bash
# One-time: install Supabase CLI
brew install supabase/tap/supabase

# Start local Postgres + studio + storage on :54322 / :54323
supabase start

# Apply migrations (runs 20260417000000_schema_v1.sql)
supabase db reset

# Generate TypeScript types from the live schema
supabase gen types typescript --local > ../lib/supabase/types.ts

# Stop when done
supabase stop
```

Studio UI: http://localhost:54323
Inbucket (email catcher): http://localhost:54324

## Environment variables

`.env` files are git-ignored. Create `.env.local` at the repo root with:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-role-key>

# Mock toggle (1 = localStorage mocks, 0 = real /api/* → Supabase)
NEXT_PUBLIC_USE_MOCK=1
```

For `supabase start` (local), the CLI prints URL + keys on boot; paste them into `.env.local` with the `NEXT_PUBLIC_*` prefix.

## Two-project deployment

Per `schema-v1.md` decision:
- **push-prod** — single source of truth, linked to `main` branch
- **push-staging** — linked to `style/v8.2-premium-editorial` and preview PRs

Link a branch to a project:
```bash
supabase link --project-ref <ref>
supabase db push                         # apply local migrations to linked project
```

## Rolling out schema changes

1. Write a new file under `migrations/` with prefix `YYYYMMDDHHMMSS_description.sql`.
2. `supabase db reset` locally to verify it applies cleanly on an empty DB.
3. `supabase db push` against staging. Run smoke tests.
4. Open a PR that touches `migrations/` — Vercel preview deploys should use staging env vars.
5. After merge to `main`, `supabase db push` against production.

Never edit a committed migration — add a new one that ALTERs the previous state.

## What's NOT in v1 (see schema-v1.md for reasoning)

`applications` · `milestones` · `payments` · `disputes` · `verifications` · `notifications` · `audit_log` · `referrals`

These all have shipped UI backed by mock data; schemas arrive incrementally as each feature goes real.
