"use client";

import { useState, useEffect, useCallback } from "react";
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

type SortKey = "campaign" | "walkIns" | "rate" | "total" | "status";
type SortDir = "asc" | "desc";

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
const ANNUAL_GOAL = 6000;
const ANNUAL_PROJECTED = 4800;
const CASHOUT_READY = 284.5;

// KPI trend data: [value, trend arrow direction, pct-change vs last month]
const KPI_TRENDS: Record<string, { dir: "up" | "down"; pct: number }> = {
  LAST_MONTH: { dir: "up", pct: 23.3 },
  YTD_2026: { dir: "up", pct: 18.7 },
  PENDING_NEXT: { dir: "down", pct: 5.2 },
  AVAILABLE_NOW: { dir: "up", pct: 12.0 },
};

// Campaign breakdown (% of this month)
const CAMPAIGN_BREAKDOWN = [
  { name: "Best Burger in NYC", amount: 840, pct: 29.5 },
  { name: "Glossier NYC Store", amount: 720, pct: 25.3 },
  { name: "LA Botanica Shoot", amount: 650, pct: 22.8 },
  { name: "Brow Transformation", amount: 420, pct: 14.8 },
  { name: "Other", amount: 217.5, pct: 7.6 },
];

// Per-campaign breakdown table data
type CampaignRow = {
  campaign: string;
  walkIns: number;
  rate: number;
  total: number;
  status: "Paid" | "Pending";
};
const CAMPAIGN_TABLE: CampaignRow[] = [
  {
    campaign: "Best Burger in NYC",
    walkIns: 42,
    rate: 20,
    total: 840,
    status: "Paid",
  },
  {
    campaign: "Glossier NYC Store",
    walkIns: 36,
    rate: 20,
    total: 720,
    status: "Paid",
  },
  {
    campaign: "LA Botanica Shoot",
    walkIns: 26,
    rate: 25,
    total: 650,
    status: "Pending",
  },
  {
    campaign: "Brow Transformation",
    walkIns: 21,
    rate: 20,
    total: 420,
    status: "Pending",
  },
  {
    campaign: "Other Campaigns",
    walkIns: 14,
    rate: 15.5,
    total: 217.5,
    status: "Paid",
  },
];

// Payout timeline steps
const PAYOUT_TIMELINE = [
  { key: "earned", label: "Earned", desc: "Walk-ins verified" },
  { key: "processing", label: "Processing", desc: "Platform review" },
  { key: "available", label: "Available", desc: "Ready to request" },
  { key: "paid", label: "Paid", desc: "In your account" },
];
// Current state is "available"
const PAYOUT_CURRENT = "available";

/* ── SVG Donut chart values ──────────────────────────────────── */
// Walk-in base (60%), Performance bonus (25%), First-visit bonus (15%)
const DONUT_SEGMENTS = [
  { label: "Walk-in Base", pct: 60, color: "var(--champagne)" },
  { label: "Performance Bonus", pct: 25, color: "var(--primary)" },
  { label: "First-visit Bonus", pct: 15, color: "var(--tertiary)" },
];

