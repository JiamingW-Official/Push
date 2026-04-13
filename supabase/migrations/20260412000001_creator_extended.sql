-- =============================================================
-- Push — Creator Extended Schema
-- Migration: 20260412000001_creator_extended
-- Target: Supabase (PostgreSQL 15+)
-- Idempotent: uses ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
-- No destructive operations.
-- =============================================================


-- =============================================================
-- 1. Extend public.creators
-- Adds tier system, scoring, social stats, and financial fields.
-- =============================================================

ALTER TABLE public.creators
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'seed'
    CHECK (tier IN ('seed','explorer','operator','proven','closer','partner')),
  ADD COLUMN IF NOT EXISTS push_score NUMERIC(5,1) NOT NULL DEFAULT 50.0
    CHECK (push_score >= 0 AND push_score <= 100),
  ADD COLUMN IF NOT EXISTS campaigns_completed INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS campaigns_accepted INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS earnings_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS earnings_pending NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS instagram_followers INT,
  ADD COLUMN IF NOT EXISTS tiktok_handle TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_followers INT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS score_updated_at TIMESTAMPTZ DEFAULT now();

COMMENT ON COLUMN public.creators.tier IS
  '6-tier progression: seed → explorer → operator → proven → closer → partner';
COMMENT ON COLUMN public.creators.push_score IS
  'Composite score 0–100. Recalculated by recalculate_push_score().';
COMMENT ON COLUMN public.creators.campaigns_completed IS
  'Total campaigns settled (verified + paid). Used in score calculation.';
COMMENT ON COLUMN public.creators.campaigns_accepted IS
  'Total campaigns accepted. Used as denominator for completion rate.';
COMMENT ON COLUMN public.creators.earnings_total IS
  'Lifetime earnings in USD, excluding pending.';
COMMENT ON COLUMN public.creators.earnings_pending IS
  'Earnings awaiting payout settlement.';
COMMENT ON COLUMN public.creators.score_updated_at IS
  'Timestamp of last push_score recalculation.';


-- Index to support tier-based leaderboard / filtering queries
CREATE INDEX IF NOT EXISTS idx_creators_tier ON public.creators(tier);
CREATE INDEX IF NOT EXISTS idx_creators_push_score ON public.creators(push_score DESC);
CREATE INDEX IF NOT EXISTS idx_creators_is_active ON public.creators(is_active);


-- =============================================================
-- 2. creator_submissions
-- Tracks campaign milestone progress per application.
-- One row per application (UNIQUE on application_id).
-- =============================================================

CREATE TABLE IF NOT EXISTS public.creator_submissions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID NOT NULL REFERENCES public.campaign_applications(id) ON DELETE CASCADE,
  creator_id       UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  campaign_id      UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  milestone        TEXT NOT NULL DEFAULT 'accepted'
    CHECK (milestone IN (
      'accepted',
      'scheduled',
      'visited',
      'proof_submitted',
      'content_published',
      'verified',
      'settled'
    )),
  proof_url            TEXT,
  content_url          TEXT,
  merchant_rating      NUMERIC(2,1) CHECK (merchant_rating >= 1 AND merchant_rating <= 5),
  merchant_rebook_score NUMERIC(2,1) CHECK (merchant_rebook_score >= 1 AND merchant_rebook_score <= 5),
  content_rating       NUMERIC(2,1) CHECK (content_rating >= 1 AND content_rating <= 5),
  engagement_rate      NUMERIC(5,4),
  submitted_at         TIMESTAMPTZ,
  verified_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (application_id)
);

COMMENT ON TABLE public.creator_submissions IS
  'Milestone tracking for a campaign application. One row per application; milestone advances through the workflow.';

CREATE INDEX IF NOT EXISTS idx_submissions_application_id ON public.creator_submissions(application_id);
CREATE INDEX IF NOT EXISTS idx_submissions_creator_id    ON public.creator_submissions(creator_id);
CREATE INDEX IF NOT EXISTS idx_submissions_campaign_id   ON public.creator_submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_submissions_milestone     ON public.creator_submissions(milestone);


