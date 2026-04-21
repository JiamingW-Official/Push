-- ============================================================================
-- Migration v5.3 +4 — campaigns.metadata + qr_codes table
-- ============================================================================
-- Two additions to unblock real-DB campaign + QR creation (v5.3-EXEC P1-1/P1-2):
--   1. campaigns.metadata JSONB for marketplace-style fields the current
--      merchant UI already sends (category/tier/commissionSplit/contentType/
--      platform) without reshuffling the existing schema columns.
--   2. qr_codes table keyed to campaigns/merchants, replacing mock-qr-codes.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. campaigns.metadata JSONB
-- ---------------------------------------------------------------------------
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.campaigns.metadata IS
  'v5.3 merchant-UI fields not promoted to columns yet: '
  'category, tier_min, commission_split_pct, content_type, platform. '
  'Shape is flexible — server-side readers must .default() missing keys.';

-- ---------------------------------------------------------------------------
-- 2. qr_codes table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL REFERENCES public.campaigns(id)  ON DELETE CASCADE,
  merchant_id       UUID NOT NULL REFERENCES public.merchants(id)  ON DELETE CASCADE,

  -- Display
  poster_type       TEXT NOT NULL CHECK (poster_type IN (
                      'a4','table-tent','window-sticker','cash-register'
                    )),
  hero_message      TEXT NOT NULL,
  sub_message       TEXT NOT NULL,

  -- Counters (denormalized; truth is the aggregate on push_transactions)
  scan_count        INTEGER NOT NULL DEFAULT 0,
  conversion_count  INTEGER NOT NULL DEFAULT 0,

  disabled          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at    TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_campaign_id
  ON public.qr_codes (campaign_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_merchant_id
  ON public.qr_codes (merchant_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_active
  ON public.qr_codes (merchant_id, disabled)
  WHERE disabled = FALSE;

ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS qr_codes_merchant_self_read ON public.qr_codes;
CREATE POLICY qr_codes_merchant_self_read
  ON public.qr_codes
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = (SELECT auth.uid())
    )
  );

COMMENT ON TABLE public.qr_codes IS
  'Per-poster QR record. One campaign can have N qr_codes (one per poster / '
  'location). Writes happen via the service-role client in the merchant API.';
