-- ============================================================================
-- Batch B — RLS policies for core + Week 3 tables
-- ============================================================================
--
-- Full-backend audit (2026-04-19) found that the initial_schema migration
-- enables RLS on users / creators / merchants / campaigns /
-- campaign_applications but defines ZERO policies. Effect: authenticated
-- callers on the anon-key client get back empty sets, so the app either
-- 1) breaks open (if dev wired it to service-role by mistake — see
-- IDOR fixes in Batch A) or 2) stays silently broken.
--
-- This migration adds the minimum-viable policy set:
--   - SELF READ on users / creators / merchants (auth.uid() owns the row).
--   - SELF UPDATE on creators / merchants for profile editing.
--   - Campaign READ: everyone authenticated can see active campaigns;
--     owner merchants can see their own in any state.
--   - Applications: creator sees own applications; merchant sees apps on
--     their own campaigns.
--   - Writes beyond the self-update cases still go through the
--     service-role client in /api/* routes (which bypass RLS).
--
-- Week 3 tables (loyalty_cards, verified_customer_claims, creator_recruitment_funnel,
-- claim_appeals, ai_accuracy_audits, merchant_metrics_weekly, neighborhood_profiles)
-- have RLS ENABLED with a DENY-ALL default for anon/authenticated. All reads
-- and writes go through service-role API routes — the anon client has no
-- business touching these tables directly.
--
-- Every policy uses `DROP POLICY IF EXISTS … CREATE POLICY` so the migration
-- is idempotent across re-runs.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────
-- users — owner read
-- ────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS users_self_read ON public.users;
CREATE POLICY users_self_read ON public.users
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

-- ────────────────────────────────────────────────────────────────────────
-- creators — owner read + owner update
-- ────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS creators_self_read ON public.creators;
CREATE POLICY creators_self_read ON public.creators
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS creators_self_update ON public.creators;
CREATE POLICY creators_self_update ON public.creators
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ────────────────────────────────────────────────────────────────────────
-- merchants — owner read + owner update
-- ────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS merchants_self_read ON public.merchants;
CREATE POLICY merchants_self_read ON public.merchants
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS merchants_self_update ON public.merchants;
CREATE POLICY merchants_self_update ON public.merchants
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ────────────────────────────────────────────────────────────────────────
-- campaigns
--   Anyone authenticated can SEE active/paused campaigns (discovery).
--   Only the owning merchant can see their own drafts + full history.
-- ────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS campaigns_public_read ON public.campaigns;
CREATE POLICY campaigns_public_read ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (status IN ('active', 'paused'));

DROP POLICY IF EXISTS campaigns_owner_read ON public.campaigns;
CREATE POLICY campaigns_owner_read ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = (SELECT auth.uid())
    )
  );

-- ────────────────────────────────────────────────────────────────────────
-- campaign_applications
--   Creator sees their own applications. Merchant sees applications on
--   the campaigns they own.
-- ────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS campaign_applications_creator_read ON public.campaign_applications;
CREATE POLICY campaign_applications_creator_read ON public.campaign_applications
  FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS campaign_applications_merchant_read ON public.campaign_applications;
CREATE POLICY campaign_applications_merchant_read ON public.campaign_applications
  FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      JOIN public.merchants m ON m.id = c.merchant_id
      WHERE m.user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- Week 3 tables — enable RLS + deny-all default
-- ============================================================================
-- These tables are touched exclusively by the service-role client inside
-- /api routes (/api/internal/*, /api/merchant/reports/*, /api/merchant/dashboard,
-- /lib/services/*). Any direct anon-client access is a bug and should fail.

ALTER TABLE public.loyalty_cards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_customer_claims   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_accuracy_audits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_metrics_weekly    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_recruitment_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_appeals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhood_profiles      ENABLE ROW LEVEL SECURITY;

-- (No policies = deny-all for anon + authenticated. Service-role bypasses RLS.)
