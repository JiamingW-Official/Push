# Pro Billing Webhook v1 — Outcome-Based Billing Architecture

**Status**: Spec — NOT implemented. No code or migrations shipped yet.
**Owner**: Jiaming
**Last updated**: 2026-04-24
**Depends on**: `push_transactions` (v5.3), `v6_pro` pricing tier (20260424000000 migration), Stripe Connect (existing), `lib/services/attribution-decay.ts`

---

## 1. Data Flow Overview

```
POS terminal / QR scan
        │
        ▼
/api/attribution/redemption  (INTERNAL_API_SECRET gated, via middleware.ts)
        │  writes one row to push_transactions
        │  (merchant_id, creator_id, order_total_cents, claim_timestamp,
        │   attribution_weight — sourced from attribution-decay.ts)
        ▼
push_transactions  ──────────────────────────────────────────────────────┐
        │                                                                 │
        │  (rows accumulate all month)                                    │
        ▼                                                                 │
Vercel Cron: 00:05 UTC day 1 of month                                    │
  POST /api/internal/pro-billing/run-month                               │
  (x-internal-api-secret header, gated by middleware.ts)                 │
        │                                                                 │
        ▼                                                                 │
ProBillingAggregator.computeMonthlyFee()                                 │
  SELECT SUM(order_total_cents * attribution_weight)                      │
    FROM push_transactions                                                │
   WHERE merchant_id = $1                                                 │
     AND redeem_timestamp >= period_start                                 │
     AND redeem_timestamp <  period_end                                   │
  → attributed_revenue_cents                                             │
  → fee_cents = clamp(attributed_revenue_cents * 0.05,                   │
                       floor=4900, cap=17900)                            │
        │                                                                 │
        ▼                                                                 │
ProSubscriptionStateService.recordCapHit()                               │
  UPDATE pro_subscription_state                                           │
  (tracks rolling 12-month window for Year-2 auto-flip)                 │
        │                                                                 │
        ▼                                                                 │
StripeInvoiceService.createAndFinalizeInvoice()                          │
  stripe.invoices.create() on Push platform-side customer record         │
  stripe.invoices.finalizeInvoice() + stripe.invoices.pay()              │
        │                                                                 │
        ▼                                                                 │
Stripe ──► POST /api/stripe/webhook                                      │
           (stripe-signature verified, event.id deduped)                 │
           invoice.payment_succeeded → billing_ledger upsert             │
           invoice.payment_failed    → retry / dunning sequence          │
        │                                                                 │
        ▼                                                                 │
billing_ledger  ◄────────────────────────────────────────────────────────┘
  one row per settled invoice, idempotent on stripe_invoice_id
```

---

## 2. DB Schema Additions

All three additions are applied in a single migration. Service-role writes only (`lib/db/index.ts`). RLS enabled on all three tables; no `authenticated`-role DML policies — the public Supabase anon/authenticated client has no write access.

### 2a. New pricing_tier enum value

The post-flip Year-2-flat value is added to the existing check constraint in a follow-on migration. Proposed value: **`v6_pro_flat`**.

```sql
-- Migration: 20260501000000_add_v6_pro_flat_tier.sql
-- Run AFTER 20260424000000_add_v6_pricing_tiers.sql

ALTER TABLE public.merchants
  DROP CONSTRAINT IF EXISTS merchants_pricing_tier_check;

ALTER TABLE public.merchants
  ADD CONSTRAINT merchants_pricing_tier_check
  CHECK (pricing_tier IN (
    'legacy_starter',
    'legacy_growth',
    'legacy_scale',
    'v5_pilot',
    'v5_performance',
    'v6_lite',
    'v6_essentials',
    'v6_pro',         -- Year 1: 5% attributed revenue, floor $49, cap $179
    'v6_pro_flat',    -- Year 2+: flat $199/mo (auto-flip from v6_pro)
    'v6_advanced'
  ));

COMMENT ON COLUMN public.merchants.pricing_tier IS
  'v6_pro: outcome-based Year 1. v6_pro_flat: flat-rate Year 2+ (auto-flip '
  'when cap hit in >= 50% of Year 1 months). See spec/pro-billing-webhook-v1.md.';
```

### 2b. billing_ledger

