-- ============================================================================
-- Batch G — Performance index backfill
-- ============================================================================
--
-- Wave-1 perf audit flagged two query patterns whose leading index column
-- didn't match the filter predicate:
--
--   1. /api/admin/dashboard calls
--        `merchant_metrics_weekly.select().eq("week_start", ...)`
--      with NO merchant_id filter. The existing composite
--      `(merchant_id, week_start DESC)` is unusable for that query — the
--      planner falls back to a seq scan. Add a standalone
--      `(week_start DESC)` index.
--
--   2. /api/admin/creators uses `ORDER BY signed_date DESC` when
--      `status = 'prospect'`. A partial index on that filter keeps the
--      index tiny and lets the planner return already-sorted rows.
-- ============================================================================

-- (1) merchant_metrics_weekly — admin cross-merchant weekly lookup
CREATE INDEX IF NOT EXISTS idx_mmw_week_start
  ON public.merchant_metrics_weekly (week_start DESC);

-- (2) creator_recruitment_funnel — prospect sort path (signed_date DESC)
CREATE INDEX IF NOT EXISTS idx_crf_prospect_signed_date
  ON public.creator_recruitment_funnel (signed_date DESC)
  WHERE status = 'prospect';
