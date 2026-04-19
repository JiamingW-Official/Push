"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MOCK_CREATOR_TRANSACTIONS,
  type TransactionStatus,
} from "@/lib/payments/mock-transactions";
import { aggregateBalances } from "@/lib/payments/calculate";
import "./earnings.css";

/* ── Types ───────────────────────────────────────────────────── */
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

/* ── Mock data ───────────────────────────────────────────────── */
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

// 12-month earnings data for CSS bar chart
const MONTHLY_DATA = [
  { month: "May", year: 2025, amount: 1240 },
  { month: "Jun", year: 2025, amount: 1580 },
  { month: "Jul", year: 2025, amount: 980 },
  { month: "Aug", year: 2025, amount: 2100 },
  { month: "Sep", year: 2025, amount: 1720 },
  { month: "Oct", year: 2025, amount: 1875 },
  { month: "Nov", year: 2025, amount: 2310 },
  { month: "Dec", year: 2025, amount: 2640 },
  { month: "Jan", year: 2026, amount: 1520 },
  { month: "Feb", year: 2026, amount: 980 },
  { month: "Mar", year: 2026, amount: 2310 },
  { month: "Apr", year: 2026, amount: 2847.5 },
];

const THIS_MONTH_EARNED = 2847.5;
const LAST_MONTH_EARNED = 2310.0;
const YTD_EARNED = 7657.5;
const PENDING_NEXT = 245.0;
const NEXT_PAYOUT_DATE = "Apr 25, 2026";

// Campaign earnings breakdown (% of this month)
const CAMPAIGN_BREAKDOWN = [
  { name: "Best Burger in NYC", amount: 840, pct: 29.5 },
  { name: "Glossier NYC Store", amount: 720, pct: 25.3 },
  { name: "LA Botanica Shoot", amount: 650, pct: 22.8 },
  { name: "Brow Transformation", amount: 420, pct: 14.8 },
  { name: "Other", amount: 217.5, pct: 7.6 },
];

/* ── Helpers ─────────────────────────────────────────────────── */
function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_META: Record<
  TransactionStatus,
  { label: string; dotClass: string; shimmer?: boolean }
> = {
  pending: { label: "Pending", dotClass: "earn-dot--pending" },
  cleared: { label: "Cleared", dotClass: "earn-dot--cleared" },
  processing: {
    label: "Processing",
    dotClass: "earn-dot--processing",
    shimmer: true,
  },
  paid: { label: "Paid", dotClass: "earn-dot--paid" },
};