One row per Stripe invoice event. Idempotent on `stripe_invoice_id`. Records both the raw Stripe amounts and the Push attribution calculation inputs for reconciliation.

```sql
CREATE TABLE IF NOT EXISTS public.billing_ledger (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Merchant identity
  merchant_id               UUID NOT NULL
                              REFERENCES public.merchants(id) ON DELETE RESTRICT,

  -- Billing period (UTC, exclusive end)
  billing_period_start      TIMESTAMPTZ NOT NULL,
  billing_period_end        TIMESTAMPTZ NOT NULL,

  -- Attribution inputs (captured at invoice creation time; immutable after)
  attributed_revenue_cents  INTEGER NOT NULL CHECK (attributed_revenue_cents >= 0),
  fee_rate_bps              SMALLINT NOT NULL DEFAULT 500,  -- 500 = 5.00%
  fee_before_clamp_cents    INTEGER NOT NULL CHECK (fee_before_clamp_cents >= 0),
  floor_cents               INTEGER NOT NULL DEFAULT 4900,
  cap_cents                 INTEGER NOT NULL DEFAULT 17900,
  fee_final_cents           INTEGER NOT NULL
                              CHECK (fee_final_cents >= 0),

  -- Stripe references
  stripe_invoice_id         TEXT NOT NULL UNIQUE,           -- idempotency key
  stripe_customer_id        TEXT NOT NULL,
  stripe_charge_id          TEXT,                           -- populated on success

  -- Status lifecycle
  status                    TEXT NOT NULL
                              CHECK (status IN (
                                'draft',
                                'open',
                                'paid',
                                'uncollectible',
                                'void'
                              ))
                              DEFAULT 'draft',

  -- Timestamps
  invoice_created_at        TIMESTAMPTZ NOT NULL,
  paid_at                   TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent double-billing the same merchant for the same period
  CONSTRAINT billing_ledger_merchant_period_unique
    UNIQUE (merchant_id, billing_period_start),

  CONSTRAINT billing_ledger_period_order
    CHECK (billing_period_end > billing_period_start),

  CONSTRAINT billing_ledger_fee_within_bounds
    CHECK (
      fee_final_cents >= floor_cents AND
      fee_final_cents <= cap_cents
    )
);

CREATE INDEX IF NOT EXISTS idx_billing_ledger_merchant_period
  ON public.billing_ledger (merchant_id, billing_period_start DESC);

CREATE INDEX IF NOT EXISTS idx_billing_ledger_status
  ON public.billing_ledger (status)
  WHERE status IN ('open', 'uncollectible');

ALTER TABLE public.billing_ledger ENABLE ROW LEVEL SECURITY;

-- Merchant self-read: show only their own invoices
CREATE POLICY billing_ledger_merchant_self_read
  ON public.billing_ledger FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = (SELECT auth.uid())
    )
  );

COMMENT ON TABLE public.billing_ledger IS
  'One row per Stripe invoice for v6_pro merchants. Idempotent on stripe_invoice_id. '
  'Spec: /spec/pro-billing-webhook-v1.md';

COMMENT ON COLUMN public.billing_ledger.fee_rate_bps IS
  'Stored at invoice creation time so historical rows survive future rate changes. '
  '500 bps = 5.00%.';

COMMENT ON COLUMN public.billing_ledger.fee_before_clamp_cents IS
  'attributed_revenue_cents * fee_rate_bps / 10000, before floor/cap applied. '
  'Retained for audit; never shown to merchants.';
```

### 2c. pro_subscription_state

One row per merchant on a `v6_pro` or `v6_pro_flat` plan. Tracks the rolling 12-month cap-hit history needed for the Year-2 auto-flip decision. Updated atomically alongside billing_ledger writes inside `run-month`.

