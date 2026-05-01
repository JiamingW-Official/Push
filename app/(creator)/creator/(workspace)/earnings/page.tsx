"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MOCK_CREATOR_TRANSACTIONS,
  type TransactionStatus,
} from "@/lib/payments/mock-transactions";
import { aggregateBalances } from "@/lib/payments/calculate";
import "./earnings.css";

/* ── Types ───────────────────────────────────────────────── */

type CashoutMethod = "stripe_connect" | "venmo";

type MilestoneStep = {
  key: string;
  label: string;
  done: boolean;
};

type ActiveCampaign = {
  id: string;
  campaign: string;
  merchant: string;
  totalPayout: number;
  milestones: MilestoneStep[];
};

/* ── Mock data for standalone page ──────────────────────── */

const ACTIVE_CAMPAIGNS: ActiveCampaign[] = [
  {
    id: "camp-003",
    campaign: "LA Botanica Aesthetic Shoot",
    merchant: "Flamingo Estate",
    totalPayout: 75,
    milestones: [
      { key: "scan", label: "Scan", done: true },
      { key: "verify", label: "Verify", done: true },
      { key: "content_posted", label: "Posted", done: false },
      { key: "paid", label: "Paid", done: false },
    ],
  },
  {
    id: "camp-004",
    campaign: "Brow Transformation Story",
    merchant: "Brow Theory",
    totalPayout: 50,
    milestones: [
      { key: "scan", label: "Scan", done: true },
      { key: "verify", label: "Verify", done: false },
      { key: "content_posted", label: "Posted", done: false },
      { key: "paid", label: "Paid", done: false },
    ],
  },
];

const LIFETIME_TOTAL = 14285.0;
const THIS_MONTH_EARNED = 2847.5;
const LAST_MONTH_EARNED = 2310.0;
const PENDING_NEXT = 245.0;
const MIN_CASHOUT = 10;

/* ── Helpers ─────────────────────────────────────────────── */

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; chipClass: string }
> = {
  pending: { label: "Pending", chipClass: "earn-status-chip--pending" },
  cleared: { label: "Cleared", chipClass: "earn-status-chip--cleared" },
  processing: {
    label: "Processing",
    chipClass: "earn-status-chip--processing",
  },
  paid: { label: "Paid", chipClass: "earn-status-chip--paid" },
};

/* ── Status chip ─────────────────────────────────────────── */

function StatusChip({ status }: { status: TransactionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`earn-status-chip ${cfg.chipClass}`}>
      <span className="earn-status-chip__dot" aria-hidden />
      {cfg.label}
    </span>
  );
}

/* ── Cashout Modal ───────────────────────────────────────── */

