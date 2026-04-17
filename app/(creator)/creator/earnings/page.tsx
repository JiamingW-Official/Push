"use client";

import { useState } from "react";
import Link from "next/link";
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

const STATUS_COLORS: Record<TransactionStatus, string> = {
  pending: "#669bbc",
  cleared: "#2d7a2d",
  processing: "#c9a96e",
  paid: "#003049",
};

const STATUS_BG: Record<TransactionStatus, string> = {
  pending: "rgba(102,155,188,0.12)",
  cleared: "rgba(45,122,45,0.10)",
  processing: "rgba(201,169,110,0.15)",
  paid: "rgba(0,48,73,0.08)",
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
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <div style={styles.modalTitle}>Cashout initiated.</div>
            <p style={styles.modalBody}>
              ${fmt(amount)} is on its way. Estimated arrival:{" "}
              {method === "stripe_connect" ? "1–2 business days" : "Instant"}.
            </p>
            <button style={styles.modalPrimary} onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <div style={styles.modalTitle}>Cash out ${fmt(amount)}</div>
            <p style={styles.modalLabel}>Select payment method</p>

            <div style={styles.methodList}>
              <button
                style={{
                  ...styles.methodBtn,
                  ...(method === "stripe_connect"
                    ? styles.methodBtnActive
                    : {}),
                }}
                onClick={() => setMethod("stripe_connect")}
              >
                <span style={styles.methodName}>Stripe</span>
                <span style={styles.methodMeta}>1–2 business days</span>
              </button>
              <button
                style={{
                  ...styles.methodBtn,
                  ...(method === "venmo" ? styles.methodBtnActive : {}),
                }}
                onClick={() => setMethod("venmo")}
              >
                <span style={styles.methodName}>Venmo</span>
                <span style={styles.methodMeta}>Instant · placeholder</span>
              </button>
            </div>

            <div style={styles.modalActions}>
              <button
                style={{ ...styles.modalSecondary }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalPrimary, opacity: loading ? 0.7 : 1 }}
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
      color: "#2d7a2d",
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
    <div style={styles.page}>
      {/* ── Top nav ─────────────────────────────────────── */}
      <header style={styles.nav}>
        <Link href="/creator/dashboard" style={styles.navBack}>
          ← Dashboard
        </Link>
        <span style={styles.navTitle}>Earnings</span>
        <div style={{ width: 80 }} />
      </header>

      <main style={styles.main}>
        {/* ── Hero ────────────────────────────────────── */}
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <span style={styles.heroEyebrow}>THIS MONTH</span>
            <div style={styles.heroAmount}>${fmt(THIS_MONTH_EARNED)}</div>
            <span style={styles.heroSub}>Earned this month</span>
            <div style={styles.heroDelta}>
              <span
                style={{
                  ...styles.heroDeltaBadge,
                  background: deltaPositive
                    ? "rgba(45,122,45,0.10)"
                    : "rgba(193,18,31,0.10)",
                  color: deltaPositive ? "#2d7a2d" : "#c1121f",
                }}
              >
                {deltaPositive ? "+" : ""}${fmt(Math.abs(delta))} vs last month
              </span>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroStatCard}>
              <span style={styles.heroStatLabel}>Last month</span>
              <span style={styles.heroStatValue}>
                ${fmt(LAST_MONTH_EARNED)}
              </span>
            </div>
            <div style={styles.heroStatCard}>
              <span style={styles.heroStatLabel}>Expected next</span>
              <span style={{ ...styles.heroStatValue, color: "#669bbc" }}>
                ${fmt(PENDING_NEXT)}
              </span>
            </div>
          </div>
        </section>

        {/* ── Balance breakdown ───────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Balance</h2>
          <div style={styles.balanceGrid}>
            {BALANCE_CARDS.map((card) => (
              <div key={card.label} style={styles.balanceCard}>
                <span
                  style={{ ...styles.balanceDot, background: card.color }}
                />
                <span style={styles.balanceValue}>${fmt(card.value)}</span>
                <span style={styles.balanceLabel}>{card.label}</span>
                <span style={styles.balanceSub}>{card.sublabel}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Milestone timeline ──────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active campaigns</h2>
          <div style={styles.milestoneList}>
            {ACTIVE_CAMPAIGNS.map((camp) => (
              <div key={camp.id} style={styles.milestoneCard}>
                <div style={styles.milestoneHeader}>
                  <div>
                    <span style={styles.milestoneMerchant}>
                      {camp.merchant}
                    </span>
                    <span style={styles.milestoneCampaign}>
                      {camp.campaign}
                    </span>
                  </div>
                  <span style={styles.milestonePayout}>
                    ${fmt(camp.totalPayout)}
                  </span>
                </div>
                <div style={styles.milestoneTrack}>
                  {camp.milestones.map((step, i) => (
                    <div key={step.key} style={styles.milestoneStep}>
                      <div style={styles.milestoneStepInner}>
                        <div
                          style={{
                            ...styles.milestoneDot,
                            background: step.done
                              ? "#c1121f"
                              : "rgba(0,48,73,0.12)",
                            borderColor: step.done
                              ? "#c1121f"
                              : "rgba(0,48,73,0.20)",
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
                              ...styles.milestoneConnector,
                              background: step.done
                                ? "#c1121f"
                                : "rgba(0,48,73,0.12)",
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          ...styles.milestoneStepLabel,
                          color: step.done ? "#003049" : "rgba(0,48,73,0.40)",
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

        {/* ── Transaction history ─────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Transaction history</h2>
          <div style={styles.tableWrap}>
            <div style={styles.tableHead}>
              <span style={{ ...styles.tableCell, flex: 1.2 }}>Date</span>
              <span style={{ ...styles.tableCell, flex: 3 }}>Campaign</span>
              <span style={{ ...styles.tableCell, flex: 1.5 }}>Status</span>
              <span
                style={{ ...styles.tableCell, flex: 1, textAlign: "right" }}
              >
                Amount
              </span>
            </div>
            {recentTxns.map((tx) => (
              <div key={tx.id} style={styles.tableRow}>
                <span
                  style={{
                    ...styles.tableCell,
                    flex: 1.2,
                    color: "rgba(0,48,73,0.50)",
                  }}
                >
                  {fmtDate(tx.date)}
                </span>
                <div
                  style={{
                    ...styles.tableCell,
                    flex: 3,
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={styles.txCampaign}>{tx.campaign}</span>
                  <span style={styles.txMerchant}>{tx.merchant}</span>
                </div>
                <span style={{ ...styles.tableCell, flex: 1.5 }}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      color: STATUS_COLORS[tx.status],
                      background: STATUS_BG[tx.status],
                    }}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </span>
                <span
                  style={{
                    ...styles.tableCell,
                    flex: 1,
                    textAlign: "right",
                    fontFamily: "var(--font-heading, Darky, sans-serif)",
                    fontWeight: 700,
                    color:
                      tx.status === "paid" ? "#003049" : "rgba(0,48,73,0.55)",
                  }}
                >
                  ${fmt(tx.netAmount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cashout CTA ─────────────────────────────── */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaInner}>
            <div>
              <div style={styles.ctaLabel}>Available to cash out</div>
              <div style={styles.ctaAmount}>${fmt(balances.cleared)}</div>
            </div>
            <button
              style={styles.ctaBtn}
              onClick={() => setCashoutOpen(true)}
              disabled={balances.cleared < 10}
            >
              Cash out ${fmt(balances.cleared)}
            </button>
          </div>
          {balances.cleared < 10 && (
            <p style={styles.ctaNote}>
              Minimum cashout is $10.00. Complete more campaigns to unlock.
            </p>
          )}
        </section>
      </main>

      {/* ── Cashout Modal ───────────────────────────── */}
      {cashoutOpen && (
        <CashoutModal
          amount={balances.cleared}
          onClose={() => setCashoutOpen(false)}
        />
      )}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--surface, #f5f2ec)",
    fontFamily: "'CS Genio Mono', 'SF Mono', monospace",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  navBack: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    color: "#003049",
    textDecoration: "none",
    letterSpacing: "0.01em",
    width: 80,
  },
  navTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.02em",
  },
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "0 24px 80px",
  },

  // Hero
  hero: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 32,
    padding: "56px 0 48px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
  },
  heroLeft: {
    flex: 1,
  },
  heroEyebrow: {
    display: "block",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(0,48,73,0.50)",
    marginBottom: 12,
  },
  heroAmount: {
    fontFamily: "Darky, sans-serif",
    fontSize: "clamp(56px, 8vw, 96px)",
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.05em",
    lineHeight: 1,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    color: "rgba(0,48,73,0.55)",
  },
  heroDelta: {
    marginTop: 16,
  },
  heroDeltaBadge: {
    display: "inline-block",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    letterSpacing: "0.01em",
  },
  heroRight: {
    display: "flex",
    gap: 16,
    flexShrink: 0,
  },
  heroStatCard: {
    padding: "20px 24px",
    background: "#ffffff",
    border: "1px solid rgba(0,48,73,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 140,
  },
  heroStatLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.50)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  heroStatValue: {
    fontFamily: "Darky, sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#003049",
    letterSpacing: "-0.03em",
  },

  // Section
  section: {
    paddingTop: 48,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.03em",
    marginBottom: 24,
  },

  // Balance grid
  balanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 0,
    border: "1px solid rgba(0,48,73,0.12)",
  },
  balanceCard: {
    padding: "24px 20px",
    borderRight: "1px solid rgba(0,48,73,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "#ffffff",
    position: "relative",
  },
  balanceDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  balanceValue: {
    fontFamily: "Darky, sans-serif",
    fontSize: 32,
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.04em",
    lineHeight: 1,
    marginBottom: 4,
  },
  balanceLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    fontWeight: 600,
    color: "#003049",
  },
  balanceSub: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.50)",
    letterSpacing: "0.01em",
  },

  // Milestone
  milestoneList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    border: "1px solid rgba(0,48,73,0.12)",
  },
  milestoneCard: {
    background: "#ffffff",
    padding: "24px 24px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.08)",
  },
  milestoneHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  milestoneMerchant: {
    display: "block",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(0,48,73,0.50)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 4,
  },
  milestoneCampaign: {
    display: "block",
    fontFamily: "Darky, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.02em",
  },
  milestonePayout: {
    fontFamily: "Darky, sans-serif",
    fontSize: 24,
    fontWeight: 900,
    color: "#c1121f",
    letterSpacing: "-0.03em",
  },
  milestoneTrack: {
    display: "flex",
    alignItems: "flex-start",
    gap: 0,
  },
  milestoneStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  milestoneStepInner: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  milestoneDot: {
    width: 20,
    height: 20,
    border: "2px solid",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  milestoneConnector: {
    flex: 1,
    height: 2,
  },
  milestoneStepLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
  },

  // Table
  tableWrap: {
    border: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
  },
  tableHead: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
    background: "rgba(0,48,73,0.03)",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
    transition: "background 120ms ease",
  },
  tableCell: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    color: "#003049",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
  },
  txCampaign: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    color: "#003049",
    textTransform: "none",
    letterSpacing: 0,
  },
  txMerchant: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.50)",
    textTransform: "none",
    letterSpacing: 0,
  },
  statusBadge: {
    display: "inline-block",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "3px 8px",
  },

  // CTA
  ctaSection: {
    marginTop: 48,
    padding: "32px",
    background: "#003049",
  },
  ctaInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  ctaLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    marginBottom: 6,
  },
  ctaAmount: {
    fontFamily: "Darky, sans-serif",
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 900,
    color: "#ffffff",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  ctaBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: "#c1121f",
    color: "#ffffff",
    border: "none",
    padding: "18px 40px",
    cursor: "pointer",
    borderRadius: 0,
    transition: "background 150ms ease",
    whiteSpace: "nowrap",
  },
  ctaNote: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 12,
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,48,73,0.50)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#ffffff",
    padding: "40px",
    width: 420,
    maxWidth: "calc(100vw - 48px)",
    borderRadius: 0,
  },
  modalTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 28,
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.03em",
    marginBottom: 8,
  },
  modalBody: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    color: "#4a5568",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  modalLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.50)",
    marginBottom: 12,
    marginTop: 16,
  },
  methodList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
  },
  methodBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    border: "1px solid rgba(0,48,73,0.15)",
    background: "transparent",
    cursor: "pointer",
    borderRadius: 0,
    transition: "border-color 150ms ease, background 150ms ease",
  },
  methodBtnActive: {
    border: "1.5px solid #c1121f",
    background: "rgba(193,18,31,0.04)",
  },
  methodName: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    fontWeight: 600,
    color: "#003049",
  },
  methodMeta: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.50)",
  },
  modalActions: {
    display: "flex",
    gap: 12,
  },
  modalPrimary: {
    flex: 1,
    background: "#c1121f",
    color: "#ffffff",
    border: "none",
    padding: "16px",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 0,
  },
  modalSecondary: {
    flex: 1,
    background: "transparent",
    color: "#003049",
    border: "1px solid rgba(0,48,73,0.20)",
    padding: "16px",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 0,
  },
};
