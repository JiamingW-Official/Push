-- ═══════════════════════════════════════════════════════════════════
-- Push — Schema v1
-- 6 core tables: profiles, creators, merchants, campaigns, qr_codes, scans
-- Design source: .claude/schema-v1.md
--
-- Defaults applied per user approval on 2026-04-17:
--   • lat/lng stored as double precision (no PostGIS in v1)
--   • push_score stored (not generated); recomputed nightly by cron
--   • scans.session_id NOT NULL (required for fraud detection)
--   • profiles.role single-value (no multi-role in v1)
--   • no seed data (/demo remains mock-backed for now)
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- Extensions
-- ───────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ───────────────────────────────────────────────────────────────────
-- Enums
-- ───────────────────────────────────────────────────────────────────
create type public.user_role as enum ('creator', 'merchant', 'admin');

create type public.creator_tier as enum (
  'seed', 'explorer', 'operator', 'proven', 'closer', 'partner'
);

create type public.campaign_status as enum (
  'draft', 'active', 'paused', 'completed', 'cancelled'
);

create type public.scan_event_type as enum ('scan', 'verify', 'conversion');

-- ───────────────────────────────────────────────────────────────────
-- updated_at trigger function (shared)
-- ───────────────────────────────────────────────────────────────────
create or replace function public.trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ───────────────────────────────────────────────────────────────────
-- profiles  (1:1 with auth.users)
-- ───────────────────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          public.user_role not null,
  email         text not null unique,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_profiles_role on public.profiles(role);

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.trigger_set_updated_at();

alter table public.profiles enable row level security;

-- Helper: is_admin() check used by downstream policies
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin());

-- ───────────────────────────────────────────────────────────────────
-- creators
-- ───────────────────────────────────────────────────────────────────
create table public.creators (
  id                     uuid primary key default gen_random_uuid(),
  profile_id             uuid not null unique references public.profiles(id) on delete cascade,
  slug                   text not null unique,
  display_name           text not null,
  bio                    text,
  location_label         text,
  lat                    double precision,
  lng                    double precision,
  instagram_handle       text,
  instagram_followers    integer not null default 0,
  tiktok_handle          text,
  tiktok_followers       integer not null default 0,
  tier                   public.creator_tier not null default 'seed',
  push_score             integer not null default 0 check (push_score between 0 and 100),
  score_updated_at       timestamptz not null default now(),
  campaigns_completed    integer not null default 0,
  campaigns_accepted     integer not null default 0,
  earnings_total_cents   bigint not null default 0,
  earnings_pending_cents bigint not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index idx_creators_slug on public.creators(slug);
create index idx_creators_tier on public.creators(tier);
create index idx_creators_push_score on public.creators(push_score desc);
create index idx_creators_location on public.creators(lat, lng);

create trigger set_updated_at
  before update on public.creators
  for each row execute function public.trigger_set_updated_at();

alter table public.creators enable row level security;

-- Creators are publicly viewable (portfolio pages /c/[slug])
create policy "creators_public_read" on public.creators
  for select using (true);

create policy "creators_self_update" on public.creators
  for update using (profile_id = auth.uid());

create policy "creators_self_insert" on public.creators
  for insert with check (profile_id = auth.uid());

create policy "creators_admin_all" on public.creators
  for all using (public.is_admin());

-- ───────────────────────────────────────────────────────────────────
-- merchants
-- ───────────────────────────────────────────────────────────────────
create table public.merchants (
  id                     uuid primary key default gen_random_uuid(),
  profile_id             uuid not null unique references public.profiles(id) on delete cascade,
  slug                   text not null unique,
  business_name          text not null,
  category               text not null,
  business_address       text,
  neighborhood           text,
  lat                    double precision,
  lng                    double precision,
  logo_url               text,
  website                text,
  total_spent_cents      bigint not null default 0,
  active_campaigns_count integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index idx_merchants_slug on public.merchants(slug);
create index idx_merchants_category on public.merchants(category);
create index idx_merchants_neighborhood on public.merchants(neighborhood);
create index idx_merchants_location on public.merchants(lat, lng);

create trigger set_updated_at
  before update on public.merchants
  for each row execute function public.trigger_set_updated_at();

alter table public.merchants enable row level security;

create policy "merchants_public_read" on public.merchants
  for select using (true);

create policy "merchants_self_update" on public.merchants
  for update using (profile_id = auth.uid());

create policy "merchants_self_insert" on public.merchants
  for insert with check (profile_id = auth.uid());

create policy "merchants_admin_all" on public.merchants
  for all using (public.is_admin());

-- ───────────────────────────────────────────────────────────────────
-- campaigns
-- ───────────────────────────────────────────────────────────────────
create table public.campaigns (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  merchant_id             uuid not null references public.merchants(id) on delete cascade,
  title                   text not null,
  description             text,
  status                  public.campaign_status not null default 'draft',

  -- Offer tiers (merged from lib/attribution/mock-qr-codes.ts)
  offer_tier_1            text,
  offer_tier_2            text,
  hero_slots_total        integer not null default 0 check (hero_slots_total >= 0),
  hero_slots_used         integer not null default 0 check (hero_slots_used >= 0 and hero_slots_used <= hero_slots_total),

  -- Budget (all cents, never float)
  budget_total_cents      bigint not null default 0 check (budget_total_cents >= 0),
  budget_remaining_cents  bigint not null default 0 check (budget_remaining_cents >= 0),
  reward_per_visit_cents  bigint not null default 0 check (reward_per_visit_cents >= 0),
  max_creators            integer not null default 0 check (max_creators >= 0),
  accepted_creators_count integer not null default 0 check (accepted_creators_count >= 0),

  -- Requirements
  tier_required           public.creator_tier not null default 'seed',
  requirements            jsonb,
  tags                    text[] not null default '{}',

  -- Geo + time
  lat                     double precision,
  lng                     double precision,
  image_url               text,
  start_date              date,
  end_date                date,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  check (end_date is null or start_date is null or end_date >= start_date)
);

create index idx_campaigns_slug on public.campaigns(slug);
create index idx_campaigns_merchant on public.campaigns(merchant_id);
create index idx_campaigns_status_active on public.campaigns(status) where status = 'active';
create index idx_campaigns_tier on public.campaigns(tier_required);
create index idx_campaigns_location on public.campaigns(lat, lng);

create trigger set_updated_at
  before update on public.campaigns
  for each row execute function public.trigger_set_updated_at();

alter table public.campaigns enable row level security;

-- Active campaigns are public (explore page, marketing)
create policy "campaigns_public_read_active" on public.campaigns
  for select using (status = 'active');

-- Merchants see their own (including drafts) + manage them
create policy "campaigns_merchant_all" on public.campaigns
  for all using (
    merchant_id in (select id from public.merchants where profile_id = auth.uid())
  );

create policy "campaigns_admin_all" on public.campaigns
  for all using (public.is_admin());

-- ───────────────────────────────────────────────────────────────────
-- qr_codes
-- ───────────────────────────────────────────────────────────────────
create table public.qr_codes (
  id               uuid primary key default gen_random_uuid(),
  short_code       text not null unique,
  campaign_id      uuid not null references public.campaigns(id) on delete cascade,
  creator_id       uuid not null references public.creators(id) on delete cascade,

  -- Cached counters (trigger-maintained for read speed)
  scan_count       integer not null default 0 check (scan_count >= 0),
  verified_count   integer not null default 0 check (verified_count >= 0),
  conversion_count integer not null default 0 check (conversion_count >= 0),

  issued_at        timestamptz not null default now(),
  expires_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  unique (campaign_id, creator_id),
  check (expires_at is null or expires_at > issued_at)
);

create index idx_qr_codes_short on public.qr_codes(short_code);
create index idx_qr_codes_campaign on public.qr_codes(campaign_id);
create index idx_qr_codes_creator on public.qr_codes(creator_id);

create trigger set_updated_at
  before update on public.qr_codes
  for each row execute function public.trigger_set_updated_at();

alter table public.qr_codes enable row level security;

-- QR codes are publicly resolvable by short_code (/scan/[qrId] landing)
create policy "qr_codes_public_read" on public.qr_codes
  for select using (true);

create policy "qr_codes_creator_write" on public.qr_codes
  for all using (
    creator_id in (select id from public.creators where profile_id = auth.uid())
  );

create policy "qr_codes_merchant_write" on public.qr_codes
  for all using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.merchants m on m.id = c.merchant_id
      where m.profile_id = auth.uid()
    )
  );

