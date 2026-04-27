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

function PaymentStatusChip({ status }: { status: MerchantPayment["status"] }) {
  const map = {
    scheduled: { bg: "var(--surface-3,#ece9e0)", color: "var(--ink-4)" },
    processing: { bg: "rgba(191,161,112,0.15)", color: "#8a6e3e" },
    completed: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
  };
  const { bg, color } = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        background: bg,
        color,
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.40)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: 40,
          width: 440,
          maxWidth: "calc(100vw - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              Funds incoming.
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-3)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              ${fmt(effectiveAmount)} will be added to your campaign balance
              once payment is confirmed.
            </p>
            <button
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
              }}
              onClick={onClose}
            >
              Done
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 24,
              }}
            >
              Add funds
            </div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Select amount
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {TOP_UP_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustom("");
                  }}
                  style={{
                    padding: "12px 8px",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderRadius: 8,
                    border:
                      amount === preset && !custom
                        ? "1.5px solid var(--brand-red)"
                        : "1px solid var(--hairline)",
                    background:
                      amount === preset && !custom
                        ? "rgba(193,18,31,0.04)"
                        : "transparent",
                    color:
                      amount === preset && !custom
                        ? "var(--brand-red)"
                        : "var(--ink)",
                    transition: "all 0.15s",
                  }}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Or enter custom amount
            </div>
            <input
              type="number"
              placeholder="e.g. 3500"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink)",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                padding: "12px 14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              min={100}
            />
            {effectiveAmount > 0 && effectiveAmount < 100 && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--brand-red)",
                  marginTop: 6,
                }}
              >
                Minimum top-up is $100
              </p>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                className="btn-ghost"
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  background: "transparent",
                  color: "var(--ink)",
                }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--brand-red)",
                  color: "var(--snow)",
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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/merchant/dashboard"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          ← Dashboard
        </Link>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          Payments
        </span>
        <button
          className="btn-primary click-shift"
          onClick={() => setTopupOpen(true)}
          style={{
            padding: "10px 20px",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 8,
            border: "none",
            background: "var(--brand-red)",
            color: "var(--snow)",
            transition: "transform 180ms",
          }}
        >
          Add funds
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Hero stat row */}
        <section
          style={{
            padding: "48px 0 40px",
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              April 2026
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px,4vw,48px)",
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              Spent ${fmt(THIS_MONTH_SPEND)} this month.
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                }}
              >
                Budget utilization — {budgetPct}%
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                }}
              >
                of ${fmt(MONTHLY_BUDGET)}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--hairline)",
                borderRadius: 3,
                overflow: "hidden",
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  width: `${budgetPct}%`,
                  background:
                    budgetPct >= 90
                      ? "var(--brand-red)"
                      : budgetPct >= 75
                        ? "#bfa170"
                        : "var(--ink)",
                  transition: "width 0.8s ease-out",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
            {[
              { label: "Next payout batch", value: fmtDate(NEXT_PAYOUT_DATE) },
              { label: "Scheduled payouts", value: scheduled.length },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 160,
                }}
              >
                <span className="eyebrow" style={{ fontSize: 10 }}>
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Outgoing payments — 3 columns */}
        <section style={{ paddingTop: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 24,
            }}
          >
            Outgoing payments
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
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
            ].map((col, ci) => (
              <div
                key={col.label}
                style={{
                  borderRight: ci < 2 ? "1px solid var(--hairline)" : "none",
                  background: "var(--surface-2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--hairline)",
                    background: "var(--surface)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        col.status === "completed"
                          ? "var(--accent-blue)"
                          : col.status === "processing"
                            ? "#bfa170"
                            : "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  />
                  <span className="eyebrow" style={{ fontSize: 10, flex: 1 }}>
                    {col.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {col.items.length}
                  </span>
                </div>
                {col.items.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 16px",
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                    }}
                  >
                    None
                  </div>
                ) : (
                  col.items.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid var(--hairline)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {p.creator}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "var(--ink)",
                          }}
                        >
                          ${fmt(p.amount)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                          lineHeight: 1.4,
                        }}
                      >
                        {p.campaign}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        <PaymentStatusChip status={p.status} />
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            color: "var(--ink-4)",
                          }}
                        >
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

        {/* Campaign spend */}
        <section style={{ paddingTop: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 24,
            }}
          >
            Campaign spend
          </h2>
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {CAMPAIGN_SPEND.map((c) => {
              const pct = Math.min(100, Math.round((c.used / c.budget) * 100));
              const overBudget = pct >= 100;
              return (
                <div
                  key={c.id}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      {c.campaign}
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-body)", fontSize: 13 }}
                    >
                      <span
                        style={{
                          color: overBudget ? "var(--brand-red)" : "var(--ink)",
                          fontWeight: 700,
                        }}
                      >
                        ${fmt(c.used)}
                      </span>
                      <span style={{ color: "var(--ink-4)" }}>
                        {" "}
                        / ${fmt(c.budget)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "var(--hairline)",
                      borderRadius: 3,
                      overflow: "hidden",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        width: `${pct}%`,
                        background: overBudget
                          ? "var(--brand-red)"
                          : pct >= 80
                            ? "#bfa170"
                            : "var(--ink)",
                        transition: "width 0.8s ease-out",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      color: "var(--ink-4)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {pct}% of budget used
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Invoices table */}
        <section style={{ paddingTop: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 24,
            }}
          >
            Invoices
          </h2>
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--surface)",
              }}
            >
              {["Period", "Payments", "Total", "Status", ""].map((h, i) => (
                <div
                  key={i}
                  className="eyebrow"
                  style={{
                    fontSize: 10,
                    flex: i === 0 ? 2 : i === 2 ? 2 : i === 4 ? 1 : 1.5,
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {MOCK_MONTHLY_INVOICES.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <span
                  style={{
                    flex: 2,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {inv.month} {inv.year}
                </span>
                <span
                  style={{
                    flex: 1.5,
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                  }}
                >
                  {inv.paymentCount} payouts
                </span>
                <span
                  style={{
                    flex: 2,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  ${fmt(inv.totalAmount)}
                </span>
                <span style={{ flex: 1.5 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      background:
                        inv.status === "available"
                          ? "rgba(0,133,255,0.10)"
                          : "var(--surface-3,#ece9e0)",
                      color:
                        inv.status === "available"
                          ? "var(--accent-blue)"
                          : "var(--ink-4)",
                    }}
                  >
                    {inv.status === "available" ? "AVAILABLE" : "PENDING"}
                  </span>
                </span>
                <span style={{ flex: 1 }}>
                  {/* TODO: wire to PDF generation API */}
                  <button
                    className="btn-ghost click-shift"
                    disabled={inv.status === "pending"}
                    title={
                      inv.status === "pending"
                        ? "Invoice not yet available"
                        : "Download PDF"
                    }
                    style={{
                      padding: "6px 12px",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor:
                        inv.status === "pending" ? "not-allowed" : "pointer",
                      borderRadius: 6,
                      border: "1px solid var(--hairline)",
                      background: "transparent",
                      color: "var(--ink)",
                      opacity: inv.status === "pending" ? 0.4 : 1,
                      transition: "transform 180ms",
                    }}
                  >
                    PDF
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Balance CTA */}
        <section
          style={{
            marginTop: 48,
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Campaign balance
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px,3vw,36px)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1,
                }}
              >
                ${fmt(MONTHLY_BUDGET - THIS_MONTH_SPEND)} remaining
              </div>
            </div>
            <button
              className="btn-primary click-shift"
              onClick={() => setTopupOpen(true)}
              style={{
                padding: "16px 32px",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
                whiteSpace: "nowrap",
                transition: "transform 180ms",
              }}
            >
              Add funds
            </button>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              marginTop: 12,
            }}
          >
            Funds are held in escrow and released to creators on milestone
            completion.
          </p>
        </section>
      </main>

      {topupOpen && <TopUpModal onClose={() => setTopupOpen(false)} />}
    </div>
  );
}