/* ── Cashout Modal ───────────────────────────────────────────── */
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
    <div className="earn-modal-overlay" onClick={onClose}>
      <div className="earn-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="earn-modal-success">
            <div className="earn-modal-title">Cashout initiated.</div>
            <p className="earn-modal-body">
              ${fmt(amount)} is on its way. Estimated arrival:{" "}
              {method === "stripe_connect" ? "1–2 business days" : "Instant"}.
            </p>
            <button className="earn-modal-btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="earn-modal-title">Cash out ${fmt(amount)}</div>
            <p className="earn-modal-label">Select payment method</p>
            <div className="earn-method-list">
              {(
                [
                  {
                    key: "stripe_connect" as CashoutMethod,
                    name: "Stripe",
                    meta: "1–2 business days",
                  },
                  {
                    key: "venmo" as CashoutMethod,
                    name: "Venmo",
                    meta: "Instant · placeholder",
                  },
                ] as const
              ).map((m) => (
                <button
                  key={m.key}
                  className={`earn-method-btn ${method === m.key ? "earn-method-btn--active" : ""}`}
                  onClick={() => setMethod(m.key)}
                >
                  <span className="earn-method-name">{m.name}</span>
                  <span className="earn-method-meta">{m.meta}</span>
                </button>
              ))}
            </div>
            <div className="earn-modal-actions">
              <button
                className="earn-modal-btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="earn-modal-btn-primary"
                style={{ opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
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

/* ── Main Page ───────────────────────────────────────────────── */
export default function CreatorEarningsPage() {
  const [cashoutOpen, setCashoutOpen] = useState(false);
  const [tooltipBar, setTooltipBar] = useState<number | null>(null);

  const balances = aggregateBalances(MOCK_CREATOR_TRANSACTIONS);
  const delta = THIS_MONTH_EARNED - LAST_MONTH_EARNED;
  const deltaPositive = delta >= 0;
  const deltaPct = Math.abs((delta / LAST_MONTH_EARNED) * 100).toFixed(1);

  const maxBar = Math.max(...MONTHLY_DATA.map((d) => d.amount));

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".earn-reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            (e.target as HTMLElement).classList.add("earn-reveal--in");
        }),
      { threshold: 0.06 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const recentTxns = MOCK_CREATOR_TRANSACTIONS.slice(0, 20);

  return (
    <div className="earn-page">
      {/* ── KPI strip ───────────────────────────────────────── */}
      <section className="earn-kpi-strip">
        <div className="earn-kpi-strip-inner">
          {/* Primary KPI */}
          <div className="earn-kpi-primary">
            <span className="earn-kpi-eyebrow">THIS MONTH</span>
            <div className="earn-kpi-amount">${fmt(THIS_MONTH_EARNED)}</div>
            <div className="earn-kpi-delta-row">
              <span
                className={`earn-delta-badge ${deltaPositive ? "earn-delta-badge--up" : "earn-delta-badge--down"}`}
              >
                {deltaPositive ? "▲" : "▼"} {deltaPct}% vs last month
              </span>
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="earn-kpi-secondary-group">
            {[
              {
                label: "LAST MONTH",
                val: `$${fmt(LAST_MONTH_EARNED)}`,
                sub: "",
              },
              {
                label: "YTD 2026",
                val: `$${fmt(YTD_EARNED)}`,
                sub: "Jan–Apr",
              },
              {
                label: "PENDING NEXT",
                val: `$${fmt(PENDING_NEXT)}`,
                sub: `Due ${NEXT_PAYOUT_DATE}`,
              },
              {
                label: "AVAILABLE NOW",
                val: `$${fmt(balances.cleared)}`,
                sub: "Ready to cash out",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="earn-kpi-card">
                <span className="earn-kpi-card-label">{kpi.label}</span>
                <span className="earn-kpi-card-val">{kpi.val}</span>
                {kpi.sub && (
                  <span className="earn-kpi-card-sub">{kpi.sub}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="earn-main">
        {/* ── Monthly bar chart ───────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">TREND</div>
            <h2 className="earn-section-title">Monthly Earnings</h2>
          </div>
          <div className="earn-chart-wrap">
            <div className="earn-chart">
              {MONTHLY_DATA.map((d, i) => {
                const isCurrent = i === MONTHLY_DATA.length - 1;
                const heightPct = (d.amount / maxBar) * 100;
                return (
                  <div
                    key={i}
                    className="earn-bar-col"
                    onMouseEnter={() => setTooltipBar(i)}
                    onMouseLeave={() => setTooltipBar(null)}
                  >
                    {tooltipBar === i && (
                      <div className="earn-bar-tooltip">
                        <span className="earn-bar-tooltip-month">
                          {d.month} {d.year}
                        </span>
                        <span className="earn-bar-tooltip-val">
                          ${fmt(d.amount)}
                        </span>
                      </div>
                    )}
                    <div className="earn-bar-track">
                      <div
                        className={`earn-bar-fill ${isCurrent ? "earn-bar-fill--current" : ""}`}
                        style={
                          {
                            "--bar-height": `${heightPct}%`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                    <span
                      className={`earn-bar-label ${isCurrent ? "earn-bar-label--current" : ""}`}
                    >
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Balance breakdown ───────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">BALANCE</div>
            <h2 className="earn-section-title">Balance Breakdown</h2>
          </div>
          <div className="earn-balance-grid">
            {[
              {
                label: "Pending",
                sub: "In campaign",
                val: balances.pending,
                dotClass: "earn-dot--pending",
              },
              {
                label: "Cleared",
                sub: "Ready to cash out",
                val: balances.cleared,
                dotClass: "earn-dot--cleared",
              },
              {
                label: "Processing",
                sub: "Transfer in flight",
                val: balances.processing,
                dotClass: "earn-dot--processing",
              },
              {
                label: "Paid out",
                sub: "Total disbursed",
                val: balances.paidOut,
                dotClass: "earn-dot--paid",
              },
            ].map((card) => (
              <div key={card.label} className="earn-balance-card">
                <span className={`earn-status-dot ${card.dotClass}`} />
                <span className="earn-balance-val">${fmt(card.val)}</span>
                <span className="earn-balance-label">{card.label}</span>
                <span className="earn-balance-sub">{card.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Campaign breakdown ──────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">BREAKDOWN</div>
            <h2 className="earn-section-title">Campaign Earnings</h2>
          </div>
          <div className="earn-breakdown-list">
            {CAMPAIGN_BREAKDOWN.map((c, i) => (
              <div key={i} className="earn-breakdown-row">
                <div className="earn-breakdown-name">{c.name}</div>
                <div className="earn-breakdown-bar-wrap">
                  <div
                    className="earn-breakdown-bar-fill"
                    style={{ "--fill-pct": `${c.pct}%` } as React.CSSProperties}
                  />
                </div>
                <div className="earn-breakdown-pct">{c.pct}%</div>
                <div className="earn-breakdown-amount">${fmt(c.amount)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Active campaigns (milestone track) ──────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">LIVE</div>
            <h2 className="earn-section-title">Active Campaigns</h2>
          </div>
          <div className="earn-milestone-list">
            {ACTIVE_CAMPAIGNS.map((camp) => (
              <div key={camp.id} className="earn-milestone-card">
                <div className="earn-milestone-head">
                  <div>
                    <span className="earn-milestone-merchant">
                      {camp.merchant}
                    </span>
                    <span className="earn-milestone-campaign">
                      {camp.campaign}
                    </span>
                  </div>
                  <span className="earn-milestone-payout">
                    ${fmt(camp.totalPayout)}
                  </span>
                </div>
                <div className="earn-milestone-track">
                  {camp.milestones.map((step, i) => (
                    <div key={step.key} className="earn-milestone-step">
                      <div className="earn-milestone-step-inner">
                        <div
                          className={`earn-milestone-dot ${step.done ? "earn-milestone-dot--done" : ""}`}
                        >
                          {step.done && (
                            <svg
                              width="8"
                              height="6"
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
                        {i < camp.milestones.length - 1 && (
                          <div
                            className={`earn-milestone-connector ${step.done ? "earn-milestone-connector--done" : ""}`}
                          />
                        )}
                      </div>
                      <span
                        className={`earn-milestone-label ${step.done ? "earn-milestone-label--done" : ""}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payout history list ─────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">HISTORY</div>
            <h2 className="earn-section-title">Transaction History</h2>
          </div>
          <div className="earn-table">
            <div className="earn-table-head">
              <span className="earn-col earn-col--date">Date</span>
              <span className="earn-col earn-col--campaign">Campaign</span>
              <span className="earn-col earn-col--status">Status</span>
              <span className="earn-col earn-col--amount">Amount</span>
            </div>
            {recentTxns.map((tx) => {
              const meta = STATUS_META[tx.status];
              return (
                <div
                  key={tx.id}
                  className={`earn-table-row ${meta.shimmer ? "earn-table-row--shimmer" : ""}`}
                >
                  <span className="earn-col earn-col--date earn-col--muted">
                    {fmtDate(tx.date)}
                  </span>
                  <div className="earn-col earn-col--campaign earn-col--stack">
                    <span className="earn-tx-campaign">{tx.campaign}</span>
                    <span className="earn-tx-merchant">{tx.merchant}</span>
                  </div>
                  <span className="earn-col earn-col--status">
                    <span className={`earn-status-dot ${meta.dotClass}`} />
                    <span className="earn-status-label">{meta.label}</span>
                  </span>
                  <span
                    className={`earn-col earn-col--amount ${tx.status === "paid" ? "earn-amount--paid" : ""}`}
                  >
                    ${fmt(tx.netAmount)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Payout settings ─────────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">SETTINGS</div>
            <h2 className="earn-section-title">Payout Method</h2>
          </div>
          <div className="earn-payout-card">
            <div className="earn-payout-card-left">
              <span className="earn-payout-bank-label">Connected account</span>
              <span className="earn-payout-bank-name">
                Stripe Connect · ••••4242
              </span>
              <span className="earn-payout-schedule">
                Next payout: <strong>{NEXT_PAYOUT_DATE}</strong>
              </span>
            </div>
            <button
              type="button"
              className="earn-payout-update-btn"
              onClick={() => {}}
            >
              Update Payout Method →
            </button>
          </div>
        </section>
      </div>

      {/* ── Sticky cashout CTA ──────────────────────────────── */}
      <div className="earn-cashout-bar">
        <div className="earn-cashout-bar-inner">
          <div className="earn-cashout-left">
            <span className="earn-cashout-label">Available to cash out</span>
            <span className="earn-cashout-amount">
              ${fmt(balances.cleared)}
            </span>
          </div>
          <button
            className="earn-cashout-btn"
            onClick={() => setCashoutOpen(true)}
            disabled={balances.cleared < 10}
          >
            Cash Out ${fmt(balances.cleared)}
          </button>
        </div>
        {balances.cleared < 10 && (
          <p className="earn-cashout-note">
            Minimum cashout is $10.00. Complete more campaigns to unlock.
          </p>
        )}
      </div>

      {cashoutOpen && (
        <CashoutModal
          amount={balances.cleared}
          onClose={() => setCashoutOpen(false)}
        />
      )}
    </div>
  );
}