create policy "qr_codes_admin_all" on public.qr_codes
  for all using (public.is_admin());

-- ───────────────────────────────────────────────────────────────────
-- scans  (unified events: scan | verify | conversion)
-- ───────────────────────────────────────────────────────────────────
create table public.scans (
  id             uuid primary key default gen_random_uuid(),
  qr_code_id     uuid not null references public.qr_codes(id) on delete cascade,
  event_type     public.scan_event_type not null,

  -- Denormalized for fraud query speed
  campaign_id    uuid not null references public.campaigns(id) on delete cascade,
  creator_id     uuid not null references public.creators(id) on delete cascade,

  -- Session tracking (required for fraud detection per user default)
  session_id     text not null,
  ip_hash        text,
  user_agent     text,
  referrer       text,

  -- Type-specific fields (enforced by CHECK below)
  evidence_type  text,
  evidence_url   text,
  amount_cents   bigint check (amount_cents is null or amount_cents >= 0),
  offer_tier     smallint check (offer_tier is null or offer_tier in (1, 2)),

  created_at     timestamptz not null default now(),

  check (
    (event_type = 'scan'
      and evidence_type is null and evidence_url is null
      and amount_cents is null and offer_tier is null)
    or
    (event_type = 'verify'
      and evidence_type is not null
      and amount_cents is null and offer_tier is null)
    or
    (event_type = 'conversion'
      and amount_cents is not null and offer_tier is not null)
  )
);

-- Hot-path indexes
create index idx_scans_qr on public.scans(qr_code_id, created_at desc);
create index idx_scans_campaign on public.scans(campaign_id, event_type, created_at desc);
create index idx_scans_creator on public.scans(creator_id, event_type, created_at desc);
create index idx_scans_session on public.scans(session_id);
create index idx_scans_ip_window on public.scans(ip_hash, created_at desc) where ip_hash is not null;
create index idx_scans_type_time on public.scans(event_type, created_at desc);

alter table public.scans enable row level security;

-- Anyone (authenticated or anon) can INSERT a scan
create policy "scans_public_insert" on public.scans
  for insert with check (true);

-- Creators see scans on their own QR codes
create policy "scans_creator_own" on public.scans
  for select using (
    creator_id in (select id from public.creators where profile_id = auth.uid())
  );

-- Merchants see scans on their campaigns
create policy "scans_merchant_own" on public.scans
  for select using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.merchants m on m.id = c.merchant_id
      where m.profile_id = auth.uid()
    )
  );

create policy "scans_admin_all" on public.scans
  for all using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
-- End of schema v1
-- ═══════════════════════════════════════════════════════════════════
