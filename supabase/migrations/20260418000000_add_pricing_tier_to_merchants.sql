-- =============================================================
-- v5.0 Pricing Tier Migration
-- Adds merchants.pricing_tier so we can grandfather v4 cohorts and
-- scope v5 outcome-based pricing to new signups (§9.2 decision).
-- =============================================================

ALTER TABLE public.merchants
  ADD COLUMN IF NOT EXISTS pricing_tier TEXT
    CHECK (pricing_tier IN (
      'legacy_starter',   -- $19.99/mo SaaS (founding cohort grandfathered)
      'legacy_growth',    -- $69/mo SaaS (founding cohort grandfathered)
      'legacy_scale',     -- $199/mo SaaS (founding cohort grandfathered)
      'v5_pilot',         -- $0 for first 10 merchants, first 10 customers free
      'v5_performance'    -- $500/mo min + $40/verified customer
    ));

COMMENT ON COLUMN public.merchants.pricing_tier IS
  'v5.0 pricing segmentation. NULL for merchants pre-dating the column.
   Legacy cohorts honored per original contract; new signups default to v5_pilot
   until their 11th verified customer flips them to v5_performance.';

CREATE INDEX IF NOT EXISTS idx_merchants_pricing_tier
  ON public.merchants(pricing_tier);
