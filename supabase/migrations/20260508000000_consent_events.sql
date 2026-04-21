-- ============================================================================
-- Migration v5.3 +2 — consent_events audit ledger
-- ============================================================================
-- Append-only event stream for every consent-tier change, disclosure view,
-- and data-rights action. Pairs with push_transactions.consent_tier /
-- consent_version to reconstruct "what did this device consent to at time T?"
-- for legal audits (CCPA § 1798.130, CPRA disclosure, FTC § 255 endorsement
-- disclosure proof).
--
-- Design:
--   - Append-only: no UPDATE or DELETE policies; corrections are new rows.
--   - Device-keyed: device_id_hash matches push_transactions.device_id_hash.
--   - Tier semantics: 0 = no consent / revoked; 1 = attribution only;
--     2 = full product use; 3 = commercial data-licensing allowed.
--   - Service-role only: RLS on, no policies. All writes via backend.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.consent_events (
  -- Identity
  event_id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id_hash     TEXT        NOT NULL,
  customer_id_hash   TEXT        NULL,

  -- Event classification
  event_type         TEXT        NOT NULL
                     CHECK (event_type IN (
                       'opt_in',
                       'opt_out',
                       'tier_change',
                       'disclosure_shown',
                       'disclosure_acknowledged',
                       'data_rights_request',
                       'revocation'
                     )),

  -- Consent state transition (0 = no consent / revoked)
  prior_tier         SMALLINT    NULL CHECK (prior_tier IN (0,1,2,3)),
  new_tier           SMALLINT    NOT NULL CHECK (new_tier IN (0,1,2,3)),

  consent_version    TEXT        NOT NULL,

  -- Context (all optional, for audit drill-down)
  campaign_id        UUID        NULL,
  creator_id         UUID        NULL,
  ftc_disclosure_shown BOOLEAN   NULL,

  -- Request metadata (hashed to avoid storing plaintext IP/UA)
  ip_address_hash    TEXT        NULL,
  user_agent_hash    TEXT        NULL,

  source             TEXT        NOT NULL
                     CHECK (source IN (
                       'web','app','merchant_portal','creator_portal','admin','api'
                     )),

  event_timestamp    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT consent_events_created_after_event
    CHECK (created_at >= event_timestamp - INTERVAL '5 minutes')
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_consent_events_device
  ON public.consent_events (device_id_hash, event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_consent_events_customer
  ON public.consent_events (customer_id_hash, event_timestamp DESC)
  WHERE customer_id_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_consent_events_type_time
  ON public.consent_events (event_type, event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_consent_events_campaign
  ON public.consent_events (campaign_id, event_timestamp DESC)
  WHERE campaign_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- RLS — service-role only (no policies).
-- ---------------------------------------------------------------------------
ALTER TABLE public.consent_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.consent_events IS
  'Append-only consent + disclosure audit ledger. Service-role only '
  '(no RLS policies). Pairs with push_transactions for full legal trail.';

COMMENT ON COLUMN public.consent_events.new_tier IS
  '0 = no consent / revoked; 1 = attribution only; 2 = full product use; '
  '3 = commercial data-licensing allowed.';

COMMENT ON COLUMN public.consent_events.device_id_hash IS
  'SHA256 of first-party device identifier. Matches push_transactions.device_id_hash.';
