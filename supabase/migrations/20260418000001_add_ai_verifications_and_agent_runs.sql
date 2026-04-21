-- =============================================================
-- v5.0 AI Layer — verification + agent run tables
-- Backs the multi-modal verification (Claude Vision + QR + geo) and
-- the matching agent (Claude Sonnet 4.6). Phase-1 schema is stable —
-- Phase-2 can add prompt_version / model_snapshot columns as needed.
-- =============================================================

-- -------------------------------------------------------------
-- 1. ai_verifications
-- One row per verification attempt on a scan. Written by the
-- /api/attribution/scan route AFTER qr_scans row is committed.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_verifications (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id                     UUID NOT NULL REFERENCES public.qr_scans(id) ON DELETE CASCADE,
  merchant_id                 UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,

  -- Raw inputs (never shown to end users)
  receipt_image_url           TEXT,
  receipt_image_hash          TEXT,
  scan_lat                    DOUBLE PRECISION,
  scan_lng                    DOUBLE PRECISION,

  -- Claude Vision output
  vision_response             JSONB,
  vision_model                TEXT,
  vision_latency_ms           INTEGER,
  vision_cost_usd             NUMERIC(10, 6),

  -- Derived scores
  merchant_match_confidence   NUMERIC(3, 2) CHECK (merchant_match_confidence BETWEEN 0 AND 1),
  amount_extracted            NUMERIC(10, 2),
  geo_distance_meters         INTEGER,

  -- Verdict + override
  verdict                     TEXT NOT NULL CHECK (verdict IN (
                                'auto_verified',
                                'auto_rejected',
                                'manual_review',
                                'human_approved',
                                'human_rejected'
                              )),
  reviewed_by_human           BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_by_user_id         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  review_notes                TEXT,

  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at                 TIMESTAMPTZ
);

COMMENT ON TABLE public.ai_verifications IS
  'One row per scan verification attempt. auto_* verdicts are set by the
   scan route; manual_review rows surface in /admin/verifications for a
   human to resolve to human_approved or human_rejected.';

CREATE INDEX IF NOT EXISTS idx_ai_verifications_scan_id
  ON public.ai_verifications(scan_id);
CREATE INDEX IF NOT EXISTS idx_ai_verifications_merchant_id
  ON public.ai_verifications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ai_verifications_verdict_created
  ON public.ai_verifications(verdict, created_at DESC);

-- -------------------------------------------------------------
-- 2. agent_runs
-- One row per Claude agent invocation. Used for debugging, cost
-- tracking, and training-data retention (inputs + outputs together).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id    UUID REFERENCES public.merchants(id) ON DELETE SET NULL,

  agent_type     TEXT NOT NULL CHECK (agent_type IN (
                   'match_creators',
                   'draft_brief',
                   'predict_roi',
                   'verify_receipt'
                 )),

  -- Inputs / outputs as structured JSON
  input          JSONB NOT NULL,
  output         JSONB,

  -- Runtime + cost metadata
  model_used     TEXT,
  latency_ms     INTEGER,
  cost_usd       NUMERIC(10, 6),

  -- Error path
  error_code     TEXT,
  error_message  TEXT,

  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agent_runs IS
  'Append-only log of every Claude agent invocation. Kept indefinitely —
   these inputs/outputs are training data for future fine-tuned models.
   Scoped per-merchant for RLS; admins see everything.';

CREATE INDEX IF NOT EXISTS idx_agent_runs_merchant_id
  ON public.agent_runs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_type_created
  ON public.agent_runs(agent_type, created_at DESC);

-- -------------------------------------------------------------
-- 3. RLS
-- -------------------------------------------------------------
ALTER TABLE public.ai_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs       ENABLE ROW LEVEL SECURITY;

-- ai_verifications: merchant can read verifications for their own scans
-- (joined via merchant_id); service-role inserts bypass RLS.
DROP POLICY IF EXISTS "ai_verifications: merchant reads own"
  ON public.ai_verifications;
CREATE POLICY "ai_verifications: merchant reads own"
  ON public.ai_verifications
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM public.merchants m WHERE m.user_id = auth.uid()
    )
  );

-- agent_runs: same scoping
DROP POLICY IF EXISTS "agent_runs: merchant reads own"
  ON public.agent_runs;
CREATE POLICY "agent_runs: merchant reads own"
  ON public.agent_runs
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM public.merchants m WHERE m.user_id = auth.uid()
    )
  );
