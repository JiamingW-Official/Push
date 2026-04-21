# Supabase Schema v1 — Design Proposal

> ## ⚠️ SUPERSEDED on 2026-04-18
>
> This doc was written without checking `supabase/migrations/` first. The repo
> **already ships** two migrations on `main` that define an incompatible
> schema (`public.users` + `creators.user_id` + NUMERIC money + `qr_scans`
> single-event table). 8+ pages (signup, dashboard, messages, etc.) already
> import `@/lib/supabase` and query those tables.
>
> My original migration `20260417000000_schema_v1.sql` was removed because it
> collided with the existing `creators`/`merchants`/`campaigns` tables.
>
> **This document is retained as a v2 REDESIGN PROPOSAL** for a future session
> to evaluate. If adopted, it must be delivered as ALTER-based migrations that
> evolve the existing tables, not as a from-scratch rewrite (which would break
> every page that already queries the legacy shape).
>
> **Active schema:** see `supabase/migrations/20260412*` and the table reference
> at the bottom of `supabase/README.md`.

**Date:** 2026-04-17
**Status:** SUPERSEDED — retained as v2 redesign proposal
**Scope:** 6 core tables covering the scan→verify→payout loop. Admin/ops tables (disputes, audit_log, cohorts, verifications, invoices) are v2.

---

## Design decisions (call out before building)

### 1. Auth model — `auth.users` + `public.profiles`
- Supabase ships `auth.users` for email/password + OAuth. Do not reinvent.
- Add `public.profiles` 1:1 with `auth.users` storing app-level fields (role, display_name, avatar_url, created_at).
- `role` enum: `creator | merchant | admin` — drives RLS. A single user cannot hold multiple roles in v1 (simpler RLS); revisit if a creator wants to list their own shop as a merchant.

### 2. IDs — uuid + slug
- Primary keys: `uuid` (Supabase default, safe for distributed inserts).
- Keep a `slug` column where the existing mock uses readable IDs (`crt_a1b2`, `cmp_001`) so URLs and scan QR codes stay portable.
- `short_code` on `qr_codes` is the user-facing 6–8 char code printed on posters — separate from slug.

### 3. Events table — unified, not three
- Merge `ScanEvent / VerifyEvent / ConversionEvent` (from `lib/attribution/track.ts`) into one `scans` table with `event_type` enum.
- Rationale: admin fraud queries (`/admin/fraud`) need to aggregate by `session_id` + `ip_hash` across all three events. One table = one index.
- Trade-off: `amount` and `evidence_type` become nullable. Acceptable — we add a CHECK constraint.

### 4. Two QR schemas need merging
- `lib/data/types.ts::QRCode` is lean (6 fields).
- `lib/attribution/mock-qr-codes.ts::MockQRCode` has ~20 fields (offerTier1/2, heroSlotsTotal/Used, business_address, lat/lng).
- **v1 decision:** keep `qr_codes` lean; move offer/tier/slot data to the **campaign** (where it belongs — one merchant defines their offer once, many QR codes inherit).
- `qr_codes.creator_id` + `qr_codes.campaign_id` is the unique binding. Offer details come via `JOIN campaigns`.

### 5. No soft delete in v1
- Hard DELETE; audit trail lives in the admin `audit_log` table (v2).
- Exception: `campaigns.status = 'cancelled'` is not a delete — row stays for historical scan attribution.

### 6. `push_score` / `tier` — stored, not computed
- Compute via scheduled pg function (nightly cron) or edge function triggered on payout.
- Store on `creators` row for read hot-path speed. Add `score_updated_at` for staleness check.

### 7. `updated_at` triggers everywhere
- One `trigger_set_updated_at` pg function, attach to every mutable table. Standard Supabase pattern.

### 8. RLS — deny by default, explicit allow
- Every table has `alter table ... enable row level security;`
- Policies below table definitions.

---

## SQL sketch

