"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./creators.css";

/* ── Earnings Calculator ─────────────────────────────────────
   v5.1 Two-Segment Creator Economics
   - T1–T3 (Seed Clay / Explorer Bronze / Operator Steel): pay-per-verified-customer
     using vertical base rates (coffee $12, coffee+ $20, dessert $18, fitness $48, beauty $68)
   - T4 Proven (Gold):  $800/mo retainer + $25/customer perf bonus
   - T5 Closer (Ruby):  $1,800/mo retainer + $40/customer + 15% referral rev-share
   - T6 Partner (Obsidian): $3,500/mo retainer + $60/customer + 20% referral rev-share + equity
   ─────────────────────────────────────────────────────────── */

type Segment = "per-customer" | "retainer";

type TierRate = {
  segment: Segment;
  label: string;
  range: string;
  base?: number; // monthly retainer (T4–T6)
  perCustomer: number; // per-customer bonus (all tiers use the vertical rate or bonus rate)
  revShare?: number; // % of referred merchant Push revenue (T5–T6)
  note: string;
};

const TIER_RATES: Record<string, TierRate> = {
  seed: {
    segment: "per-customer",
    label: "Seed · Clay",
    range: "5K–15K",
    perCustomer: 12,
    note: "Side-income entry. Vertical base pay per verified customer.",
  },
  explorer: {
    segment: "per-customer",
    label: "Explorer · Bronze",
    range: "15K–30K",
    perCustomer: 15,
    note: "Proven consistency. Higher-yield category access.",
  },
  operator: {
    segment: "per-customer",
    label: "Operator · Steel",
    range: "30K–50K",
    perCustomer: 20,
    note: "Cross-vertical campaigns. Priority routing inside tier.",
  },
  proven: {
    segment: "retainer",
    label: "Proven · Gold",
    range: "30K–80K",
    base: 800,
    perCustomer: 25,
    note: "Retainer + performance bonus. Merchant-pooled fund.",
  },
  closer: {
    segment: "retainer",
    label: "Closer · Ruby",
    range: "80K–250K",
    base: 1800,
    perCustomer: 40,
    revShare: 15,
    note: "Retainer + bonus + 15% rev-share on referred merchants (12-mo, $500/mo cap).",
  },
  partner: {
    segment: "retainer",
    label: "Partner · Obsidian",
    range: "250K+",
    base: 3500,
    perCustomer: 60,
    revShare: 20,
    note: "Retainer + bonus + 20% rev-share + 0.05–0.2% equity pool (lock-up).",
  },
};

