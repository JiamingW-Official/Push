# EXEC-P5-1a — Stripe Connect MVP (Payout Phase A)

**Status**: ready to kick off 2026-04-21.
**Owner**: engineering (primary), legal (W-9 / tax review), finance (accounting treatment).
**Blocks**: Creator retention past Pilot W2. First payout batch must clear by 2026-06-01.
**Parent**: `docs/v5.3-optimization-audit-2026-04-21.md` → Phase 5.
**Supersedes**: none. This is the minimum-viable first slice of the full P5-1 payout infrastructure; P5-1b (automated weekly cron) and P5-1c (retainer + RSA tranches) follow.

---

## 1. Goal

Pay one real creator one real dollar through the Push system by **2026-06-01**. That's it. The system after Phase A has exactly one working happy path:

> Merchant-verified redemption → creator's pending balance increments → admin clicks "approve batch" → Stripe Connect transfers USD to the creator's bank account → email receipt lands.

All automation (cron schedule, retainer top-ups, equity tranches, cross-border support, FX, cap-table integration) is Phase B or later and is **not** in this scope.

### Non-goals (explicit)

- No T4-T6 retainer calculation. T4+ creators still earn per-redemption during this phase.
- No equity / RSA math. RSA tracking stays in `docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md` manual process.
- No international creators. US-only, SSN-bearing, Stripe Connect Express.
- No crypto, no ACH push from Push's bank, no PayPal. Stripe Connect only.
- No tax filing automation beyond the W-9 collection Stripe Connect already does on our behalf.

---

## 2. User-visible scope

### 2a. Creator flow (`/creator/settings/payouts`)

Server-rendered page already exists in `app/(creator)/creator/settings/` — extend it, don't replace. Add:

1. **Status card** — shows one of:
   - "Not started" — ask the creator to start onboarding.
   - "In progress" — show Stripe's hosted status link.
   - "Active" — show last-4 of the destination account + "last payout" date.
   - "Restricted" — Stripe flagged the account; route to Stripe's resolution UI.
2. **CTA button** — "Set up payouts" (when not started) / "Review details" (all other states). Clicking POSTs to `/api/creator/payout-onboarding` which returns a one-time Stripe Connect Onboarding URL. The page then `window.location.href = returned_url`.
3. **Earnings ledger preview** (read-only) — table of pending rows from `push_transactions` where the creator is `creator_id`, grouped by merchant + week. No action buttons here; this is read-only context.

### 2b. Admin flow (`/admin/payouts`)

New page. Table of all creators with a `pending_cents > 0` balance. Columns:

| Col | Source |
|---|---|
| Creator handle + tier | `creators` join |
| Pending cents | sum of earnings ledger |
| Stripe account status | `payout_methods.stripe_connect_status` |
| Last paid | `payouts.created_at` max |
| Action | "Add to batch" checkbox |

Footer: "Create payout batch ($X total across N creators)" button. Clicking opens a confirmation modal and POSTs to `/api/admin/payouts/create-batch`. On success, redirect to `/admin/payouts/[batch_id]` showing per-creator Stripe transfer status.

### 2c. Email flow

Hook into the existing `lib/email/client.ts`. Fire `creator_welcome` on first successful onboarding (if a payout-adjacent template is not yet in the set, fall back to generic success). In a separate Phase A task, add a **new template** `payout_received` to `lib/email/templates.ts` that ships with Phase A's first commit.

---

## 3. Data model

### 3a. New migrations

```
supabase/migrations/20260522000000_payout_methods.sql
supabase/migrations/20260522000001_payouts_and_ledger.sql
```

**Why two migrations**: first contains immutable PII-adjacent state (Stripe Connect account ids, W-9 completion flag) which is read/written on every onboarding poll. Second contains accounting state (ledger rows, batches) which scales with transactions. Separating makes rollback surgical.

### 3b. `payout_methods` schema