```sql
CREATE TABLE IF NOT EXISTS public.pro_subscription_state (
  merchant_id               UUID PRIMARY KEY
                              REFERENCES public.merchants(id) ON DELETE RESTRICT,

  -- Year 1 tracking: which billing months hit the cap?
  -- Stored as a sorted JSONB array of ISO-8601 month strings: ["2026-05","2026-06",...]
  cap_hit_months            JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Derived counter (maintained by app code, not a generated column)
  cap_hit_count             SMALLINT NOT NULL DEFAULT 0,

  -- When Year-2 auto-flip was triggered (NULL until flip fires)
  year2_flip_triggered_at   TIMESTAMPTZ,

  -- Which billing_period_start was month 12 (the period that crossed the 50% threshold)
  flip_trigger_period_start TIMESTAMPTZ,

  -- Rollback support: original tier before flip
  pre_flip_tier             TEXT,

  -- If merchant disputed and flip was reversed
  flip_reversed_at          TIMESTAMPTZ,
  flip_reversed_reason      TEXT,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pro_subscription_state ENABLE ROW LEVEL SECURITY;

-- No authenticated-role policies: this table is internal-only.
-- Merchant dashboard reads are served via the billing preview endpoint,
-- not direct Supabase queries from the client.

COMMENT ON TABLE public.pro_subscription_state IS
  'Rolling 12-month cap-hit state for v6_pro Year-1 → Year-2 auto-flip. '
  'One row per merchant. Spec: /spec/pro-billing-webhook-v1.md';

COMMENT ON COLUMN public.pro_subscription_state.cap_hit_months IS
  'Sorted array of billing-period starts (YYYY-MM format) where fee_final_cents '
  'equalled cap_cents. Only the 12 most recent periods are evaluated for the flip.';
```

---

## 3. Service Module Layout

All modules live under `lib/services/pro-billing/`. They are stateless functions (no class state, no singletons). They import `db` from `lib/db/index.ts` (service role) and call into attribution-decay.ts as needed. No Next.js primitives (`next/headers`, `NextResponse`) — routes are thin wrappers.

### 3a. `aggregator.ts` — Monthly fee computation

**Contract**: Given a `merchantId: string` and a `billingPeriod: { start: Date; end: Date }`, queries `push_transactions` for all rows where `redeem_timestamp` falls in `[start, end)`. Computes `attributed_revenue_cents = SUM(order_total_cents * attribution_weight)` using the pre-stored `attribution_weight` column (the decay value was fixed at redemption time; do NOT recompute here). Applies the fee formula: `fee_before_clamp = attributed_revenue_cents * 0.05`; `fee_final = clamp(fee_before_clamp, 4900, 17900)`. Returns `AggregationResult { attributed_revenue_cents, fee_before_clamp_cents, fee_final_cents, transaction_count }`.

**Failure modes**: Supabase query error → propagate as thrown error (caller catches, returns 500 with trace_id). Zero-row result is valid (new merchant month, fee = floor = $49).

**Calls into**: `lib/db/index.ts` (`db` service-role client).

**Does NOT call**: attribution-decay.ts — the weight is already persisted on each transaction row at redemption time. The aggregator only reads it.

### 3b. `stripe-invoice.ts` — Invoice lifecycle management

**Contract**: Two functions. `createAndPayInvoice(params: { merchantId, stripeCustomerId, feeAmountCents, billingPeriod, idempotencyKey })` — creates a Stripe Invoice with a single line item ("Push Pro — {month} attributed revenue fee"), finalizes it, and calls `pay`. The `idempotencyKey` is `pro-{merchantId}-{billingPeriodStart ISO}`, passed to the Stripe SDK on every mutating call. Returns `{ stripeInvoiceId, stripeChargeId, status }`. `voidInvoice(stripeInvoiceId, reason)` — calls `stripe.invoices.voidInvoice`; used by downgrade and rollback paths.

**Failure modes**: Card decline (`StripeCardError`) → invoice stays `open`; caller writes ledger row and lets Stripe Smart Retries handle it. API timeout → idempotency key ensures safe retry. Already-paid invoice → Stripe 400; caller checks existing ledger row and short-circuits.

**Calls into**: Stripe Node.js SDK. Does NOT call `lib/db` — DB writes happen in the orchestrator. See §5 for fee-collection decision.

### 3c. `ledger-writer.ts` — Billing ledger persistence

**Contract**: `upsertLedgerRow(row: BillingLedgerInsert)` — `INSERT ... ON CONFLICT (stripe_invoice_id) DO UPDATE SET status, stripe_charge_id, paid_at, updated_at`. Single write path shared by the cron and the webhook handler. Postgres unique-violation on `(merchant_id, billing_period_start)` is caught upstream by the orchestrator's existence check; the upsert is a secondary safety net.

