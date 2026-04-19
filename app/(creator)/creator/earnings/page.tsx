"use client";

import { useState } from "react";
import Link from "next/link";
import "./earnings.css";
import {
  MOCK_CREATOR_TRANSACTIONS,
  type TransactionStatus,
} from "@/lib/payments/mock-transactions";
import { aggregateBalances } from "@/lib/payments/calculate";

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

/* ── Mock data ──────────────────────────────────────────── */

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
  });
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pending",
  cleared: "Cleared",
  processing: "Processing",
  paid: "Paid",
};

const STATUS_CLS: Record<TransactionStatus, string> = {
  pending: "earn-txn-status--pending",
  cleared: "earn-txn-status--cleared",
  processing: "earn-txn-status--processing",
  paid: "earn-txn-status--paid",
};

const BALANCE_DOT_COLORS: Record<string, string> = {
  Pending: "#669bbc",
  Cleared: "#669bbc",
  Processing: "#c9a96e",
  "Paid out": "#003049",
};

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
    <div className="earn-modal-overlay" onClick={onClose}>
      <div className="earn-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <div className="earn-modal-title">Cashout initiated.</div>
            <p className="earn-modal-body">
              ${fmt(amount)} is on its way. Estimated arrival:{" "}
              {method === "stripe_connect" ? "1–2 business days" : "Instant"}.
            </p>
            <div className="earn-modal-actions">
              <button
                className="earn-modal-btn earn-modal-btn--primary"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="earn-modal-title">Cash out ${fmt(amount)}</div>
            <p className="earn-modal-label">Select payment method</p>

            <div className="earn-method-list">
              <button
                className={`earn-method-btn${method === "stripe_connect" ? " earn-method-btn--active" : ""}`}
                onClick={() => setMethod("stripe_connect")}
              >
                <span className="earn-method-name">Stripe</span>
                <span className="earn-method-meta">1–2 business days</span>
              </button>
              <button
                className={`earn-method-btn${method === "venmo" ? " earn-method-btn--active" : ""}`}
                onClick={() => setMethod("venmo")}
              >
                <span className="earn-method-name">Venmo</span>
                <span className="earn-method-meta">Instant · placeholder</span>
              </button>
            </div>

            <div className="earn-modal-actions">
              <button
                className="earn-modal-btn earn-modal-btn--secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="earn-modal-btn earn-modal-btn--primary"
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
      color: "#669bbc",
    },
    {
      label: "Cleared",
      sublabel: "Ready to cash out",
      value: balances.cleared,
      color: "#669bbc",
    },
    {
      label: "Processing",
      sublabel: "Transfer in flight",
      value: balances.processing,
      color: "#c9a96e",
    },
    {
      label: "Paid out",
      sublabel: "Total disbursed",
      value: balances.paidOut,
      color: "#003049",
    },
  ];

  const recentTxns = MOCK_CREATOR_TRANSACTIONS.slice(0, 20);

  return (
    <div className="earn-page">
      {/* Nav */}
      <header className="earn-nav">
        <Link href="/creator/dashboard" className="earn-nav-back">
          ← Dashboard
        </Link>
        <span className="earn-nav-title">Earnings</span>
        <div style={{ width: 100 }} />
      </header>

      {/* Hero — THE number */}
      <section className="earn-hero">
        <span className="earn-hero-eyebrow">This month</span>
        <div className="earn-hero-amount">${fmt(THIS_MONTH_EARNED)}</div>
        <div className="earn-hero-label">Total earned</div>
        <div className="earn-hero-substats">
          <span className="earn-hero-substat">
            This month: <strong>${fmt(THIS_MONTH_EARNED)}</strong>
          </span>
          <span className="earn-hero-sep">·</span>
          <span className="earn-hero-substat">
            Pending: <strong>${fmt(PENDING_NEXT)}</strong>
          </span>
          <span className="earn-hero-sep">·</span>
          <span
            className={`earn-hero-delta ${
              deltaPositive ? "earn-hero-delta--pos" : "earn-hero-delta--neg"
            }`}
          >
            {deltaPositive ? "+" : ""}${fmt(Math.abs(delta))} vs last month
          </span>
        </div>
      </section>

      {/* Balance breakdown */}
      <section className="earn-balance-section">
        <div className="earn-section-label">Balance breakdown</div>
        <h2 className="earn-section-title">Balance</h2>
        <div className="earn-balance-grid">
          {BALANCE_CARDS.map((card) => (
            <div key={card.label} className="earn-balance-cell">
              <div
                className="earn-balance-dot"
                style={{ background: card.color }}
              />
              <span className="earn-balance-value">${fmt(card.value)}</span>
              <span className="earn-balance-name">{card.label}</span>
              <span className="earn-balance-sub">{card.sublabel}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Active campaigns */}
      <section className="earn-campaigns-section">
        <div className="earn-section-label">In progress</div>
        <h2 className="earn-section-title">Active campaigns</h2>
        <div className="earn-milestone-list">
          {ACTIVE_CAMPAIGNS.map((camp) => (
            <div key={camp.id} className="earn-milestone-card">
              <div className="earn-milestone-header">
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
              <div className="earn-milestone-steps">
                {camp.milestones.map((step, i) => (
                  <div key={step.key} className="earn-milestone-step">
                    <div className="earn-milestone-step-inner">
                      <div
                        className="earn-milestone-dot"
                        style={{
                          background: step.done
                            ? "#c1121f"
                            : "rgba(0,48,73,0.1)",
                          borderColor: step.done
                            ? "#c1121f"
                            : "rgba(0,48,73,0.2)",
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
                          className="earn-milestone-connector"
                          style={{
                            background: step.done
                              ? "#c1121f"
                              : "rgba(0,48,73,0.12)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="earn-milestone-step-label"
                      style={{
                        color: step.done ? "#003049" : "rgba(0,48,73,0.35)",
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
      </section>

      {/* Transaction list — Stripe-style */}
      <section className="earn-txn-section">
        <div className="earn-section-label">History</div>
        <h2 className="earn-section-title">Transaction history</h2>
        <div className="earn-txn-list">
          {recentTxns.map((tx) => (
            <div key={tx.id} className="earn-txn-row">
              <div className="earn-txn-left">
                <div className="earn-txn-campaign">{tx.campaign}</div>
                <div className="earn-txn-meta">
                  {tx.merchant} · {fmtDate(tx.date)}
                </div>
              </div>
              <div className="earn-txn-right">
                <span className="earn-txn-amount">${fmt(tx.netAmount)}</span>
                <span className={`earn-txn-status ${STATUS_CLS[tx.status]}`}>
                  {STATUS_LABELS[tx.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cashout CTA */}
      <section className="earn-cta-section">
        <div className="earn-cta-inner">
          <div>
            <div className="earn-cta-label">Available to cash out</div>
            <div className="earn-cta-amount">${fmt(balances.cleared)}</div>
          </div>
          <button
            className="earn-cta-btn"
            onClick={() => setCashoutOpen(true)}
            disabled={balances.cleared < 10}
          >
            Cash out ${fmt(balances.cleared)}
          </button>
        </div>
        {balances.cleared < 10 && (
          <p className="earn-cta-note">
            Minimum cashout is $10.00. Complete more campaigns to unlock.
          </p>
        )}
      </section>

      {/* Modal */}
      {cashoutOpen && (
        <CashoutModal
          amount={balances.cleared}
          onClose={() => setCashoutOpen(false)}
        />
      )}
    </div>
  );
}
