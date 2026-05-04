# Payment Signal v1 — Tier 0 Third-Signal Spec

**Status**: Spec / placeholder. Endpoint NOT implemented.
**Owner**: Jiaming
**Last updated**: 2026-04-24

---

## Why we need a third signal

v6 Tier 0 attribution requires **three independent signals** before a transaction is counted as a verified, fraud-resistant conversion:

1. **QR scan** — creator-specific URL hit at the merchant's POS surface.
2. **Receipt OCR** — Claude Vision parse of the printed/emailed receipt.
3. **Payment-source confirmation** ← *this spec*.

Two signals (QR + receipt) are already live. Two-of-three is enough for Phase 0 / Williamsburg, but FTC enforcement and merchant chargeback defense both want a third independent rail. Payment-source confirmation is the highest-value third signal because it triangulates the *customer*, not the *device*.

## Why Venmo Business (not Stripe Issuing)

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **Venmo Business API** | High NYC consumer adoption (≥60% in our beachhead demo). PayPal-owned, mature OAuth. P2P metadata is rich. | Limited to merchant-facing endpoints; restrictive on data sharing. | **Selected** for Phase 1 |
| **Stripe Issuing** | Tightest integration with our existing Stripe Connect rail. | Forces us to issue cards — not a customer behavior we control. | Rejected (forces us into MSB scope) |
| **Plaid Auth** | Bank-level confirmation; broad coverage. | Requires customer login per merchant, breaks the QR friction model. | Backup option only |
| **Square Cash / Zelle** | Wide coverage. | No public business-grade API for verification. | Out for Phase 1 |

Schema reserves all four sources (`venmo`, `zelle`, `square_cash`, `stripe_terminal`) so we can light them up incrementally without another migration.

## Endpoint draft (NOT implemented)

```
POST /api/attribution/payment-signal
Authorization: x-internal-api-secret: <INTERNAL_API_SECRET>
Body: {
  transaction_id: string,         // existing push_transactions row
  source: "venmo" | "zelle" | "square_cash" | "stripe_terminal",
  provider_ref: string,           // Venmo transaction id (will be hashed)
  amount_cents: number,           // sanity check vs order_total_cents
  occurred_at: string             // ISO timestamp
}

Response: { matched: boolean, transaction_id: string }
```

Behavior:
1. Resolve `transaction_id` → push_transactions row.
2. Reject if `payment_signal_source` is already set (idempotency).
3. Hash `provider_ref` with SHA-256.
4. Verify `amount_cents` is within ±2% of `order_total_cents` (tolerance for tip / tax).
5. Update `payment_signal_source` + `payment_signal_ref_hash`.

## Legal / compliance checklist

Before turning this on:

- [ ] **MSB scope review** — endpoint receives no funds, only references; verify with counsel that this stays out of money-services-business territory.
- [ ] **PII minimization** — store only the SHA-256 hash of the provider reference; never the plaintext, never the customer's display name, never the message memo.
- [ ] **Aggregation rule (k≥50)** — any analytics surface that buckets by `payment_signal_source` must enforce k≥50 cohort size to prevent re-identification.
- [ ] **Consent disclosure** — update the Phase 1 consent string to enumerate `payment_signal_source`.
- [ ] **Vendor DPA** — Venmo Business DPA in place before live data flows.
- [ ] **Retention** — `payment_signal_ref_hash` follows the existing `push_transactions` 24-month retention schedule.

## Out of scope for this spec

- Reconciliation of payment failures (refunds, chargebacks).
- Real-time webhook flow (Venmo Business does not publish one for Tier 0 use cases).
- Per-merchant integration choice — initial rollout is one-source-only (`venmo`).