**Calls into**: `lib/db/index.ts`.

### 3d. `subscription-state.ts` — Year-2 flip state machine

**Contract**: `getOrCreateState(merchantId)` — returns `pro_subscription_state` row, creating with defaults on first billing month. `recordCapHit(merchantId, billingPeriodStart)` — appends month string to `cap_hit_months`, increments `cap_hit_count`, trims to 12 most recent, persists with `SELECT ... FOR UPDATE` row-level lock to prevent concurrent double-increments. `evaluateFlipCondition(state): boolean` — pure function, no DB call; returns `true` when `cap_hit_count >= Math.ceil(windowLength / 2)` AND ≥12 completed billing months.

**Calls into**: `lib/db/index.ts`.

### 3e. `year2-flip.ts` — Tier transition handler

**Contract**: `executeFlip(merchantId, triggerPeriodStart)` — within a single DB transaction, sets `merchants.pricing_tier = 'v6_pro_flat'` and records `year2_flip_triggered_at` + `pre_flip_tier` in `pro_subscription_state`. Then sends a Resend notification (subject: "Your Push Pro plan is moving to a fixed monthly rate"). Email failure is logged to Sentry but does NOT block the DB flip — the tier change is the source of truth. Returns `{ flipped: boolean }`.

`rollbackFlip(merchantId, reason)` — admin-only; reverses `merchants.pricing_tier` to `pre_flip_tier`, records `flip_reversed_at` and `flip_reversed_reason`.

**Calls into**: `lib/db/index.ts`, Resend client (v5.3 P0-4 infra), `subscription-state.ts`.

### 3f. `orchestrator.ts` — Monthly run coordinator

**Contract**: `runMonthForMerchant(merchantId, billingPeriod)` — coordinates the full sequence for one merchant: (1) check `billing_ledger` for existing `(merchant_id, billing_period_start)` — if `status='paid'`, return early; (2) fetch `stripe_customer_id` from `merchants`; (3) call `aggregator.computeMonthlyFee()`; (4) call `stripe-invoice.createAndPayInvoice()` with idempotency key; (5) call `ledger-writer.upsertLedgerRow()`; (6) if cap hit, call `subscription-state.recordCapHit()` then `evaluateFlipCondition()` — if true, call `year2-flip.executeFlip()`; (7) return `RunResult { merchantId, feeAmountCents, invoiceId, status }`. Any thrown error propagates to the route handler as a 500 with trace_id.

**Calls into**: All other modules in `lib/services/pro-billing/`.

---

## 4. Three API Endpoints

All routes follow the shape in `CLAUDE.md` and use helpers from `lib/api/responses.ts`.

### 4a. `POST /api/stripe/webhook`

Inbound Stripe webhook. Not merchant-session or admin-session gated — it is called by Stripe's servers, not human users. Signature verification replaces session auth.

```
POST /api/stripe/webhook
Content-Type: application/json
Stripe-Signature: t=...,v1=...
```

**Auth**: Stripe signature verified with `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`. `rawBody` must be the raw `Buffer` — do NOT call `req.json()` before verification.

**Deduplication**: Each `event.id` is stored in a `webhook_events` table (see Open Questions — this table is not specced here but is required). On receipt, check `WHERE event_id = event.id`. If found, return `success({ received: true, duplicate: true })` immediately.

**Event routing**:

| `event.type` | Handler |
|---|---|
| `invoice.payment_succeeded` | Update `billing_ledger` row: `status → 'paid'`, `stripe_charge_id`, `paid_at`. |
| `invoice.payment_failed` | Update `billing_ledger` row: `status → 'open'`. Log dunning needed. |
| `invoice.voided` | Update `billing_ledger` row: `status → 'void'`. |
| `charge.dispute.created` | Log dispute `charge_id` + amount. Flag retroactive revenue adjustment (see §7). |
| `customer.subscription.deleted` | Out of scope for Pro billing (Pro uses invoices, not subscriptions). |

**Body schema**: Raw bytes (handled by Next.js route with `export const dynamic = 'force-dynamic'` and no body parsing middleware).

