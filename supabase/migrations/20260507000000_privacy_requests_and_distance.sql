-- ============================================================================
-- Migration v5.3 +1 — Privacy Requests table + haversine distance column
-- ============================================================================
-- Two independent additions:
--   1. public.privacy_requests — CCPA/GDPR/APRA DSAR intake ledger.
--      Service-role only (no RLS policies). 45-day SLA enforced via due_at.
--   2. public.push_transactions.claim_redeem_distance_m — auto-computed by
--      the existing trigger (extended below via CREATE OR REPLACE FUNCTION).
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, CREATE INDEX IF NOT EXISTS,
-- ALTER TABLE ... ADD COLUMN IF NOT EXISTS, CREATE OR REPLACE FUNCTION,
-- DROP TRIGGER IF EXISTS + CREATE TRIGGER.
-- ============================================================================

-- ------------------------------------------------------------
-- 1. privacy_requests table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.privacy_requests (
  ticket_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  received_at       TIMESTAMPTZ NOT NULL    DEFAULT now(),

  -- Stored lowercase for deduplication queries.
  email_lower       TEXT        NOT NULL,
  -- SHA256 of email_lower: re-lookup without ever storing plaintext again.
  email_hash        TEXT        NOT NULL,

  request_type      TEXT        NOT NULL
                    CHECK (request_type IN (
                      'access','deletion','correction',
                      'opt_out_of_sale','portability','restriction','other'
                    )),

  jurisdiction      TEXT        NULL,
  details           TEXT        NULL,
  verification_hint TEXT        NULL,
  consent_ack       BOOLEAN     NOT NULL,

  status            TEXT        NOT NULL DEFAULT 'received'
                    CHECK (status IN (
                      'received','verifying','resolved','denied','expired'
                    )),

  -- CCPA mandates 45 calendar days; computed and stored at intake time.
  due_at            TIMESTAMPTZ NOT NULL,

  resolved_at       TIMESTAMPTZ NULL,
  resolution_note   TEXT        NULL,

  CONSTRAINT privacy_requests_resolved_after_received
    CHECK (resolved_at IS NULL OR resolved_at >= received_at)
);

-- Lookup by hashed email (e.g. "has this address filed before?").
CREATE INDEX IF NOT EXISTS idx_privacy_requests_email_hash
  ON public.privacy_requests (email_hash);

-- Ops dashboard: newest first.
CREATE INDEX IF NOT EXISTS idx_privacy_requests_received_at
  ON public.privacy_requests (received_at DESC);

-- SLA alerting: find open requests that are approaching or past due.
CREATE INDEX IF NOT EXISTS idx_privacy_requests_status_due_at
  ON public.privacy_requests (status, due_at);

-- Enable RLS — no policies added intentionally.
-- All reads and writes go through the service-role client which bypasses RLS.
-- Any future direct-access policy must be reviewed by legal before creation.
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.privacy_requests IS
  'CCPA § 1798.130 / GDPR Art. 15-20 DSAR ledger. '
  'SLA: CCPA 45 days (due_at = received_at + 45 days), GDPR 30 days (manual tracking). '
  'No RLS policies are defined — service-role bypass is the only intended access path. '
  'Never expose this table to the anon or authenticated roles.';

-- ------------------------------------------------------------
-- 2. Add claim_redeem_distance_m column to push_transactions
-- ------------------------------------------------------------
ALTER TABLE public.push_transactions
  ADD COLUMN IF NOT EXISTS claim_redeem_distance_m NUMERIC(10,2);

COMMENT ON COLUMN public.push_transactions.claim_redeem_distance_m IS
  'Haversine great-circle distance in metres between claim_gps and redeem_gps. '
  'Auto-computed by trigger push_transactions_compute_derived on INSERT/UPDATE. '
  'NULL when either GPS pair is missing.';

-- ------------------------------------------------------------
-- 3. Replace the derived-columns trigger function to also compute distance
-- ------------------------------------------------------------
-- Replaces the v5.3 function body while preserving the existing
-- time_to_redeem_sec and hour_of_week logic unchanged.
--
-- Haversine formula (spherical Earth, radius 6 371 000 m):
--   d = 2 * R * asin( sqrt(
--         sin((lat2-lat1)/2)^2
--         + cos(lat1) * cos(lat2) * sin((lng2-lng1)/2)^2
--       ))
-- Inputs in degrees → converted to radians inside the function.
CREATE OR REPLACE FUNCTION public.push_transactions_compute_derived()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  lat1 DOUBLE PRECISION;
  lng1 DOUBLE PRECISION;
  lat2 DOUBLE PRECISION;
  lng2 DOUBLE PRECISION;
  dlat DOUBLE PRECISION;
  dlng DOUBLE PRECISION;
  a    DOUBLE PRECISION;
BEGIN
  -- time_to_redeem_sec: elapsed seconds from claim to redeem
  IF NEW.redeem_timestamp IS NOT NULL AND NEW.claim_timestamp IS NOT NULL THEN
    NEW.time_to_redeem_sec :=
      EXTRACT(EPOCH FROM (NEW.redeem_timestamp - NEW.claim_timestamp))::INTEGER;
  ELSE
    NEW.time_to_redeem_sec := NULL;
  END IF;

  -- hour_of_week: 0..167 (DOW * 24 + hour), anchored to claim_timestamp
  IF NEW.claim_timestamp IS NOT NULL THEN
    NEW.hour_of_week := (
        EXTRACT(DOW  FROM NEW.claim_timestamp)::INTEGER * 24
      + EXTRACT(HOUR FROM NEW.claim_timestamp)::INTEGER
    )::SMALLINT;
  END IF;

  -- claim_redeem_distance_m: haversine distance in metres
  -- Only computed when both GPS pairs are fully populated.
  IF NEW.claim_gps_lat  IS NOT NULL
     AND NEW.claim_gps_lng  IS NOT NULL
     AND NEW.redeem_gps_lat IS NOT NULL
     AND NEW.redeem_gps_lng IS NOT NULL
  THEN
    lat1 := radians(NEW.claim_gps_lat::DOUBLE PRECISION);
    lng1 := radians(NEW.claim_gps_lng::DOUBLE PRECISION);
    lat2 := radians(NEW.redeem_gps_lat::DOUBLE PRECISION);
    lng2 := radians(NEW.redeem_gps_lng::DOUBLE PRECISION);

    dlat := lat2 - lat1;
    dlng := lng2 - lng1;

    a := sin(dlat / 2.0) ^ 2
       + cos(lat1) * cos(lat2) * sin(dlng / 2.0) ^ 2;

    NEW.claim_redeem_distance_m :=
      round(
        (2.0 * 6371000.0 * asin(sqrt(a)))::NUMERIC,
        2
      );
  ELSE
    NEW.claim_redeem_distance_m := NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Re-create the trigger (idempotent via DROP IF EXISTS).
DROP TRIGGER IF EXISTS trg_push_transactions_derived ON public.push_transactions;
CREATE TRIGGER trg_push_transactions_derived
  BEFORE INSERT OR UPDATE ON public.push_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.push_transactions_compute_derived();
