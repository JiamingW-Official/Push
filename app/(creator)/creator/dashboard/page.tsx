"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  DEMO_CREATOR,
  DEMO_APPLICATIONS,
  DEMO_CAMPAIGNS,
} from "@/lib/creator/demo-data";
import "./dashboard.css";

/* ── Tier display config ─────────────────────────────────── */

const TIER_LABELS: Record<string, string> = {
  seed: "Seed Starter",
  explorer: "Steel Explorer",
  operator: "City Operator",
  proven: "Proven Closer",
  closer: "Top Closer",
  partner: "Brand Partner",
};

const TIER_NEXT_SCORE: Record<string, number> = {
  seed: 30,
  explorer: 55,
  operator: 75,
  proven: 90,
  closer: 98,
  partner: 100,
};

/* ── Mock today schedule items ───────────────────────────── */

type ScheduleItem = {
  id: string;
  time: string;
  campaignName: string;
  merchantName: string;
  earn: string;
  status: "upcoming" | "active" | "done";
};

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: "s1",
    time: "12:30",
    campaignName: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    earn: "$35",
    status: "active",
  },
  {
    id: "s2",
    time: "16:00",
    campaignName: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    earn: "$75",
    status: "upcoming",
  },
  {
    id: "s3",
    time: "18:30",
    campaignName: "Brow Transformation Story",
    merchantName: "Brow Theory",
    earn: "$50",
    status: "upcoming",
  },
];

/* ── Featured discover campaign ──────────────────────────── */

const FEATURED_CAMPAIGN = {
  id: "camp-007",
  title: "KITH x Creator Collab Series",
  merchantName: "KITH",
  earn: "$199",
  tags: ["Retail", "Editorial", "5+ Posts"],
  spotsLeft: 1,
};

/* ── Helpers ─────────────────────────────────────────────── */

function getDaysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getDeadlineUrgency(days: number): number {
  // Returns 0–1 fill: full bar = deadline passed, empty = 30+ days away
  return Math.max(0, Math.min(1, (30 - days) / 30));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getScoreDashOffset(score: number, radius = 45): number {
  const circumference = 2 * Math.PI * radius;
  return circumference - (score / 100) * circumference;
}

/* ── Component ───────────────────────────────────────────── */

export default function CreatorDashboard() {
  const creator = DEMO_CREATOR;
  const today = new Date();

  // Active applications (accepted, non-settled)
  const activeApps = useMemo(
    () =>
      DEMO_APPLICATIONS.filter(
        (a) => a.status === "accepted" && a.milestone !== "settled",
      ),
    [],
  );

  // Stats
  const weekEarnings = useMemo(
    () =>
      DEMO_APPLICATIONS.filter(
        (a) => a.milestone === "verified" || a.milestone === "settled",
      ).reduce((sum, a) => sum + a.payout, 0),
    [],
  );

  const scansToday = 7; // mock
  const tierLabel = TIER_LABELS[creator.tier] ?? creator.tier;
  const tierNextScore = TIER_NEXT_SCORE[creator.tier] ?? 100;
  const tierProgress = Math.round((creator.push_score / tierNextScore) * 100);
  const scoreDashOffset = getScoreDashOffset(creator.push_score);
  const scoreCircumference = 2 * Math.PI * 45;

  // KPI data
  const kpis = [
    {
      label: "This Week Earnings",
      value: `$${weekEarnings}`,
      ghost: `$${weekEarnings}`,
      sub: `${DEMO_APPLICATIONS.filter((a) => a.milestone === "settled").length} settled`,
      earningsColor: true,
    },
    {
      label: "Active Campaigns",
      value: String(activeApps.length),
      ghost: String(activeApps.length).padStart(2, "0"),
      sub: "in progress",
      earningsColor: false,
    },
    {
      label: "Scans Today",
      value: String(scansToday),
      ghost: String(scansToday).padStart(2, "0"),
      sub: "+3 vs yesterday",
      earningsColor: false,
    },
    {
      label: "Tier Progress",
      value: `${tierProgress}%`,
      ghost: `${tierProgress}`,
      sub: `to ${tierLabel}+`,
      earningsColor: true,
      isProgress: true,
      progressFill: tierProgress,
    },
  ];

  return (
    <div className="db-page">
      {/* ── Sub-nav breadcrumb ─────────────────────────────── */}
      <nav className="db-subnav" aria-label="Dashboard navigation">
        <span className="db-subnav-title">Dashboard</span>
        <span className="db-subnav-date">{formatDate(today)}</span>
      </nav>

      {/* ── Greeting header ───────────────────────────────── */}
      <header className="db-greeting">
        <p className="db-greeting-eyebrow">{getGreeting()}</p>
        <h1 className="db-greeting-name">{creator.name}</h1>
        <p className="db-greeting-date">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </header>

      {/* ── Score hero ────────────────────────────────────── */}
      <section className="db-score-hero" aria-labelledby="db-score-heading">
        {/* SVG ring */}
        <div className="db-score-ring-wrap" aria-hidden="true">
          <svg className="db-score-ring-svg" viewBox="0 0 100 100">
            <circle className="db-score-ring-track" cx="50" cy="50" r="45" />
            <circle
              className="db-score-ring-fill"
              cx="50"
              cy="50"
              r="45"
              strokeDasharray={scoreCircumference}
              strokeDashoffset={scoreDashOffset}
            />
          </svg>
          <div className="db-score-center">
            <span className="db-score-number">{creator.push_score}</span>
            <span className="db-score-label">Score</span>
          </div>
        </div>

        {/* Score info */}
        <div className="db-score-info">
          <p className="db-score-oracle-label">ConversionOracle™</p>
          <h2 id="db-score-heading" className="db-score-title">
            Score <span>{creator.push_score}</span>
          </h2>
          <div className={`db-tier-badge db-tier-badge--${creator.tier}`}>
            Tier: {tierLabel}
          </div>
          <p className="db-score-next-hint">
            <strong>{tierNextScore - creator.push_score} pts</strong> to unlock
            next tier
          </p>
          <div className="db-score-bar-wrap">
            <div className="db-score-bar" aria-hidden="true">
              <div
                className="db-score-bar-fill"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <span className="db-score-bar-label">{tierProgress}%</span>
          </div>
        </div>
      </section>

      {/* ── KPI Row ───────────────────────────────────────── */}
      <section className="db-kpi-row" aria-label="Key metrics">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="db-kpi-card">
            <span className="db-kpi-ghost" aria-hidden="true">
              {kpi.ghost}
            </span>
            <p className="db-kpi-label">{kpi.label}</p>
            <p
              className={`db-kpi-value${kpi.earningsColor ? "" : " db-kpi-value--neutral"}`}
            >
              {kpi.value}
            </p>
            {kpi.isProgress ? (
              <div className="db-kpi-progress">
                <div className="db-kpi-progress-bar">
                  <div
                    className="db-kpi-progress-fill"
                    style={{ width: `${kpi.progressFill}%` }}
                  />
                </div>
                <span className="db-kpi-progress-label">{kpi.sub}</span>
              </div>
            ) : (
              <p className="db-kpi-sub">{kpi.sub}</p>
            )}
          </div>
        ))}
      </section>

      {/* ── Main two-column content ────────────────────────── */}
      <div className="db-main">
        {/* ── Left: schedule + campaigns ─────────────────── */}
        <div className="db-content">
          {/* Today's schedule */}
          <div
            className="db-section-head"
            role="heading"
            aria-level={3}
            id="db-schedule-heading"
          >
            <span className="db-section-label">Today&apos;s Schedule</span>
            <Link href="/creator/work/today" className="db-section-link">
              See all →
            </Link>
          </div>

          <ul
            className="db-schedule-list"
            aria-labelledby="db-schedule-heading"
          >
            {SCHEDULE_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href="/creator/work/today" className="db-schedule-item">
                  <span
                    className={`db-schedule-dot db-schedule-dot--${item.status}`}
                    aria-label={item.status}
                  />
                  <span className="db-schedule-time">{item.time}</span>
                  <div className="db-schedule-info">
                    <p className="db-schedule-name">{item.campaignName}</p>
                    <p className="db-schedule-merchant">{item.merchantName}</p>
                  </div>
                  <span className="db-schedule-earn">{item.earn}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/creator/work/today" className="db-schedule-see-all">
            View full schedule →
          </Link>

          {/* Active campaigns */}
          <div
            className="db-section-head db-section--tight"
            role="heading"
            aria-level={3}
            id="db-campaigns-heading"
          >
            <span className="db-section-label">Active Campaigns</span>
            <Link href="/creator/work/pipeline" className="db-section-link">
              Pipeline →
            </Link>
          </div>

          <div
            className="db-campaigns-list"
            aria-labelledby="db-campaigns-heading"
          >
            {activeApps.map((app) => {
              const days = getDaysUntil(app.deadline ?? "");
              const urgency = getDeadlineUrgency(days);
              return (
                <Link
                  key={app.id}
                  href="/creator/work/pipeline"
                  className="db-campaign-card"
                >
                  <div>
                    <p className="db-campaign-name">{app.campaign_title}</p>
                    <p className="db-campaign-merchant">{app.merchant_name}</p>
                    <div className="db-campaign-deadline-bar">
                      <div className="db-deadline-track">
                        <div
                          className="db-deadline-fill"
                          style={{ width: `${urgency * 100}%` }}
                        />
                      </div>
                      <span className="db-deadline-label">
                        {days === 0 ? "TODAY" : `${days}D LEFT`}
                      </span>
                    </div>
                  </div>
                  <div className="db-campaign-right">
                    <span className="db-campaign-earn">${app.payout}</span>
                    <span className="db-campaign-category">{app.category}</span>
                    <span
                      className={`db-campaign-status-chip${app.milestone === "verified" ? " db-campaign-status-chip--active" : ""}`}
                    >
                      {app.milestone}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right aside ────────────────────────────────── */}
        <aside className="db-aside" aria-label="Discover and quick actions">
          {/* Discover teaser */}
          <div className="db-discover-teaser">
            <p className="db-discover-eyebrow">Featured Opportunity</p>

            <div className="db-discover-card">
              <p className="db-discover-card-earn">{FEATURED_CAMPAIGN.earn}</p>
              <p className="db-discover-card-name">{FEATURED_CAMPAIGN.title}</p>
              <p className="db-discover-card-merchant">
                {FEATURED_CAMPAIGN.merchantName}
              </p>
              <div className="db-discover-card-tags">
                {FEATURED_CAMPAIGN.tags.map((tag) => (
                  <span key={tag} className="db-discover-tag">
                    {tag}
                  </span>
                ))}
                <span className="db-discover-tag">
                  {FEATURED_CAMPAIGN.spotsLeft} spot left
                </span>
              </div>
            </div>

            <Link href="/creator/discover" className="db-discover-cta">
              Apply Now →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="db-quick-actions">
            <p className="db-quick-label">Quick Actions</p>
            <div className="db-quick-grid">
              <Link href="/creator/work/today" className="db-quick-btn">
                <span className="db-quick-icon">📅</span>
                <span className="db-quick-name">Today</span>
              </Link>
              <Link href="/creator/work/pipeline" className="db-quick-btn">
                <span className="db-quick-icon">⚡</span>
                <span className="db-quick-name">Pipeline</span>
              </Link>
              <Link href="/creator/inbox" className="db-quick-btn">
                <span className="db-quick-icon">✉</span>
                <span className="db-quick-name">Inbox</span>
                <span className="db-quick-unread" aria-label="3 unread">
                  3
                </span>
              </Link>
              <Link href="/creator/discover" className="db-quick-btn">
                <span className="db-quick-icon">🔍</span>
                <span className="db-quick-name">Discover</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