-- =============================================================
-- 3. creator_payouts
-- Financial payout records per creator per submission.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.creator_payouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  submission_id     UUID REFERENCES public.creator_submissions(id),
  campaign_id       UUID REFERENCES public.campaigns(id),
  amount            NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payout_type       TEXT NOT NULL DEFAULT 'base'
    CHECK (payout_type IN ('base','commission','bonus')),
  status            TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed')),
  payout_speed      TEXT
    CHECK (payout_speed IN ('instant','same_day','t1','t2','t3')),
  paid_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.creator_payouts IS
  'Payout record for a creator. Links to submission (campaign-level) and supports instant / deferred speeds.';

CREATE INDEX IF NOT EXISTS idx_payouts_creator_id    ON public.creator_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_payouts_submission_id ON public.creator_payouts(submission_id);
CREATE INDEX IF NOT EXISTS idx_payouts_campaign_id   ON public.creator_payouts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status        ON public.creator_payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_payout_type   ON public.creator_payouts(payout_type);


-- =============================================================
-- 4. qr_scans
-- QR attribution tracking. Records each scan event for a creator/campaign pair.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.qr_scans (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id         UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  campaign_id        UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  scanned_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  scan_source        TEXT DEFAULT 'post',
  ip_hash            TEXT,
  device_fingerprint TEXT
);

COMMENT ON TABLE public.qr_scans IS
  'Raw QR attribution events. ip_hash and device_fingerprint support anti-fraud deduplication.';

CREATE INDEX IF NOT EXISTS idx_qr_scans_creator_id  ON public.qr_scans(creator_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_campaign_id ON public.qr_scans(campaign_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at  ON public.qr_scans(scanned_at DESC);


-- =============================================================
-- 5. RLS — Enable on new tables
-- =============================================================

ALTER TABLE public.creator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans            ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- 6. RLS Policies
--
-- Pattern:
--   Creators  → read/write their own rows via auth.uid() join
--   Merchants → read submissions/scans for their campaigns
--   service_role bypasses RLS automatically (Supabase default)
-- =============================================================

-- ------- creator_submissions -------

-- Creators can read their own submissions
DROP POLICY IF EXISTS "creators_read_own_submissions" ON public.creator_submissions;
CREATE POLICY "creators_read_own_submissions"
  ON public.creator_submissions
  FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = auth.uid()
    )
  );

-- Creators can insert submissions for their own applications
DROP POLICY IF EXISTS "creators_insert_own_submissions" ON public.creator_submissions;
CREATE POLICY "creators_insert_own_submissions"
  ON public.creator_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = auth.uid()
    )
  );

-- Creators can update their own submissions (e.g. upload proof_url)
DROP POLICY IF EXISTS "creators_update_own_submissions" ON public.creator_submissions;
CREATE POLICY "creators_update_own_submissions"
  ON public.creator_submissions
  FOR UPDATE
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = auth.uid()
    )
  );

-- Merchants can read submissions for campaigns they own
DROP POLICY IF EXISTS "merchants_read_campaign_submissions" ON public.creator_submissions;
CREATE POLICY "merchants_read_campaign_submissions"
  ON public.creator_submissions
  FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      INNER JOIN public.merchants m ON m.id = c.merchant_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Merchants can update submissions for their campaigns (e.g. rate, verify)
DROP POLICY IF EXISTS "merchants_update_campaign_submissions" ON public.creator_submissions;
CREATE POLICY "merchants_update_campaign_submissions"
  ON public.creator_submissions
  FOR UPDATE
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      INNER JOIN public.merchants m ON m.id = c.merchant_id
      WHERE m.user_id = auth.uid()
    )
  );


-- ------- creator_payouts -------

