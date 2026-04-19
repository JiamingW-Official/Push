"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
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

const TIER_NEXT: Record<string, { score: number; name: string }> = {
  seed: { score: 30, name: "Steel Explorer" },
  explorer: { score: 55, name: "City Operator" },
  operator: { score: 75, name: "Proven Closer" },
  proven: { score: 90, name: "Top Closer" },
  closer: { score: 98, name: "Brand Partner" },
  partner: { score: 100, name: "Max" },
};

/* ── Greeting ────────────────────────────────────────────── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Today's top task (first active or upcoming item) ───── */

const TODAY_TASK = {
  id: "s1",
  time: "12:30",
  campaignName: "Best Burger in NYC Feature",
  merchantName: "Superiority Burger",
  earn: "$35",
  action: "Shoot + Submit",
  timeLeft: "2h left",
  status: "active" as const,
};

const TODAY_TOTAL = 3; // total tasks today

/* ── Open invite count (mock) ───────────────────────────── */

const OPEN_INVITES = 3;

/* ── Score ring helper ───────────────────────────────────── */

function getScoreDashOffset(score: number, r = 45): number {
  return 2 * Math.PI * r * (1 - score / 100);
}

/* ── Component ───────────────────────────────────────────── */

export default function CreatorDashboard() {
  const creator = DEMO_CREATOR;
  const tierKey = creator.tier;
  const tierLabel = TIER_LABELS[tierKey] ?? creator.tier;
  const tierNext = TIER_NEXT[tierKey] ?? { score: 100, name: "Max" };
  const ptsToNext = Math.max(0, tierNext.score - creator.push_score);
  const tierProgress = Math.round((creator.push_score / tierNext.score) * 100);
  const circumference = 2 * Math.PI * 45;
  const finalOffset = getScoreDashOffset(creator.push_score);

  // Active applications
  const activeCampaigns = DEMO_APPLICATIONS.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  ).length;

  /* GSAP entrance */
  const pageRef = useRef<HTMLDivElement>(null);
  const scoreRing = useRef<SVGCircleElement>(null);
  const scoreNum = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Stagger the three blocks in
      tl.from(".db3-block", {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.5,
      });

      // Score ring fill
      if (scoreRing.current) {
        gsap.set(scoreRing.current, { strokeDashoffset: circumference });
        tl.to(
          scoreRing.current,
          { strokeDashoffset: finalOffset, duration: 1, ease: "power2.inOut" },
          "-=0.2",
        );
      }

      // Score number count-up
      if (scoreNum.current) {
        const counter = { val: 0 };
        tl.to(
          counter,
          {
            val: creator.push_score,
            duration: 1,
            ease: "power2.out",
            onUpdate() {
              if (scoreNum.current)
                scoreNum.current.textContent = String(Math.round(counter.val));
            },
          },
          "<",
        );
      }

      // Progress bar
      const fill = document.querySelector<HTMLElement>(".db3-score-fill");
      if (fill) {
        const target = fill.style.width;
        gsap.set(fill, { width: "0%" });
        tl.to(
          fill,
          { width: target, duration: 0.8, ease: "power2.out" },
          "-=0.6",
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [creator.push_score, circumference, finalOffset]);

  return (
    <div className="db3-page" ref={pageRef}>
      {/* ── Greeting header ──────────────────────────────── */}
      <header className="db3-greeting">
        <p className="db3-greeting-eyebrow">{getGreeting()}</p>
        <h1 className="db3-greeting-name">{creator.name}</h1>
      </header>

      {/* ── Three-block layout ───────────────────────────── */}
      <div className="db3-blocks">
        {/* BLOCK 1 — Today */}
        <section className="db3-block" aria-labelledby="db3-today-heading">
          <div className="db3-block-header">
            <span className="db3-block-label" id="db3-today-heading">
              Today
            </span>
            <Link href="/creator/work/today" className="db3-block-link">
              View all ({TODAY_TOTAL}) →
            </Link>
          </div>

          <Link
            href="/creator/work/today"
            className="db3-task-card db3-task-card--active"
          >
            <div className="db3-task-top">
              <span className="db3-task-pill">NOW</span>
              <span className="db3-task-time-left">{TODAY_TASK.timeLeft}</span>
            </div>
            <p className="db3-task-name">{TODAY_TASK.campaignName}</p>
            <p className="db3-task-sub">
              {TODAY_TASK.time} · {TODAY_TASK.action} ·{" "}
              {TODAY_TASK.merchantName}
            </p>
            <div className="db3-task-footer">
              <span className="db3-task-earn">Earn {TODAY_TASK.earn}</span>
            </div>
          </Link>
        </section>

        {/* BLOCK 2 — Push Score */}
        <section className="db3-block" aria-labelledby="db3-score-heading">
          <div className="db3-block-header">
            <span className="db3-block-label" id="db3-score-heading">
              Your Push Score
            </span>
          </div>

          <div className="db3-score-wrap">
            {/* SVG ring */}
            <div className="db3-ring-wrap" aria-hidden="true">
              <svg className="db3-ring-svg" viewBox="0 0 100 100">
                <circle className="db3-ring-track" cx="50" cy="50" r="45" />
                <circle
                  ref={scoreRing}
                  className="db3-ring-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                />
              </svg>
              <div className="db3-ring-center">
                <span className="db3-ring-number" ref={scoreNum}>
                  0
                </span>
                <span className="db3-ring-denom">/100</span>
              </div>
            </div>

            {/* Score info */}
            <div className="db3-score-info">
              <div className={`db3-tier-badge db3-tier-badge--${tierKey}`}>
                {tierLabel}
              </div>
              <div className="db3-progress-row">
                <div className="db3-progress-bar">
                  <div
                    className="db3-score-fill"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
                <span className="db3-progress-hint">
                  {ptsToNext > 0
                    ? `${ptsToNext} pts to ${tierNext.name}`
                    : "Max tier reached"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK 3 — Open Invites */}
        <section className="db3-block" aria-labelledby="db3-invites-heading">
          <div className="db3-block-header">
            <span className="db3-block-label" id="db3-invites-heading">
              Open Invites
            </span>
          </div>

          <div className="db3-invites-body">
            <p className="db3-invites-count">
              <strong>{OPEN_INVITES}</strong> new campaigns match you
            </p>
            {activeCampaigns > 0 && (
              <p className="db3-invites-sub">
                {activeCampaigns} campaign{activeCampaigns > 1 ? "s" : ""}{" "}
                already active
              </p>
            )}
          </div>
          <Link href="/creator/discover" className="db3-cta">
            Browse campaigns →
          </Link>
        </section>
      </div>
    </div>
  );
}
