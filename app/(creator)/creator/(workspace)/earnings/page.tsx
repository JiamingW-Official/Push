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
      { key: "content_posted", label: "Content Posted", done: false },
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
      { key: "content_posted", label: "Content Posted", done: false },
      { key: "paid", label: "Paid", done: false },
    ],
  },
];

const THIS_MONTH_EARNED = 2847.5;
const LAST_MONTH_EARNED = 2310.0;
const PENDING_NEXT = 245.0;

/* ── Helpers ─────────────────────────────────────────────── */

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

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; background: string; color: string }
> = {
  pending: {
    label: "Pending",
    background: "var(--champagne-tint)",
    color: "var(--champagne-deep)",
  },
  cleared: {
    label: "Cleared",
    background: "rgba(0,133,255,0.10)",
    color: "var(--accent-blue)",
  },
  processing: {
    label: "Processing",
    background: "var(--accent-blue-tint)",
    color: "var(--accent-blue)",
  },
  paid: {
    label: "Paid",
    background: "var(--surface-3)",
    color: "var(--ink-3)",
  },
};

/* ── Status chip ─────────────────────────────────────────── */

function StatusChip({ status }: { status: TransactionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="earn-status-chip"
      style={{ background: cfg.background, color: cfg.color }}
    >
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
    <div className="earn-modal-backdrop" onClick={onClose}>
      <div className="earn-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <h2 className="earn-modal-title">Cashout initiated.</h2>
            <p className="earn-modal-body">
              ${fmt(amount)} is on its way. Estimated arrival:{" "}
              {method === "stripe_connect" ? "1–2 business days" : "Instant"}.
            </p>
            <button className="btn-primary click-shift" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="earn-modal-title">Cash out ${fmt(amount)}</h2>

            <p className="earn-modal-label" style={{ marginTop: 24 }}>
              Select payment method
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {(
                [
                  {
                    id: "stripe_connect" as CashoutMethod,
                    name: "Stripe",
                    meta: "1–2 business days",
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
                  className="earn-method-btn"
                  style={{
                    border:
                      method === m.id
                        ? "1.5px solid var(--brand-red)"
                        : "1px solid var(--hairline)",
                    background:
                      method === m.id ? "var(--brand-red-tint)" : "transparent",
                  }}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="earn-method-name">{m.name}</span>
                  <span className="earn-method-meta">{m.meta}</span>
                </button>
              ))}
            </div>

            <div className="earn-modal-actions">
              <button
                className="btn-ghost click-shift"
                style={{ flex: 1 }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary click-shift"
                style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
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

/* ── Main Page ───────────────────────────────────────────── */

export default function CreatorEarningsPage() {
  const [cashoutOpen, setCashoutOpen] = useState(false);

  const balances = aggregateBalances(MOCK_CREATOR_TRANSACTIONS);
  const delta = THIS_MONTH_EARNED - LAST_MONTH_EARNED;
  const deltaPositive = delta >= 0;

  const BALANCE_CARDS = [
    {
      label: "Pending",
      sublabel: "In campaign",
      value: balances.pending,
      dotColor: "var(--accent-blue)",
      background: "var(--accent-blue-tint)",
    },
    {
      label: "Cleared",
      sublabel: "Ready to cash out",
      value: balances.cleared,
      dotColor: "var(--brand-red)",
      background: "var(--brand-red-tint)",
    },
    {
      label: "Processing",
      sublabel: "Transfer in flight",
      value: balances.processing,
      dotColor: "var(--champagne)",
      background: "var(--champagne-tint)",
    },
    {
      label: "Paid Out",
      sublabel: "Total disbursed",
      value: balances.paidOut,
      dotColor: "var(--ink-3)",
      background: "var(--surface-2)",
    },
  ];

  const recentTxns = MOCK_CREATOR_TRANSACTIONS.slice(0, 20);

  return (
    <div className="cw-page earn-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            EARNINGS · ${fmt(THIS_MONTH_EARNED)} THIS MONTH
          </p>
          <h1 className="cw-title">Earnings</h1>
        </div>
        <div className="cw-header__right">
          <button
            type="button"
            className={
              "cw-pill" + (balances.cleared >= 10 ? " cw-pill--urgent" : "")
            }
            onClick={() => setCashoutOpen(true)}
            disabled={balances.cleared < 10}
            style={balances.cleared < 10 ? { opacity: 0.5 } : undefined}
          >
            Request Payout
          </button>
        </div>
      </header>

      {/* ── Hero KPI Card ─────────────────────────────── */}
      <div className="earn-section">
        <div className="earn-hero-card">
          {/* Big number */}
          <div>
            <p className="earn-hero-eyebrow">TOTAL EARNED TO DATE</p>
            <p className="earn-hero-amount">$14,285</p>
            <span
              className={`earn-hero-delta ${deltaPositive ? "earn-hero-delta--positive" : "earn-hero-delta--negative"}`}
            >
              {deltaPositive ? "+" : ""}${fmt(Math.abs(delta))} vs last month
            </span>
          </div>

          {/* Sub-stats */}
          <div className="earn-hero-substats">
            {[
              { label: "THIS MONTH", value: `$${fmt(THIS_MONTH_EARNED)}` },
              { label: "LAST MONTH", value: `$${fmt(LAST_MONTH_EARNED)}` },
              { label: "AVG PER SCAN", value: "$0.05" },
            ].map((s) => (
              <div key={s.label} className="earn-hero-substat">
                <span className="earn-hero-substat-label">{s.label}</span>
                <p className="earn-hero-substat-value">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Balance Breakdown ────────────────────────── */}
      <div className="earn-section">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--ink-4)",
            margin: "0 0 16px",
          }}
        >
          BALANCE
        </p>
        <div className="earn-balance-grid">
          {BALANCE_CARDS.map((card) => (
            <div
              key={card.label}
              className="earn-balance-card"
              style={{ background: card.background }}
            >
              <span
                className="earn-balance-dot"
                style={{ background: card.dotColor }}
              />
              <p className="earn-balance-amount">${fmt(card.value)}</p>
              <p className="earn-balance-label">{card.label}</p>
              <p className="earn-balance-sublabel">{card.sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Active Campaigns / Milestone Timeline ──── */}
      <div className="earn-section" style={{ paddingTop: 32 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--ink-4)",
            margin: "0 0 16px",
          }}
        >
          ACTIVE CAMPAIGNS
        </p>
        <div className="earn-campaign-list">
          {ACTIVE_CAMPAIGNS.map((camp) => (
            <div key={camp.id} className="earn-campaign-card">
              <div className="earn-campaign-header">
                <div>
                  <span className="earn-campaign-merchant">
                    {camp.merchant}
                  </span>
                  <span className="earn-campaign-name">{camp.campaign}</span>
                </div>
                <span className="earn-campaign-payout">
                  ${fmt(camp.totalPayout)}
                </span>
              </div>

              {/* Milestone steps */}
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {camp.milestones.map((step, i) => (
                  <div
                    key={step.key}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background: step.done
                            ? "var(--brand-red)"
                            : "var(--surface-3)",
                          border: `2px solid ${step.done ? "var(--brand-red)" : "var(--mist)"}`,
                        }}
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
                          style={{
                            flex: 1,
                            height: 2,
                            background: step.done
                              ? "var(--brand-red)"
                              : "var(--mist)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        color: step.done ? "var(--ink)" : "var(--ink-4)",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming Payout ────────────────────────── */}
      <div className="earn-section">
        <div className="earn-upcoming-card">
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "var(--ink-4)",
                margin: "0 0 8px",
              }}
            >
              UPCOMING PAYOUT
            </p>
            <p className="earn-upcoming-amount">${fmt(PENDING_NEXT)}</p>
            <p className="earn-upcoming-meta">
              Est. May 1, 2026 · Stripe Connect
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="earn-stripe-badge">
              <span className="earn-stripe-dot" />
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
      </div>

      {/* ── Transaction History ─────────────────────── */}
      <div className="earn-section" style={{ paddingTop: 32 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--ink-4)",
            margin: "0 0 16px",
          }}
        >
          TRANSACTION HISTORY
        </p>
        <div className="earn-txn-table">
          {/* Table header */}
          <div className="earn-txn-head">
            {["DATE", "CAMPAIGN", "STATUS", "AMOUNT", "REF"].map((h) => (
              <span key={h} className="earn-txn-head-cell">
                {h}
              </span>
            ))}
          </div>
          {/* Rows */}
          {recentTxns.map((tx) => (
            <div key={tx.id} className="earn-txn-row">
              <span className="earn-txn-date">{fmtDate(tx.date)}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="earn-txn-campaign">{tx.campaign}</span>
                <span className="earn-txn-merchant">{tx.merchant}</span>
              </div>
              <span>
                <StatusChip status={tx.status} />
              </span>
              <span
                className={
                  tx.status === "paid"
                    ? "earn-txn-amount-paid"
                    : "earn-txn-amount-pending"
                }
              >
                ${fmt(tx.netAmount)}
              </span>
              <span className="earn-txn-ref">#{tx.id.slice(-6)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cashout CTA bar ───────────────────────── */}
      <div
        className="earn-section"
        style={{ paddingTop: 32, paddingBottom: 0 }}
      >
        <div className="earn-cashout-bar">
          <div>
            <p className="earn-cashout-eyebrow">AVAILABLE TO CASH OUT</p>
            <p className="earn-cashout-amount">${fmt(balances.cleared)}</p>
          </div>
          <button
            className="btn-primary click-shift"
            onClick={() => setCashoutOpen(true)}
            disabled={balances.cleared < 10}
            style={{ whiteSpace: "nowrap" }}
          >
            Cash out ${fmt(balances.cleared)}
          </button>
        </div>
        {balances.cleared < 10 && (
          <p className="earn-cashout-hint">
            Minimum cashout is $10.00. Complete more campaigns to unlock.
          </p>
        )}
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
