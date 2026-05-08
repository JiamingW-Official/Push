"use client";

/* ============================================================
   /creator/money/milestones — bonus + tier progression. v2 (2026-05-08)

   In-flight ladder: Active milestones (progress bars) + Tier ladder
   (Pillar → Operator → Proven → Pro → Studio → Network) + recently
   unlocked log. Champagne-accented, ceremonial without being cute.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  TrendingUp,
  Star,
  ArrowUpRight,
} from "lucide-react";
import "./milestones.css";

type Milestone = {
  id: string;
  name: string;
  description: string;
  progress: number;
  threshold: number;
  bonusAmount: number;
  unit: string;
  windowEnds: string;
  daysLeft: number;
  category: "weekly" | "tier" | "streak" | "campaign";
};

const ACTIVE: Milestone[] = [
  {
    id: "m1",
    name: "Weekly scan bonus",
    description: "Hit 50 verified scans in a 7-day window",
    progress: 42,
    threshold: 50,
    bonusAmount: 25,
    unit: "scans",
    windowEnds: "Sun May 11",
    daysLeft: 4,
    category: "weekly",
  },
  {
    id: "m2",
    name: "5-shoot streak",
    description: "Complete 5 shoots without a cancel or no-show",
    progress: 3,
    threshold: 5,
    bonusAmount: 40,
    unit: "shoots",
    windowEnds: "Open",
    daysLeft: 0,
    category: "streak",
  },
  {
    id: "m3",
    name: "Tier-up to Proven",
    description: "Reach 25 closed campaigns + 4.7+ avg rating",
    progress: 18,
    threshold: 25,
    bonusAmount: 0,
    unit: "campaigns",
    windowEnds: "Tier review",
    daysLeft: 0,
    category: "tier",
  },
  {
    id: "m4",
    name: "Roberta's repeat",
    description: "Land 3rd Roberta's gig in 60 days",
    progress: 2,
    threshold: 3,
    bonusAmount: 30,
    unit: "shoots",
    windowEnds: "Jun 28",
    daysLeft: 52,
    category: "campaign",
  },
];

type Unlocked = {
  date: string;
  name: string;
  amount: number;
};

const UNLOCKED: Unlocked[] = [
  { date: "May 1", name: "Weekly scan bonus", amount: 25 },
  { date: "Apr 24", name: "First-shoot bonus", amount: 50 },
  { date: "Apr 18", name: "Weekly scan bonus", amount: 25 },
  { date: "Apr 11", name: "Profile-complete", amount: 10 },
];

type Tier = {
  name: string;
  range: string;
  commission: number;
  baseRange: string;
  status: "earned" | "current" | "locked";
};

const TIERS: Tier[] = [
  {
    name: "Prospect",
    range: "0-2 closed",
    commission: 0,
    baseRange: "$15-25",
    status: "earned",
  },
  {
    name: "Pillar",
    range: "3-9 closed",
    commission: 3,
    baseRange: "$20-30",
    status: "earned",
  },
  {
    name: "Operator",
    range: "10-24 closed",
    commission: 5,
    baseRange: "$25-40",
    status: "current",
  },
  {
    name: "Proven",
    range: "25-74 closed",
    commission: 8,
    baseRange: "$40-80",
    status: "locked",
  },
  {
    name: "Pro",
    range: "75-199 closed",
    commission: 12,
    baseRange: "$80-160",
    status: "locked",
  },
  {
    name: "Studio",
    range: "200+ closed",
    commission: 15,
    baseRange: "$160-320",
    status: "locked",
  },
];

const CATEGORY_META: Record<
  Milestone["category"],
  { label: string; color: string }
> = {
  weekly: { label: "Weekly", color: "#0085ff" },
  tier: { label: "Tier-up", color: "#bfa170" },
  streak: { label: "Streak", color: "#ff5e2b" },
  campaign: { label: "Campaign", color: "#2d6e4a" },
};

export default function MoneyMilestones() {
  const [selected, setSelected] = useState<string>(ACTIVE[0].id);

  const totalActive = ACTIVE.length;
  const ytdEarned = UNLOCKED.reduce((a, u) => a + u.amount, 0);
  const nextUnlock = ACTIVE.filter((m) => m.bonusAmount > 0).reduce(
    (best, m) => {
      const remain = m.threshold - m.progress;
      const bestRemain = best ? best.threshold - best.progress : Infinity;
      return remain < bestRemain ? m : best;
    },
    null as Milestone | null,
  );

  const currentTier = TIERS.find((t) => t.status === "current")!;
  const nextTier = TIERS[TIERS.findIndex((t) => t.status === "current") + 1];

  return (
    <main className="mm-page" aria-label="Milestones">
      <header className="mm-hero">
        <div className="mm-hero__left">
          <Link href="/creator/money" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Money
          </Link>
          <h1 className="mm-hero__title">Milestones</h1>
          <p className="mm-hero__sub">
            {totalActive} active · ${ytdEarned} unlocked YTD · next bonus +$
            {nextUnlock?.bonusAmount ?? 0} in{" "}
            <strong>
              {nextUnlock
                ? `${nextUnlock.threshold - nextUnlock.progress} ${nextUnlock.unit}`
                : "—"}
            </strong>
          </p>
        </div>
      </header>

      {/* ── 3-up KPI ribbon ─────────────────────────────────── */}
      <section className="mm-ribbon">
        <article className="mm-stat mm-stat--hero">
          <p className="mm-stat__lbl">
            <Sparkles size={14} strokeWidth={2.25} />
            Active milestones
          </p>
          <p className="mm-stat__num">{totalActive}</p>
          <p className="mm-stat__meta">
            ${ACTIVE.reduce((a, m) => a + m.bonusAmount, 0)} potential unlocks
          </p>
        </article>

        <article className="mm-stat">
          <p className="mm-stat__lbl">
            <Trophy size={14} strokeWidth={2.25} />
            Unlocked YTD
          </p>
          <p className="mm-stat__num">${ytdEarned}</p>
          <p className="mm-stat__meta">{UNLOCKED.length} bonuses earned</p>
        </article>

        <article className="mm-stat mm-stat--streak">
          <p className="mm-stat__lbl">
            <Flame size={14} strokeWidth={2.25} />
            Active streak
          </p>
          <p className="mm-stat__num">
            3<span className="mm-stat__unit">shoots</span>
          </p>
          <p className="mm-stat__meta">2 more to unlock +$40 streak bonus</p>
        </article>
      </section>

      {/* ── Active milestones ──────────────────────────────── */}
      <section className="mm-section">
        <header className="mm-section__head">
          <p className="mm-section__eyebrow">In progress · {ACTIVE.length}</p>
          <h2 className="mm-section__title">Active milestones</h2>
        </header>
        <ul className="mm-list" aria-label="Active milestones">
          {ACTIVE.map((m) => {
            const pct = Math.min(
              100,
              Math.round((m.progress / m.threshold) * 100),
            );
            const meta = CATEGORY_META[m.category];
            const isSel = selected === m.id;
            return (
              <li
                key={m.id}
                className={"mm-row" + (isSel ? " mm-row--active" : "")}
                onClick={() => setSelected(m.id)}
              >
                <span className="mm-row__cat" style={{ color: meta.color }}>
                  <span
                    className="mm-row__dot"
                    style={{ background: meta.color }}
                  />
                  {meta.label}
                </span>
                <div className="mm-row__copy">
                  <span className="mm-row__name">{m.name}</span>
                  <span className="mm-row__desc">{m.description}</span>
                  <div className="mm-row__progress">
                    <div
                      className="mm-row__fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)`,
                      }}
                    />
                  </div>
                </div>
                <div className="mm-row__count">
                  <span className="mm-row__count-num">{m.progress}</span>
                  <span className="mm-row__count-sep">/</span>
                  <span className="mm-row__count-thr">{m.threshold}</span>
                  <span className="mm-row__count-unit">{m.unit}</span>
                </div>
                <div className="mm-row__bonus">
                  {m.bonusAmount > 0 ? (
                    <>
                      <span className="mm-row__bonus-num">
                        +${m.bonusAmount}
                      </span>
                      <span className="mm-row__bonus-window">
                        {m.daysLeft > 0 ? `${m.daysLeft}d left` : m.windowEnds}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mm-row__bonus-num mm-row__bonus-num--tier">
                        Tier-up
                      </span>
                      <span className="mm-row__bonus-window">
                        {m.windowEnds}
                      </span>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Tier ladder ────────────────────────────────────── */}
      <section className="mm-section">
        <header className="mm-section__head">
          <p className="mm-section__eyebrow">
            Tier ladder · currently <strong>{currentTier.name}</strong>
          </p>
          <h2 className="mm-section__title">
            Path to {nextTier?.name ?? "top"}
          </h2>
        </header>
        <div className="mm-ladder">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={"mm-ladder__step mm-ladder__step--" + t.status}
            >
              <div className="mm-ladder__step-head">
                <span className="mm-ladder__step-icon">
                  {t.status === "earned" ? (
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                  ) : t.status === "current" ? (
                    <Star size={14} strokeWidth={2.5} fill="currentColor" />
                  ) : (
                    <Lock size={14} strokeWidth={2.5} />
                  )}
                </span>
                <span className="mm-ladder__step-num">{i + 1}</span>
              </div>
              <p className="mm-ladder__step-name">{t.name}</p>
              <p className="mm-ladder__step-range">{t.range}</p>
              <div className="mm-ladder__step-stats">
                <span>
                  <span className="mm-ladder__stat-lbl">Comm.</span>
                  <span className="mm-ladder__stat-val">{t.commission}%</span>
                </span>
                <span>
                  <span className="mm-ladder__stat-lbl">Base</span>
                  <span className="mm-ladder__stat-val">{t.baseRange}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tier-up CTA ───────────────────────────────────── */}
      <section className="mm-section">
        <article className="mm-tier-cta">
          <span className="mm-tier-cta__icon">
            <TrendingUp size={20} strokeWidth={1.75} />
          </span>
          <div className="mm-tier-cta__copy">
            <p className="mm-tier-cta__eyebrow">
              {nextTier?.name ?? "Top"} unlocks at 25 closed campaigns
            </p>
            <h2 className="mm-tier-cta__title">
              7 more campaigns to {nextTier?.name ?? "max"} tier
            </h2>
            <p className="mm-tier-cta__body">
              Proven pays <strong>8% commission</strong> (vs 5% current) +{" "}
              <strong>$40-80 base</strong> (vs $25-40). Same throughput would
              lift you from $412/mo → ~$580/mo.
            </p>
            <Link href="/creator/analytics/tier" className="mm-tier-cta__link">
              Tier ladder details <ArrowUpRight size={14} strokeWidth={2.25} />
            </Link>
          </div>
        </article>
      </section>

      {/* ── Recently unlocked ──────────────────────────────── */}
      <section className="mm-section">
        <header className="mm-section__head">
          <p className="mm-section__eyebrow">
            Recently unlocked · {UNLOCKED.length}
          </p>
          <h2 className="mm-section__title">Bonus log</h2>
        </header>
        <ul className="mm-log">
          {UNLOCKED.map((u, i) => (
            <li key={i} className="mm-log__row">
              <span className="mm-log__date">{u.date}</span>
              <span className="mm-log__name">{u.name}</span>
              <span className="mm-log__amount">+${u.amount}</span>
              <span className="mm-log__status">
                <CheckCircle2 size={11} strokeWidth={2.5} /> Paid
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
