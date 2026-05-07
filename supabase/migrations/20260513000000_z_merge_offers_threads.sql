-- =============================================================================
-- z-merge: Hero Offers, Campaign Locations, Threads, Messages, Application fields
-- =============================================================================
-- High-level fusion migration that ports the 5 schema additions from z's
-- standalone merchant-app branch into Push's main schema. Each statement is
-- guarded with `if not exists` so the migration is idempotent.
--
-- Design decisions (per merge plan):
--   • Keep Push's `campaign_applications` table name (no rename). Add the 3
--     columns z introduced on his `applications` table: cover_letter, note,
--     reviewed_at.
--   • Keep Push as single-tenant — no `tenants` table. z's helpers fall back
--     to demo-tenant-001 when no auth session is present.
--   • All new tables enable RLS; policies are added in 20260513000001 below.
-- =============================================================================

-- 1. trigger_set_updated_at helper (idempotent — Push may already have this)
create or replace function public.trigger_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. hero_offer_type enum + hero_offers table
do $$
begin
  if not exists (select 1 from pg_type where typname = 'hero_offer_type') then
    create type public.hero_offer_type as enum (
      'percent_off',
      'fixed_amount',
      'free_item',
      'bogo'
    );
  end if;
end
$$;

create table if not exists public.hero_offers (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null unique references public.campaigns(id) on delete cascade,
  type public.hero_offer_type not null,
  value_numeric numeric,
  value_text text,
  max_redemptions_per_customer integer not null default 1,
  max_redemptions_total integer,
  redeemed_count integer not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hero_offers_max_redemptions_per_customer_positive
    check (max_redemptions_per_customer > 0),
  constraint hero_offers_max_redemptions_total_positive
    check (max_redemptions_total is null or max_redemptions_total > 0),
  constraint hero_offers_value_shape
    check (
      (type in ('percent_off', 'fixed_amount')
        and value_numeric is not null
        and value_text is null)
      or
      (type in ('free_item', 'bogo')
        and value_numeric is null
        and value_text is not null)
    )
);

alter table public.hero_offers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_hero_offers_updated_at'
      and tgrelid = 'public.hero_offers'::regclass
  ) then
    create trigger set_hero_offers_updated_at
      before update on public.hero_offers
      for each row
      execute function public.trigger_set_updated_at();
  end if;
end
$$;

-- 3. campaign_locations junction (one campaign → many applicable locations)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'locations') then
    create table if not exists public.campaign_locations (
      campaign_id uuid not null references public.campaigns(id) on delete cascade,
      location_id uuid not null references public.locations(id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (campaign_id, location_id)
    );
    create index if not exists idx_campaign_locations_location_id on public.campaign_locations (location_id);
    alter table public.campaign_locations enable row level security;
  end if;
end
$$;

-- 4. message_content_type enum + threads + messages tables
do $$
begin
  if not exists (select 1 from pg_type where typname = 'message_content_type') then
    create type public.message_content_type as enum (
      'text',
      'image',
      'campaign-reference'
    );
  end if;
end
$$;

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  creator_user_id uuid not null references auth.users(id) on delete cascade,
  merchant_id uuid references public.merchants(id) on delete set null,
  creator_id uuid references public.creators(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  last_message_preview text,
  last_message_sender_id uuid references auth.users(id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- sender_role uses text + check constraint instead of public.user_role enum
-- so this migration is independent of Push's pre-existing role enum (which
-- may have a different value set).
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('creator', 'merchant', 'admin')),
  content text not null default '',
  content_type public.message_content_type not null default 'text',
  attachments jsonb not null default '[]'::jsonb,
  campaign_ref jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint messages_attachments_is_array check (jsonb_typeof(attachments) = 'array'),
  constraint messages_campaign_ref_is_object
    check (campaign_ref is null or jsonb_typeof(campaign_ref) = 'object')
);

create index if not exists idx_threads_merchant_user_id on public.threads (merchant_user_id);
create index if not exists idx_threads_creator_user_id on public.threads (creator_user_id);
create index if not exists idx_threads_campaign_id on public.threads (campaign_id);
create index if not exists idx_threads_last_message_at on public.threads (last_message_at desc nulls last);
create index if not exists idx_messages_thread_created_at_desc
  on public.messages (thread_id, created_at desc);

alter table public.threads enable row level security;
alter table public.messages enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_threads_updated_at'
      and tgrelid = 'public.threads'::regclass
  ) then
    create trigger set_threads_updated_at
      before update on public.threads
      for each row
      execute function public.trigger_set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_messages_updated_at'
      and tgrelid = 'public.messages'::regclass
  ) then
    create trigger set_messages_updated_at
      before update on public.messages
      for each row
      execute function public.trigger_set_updated_at();
  end if;
end
$$;

-- 5. messages → threads denormalization trigger:
--   keeps threads.last_message_* in sync with the most recent message so the
--   inbox list query can avoid a join.
create or replace function public.refresh_thread_last_message()
returns trigger
language plpgsql
as $$
begin
  update public.threads
  set
    last_message_preview = left(new.content, 200),
    last_message_sender_id = new.sender_id,
    last_message_at = new.created_at,
    updated_at = now()
  where id = new.thread_id;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_message_insert_refresh_thread'
      and tgrelid = 'public.messages'::regclass
  ) then
    create trigger on_message_insert_refresh_thread
      after insert on public.messages
      for each row
      execute function public.refresh_thread_last_message();
  end if;
end
$$;

-- 6. Add z's 3 columns to existing campaign_applications (idempotent)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'campaign_applications') then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'campaign_applications' and column_name = 'cover_letter'
    ) then
      alter table public.campaign_applications add column cover_letter text;
    end if;

    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'campaign_applications' and column_name = 'note'
    ) then
      alter table public.campaign_applications add column note text;
    end if;

    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'campaign_applications' and column_name = 'reviewed_at'
    ) then
      alter table public.campaign_applications add column reviewed_at timestamptz;
    end if;
  end if;
end
$$;
