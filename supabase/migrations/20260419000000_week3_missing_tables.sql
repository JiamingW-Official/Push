-- ============================================================================
-- Week 3 — Missing tables backfill
-- ============================================================================
--
-- Batch A follow-up of the full-backend audit: the TypeScript type layer in
-- /types/database.ts declares 6 tables (LoyaltyCard, AIAccuracyAudit,
-- MerchantMetricsWeekly, CreatorRecruitmentFunnel, ClaimAppeal,
-- NeighborhoodProfile) plus an implicit 7th table (verified_customer_claims)
-- that AIVerificationService + WeeklyMerchantReportService both query
-- directly — but none of them had a migration. Any route that hits these
-- services crashes with "relation does not exist" in real-DB mode (and
-- returns a 500 in the Session 3-4 dashboard, which is why mock fallback
-- is so aggressive).
--
-- This migration creates all 7 tables with:
--   - FK constraints (ON DELETE CASCADE where the child is owned by the
--     parent; ON DELETE SET NULL where the child can outlive the parent)
--   - CHECK constraints mirroring the TS union types (tier, status enums)
--   - `updated_at` triggers re-using the existing `trigger_set_updated_at`
--     function defined in 20260418000001
--   - Hot-path indexes flagged by the audit (crf status+score, crf tier+date,
--     loyalty merchant+date, claims verified_at + manual_review_status)
--
-- All CREATE statements use IF NOT EXISTS so re-running is safe.
-- ============================================================================

