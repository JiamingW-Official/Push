// Push Platform — Merchant Notifications Mock Data
// 10 demo entries spanning the 6 filter buckets the page exposes:
// ALL / UNREAD / APPLICANTS / REDEMPTIONS / BILLING / SYSTEM.
//
// Page classifies via keyword matches against `kind`/`title`/`body` (see
// `notifKind` in app/(merchant)/merchant/notifications/page.tsx), so we use
// vocabulary that lands each row in exactly one bucket and mix unread/read
// + timestamps across today / yesterday / earlier so the group dividers in
// notifications.css render.

import type { Notification } from "./api-client";

const RECIPIENT = "merchant-demo-001";

// Anchor "now" against a known reference so mock timestamps stay stable
// regardless of when the page is rendered. The page falls back gracefully
// when "now" is in the future (older entries just become "earlier").
const NOW = Date.now();

function iso(offsetMs: number): string {
  return new Date(NOW - offsetMs).toISOString();
}

const MIN = 60_000;
const HR = 60 * MIN;
const DAY = 24 * HR;

export const MOCK_MERCHANT_NOTIFICATIONS: Notification[] = [
  // ── TODAY · APPLICANTS ────────────────────────────────────────
  {
    id: "notif-001",
    recipient_user_id: RECIPIENT,
    kind: "applicant_pending",
    title: "Maya Rodriguez applied to Summer Menu Launch",
    body: "Tier: Operator · Push Score 71 · 4.2k followers. Cover letter attached.",
    link: "/merchant/applicants?campaignId=camp-006",
    read_at: null,
    created_at: iso(15 * MIN),
    updated_at: iso(15 * MIN),
  },
  {
    id: "notif-002",
    recipient_user_id: RECIPIENT,
    kind: "applicant_approved",
    title: "You accepted Derek Walsh's application",
    body: "Closer · 31.5k followers. They'll receive the campaign brief and QR within the hour.",
    link: "/merchant/applicants?campaignId=camp-001",
    read_at: null,
    created_at: iso(2 * HR + 10 * MIN),
    updated_at: iso(2 * HR + 10 * MIN),
  },
  // ── TODAY · REDEMPTIONS ───────────────────────────────────────
  {
    id: "notif-003",
    recipient_user_id: RECIPIENT,
    kind: "redemption_verified",
    title: "QR poster at Bed-Stuy redeemed by customer",
    body: "Sofia M. · $12.00 cashback owed · scan-to-redeem time 6m 14s. Verified by Oracle (high confidence).",
    link: "/merchant/attribution",
    read_at: null,
    created_at: iso(4 * HR),
    updated_at: iso(4 * HR),
  },
  {
    id: "notif-004",
    recipient_user_id: RECIPIENT,
    kind: "redemption_disputed",
    title: "Redemption disputed — manual review required",
    body: "Claim code QX7-441 flagged: receipt timestamp 47 min after scan. Review evidence to resolve.",
    link: "/merchant/attribution",
    read_at: null,
    created_at: iso(7 * HR),
    updated_at: iso(7 * HR),
  },
  // ── TODAY · BILLING ───────────────────────────────────────────
  {
    id: "notif-005",
    recipient_user_id: RECIPIENT,
    kind: "billing_low_balance",
    title: "Wallet balance below $200 — top up to keep campaigns running",
    body: "Current balance: $186.40. Pause threshold hits at $0; auto-top-up is currently OFF.",
    link: "/merchant/payments",
    read_at: null,
    created_at: iso(9 * HR + 30 * MIN),
    updated_at: iso(9 * HR + 30 * MIN),
  },

  // ── YESTERDAY · BILLING (read) ────────────────────────────────
  {
    id: "notif-006",
    recipient_user_id: RECIPIENT,
    kind: "billing_invoice_paid",
    title: "Invoice INV-2026-0411 paid — $1,247.50",
    body: "April creator payouts settled across 14 verified visits. Receipt sent to billing@blankstreet.com.",
    link: "/merchant/payments",
    read_at: iso(20 * HR),
    created_at: iso(1 * DAY + 4 * HR),
    updated_at: iso(20 * HR),
  },
  // ── YESTERDAY · APPLICANTS (read) ─────────────────────────────
  {
    id: "notif-007",
    recipient_user_id: RECIPIENT,
    kind: "applicant_rejected",
    title: "You declined Oliver Grant's application",
    body: "Seed tier · 430 followers. Reason logged: below minimum tier requirement for this campaign.",
    link: "/merchant/applicants?campaignId=camp-003",
    read_at: iso(1 * DAY),
    created_at: iso(1 * DAY + 9 * HR),
    updated_at: iso(1 * DAY),
  },
  // ── YESTERDAY · SYSTEM ────────────────────────────────────────
  {
    id: "notif-008",
    recipient_user_id: RECIPIENT,
    kind: "system_update",
    title: "Push platform updated to v5.4",
    body: "New attribution decay rule (24h half-life) is now active. Existing campaigns auto-migrated; no action required.",
    link: null,
    read_at: null,
    created_at: iso(1 * DAY + 16 * HR),
    updated_at: iso(1 * DAY + 16 * HR),
  },

  // ── EARLIER · REDEMPTIONS (read) ──────────────────────────────
  {
    id: "notif-009",
    recipient_user_id: RECIPIENT,
    kind: "redemption_verified",
    title: "Walk-in scan verified — Holiday Blend Launch",
    body: "Customer claimed 'Free latte' offer at SoHo location. Receipt OCR matched within 1.2% tolerance.",
    link: "/merchant/attribution?campaignId=camp-003",
    read_at: iso(3 * DAY),
    created_at: iso(3 * DAY + 2 * HR),
    updated_at: iso(3 * DAY),
  },
  // ── EARLIER · SYSTEM (read) ───────────────────────────────────
  {
    id: "notif-010",
    recipient_user_id: RECIPIENT,
    kind: "system_maintenance",
    title: "Scheduled maintenance window — Sun May 12, 2-4am ET",
    body: "Attribution dashboard will be read-only for 90 minutes during database failover. Posters keep tracking scans.",
    link: null,
    read_at: iso(4 * DAY),
    created_at: iso(5 * DAY),
    updated_at: iso(4 * DAY),
  },
];
