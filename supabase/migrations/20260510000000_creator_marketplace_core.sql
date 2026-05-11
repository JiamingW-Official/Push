-- ╭──────────────────────────────────────────────────────────╮
-- │  Push · Creator marketplace core schema                   │
-- │  20260510000000_creator_marketplace_core.sql              │
-- │                                                            │
-- │  Drafted 2026-05-10. NOT applied to any environment yet — │
-- │  pilot still uses the in-memory mock store. This migration │
-- │  is the source of truth for the eventual Supabase schema  │
-- │  swap (see lib/services/* for the abstraction that lets   │
-- │  us flip from mock → Supabase with one line per service). │
-- │                                                            │
-- │  Tables:                                                   │
-- │    1. creators       — vetted creator profiles + tier     │
-- │    2. merchants      — local businesses + their location  │
-- │    3. campaigns      — merchant-published opportunities    │
-- │    4. applications   — creator applications + quiz        │
-- │    5. attribution_events — QR scans → verified visits     │
-- │                                                            │
-- │  RLS: enabled on every table. Creator/merchant rows are   │
-- │  visible to the owner only by default; service-role bypass│
-- │  is used by background jobs.                              │
-- │                                                            │
-- │  NOTE: this is a single-tenant table layout — production   │
-- │  multi-tenant adds workspace_id once we onboard agencies. │
-- ╰──────────────────────────────────────────────────────────╯

-- Required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fuzzy search on campaign titles

-- ── 1. creators ──────────────────────────────────────────────
create type creator_tier as enum (
  'seed', 'explorer', 'operator', 'proven', 'closer', 'partner'
);

create table public.creators (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  name            text not null,
  instagram_handle text,
  email           text,
  bio             text,
  avatar_url      text,
  tier            creator_tier not null default 'seed',
  push_score      integer not null default 50 check (push_score between 0 and 100),
  campaigns_completed integer not null default 0,
  campaigns_accepted  integer not null default 0,
  earnings_total_cents integer not null default 0,
  earnings_pending_cents integer not null default 0,
  instagram_followers integer,
  home_lat        double precision,
  home_lng        double precision,
  home_neighborhood text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- One creator profile per auth user
  constraint creators_user_id_unique unique (user_id)
);

create index creators_tier_idx on public.creators (tier);
create index creators_neighborhood_idx on public.creators (home_neighborhood);

alter table public.creators enable row level security;

-- Creators can read + update their own profile.
create policy creators_self_select on public.creators
  for select using (auth.uid() = user_id);
create policy creators_self_update on public.creators
  for update using (auth.uid() = user_id);

-- ── 2. merchants ─────────────────────────────────────────────
create type merchant_category as enum (
  'FOOD & DRINK', 'RETAIL', 'WELLNESS', 'BEAUTY', 'FITNESS', 'LIFESTYLE'
);

create table public.merchants (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  name            text not null,
  category        merchant_category not null,
  bio             text,
  avg_response_hours integer not null default 24,
  campaigns_hosted integer not null default 0,
  star_rating     numeric(2,1) not null default 5.0 check (star_rating between 0 and 5),
  review_count    integer not null default 0,
  repeat_creator_pct integer not null default 0,
  joined_year     integer not null default extract(year from now()),
  -- Primary location fields (multi-location is a future table)
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,
  zip             text,
  lat             double precision,
  lng             double precision,
  neighborhood    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index merchants_category_idx on public.merchants (category);
create index merchants_neighborhood_idx on public.merchants (neighborhood);

alter table public.merchants enable row level security;

create policy merchants_self_select on public.merchants
  for select using (auth.uid() = user_id);
create policy merchants_self_update on public.merchants
  for update using (auth.uid() = user_id);
-- Merchants are publicly visible to authenticated creators (so the
-- discover feed works). Field-level filtering happens at the view layer.
create policy merchants_creator_browse on public.merchants
  for select to authenticated using (true);

-- ── 3. campaigns ─────────────────────────────────────────────
create type campaign_format as enum ('in-person', 'remote', 'hybrid');
create type campaign_pay_unit as enum ('campaign', 'visit', 'post', 'reel', 'story');
create type campaign_status as enum ('draft', 'live', 'paused', 'closed');

create table public.campaigns (
  id              uuid primary key default uuid_generate_v4(),
  merchant_id     uuid not null references public.merchants(id) on delete cascade,
  title           text not null,
  tagline         text,
  brief_body      text, -- merchant-voice 3-sentence brief
  brief_must_include jsonb not null default '[]'::jsonb,
  brief_must_avoid jsonb not null default '[]'::jsonb,
  category        merchant_category not null,
  neighborhood    text not null,
  cash_pay_cents  integer not null check (cash_pay_cents >= 0),
  pay_unit        campaign_pay_unit not null default 'visit',
  deliverables    jsonb not null default '[]'::jsonb,
  -- Each deliverable: {type, count, unitPay, estHoursEach, description?, format?, shotList?}
  slots_total     integer not null check (slots_total > 0),
  slots_remaining integer not null check (slots_remaining >= 0),
  shoot_windows   jsonb not null default '[]'::jsonb,
  -- Each window: {date: "YYYY-MM-DD", slots: [{startTime, endTime, capacity, bookedBy}]}
  pickup_required boolean not null default false,
  format          campaign_format not null default 'in-person',
  match_score     integer not null default 75 check (match_score between 0 and 100),
  minimum_tier    integer not null default 1 check (minimum_tier between 1 and 6),
  deadline        timestamptz,
  lat             double precision not null,
  lng             double precision not null,
  images          text[] not null default '{}',
  -- Address override (defaults to merchant address)
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,
  zip             text,
  address_public_note text,
  status          campaign_status not null default 'draft',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index campaigns_merchant_id_idx on public.campaigns (merchant_id);
create index campaigns_status_idx on public.campaigns (status);
create index campaigns_neighborhood_idx on public.campaigns (neighborhood);
create index campaigns_category_idx on public.campaigns (category);
create index campaigns_published_idx on public.campaigns (published_at desc) where status = 'live';
-- Trigram index for fuzzy title search in the discover feed.
create index campaigns_title_trgm_idx on public.campaigns using gin (title gin_trgm_ops);

alter table public.campaigns enable row level security;

-- Live campaigns are visible to all authenticated users (creators).
create policy campaigns_live_select on public.campaigns
  for select to authenticated using (status = 'live');
-- Merchants can manage their own campaigns at any status.
create policy campaigns_merchant_manage on public.campaigns
  for all using (
    merchant_id in (
      select id from public.merchants where user_id = auth.uid()
    )
  );

-- ── 4. applications ──────────────────────────────────────────
create type application_status as enum (
  'reviewing', 'accepted', 'declined', 'withdrawn',
  'shoot_scheduled', 'submitted', 'verified', 'paid'
);
create type quiz_familiarity as enum ('first', 'few', 'regular');
create type quiz_setup as enum ('phone', 'phone-plus', 'pro');

create table public.applications (
  id              uuid primary key default uuid_generate_v4(),
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  creator_id      uuid not null references public.creators(id) on delete cascade,
  status          application_status not null default 'reviewing',
  -- Slot booking
  slot_date       date not null,
  slot_start_time time not null,
  slot_end_time   time not null,
  -- Quiz answers (from /campaign/[id] apply modal v15)
  familiarity     quiz_familiarity,
  angle           text,
  setup           quiz_setup,
  confirmed_deliver  boolean not null default false,
  confirmed_disclose boolean not null default false,
  -- Decision metadata
  decided_at      timestamptz,
  decided_reason  text,
  -- Lifecycle
  submitted_at    timestamptz,
  verified_at     timestamptz,
  paid_at         timestamptz,
  paid_cents      integer,
  -- Timestamps
  applied_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- One open application per (creator, campaign)
  constraint applications_one_per_pair
    unique (campaign_id, creator_id)
);

create index applications_campaign_id_idx on public.applications (campaign_id);
create index applications_creator_id_idx on public.applications (creator_id);
create index applications_status_idx on public.applications (status);
create index applications_applied_at_idx on public.applications (applied_at desc);
-- Composite for the daily quota query (counts per creator per day).
create index applications_creator_applied_at_idx
  on public.applications (creator_id, applied_at desc);

alter table public.applications enable row level security;

-- Creators see their own applications.
create policy applications_creator_select on public.applications
  for select using (
    creator_id in (select id from public.creators where user_id = auth.uid())
  );
-- Creators can insert their own (apply) and update only the
-- non-decision fields (e.g. withdraw).
create policy applications_creator_insert on public.applications
  for insert with check (
    creator_id in (select id from public.creators where user_id = auth.uid())
  );
create policy applications_creator_withdraw on public.applications
  for update using (
    creator_id in (select id from public.creators where user_id = auth.uid())
  ) with check (status in ('reviewing', 'withdrawn'));

-- Merchants see applications for their campaigns.
create policy applications_merchant_select on public.applications
  for select using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.merchants m on m.id = c.merchant_id
      where m.user_id = auth.uid()
    )
  );
create policy applications_merchant_decide on public.applications
  for update using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.merchants m on m.id = c.merchant_id
      where m.user_id = auth.uid()
    )
  );

-- ── 5. attribution_events (QR scans → verified visits) ──────
-- The Push attribution rail. One row per QR scan; ConversionOracle
-- decides whether the scan upgrades to a verified attribution event.
create type attribution_state as enum (
  'scan_received', 'verifying', 'verified', 'rejected', 'disputed'
);

create table public.attribution_events (
  id              uuid primary key default uuid_generate_v4(),
  application_id  uuid not null references public.applications(id) on delete cascade,
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  qr_code_id      text,
  scan_lat        double precision,
  scan_lng        double precision,
  scan_timestamp  timestamptz not null default now(),
  customer_phone_e164 text, -- hashed in prod; raw only in dev
  state           attribution_state not null default 'scan_received',
  oracle_score    numeric(3,2), -- 0.00-1.00 confidence
  oracle_reasoning text,
  payout_cents    integer not null default 0,
  payout_status   text, -- 'pending' | 'cleared' | 'paid' | 'disputed'
  payout_paid_at  timestamptz,
  -- Compliance
  consent_recorded_at timestamptz,
  consent_tier    text, -- 'tier_1_minimal' | 'tier_2_standard' | 'tier_3_full'
  created_at      timestamptz not null default now()
);

create index attribution_application_id_idx on public.attribution_events (application_id);
create index attribution_campaign_id_idx on public.attribution_events (campaign_id);
create index attribution_state_idx on public.attribution_events (state);
create index attribution_scan_timestamp_idx on public.attribution_events (scan_timestamp desc);

alter table public.attribution_events enable row level security;

-- Service role only by default — written by the QR scan endpoint
-- and read by the ConversionOracle worker. End-user reads go
-- through the application surface (joined by application_id).
-- No public RLS policies — backend code is the only intended reader.

-- ── Triggers — keep updated_at fresh ────────────────────────
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger creators_touch_updated_at
  before update on public.creators
  for each row execute procedure public.touch_updated_at();
create trigger merchants_touch_updated_at
  before update on public.merchants
  for each row execute procedure public.touch_updated_at();
create trigger campaigns_touch_updated_at
  before update on public.campaigns
  for each row execute procedure public.touch_updated_at();
create trigger applications_touch_updated_at
  before update on public.applications
  for each row execute procedure public.touch_updated_at();