function EarningsCalculator() {
  const [tier, setTier] = useState("operator");
  const [customers, setCustomers] = useState(15);

  const rate = TIER_RATES[tier];
  const base = rate.base ?? 0;
  const perf = customers * rate.perCustomer;
  const estMonthly = base + perf;

  const tiers = [
    { id: "seed", label: "Seed", range: "5–15K" },
    { id: "explorer", label: "Explorer", range: "15–30K" },
    { id: "operator", label: "Operator", range: "30–50K" },
    { id: "proven", label: "Proven", range: "30–80K" },
    { id: "closer", label: "Closer", range: "80–250K" },
    { id: "partner", label: "Partner", range: "250K+" },
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

        {/* Verified customers / month */}
        <div className="calc-field">
          <label className="calc-label">
            Verified customers / mo
            <span className="calc-val">{customers}</span>
          </label>
          <input
            type="range"
            min={1}
            max={60}
            value={customers}
            onChange={(e) => setCustomers(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>60</span>
          </div>
        </div>

        {/* Segment readout */}
        <div className="calc-field">
          <label className="calc-label">Segment</label>
          <div className="calc-segment-readout">
            {rate.segment === "per-customer" ? (
              <>
                <span className="wt-900">Per-verified-customer</span>
                <span className="wt-300">
                  ${rate.perCustomer} base · vertical-matched
                </span>
              </>
            ) : (
              <>
                <span className="wt-900">Retainer + performance</span>
                <span className="wt-300">
                  ${rate.base?.toLocaleString()}/mo base · ${rate.perCustomer}
                  /customer bonus
                  {rate.revShare ? ` · ${rate.revShare}% rev-share` : ""}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="calc-output">
        <p className="calc-output-label">
          Estimated monthly earnings{rate.revShare ? " (base + bonus)" : ""}
        </p>
        <div className="calc-output-num">
          <span className="calc-num-prefix">$</span>
          <span className="calc-num-val">{estMonthly.toLocaleString()}</span>
        </div>
        <p className="calc-output-note">
          {rate.segment === "retainer"
            ? `${rate.base?.toLocaleString()} retainer + ${customers} customer${customers !== 1 ? "s" : ""} × $${rate.perCustomer}${rate.revShare ? ` (excludes ${rate.revShare}% rev-share upside)` : ""}`
            : `${customers} customer${customers !== 1 ? "s" : ""} × $${rate.perCustomer} base (vertical rate: coffee $12 · coffee+ $20 · dessert $18 · fitness $48 · beauty $68)`}
        </p>
        <Link href="/creator/signup" className="btn btn-primary calc-cta">
          Apply now &mdash; it&apos;s free
        </Link>
      </div>
    </div>
  );
}

/* ── 6 Tier showcase data — v5.1 Two-Segment ─────────────── */
const TIERS = [
  {
    id: "seed",
    num: "01",
    name: "Seed",
    material: "Clay",
    segment: "Per-verified-customer",
    followers: "5K–15K",
    earning: "$150–400",
    period: "/mo typical",
    payline: "$12–20 / verified customer · vertical-matched",
    color: "var(--tier-clay)",
    textColor: "var(--tier-clay-text)",
    borderStyle: "dashed",
    levelUp:
      "Complete 5 verified customers — ConversionOracle unlocks Explorer routing in ~30 days.",
    badge: "badge-clay",
  },
  {
    id: "explorer",
    num: "02",
    name: "Explorer",
    material: "Bronze",
    segment: "Per-verified-customer",
    followers: "15K–30K",
    earning: "$300–600",
    period: "/mo typical",
    payline: "$15–25 / verified customer · CreatorGPT brief assist",
    color: "var(--tier-bronze)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp: "Hit 15 verified customers in a rolling 60-day window.",
    badge: "badge-bronze",
  },
  {
    id: "operator",
    num: "03",
    name: "Operator",
    material: "Steel",
    segment: "Per-verified-customer",
    followers: "30K–50K",
    earning: "$500–900",
    period: "/mo typical",
    payline: "$18–30 / verified customer · cross-vertical access",
    color: "var(--tier-steel)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp:
      "Maintain a 4.2+ ConversionOracle score across 25+ verified customers.",
    badge: "badge-steel",
  },
  {
    id: "proven",
    num: "04",
    name: "Proven",
    material: "Gold",
    segment: "Retainer + performance",
    followers: "30K–80K",
    earning: "$1,500–2,000",
    period: "/mo blended",
    payline: "$800/mo retainer + $25 / verified customer perf bonus",
    color: "var(--tier-gold)",
    textColor: "var(--tier-gold-text)",
    borderStyle: "solid",
    levelUp:
      "50+ lifetime verified customers · ConversionOracle 4.5 · invited by Push.",
    badge: "badge-gold",
  },
  {
    id: "closer",
    num: "05",
    name: "Closer",
    material: "Ruby",
    segment: "Retainer + performance + rev-share",
    followers: "80K–250K",
    earning: "$3,000",
    period: "/mo blended",
    payline:
      "$1,800/mo retainer + $40 / verified customer + 15% rev-share (12-mo, $500/mo cap)",
    color: "var(--tier-ruby)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp:
      "Top 5% ConversionOracle performer · 0.02% equity pool for top-100 Closers (4-yr vest, perf-gated).",
    badge: "badge-ruby",
    shimmer: true,
  },
  {
    id: "partner",
    num: "06",
    name: "Partner",
    material: "Obsidian",
    segment: "Retainer + performance + rev-share + equity",
    followers: "250K+",
    earning: "$5,000+",
    period: "/mo blended",
    payline:
      "$3,500/mo retainer + $60 / verified customer + 20% rev-share + 0.05–0.2% equity pool (lock-up)",
    color: "var(--tier-obsidian)",
    textColor: "#fff",
    borderStyle: "solid",
    levelUp:
      "Invite-only. Exclusive enterprise campaign access. Co-creation rights.",
    badge: "badge-obsidian",
    shimmer: true,
    pulse: true,
  },
];

/* ── Pull quote — T5 Closer voice ────────────────────────── */
const TESTIMONIAL = {
  quote:
    "I earned $3,200 last month from the Williamsburg coffee rotation — $1,800 retainer plus 35 verified customers. CreatorGPT wrote the briefs, DisclosureBot handled FTC, and payouts landed in 48 hours. My hourly rate tripled vs TikTok Creator Marketplace.",
  name: "Maya R.",
  handle: "@mayawalksnyc",
  tier: "Closer",
  material: "Ruby",
  badge: "badge-ruby",
  location: "Bushwick, Brooklyn",
};

/* ── How to start steps (v5.1) ───────────────────────────── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Apply to the network",
    body: "Submit your creator profile. ConversionOracle reviews your content, category fit, and ZIP coverage to predict your per-vertical conversion rate. You hear back within 48 hours — no human gatekeeping.",
  },
  {
    n: "02",
    title: "Get tiered + QR identity",
    body: "We place you in T1–T6 and issue your unique QR identity. T1–T3 creators earn per verified customer; T4–T6 Proven / Closer / Partner creators unlock retainer + performance + rev-share (T5+) and equity pool (T5 top-100 · T6).",
  },
  {
    n: "03",
    title: "Agent assigns — you deliver",
    body: "When a merchant tells the agent their goal, ConversionOracle ranks you by predicted conversion. CreatorGPT drafts your brief, DisclosureBot pre-screens FTC compliance, you visit and post, payout lands in 48 hours — vs industry 30–60 days.",
  },
];

/* ── Problem / Solution (v5.1) ───────────────────────────── */
const PAIN_POINTS = [
  "Brands pay upfront, you prove nothing — and get ghosted",
  "Flat-rate sponsored posts disconnect effort from income",
  "Zero visibility into whether your content actually drove visits",
  "Platform algorithms tank your reach the week you need it most",
  "FTC #ad disclosures are your legal risk — not the brand's",
];

const PUSH_SOLUTIONS = [
  "ConversionOracle predicts your per-campaign conversion rate — your earning/hour runs 2–3x Aspire / TikTok Creator Marketplace",
  "CreatorGPT auto-drafts briefs and predicts post virality — 70% less ops time",
  "DisclosureBot pre-screens every post for FTC compliance — platform-level, not your problem",
  "48-hour payout via Stripe on verified customers — industry standard is 30–60 days",
  "Foot traffic is algorithm-proof — QR + Vision OCR + geo doesn't depend on reach",
];

/* ── Creator Productivity Lock (SCOR) — new v5.1 section ── */
const SCOR = [
  {
    letter: "S",
    name: "Supply density",
    body: "50+ merchants per neighborhood rotation. 5.2 active campaigns / month vs Aspire 1.8, TikTok Creator Marketplace 0.9.",
  },
  {
    letter: "C",
    name: "Conversion-aware matching",
    body: "ConversionOracle predicts your conversion rate before the campaign, pairs you with the best-fit merchant → earning/hour 2–3x rivals.",
  },
  {
    letter: "O",
    name: "Operations leverage",
    body: "CreatorGPT auto-writes briefs + predicts virality · DisclosureBot auto-handles FTC · 48h payout (industry 30–60 days).",
  },
  {
    letter: "R",
    name: "Reputation portability",
    body: "Tier label is portable. ConversionOracle context is not — competitors can't replicate your rating without walk-in ground truth data.",
  },
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
            <p className="eyebrow cr-eyebrow">
              Push for Creators &middot; AI Agent Network
            </p>
            <h1 className="cr-headline">
              <span className="cr-black">The Vertical AI platform</span>
              <span className="cr-light">
                that matches, verifies, and pays you per customer.
              </span>
            </h1>
            <p className="cr-sub">
              Push runs Two-Segment Creator Economics: T1&ndash;T3 earn per
              verified customer at vertical-matched rates; T4&ndash;T6 unlock
              retainer + performance + rev-share + equity. ConversionOracle
              predicts your fit, CreatorGPT drafts your brief, DisclosureBot
              handles FTC compliance &mdash; and payout hits in 48 hours, not 60
              days.
            </p>
            <div className="cr-ctas">
              <Link href="/creator/signup" className="btn btn-primary">
                Apply to the network
              </Link>
              <Link href="/demo/creator" className="btn btn-ghost cr-ghost">
                See how the agent works &rarr;
              </Link>
            </div>
            <p className="cr-reassure">
              Free to join &middot; No exclusivity &middot; Tier label is
              portable, ConversionOracle context is not
            </p>
          </div>

          {/* Hero stats — v5.1 */}
          <div className="cr-hero-stats">
            {[
              {
                num: "5.2",
                label: "Active campaigns / mo",
                sub: "vs Aspire 1.8 · TikTok Creator Marketplace 0.9",
              },
              {
                num: "$3,000",
                label: "T5 Closer blended / mo",
                sub: "Retainer + performance + rev-share",
              },
              {
                num: "48h",
                label: "Payout after verification",
                sub: "Industry standard: 30–60 days",
              },
              {
                num: "100%",
                label: "AI-verified payouts",
                sub: "QR + Claude Vision OCR + geo",
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
                <span className="wt-300">
                  every payment to a verified customer.
                </span>
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

      {/* ── 3. 6 Tier showcase — Two-Segment framing ─────────── */}
      <section className="section section-warm cr-tiers-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">
                Two-Segment Creator Economics
              </span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Six tiers.</span>
              <span className="wt-300">Two segments. One clear path up.</span>
            </h2>
            <p className="split-body">
              T1&ndash;T3 (Seed Clay &middot; Explorer Bronze &middot; Operator
              Steel) earn per verified customer at vertical-matched rates.
              T4&ndash;T6 (Proven Gold &middot; Closer Ruby &middot; Partner
              Obsidian) unlock monthly retainer + performance bonus + rev-share
              + equity. You advance by driving real, verified customers &mdash;
              nothing else.
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
                    {t.material} &middot; {t.name}
                  </span>
                </div>

                <div className="cr-tier-segment">{t.segment}</div>

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

                <div className="cr-tier-payline">{t.payline}</div>

                <div className="cr-tier-levelup">
                  <span className="cr-tier-levelup-label">How to level up</span>
                  <p className="cr-tier-levelup-body">{t.levelUp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Creator Productivity Lock (SCOR) — new v5.1 ──── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">
                Creator Productivity Lock
              </span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">The SCOR framework.</span>
              <span className="wt-300">
                Four compounding reasons creators stay.
              </span>
            </h2>
            <p className="split-body">
              Your tier label is portable. Your ConversionOracle context is not.
              That&apos;s the moat.
            </p>
          </div>

          <div className="cr-how-grid">
            {SCOR.map((item, i) => (
              <div
                key={item.letter}
                className="cr-how-step reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="cr-how-n">{item.letter}</span>
                <h3 className="cr-how-title">{item.name}</h3>
                <p className="cr-how-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How to start — 3 steps ─────────────────────────── */}
      <section className="section section-warm">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How to Start</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Three steps.</span>
              <span className="wt-300">Then you&apos;re earning.</span>
            </h2>
            <p className="split-body">
              T1&ndash;T3 creators earn pay-per-verified-customer from day 1.
              T4&ndash;T6 creators unlock the retainer + performance + rev-share
              structure once ConversionOracle confirms proven results.
            </p>
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

      {/* ── 6. Earnings calculator ───────────────────────────── */}
      <section className="section section-bright cr-calc-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">05</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Earnings Calculator</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">What could you earn</span>
              <span className="wt-300">this month?</span>
            </h2>
            <p className="split-body">
              Pick your tier, set your verified-customer volume, see your
              Two-Segment payout. Rates reflect live Push vertical economics.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* ── 7. Creator testimonial — T5 Closer voice ─────────── */}
      <section className="section section-warm cr-quote-section">
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
                  {TESTIMONIAL.material} &middot; {TESTIMONIAL.tier}
                </span>
                <span className="cr-quote-loc">{TESTIMONIAL.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA — dark ──────────────────────────────── */}
      <section className="cr-final-cta section-warm">
        <div className="container">
          <div className="cr-cta-inner reveal">
            <p className="eyebrow" style={{ color: "var(--tertiary)" }}>
              Applications open now
            </p>
            <h2 className="cr-cta-headline">
              Join the AI Agent Network.
              <span className="cr-cta-sub">
                Williamsburg Coffee+ beachhead is live. ConversionOracle is
                matching now.
              </span>
            </h2>
            <p className="cr-cta-body">
              Push is Vertical AI for Local Commerce. ConversionOracle pairs you
              with best-fit merchants, CreatorGPT drafts your briefs,
              DisclosureBot handles FTC compliance at the platform layer &mdash;
              not yours. 48-hour payouts on every verified customer.
            </p>
            <div className="cr-cta-actions">
              <Link href="/creator/signup" className="btn btn-primary">
                Apply to the network &mdash; free
              </Link>
              <Link href="/for-merchants" className="btn btn-ghost cr-ghost">
                Are you a merchant? &rarr;
              </Link>
            </div>
            <p className="cr-cta-note">
              No minimum follower count for Seed tier &middot; 48-hour payout
              via Stripe on verified customers
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
