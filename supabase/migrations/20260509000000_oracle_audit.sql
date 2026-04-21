-- ============================================================================
-- Migration v5.3 +3 — oracle_audit (ConversionOracle run log)
-- ============================================================================
-- One row per ConversionOracle invocation. Pairs with push_transactions so
-- a single ad-to-physical conversion has full decision lineage:
--   push_transactions row       ← the label (ground truth)
--   oracle_audit row            ← how the decision was reached
--
-- Distinct from the older ai_verifications table which is keyed to qr_scans
-- (pre-v5.3 flow). This table is keyed to push_transactions (v5.3 flow).
--
-- Design:
--   - Append-only: no UPDATE, no DELETE. Re-running the oracle writes a new row.
--   - Service-role only: RLS on, no policies.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.oracle_audit (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id       UUID NULL
                       REFERENCES public.push_transactions(transaction_id)
                       ON DELETE SET NULL,

  -- Decision
  decision             TEXT NOT NULL CHECK (decision IN (
                         'auto_verified','manual_review_required','rejected'
                       )),
  confidence_score     NUMERIC(5,3) NOT NULL
                       CHECK (confidence_score >= 0 AND confidence_score <= 1),

  -- Per-signal scores (JSONB so we can extend without another migration)
  -- Expected shape: { vision, ocr, geo, timing?, merchant? }
  signal_scores        JSONB NOT NULL,
  reasoning            TEXT NOT NULL,

  -- Provenance: auto (inline during redeem) vs. admin-triggered review
  triggered_by         TEXT NOT NULL DEFAULT 'auto'
                       CHECK (triggered_by IN ('auto','admin','cron','api')),
  triggered_by_user_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oracle_audit_transaction
  ON public.oracle_audit (transaction_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_oracle_audit_decision_time
  ON public.oracle_audit (decision, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_oracle_audit_triggered_by
  ON public.oracle_audit (triggered_by, created_at DESC);

ALTER TABLE public.oracle_audit ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.oracle_audit IS
  'ConversionOracle decision log. One row per oracle run against a push_transactions row. '
  'Append-only. Service-role only (no RLS policies).';

COMMENT ON COLUMN public.oracle_audit.signal_scores IS
  'JSONB shape: { vision:number, ocr:number, geo:number, timing?:number, merchant?:number }. '
  'All values in [0,1]. Missing timing/merchant = 3-signal run (v5.2 caller).';