**Response envelope**:
```ts
// Success (already processed)
success({ received: true })
// Duplicate
success({ received: true, duplicate: true })
// Signature failure
badRequest("Invalid Stripe signature")
// Unhandled event type (log and ack — do not 400, or Stripe retries forever)
success({ received: true, handled: false, type: event.type })
// Unexpected error
serverError("stripe-webhook", err)
```

**Implementation note**: The route file must opt out of Next.js body parsing:
```ts
export const runtime = 'nodejs';  // edge runtime lacks rawBody
```

---

### 4b. `GET /api/merchant/billing/preview`

Returns the merchant's current-month attribution totals and projected fee with cap/floor applied. Updated on each request (no caching — reads live from `push_transactions`).

```
GET /api/merchant/billing/preview
Cookie: (Supabase session)
```

**Auth**: `requireMerchantSession()` from `lib/api/merchant-auth.ts`. Uses the returned `merchantId` for all queries.

**Query parameters**: None. The billing period is always the current calendar month in UTC.

**Response envelope (success)**:
```jsonc
{
  "data": {
    "billing_period": {
      "start": "2026-05-01T00:00:00Z",
      "end": "2026-06-01T00:00:00Z"
    },
    "attributed_revenue_cents": 180000,
    "transaction_count": 47,
    "projected_fee_cents": 9000,       // before floor/cap
    "fee_final_cents": 9000,           // after floor/cap
    "floor_cents": 4900,
    "cap_cents": 17900,
    "cap_hit": false,
    "floor_applied": false,
    "days_remaining_in_period": 12,
    "pricing_tier": "v6_pro"
  },
  "timestamp": "2026-05-19T14:22:01Z"
}
```

**Error responses**:
```ts
// Not authenticated
unauthorized()
// Not a merchant account
forbidden("Merchant role required")
// DB error
serverError("billing-preview", err)
```

**Performance note**: The query reads `push_transactions` with the index `idx_merchant_redeem (merchant_id, redeem_timestamp DESC)`. For a merchant with >10,000 monthly transactions, the SUM aggregation should complete in <100ms. If P99 exceeds 200ms, add a materialized view or daily rollup (out of scope for this spec).

---

### 4c. `POST /api/internal/pro-billing/run-month`

Cron-triggered monthly settlement. Gated entirely by `middleware.ts` via `x-internal-api-secret` — do NOT add session auth inside the route.

```
POST /api/internal/pro-billing/run-month
x-internal-api-secret: <INTERNAL_API_SECRET>
Content-Type: application/json
```

**Body schema**:
```ts
{
  merchant_id: string;       // UUID; required
  billing_period_start: string;  // ISO-8601 UTC, e.g. "2026-05-01T00:00:00Z"
  // billing_period_end is derived as first-of-next-month
  dry_run?: boolean;         // if true, compute fee but do NOT hit Stripe or write DB
}
```

**Idempotency**: Before calling orchestrator, check `billing_ledger` for `(merchant_id, billing_period_start)`. If row exists with `status = 'paid'`, return early:
```jsonc
{ "data": { "idempotent": true, "status": "paid", "stripe_invoice_id": "in_xxx" }, "timestamp": "..." }
```

**Response envelope (success, new invoice)**:
```jsonc
{
  "data": {
    "merchant_id": "...",
    "billing_period_start": "2026-05-01T00:00:00Z",
    "attributed_revenue_cents": 180000,
    "fee_final_cents": 9000,
    "stripe_invoice_id": "in_xxx",
    "status": "paid",
    "year2_flip_triggered": false,
    "dry_run": false
  },
  "timestamp": "..."
}
```

**Response on dry run**: Same shape but `dry_run: true` and `stripe_invoice_id: null, status: null`.

**Error responses**:
```ts
// Missing/invalid body fields
badRequest("`merchant_id` and `billing_period_start` are required")
// Merchant not on v6_pro or v6_pro_flat
badRequest("Merchant is not on a Pro pricing tier")
// Stripe or DB error
serverError("pro-billing-run-month", err)
```

**Triggering**: Vercel Cron (`vercel.json`). Recommended schedule: `"5 0 1 * *"` (00:05 UTC on the 1st of each month). The cron should call this endpoint once per `v6_pro` merchant in sequence (or batched via a fan-out job if merchant count exceeds ~200). Fan-out strategy is out of scope for v1.

