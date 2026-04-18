"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import "./payments.css";

/* ─────────────────────────────────────────────────────────────────
   Push v5.1 — Merchant Payments (ConversionOracle™ Settlement Ledger)
   Vertical AI for Local Commerce · Customer Acquisition Engine
   Verified-customer payouts with full verdict trace.
   ───────────────────────────────────────────────────────────────── */

type Verdict =
  | "auto_verified"
  | "manual_review"
  | "auto_rejected"
  | "human_approved"
  | "human_rejected";

type SettlementStatus = "verified" | "pending" | "rejected";

type LedgerEntry = {
  id: string;
  date: string; // ISO
  creatorHandle: string;
  campaignId: string;
  campaign: string;
  qrId: string;
  customerId: string;
  amountCents: number;
  verdict: Verdict;
  status: SettlementStatus;
  // trace — ConversionOracle™ three-layer verification
  trace: {
    label: "QR" | "OCR" | "GEO" | "HUMAN";
    result: "pass" | "flag" | "fail";
    detail: string;
    confidence: number;
  }[];
  receipt: {
    merchant: string;
    items: { name: string; amount: number }[];
    total: number;
    stamp: string;
  };
};

/* ── Mock data ───────────────────────────────────────────────────── */
const NEXT_PAYOUT_DATE = "2026-05-01";
const NEXT_PAYOUT_CENTS = 186450;

const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: "pay_042",
    date: "2026-04-16T14:22:00Z",
    creatorHandle: "@mila.park",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-MP-0042",
    customerId: "cust_9a83f2",
    amountCents: 4200,
    verdict: "auto_verified",
    status: "verified",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 9:17 AM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "pass",
        detail: "$6.50 latte · match",
        confidence: 0.94,
      },
      {
        label: "GEO",
        result: "pass",
        detail: "within 40m of store",
        confidence: 0.98,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [
        { name: "Oat Latte 12oz", amount: 6.5 },
        { name: "Almond Croissant", amount: 4.75 },
      ],
      total: 11.25,
      stamp: "2026-04-16 · 09:17",
    },
  },
  {
    id: "pay_041",
    date: "2026-04-16T11:08:00Z",
    creatorHandle: "@joonah.shoots",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-JS-0028",
    customerId: "cust_71e2d0",
    amountCents: 4200,
    verdict: "manual_review",
    status: "pending",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 10:41 AM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "flag",
        detail: "receipt blurred — retry queued",
        confidence: 0.62,
      },
      {
        label: "GEO",
        result: "pass",
        detail: "within 30m of store",
        confidence: 0.99,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [
        { name: "Cappuccino 8oz", amount: 5.25 },
        { name: "Banana Bread", amount: 4.0 },
      ],
      total: 9.25,
      stamp: "2026-04-16 · 10:41",
    },
  },
  {
    id: "pay_040",
    date: "2026-04-16T09:52:00Z",
    creatorHandle: "@sam.travels",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-ST-0019",
    customerId: "cust_442b18",
    amountCents: 0,
    verdict: "auto_rejected",
    status: "rejected",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 2:04 PM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "fail",
        detail: "no receipt uploaded",
        confidence: 0.05,
      },
      {
        label: "GEO",
        result: "fail",
        detail: "8.2 km from store",
        confidence: 0.01,
      },
    ],
    receipt: {
      merchant: "— No valid receipt —",
      items: [],
      total: 0,
      stamp: "2026-04-16 · 14:04",
    },
  },
  {
    id: "pay_039",
    date: "2026-04-15T17:34:00Z",
    creatorHandle: "@mila.park",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-MP-0041",
    customerId: "cust_3fce9a",
    amountCents: 4200,
    verdict: "human_approved",
    status: "verified",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 4:02 PM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "flag",
        detail: "partial receipt",
        confidence: 0.71,
      },
      {
        label: "GEO",
        result: "pass",
        detail: "within 20m of store",
        confidence: 1.0,
      },
      {
        label: "HUMAN",
        result: "pass",
        detail: "approved by ops · Jordan K.",
        confidence: 1.0,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [{ name: "Matcha Latte 12oz", amount: 6.25 }],
      total: 6.25,
      stamp: "2026-04-15 · 16:02",
    },
  },
  {
    id: "pay_038",
    date: "2026-04-15T12:18:00Z",
    creatorHandle: "@ethan.eats",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-EE-0007",
    customerId: "cust_88b1cc",
    amountCents: 0,
    verdict: "human_rejected",
    status: "rejected",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 11:12 AM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "pass",
        detail: "$5.00 espresso",
        confidence: 0.88,
      },
      { label: "GEO", result: "pass", detail: "within store", confidence: 1.0 },
      {
        label: "HUMAN",
        result: "fail",
        detail: "duplicate receipt · pay_036",
        confidence: 1.0,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [{ name: "Espresso Double", amount: 5.0 }],
      total: 5.0,
      stamp: "2026-04-15 · 11:12",
    },
  },
  {
    id: "pay_037",
    date: "2026-04-15T08:45:00Z",
    creatorHandle: "@joonah.shoots",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-JS-0027",
    customerId: "cust_555e21",
    amountCents: 4200,
    verdict: "auto_verified",
    status: "verified",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 8:12 AM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "pass",
        detail: "$8.25 total · match",
        confidence: 0.96,
      },
      {
        label: "GEO",
        result: "pass",
        detail: "within 15m of store",
        confidence: 1.0,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [
        { name: "Flat White 12oz", amount: 5.75 },
        { name: "Butter Croissant", amount: 3.5 },
      ],
      total: 9.25,
      stamp: "2026-04-15 · 08:12",
    },
  },
  {
    id: "pay_036",
    date: "2026-04-14T14:02:00Z",
    creatorHandle: "@mila.park",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-MP-0040",
    customerId: "cust_612ab4",
    amountCents: 4200,
    verdict: "auto_verified",
    status: "verified",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 1:35 PM",
        confidence: 1.0,
      },
      {
        label: "OCR",
        result: "pass",
        detail: "$7.00 iced latte",
        confidence: 0.92,
      },
      {
        label: "GEO",
        result: "pass",
        detail: "within 25m of store",
        confidence: 0.97,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [{ name: "Iced Latte 16oz", amount: 7.0 }],
      total: 7.0,
      stamp: "2026-04-14 · 13:35",
    },
  },
  {
    id: "pay_035",
    date: "2026-04-14T10:28:00Z",
    creatorHandle: "@sam.travels",
    campaignId: "camp-014",
    campaign: "Williamsburg Coffee+ Morning Drip",
    qrId: "QR-WBRG-ST-0018",
    customerId: "cust_9e0fb2",
    amountCents: 4200,
    verdict: "manual_review",
    status: "pending",
    trace: [
      {
        label: "QR",
        result: "pass",
        detail: "scanned 9:48 AM",
        confidence: 1.0,
      },
      { label: "OCR", result: "pass", detail: "$5.25 latte", confidence: 0.88 },
      {
        label: "GEO",
        result: "flag",
        detail: "GPS drift · 120m",
        confidence: 0.55,
      },
    ],
    receipt: {
      merchant: "Blank Street · Bedford Ave",
      items: [{ name: "Latte 8oz", amount: 5.25 }],
      total: 5.25,
      stamp: "2026-04-14 · 09:48",
    },
  },
];