function CashoutModal({
  amount,
  onClose,
}: {
  amount: number;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<CashoutMethod>("stripe_connect");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/creator/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(
          "push_last_cashout",
          JSON.stringify({ amount, method, date: new Date().toISOString() }),
        );
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="earn-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="earn-modal-title"
    >
      <div className="earn-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <p className="earn-modal-eyebrow">CASHOUT INITIATED</p>
            <h2 id="earn-modal-title" className="earn-modal-title">
              ${fmt(amount)} on the way
            </h2>
            <p className="earn-modal-body">
              Estimated arrival:{" "}
              {method === "stripe_connect" ? "1–2 business days" : "Instant"}.
              You will receive an email confirmation when funds settle.
            </p>
            <button className="btn-primary click-shift" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <p className="earn-modal-eyebrow">REQUEST PAYOUT</p>
            <h2 id="earn-modal-title" className="earn-modal-title">
              Cash out ${fmt(amount)}
            </h2>

            <p className="earn-modal-label">Payment method</p>

            <div className="earn-method-list">
              {(
                [
                  {
                    id: "stripe_connect" as CashoutMethod,
                    name: "Stripe Connect",
                    meta: "1–2 business days · USD",
                  },
                  {
                    id: "venmo" as CashoutMethod,
                    name: "Venmo",
                    meta: "Instant · placeholder",
                  },
                ] as { id: CashoutMethod; name: string; meta: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="earn-method-btn"
                  aria-pressed={method === m.id}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="earn-method-name">{m.name}</span>
                  <span className="earn-method-meta">{m.meta}</span>
                </button>
              ))}
            </div>

            <div className="earn-modal-actions">
              <button
                type="button"
                className="btn-ghost click-shift"
                style={{ flex: 1 }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary click-shift"
                style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
                aria-label={`Confirm cashout of $${fmt(amount)}`}
              >
                {loading ? "Processing…" : `Confirm $${fmt(amount)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Currency-formatted big amount ───────────────────────── */

function BigAmount({
  value,
  currency = "$",
  unit,
  className,
  currencyClass,
  unitClass,
}: {
  value: string;
  currency?: string;
  unit?: string;
  className: string;
  currencyClass: string;
  unitClass?: string;
}) {
  return (
    <p className={className}>
      <span className={currencyClass}>{currency}</span>
      {value}
      {unit ? <span className={unitClass}>{unit}</span> : null}
    </p>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function CreatorEarningsPage() {
  const [cashoutOpen, setCashoutOpen] = useState(false);

  const balances = aggregateBalances(MOCK_CREATOR_TRANSACTIONS);
  const delta = THIS_MONTH_EARNED - LAST_MONTH_EARNED;
  const deltaPositive = delta >= 0;
  const canCashout = balances.cleared >= MIN_CASHOUT;

  const BALANCE_CARDS: Array<{
    label: string;
    sublabel: string;
    value: number;
    dotClass: string;
  }> = [
    {
      label: "Pending",
      sublabel: "Campaign in flight",
      value: balances.pending,
      dotClass: "earn-balance-dot--blue",
    },
    {
      label: "Cleared",
      sublabel: "Ready to cash out",
      value: balances.cleared,
      dotClass: "earn-balance-dot--ink",
    },
    {
      label: "Processing",
      sublabel: "Transfer in flight",
      value: balances.processing,
      dotClass: "earn-balance-dot--champagne",
    },
    {
      label: "Paid Out",
      sublabel: "Total disbursed",
      value: balances.paidOut,
      dotClass: "earn-balance-dot--paid",
    },
  ];

  const recentTxns = MOCK_CREATOR_TRANSACTIONS.slice(0, 20);

  return (
    <div className="cw-page earn-page">
      {/* ── Page header ─────────────────────────────── */}
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            EARNINGS · ${fmtInt(THIS_MONTH_EARNED)} THIS MONTH
          </p>
          <h1 className="cw-title">Earnings</h1>
        </div>
        <div className="cw-header__right">
          <button
            type="button"
            className={"cw-pill" + (canCashout ? " cw-pill--urgent" : "")}
            onClick={() => setCashoutOpen(true)}
            disabled={!canCashout}
            aria-label={
              canCashout
                ? `Request payout of $${fmt(balances.cleared)}`
                : `Minimum cashout $${fmt(MIN_CASHOUT)} not yet reached`
            }
            style={!canCashout ? { opacity: 0.5 } : undefined}
          >
            Request Payout
          </button>
        </div>
      </header>

      <div className="earn-stack">
        {/* ── 1. Hero KPI panel — lifetime total ─────── */}
        <section className="earn-hero" aria-label="Lifetime earnings summary">
          <div>
            <p className="earn-hero-eyebrow">LIFETIME EARNED</p>
            <BigAmount
              className="earn-hero-amount"
              currencyClass="earn-hero-amount__currency"
              unitClass="earn-hero-amount__unit"
              value={fmtInt(LIFETIME_TOTAL)}
              unit="USD"
            />
            <span
              className={`earn-hero-delta ${
                deltaPositive
                  ? "earn-hero-delta--positive"
                  : "earn-hero-delta--negative"
              }`}
            >
              <span className="earn-hero-delta-arrow" aria-hidden>
                {deltaPositive ? "▲" : "▼"}
              </span>
              {deltaPositive ? "+" : "−"}${fmt(Math.abs(delta))} vs last month
            </span>
          </div>

          <div className="earn-hero-substats">
            {[
              { label: "THIS MONTH", value: `$${fmt(THIS_MONTH_EARNED)}` },
              { label: "LAST MONTH", value: `$${fmt(LAST_MONTH_EARNED)}` },
              { label: "AVG / SCAN", value: "$0.05" },
            ].map((s) => (
              <div key={s.label} className="earn-hero-substat">
                <span className="earn-hero-substat-label">{s.label}</span>
                <p className="earn-hero-substat-value">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. Cashout focal row — liquid-glass tile ─ */}
        <section
          className="earn-cashout-row"
          aria-label="Available to cash out"
        >
          <div>
            <p className="earn-cashout-eyebrow">
              <span className="earn-cashout-eyebrow-dot" aria-hidden />
              AVAILABLE TO CASH OUT
            </p>
            <BigAmount
              className="earn-cashout-amount"
              currencyClass="earn-cashout-amount__currency"
              unitClass="earn-cashout-amount__unit"
              value={fmt(balances.cleared)}
              unit="USD"
            />
            {canCashout ? (
              <p className="earn-cashout-meta">
                Min ${fmt(MIN_CASHOUT)} · arrives 1–2 business days via Stripe
              </p>
            ) : (
              <p className="earn-cashout-hint">
                Minimum cashout is ${fmt(MIN_CASHOUT)}.00. Complete more
                campaigns to unlock.
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-primary click-shift earn-cashout-cta"
            onClick={() => setCashoutOpen(true)}
            disabled={!canCashout}
            aria-label={`Cash out $${fmt(balances.cleared)} now`}
          >
            Cash Out ${fmt(balances.cleared)}
          </button>
        </section>

        {/* ── 3. Balance breakdown ──────────────────── */}
        <section aria-labelledby="earn-balance-head">
          <header className="cw-section-head">
            <span id="earn-balance-head" className="cw-section-eyebrow">
              BALANCE BREAKDOWN
            </span>
            <span className="earn-section-meta">
              {MOCK_CREATOR_TRANSACTIONS.length} transactions tracked
            </span>
          </header>
          <div className="earn-balance-grid">
            {BALANCE_CARDS.map((card) => (
              <div key={card.label} className="earn-balance-card">
                <div className="earn-balance-meta">
                  <span
                    className={`earn-balance-dot ${card.dotClass}`}
                    aria-hidden
                  />
                  <p className="earn-balance-label">{card.label}</p>
                </div>
                <BigAmount
                  className="earn-balance-amount"
                  currencyClass="earn-balance-amount__currency"
                  value={fmt(card.value)}
                />
                <p className="earn-balance-sublabel">{card.sublabel}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Active campaigns ────────────────────── */}
        <section aria-labelledby="earn-campaigns-head">
          <header className="cw-section-head">
            <span id="earn-campaigns-head" className="cw-section-eyebrow">
              ACTIVE CAMPAIGNS
            </span>
            <span className="earn-section-meta">
              {ACTIVE_CAMPAIGNS.length} in progress
            </span>
          </header>
          <div className="earn-campaign-list">
            {ACTIVE_CAMPAIGNS.map((camp) => (
              <article key={camp.id} className="earn-campaign-card">
                <div className="earn-campaign-header">
                  <div>
                    <span className="earn-campaign-merchant">
                      {camp.merchant}
                    </span>
                    <span className="earn-campaign-name">{camp.campaign}</span>
                  </div>
                  <span
                    className="earn-campaign-payout"
                    aria-label={`Payout $${fmt(camp.totalPayout)} USD`}
                  >
                    ${fmt(camp.totalPayout)}
                  </span>
                </div>

                <div
                  className="earn-milestones"
                  role="list"
                  aria-label="Campaign progress"
                >
                  {camp.milestones.map((step, i) => {
                    const isLast = i === camp.milestones.length - 1;
                    return (
                      <div
                        key={step.key}
                        className="earn-milestone"
                        role="listitem"
                        aria-current={step.done ? undefined : "step"}
                      >
                        <div className="earn-milestone-track">
                          <div
                            className={`earn-milestone-dot${
                              step.done ? " earn-milestone-dot--done" : ""
                            }`}
                            aria-hidden
                          >
                            {step.done && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 8 6"
                                fill="none"
                              >
                                <path
                                  d="M1 3l2 2 4-4"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`earn-milestone-line${
                                step.done ? " earn-milestone-line--done" : ""
                              }`}
                              aria-hidden
                            />
                          )}
                        </div>
                        <span
                          className={`earn-milestone-label${
                            step.done ? " earn-milestone-label--done" : ""
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 5. Upcoming payout ─────────────────────── */}
        <section aria-labelledby="earn-upcoming-head">
          <header className="cw-section-head">
            <span id="earn-upcoming-head" className="cw-section-eyebrow">
              UPCOMING PAYOUT
            </span>
          </header>
          <div className="earn-upcoming-card">
            <div>
              <BigAmount
                className="earn-upcoming-amount"
                currencyClass="earn-upcoming-amount__currency"
                value={fmt(PENDING_NEXT)}
              />
              <p className="earn-upcoming-meta">
                Est. May 1, 2026 · Stripe Connect · USD
              </p>
            </div>
            <div className="earn-upcoming-actions">
              <span className="earn-stripe-badge">
                <span className="earn-stripe-dot" aria-hidden />
                Stripe connected
              </span>
              <Link
                href="#"
                className="btn-ghost click-shift"
                style={{
                  fontSize: 12,
                  padding: "8px 16px",
                  textDecoration: "none",
                }}
              >
                Manage
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. Transaction history ─────────────────── */}
        <section aria-labelledby="earn-txn-head-title">
          <header className="cw-section-head">
            <span id="earn-txn-head-title" className="cw-section-eyebrow">
              TRANSACTION HISTORY
            </span>
            <span className="earn-section-meta">
              Showing {recentTxns.length} of {MOCK_CREATOR_TRANSACTIONS.length}
            </span>
          </header>
          <div className="earn-txn-table">
            <div className="earn-txn-head" role="row">
              <span className="earn-txn-head-cell" role="columnheader">
                DATE
              </span>
              <span className="earn-txn-head-cell" role="columnheader">
                CAMPAIGN
              </span>
              <span className="earn-txn-head-cell" role="columnheader">
                STATUS
              </span>
              <span
                className="earn-txn-head-cell earn-txn-head-cell--right"
                role="columnheader"
              >
                AMOUNT
              </span>
              <span
                className="earn-txn-head-cell earn-txn-head-cell--right"
                role="columnheader"
              >
                REF
              </span>
            </div>

            {recentTxns.length === 0 ? (
              <p className="earn-txn-empty">
                No transactions yet. Your first earnings will land here.
              </p>
            ) : (
              recentTxns.map((tx) => (
                <div key={tx.id} className="earn-txn-row" role="row">
                  <span className="earn-txn-date">{fmtDate(tx.date)}</span>
                  <div className="earn-txn-campaign-cell">
                    <span className="earn-txn-campaign">{tx.campaign}</span>
                    <span className="earn-txn-merchant">{tx.merchant}</span>
                  </div>
                  <span>
                    <StatusChip status={tx.status} />
                  </span>
                  <span
                    className={
                      tx.status === "paid"
                        ? "earn-txn-amount earn-txn-amount--paid"
                        : "earn-txn-amount earn-txn-amount--pending"
                    }
                  >
                    <span className="earn-txn-amount__currency">$</span>
                    {fmt(tx.netAmount)}
                  </span>
                  <span className="earn-txn-ref">
                    #{tx.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── Cashout Modal ─────────────────────────── */}
      {cashoutOpen && (
        <CashoutModal
          amount={balances.cleared}
          onClose={() => setCashoutOpen(false)}
        />
      )}
    </div>
  );
}
