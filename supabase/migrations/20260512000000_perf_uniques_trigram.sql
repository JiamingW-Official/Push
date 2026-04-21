-- ============================================================================
-- Migration v5.3 +6 — qr_codes UNIQUE + trigram + misc perf indexes
-- ============================================================================
-- Closes four items from docs/v5.3-optimization-audit-2026-04-21.md:
--   P1-DATA-1: qr_codes missing UNIQUE(campaign_id, poster_type) — prevents
--              merchants accidentally splitting scan counts across duplicate
--              posters for the same campaign.
--   P2-PERF-1: qr_codes.id prefix search is O(N) via ILIKE — add a GIN
--              trigram index so /api/merchant/redeem's prefix resolver stays
--              sub-millisecond as the table grows.
--   P1-PERF-*: compound indexes for the hottest analytics queries.
--   P1-DATA-3: email_log(sent_at, status) covering index for daily-quota gate.
--
-- Every statement is idempotent (IF NOT EXISTS / USING).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. qr_codes unique constraint: one active poster per (campaign, poster_type)
-- ---------------------------------------------------------------------------
-- Partial unique index instead of table-level UNIQUE so disabled rows can
-- coexist with a new active row for the same poster_type.
CREATE UNIQUE INDEX IF NOT EXISTS qr_codes_unique_active_poster
  ON public.qr_codes (campaign_id, poster_type)
  WHERE disabled = FALSE;

-- ---------------------------------------------------------------------------
-- 2. Trigram index for short-prefix lookup (/api/merchant/redeem)
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- gin_trgm_ops requires text input; cast UUID → text via expression index.
-- /api/merchant/redeem's ILIKE '<prefix>%' query rewrites through this.
CREATE INDEX IF NOT EXISTS idx_qr_codes_id_trgm
  ON public.qr_codes USING gin ((id::text) gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 3. Daily-quota gate on email_log (covering index)
-- ---------------------------------------------------------------------------
-- checkDailyQuota() counts rows WHERE sent_at >= now() - 24h AND status IN
-- ('sent','dry_run'). Compound index matches the predicate exactly.
CREATE INDEX IF NOT EXISTS idx_email_log_quota_window
  ON public.email_log (sent_at DESC, status)
  WHERE status IN ('sent','dry_run');

-- ---------------------------------------------------------------------------
-- 4. oracle_audit retention helper
-- ---------------------------------------------------------------------------
-- Most analytical reads are "latest decision per transaction", which the
-- (transaction_id, created_at DESC) index already handles. Add a partial
-- index for the "still waiting on a human" state to speed up the admin
-- manual_review queue.
CREATE INDEX IF NOT EXISTS idx_oracle_audit_pending_review
  ON public.oracle_audit (created_at DESC)
  WHERE decision = 'manual_review_required';

-- ---------------------------------------------------------------------------
-- 5. push_transactions — merchant daily aggregation path
-- ---------------------------------------------------------------------------
-- The merchant dashboard's "today's redemptions" query filters by merchant_id
-- and redeem_timestamp >= today(). Existing idx_merchant_redeem is partial
-- on redeem_timestamp IS NOT NULL which is fine; add a composite covering
-- the order_total_cents so the sum can be index-only scanned.
CREATE INDEX IF NOT EXISTS idx_push_transactions_merchant_daily_totals
  ON public.push_transactions (merchant_id, redeem_timestamp DESC, order_total_cents)
  WHERE redeem_timestamp IS NOT NULL;
