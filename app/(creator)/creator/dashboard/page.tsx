"use client";

import Link from "next/link";
import { DEMO_CREATOR, DEMO_APPLICATIONS } from "@/lib/creator/demo-data";
import "./dashboard.css";

/* ── Tier config ─────────────────────────────────────────── */

const TIER_LABELS: Record<string, string> = {
  seed: "Seed Starter",
  explorer: "Steel Explorer",
  operator: "City Operator",
  proven: "Proven Closer",
  closer: "Top Closer",
  partner: "Brand Partner",
};

/* ── Greeting ────────────────────────────────────────────── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Today's top task ───────────────────────────────────── */

const TODAY_TASK = {
  time: "12:30",
  campaignName: "Best Burger in NYC Feature",
  merchantName: "Superiority Burger",
  earn: "$35",
  action: "Shoot + Submit",
};

/* ── Open invite count (mock) ───────────────────────────── */

const OPEN_INVITES = 3;

/* ── Component ───────────────────────────────────────────── */

export default function CreatorDashboard() {
  const creator = DEMO_CREATOR;
  const tierKey = creator.tier;
  const tierLabel = TIER_LABELS[tierKey] ?? creator.tier;

  // Active applications
  const activeCampaigns = DEMO_APPLICATIONS.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  ).length;

  return (
    <div className="db3-page">
      {/* ── Greeting ─────────────────────────────────────── */}
      <header
        className="db3-greeting db3-block"
        style={{ animationDelay: "0ms" }}
      >
        <p className="db3-eyebrow">{getGreeting()}</p>
        <h1 className="db3-name">{creator.name}</h1>
      </header>

      {/* ── Today's Task — full-width hero ───────────────── */}
      <Link
        href="/creator/work/today"
        className="db3-task-hero db3-block"
        style={{ animationDelay: "80ms" }}
        aria-label={`Today's task: ${TODAY_TASK.campaignName}, earn ${TODAY_TASK.earn}`}
      >
        <p className="db3-eyebrow">Today&rsquo;s Task</p>
        <p className="db3-task-title">{TODAY_TASK.campaignName}</p>
        <p className="db3-task-meta">
          {TODAY_TASK.merchantName} &middot; {TODAY_TASK.time}
        </p>
        <p className="db3-earn">{TODAY_TASK.earn}</p>
      </Link>

      {/* ── Bottom row: Score + Invites ───────────────────── */}
      <div
        className="db3-bottom-row db3-block"
        style={{ animationDelay: "160ms" }}
      >
        {/* Push Score */}
        <section className="db3-score-card" aria-label="Your Push Score">
          <p className="db3-eyebrow">Push Score</p>
          <div className="db3-big-num-row">
            <span className="db3-big-num">{creator.push_score}</span>
            <span className="db3-big-denom">/100</span>
          </div>
          <p className="db3-tier-label">{tierLabel}</p>
        </section>

        {/* Open Invites */}
        <section className="db3-invites-card" aria-label="Open Invites">
          <p className="db3-eyebrow">Open Invites</p>
          <div className="db3-big-num-row">
            <span className="db3-big-num">{OPEN_INVITES}</span>
          </div>
          <p className="db3-invites-sub">campaigns match you</p>
          {activeCampaigns > 0 && (
            <p className="db3-invites-active">{activeCampaigns} active</p>
          )}
          <Link href="/creator/discover" className="db3-cta">
            Browse Campaigns
          </Link>
        </section>
      </div>
    </div>
  );
}