```sql
CREATE TABLE public.payout_methods (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id                UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  stripe_connect_account_id TEXT UNIQUE NOT NULL,
  stripe_connect_status     TEXT NOT NULL
                            CHECK (stripe_connect_status IN ('pending','active','restricted','disabled')),
  w9_completed_at           TIMESTAMPTZ,
  destination_last4         TEXT,
  destination_bank_name     TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

RLS: creator-self-read only. Writes via service-role.

### 3c. `earnings_ledger` + `payout_batches` + `payout_transfers` schema

```sql
-- One row per attributable push_transactions row, computed nightly.
CREATE TABLE public.earnings_ledger (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id            UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  transaction_id        UUID NOT NULL REFERENCES public.push_transactions(transaction_id),
  earned_cents          INTEGER NOT NULL CHECK (earned_cents >= 0),
  payout_transfer_id    UUID NULL,  -- set when paid
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (transaction_id)
);

-- One row per admin-triggered batch.
CREATE TABLE public.payout_batches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_by   UUID NOT NULL REFERENCES public.users(id),
  total_cents    INTEGER NOT NULL,
  creator_count  INTEGER NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('draft','executing','completed','partial_failure','cancelled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ
);

-- One row per creator in a batch. Stripe Connect transfer metadata lives here.
CREATE TABLE public.payout_transfers (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id                  UUID NOT NULL REFERENCES public.payout_batches(id) ON DELETE CASCADE,
  creator_id                UUID NOT NULL REFERENCES public.creators(id),
  amount_cents              INTEGER NOT NULL,
  stripe_transfer_id        TEXT,
  stripe_transfer_status    TEXT CHECK (stripe_transfer_status IN ('pending','succeeded','failed','returned')),
  failure_code              TEXT,
  failure_message           TEXT,
  attempted_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

RLS: creator-self-read on both `earnings_ledger` and `payout_transfers` (filter by `creator_id`); `payout_batches` admin-only.

### 3d. `push_transactions` column addition (optional, Phase A)

Add `payout_eligibility_ruled_at TIMESTAMPTZ NULL` to mark when a nightly job declared the row payable. If we push this to Phase B the ledger writer simply uses `created_at` instead. Keep as a **nice-to-have** for Phase A.

---

## 4. API surface

| Method + path | Auth | Purpose |
|---|---|---|
| `POST /api/creator/payout-onboarding` | `requireCreatorSession` | Creates (or retrieves) a Stripe Connect Express account; returns onboarding URL. |
| `POST /api/internal/stripe-webhook` | HMAC verification (Stripe signature) | Receives Stripe Connect events; updates `payout_methods` + `payout_transfers`. |
| `GET /api/creator/payouts` | `requireCreatorSession` | Returns this creator's ledger rows + payout history. |
| `POST /api/admin/payouts/create-batch` | `requireAdminSession` | Body: array of creator_ids. Creates `payout_batches` + `payout_transfers`, calls Stripe per-creator. |
| `GET /api/admin/payouts/[batch_id]` | `requireAdminSession` | Returns the batch + all transfer statuses. |

Rate limits (via `lib/observability/rate-limit.ts`):

- `payout-onboarding`: 5 req / 10 min per creator (Stripe charges for Connect API calls).
- `stripe-webhook`: no rate limit, but signature mismatch returns 400 silently (no log leak).
- `admin/create-batch`: 3 req / min (batch creation is expensive + auditable).

---

## 5. Stripe Connect configuration

Dashboard steps (manual, do this first — the code below assumes these are done):

1. **Activate Stripe Connect** in the Push Stripe account. Platform type: **Express**, because we want Stripe to host the dashboard + tax forms.
2. **Enable payouts** for the Express account type.
3. Set **branding**: Push logo (Flag Red BG), support email `payments@pushnyc.co`.
4. Configure **payout schedule default** to "manual" — we don't want auto-payout on transfer.
5. Add **webhook endpoint** `https://push-six-flax.vercel.app/api/internal/stripe-webhook`. Subscribe to: `account.updated`, `transfer.paid`, `transfer.failed`, `transfer.reversed`, `account.external_account.*`.
6. Copy the webhook signing secret to Vercel env as `STRIPE_WEBHOOK_SECRET`.
7. Copy the **restricted API key** (scoped to Connect write, transfers write, customers read) to Vercel env as `STRIPE_SECRET_KEY`. Do NOT use the secret key with full scope.

### Env vars (new)

| Name | Scope | Required in prod |
|---|---|---|
| `STRIPE_SECRET_KEY` | server | ✅ hard-throw if missing + payouts enabled |
| `STRIPE_WEBHOOK_SECRET` | server | ✅ required by `/api/internal/stripe-webhook` (webhook rejects without it) |
| `STRIPE_CONNECT_RETURN_URL` | server | ⚠️ defaults to `${NEXT_PUBLIC_SITE_URL}/creator/settings/payouts?status=complete` |
| `STRIPE_CONNECT_REFRESH_URL` | server | ⚠️ defaults to `${NEXT_PUBLIC_SITE_URL}/creator/settings/payouts?status=refresh` |

---

## 6. Earnings-to-cents logic (Phase A simple rule)

Phase A **does not implement** the v5.1 tier / commission model. The simple rule:

```
earned_cents = merchant_payout_cents_for_this_redemption
             = push_transactions.campaigns.payout × 100
```

The campaign-level `payout` field (already in the `campaigns` table since v5.0) is the source of truth. No split, no platform take, no tier multiplier. These all land in **Phase B**.

This is deliberate — the financial risk of miscalculating a complex split on the first real payout is higher than the business risk of under-crediting Phase A creators (whom we'll true-up in Phase B before T4 retainer starts).

### Edge cases to handle in Phase A

- `payout` is NULL or zero → skip ledger row; log a warning tagged `earnings-ledger-skip`.
- `push_transactions.consent_tier = 1` + merchant disputes the row within the 72h dispute window → the row is excluded from batches until dispute resolves (join on `disputes` table).
- Multiple `campaign_applications` accepted for the same campaign — use the row recorded on the push_transactions `creator_id` column. That's already the authoritative pointer post-P0-BUG-1 fix.

---

## 7. Testing strategy

### 7a. Stripe test mode

Every env var above has a TEST twin. The ENV_TEST_MODE=true flag routes to Stripe's test endpoints and uses `STRIPE_SECRET_KEY_TEST` instead. Preview deployments (Vercel PR previews) always run in test mode.

Test Connect accounts use Stripe's documented test bank numbers; no real money flows until `NODE_ENV === 'production'`.

### 7b. Playwright

Add `e2e/payouts.spec.ts`. Tests, in order:

1. Creator hits `/creator/settings/payouts` and clicks "Set up payouts" → URL redirects to a `connect.stripe.com/setup/*` host (the exact host is a Stripe-owned domain that we trust). Assert the redirect URL starts with `https://connect.stripe.com`.
2. Admin hits `/admin/payouts` → table renders, "Create batch" button is disabled until at least one creator is selected.
3. After selection, batch creation returns 200 with a `batch_id`; the redirect lands on `/admin/payouts/:id` showing transfer rows.
4. Webhook POST to `/api/internal/stripe-webhook` with a mock `transfer.paid` event (pre-signed) flips the transfer row to `succeeded`.

### 7c. Unit tests

- `lib/services/earnings.ts` `computeEarningsForTransaction(txn)` — cover the three Phase A edge cases above.
- `lib/services/stripe-connect.ts` `parseAccountUpdatedEvent(event)` — ensures restricted / disabled / active transitions all map to `payout_methods.stripe_connect_status` correctly.

---

## 8. Compliance checklist (this prompt only ships if every box is ✅)

- [ ] **W-9 collection** is confirmed handled by Stripe Connect Express (Stripe collects and stores; Push never touches SSN).
- [ ] **1099-NEC issuance** path documented — Stripe Connect Express issues on our behalf. Push receives a year-end reporting file via the Stripe dashboard; no in-product generation.
- [ ] **Money-transmitter license exposure** reviewed with counsel — Stripe Connect with Express accounts puts the MT obligation on Stripe, not Push. Confirm in writing before enabling.
- [ ] **KYC storage** — Push stores only the Stripe account id and the destination bank last-4; never the bank number itself. Enforced by the `destination_last4` column constraint (length ≤ 4).
- [ ] **Audit trail** — every admin-initiated batch logs to `agent_runs` with `agent_type = 'payout_batch_create'`, input = creator_ids, output = batch_id + total_cents. Existing v5.0 infrastructure; no new table.
- [ ] **Right to deletion (CCPA)** — `earnings_ledger` rows survive a creator account deletion because they're tax records; the creator row itself is deleted, ledger rows retain `creator_id` as a dangling UUID. Stripe Connect account handled separately (we call `accounts.reject` on deletion).
- [ ] **Sentry scrubbing** — extend `sentry.server.config.ts`'s `beforeSend` to scrub Stripe keys and account ids (`acct_*`, `tr_*`, `in_*`, `pm_*`).

---

## 9. Rollout plan

**T-7** (2026-05-25): Stripe dashboard configuration complete; env vars set in Vercel preview only. Internal team tests the creator onboarding flow end-to-end.

**T-3** (2026-05-29): env vars promoted to production. Real Stripe Connect accounts created by eng-team-only for internal testing. Migration applied to prod Supabase.

**T-1** (2026-05-31): opt-in beta for 3 creators from the Pilot W1 cohort. Their accounts onboard, small batch ($1 each) processed, receipts verified.

**T-0** (2026-06-01): public release. All creators with `pending_cents > 0` see the payouts section.

**W+1** (2026-06-08): first real weekly batch. Admin manually triggers. Retrospective Monday 2026-06-09.

### Freeze triggers

- Stripe Connect account creation fails > 10% during T-1 opt-in → pause rollout, investigate per-creator error codes, do not ship T-0.
- Webhook verification signature mismatch rate > 0.1% in first 48h → disable the production webhook endpoint (Stripe will retry); investigate Vercel edge / body-parsing divergence.
- Any single misrouted transfer (funds to wrong creator) → immediate freeze, legal + finance bridge call.

---

## 10. Out-of-scope for Phase A (tracked for Phase B)

- Automated weekly cron that creates batches on schedule.
- T4-T6 tier retainer calculation + monthly fixed-amount transfers.
- Creator RSA equity-tranche issuance (stays manual via `docs/legal/founders-ip-assignment-CIIAA-TEMPLATE.md` track).
- Cross-border creators (requires Stripe Connect Standard + additional KYC).
- FX display (show USD only in Phase A; convert in Phase B using Stripe's FX).
- Dispute → earnings-ledger reconciliation (Phase A manually adjusts via admin UI).
- Merchant-side statement reconciliation (merchant dashboard already shows redemption totals; pairing with payout totals is Phase B).

---

## 11. Acceptance criteria

- [ ] One real creator in test mode completes onboarding start-to-finish (≤ 10 min).
- [ ] Admin creates a batch of 1 transfer, Stripe Connect confirms `transfer.paid`, webhook updates `payout_transfers.stripe_transfer_status = 'succeeded'`.
- [ ] The creator's `earnings_ledger` row's `payout_transfer_id` is set, so `SELECT sum(earned_cents) WHERE creator_id = X AND payout_transfer_id IS NULL` returns zero.
- [ ] E2E green; Sentry events scrubbed; no PII in logs.
- [ ] CLAUDE.md updated with the new five tables + route paths.
- [ ] CHANGELOG entry under `[v5.3-EXEC-P5-1a]`.

---

## 12. Open questions for engineering decision-makers

1. **Stripe Connect Express vs. Custom** — Express hosts the onboarding UI; Custom hosts everything but requires Push to display all KYC fields. Express is faster to ship and absorbs the MT license risk; Custom is more branded. **Recommendation: Express**, defer Custom to Phase C if ever.
2. **Batch size cap** — upper limit per batch to bound blast radius if logic is wrong. **Recommendation: 50 creators / $5 000 total, whichever is smaller**, overridable by an admin toggle.
3. **Currency** — USD only. If Pilot expands to Canada or UK, add currency column to `payout_transfers`.
4. **Reconciliation window** — for how long after a successful transfer do we accept a `transfer.reversed` webhook? Stripe guarantees 30 days. **Recommendation: 45 days** (Stripe's 30 + a week buffer) before the ledger row is considered final.
5. **Admin impersonation audit** — an admin who impersonates a creator to view their payout settings should leave a trail. Extend `app/api/admin/users/[id]/impersonate/route.ts` to append an `agent_runs` row before rendering the creator-scoped payout page.
