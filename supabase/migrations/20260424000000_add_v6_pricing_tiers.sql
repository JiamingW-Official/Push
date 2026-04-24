-- =============================================================
-- v6 Pricing Tier Migration
-- Adds the 4-tier v6 pricing model (lite/essentials/pro/advanced) to
-- merchants.pricing_tier check constraint. Names are bare (no `v6_` prefix)
-- so they map 1:1 to the front-end PlanId type in lib/billing/mock-invoices.ts.
--
-- Compatibility:
--   - Legacy v4 cohorts (legacy_starter/growth/scale) preserved.
--   - v5 cohorts (v5_pilot/v5_performance) preserved.
--   - New signups default to 'lite' via app code.
--
-- DRY-RUN BEFORE APPLY:
--   SELECT pricing_tier, COUNT(*) FROM public.merchants
--   GROUP BY pricing_tier ORDER BY pricing_tier;
-- =============================================================

ALTER TABLE public.merchants
  DROP CONSTRAINT IF EXISTS merchants_pricing_tier_check;

ALTER TABLE public.merchants
  ADD CONSTRAINT merchants_pricing_tier_check
  CHECK (pricing_tier IN (
    -- v4 grandfathered (DO NOT DROP — founding cohort honored per original contract)
    'legacy_starter',   -- $19.99/mo SaaS
    'legacy_growth',    -- $69/mo SaaS
    'legacy_scale',     -- $199/mo SaaS
    -- v5 outcome-based (still active for v5 cohort)
    'v5_pilot',         -- $0 for first 10 merchants
    'v5_performance',   -- $500/mo min + $40/verified customer
    -- v6 four-tier (current default for new signups, 2026-Q2+)
    'lite',             -- $0/mo, 1 campaign, 20 verified visits/mo
    'essentials',       -- $99/mo, 3 campaigns, 150 verified visits/mo
    'pro',              -- 5% of attributed revenue, cap $179/mo, floor $49/mo (Year 1)
    'advanced',         -- $349/mo, multi-unit operators, API + dedicated CSM
    -- v6 Year-2 auto-flip target (set by year2-flip service when Pro hits cap 50%+ of Year 1 months)
    'pro_y2_flat'       -- $349/mo flat, post-flip Pro cohort
  ));

COMMENT ON COLUMN public.merchants.pricing_tier IS
  'v6 4-tier pricing (lite/essentials/pro/advanced) is the default for new signups as of 2026-Q2. Names are bare so they map 1:1 to lib/billing/mock-invoices.ts PlanId. Legacy v4 + v5 cohorts grandfathered. pro -> pro_y2_flat conversion handled by lib/services/pro-billing/year2-flip.ts (see spec/pro-billing-webhook-v1.md).';