```sql
-- ═══════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════

create type user_role as enum ('creator', 'merchant', 'admin');

create type creator_tier as enum (
  'seed', 'explorer', 'operator', 'proven', 'closer', 'partner'
);

create type campaign_status as enum (
  'draft', 'active', 'paused', 'completed', 'cancelled'
);

create type scan_event_type as enum ('scan', 'verify', 'conversion');

-- ═══════════════════════════════════════════════════════════
-- profiles  (1:1 with auth.users)
-- ═══════════════════════════════════════════════════════════

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role not null,
  email         text not null unique,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_profiles_role on profiles(role);

-- RLS
alter table profiles enable row level security;

create policy "profiles_self_read" on profiles
  for select using (auth.uid() = id);

create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id);

create policy "profiles_admin_all" on profiles
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════
-- creators
-- ═══════════════════════════════════════════════════════════

create table public.creators (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid not null unique references profiles(id) on delete cascade,
  slug                  text not null unique,             -- e.g. "maya-eats-nyc"
  display_name          text not null,
  bio                   text,
  location_label        text,                             -- "Williamsburg, Brooklyn"
  lat                   double precision,
  lng                   double precision,
  instagram_handle      text,
  instagram_followers   integer default 0,
  tiktok_handle         text,
  tiktok_followers      integer default 0,
  tier                  creator_tier not null default 'seed',
  push_score            integer not null default 0 check (push_score between 0 and 100),
  score_updated_at      timestamptz default now(),
  campaigns_completed   integer not null default 0,
  campaigns_accepted    integer not null default 0,
  earnings_total_cents  bigint not null default 0,        -- money in cents (never float!)
  earnings_pending_cents bigint not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_creators_slug on creators(slug);
create index idx_creators_tier on creators(tier);
create index idx_creators_push_score on creators(push_score desc);
create index idx_creators_location on creators(lat, lng);

alter table creators enable row level security;

-- Creators read their own row
create policy "creators_self_read" on creators
  for select using (profile_id = auth.uid());

-- Creators are publicly viewable (portfolio pages /c/[slug])
create policy "creators_public_read" on creators
  for select using (true);

-- Creators can edit only their own
create policy "creators_self_update" on creators
  for update using (profile_id = auth.uid());

create policy "creators_admin_all" on creators
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════
-- merchants
-- ═══════════════════════════════════════════════════════════

create table public.merchants (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid not null unique references profiles(id) on delete cascade,
  slug                  text not null unique,
  business_name         text not null,
  category              text not null,                    -- "Coffee", "Food", "Wellness"
  business_address      text,
  neighborhood          text,                             -- "SoHo", "Williamsburg"
  lat                   double precision,
  lng                   double precision,
  logo_url              text,
  website               text,
  total_spent_cents     bigint not null default 0,
  active_campaigns_count integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_merchants_slug on merchants(slug);
create index idx_merchants_category on merchants(category);
create index idx_merchants_neighborhood on merchants(neighborhood);
create index idx_merchants_location on merchants(lat, lng);

alter table merchants enable row level security;
create policy "merchants_public_read" on merchants for select using (true);
create policy "merchants_self_update" on merchants for update using (profile_id = auth.uid());
create policy "merchants_admin_all" on merchants for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ═══════════════════════════════════════════════════════════
-- campaigns
-- ═══════════════════════════════════════════════════════════

create table public.campaigns (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,             -- "camp-bsc-001"
  merchant_id           uuid not null references merchants(id) on delete cascade,
  title                 text not null,
  description           text,
  status                campaign_status not null default 'draft',

  -- Offer tiers (from mock-qr-codes.ts)
  offer_tier_1          text,                             -- "Free matcha (first 10)"
  offer_tier_2          text,                             -- "15% off any drink"
  hero_slots_total      integer not null default 0,
  hero_slots_used       integer not null default 0 check (hero_slots_used <= hero_slots_total),

  -- Budget
  budget_total_cents    bigint not null default 0,
  budget_remaining_cents bigint not null default 0,
  reward_per_visit_cents bigint not null default 0,
  max_creators          integer not null default 0,
  accepted_creators_count integer not null default 0,

  -- Requirements
  tier_required         creator_tier not null default 'seed',
  requirements          jsonb,                            -- ["1 IG story", "Visit peak hours"]
  tags                  text[] default '{}',

  -- Geo + time
  lat                   double precision,
  lng                   double precision,
  image_url             text,
  start_date            date,
  end_date              date,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_campaigns_slug on campaigns(slug);
create index idx_campaigns_merchant on campaigns(merchant_id);
create index idx_campaigns_status on campaigns(status) where status = 'active';  -- partial index
create index idx_campaigns_tier on campaigns(tier_required);
create index idx_campaigns_location on campaigns(lat, lng);

alter table campaigns enable row level security;

-- Active campaigns are public (explore page, marketing)
create policy "campaigns_public_read_active" on campaigns
  for select using (status = 'active');

-- Merchants see their own (including drafts)
create policy "campaigns_merchant_own" on campaigns
  for select using (
    merchant_id in (select id from merchants where profile_id = auth.uid())
  );

create policy "campaigns_merchant_write" on campaigns
  for all using (
    merchant_id in (select id from merchants where profile_id = auth.uid())
  );

create policy "campaigns_admin_all" on campaigns for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ═══════════════════════════════════════════════════════════
-- qr_codes
-- ═══════════════════════════════════════════════════════════

create table public.qr_codes (
  id            uuid primary key default gen_random_uuid(),
  short_code    text not null unique,                     -- "qr-bsc-001" — printed on poster
  campaign_id   uuid not null references campaigns(id) on delete cascade,
  creator_id    uuid not null references creators(id) on delete cascade,

  -- Cached counters (trigger-maintained for read speed)
  scan_count        integer not null default 0,
  verified_count    integer not null default 0,
  conversion_count  integer not null default 0,

  issued_at     timestamptz not null default now(),
  expires_at    timestamptz,                              -- null = no expiry
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (campaign_id, creator_id)                        -- one QR per creator-campaign pair
);

create index idx_qr_codes_short on qr_codes(short_code);
create index idx_qr_codes_campaign on qr_codes(campaign_id);
create index idx_qr_codes_creator on qr_codes(creator_id);

alter table qr_codes enable row level security;

-- QR codes are publicly resolvable by short_code (scan landing page hits /scan/[qrId])
create policy "qr_codes_public_read" on qr_codes for select using (true);

-- Creators/merchants manage their own via parent FK
create policy "qr_codes_creator_write" on qr_codes for all using (
  creator_id in (select id from creators where profile_id = auth.uid())
);

create policy "qr_codes_merchant_write" on qr_codes for all using (
  campaign_id in (
    select c.id from campaigns c
    join merchants m on m.id = c.merchant_id
    where m.profile_id = auth.uid()
  )
);

create policy "qr_codes_admin_all" on qr_codes for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ═══════════════════════════════════════════════════════════
-- scans  (unified events table: scan | verify | conversion)
-- ═══════════════════════════════════════════════════════════

create table public.scans (
  id              uuid primary key default gen_random_uuid(),
  qr_code_id      uuid not null references qr_codes(id) on delete cascade,
  event_type      scan_event_type not null,

  -- Denormalized for fraud query speed (derivable from qr_code_id but cheap to store)
  campaign_id     uuid not null references campaigns(id) on delete cascade,
  creator_id      uuid not null references creators(id) on delete cascade,

  -- Anonymous session tracking (no auth required to scan)
  session_id      text,                                   -- generated client-side
  ip_hash         text,                                   -- sha256 of IP (PII-safe)
  user_agent      text,
  referrer        text,

  -- Type-specific fields (nullable; CHECK enforces shape)
  evidence_type   text,                                   -- 'photo' | 'receipt' | 'screenshot' (verify only)
  evidence_url    text,                                   -- (verify only)
  amount_cents    bigint,                                 -- (conversion only)
  offer_tier      smallint,                               -- 1 | 2 (conversion only)

  created_at      timestamptz not null default now(),

  -- Shape enforcement
  check (
    (event_type = 'scan' and evidence_type is null and amount_cents is null)
    or
    (event_type = 'verify' and evidence_type is not null and amount_cents is null)
    or
    (event_type = 'conversion' and amount_cents is not null and offer_tier in (1, 2))
  )
);

-- Hot-path indexes for admin fraud + creator wallet + merchant analytics
create index idx_scans_qr on scans(qr_code_id, created_at desc);
create index idx_scans_campaign on scans(campaign_id, event_type, created_at desc);
create index idx_scans_creator on scans(creator_id, event_type, created_at desc);
create index idx_scans_session on scans(session_id) where session_id is not null;
create index idx_scans_ip_window on scans(ip_hash, created_at desc) where ip_hash is not null;
create index idx_scans_type_time on scans(event_type, created_at desc);

alter table scans enable row level security;

-- Anyone can INSERT a scan (anonymous attribution)
create policy "scans_public_insert" on scans for insert with check (true);

-- Creators see scans on their own QR codes
create policy "scans_creator_own" on scans for select using (
  creator_id in (select id from creators where profile_id = auth.uid())
);

-- Merchants see scans on their campaigns
create policy "scans_merchant_own" on scans for select using (
  campaign_id in (
    select c.id from campaigns c
    join merchants m on m.id = c.merchant_id
    where m.profile_id = auth.uid()
  )
);

create policy "scans_admin_all" on scans for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ═══════════════════════════════════════════════════════════
-- updated_at trigger (attach to each mutable table)
-- ═══════════════════════════════════════════════════════════

create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on creators
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on merchants
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on campaigns
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on qr_codes
  for each row execute function trigger_set_updated_at();
-- scans is append-only, no trigger
```

