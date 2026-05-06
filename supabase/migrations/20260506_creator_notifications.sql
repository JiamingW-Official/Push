-- =============================================================
-- creator_notifications + push subscription tables
-- ----------------------------------------------------------------
-- Backs the /creator/notifications feed and the topnav drawer.
-- Notifications are append-only; mark-read flips read_at.
--
-- Rules:
--   * Service role inserts (only the Push backend creates notifications)
--   * Authenticated creators SELECT + UPDATE their own rows
--   * No DELETE policy — notifications are permanent records
--
-- Web Push: separate table holds VAPID-style endpoint subscriptions.
-- One row per device; an OAuth-grade endpoint is the natural primary key.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.creator_notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  uuid        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  kind        text        NOT NULL,
  title       text        NOT NULL,
  body        text        NOT NULL,
  href        text        NULL,
  read_at     timestamptz NULL,
  metadata    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS creator_notifications_creator_created_idx
  ON public.creator_notifications (creator_id, created_at DESC);

CREATE INDEX IF NOT EXISTS creator_notifications_unread_idx
  ON public.creator_notifications (creator_id)
  WHERE read_at IS NULL;

ALTER TABLE public.creator_notifications ENABLE ROW LEVEL SECURITY;

-- Creators can read their own.
CREATE POLICY IF NOT EXISTS creator_notifs_self_select
  ON public.creator_notifications
  FOR SELECT
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ));

-- Creators can flip their own read_at.
CREATE POLICY IF NOT EXISTS creator_notifs_self_update
  ON public.creator_notifications
  FOR UPDATE
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ))
  WITH CHECK (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ));

-- Service role inserts via lib/db/index.ts. No INSERT policy needed —
-- service role bypasses RLS by default.

-- ----------------------------------------------------------------
-- Web Push subscriptions
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.creator_push_subscriptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  uuid        NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  endpoint    text        NOT NULL UNIQUE,
  p256dh      text        NOT NULL,
  auth_key    text        NOT NULL,
  user_agent  text        NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS creator_push_subs_creator_idx
  ON public.creator_push_subscriptions (creator_id);

ALTER TABLE public.creator_push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS creator_push_subs_self_select
  ON public.creator_push_subscriptions
  FOR SELECT
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ));

CREATE POLICY IF NOT EXISTS creator_push_subs_self_insert
  ON public.creator_push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ));

CREATE POLICY IF NOT EXISTS creator_push_subs_self_delete
  ON public.creator_push_subscriptions
  FOR DELETE
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM public.creators WHERE user_id = auth.uid()
  ));
