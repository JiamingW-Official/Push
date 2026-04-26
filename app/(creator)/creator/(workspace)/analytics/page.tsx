"use client";

import { useState } from "react";
import Link from "next/link";
import "./analytics.css";

/* ── Mock data ─────────────────────────────────────────────────── */

const REACH_DATA = [
  { month: "Nov", value: 6200 },
  { month: "Dec", value: 7800 },
  { month: "Jan", value: 9100 },
  { month: "Feb", value: 8400 },
  { month: "Mar", value: 11200 },
  { month: "Apr", value: 12847 },
];

const NEIGHBORHOOD_DATA = [
  { name: "Williamsburg", value: 3240 },
  { name: "Lower East Side", value: 2810 },
  { name: "Fort Greene", value: 2190 },
  { name: "Park Slope", value: 1870 },
  { name: "Bed-Stuy", value: 1540 },
  { name: "Greenpoint", value: 1197 },
];

const TIER_CONFIG = {
  current: "Operator",
  score: 71,
  nextTier: "Proven",
  nextScore: 75,
  prevScore: 60,
};

const INSIGHTS = [
  {
    id: 1,
    headline: "Food campaigns",
    stat: "2.4×",
    context: "conversion rate vs. lifestyle",
    body: "Your food content consistently outperforms every other category. The audience trusts your taste.",
    cta: "Find food campaigns",
    ctaHref: "/creator/dashboard",
    statClass: "an-insight-stat",
  },
  {
    id: 2,
    headline: "Williamsburg",
    stat: "+31%",
    context: "reach vs. last month",
    body: "Your Williamsburg content is hitting. Three of your top-5 posts this month were from that neighborhood.",
    cta: "Browse nearby",
    ctaHref: "/creator/dashboard",
    statClass: "an-insight-stat an-insight-stat--blue",
  },
  {
    id: 3,
    headline: "4 points",
    stat: "75",
    context: "to reach Proven tier",
    body: "One strong campaign away from unlocking higher-paying spots and exclusive merchant partnerships.",
    cta: "See what unlocks",
    ctaHref: "/creator/profile",
    statClass: "an-insight-stat an-insight-stat--champagne",
  },
];

type Period = "7d" | "30d" | "90d" | "all";

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "all", label: "All Time" },
];

/* ── CSS bar chart (no Chart.js) ────────────────────────────── */