---

## What this covers

| mock file | maps to |
|-----------|---------|
| `lib/data/types.ts::Creator` | `creators` |
| `lib/data/types.ts::Merchant` | `merchants` |
| `lib/data/types.ts::Campaign` | `campaigns` |
| `lib/data/types.ts::QRCode` | `qr_codes` |
| `lib/data/types.ts::ScanEvent` | `scans (event_type='scan')` |
| `lib/attribution/track.ts::VerifyEvent` | `scans (event_type='verify')` |
| `lib/attribution/track.ts::ConversionEvent` | `scans (event_type='conversion')` |
| `lib/attribution/mock-qr-codes.ts::MockQRCode.offer*` | `campaigns.offer_tier_*` |
| `lib/data/demo-campaigns-geo.ts::CampaignGeo` | `campaigns` + `merchants` (split) |

---

## What's explicitly NOT in v1 (punted to v2)

- **`applications`** — creator→campaign join table. Needed before first real campaign.
- **`milestones`** — multi-stage completion tracking. Needed before first payout.
- **`payments`** — Stripe-backed. Wait until Stripe Connect is wired.
- **`disputes`** — dual schema still unresolved; punt.
- **`verifications`** — KYC data; tied to KYC vendor choice (Stripe Identity vs Persona).
- **`notifications`** — email/SMS delivery; wait on Resend/Postmark decision.
- **`audit_log`** — admin action trail; page just shipped but DB schema can wait until we have real admin users.
- **`referrals`** — creator→creator invites; needed for growth phase.