---

## 5. Stripe Connect Fee Collection Mechanics

**Decision: Platform-side Invoice on a Push Stripe Customer (NOT `application_fee_amount` on Connect transfers).**

- **Cap/floor support**: `application_fee_amount` is per-transfer and fixed — it cannot express the monthly aggregate clamp. Tracking a running cap server-side across N transfers introduces race conditions. A single month-end Invoice lets aggregation complete first, then one clamped charge is issued.
- **Refund behavior**: With `application_fee_amount`, Stripe automatically adjusts the platform fee on refund, creating invisible reconciliation deltas. The Invoice approach keeps Push in full control of whether a retroactive credit is issued (policy: it is not; see §7).
- **Reconciliation simplicity**: Each Invoice maps 1:1 to a `billing_ledger` row via `stripe_invoice_id`, with attribution inputs frozen at creation time. Per-transfer fees require joining the Stripe Payout ledger across N transfers to reconstruct a single month.
- **MSB risk**: A Platform Invoice charges the merchant's saved payment method directly with Push as payee — no funds flow between Connect accounts in the manner that triggers money-services-business review. Interleaving platform revenue with creator disbursements via `application_fee_amount` complicates the MSB boundary.

Each `v6_pro` merchant must have a `stripe_customer_id` in `public.merchants` (Platform Customer, not Connect account; column migration required — see Open Questions).

---

## 6. Monthly Settlement Timeline

All times UTC. `billing_period` = calendar month just ended (e.g., May 1 00:00 → Jun 1 00:00).

```
Day 1, 00:00 UTC  — Billing period closes. No new push_transactions rows with
                    redeem_timestamp < period_end inserted after this point.
                    5-minute buffer prevents race with late-arriving writes.

Day 1, 00:05 UTC  — Vercel Cron fires. For each v6_pro merchant (orchestrator.ts):
                    1. pg_advisory_xact_lock(merchant_id) — prevents concurrent double-run.
                    2. Check billing_ledger for (merchant_id, period_start).
                       If status='paid' → return early (idempotent).
                    3. Aggregate attributed revenue from push_transactions.
                    4. Compute clamped fee (floor $49, cap $179).
                    5. stripe.invoices.create + finalize + pay (idempotency key set).
                    6. ledger-writer.upsertLedgerRow() (status='open' or 'paid').
                    7. subscription-state.recordCapHit() if fee hit cap.
                    8. evaluateFlipCondition() → executeFlip() if Year-2 threshold met.

Day 1, 00:05–00:30 — Stripe webhooks arrive:
                    invoice.payment_succeeded → billing_ledger.status = 'paid', paid_at set.
                    invoice.payment_failed    → status stays 'open'; Smart Retries take over
                                               (days 1, 3, 5, 7 of month).
```

