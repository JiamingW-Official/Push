"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./creators.css";

/* ── Earnings Calculator ─────────────────────────────────── */
const TIER_RATES: Record<string, { min: number; max: number }> = {
  seed: { min: 2, max: 5 },
  explorer: { min: 5, max: 12 },
  operator: { min: 12, max: 25 },
  proven: { min: 25, max: 45 },
  closer: { min: 45, max: 80 },
  partner: { min: 80, max: 150 },
};

function EarningsCalculator() {
  const [tier, setTier] = useState("operator");
  const [campaigns, setCampaigns] = useState(4);
  const [avgPayout, setAvgPayout] = useState(18);

  const rate = TIER_RATES[tier];
  const estMin = Math.round(campaigns * avgPayout * (rate.min / 100) * 30);
  const estMax = Math.round(campaigns * avgPayout * (rate.max / 100) * 30);

  const tiers = [
    { id: "seed", label: "Seed", range: "1–5K" },
    { id: "explorer", label: "Explorer", range: "5–20K" },
    { id: "operator", label: "Operator", range: "20–50K" },
    { id: "proven", label: "Proven", range: "50–150K" },
    { id: "closer", label: "Closer", range: "150–500K" },
    { id: "partner", label: "Partner", range: "500K+" },
  ];

  return (
    <div className="calc-wrap">
      <div className="calc-controls">
        {/* Tier selector */}
        <div className="calc-field">
          <label className="calc-label">Your Tier</label>
          <div className="calc-tier-grid">
            {tiers.map((t) => (
              <button
                key={t.id}
                className={`calc-tier-btn ${tier === t.id ? "calc-tier-btn--active" : ""}`}
                onClick={() => setTier(t.id)}
                type="button"
              >
                <span className="calc-tier-name">{t.label}</span>
                <span className="calc-tier-range">{t.range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns per month */}
        <div className="calc-field">
          <label className="calc-label">
            Active campaigns / mo
            <span className="calc-val">{campaigns}</span>
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={campaigns}
            onChange={(e) => setCampaigns(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>12</span>
          </div>
        </div>

        {/* Avg payout per visit */}
        <div className="calc-field">
          <label className="calc-label">
            Avg. payout per verified visit
            <span className="calc-val">${avgPayout}</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            value={avgPayout}
            onChange={(e) => setAvgPayout(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="calc-slider-ticks">
            <span>$5</span>
            <span>$60</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="calc-output">
        <p className="calc-output-label">Estimated monthly earnings</p>
        <div className="calc-output-num">
          <span className="calc-num-prefix">$</span>
          <span className="calc-num-val">{estMin.toLocaleString()}</span>
          <span className="calc-num-sep">–</span>
          <span className="calc-num-prefix">$</span>
          <span className="calc-num-val">{estMax.toLocaleString()}</span>
        </div>
        <p className="calc-output-note">
          Based on {campaigns} campaign{campaigns !== 1 ? "s" : ""} · $
          {avgPayout} avg payout · {TIER_RATES[tier].min}–{TIER_RATES[tier].max}
          % commission rate
        </p>
        <Link href="/creator/signup" className="btn btn-primary calc-cta">
          Apply now — it&apos;s free
        </Link>
      </div>
    </div>
  );
}

/* ── 6 Tier showcase data ────────────────────────────────── */
const TIERS = [
  {
    id: "seed",
    num: "01",
    name: "Seed",
    material: "Clay",
    followers: "1K–5K",
    earning: "$50–200",
    period: "/mo",
    color: "var(--tier-clay)",
    textColor: "var(--tier-clay-text)",
    borderStyle: "dashed",
    levelUp:
      "Complete 3 verified visits — your score unlocks Explorer in 30 days.",
    badge: "badge-clay",
  },
  {
    id: "explorer",
    num: "02",
    name: "Explorer",
    material: "Bronze",
    followers: "5K–20K",
    earning: "$200–600",
    period: "/mo",
    color: "var(--tier-bronze)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp: "Hit 10 verified visits in a rolling 60-day window.",
    badge: "badge-bronze",
  },
  {
    id: "operator",
    num: "03",
    name: "Operator",
    material: "Steel",
    followers: "20K–50K",
    earning: "$600–1,500",
    period: "/mo",
    color: "var(--tier-steel)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp: "Maintain a 4.2+ performance score across 25+ visits.",
    badge: "badge-steel",
  },
  {
    id: "proven",
    num: "04",
    name: "Proven",
    material: "Gold",
    followers: "50K–150K",
    earning: "$1,500–4K",
    period: "/mo",
    color: "var(--tier-gold)",
    textColor: "var(--tier-gold-text)",
    borderStyle: "solid",
    levelUp: "50+ lifetime verified visits · 4.5 score · invited by Push team.",
    badge: "badge-gold",
  },
  {
    id: "closer",
    num: "05",
    name: "Closer",
    material: "Ruby",
    followers: "150K–500K",
    earning: "$4K–10K",
    period: "/mo",
    color: "var(--tier-ruby)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp: "Top 5% performer · Direct campaign access · No apply queue.",
    badge: "badge-ruby",
    shimmer: true,
  },
  {
    id: "partner",
    num: "06",
    name: "Partner",
    material: "Obsidian",
    followers: "500K+",
    earning: "$10K+",
    period: "/mo",
    color: "var(--tier-obsidian)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp: "Invite-only. Revenue share. Co-creation rights.",
    badge: "badge-obsidian",
    shimmer: true,
    pulse: true,
  },
];

/* ── Pull quote ──────────────────────────────────────────── */
const TESTIMONIAL = {
  quote:
    "I earned $320 last month just from my regular neighbourhood content. I was already walking past these spots — now I get paid every time someone follows through.",
  name: "Maya R.",
  handle: "@mayawalksnyc",
  tier: "Operator",
  material: "Steel",
  badge: "badge-steel",
  location: "Bushwick, Brooklyn",
};

/* ── How to start steps ──────────────────────────────────── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Apply",
    body: "Submit your creator profile. Push reviews your content, audience, and neighbourhood fit. Most creators hear back within 48 hours.",
  },
  {
    n: "02",
    title: "Get verified",
    body: "We confirm your reach, content quality, and location coverage. You receive your tier assignment and a unique creator QR identity.",
  },
  {
    n: "03",
    title: "Start earning",
    body: "Browse open campaigns, apply for the ones that fit. When a customer scans your QR and visits the merchant, the payout hits your dashboard instantly.",
  },
];

/* ── Problem/Solution data ───────────────────────────────── */
const PAIN_POINTS = [
  "Brands pay upfront, you prove nothing — and get ghosted",
  "Flat-rate sponsored posts disconnect effort from income",
  "Zero visibility into whether your content actually drove visits",
  "Platform algorithms tank your reach the week you need it most",
];

const PUSH_SOLUTIONS = [
  "Every payout anchored to a real, verified customer visit",
  "Commission rate scales with your tier — better work earns more",
  "Your QR dashboard shows exactly which posts drove which visits",
  "Foot traffic is algorithm-proof — QR scans don't depend on reach",
];

/* ── Page ────────────────────────────────────────────────── */
export default function ForCreatorsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="cr-hero">
        <div className="container cr-hero-inner">
          <div className="cr-hero-content">
            <p className="eyebrow cr-eyebrow">Push for Creators</p>
            <h1 className="cr-headline">
              <span className="cr-black">Get paid for traffic</span>
              <span className="cr-light">you already drive.</span>
            </h1>
            <p className="cr-sub">
              Push connects NYC creators with local merchants. Post about the
              spots you love. Every verified customer visit earns you a payout —
              no fake metrics, no guesswork, no hidden fees.
            </p>
            <div className="cr-ctas">
              <Link href="/creator/signup" className="btn btn-primary">
                Apply to create
              </Link>
              <Link href="/demo/creator" className="btn btn-ghost cr-ghost">
                See how it works →
              </Link>
            </div>
            <p className="cr-reassure">
              Free to join · No exclusivity required · Keep your other brand
              deals
            </p>
          </div>

          {/* Hero stats */}
          <div className="cr-hero-stats">
            {[
              {
                num: "$320",
                label: "Avg. creator month-1 payout",
                sub: "Operator tier",
              },
              {
                num: "48h",
                label: "Approval turnaround",
                sub: "From apply to active",
              },
              { num: "6", label: "Tiers to climb", sub: "Seed → Partner" },
              {
                num: "100%",
                label: "Visit-verified payouts",
                sub: "No fake impressions",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="cr-stat-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="cr-stat-num">{s.num}</span>
                <span className="cr-stat-label">{s.label}</span>
                <span className="cr-stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Problem / Solution split ──────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">01</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">The Problem</span>
            </div>
          </div>
          <div className="cr-ps-grid">
            {/* Left — Pain */}
            <div className="cr-ps-col cr-ps-pain reveal">
              <h2 className="cr-ps-headline">
                <span className="wt-900">Traditional sponsored posts</span>
                <span className="wt-300">don&apos;t pay you fairly.</span>
              </h2>
              <ul className="cr-pain-list">
                {PAIN_POINTS.map((p) => (
                  <li key={p} className="cr-pain-item">
                    <span className="cr-pain-dash" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="cr-ps-divider" aria-hidden="true">
              <div className="cr-ps-line" />
              <span className="cr-ps-vs">vs</span>
              <div className="cr-ps-line" />
            </div>

            {/* Right — Push */}
            <div
              className="cr-ps-col cr-ps-push reveal"
              style={{ transitionDelay: "160ms" }}
            >
              <h2 className="cr-ps-headline cr-ps-headline--push">
                <span className="wt-900">Push anchors</span>
                <span className="wt-300">every payment to a real visit.</span>
              </h2>
              <ul className="cr-solution-list">
                {PUSH_SOLUTIONS.map((s) => (
                  <li key={s} className="cr-solution-item">
                    <span className="cr-solution-check">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6L5 9L10 3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 6 Tier showcase ───────────────────────────────── */}
      <section className="section section-warm cr-tiers-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Creator Tiers</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Six tiers.</span>
              <span className="wt-300">One clear path up.</span>
            </h2>
            <p className="split-body">
              Every tier unlocks higher commission rates, priority campaign
              access, and faster payouts. You advance by driving real, verified
              foot traffic — nothing else.
            </p>
          </div>

          <div className="cr-tier-grid">
            {TIERS.map((t, i) => (
              <div
                key={t.id}
                className={`cr-tier-card reveal ${t.pulse ? "cr-tier-card--pulse" : ""}`}
                style={{
                  borderTopColor: t.color,
                  borderTopStyle: t.borderStyle as "solid" | "dashed",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div className="cr-tier-header">
                  <span className="cr-tier-num">{t.num}</span>
                  <span
                    className={`cr-tier-badge ${t.badge} ${t.shimmer ? "badge-shimmer" : ""}`}
                  >
                    {t.material} · {t.name}
                  </span>
                </div>

                <div className="cr-tier-body">
                  <div className="cr-tier-reach">
                    <span className="cr-tier-reach-label">Followers</span>
                    <span className="cr-tier-reach-val">{t.followers}</span>
                  </div>
                  <div className="cr-tier-earning">
                    <span
                      className="cr-tier-earn-num"
                      style={{
                        color:
                          t.id === "partner" ? "var(--champagne)" : undefined,
                      }}
                    >
                      {t.earning}
                    </span>
                    <span className="cr-tier-earn-period">{t.period}</span>
                  </div>
                </div>

                <div className="cr-tier-levelup">
                  <span className="cr-tier-levelup-label">How to level up</span>
                  <p className="cr-tier-levelup-body">{t.levelUp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How to start — 3 steps ─────────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How to Start</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Three steps.</span>
              <span className="wt-300">Then you&apos;re earning.</span>
            </h2>
          </div>

          <div className="cr-how-grid">
            {HOW_STEPS.map((step, i) => (
              <div
                key={step.n}
                className="cr-how-step reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="cr-how-n">{step.n}</span>
                <h3 className="cr-how-title">{step.title}</h3>
                <p className="cr-how-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Earnings calculator ───────────────────────────── */}
      <section className="section section-warm cr-calc-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Earnings Calculator</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">What could you earn</span>
              <span className="wt-300">this month?</span>
            </h2>
            <p className="split-body">
              Slide the inputs to your situation. Estimates are based on real
              Push payout data from active NYC creators.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* ── 6. Creator testimonial ───────────────────────────── */}
      <section className="section section-bright cr-quote-section">
        <div className="container">
          <div className="cr-quote-wrap reveal">
            <div className="cr-quote-mark">&ldquo;</div>
            <blockquote className="cr-quote-text">
              {TESTIMONIAL.quote}
            </blockquote>
            <div className="cr-quote-meta">
              <div className="cr-quote-author">
                <span className="cr-quote-name">{TESTIMONIAL.name}</span>
                <span className="cr-quote-handle">{TESTIMONIAL.handle}</span>
              </div>
              <div className="cr-quote-right">
                <span className={`cr-tier-badge ${TESTIMONIAL.badge}`}>
                  {TESTIMONIAL.material} · {TESTIMONIAL.tier}
                </span>
                <span className="cr-quote-loc">{TESTIMONIAL.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA — dark ───────────────────────────────── */}
      <section className="cr-final-cta section-warm">
        <div className="container">
          <div className="cr-cta-inner reveal">
            <p className="eyebrow" style={{ color: "var(--tertiary)" }}>
              Applications open now
            </p>
            <h2 className="cr-cta-headline">
              Join the NYC cohort.
              <span className="cr-cta-sub">
                Your neighbourhood. Your content. Your payout.
              </span>
            </h2>
            <p className="cr-cta-body">
              Push is live across Brooklyn, Manhattan, Queens, and the Bronx. We
              review every application within 48 hours. No exclusivity, no
              minimum posts — just real earnings for real visits.
            </p>
            <div className="cr-cta-actions">
              <Link href="/creator/signup" className="btn btn-primary">
                Apply to create — free
              </Link>
              <Link href="/for-merchants" className="btn btn-ghost cr-ghost">
                Are you a merchant? →
              </Link>
            </div>
            <p className="cr-cta-note">
              No minimum follower count for Seed tier · Payouts weekly via
              Stripe
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
