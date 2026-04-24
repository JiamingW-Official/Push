"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./creators.css";

/* ── Earnings Calculator ─────────────────────────────────── */
// v6 per-verified-visit model (R5): avg payout scales by creator tier.
// min/max bracket a +/- 25% band around the tier's expected average so the
// UI can show "est. $X–$Y" without promising a specific number.
const TIER_CONVERSION_RATE: Record<string, { min: number; max: number }> = {
  seed: { min: 4, max: 6 },
  explorer: { min: 6, max: 10 },
  operator: { min: 9, max: 15 },
  proven: { min: 14, max: 22 },
  closer: { min: 20, max: 30 },
  partner: { min: 28, max: 42 },
};

function EarningsCalculator() {
  const [tier, setTier] = useState("operator");
  const [campaigns, setCampaigns] = useState(2);
  const [visitsPerWeek, setVisitsPerWeek] = useState(8);

  const rate = TIER_CONVERSION_RATE[tier];
  // Monthly = campaigns × visits/week/campaign × per-visit rate × 4.33 weeks
  const weeks = 4.33;
  const estMin = Math.round(campaigns * visitsPerWeek * rate.min * weeks);
  const estMax = Math.round(campaigns * visitsPerWeek * rate.max * weeks);

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
          <label className="calc-label">Your tier</label>
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

        {/* Verified visits per week per campaign */}
        <div className="calc-field">
          <label className="calc-label">
            Verified visits / campaign / week
            <span className="calc-val">{visitsPerWeek}</span>
          </label>
          <input
            type="range"
            min={1}
            max={25}
            value={visitsPerWeek}
            onChange={(e) => setVisitsPerWeek(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>25</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="calc-output">
        <p className="calc-output-label">Estimated monthly payout</p>
        <div className="calc-output-num">
          <span className="calc-num-prefix">$</span>
          <span className="calc-num-val">{estMin.toLocaleString()}</span>
          <span className="calc-num-sep">–</span>
          <span className="calc-num-prefix">$</span>
          <span className="calc-num-val">{estMax.toLocaleString()}</span>
        </div>
        <p className="calc-output-note">
          {campaigns} campaign{campaigns !== 1 ? "s" : ""} · {visitsPerWeek}{" "}
          verified visits/wk · ${rate.min}–${rate.max} per visit (your tier
          rate). We pay on Friday via Stripe Connect.
        </p>
        <Link href="/creator/signup" className="btn btn-primary calc-cta">
          Apply for the cohort
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
    followers: "1K–5K",
    earning: "$50–200",
    period: "/mo",
    color: "var(--tier-clay)",
    textColor: "var(--tier-clay-text)",
    borderStyle: "dashed",
    levelUp: "Three verified visits in your first 30 days unlocks Explorer.",
    badge: "badge-clay",
  },
  {
    id: "explorer",
    num: "02",
    name: "Explorer",
    followers: "5K–20K",
    earning: "$200–600",
    period: "/mo",
    color: "var(--tier-bronze)",
    textColor: "var(--surface-elevated)",
    borderStyle: "solid",
    levelUp: "Ten verified visits in any rolling 60-day window.",
    badge: "badge-bronze",
  },
  {
    id: "operator",
    num: "03",
    name: "Operator",
    followers: "20K–50K",
    earning: "$600–1,500",
    period: "/mo",
    color: "var(--tier-steel)",
    textColor: "var(--surface-elevated)",
    borderStyle: "solid",
    levelUp: "Hold a 4.2+ score across 25 visits.",
    badge: "badge-steel",
  },
  {
    id: "proven",
    num: "04",
    name: "Proven",
    followers: "50K–150K",
    earning: "$1,500–4K",
    period: "/mo",
    color: "var(--tier-gold)",
    textColor: "var(--tier-gold-text)",
    borderStyle: "solid",
    levelUp: "50 lifetime visits, 4.5 score, an invite from Jiaming.",
    badge: "badge-gold",
  },
  {
    id: "closer",
    num: "05",
    name: "Closer",
    followers: "150K–500K",
    earning: "$4K–10K",
    period: "/mo",
    color: "var(--tier-ruby)",
    textColor: "var(--surface-elevated)",
    borderStyle: "solid",
    levelUp: "Top 5% of the roster. You skip the apply queue.",
    badge: "badge-ruby",
    shimmer: true,
  },
  {
    id: "partner",
    num: "06",
    name: "Partner",
    followers: "500K+",
    earning: "$10K+",
    period: "/mo",
    color: "var(--tier-obsidian)",
    textColor: "var(--surface-elevated)",
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
    "I post the corner spots I already walk past. Last month $320 hit my account because people followed through. The number is the number — no inflated reach, no negotiation.",
  name: "Maya R.",
  handle: "@mayawalksnyc",
  tier: "Operator",
  badge: "badge-steel",
  location: "Bushwick, Brooklyn",
};

/* ── How to start steps ──────────────────────────────────── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Apply",
    body: "Send your handle, a couple of recent posts, and the blocks you walk. We read every application within 48 hours.",
  },
  {
    n: "02",
    title: "Get a tier + a QR",
    body: "Push assigns your starting tier and a creator-specific QR. That QR is how a scan ties back to your post.",
  },
  {
    n: "03",
    title: "Post, then get paid",
    body: "Pick a campaign that fits your block. When someone scans your QR and walks in, the visit clears and the payout lands Friday.",
  },
];

/* ── Problem/Solution data ───────────────────────────────── */
const PAIN_POINTS = [
  "Brands pay for impressions. You delivered 80K — they paid you for the post, not the people who showed up.",
  "Flat-rate sponsored fees disconnect the work from the result.",
  "No way to point at a specific visit and say: that one was mine.",
  "The week your reach drops is the week your income drops.",
];

const PUSH_SOLUTIONS = [
  "Every payout traces to one verified visit by one real person.",
  "Tier rate goes up as your verified-visit history goes up.",
  "Your dashboard shows: post → scan → visit → payout, line by line.",
  "Foot traffic is algorithm-proof. A door doesn't care about reach.",
];

/* ── Page ────────────────────────────────────────────────── */
export default function ForCreatorsPage() {
  const heroStats = [
    {
      num: "$320",
      label: "Operator-tier month",
      sub: "median, pre-pilot model",
      tint: "var(--brand-red)",
    },
    {
      num: "48h",
      label: "Reply on applications",
      sub: "every one read by hand",
      tint: "var(--champagne)",
    },
    {
      num: "06",
      label: "Tiers, Seed → Partner",
      sub: "earned on visits, not vibes",
      tint: "var(--cat-travel)",
    },
    {
      num: "100%",
      label: "Visit-verified",
      sub: "no impression fees here",
      tint: "var(--cat-fitness)",
    },
  ];

  return (
    <>
      <ScrollRevealInit />

      {/* ── 1. Hero — v7 ink + grain + vignette ────────────────── */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          paddingTop: "clamp(80px, 8vw, 120px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill (location) + eyebrow (date) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            Cohort 01 · SoHo / Tribeca / Chinatown
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Pilot opens June&nbsp;22
          </span>
        </div>

        {/* Hero center: ghost/display weight contrast */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: "1180px",
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 8vh, 96px)",
            paddingBottom: "clamp(48px, 8vh, 96px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            What we pay for
          </div>

          {/* Massive Darky 900 headline + Darky 200 ghost subline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(80px, 16vw, 240px)",
              fontWeight: 900,
              letterSpacing: "-0.08em",
              lineHeight: 0.85,
              color: "#fff",
              margin: 0,
            }}
          >
            Walks
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.04em",
              }}
            >
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(48px, 9.5vw, 148px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            not impressions
          </div>

          <p
            style={{
              marginTop: "clamp(32px, 5vw, 56px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.74)",
            }}
          >
            You post about a corner spot. Someone who saw it walks in. The spot
            pays per verified visit. We do the verification — the QR, the
            timestamp, the receipt match — and we pay you on Friday.
          </p>
          <p
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.46)",
            }}
          >
            Pilot opens June&nbsp;22. Seven blocks of Lower Manhattan.
            <br />
            Five anchored venues. Ten creators on the roster. One operator
            (Jiaming) walking the doors with you.
          </p>

          {/* Hero stats — color-accented borders, Darky 200 numerals */}
          <div
            style={{
              marginTop: "clamp(40px, 6vw, 72px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "clamp(16px, 3vw, 40px)",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              maxWidth: 960,
            }}
          >
            {heroStats.map((s) => (
              <div
                key={s.label}
                style={{
                  paddingLeft: 18,
                  borderLeft: `2px solid ${s.tint}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(40px, 4vw, 60px)",
                    fontWeight: 200,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "#fff",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Inline CTAs — keep apply path, no marketing-cliche copy */}
          <div
            style={{
              marginTop: "clamp(32px, 5vw, 48px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/creator/signup" className="btn btn-primary">
              Apply for the cohort
            </Link>
            <Link
              href="/demo/creator"
              className="btn btn-ghost"
              style={{
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              See the dashboard&nbsp;→
            </Link>
          </div>
          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.34)",
            }}
          >
            free to apply · keep your other deals · no exclusivity
          </p>
        </div>

        {/* Bottom: scroll indicator + category strip */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div
            className="scroll-indicator"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Scroll
          </div>
          <div style={{ flex: 1, minWidth: 240, maxWidth: 480 }}>
            <div
              className="category-strip"
              aria-hidden="true"
              style={{ marginBottom: 12 }}
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Food</span>
              <span>Stay</span>
              <span>Care</span>
              <span>Wear</span>
              <span>Sweat</span>
              <span>After-hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Problem / Solution split ──────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">The honest part</span>
            </div>
          </div>
          <div className="cr-ps-grid">
            {/* Left — Pain */}
            <div className="cr-ps-col cr-ps-pain reveal">
              <h2 className="cr-ps-headline">
                <span className="wt-900">Sponsored posts</span>
                <span className="wt-300">pay for the post.</span>
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
                <span className="wt-900">Push pays</span>
                <span className="wt-300">for the walk-in.</span>
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
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">The ladder</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Six tiers.</span>
              <span className="wt-300">One way up — verified visits.</span>
            </h2>
            <p className="split-body">
              Tier rate is your $/visit. It moves up when your verified-visit
              record moves up. Nothing else changes the math.
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
                    {t.name}
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
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How it starts</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Three steps.</span>
              <span className="wt-300">Then you're on the roster.</span>
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
              <span className="section-tag-num">05</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Run your numbers</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">What it pays,</span>
              <span className="wt-300">in your shoes.</span>
            </h2>
            <p className="split-body">
              Slide the inputs. Bands come from the v6 per-verified-visit model
              — the pilot replaces these with measured rates on June 22.
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
                  {TESTIMONIAL.tier}
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
              Cohort 01 · ten seats
            </p>
            <h2 className="cr-cta-headline">
              June 22.
              <span className="cr-cta-sub">
                Seven blocks. Ten creators. One operator at the door.
              </span>
            </h2>
            <p className="cr-cta-body">
              Pilot opens in SoHo, Tribeca, and Chinatown. We read every
              application within 48 hours. No exclusivity, no minimum posts —
              just a tier rate that moves with your verified-visit record.
            </p>
            <div className="cr-cta-actions">
              <Link href="/creator/signup" className="btn btn-primary">
                Apply for the cohort
              </Link>
              <Link href="/for-merchants" className="btn btn-ghost cr-ghost">
                Run a venue?&nbsp;→
              </Link>
            </div>
            <p className="cr-cta-note">
              Seed has no follower minimum · We pay on Friday via Stripe
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
