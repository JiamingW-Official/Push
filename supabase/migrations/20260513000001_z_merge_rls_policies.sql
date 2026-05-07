-- =============================================================================
-- z-merge RLS: dual-side policies for creator + merchant
-- =============================================================================
-- Push's existing RLS uses (auth.uid() = user_id) checks directly. Z's
-- schema spans both audiences, so threads/messages need policies that
-- accept either party as a participant. Hero offers and campaign_locations
-- are merchant-owned; creators read them transitively through their accepted
-- applications.
--
-- All policies are deny-by-default; enable RLS already done in 20260513000000.
-- Use `if not exists` (Postgres 15+) or wrap in `do $$ if not exists` for
-- broader compatibility.
-- =============================================================================

-- ── HERO OFFERS ──────────────────────────────────────────────────────────────

-- Merchant: full read + write on offers tied to campaigns they own.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'hero_offers' and policyname = 'hero_offers_merchant_owner'
  ) then
    create policy hero_offers_merchant_owner on public.hero_offers
      for all
      using (
        exists (
          select 1 from public.campaigns c
          join public.merchants m on m.id = c.merchant_id
          where c.id = hero_offers.campaign_id
            and m.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.campaigns c
          join public.merchants m on m.id = c.merchant_id
          where c.id = hero_offers.campaign_id
            and m.user_id = auth.uid()
        )
      );
  end if;

  -- Public read on hero_offers attached to active campaigns — needed for the
  -- /scan landing page to render the offer banner without auth.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'hero_offers' and policyname = 'hero_offers_public_read_active'
  ) then
    create policy hero_offers_public_read_active on public.hero_offers
      for select
      using (
        exists (
          select 1 from public.campaigns c
          where c.id = hero_offers.campaign_id
            and c.status = 'active'
        )
      );
  end if;
end
$$;

-- ── CAMPAIGN_LOCATIONS ───────────────────────────────────────────────────────

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'campaign_locations') then
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'campaign_locations' and policyname = 'campaign_locations_merchant_owner'
    ) then
      create policy campaign_locations_merchant_owner on public.campaign_locations
        for all
        using (
          exists (
            select 1 from public.campaigns c
            join public.merchants m on m.id = c.merchant_id
            where c.id = campaign_locations.campaign_id
              and m.user_id = auth.uid()
          )
        )
        with check (
          exists (
            select 1 from public.campaigns c
            join public.merchants m on m.id = c.merchant_id
            where c.id = campaign_locations.campaign_id
              and m.user_id = auth.uid()
          )
        );
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'campaign_locations' and policyname = 'campaign_locations_public_read'
    ) then
      create policy campaign_locations_public_read on public.campaign_locations
        for select
        using (
          exists (
            select 1 from public.campaigns c
            where c.id = campaign_locations.campaign_id
              and c.status = 'active'
          )
        );
    end if;
  end if;
end
$$;

-- ── THREADS ──────────────────────────────────────────────────────────────────

-- A thread participant can read it (either side).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'threads' and policyname = 'threads_participant_read'
  ) then
    create policy threads_participant_read on public.threads
      for select
      using (
        merchant_user_id = auth.uid() or creator_user_id = auth.uid()
      );
  end if;

  -- Creating a new thread requires being one of the two parties.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'threads' and policyname = 'threads_participant_insert'
  ) then
    create policy threads_participant_insert on public.threads
      for insert
      with check (
        merchant_user_id = auth.uid() or creator_user_id = auth.uid()
      );
  end if;

  -- Either party can update last_message_* metadata via the trigger; allow it.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'threads' and policyname = 'threads_participant_update'
  ) then
    create policy threads_participant_update on public.threads
      for update
      using (
        merchant_user_id = auth.uid() or creator_user_id = auth.uid()
      )
      with check (
        merchant_user_id = auth.uid() or creator_user_id = auth.uid()
      );
  end if;
end
$$;

-- ── MESSAGES ─────────────────────────────────────────────────────────────────

do $$
begin
  -- Read messages in threads where the caller is a participant.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and policyname = 'messages_participant_read'
  ) then
    create policy messages_participant_read on public.messages
      for select
      using (
        exists (
          select 1 from public.threads t
          where t.id = messages.thread_id
            and (t.merchant_user_id = auth.uid() or t.creator_user_id = auth.uid())
        )
      );
  end if;

  -- Send: caller must be a participant AND must be the claimed sender.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and policyname = 'messages_participant_insert'
  ) then
    create policy messages_participant_insert on public.messages
      for insert
      with check (
        sender_id = auth.uid()
        and exists (
          select 1 from public.threads t
          where t.id = messages.thread_id
            and (t.merchant_user_id = auth.uid() or t.creator_user_id = auth.uid())
        )
      );
  end if;

  -- Mark-as-read updates only — the recipient flips read_at on messages they
  -- received. Sender cannot mark their own message read on behalf of receiver.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and policyname = 'messages_recipient_update_read'
  ) then
    create policy messages_recipient_update_read on public.messages
      for update
      using (
        sender_id <> auth.uid()
        and exists (
          select 1 from public.threads t
          where t.id = messages.thread_id
            and (t.merchant_user_id = auth.uid() or t.creator_user_id = auth.uid())
        )
      )
      with check (
        sender_id <> auth.uid()
        and exists (
          select 1 from public.threads t
          where t.id = messages.thread_id
            and (t.merchant_user_id = auth.uid() or t.creator_user_id = auth.uid())
        )
      );
  end if;
end
$$;