function buildDonutPath(segments: typeof DONUT_SEGMENTS) {
  const cx = 60;
  const cy = 60;
  const r = 48;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return segments.map((seg) => {
    const dash = (seg.pct / 100) * circ;
    const gap = circ - dash;
    const strokeDashoffset = -offset * circ;
    offset += seg.pct / 100;
    return { ...seg, dash, gap, strokeDashoffset };
  });
}

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
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const balances = aggregateBalances(MOCK_CREATOR_TRANSACTIONS);
  const delta = THIS_MONTH_EARNED - LAST_MONTH_EARNED;
  const deltaPositive = delta >= 0;
  const deltaPct = Math.abs((delta / LAST_MONTH_EARNED) * 100).toFixed(1);

  const maxBar = Math.max(...MONTHLY_DATA.map((d) => d.amount));
  // Monthly goal target line height (relative to maxBar)
  const goalLineY = 100 - (500 / maxBar) * 100;

  const donutData = buildDonutPath(DONUT_SEGMENTS);
  const annualPct = Math.min(100, (YTD_EARNED / ANNUAL_GOAL) * 100);

  // Sort campaign table
  const sortedTable = [...CAMPAIGN_TABLE].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "campaign")
      return mul * a.campaign.localeCompare(b.campaign);
    if (sortKey === "status") return mul * a.status.localeCompare(b.status);
    return mul * ((a[sortKey] as number) - (b[sortKey] as number));
  });

  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
    },
    [sortKey],
  );

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
                trendKey: "LAST_MONTH",
              },
              {
                label: "YTD 2026",
                val: `$${fmt(YTD_EARNED)}`,
                sub: "Jan–Apr",
                trendKey: "YTD_2026",
              },
              {
                label: "PENDING NEXT",
                val: `$${fmt(PENDING_NEXT)}`,
                sub: `Due ${NEXT_PAYOUT_DATE}`,
                trendKey: "PENDING_NEXT",
              },
              {
                label: "AVAILABLE NOW",
                val: `$${fmt(balances.cleared)}`,
                sub: "Ready to cash out",
                trendKey: "AVAILABLE_NOW",
              },
            ].map((kpi) => {
              const trend = KPI_TRENDS[kpi.trendKey];
              return (
                <div key={kpi.label} className="earn-kpi-card">
                  <span className="earn-kpi-card-label">{kpi.label}</span>
                  <span className="earn-kpi-card-val">{kpi.val}</span>
                  <div className="earn-kpi-card-bottom">
                    {kpi.sub && (
                      <span className="earn-kpi-card-sub">{kpi.sub}</span>
                    )}
                    {trend && (
                      <span
                        className={`earn-trend-arrow ${trend.dir === "up" ? "earn-trend-arrow--up" : "earn-trend-arrow--down"}`}
                      >
                        {trend.dir === "up" ? "↑" : "↓"} {trend.pct}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Quick nav tabs ──────────────────────────────────── */}
      <nav className="earn-quick-nav" aria-label="Portfolio sections">
        <div className="earn-quick-nav-inner">
          <Link href="/creator/portfolio" className="earn-nav-tab">
            Identity
          </Link>
          <span className="earn-nav-tab earn-nav-tab--active">
            <span className="earn-nav-tab-dot" />
            Earnings
          </span>
          <Link href="/creator/portfolio/archive" className="earn-nav-tab">
            Archive
          </Link>
        </div>
      </nav>

      <div className="earn-main">
        {/* ── Annual goal progress ─────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">ANNUAL GOAL</div>
            <h2 className="earn-section-title">Yearly Progress</h2>
          </div>
          <div className="earn-goal-card">
            <div className="earn-goal-top">
              <div className="earn-goal-label-group">
                <span className="earn-goal-eyebrow">Annual Goal</span>
                <span className="earn-goal-target">${fmt(ANNUAL_GOAL)}</span>
              </div>
              <div className="earn-goal-stat-group">
                <div className="earn-goal-stat">
                  <span className="earn-goal-stat-label">EARNED YTD</span>
                  <span className="earn-goal-stat-val">${fmt(YTD_EARNED)}</span>
                </div>
                <div className="earn-goal-stat">
                  <span className="earn-goal-stat-label">REMAINING</span>
                  <span className="earn-goal-stat-val">
                    ${fmt(Math.max(0, ANNUAL_GOAL - YTD_EARNED))}
                  </span>
                </div>
                <div className="earn-goal-stat">
                  <span className="earn-goal-stat-label">PROJECTED</span>
                  <span className="earn-goal-stat-val earn-goal-stat-val--proj">
                    ${fmt(ANNUAL_PROJECTED)}
                  </span>
                </div>
              </div>
            </div>
            <div className="earn-goal-bar-wrap">
              <div
                className="earn-goal-bar-fill"
                style={{ "--goal-pct": `${annualPct}%` } as React.CSSProperties}
              />
              <div
                className="earn-goal-bar-projected"
                style={
                  {
                    "--proj-pct": `${Math.min(100, (ANNUAL_PROJECTED / ANNUAL_GOAL) * 100)}%`,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="earn-goal-bar-labels">
              <span className="earn-goal-bar-pct">
                {annualPct.toFixed(0)}% complete
              </span>
              <span className="earn-goal-projection-msg">
                You&apos;re on track to earn ${fmt(ANNUAL_PROJECTED)} this year
              </span>
            </div>
          </div>
        </section>

        {/* ── Payout timeline ──────────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">NEXT PAYOUT</div>
            <h2 className="earn-section-title">Payout Status</h2>
          </div>
          <div className="earn-timeline-card">
            <div className="earn-timeline-next-date">
              <span className="earn-timeline-next-label">NEXT PAYOUT DATE</span>
              <span className="earn-timeline-next-val">{NEXT_PAYOUT_DATE}</span>
            </div>
            <div className="earn-timeline-track">
              {PAYOUT_TIMELINE.map((step, i) => {
                const isCurrent = step.key === PAYOUT_CURRENT;
                const isPast =
                  PAYOUT_TIMELINE.findIndex((s) => s.key === PAYOUT_CURRENT) >
                  i;
                return (
                  <div key={step.key} className="earn-timeline-step">
                    <div className="earn-timeline-step-row">
                      <div
                        className={`earn-timeline-node ${isCurrent ? "earn-timeline-node--current" : isPast ? "earn-timeline-node--past" : ""}`}
                      >
                        {isPast && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4l3 3 5-6"
                              stroke="#fff"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {isCurrent && (
                          <div className="earn-timeline-node-pulse" />
                        )}
                      </div>
                      {i < PAYOUT_TIMELINE.length - 1 && (
                        <div
                          className={`earn-timeline-connector ${isPast || isCurrent ? "earn-timeline-connector--active" : ""}`}
                        />
                      )}
                    </div>
                    <div className="earn-timeline-step-labels">
                      <span
                        className={`earn-timeline-step-name ${isCurrent ? "earn-timeline-step-name--current" : isPast ? "earn-timeline-step-name--past" : ""}`}
                      >
                        {step.label}
                      </span>
                      <span className="earn-timeline-step-desc">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Monthly bar chart ───────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">TREND</div>
            <h2 className="earn-section-title">Monthly Earnings</h2>
          </div>
          <div className="earn-chart-wrap">
            {/* SVG bar chart */}
            <div className="earn-chart-svg-wrap">
              <svg
                viewBox="0 0 720 200"
                preserveAspectRatio="none"
                className="earn-chart-svg"
                aria-label="Monthly earnings bar chart"
              >
                {/* Grid lines */}
                {[25, 50, 75, 100].map((pct) => (
                  <line
                    key={pct}
                    x1="0"
                    y1={`${pct}%`}
                    x2="100%"
                    y2={`${pct}%`}
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                ))}
                {/* Target line at $500 goal */}
                <line
                  x1="0"
                  y1={`${goalLineY}%`}
                  x2="100%"
                  y2={`${goalLineY}%`}
                  stroke="var(--champagne)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
                <text
                  x="4"
                  y={`${goalLineY - 1.5}%`}
                  fill="var(--champagne)"
                  fontSize="9"
                  fontFamily="var(--font-body)"
                  opacity="0.7"
                >
                  Goal $500
                </text>
              </svg>
            </div>
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

        {/* ── Earnings breakdown donut + legend ───────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">COMPOSITION</div>
            <h2 className="earn-section-title">Earnings Breakdown</h2>
          </div>
          <div className="earn-donut-wrap">
            <div className="earn-donut-svg-container">
              <svg
                viewBox="0 0 120 120"
                className="earn-donut-svg"
                aria-label="Earnings composition donut chart"
              >
                {donutData.map((seg) => (
                  <circle
                    key={seg.label}
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="16"
                    strokeDasharray={`${seg.dash} ${seg.gap}`}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="earn-donut-segment"
                  />
                ))}
                {/* Center label */}
                <text
                  x="60"
                  y="56"
                  textAnchor="middle"
                  fill="var(--dark)"
                  fontSize="13"
                  fontWeight="900"
                  fontFamily="var(--font-display)"
                >
                  ${(THIS_MONTH_EARNED / 1000).toFixed(1)}k
                </text>
                <text
                  x="60"
                  y="68"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="7"
                  fontFamily="var(--font-body)"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  THIS MONTH
                </text>
              </svg>
            </div>
            <div className="earn-donut-legend">
              {DONUT_SEGMENTS.map((seg) => (
                <div key={seg.label} className="earn-donut-legend-row">
                  <span
                    className="earn-donut-legend-swatch"
                    style={{ background: seg.color }}
                  />
                  <span className="earn-donut-legend-label">{seg.label}</span>
                  <span className="earn-donut-legend-pct">{seg.pct}%</span>
                  <span className="earn-donut-legend-amt">
                    ${fmt((THIS_MONTH_EARNED * seg.pct) / 100)}
                  </span>
                </div>
              ))}
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

        {/* ── Campaign earnings table (sortable) ──────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">PER CAMPAIGN</div>
            <h2 className="earn-section-title">Campaign Breakdown</h2>
          </div>
          <div className="earn-camp-table">
            <div className="earn-camp-table-head">
              {(
                [
                  { key: "campaign" as SortKey, label: "Campaign" },
                  { key: "walkIns" as SortKey, label: "Walk-ins" },
                  { key: "rate" as SortKey, label: "Rate/Walk-in" },
                  { key: "total" as SortKey, label: "Total" },
                  { key: "status" as SortKey, label: "Status" },
                ] as const
              ).map((col) => (
                <button
                  key={col.key}
                  className={`earn-camp-th ${sortKey === col.key ? "earn-camp-th--active" : ""}`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {col.label}
                  <span className="earn-camp-sort-icon">
                    {sortKey === col.key
                      ? sortDir === "asc"
                        ? " ↑"
                        : " ↓"
                      : " ↕"}
                  </span>
                </button>
              ))}
            </div>
            {sortedTable.map((row, i) => (
              <div key={i} className="earn-camp-table-row">
                <span className="earn-camp-cell earn-camp-cell--name">
                  {row.campaign}
                </span>
                <span className="earn-camp-cell earn-camp-cell--num">
                  {row.walkIns}
                </span>
                <span className="earn-camp-cell earn-camp-cell--num">
                  ${row.rate.toFixed(2)}
                </span>
                <span className="earn-camp-cell earn-camp-cell--total">
                  ${fmt(row.total)}
                </span>
                <span className="earn-camp-cell">
                  <span
                    className={`earn-camp-status ${row.status === "Paid" ? "earn-camp-status--paid" : "earn-camp-status--pending"}`}
                  >
                    {row.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Campaign breakdown bars ──────────────────────── */}
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

        {/* ── Tax / cashout info ───────────────────────────── */}
        <section className="earn-section earn-reveal">
          <div className="earn-section-header">
            <div className="earn-eyebrow">PAYMENT</div>
            <h2 className="earn-section-title">Cash Out & Tax Info</h2>
          </div>
          <div className="earn-cashout-info-grid">
            {/* Cashout ready card */}
            <div className="earn-cashout-info-card earn-cashout-info-card--primary">
              <div className="earn-cashout-info-top">
                <span className="earn-cashout-info-eyebrow">
                  READY TO CASH OUT
                </span>
                <span className="earn-cashout-info-amount">
                  ${fmt(CASHOUT_READY)}
                </span>
              </div>
              <p className="earn-cashout-info-desc">
                Funds are verified and available immediately.
              </p>
              <button
                className="earn-cashout-info-btn"
                onClick={() => setCashoutOpen(true)}
              >
                Cash Out ${fmt(CASHOUT_READY)}
              </button>
            </div>
            {/* Payment method card */}
            <div className="earn-cashout-info-card">
              <span className="earn-cashout-info-eyebrow">PAYMENT METHOD</span>
              <div className="earn-payment-method-row">
                <div className="earn-payment-method-icon">
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                    <rect
                      x="0.75"
                      y="0.75"
                      width="18.5"
                      height="12.5"
                      rx="0"
                      stroke="var(--champagne)"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="0"
                      y="3"
                      width="20"
                      height="3"
                      fill="var(--champagne)"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <div className="earn-payment-method-info">
                  <span className="earn-payment-method-name">
                    Stripe Connect
                  </span>
                  <span className="earn-payment-method-mask">
                    ••••&nbsp;••••&nbsp;••••&nbsp;4242
                  </span>
                </div>
              </div>
              <button className="earn-payment-update-btn" onClick={() => {}}>
                Update Method →
              </button>
            </div>
            {/* Tax summary card */}
            <div className="earn-cashout-info-card">
              <span className="earn-cashout-info-eyebrow">TAX SUMMARY</span>
              <div className="earn-tax-rows">
                <div className="earn-tax-row">
                  <span className="earn-tax-label">YTD Gross</span>
                  <span className="earn-tax-val">${fmt(YTD_EARNED)}</span>
                </div>
                <div className="earn-tax-row">
                  <span className="earn-tax-label">Platform Fees</span>
                  <span className="earn-tax-val earn-tax-val--neg">
                    -${fmt(YTD_EARNED * 0.05)}
                  </span>
                </div>
                <div className="earn-tax-row earn-tax-row--total">
                  <span className="earn-tax-label">Net to Report</span>
                  <span className="earn-tax-val earn-tax-val--pos">
                    ${fmt(YTD_EARNED * 0.95)}
                  </span>
                </div>
              </div>
              <p className="earn-tax-note">
                1099-NEC issued if annual earnings &gt; $600. Consult a tax
                professional.
              </p>
            </div>
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
