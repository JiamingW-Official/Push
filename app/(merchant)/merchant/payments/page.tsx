"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MOCK_MERCHANT_PAYMENTS,
  MOCK_MONTHLY_INVOICES,
  type MerchantPayment,
} from "@/lib/payments/mock-transactions";

/* ── Mock hero data ──────────────────────────────────────── */

const THIS_MONTH_SPEND = 12450.0;
const MONTHLY_BUDGET = 18000.0;
const NEXT_PAYOUT_DATE = "2026-05-01";

const CAMPAIGN_SPEND = [
  {
    id: "camp-003",
    campaign: "LA Botanica Aesthetic Shoot",
    used: 86.25,
    budget: 450,
  },
  {
    id: "camp-004",
    campaign: "Brow Transformation Story",
    used: 115,
    budget: 500,
  },
  {
    id: "camp-002",
    campaign: "Best Burger in NYC Feature",
    used: 322,
    budget: 400,
  },
  {
    id: "camp-007",
    campaign: "KITH x Creator Collab Series",
    used: 228.85,
    budget: 700,
  },
];

const TOP_UP_PRESETS = [500, 1000, 2500, 5000];

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

const STATUS_COLORS: Record<MerchantPayment["status"], string> = {
  scheduled: "#669bbc",
  processing: "#c9a96e",
  completed: "#2d7a2d",
};

const STATUS_BG: Record<MerchantPayment["status"], string> = {
  scheduled: "rgba(102,155,188,0.12)",
  processing: "rgba(201,169,110,0.15)",
  completed: "rgba(45,122,45,0.10)",
};

/* ── Top-up Modal ────────────────────────────────────────── */

function TopUpModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const effectiveAmount = custom ? parseFloat(custom) || 0 : amount;

  async function handleSubmit() {
    if (effectiveAmount < 100) return;
    setLoading(true);
    try {
      const res = await fetch("/api/merchant/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <div style={styles.modalTitle}>Funds incoming.</div>
            <p style={styles.modalBody}>
              ${fmt(effectiveAmount)} will be added to your campaign balance
              once payment is confirmed.
            </p>
            <button style={styles.modalPrimary} onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <div style={styles.modalTitle}>Add funds</div>
            <p style={styles.modalLabel}>Select amount</p>
            <div style={styles.presetGrid}>
              {TOP_UP_PRESETS.map((preset) => (
                <button
                  key={preset}
                  style={{
                    ...styles.presetBtn,
                    ...(amount === preset && !custom
                      ? styles.presetBtnActive
                      : {}),
                  }}
                  onClick={() => {
                    setAmount(preset);
                    setCustom("");
                  }}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <p style={styles.modalLabel}>Or enter custom amount</p>
            <input
              type="number"
              placeholder="e.g. 3500"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              style={styles.input}
              min={100}
            />
            {effectiveAmount > 0 && effectiveAmount < 100 && (
              <p style={styles.inputError}>Minimum top-up is $100</p>
            )}
            <div style={{ ...styles.modalActions, marginTop: 24 }}>
              <button
                style={styles.modalSecondary}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.modalPrimary,
                  opacity: loading || effectiveAmount < 100 ? 0.6 : 1,
                }}
                onClick={handleSubmit}
                disabled={loading || effectiveAmount < 100}
              >
                {loading ? "Processing…" : `Add $${fmt(effectiveAmount)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function MerchantPaymentsPage() {
  const [topupOpen, setTopupOpen] = useState(false);

  const budgetPct = Math.min(
    100,
    Math.round((THIS_MONTH_SPEND / MONTHLY_BUDGET) * 100),
  );

  const scheduled = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "scheduled",
  );
  const processing = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "processing",
  );
  const completed = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "completed",
  );

  return (
    <div style={styles.page}>
      {/* ── Top nav ─────────────────────────────────────── */}
      <header style={styles.nav}>
        <Link href="/merchant/dashboard" style={styles.navBack}>
          ← Dashboard
        </Link>
        <span style={styles.navTitle}>Payments</span>
        <button style={styles.addFundsBtn} onClick={() => setTopupOpen(true)}>
          Add funds
        </button>
      </header>

      <main style={styles.main}>
        {/* ── Hero ────────────────────────────────────── */}
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <span style={styles.heroEyebrow}>APRIL 2026</span>
            <div style={styles.heroAmount}>
              Spent ${fmt(THIS_MONTH_SPEND)} this month.
            </div>
            <div style={styles.heroBudgetRow}>
              <span style={styles.heroBudgetLabel}>
                Budget utilization — {budgetPct}%
              </span>
              <span style={styles.heroBudgetTotal}>
                of ${fmt(MONTHLY_BUDGET)}
              </span>
            </div>
            <div style={styles.heroBudgetBar}>
              <div
                style={{
                  ...styles.heroBudgetFill,
                  width: `${budgetPct}%`,
                  background:
                    budgetPct >= 90
                      ? "#c1121f"
                      : budgetPct >= 75
                        ? "#c9a96e"
                        : "#003049",
                }}
              />
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroStatCard}>
              <span style={styles.heroStatLabel}>Next payout batch</span>
              <span style={styles.heroStatValue}>
                {fmtDate(NEXT_PAYOUT_DATE)}
              </span>
            </div>
            <div style={styles.heroStatCard}>
              <span style={styles.heroStatLabel}>Scheduled payouts</span>
              <span style={styles.heroStatValue}>{scheduled.length}</span>
            </div>
          </div>
        </section>

        {/* ── Outgoing payments ───────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Outgoing payments</h2>
          <div style={styles.paymentColumns}>
            {[
              {
                label: "Scheduled",
                items: scheduled,
                status: "scheduled" as const,
              },
              {
                label: "Processing",
                items: processing,
                status: "processing" as const,
              },
              {
                label: "Completed",
                items: completed.slice(0, 4),
                status: "completed" as const,
              },
            ].map((col) => (
              <div key={col.label} style={styles.paymentCol}>
                <div style={styles.paymentColHeader}>
                  <span
                    style={{
                      ...styles.colStatusDot,
                      background: STATUS_COLORS[col.status],
                    }}
                  />
                  <span style={styles.paymentColTitle}>{col.label}</span>
                  <span style={styles.paymentColCount}>{col.items.length}</span>
                </div>
                {col.items.length === 0 ? (
                  <div style={styles.emptyCol}>None</div>
                ) : (
                  col.items.map((p) => (
                    <div key={p.id} style={styles.paymentCard}>
                      <div style={styles.paymentCardTop}>
                        <span style={styles.paymentCreator}>{p.creator}</span>
                        <span style={styles.paymentAmount}>
                          ${fmt(p.amount)}
                        </span>
                      </div>
                      <span style={styles.paymentCampaign}>{p.campaign}</span>
                      <div style={styles.paymentMeta}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: STATUS_COLORS[p.status],
                            background: STATUS_BG[p.status],
                          }}
                        >
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                        <span style={styles.paymentDate}>
                          {fmtDate(p.date)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Per-campaign spend ──────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Campaign spend</h2>
          <div style={styles.campaignList}>
            {CAMPAIGN_SPEND.map((c) => {
              const pct = Math.min(100, Math.round((c.used / c.budget) * 100));
              const overBudget = pct >= 100;
              return (
                <div key={c.id} style={styles.campaignRow}>
                  <div style={styles.campaignRowTop}>
                    <span style={styles.campaignName}>{c.campaign}</span>
                    <span style={styles.campaignFigures}>
                      <span
                        style={{
                          color: overBudget ? "#c1121f" : "#003049",
                          fontWeight: 700,
                        }}
                      >
                        ${fmt(c.used)}
                      </span>
                      <span style={{ color: "rgba(0,48,73,0.40)" }}>
                        {" "}
                        / ${fmt(c.budget)}
                      </span>
                    </span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${pct}%`,
                        background: overBudget
                          ? "#c1121f"
                          : pct >= 80
                            ? "#c9a96e"
                            : "#003049",
                      }}
                    />
                  </div>
                  <span style={styles.progressPct}>{pct}% of budget used</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Invoices ────────────────────────────────── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Invoices</h2>
          <div style={styles.invoiceList}>
            <div style={styles.invoiceHead}>
              <span style={{ ...styles.invoiceCell, flex: 2 }}>Period</span>
              <span style={{ ...styles.invoiceCell, flex: 1.5 }}>Payments</span>
              <span style={{ ...styles.invoiceCell, flex: 2 }}>Total</span>
              <span style={{ ...styles.invoiceCell, flex: 1.5 }}>Status</span>
              <span style={{ ...styles.invoiceCell, flex: 1 }} />
            </div>
            {MOCK_MONTHLY_INVOICES.map((inv) => (
              <div key={inv.id} style={styles.invoiceRow}>
                <span
                  style={{ ...styles.invoiceCell, flex: 2, fontWeight: 600 }}
                >
                  {inv.month} {inv.year}
                </span>
                <span style={{ ...styles.invoiceCell, flex: 1.5 }}>
                  {inv.paymentCount} payouts
                </span>
                <span
                  style={{
                    ...styles.invoiceCell,
                    flex: 2,
                    fontFamily: "Darky, sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#003049",
                  }}
                >
                  ${fmt(inv.totalAmount)}
                </span>
                <span style={{ ...styles.invoiceCell, flex: 1.5 }}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      color: inv.status === "available" ? "#2d7a2d" : "#669bbc",
                      background:
                        inv.status === "available"
                          ? "rgba(45,122,45,0.10)"
                          : "rgba(102,155,188,0.12)",
                    }}
                  >
                    {inv.status === "available" ? "Available" : "Pending"}
                  </span>
                </span>
                <span style={{ ...styles.invoiceCell, flex: 1 }}>
                  {/* TODO: wire to PDF generation API */}
                  <button
                    style={styles.downloadBtn}
                    disabled={inv.status === "pending"}
                    title={
                      inv.status === "pending"
                        ? "Invoice not yet available"
                        : "Download PDF"
                    }
                  >
                    PDF
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top-up CTA banner ───────────────────────── */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaInner}>
            <div>
              <div style={styles.ctaLabel}>Campaign balance</div>
              <div style={styles.ctaAmount}>
                ${fmt(MONTHLY_BUDGET - THIS_MONTH_SPEND)} remaining
              </div>
            </div>
            <button style={styles.ctaBtn} onClick={() => setTopupOpen(true)}>
              Add funds
            </button>
          </div>
          <p style={styles.ctaNote}>
            Funds are held in escrow and released to creators on milestone
            completion.
          </p>
        </section>
      </main>

      {/* ── Top-up Modal ────────────────────────────── */}
      {topupOpen && <TopUpModal onClose={() => setTopupOpen(false)} />}
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
  },
  navTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.02em",
  },
  addFundsBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: "#c1121f",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: 0,
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
    fontSize: "clamp(32px, 5vw, 64px)",
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
    marginBottom: 20,
  },
  heroBudgetRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heroBudgetLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.55)",
  },
  heroBudgetTotal: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.40)",
  },
  heroBudgetBar: {
    height: 6,
    background: "rgba(0,48,73,0.10)",
    borderRadius: 0,
    overflow: "hidden",
    maxWidth: 480,
  },
  heroBudgetFill: {
    height: "100%",
    transition: "width 0.8s ease-out",
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
    minWidth: 160,
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
    fontSize: 22,
    fontWeight: 800,
    color: "#003049",
    letterSpacing: "-0.03em",
  },

  // Section
  section: {
    paddingTop: 48,
  },
  sectionTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.03em",
    marginBottom: 24,
  },

  // Payment columns
  paymentColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 0,
    border: "1px solid rgba(0,48,73,0.12)",
  },
  paymentCol: {
    borderRight: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
  },
  paymentColHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 16px",
    borderBottom: "1px solid rgba(0,48,73,0.08)",
    background: "rgba(0,48,73,0.02)",
  },
  colStatusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  paymentColTitle: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#003049",
    flex: 1,
  },
  paymentColCount: {
    fontFamily: "Darky, sans-serif",
    fontSize: 16,
    fontWeight: 800,
    color: "#003049",
  },
  emptyCol: {
    padding: "24px 16px",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.30)",
  },
  paymentCard: {
    padding: "16px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  paymentCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  paymentCreator: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    color: "#003049",
  },
  paymentAmount: {
    fontFamily: "Darky, sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#003049",
    letterSpacing: "-0.02em",
  },
  paymentCampaign: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.50)",
    lineHeight: 1.4,
  },
  paymentMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  paymentDate: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    color: "rgba(0,48,73,0.40)",
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

  // Campaign spend
  campaignList: {
    border: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
  },
  campaignRow: {
    padding: "20px 24px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
  },
  campaignRowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  campaignName: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    color: "#003049",
  },
  campaignFigures: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
  },
  progressTrack: {
    height: 6,
    background: "rgba(0,48,73,0.08)",
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    transition: "width 0.8s ease-out",
  },
  progressPct: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    color: "rgba(0,48,73,0.40)",
    letterSpacing: "0.02em",
  },

  // Invoices
  invoiceList: {
    border: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
  },
  invoiceHead: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
    background: "rgba(0,48,73,0.03)",
  },
  invoiceRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
  },
  invoiceCell: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "#003049",
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
  },
  downloadBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "transparent",
    color: "#003049",
    border: "1px solid rgba(0,48,73,0.25)",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: 0,
    transition: "background 120ms ease",
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
    fontSize: "clamp(28px, 3.5vw, 44px)",
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
    whiteSpace: "nowrap",
  },
  ctaNote: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(255,255,255,0.40)",
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
    width: 440,
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
  presetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  presetBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    color: "#003049",
    background: "transparent",
    border: "1px solid rgba(0,48,73,0.15)",
    padding: "12px 8px",
    cursor: "pointer",
    borderRadius: 0,
    transition: "border-color 150ms ease, background 150ms ease",
  },
  presetBtnActive: {
    border: "1.5px solid #c1121f",
    background: "rgba(193,18,31,0.04)",
    color: "#c1121f",
  },
  input: {
    width: "100%",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 14,
    color: "#003049",
    background: "#ffffff",
    border: "1px solid rgba(0,48,73,0.20)",
    padding: "12px 14px",
    borderRadius: 0,
    outline: "none",
    boxSizing: "border-box",
  },
  inputError: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "#c1121f",
    marginTop: 6,
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
