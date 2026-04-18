# Supabase — Push Backend

The live schema was authored in two migrations on `main` (initial + creator_extended). A v2 redesign was proposed in [`../.claude/schema-v1.md`](../.claude/schema-v1.md) but is currently **superseded** — see that doc for the open questions about money as cents, unified events, and profile-based auth.

## Structure

```
supabase/
├── config.toml                              # CLI + local stack config (major_version 17)
└── migrations/
    ├── 20260412000000_initial_schema.sql    # users, creators, merchants, campaigns, campaign_applications
    └── 20260412000001_creator_extended.sql  # tier, push_score, creator_submissions, creator_payouts, qr_scans
```

## Live tables

| table | purpose | notes |
|-------|---------|-------|
| `users` | App-level mirror of `auth.users` with role (creator / merchant) | Auto-created by `handle_new_user` trigger on auth signup |
| `creators` | Creator profile + tier + push_score + earnings | `user_id` FK to users.id; 6-tier enum (seed → partner); `recalculate_push_score(creator_id)` pg function |
| `merchants` | Merchant profile + address + contact | `user_id` FK to users.id |
| `campaigns` | Campaign posts with payout, spots, status | `merchant_id` FK; money as NUMERIC(10,2) USD |
| `campaign_applications` | Creator → campaign join with status | UNIQUE(creator_id, campaign_id); pending → accepted / rejected / withdrawn |
| `creator_submissions` | Milestone tracking per application | 7-stage milestone enum, ratings, engagement rate |
| `creator_payouts` | Payout records per submission | Supports instant / same_day / t1-t3 speeds |
| `qr_scans` | QR attribution events | `scan_source` default 'post'; `ip_hash` + `device_fingerprint` for anti-fraud |

All RLS-enabled. Service role bypasses. Creator/merchant scoped via `user_id = auth.uid()` joins.

## Local development

**Prerequisites:**
- Docker Desktop running (`supabase start` spins up containers). Install: `brew install --cask docker`, then open Docker Desktop from Applications, accept the license, give it disk access.
- Supabase CLI installed (`brew install supabase/tap/supabase`).

```bash
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