const CAMPAIGNS = [
  { id: "all", name: "All campaigns" },
  { id: "camp-014", name: "Williamsburg Coffee+ Morning Drip" },
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmtCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

const VERDICT_LABEL: Record<Verdict, string> = {
  auto_verified: "Auto verified",
  manual_review: "Manual review",
  auto_rejected: "Auto rejected",
  human_approved: "Human approved",
  human_rejected: "Human rejected",
};

const STATUS_LABEL: Record<SettlementStatus, string> = {
  verified: "Paid",
  pending: "Pending",
  rejected: "Rejected",
};

const STATUS_CSS: Record<SettlementStatus, string> = {
  verified: "paid",
  pending: "pending",
  rejected: "rejected",
};

/* ── CSV export ──────────────────────────────────────────────────── */
function buildCsv(rows: LedgerEntry[]): string {
  const headers = [
    "date",
    "creator_handle",
    "qr_id",
    "customer_id",
    "campaign",
    "amount_usd",
    "verdict",
    "status",
  ];
  const esc = (v: string): string => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };
  const body = rows
    .map((r) =>
      [
        r.date,
        r.creatorHandle,
        r.qrId,
        r.customerId,
        r.campaign,
        (r.amountCents / 100).toFixed(2),
        r.verdict,
        r.status,
      ]
        .map((v) => esc(String(v)))
        .join(","),
    )
    .join("\n");
  return `${headers.join(",")}\n${body}`;
}