-- Creators can read their own payouts
DROP POLICY IF EXISTS "creators_read_own_payouts" ON public.creator_payouts;
CREATE POLICY "creators_read_own_payouts"
  ON public.creator_payouts
  FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = auth.uid()
    )
  );

-- Merchants can read payouts for their campaigns (for billing/reporting)
DROP POLICY IF EXISTS "merchants_read_campaign_payouts" ON public.creator_payouts;
CREATE POLICY "merchants_read_campaign_payouts"
  ON public.creator_payouts
  FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      INNER JOIN public.merchants m ON m.id = c.merchant_id
      WHERE m.user_id = auth.uid()
    )
  );


-- ------- qr_scans -------

-- Creators can read scan analytics for their own QR codes
DROP POLICY IF EXISTS "creators_read_own_qr_scans" ON public.qr_scans;
CREATE POLICY "creators_read_own_qr_scans"
  ON public.qr_scans
  FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = auth.uid()
    )
  );

-- Merchants can read scan events for their campaigns
DROP POLICY IF EXISTS "merchants_read_campaign_qr_scans" ON public.qr_scans;
CREATE POLICY "merchants_read_campaign_qr_scans"
  ON public.qr_scans
  FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      INNER JOIN public.merchants m ON m.id = c.merchant_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Public (anonymous) insert for QR scan events — attribution does not require login
DROP POLICY IF EXISTS "public_insert_qr_scans" ON public.qr_scans;
CREATE POLICY "public_insert_qr_scans"
  ON public.qr_scans
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- =============================================================
-- 7. recalculate_push_score()
-- Composite score = 30% completion + 20% reliability +
--                   25% content quality + 15% satisfaction + 10% engagement
-- Writes result directly to creators.push_score.
-- =============================================================

CREATE OR REPLACE FUNCTION public.recalculate_push_score(p_creator_id UUID)
RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_completion_rate NUMERIC := 0;
  v_reliability     NUMERIC := 0;
  v_quality         NUMERIC := 0;
  v_satisfaction    NUMERIC := 0;
  v_engagement      NUMERIC := 0;
  v_score           NUMERIC;
  v_completed       INT;
  v_accepted        INT;
BEGIN
  -- Pull raw counters from creators row
  SELECT campaigns_completed, campaigns_accepted
  INTO v_completed, v_accepted
  FROM public.creators
  WHERE id = p_creator_id;

  -- Completion rate (0–100)
  IF v_accepted > 0 THEN
    v_completion_rate := (v_completed::NUMERIC / v_accepted) * 100;
  END IF;

  -- Quality, satisfaction, engagement from settled submissions
  SELECT
    COALESCE(AVG(cs.content_rating / 5.0 * 100), 0),
    COALESCE(AVG(cs.merchant_rebook_score / 5.0 * 100), 0),
    COALESCE(AVG(LEAST(cs.engagement_rate / 0.03, 1.0) * 100), 0)
  INTO v_quality, v_satisfaction, v_engagement
  FROM public.creator_submissions cs
  WHERE cs.creator_id = p_creator_id
    AND cs.milestone = 'settled';

  -- Reliability: capped derivative of completion rate (penalises drop-offs)
  v_reliability := LEAST(v_completion_rate * 0.9, 100);

  -- Weighted composite
  v_score :=
    (v_completion_rate * 0.30) +
    (v_reliability     * 0.20) +
    (v_quality         * 0.25) +
    (v_satisfaction    * 0.15) +
    (v_engagement      * 0.10);

  -- Persist to creators row
  UPDATE public.creators
  SET
    push_score       = LEAST(GREATEST(v_score, 0), 100),
    score_updated_at = now()
  WHERE id = p_creator_id;

  RETURN v_score;
END;
$$;

COMMENT ON FUNCTION public.recalculate_push_score(UUID) IS
  'Recomputes push_score for a creator and persists it. Call after every settled submission or counter update.';