-- Ensure the shared updated_at trigger function exists (idempotent redefine).
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. loyalty_cards — customer stamp cards scoped to (customer, merchant)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.loyalty_cards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL,
  creator_id    UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  merchant_id   UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  stamp_count   INT  NOT NULL DEFAULT 0 CHECK (stamp_count >= 0),
  max_stamps    INT  NOT NULL DEFAULT 10 CHECK (max_stamps >= 1),
  redeemed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT stamp_count_within_max CHECK (stamp_count <= max_stamps),
  CONSTRAINT unique_customer_merchant UNIQUE (customer_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_merchant_created
  ON public.loyalty_cards (merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_creator
  ON public.loyalty_cards (creator_id);

DROP TRIGGER IF EXISTS set_updated_at_loyalty_cards ON public.loyalty_cards;
CREATE TRIGGER set_updated_at_loyalty_cards
  BEFORE UPDATE ON public.loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 2. verified_customer_claims — outputs of the AI verification pipeline
-- ============================================================================
-- Schema inferred from AIVerificationService + WeeklyMerchantReportService
-- consumers. `ai_decision` and `manual_review_status` mirror the TS union
-- types exposed by VerificationStatus + manual-review flow.

CREATE TABLE IF NOT EXISTS public.verified_customer_claims (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id           UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  creator_id            UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  customer_name         TEXT NOT NULL,
  photo_url             TEXT,
  receipt_url           TEXT,
  customer_lat          DECIMAL(9, 6),
  customer_lon          DECIMAL(9, 6),
  ai_confidence_score   DECIMAL(4, 3) CHECK (
    ai_confidence_score IS NULL OR (ai_confidence_score >= 0 AND ai_confidence_score <= 1)
  ),
  ai_decision           TEXT CHECK (
    ai_decision IS NULL OR ai_decision IN ('auto_verified', 'manual_review_required', 'rejected')
  ),
  manual_review_status  TEXT CHECK (
    manual_review_status IS NULL OR manual_review_status IN ('approved', 'rejected')
  ),
  verified_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vcc_merchant_verified_at
  ON public.verified_customer_claims (merchant_id, verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_vcc_verified_at
  ON public.verified_customer_claims (verified_at);
CREATE INDEX IF NOT EXISTS idx_vcc_manual_review
  ON public.verified_customer_claims (manual_review_status)
  WHERE manual_review_status IS NOT NULL;

DROP TRIGGER IF EXISTS set_updated_at_vcc ON public.verified_customer_claims;
CREATE TRIGGER set_updated_at_vcc
  BEFORE UPDATE ON public.verified_customer_claims
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 3. ai_accuracy_audits — weekly ConversionOracle accuracy rollup
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_accuracy_audits (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number           INT  NOT NULL UNIQUE CHECK (week_number BETWEEN 1 AND 53),
  total_auto_verified   INT  NOT NULL DEFAULT 0 CHECK (total_auto_verified >= 0),
  false_positive_count  INT  NOT NULL DEFAULT 0 CHECK (false_positive_count >= 0),
  false_negative_count  INT  NOT NULL DEFAULT 0 CHECK (false_negative_count >= 0),
  false_positive_rate   DECIMAL(5, 2) NOT NULL DEFAULT 0 CHECK (false_positive_rate >= 0 AND false_positive_rate <= 100),
  false_negative_rate   DECIMAL(5, 2) NOT NULL DEFAULT 0 CHECK (false_negative_rate >= 0 AND false_negative_rate <= 100),
  manual_approved       INT  NOT NULL DEFAULT 0 CHECK (manual_approved >= 0),
  manual_rejected       INT  NOT NULL DEFAULT 0 CHECK (manual_rejected >= 0),
  creator_appeals       INT  NOT NULL DEFAULT 0 CHECK (creator_appeals >= 0),
  average_confidence    DECIMAL(4, 3) CHECK (
    average_confidence IS NULL OR (average_confidence >= 0 AND average_confidence <= 1)
  ),
  audit_date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_audits_audit_date
  ON public.ai_accuracy_audits (audit_date DESC);

DROP TRIGGER IF EXISTS set_updated_at_ai_audits ON public.ai_accuracy_audits;
CREATE TRIGGER set_updated_at_ai_audits
  BEFORE UPDATE ON public.ai_accuracy_audits
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 4. merchant_metrics_weekly — per-merchant weekly KPI aggregate
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.merchant_metrics_weekly (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id          UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  week_start           DATE NOT NULL,
  week_end             DATE NOT NULL,
  verified_customers   INT  NOT NULL DEFAULT 0 CHECK (verified_customers >= 0),
  total_revenue        DECIMAL(12, 2) NOT NULL DEFAULT 0,
  roi                  DECIMAL(10, 2) NOT NULL DEFAULT 0,
  creator_count        INT  NOT NULL DEFAULT 0 CHECK (creator_count >= 0),
  average_transaction  DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT week_end_after_start CHECK (week_end > week_start),
  CONSTRAINT unique_merchant_week UNIQUE (merchant_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_mmw_merchant_week
  ON public.merchant_metrics_weekly (merchant_id, week_start DESC);

DROP TRIGGER IF EXISTS set_updated_at_mmw ON public.merchant_metrics_weekly;
CREATE TRIGGER set_updated_at_mmw
  BEFORE UPDATE ON public.merchant_metrics_weekly
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 5. creator_recruitment_funnel — Session 3-1 lifecycle table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.creator_recruitment_funnel (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id           UUID NOT NULL UNIQUE REFERENCES public.creators(id) ON DELETE CASCADE,
  tier                 INT  NOT NULL CHECK (tier IN (1, 2, 3)),
  status               TEXT NOT NULL CHECK (
    status IN ('prospect', 'early_operator', 'active', 'churn')
  ),
  recruitment_source   TEXT NOT NULL CHECK (
    recruitment_source IN ('direct_network', 'community', 'incentive')
  ),
  signed_date          TIMESTAMPTZ,
  performance_score    DECIMAL(4, 3) NOT NULL DEFAULT 0 CHECK (
    performance_score >= 0 AND performance_score <= 1
  ),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Session 3-2 GET pattern: filter by status/tier, order by performance_score
-- or created_at (prospect fallback). Two composite indexes cover both paths.
CREATE INDEX IF NOT EXISTS idx_crf_status_performance
  ON public.creator_recruitment_funnel (status, performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_crf_tier_created
  ON public.creator_recruitment_funnel (tier, created_at DESC);

DROP TRIGGER IF EXISTS set_updated_at_crf ON public.creator_recruitment_funnel;
CREATE TRIGGER set_updated_at_crf
  BEFORE UPDATE ON public.creator_recruitment_funnel
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 6. claim_appeals — creator appeals against rejected verifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.claim_appeals (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id               UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  merchant_id              UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  claim_id                 UUID NOT NULL REFERENCES public.verified_customer_claims(id) ON DELETE CASCADE,
  appeal_reason            TEXT NOT NULL,
  supporting_evidence_url  TEXT,
  status                   TEXT NOT NULL DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'under_review', 'approved', 'rejected')
  ),
  merchant_decision        TEXT,
  merchant_id_reviewer     UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
  reviewed_at              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claim_appeals_merchant_status
  ON public.claim_appeals (merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_claim_appeals_claim
  ON public.claim_appeals (claim_id);

DROP TRIGGER IF EXISTS set_updated_at_claim_appeals ON public.claim_appeals;
CREATE TRIGGER set_updated_at_claim_appeals
  BEFORE UPDATE ON public.claim_appeals
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 7. neighborhood_profiles — per-neighborhood rollout management
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.neighborhood_profiles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_name    TEXT NOT NULL UNIQUE,
  latitude             DECIMAL(9, 6) CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  longitude            DECIMAL(9, 6) CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
  merchants_target     INT NOT NULL DEFAULT 0 CHECK (merchants_target >= 0),
  merchants_current    INT NOT NULL DEFAULT 0 CHECK (merchants_current >= 0),
  monthly_target_arr   DECIMAL(12, 2) NOT NULL DEFAULT 0,
  monthly_current_arr  DECIMAL(12, 2) NOT NULL DEFAULT 0,
  pricing_tier         TEXT,
  seasonality_factor   DECIMAL(4, 2) NOT NULL DEFAULT 1.0 CHECK (
    seasonality_factor >= 0 AND seasonality_factor <= 5
  ),
  status               TEXT NOT NULL DEFAULT 'planning' CHECK (
    status IN ('planning', 'pilot', 'active', 'mature')
  ),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_neighborhood_status
  ON public.neighborhood_profiles (status);

DROP TRIGGER IF EXISTS set_updated_at_neighborhood ON public.neighborhood_profiles;
CREATE TRIGGER set_updated_at_neighborhood
  BEFORE UPDATE ON public.neighborhood_profiles
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