function BarChartCSS({ data }: { data: { month: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 160,
        padding: "0 0 8px",
      }}
    >
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.month}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              height: "100%",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${pct}%`,
                  background: isLast ? "var(--brand-red)" : "var(--mist)",
                  borderRadius: "4px 4px 0 0",
                  minHeight: 4,
                  border: isLast
                    ? "1px solid var(--brand-red)"
                    : "1px solid var(--hairline)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Horizontal bar ─────────────────────────────────────────── */

function HorizontalBar({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="an-hbar-list">
      {data.map((d, i) => (
        <div key={d.name} className="an-hbar-row">
          <span className="an-hbar-label">{d.name}</span>
          <div className="an-hbar-track">
            <div
              className="an-hbar-fill"
              style={{
                width: `${(d.value / max) * 100}%`,
                opacity: 0.4 + 0.6 * (1 - i / data.length),
              }}
            />
          </div>
          <span className="an-hbar-value">
            {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Tier progress ──────────────────────────────────────────── */

function TierProgress() {
  const { score, prevScore, nextScore, current, nextTier } = TIER_CONFIG;
  const pct = Math.round(((score - prevScore) / (nextScore - prevScore)) * 100);
  return (
    <div className="an-tier-wrap">
      <div className="an-tier-labels">
        <span className="an-tier-current">{current}</span>
        <span className="an-tier-next">{nextTier} →</span>
      </div>
      <div className="an-tier-track">
        <div className="an-tier-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="an-tier-meta">
        <span className="an-tier-score">
          Score: <strong>{score}</strong>
        </span>
        <span className="an-tier-gap">
          {nextScore - score} pts to {nextTier}
        </span>
      </div>
    </div>
  );
}

/* ── Status chip ────────────────────────────────────────────── */

type CampaignStatus = "Active" | "Ended" | "Pending";

const STATUS_STYLES: Record<
  CampaignStatus,
  { background: string; color: string }
> = {
  Active: {
    background: "var(--accent-blue-tint)",
    color: "var(--accent-blue)",
  },
  Ended: { background: "var(--surface-3)", color: "var(--ink-3)" },
  Pending: {
    background: "var(--champagne-tint)",
    color: "var(--champagne-deep)",
  },
};

function StatusChip({ status }: { status: CampaignStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span
      className="an-status-chip"
      style={{ background: s.background, color: s.color }}
    >
      {status}
    </span>
  );
}

/* ── Campaign table data ────────────────────────────────────── */

const CAMPAIGN_TABLE: {
  name: string;
  visits: number;
  status: CampaignStatus;
  earnings: string;
  period: string;
}[] = [
  {
    name: "Blank Street Coffee",
    visits: 1840,
    status: "Active",
    earnings: "$92.00",
    period: "Apr 2026",
  },
  {
    name: "Superiority Burger",
    visits: 2960,
    status: "Ended",
    earnings: "$148.00",
    period: "Mar 2026",
  },
  {
    name: "Flamingo Estate",
    visits: 1120,
    status: "Ended",
    earnings: "$56.00",
    period: "Mar 2026",
  },
  {
    name: "Brow Theory",
    visits: 1740,
    status: "Active",
    earnings: "$87.00",
    period: "Apr 2026",
  },
  {
    name: "Cha Cha Matcha",
    visits: 980,
    status: "Pending",
    earnings: "$49.00",
    period: "Apr 2026",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function CreatorAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  return (
    <div className="cw-page an-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">ANALYTICS</p>
          <h1 className="cw-title">Analytics</h1>
        </div>
        <div className="cw-header__right">
          <Link href="#" className="cw-pill">
            Export
          </Link>
          <div className="cw-chip-row">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={"cw-chip" + (period === p.key ? " is-active" : "")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── KPI Strip ────────────────────────────────────── */}
      <div className="an-section">
        <div className="an-kpi-grid">
          {[
            {
              label: "TOTAL SCANS",
              value: "12,847",
              delta: "+18% vs last month",
            },
            {
              label: "TOTAL EARNINGS",
              value: "$432",
              delta: "+12% vs last month",
            },
            {
              label: "ACTIVE CAMPAIGNS",
              value: "5",
              delta: "2 ending this week",
            },
            {
              label: "AVG PUSH SCORE",
              value: "71",
              delta: "↑ 3 pts vs last month",
            },
          ].map((kpi) => (
            <div key={kpi.label} className="an-kpi-card">
              <p className="an-kpi-eyebrow">{kpi.label}</p>
              <p className="an-kpi-value">{kpi.value}</p>
              <p className="an-kpi-delta">{kpi.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Visits Over Time Chart ────────────────────── */}
      <div className="an-section">
        <div className="an-chart-card">
          <div className="an-chart-header">
            <div>
              <p className="an-section-eyebrow">VERIFIED SCANS</p>
              <h2 className="an-section-title">Scans Over Time</h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  margin: 0,
                }}
              >
                Last 6 months
              </p>
            </div>
            <span className="an-chart-total">12,847</span>
          </div>
          <BarChartCSS data={REACH_DATA} />
        </div>
      </div>

      {/* ── Campaign Breakdown Table ──────────────────── */}
      <div className="an-section">
        <p className="an-section-eyebrow">CAMPAIGN BREAKDOWN</p>
        <h2 className="an-section-title" style={{ marginBottom: 16 }}>
          All Campaigns
        </h2>
        <div className="an-table-card">
          {/* Table header */}
          <div className="an-table-head">
            {["CAMPAIGN", "SCANS", "STATUS", "EARNINGS", "PERIOD"].map((h) => (
              <span key={h} className="an-table-head-cell">
                {h}
              </span>
            ))}
          </div>
          {/* Table rows */}
          {CAMPAIGN_TABLE.map((row) => (
            <div key={row.name} className="an-table-row">
              <span className="an-table-campaign">{row.name}</span>
              <span className="an-table-visits">
                {row.visits.toLocaleString()}
              </span>
              <span>
                <StatusChip status={row.status} />
              </span>
              <span className="an-table-earnings">{row.earnings}</span>
              <span className="an-table-period">{row.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Stats Row ──────────────────────────── */}
      <div className="an-section">
        <div className="an-bottom-grid">
          {/* Best campaign */}
          <div className="an-stat-card">
            <p className="an-kpi-eyebrow">BEST CAMPAIGN</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
                color: "var(--ink)",
                letterSpacing: "-0.015em",
                lineHeight: 1.3,
                margin: "0 0 4px",
              }}
            >
              Superiority Burger
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-4)",
                margin: "0 0 16px",
              }}
            >
              2,960 scans · $148 earned
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-4)",
                    margin: "0 0 4px",
                  }}
                >
                  Category
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  Food
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-4)",
                    margin: "0 0 4px",
                  }}
                >
                  Conv. Rate
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  4.8%
                </p>
              </div>
            </div>
          </div>

          {/* Streak — clean surface-2 card, NO candy panel */}
          <div className="an-stat-card">
            <p className="an-kpi-eyebrow">STREAK</p>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 5vw, 72px)",
                  fontWeight: 900,
                  color: "var(--brand-red)",
                  letterSpacing: "-0.04em",
                  margin: "0 0 4px",
                  lineHeight: 1,
                }}
              >
                14
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: 0,
                    color: "var(--ink-3)",
                  }}
                >
                  {" "}
                  days
                </span>
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  margin: 0,
                }}
              >
                Active streak — keep it going
              </p>
            </div>
          </div>

          {/* Tier progress */}
          <div
            className="an-stat-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p className="an-kpi-eyebrow">TIER PROGRESS</p>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TierProgress />
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Performers ────────────────────────────── */}
      <div className="an-section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Top Campaigns */}
          <div
            style={{
              background: "var(--snow)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: 24,
            }}
          >
            <p className="an-kpi-eyebrow">TOP CAMPAIGNS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Superiority Burger", value: "2,960 scans" },
                { name: "Brow Theory", value: "1,740 scans" },
                { name: "Blank Street Coffee", value: "1,840 scans" },
                { name: "Flamingo Estate", value: "1,120 scans" },
                { name: "Cha Cha Matcha", value: "980 scans" },
              ].map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: i === 0 ? "var(--brand-red)" : "var(--ink-4)",
                      width: 24,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink)",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div
            style={{
              background: "var(--snow)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: 24,
            }}
          >
            <p className="an-kpi-eyebrow">TOP LOCATIONS</p>
            <HorizontalBar data={NEIGHBORHOOD_DATA} />
          </div>
        </div>
      </div>

      {/* ── Insights ──────────────────────────────────── */}
      <div className="an-insights-section">
        <div className="an-insights-header">
          <p className="an-insights-eyebrow">GENERATED FROM YOUR DATA</p>
          <h2 className="an-insights-title">Insights</h2>
        </div>
        <div className="an-insights-grid">
          {INSIGHTS.map((ins) => (
            <div key={ins.id} className="an-insight-card">
              <div className="an-insight-accent-bar" />
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <span className={ins.statClass}>{ins.stat}</span>
                <span className="an-insight-context">{ins.context}</span>
              </div>
              <h3 className="an-insight-headline">{ins.headline}</h3>
              <p className="an-insight-body">{ins.body}</p>
              <Link href={ins.ctaHref} className="an-insight-cta">
                {ins.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
