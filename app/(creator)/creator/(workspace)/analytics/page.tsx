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
    headline: "Food campaigns convert harder",
    stat: "2.4x",
    context: "vs lifestyle category",
    body: "Your food content consistently outperforms every other category. The audience trusts your taste.",
    cta: "Find food campaigns",
    ctaHref: "/creator/dashboard",
    statClass: "an-insight-stat",
  },
  {
    id: 2,
    headline: "Williamsburg is hot",
    stat: "+31%",
    context: "reach vs last month",
    body: "Three of your top-five posts this month came out of Williamsburg. Lean in.",
    cta: "Browse nearby",
    ctaHref: "/creator/dashboard",
    statClass: "an-insight-stat an-insight-stat--blue",
  },
  {
    id: 3,
    headline: "One push from Proven tier",
    stat: "4 pts",
    context: "to unlock higher-paying spots",
    body: "One strong campaign away from exclusive merchant partnerships and a higher base rate.",
    cta: "See what unlocks",
    ctaHref: "/creator/profile",
    statClass: "an-insight-stat an-insight-stat--ink",
  },
];

type Period = "7d" | "30d" | "90d" | "all";

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "all", label: "All" },
];

/* ── KPI ───────────────────────────────────────────────────────── */

type DeltaDir = "up" | "down" | "neutral";

const KPI_CARDS: {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  dir: DeltaDir;
}[] = [
  {
    label: "Total scans",
    value: "12,847",
    delta: "18% vs last month",
    dir: "up",
  },
  {
    label: "Total earnings",
    value: "$432",
    delta: "12% vs last month",
    dir: "up",
  },
  {
    label: "Active campaigns",
    value: "5",
    delta: "2 ending this week",
    dir: "neutral",
  },
  {
    label: "Push score",
    value: "71",
    delta: "3 pts vs last month",
    dir: "up",
  },
];

const DELTA_GLYPH: Record<DeltaDir, string> = {
  up: "↑",
  down: "↓",
  neutral: "·",
};

/* ── CSS bar chart ─────────────────────────────────────────────── */