function downloadCsv(rows: LedgerEntry[]) {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `push-settlement-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function MerchantPaymentsPage() {
  const [from, setFrom] = useState("2026-04-14");
  const [to, setTo] = useState("2026-04-16");
  const [campaign, setCampaign] = useState("all");
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | "all">(
    "all",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MOCK_LEDGER.filter((row) => {
      if (campaign !== "all" && row.campaignId !== campaign) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      const d = row.date.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [from, to, campaign, statusFilter]);

  // Stat totals
  const owed = filtered
    .filter((r) => r.status === "pending")
    .reduce((acc, r) => acc + r.amountCents, 0);
  const paid = filtered
    .filter((r) => r.status === "verified")
    .reduce((acc, r) => acc + r.amountCents, 0);
  const pendingCount = filtered.filter((r) => r.status === "pending").length;
  const lifetimeCents = 874200; // static demo

  // Top 3 creators in filtered window
  const topCreators = useMemo(() => {
    const byCreator = new Map<string, { amount: number; count: number }>();
    for (const row of filtered) {
      if (row.status !== "verified") continue;
      const existing = byCreator.get(row.creatorHandle) ?? {
        amount: 0,
        count: 0,
      };
      byCreator.set(row.creatorHandle, {
        amount: existing.amount + row.amountCents,
        count: existing.count + 1,
      });
    }
    return Array.from(byCreator.entries())
      .map(([handle, stats]) => ({ handle, ...stats }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [filtered]);

  return (
    <div className="pay-shell">
      {/* Nav */}
      <nav className="pay-nav">
        <Link href="/merchant/dashboard" className="pay-nav__back">
          ← Dashboard
        </Link>
        <span className="pay-nav__crumbs">Finance / Settlement Ledger</span>
      </nav>

      <div className="pay-body">
        {/* Hero */}
        <header className="pay-hero">
          <span className="pay-hero__eyebrow">
            ConversionOracle™ settlement ledger
          </span>
          <h1 className="pay-hero__title">Payments</h1>
          <p className="pay-hero__sub">
            Every line is a{" "}
            <span className="pay-hero__tag">verified walk-in customer</span> —
            produced by our Vertical AI for Local Commerce stack and billed
            under the Customer Acquisition Engine. Three-layer verification (QR
            + OCR + geo-match) gates every payout before it hits a creator.
          </p>
        </header>

        {/* Stat row */}
        <section className="pay-stats" aria-label="Settlement totals">
          <div className="pay-stat pay-stat--accent">
            <span className="pay-stat__label">Owed this cycle</span>
            <span className="pay-stat__value">{fmtCents(owed)}</span>
            <span className="pay-stat__meta">
              {pendingCount} pending verification
            </span>
          </div>
          <div className="pay-stat">
            <span className="pay-stat__label">Paid last cycle</span>
            <span className="pay-stat__value">{fmtCents(paid)}</span>
            <span className="pay-stat__meta">Settled via auto-verify</span>
          </div>
          <div className="pay-stat">
            <span className="pay-stat__label">Pending verification</span>
            <span className="pay-stat__value">{pendingCount}</span>
            <span className="pay-stat__meta">Manual review queue</span>
          </div>
          <div className="pay-stat">
            <span className="pay-stat__label">Total lifetime</span>
            <span className="pay-stat__value">{fmtCents(lifetimeCents)}</span>
            <span className="pay-stat__meta">Since campaign start</span>
          </div>
        </section>

        {/* Grid: ledger + sidebar */}
        <div className="pay-grid">
          <div>
            {/* Filter bar */}
            <div className="pay-filters">
              <div className="pay-filter">
                <label className="pay-filter__label" htmlFor="from">
                  From
                </label>
                <input
                  id="from"
                  className="pay-filter__input"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="pay-filter">
                <label className="pay-filter__label" htmlFor="to">
                  To
                </label>
                <input
                  id="to"
                  className="pay-filter__input"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="pay-filter">
                <label className="pay-filter__label" htmlFor="campaign">
                  Campaign
                </label>
                <select
                  id="campaign"
                  className="pay-filter__select"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                >
                  {CAMPAIGNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pay-filter">
                <label className="pay-filter__label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className="pay-filter__select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as SettlementStatus | "all")
                  }
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="pay-filters__spacer" />
              <button
                className="pay-btn-export"
                onClick={() => downloadCsv(filtered)}
                aria-label="Export ledger as CSV"
              >
                Export CSV ↓
              </button>
            </div>

            {/* Ledger table */}
            <div className="pay-table-wrap">
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Creator</th>
                    <th>QR id</th>
                    <th>Customer</th>
                    <th className="pay-table__num-col">Amount</th>
                    <th>Verdict</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7}>
                        <div className="pay-empty">
                          No settlements match the current filters.
                        </div>
                      </td>
                    </tr>
                  )}
                  {filtered.map((row) => {
                    const isOpen = expandedId === row.id;
                    return (
                      <Fragment key={row.id}>
                        <tr
                          className={isOpen ? "is-expanded" : ""}
                          onClick={() =>
                            setExpandedId((prev) =>
                              prev === row.id ? null : row.id,
                            )
                          }
                          aria-expanded={isOpen}
                        >
                          <td className="pay-table__date">
                            {fmtDateTime(row.date)}
                          </td>
                          <td className="pay-table__handle">
                            {row.creatorHandle}
                          </td>
                          <td className="pay-table__qr">{row.qrId}</td>
                          <td className="pay-table__customer">
                            {row.customerId}
                          </td>
                          <td className="pay-table__amount">
                            {fmtCents(row.amountCents)}
                          </td>
                          <td>
                            <span
                              className={`pay-verdict pay-verdict--${row.verdict}`}
                            >
                              <span className="pay-verdict__dot" />
                              {VERDICT_LABEL[row.verdict]}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`pay-status pay-status--${STATUS_CSS[row.status]}`}
                            >
                              <span className="pay-status__dot" />
                              {STATUS_LABEL[row.status]}
                            </span>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="pay-expanded" aria-hidden={false}>
                            <td colSpan={7}>
                              <div className="pay-expanded__inner">
                                {/* Receipt thumb */}
                                <div className="pay-receipt">
                                  <div className="pay-receipt__brand">
                                    PUSH.
                                  </div>
                                  <div className="pay-receipt__line">
                                    <span>{row.receipt.merchant}</span>
                                  </div>
                                  <div className="pay-receipt__line">
                                    <span>{row.receipt.stamp}</span>
                                  </div>
                                  <div
                                    style={{
                                      borderTop:
                                        "1px dashed rgba(0,48,73,0.18)",
                                      margin: "10px 0",
                                    }}
                                  />
                                  {row.receipt.items.length === 0 ? (
                                    <div className="pay-receipt__line">
                                      <em>No line items</em>
                                    </div>
                                  ) : (
                                    row.receipt.items.map((it, i) => (
                                      <div
                                        key={i}
                                        className="pay-receipt__line"
                                      >
                                        <span>{it.name}</span>
                                        <span>${it.amount.toFixed(2)}</span>
                                      </div>
                                    ))
                                  )}
                                  <div className="pay-receipt__total">
                                    <span>Total</span>
                                    <span>${row.receipt.total.toFixed(2)}</span>
                                  </div>
                                </div>

                                {/* Verdict trace */}
                                <div className="pay-trace">
                                  <span className="pay-trace__title">
                                    ConversionOracle™ verdict trace
                                  </span>
                                  <span className="pay-trace__subtitle">
                                    {VERDICT_LABEL[row.verdict]} — {row.qrId}
                                  </span>
                                  <ul className="pay-trace__steps">
                                    {row.trace.map((s, i) => (
                                      <li key={i} className="pay-trace__step">
                                        <span className="pay-trace__step-label">
                                          {s.label}
                                        </span>
                                        <span
                                          className={`pay-trace__step-icon pay-trace__step-icon--${s.result}`}
                                          aria-label={s.result}
                                        >
                                          {s.result === "pass"
                                            ? "✓"
                                            : s.result === "flag"
                                              ? "!"
                                              : "✕"}
                                        </span>
                                        <span className="pay-trace__step-value">
                                          {s.detail}
                                        </span>
                                        <span className="pay-trace__step-conf">
                                          {(s.confidence * 100).toFixed(0)}%
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Upcoming settlements */}
          <aside className="pay-side">
            <div className="pay-side-card">
              <span className="pay-side-card__label">Upcoming settlement</span>
              <h2 className="pay-side-card__title">Next payout</h2>
              <div className="pay-side-card__big">
                {fmtCents(NEXT_PAYOUT_CENTS)}
              </div>
              <div className="pay-side-card__sub">
                Clears on {fmtDate(NEXT_PAYOUT_DATE)} — rolls up every verified
                customer in the cycle.
              </div>
              <div className="pay-side-card__divider" />
              <div className="pay-side-card__listlabel">
                Top creators — this cycle
              </div>
              {topCreators.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    padding: "12px 0",
                  }}
                >
                  No verified payouts in this window.
                </div>
              ) : (
                <div className="pay-side-creators">
                  {topCreators.map((c) => (
                    <div key={c.handle} className="pay-side-creator">
                      <div>
                        <div className="pay-side-creator__handle">
                          {c.handle}
                        </div>
                        <div className="pay-side-creator__count">
                          {c.count} verified customer{c.count === 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="pay-side-creator__amount">
                        {fmtCents(c.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pay-side-card">
              <span className="pay-side-card__label">
                Software Leverage Ratio
              </span>
              <h2 className="pay-side-card__title">Neighborhood Playbook</h2>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--graphite)",
                  lineHeight: 1.6,
                }}
              >
                Williamsburg Coffee+ cycle — SLR tracks how many campaigns our
                Vertical AI runs per ops FTE. Every ConversionOracle auto-verify
                lifts the ratio; every manual review drags it.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