---

## Open questions before I write the migration

1. **Location storage** — `double precision` lat/lng, or PostGIS `geography(Point, 4326)`? PostGIS gives us radius queries ("find campaigns within 2mi of me"). Adds extension dependency. v1 decision?
2. **Tier computation** — push_score stored or `generated always as (...) stored`? If rules are fixed, stored is cheaper. If they'll change, keep it recomputable via cron.
3. **scan session_id** — should we require it? Anonymous scans from shared networks could collide on ip_hash alone. I've made it nullable but fraud detection leans on it being set.
4. **`profiles.role` single-value vs set** — is a creator-who's-also-a-merchant a real v1 scenario? If yes, we need a `user_roles` join table now to avoid refactoring later.
5. **Environment strategy** — single Supabase project with schema branches (`public` / `staging`), or two projects (prod/dev)? Affects migration workflow.
6. **Seeding** — port existing demo data (Blank Street / Superiority Burger / Maya Eats) as seed SQL, or leave `/demo` mock-only for now?

---

## If approved, next concrete steps

1. `mkdir supabase/migrations/` and write `20260417_schema_v1.sql` (6 tables above).
2. Add `supabase/seed.sql` with 5-10 demo rows (optional, only if Q6 = yes).
3. Generate TypeScript types: `supabase gen types typescript --local > lib/supabase/types.generated.ts`.
4. Add `lib/supabase/server.ts` + `lib/supabase/client.ts` helpers (server component vs browser).
5. Replace `/api/attribution/scan` route's mock write with real `supabase.from('scans').insert(...)` — first API route to go real.
6. Continue migrating API routes one at a time, keep `NEXT_PUBLIC_USE_MOCK` flag working during transition.

Estimated effort: schema + migration + types = 2 hours. First real API route (scan ingestion) = 1 hour. Full mock→real transition for all 6 tables = 1 week.
