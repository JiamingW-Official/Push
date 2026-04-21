-- ============================================================================
-- Push Transactions Schema v1 (v5.3)
-- ============================================================================
-- 32-field ground-truth transaction table for the Physical-World Ground Truth
-- Layer. Each row is one "ad -> physical conversion" label. Schema is the
-- primary training substrate for future Local Commerce World Model work.
--
-- Spec: /spec/data-schema-v1.md
--
-- Design notes:
--   - Identity: device_id is hashed first-party (never IDFA / GAID).
--   - Timing: time_to_redeem_sec and hour_of_week auto-computed by trigger.
--     Not GENERATED columns because EXTRACT on TIMESTAMPTZ is not IMMUTABLE
--     in the sense PostgreSQL requires for STORED generated columns.
--   - Location: opt-in; demo_zip_home is 3-prefix only (checked).
--   - Demo: ethnicity only for internal bias audit, never external agg.
--   - Compliance: consent_tier gates participation in data licensing.
--   - Retention: 24 months row-level (see spec doc).
-- ============================================================================

-- ------------------------------------------------------------
-- Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_transactions (
  -- Identity (first-party, 5)
  transaction_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id_hash          TEXT NOT NULL,
  creator_id              UUID NOT NULL,
  merchant_id             UUID NOT NULL,
  customer_id_hash        TEXT NOT NULL,

  -- Timing (4)
  claim_timestamp         TIMESTAMPTZ NOT NULL,
  redeem_timestamp        TIMESTAMPTZ,
  time_to_redeem_sec      INTEGER,
  expiry_timestamp        TIMESTAMPTZ NOT NULL,

  -- Location (opt-in, 5)
  claim_gps_lat           NUMERIC(9,6),
  claim_gps_lng           NUMERIC(9,6),
  redeem_gps_lat          NUMERIC(9,6),
  redeem_gps_lng          NUMERIC(9,6),
  merchant_dwell_sec      INTEGER,

  -- Commerce context (5)
  product_category        TEXT NOT NULL CHECK (product_category IN
                            ('coffee','pastry','beverage','meal','retail','service','other')),
  product_sku_hash        TEXT,
  order_total_cents       INTEGER NOT NULL,
  campaign_id             UUID NOT NULL,
  creative_content_hash   TEXT NOT NULL,

  -- Consumer demo (opt-in, 4)
  demo_age_bucket         TEXT CHECK (demo_age_bucket IN
                            ('u18','18-24','25-34','35-44','45-54','55+')),
  demo_gender             TEXT CHECK (demo_gender IN ('m','f','nb','decline')),
  demo_zip_home           TEXT,
  demo_ethnicity_bucket   TEXT,

  -- Behavioral (3)
  is_first_visit          BOOLEAN NOT NULL,
  cross_merchant_count    INTEGER NOT NULL DEFAULT 0,
  referral_chain_depth    INTEGER NOT NULL DEFAULT 1,

  -- Environmental (3)
  weather_code            TEXT,
  local_event_nearby      TEXT,
  hour_of_week            SMALLINT,

  -- Compliance (3)
  consent_version         TEXT NOT NULL,
  ftc_disclosure_shown    BOOLEAN NOT NULL,
  consent_tier            SMALLINT NOT NULL CHECK (consent_tier IN (1,2,3)),

  -- Book-keeping
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Cross-field constraints
  CONSTRAINT push_transactions_order_total_nonnegative
    CHECK (order_total_cents >= 0),
  CONSTRAINT push_transactions_zip_prefix_only
    CHECK (demo_zip_home IS NULL OR length(demo_zip_home) <= 3),
  CONSTRAINT push_transactions_redeem_after_claim
    CHECK (redeem_timestamp IS NULL OR redeem_timestamp >= claim_timestamp),
  CONSTRAINT push_transactions_expiry_after_claim
    CHECK (expiry_timestamp >= claim_timestamp)
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_creator_claim
  ON public.push_transactions (creator_id, claim_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_merchant_redeem
  ON public.push_transactions (merchant_id, redeem_timestamp DESC)
  WHERE redeem_timestamp IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_campaign_performance
  ON public.push_transactions (campaign_id, redeem_timestamp);

CREATE INDEX IF NOT EXISTS idx_device_cross_visit
  ON public.push_transactions (device_id_hash, claim_timestamp);

-- ------------------------------------------------------------
-- Trigger: auto-compute time_to_redeem_sec and hour_of_week
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.push_transactions_compute_derived()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- time_to_redeem_sec: elapsed seconds from claim to redeem
  IF NEW.redeem_timestamp IS NOT NULL AND NEW.claim_timestamp IS NOT NULL THEN
    NEW.time_to_redeem_sec :=
      EXTRACT(EPOCH FROM (NEW.redeem_timestamp - NEW.claim_timestamp))::INTEGER;
  ELSE
    NEW.time_to_redeem_sec := NULL;
  END IF;

  -- hour_of_week: 0..167 (DOW * 24 + hour)
  IF NEW.claim_timestamp IS NOT NULL THEN
    NEW.hour_of_week := (
      EXTRACT(DOW  FROM NEW.claim_timestamp)::INTEGER * 24
    + EXTRACT(HOUR FROM NEW.claim_timestamp)::INTEGER
    )::SMALLINT;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_push_transactions_derived ON public.push_transactions;
CREATE TRIGGER trg_push_transactions_derived
  BEFORE INSERT OR UPDATE ON public.push_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.push_transactions_compute_derived();

-- ------------------------------------------------------------
-- RLS — creator and merchant read own rows; writes via service role
-- ------------------------------------------------------------
ALTER TABLE public.push_transactions ENABLE ROW LEVEL SECURITY;

-- Creator self-read: caller's creators row matches the row's creator_id.
DROP POLICY IF EXISTS push_transactions_creator_self_read ON public.push_transactions;
CREATE POLICY push_transactions_creator_self_read
  ON public.push_transactions
  FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid())
    )
  );

