-- ============================================================================
-- Migration v5.3 +5 — email_log (P0-4 audit ledger)
-- ============================================================================
-- Append-only record of every outbound email Push attempts to send. Pairs
-- with privacy_requests / consent_events for legal audits (CCPA data-rights
-- confirmations, FTC endorsement disclosures mailed to creators, etc.).
--
-- Design:
--   - Append-only: no UPDATE, no DELETE. Corrections ship as new rows.
--   - Service-role only: RLS on, no policies.
--   - Quota guard: the service layer counts rows WHERE sent_at >= now() -
--     '24 hours' to cap a runaway loop; this table is the authoritative
--     counter for that check.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_log (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Routing
  to_email_hash     TEXT        NOT NULL,        -- SHA256 of recipient — never plaintext
  from_email        TEXT        NOT NULL,
  template          TEXT        NOT NULL
                    CHECK (template IN (
                      'merchant_welcome',
                      'creator_welcome',
                      'privacy_request_received',
                      'dispute_notify',
                      'dsar_response'
                    )),

  -- Context
  subject           TEXT        NOT NULL,
  vars_shape_hash   TEXT        NULL,            -- hash of variable keys only (debug aid)

  -- Delivery
  provider          TEXT        NOT NULL DEFAULT 'resend'
                    CHECK (provider IN ('resend','sendgrid','ses','dry_run')),
  provider_msg_id   TEXT        NULL,
  status            TEXT        NOT NULL DEFAULT 'sent'
                    CHECK (status IN ('sent','failed','dry_run')),
  error_code        TEXT        NULL,

  -- Audit
  triggered_by      TEXT        NOT NULL
                    CHECK (triggered_by IN ('system','admin','cron','api')),
  triggered_by_user_id UUID     NULL REFERENCES public.users(id) ON DELETE SET NULL,

  sent_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_template_time
  ON public.email_log (template, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_log_recipient
  ON public.email_log (to_email_hash, sent_at DESC);

-- Daily quota guard query lives against this index.
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at
  ON public.email_log (sent_at DESC);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.email_log IS
  'Append-only log of every outbound email. Service-role only. Quota + '
  'audit readings come from this table; actual delivery state for retries '
  'should still be fetched from the provider (Resend) by message id.';

COMMENT ON COLUMN public.email_log.to_email_hash IS
  'SHA256 of recipient address. Plaintext recipient never stored to limit '
  'CCPA/GDPR exposure if the table is ever queried beyond the service role.';