**Failure-recovery (cron retried while previous still finishing)**: The `pg_advisory_xact_lock` is transaction-scoped; a concurrent invocation blocks on step 1 until the first completes, then finds the existing `billing_ledger` row in step 2 and returns early — no double-charge possible. If the first invocation wrote the ledger row (`status='open'`) but never got a Stripe response, the retry calls `stripe.invoices.retrieve(existing_stripe_invoice_id)` and either updates the ledger (if `paid`) or calls `stripe.invoices.pay()` again (idempotent per Stripe's contract).

---

## 7. Failure Handling

**Stuck invoice (>14 days unpaid)**: Stripe Smart Retries fire on days 1, 3, 5, 7. After the 4th failure Stripe marks the invoice `uncollectible`. Webhook `invoice.marked_uncollectible` → `billing_ledger.status = 'uncollectible'` + admin alert via Resend. A separate daily cron (not in this spec) downgrades the merchant to `v6_lite` after 30 days unresolved. No automatic service interruption before day 30.

**Card decline**: Webhook `invoice.payment_failed` → `billing_ledger.status = 'open'`. Decline code logged server-side only (never echoed to merchant). Stripe Smart Retries own the retry schedule; Push does not implement a separate retry loop.

**Partial refund inside billing month**: The refunded `order_total_cents` is NOT subtracted from the already-invoiced attributed revenue. The verified visit occurred; the merchant-customer refund does not invalidate the attribution signal. The `push_transactions` row is immutable on refund.

**Merchant downgrade mid-month**: Downgrade takes effect immediately for new campaigns. At month end, `run-month` checks `merchants.pricing_tier` — if no longer `v6_pro`/`v6_pro_flat`, bills a partial month (transactions from period start through the downgrade timestamp stored in `pro_subscription_state.downgrade_at` — see Open Questions). If the day-1 cron already ran before the downgrade, no credit is issued for the remainder; this must be stated in Pro terms.

**Customer chargeback hitting attributed revenue retroactively**: `charge.dispute.created` → log `charge_id` + amount to a `billing_disputes` table (see Open Questions) + set `billing_ledger.has_open_dispute = true`. Attribution revenue for the disputed row is NOT reversed automatically in v1. If dispute is lost, the Platform Stripe account absorbs the chargeback. No retroactive fee credit to the merchant. Policy must be stated in the Pro merchant agreement.

---

## 8. Year-2 Auto-Flip Mechanism

### Detection

After every successful monthly billing cycle (inside `orchestrator.ts`, step 6–7), `subscription-state.ts` evaluates:

```
cap_hit_months (trimmed to last 12) ≥ 6 cap-hit months
AND
total completed billing months ≥ 12
```

The 50% threshold is computed as `Math.ceil(monthsInWindow / 2)` where `monthsInWindow = Math.min(cap_hit_months.length, 12)`. Using ceiling rather than floor: 6/12 = exactly 50% triggers the flip; 5/12 does not.

The evaluation is a pure function in `subscription-state.ts:evaluateFlipCondition()` — no DB call, fully unit-testable.

### Who flips

`year2-flip.ts:executeFlip()` is called by the orchestrator after a confirmed successful `billing_ledger` write. The flip is a single atomic DB transaction:

```sql
BEGIN;
  UPDATE public.merchants SET pricing_tier = 'v6_pro_flat', updated_at = NOW()
   WHERE id = $merchantId;
  UPDATE public.pro_subscription_state
     SET year2_flip_triggered_at = NOW(), flip_trigger_period_start = $triggerPeriodStart,
         pre_flip_tier = 'v6_pro', updated_at = NOW()
   WHERE merchant_id = $merchantId;
COMMIT;
```

If either UPDATE fails the transaction rolls back; the flip is re-evaluated on the next billing cycle.

### Notification

Sent via Resend immediately after the DB transaction commits. Subject: "Your Push Pro plan is moving to a fixed monthly rate." Body confirms the $199/mo flat rate, effective date, and support contact. No promotional language. Fire-and-forget (failure logged to Sentry, does not block the tier change).

### Rollback path

Admin-only via `year2-flip.ts:rollbackFlip(merchantId, reason)`. Reverts `merchants.pricing_tier` to `pre_flip_tier` and records `flip_reversed_at` + `flip_reversed_reason`. Any months already billed at the `v6_pro_flat` rate require a manual Stripe credit invoice for the delta — NOT automated in v1 (support runbook item). Rollback window: 90 days post-flip; after that the transition is permanent.

---

## 9. Merchant-Visible Surfaces

**During the month** (`GET /api/merchant/billing/preview`): billing tab shows verified visit count, attributed revenue (order totals weighted by attribution decay), estimated fee ("Current estimate — final amount billed on [date]"), days remaining in period, and plan label ("Pro — outcome-based"). Do NOT label attributed revenue as "sales generated" or similar. Creator-level breakdowns belong on the campaign analytics tab, not here.

**At month close** (post `billing_ledger.status = 'paid'`): billing history table gains a new row — billing period, attributed revenue, fee charged, Stripe invoice PDF link. The live estimate tile becomes "Billed — [amount] on [date]". If payment is pending (`status = 'open'`): banner reads "Payment pending — we'll retry automatically. Contact support if this persists." Do not surface decline codes to the merchant.

**Historical billing tab**: columns are Billing period | Attributed revenue | Fee charged | Status | Invoice. Status labels: "Paid", "Processing", "Pending payment" (`open`), "Pending" (`draft`). Suppress `uncollectible` — show "Contact support". Post-flip months on `v6_pro_flat` are labeled "Pro flat rate — $199/mo" in the period column.

---

## 10. Test Strategy

**Unit tests (pure functions, no network):**

- `computeMonthlyFee()`: zero transactions → floor $49; revenue at $980 → floor $49; revenue at $3,580 → cap $179; revenue at $10,000 → cap $179; revenue at $2,000 → $100. Confirm weighted sum uses stored `attribution_weight`, not a re-invocation of `attribution-decay.ts`.
- `clampFee(raw, floor, cap)`: all three branches (below floor, within range, above cap).
- `evaluateFlipCondition()`: 6/12 months → flip; 5/12 → no flip; 6/11 months (< 12 completed) → no flip; 0 months → no flip.
- Orchestrator idempotency: existing `billing_ledger` row with `status='paid'` → return early, zero Stripe calls.

**Integration tests (Stripe CLI — `stripe listen --forward-to localhost:3000/api/stripe/webhook`):**

- Happy path: `run-month` creates invoice, `invoice.payment_succeeded` fires, `billing_ledger` transitions to `paid`.
- Card decline: test card `4000000000000002` → `invoice.payment_failed` → `billing_ledger.status = 'open'`.
- Webhook dedup: same event sent twice → second response `{ duplicate: true }`, no second DB write.
- Tampered `Stripe-Signature` → `badRequest("Invalid Stripe signature")`.
- Idempotent cron re-run: same `(merchant_id, billing_period_start)` called twice → second call skips Stripe.
- Year-2 flip: seed `pro_subscription_state` with 11 cap-hit months, run 12th capped month → `pricing_tier = 'v6_pro_flat'`, Resend test inbox receives notification.

**Monitor in production:**

- Chargeback `charge.dispute.closed` resolution: requires human policy review; no automated assertion possible.
- Smart Retry timing (days 1, 3, 5, 7): Stripe-internal; validate via Dashboard on first real decline.
- Dunning escalation to `uncollectible`: monitor via `SELECT * FROM billing_ledger WHERE status='open' AND invoice_created_at < NOW() - INTERVAL '14 days'`.
- Flip notification deliverability: monitor via Resend delivery logs.

---

## Open Questions

1. **`stripe_customer_id` on `merchants`**: Column missing from current schema; migration required. Determine whether the Platform Stripe Customer is created at Pro signup or lazily on the first invoice (lazy path needs `getOrCreateStripeCustomer()` in `stripe-invoice.ts`).

2. **`webhook_events` dedup table**: Recommend `(event_id TEXT PRIMARY KEY, processed_at TIMESTAMPTZ)` with a 90-day TTL cron. Schema not in this spec.

3. **`billing_disputes` table + `has_open_dispute` on `billing_ledger`**: Both referenced in §7; not specced here. Add to a disputes-v1 spec or the v1 migration if chargeback handling is in initial scope.

4. **`pro_subscription_state.downgrade_at`**: Referenced in §7 for partial-month downgrade billing but omitted from the schema above. Add before migration is finalized if mid-month downgrade billing is in v1 scope.

5. **Fan-out for large merchant counts**: Current design calls `run-month` once per merchant sequentially. At >200 Pro merchants the Vercel function timeout (300s max) may be exceeded. Options: Upstash QStash fan-out (already in v5.3 P0-3 infra), per-merchant Cron entries, or `Promise.allSettled` batch. Decision deferred to implementation.

6. **`v6_pro_flat` billing in `run-month`**: Post-flip months must issue a flat $199 invoice without aggregating `push_transactions`. The orchestrator needs a branch for `pricing_tier = 'v6_pro_flat'`. Straightforward but must ship before the first merchant reaches month 13.

7. **Zero-weight transaction count**: `attribution_weight = 0` rows contribute $0 to revenue. Confirm with product whether they should count toward the `transaction_count` field on the preview endpoint.

8. **Billing period timezone**: Spec uses UTC throughout. NYC billing period closes at 8pm ET (7pm ET summer). Confirm whether calendar-month UTC or Eastern Time is the product intent; TIMESTAMPTZ storage means the change is query-level only.

9. **Legal review**: Chargeback non-reversal policy (§7) and mid-month downgrade proration (§7) must be reflected in the Pro merchant agreement before any live billing runs.