-- Merchant self-read: caller's merchants row matches the row's merchant_id.
DROP POLICY IF EXISTS push_transactions_merchant_self_read ON public.push_transactions;
CREATE POLICY push_transactions_merchant_self_read
  ON public.push_transactions
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = (SELECT auth.uid())
    )
  );

-- No INSERT / UPDATE / DELETE policies for anon/authenticated — deny by default.
-- All writes go through the service-role client in backend routes.
-- service_role implicitly bypasses RLS (Supabase convention), so no explicit
-- policy is needed for it.

-- ------------------------------------------------------------
-- Comments (data-dictionary alignment)
-- ------------------------------------------------------------
COMMENT ON TABLE public.push_transactions IS
  'v5.3 ground-truth transaction records (Physical-World Ground Truth Layer). Spec: /spec/data-schema-v1.md';

COMMENT ON COLUMN public.push_transactions.device_id_hash IS
  'SHA256 of first-party device identifier. Never IDFA / GAID.';

COMMENT ON COLUMN public.push_transactions.creative_content_hash IS
  'SHA256 hash linking this row to the creator post (object-storage keyed separately).';

COMMENT ON COLUMN public.push_transactions.demo_ethnicity_bucket IS
  'Opt-in only. Internal bias audit; MUST NOT appear in any external aggregation.';

COMMENT ON COLUMN public.push_transactions.demo_zip_home IS
  'Home ZIP first 3 digits only (e.g. 112 for 11249/11211/11206). Full ZIP never stored.';

COMMENT ON COLUMN public.push_transactions.consent_tier IS
  '1=basic attribution only; 2=full product use; 3=commercial data-licensing allowed.';

COMMENT ON COLUMN public.push_transactions.hour_of_week IS
  'Auto-computed by trigger. 0..167 = DOW*24 + HOUR(claim_timestamp).';

COMMENT ON COLUMN public.push_transactions.time_to_redeem_sec IS
  'Auto-computed by trigger. NULL when redeem_timestamp IS NULL.';