function BarChartCSS({ data }: { data: { month: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div
      className="an-bar-chart"
      role="img"
      aria-label="Verified scans, last 6 months"
    >
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="an-bar-col">
            <div className="an-bar-track">
              <div
                className={
                  "an-bar-fill" + (isLast ? " an-bar-fill--current" : "")
                }
                style={{ height: `${pct}%` }}
                title={`${d.month}: ${d.value.toLocaleString()} scans`}
              />
            </div>
            <span className="an-bar-label">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Horizontal bar (top locations) ────────────────────────────── */

function HorizontalBar({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="an-hbar-list">
      {data.map((d, i) => (
        <div key={d.name} className="an-hbar-row">
          <span className="an-hbar-label">{d.name}</span>
          <div className="an-hbar-track">
            <div
              className={
                "an-hbar-fill" + (i === 0 ? " an-hbar-fill--lead" : "")
              }
              style={{ width: `${(d.value / max) * 100}%` }}
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

/* ── Tier progress ─────────────────────────────────────────────── */

function TierProgress() {
  const { score, prevScore, nextScore, current, nextTier } = TIER_CONFIG;
  const pct = Math.round(((score - prevScore) / (nextScore - prevScore)) * 100);
  return (
    <div className="an-tier-wrap">
      <div className="an-tier-labels">
        <span className="an-tier-current">{current}</span>
        <span className="an-tier-next">{nextTier} →</span>
      </div>
      <div
        className="an-tier-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Tier progress to ${nextTier}`}
      >
        <div className="an-tier-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="an-tier-meta">
        <span className="an-tier-score">
          Score <strong>{score}</strong>
        </span>
        <span className="an-tier-gap">
          {nextScore - score} pts to {nextTier}
        </span>
      </div>
    </div>
  );
}

/* ── Status chip ───────────────────────────────────────────────── */

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

/* ── Campaign table data ───────────────────────────────────────── */

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
    earnings: "$92",
    period: "Apr 2026",
  },
  {
    name: "Superiority Burger",
    visits: 2960,
    status: "Ended",
    earnings: "$148",
    period: "Mar 2026",
  },
  {
    name: "Flamingo Estate",
    visits: 1120,
    status: "Ended",
    earnings: "$56",
    period: "Mar 2026",
  },
  {
    name: "Brow Theory",
    visits: 1740,
    status: "Active",
    earnings: "$87",
    period: "Apr 2026",
  },
  {
    name: "Cha Cha Matcha",
    visits: 980,
    status: "Pending",
    earnings: "$49",
    period: "Apr 2026",
  },
];

const TOP_CAMPAIGNS = [
  { name: "Superiority Burger", value: "2,960 scans" },
  { name: "Blank Street Coffee", value: "1,840 scans" },
  { name: "Brow Theory", value: "1,740 scans" },
  { name: "Flamingo Estate", value: "1,120 scans" },
  { name: "Cha Cha Matcha", value: "980 scans" },
];

/* ── Page ──────────────────────────────────────────────────────── */

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
          <Link
            href="#"
            className="cw-pill"
            aria-label="Export analytics report"
          >
            Export
          </Link>
          <div className="cw-chip-row" role="tablist" aria-label="Time range">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={period === p.key}
                onClick={() => setPeriod(p.key)}
                className={"cw-chip" + (period === p.key ? " is-active" : "")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── KPI Strip ────────────────────────────────────────────── */}
      <div className="an-section">
        <div className="an-kpi-grid">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.label}
              className="an-kpi-card"
              tabIndex={0}
              role="group"
              aria-label={`${kpi.label}: ${kpi.value}, ${kpi.delta}`}
            >
              <p className="an-kpi-eyebrow">{kpi.label}</p>
              <p className="an-kpi-value">
                {kpi.value}
                {kpi.unit ? (
                  <span className="an-kpi-unit">{kpi.unit}</span>
                ) : null}
              </p>
              <p className={"an-kpi-delta an-kpi-delta--" + kpi.dir}>
                <span className="an-kpi-delta__arrow" aria-hidden="true">
                  {DELTA_GLYPH[kpi.dir]}
                </span>
                {kpi.delta}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Visits Over Time Chart ───────────────────────────────── */}
      <div className="an-section">
        <div className="an-chart-card">
          <div className="an-chart-header">
            <div>
              <p className="an-section-eyebrow">VERIFIED SCANS</p>
              <h2 className="an-section-title an-section-title--tight">
                Scans over time
              </h2>
              <p className="an-chart-meta">Last 6 months</p>
            </div>
            <span className="an-chart-total" aria-label="Total scans">
              12,847
            </span>
          </div>
          <BarChartCSS data={REACH_DATA} />
        </div>
      </div>

      {/* ── Campaign Breakdown Table ─────────────────────────────── */}
      <div className="an-section">
        <p className="an-section-eyebrow">CAMPAIGN BREAKDOWN</p>
        <h2 className="an-section-title an-section-title--tight">
          All campaigns
        </h2>
        <div className="an-table-card">
          <div className="an-table-head" role="row">
            {["CAMPAIGN", "SCANS", "STATUS", "EARNINGS", "PERIOD"].map((h) => (
              <span key={h} className="an-table-head-cell" role="columnheader">
                {h}
              </span>
            ))}
          </div>
          {CAMPAIGN_TABLE.map((row) => (
            <div key={row.name} className="an-table-row" role="row">
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

      {/* ── Bottom Stats Row ─────────────────────────────────────── */}
      <div className="an-section">
        <div className="an-bottom-grid">
          {/* Best campaign — single liquid-glass spotlight */}
          <div
            className="an-stat-card an-stat-card--spotlight"
            tabIndex={0}
            role="group"
            aria-label="Best performing campaign"
          >
            <p className="an-kpi-eyebrow">BEST CAMPAIGN</p>
            <p className="an-stat-best-name">Superiority Burger</p>
            <p className="an-stat-best-meta">2,960 scans · $148 earned</p>
            <div className="an-stat-best-grid">
              <div className="an-stat-best-grid__cell">
                <span className="an-stat-best-grid__label">Category</span>
                <span className="an-stat-best-grid__value">Food</span>
              </div>
              <div className="an-stat-best-grid__cell">
                <span className="an-stat-best-grid__label">Conv. rate</span>
                <span className="an-stat-best-grid__value">4.8%</span>
              </div>
            </div>
          </div>

          {/* Streak — editorial moment (champagne, ≤1 / page) */}
          <div
            className="an-stat-card"
            tabIndex={0}
            role="group"
            aria-label="Active streak"
          >
            <p className="an-kpi-eyebrow">STREAK</p>
            <p className="an-streak-numeral">
              14<span className="an-streak-unit">days</span>
            </p>
            <p className="an-streak-meta">Active streak — keep it going</p>
          </div>

          {/* Tier progress */}
          <div className="an-stat-card an-stat-card--column">
            <p className="an-kpi-eyebrow">TIER PROGRESS</p>
            <TierProgress />
          </div>
        </div>
      </div>

      {/* ── Top Performers ───────────────────────────────────────── */}
      <div className="an-section">
        <div className="an-top-grid">
          <div className="an-top-card">
            <p className="an-kpi-eyebrow">TOP CAMPAIGNS</p>
            <div className="an-top-list">
              {TOP_CAMPAIGNS.map((item, i) => (
                <div key={item.name} className="an-top-row">
                  <span className="an-top-rank">{i + 1}</span>
                  <span className="an-top-name">{item.name}</span>
                  <span className="an-top-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="an-top-card">
            <p className="an-kpi-eyebrow">TOP LOCATIONS</p>
            <HorizontalBar data={NEIGHBORHOOD_DATA} />
          </div>
        </div>
      </div>

      {/* ── Insights ─────────────────────────────────────────────── */}
      <div className="an-insights-section">
        <div className="an-insights-header">
          <p className="an-insights-eyebrow">GENERATED FROM YOUR DATA</p>
          <h2 className="an-insights-title">Insights</h2>
        </div>
        <div className="an-insights-grid">
          {INSIGHTS.map((ins) => (
            <div key={ins.id} className="an-insight-card">
              <div className="an-insight-accent-bar" />
              <div className="an-insight-stat-row">
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
