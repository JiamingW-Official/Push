-- =============================================================
-- Attribution Decay Curve (v6 / FTC 16 CFR Part 255 compliance)
-- =============================================================
-- Adds attribution_weight to push_transactions. One row per ad → physical
-- conversion is initially weighted 1.0; weight decays piecewise as time
-- since the customer's first attributed scan increases.
--
-- Decay schedule (matches the disclosure schedule we publish):
--   D0–D29   → 1.0
--   D30–D59  → 0.5
--   D60–D89  → 0.3
--   D90–D119 → 0.1
--   D120+    → 0   (rejected at API layer; row never inserted)
--
-- Computed in app code via lib/services/attribution-decay.ts and written
-- by the redeem path (/api/merchant/redeem) and the internal attribution
-- redemption path (/api/attribution/redemption).
-- =============================================================

ALTER TABLE public.push_transactions
  ADD COLUMN IF NOT EXISTS attribution_weight NUMERIC(4, 3) NOT NULL DEFAULT 1.000
    CHECK (attribution_weight >= 0 AND attribution_weight <= 1);

COMMENT ON COLUMN public.push_transactions.attribution_weight IS
  'FTC 16 CFR Part 255 decay weight. 1.0 on D0 first scan, 0.5 D30, 0.3 D60, 0.1 D90, 0 after. Recomputed on each repurchase. See lib/services/attribution-decay.ts.';

-- =============================================================
-- Payment Signal Source (Tier 0 third-signal placeholder)
-- =============================================================
-- v6 Tier 0 attribution requires three signals: QR scan + receipt OCR +
-- payment-source confirmation. The first two are live; payment-source
-- integration (Venmo Business, Zelle, Square Cash, Stripe Terminal) is
-- pending Year 2+ legal + commercial review. Schema is reserved here so
-- early rows get the column with NULL semantics ("2-of-3 only") and we
-- avoid a migration when the integration ships.
--
-- Spec: /spec/payment-signal-v1.md
-- =============================================================

ALTER TABLE public.push_transactions
  ADD COLUMN IF NOT EXISTS payment_signal_source TEXT
    CHECK (payment_signal_source IN ('venmo', 'zelle', 'square_cash', 'stripe_terminal') OR payment_signal_source IS NULL),
  ADD COLUMN IF NOT EXISTS payment_signal_ref_hash TEXT;

COMMENT ON COLUMN public.push_transactions.payment_signal_source IS
  'Third attribution signal source for Tier 0 verification. NULL means QR+receipt only (2-of-3). Pending Year 2+ Venmo Business integration.';

COMMENT ON COLUMN public.push_transactions.payment_signal_ref_hash IS
  'SHA-256 hash of the payment provider reference (e.g. Venmo transaction id). Never stored in plaintext; aggregation rule k>=50 enforced at query layer.';
