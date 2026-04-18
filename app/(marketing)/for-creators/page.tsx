"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./creators.css";

/* ==================================================================
   FOR CREATORS — v5.1 Recruitment Decision Page
   Push = Vertical AI for Local Commerce. Customer Acquisition Engine.
   Two-Segment Creator Economics: T1–T3 per-verified-customer /
   T4–T6 retainer + performance + rev-share + equity.
   ================================================================== */

/* ── EarningsCalculator data ─────────────────────────────── */
type Segment = "per-customer" | "retainer";

type TierRate = {
  segment: Segment;
  label: string;
  range: string;
  base?: number;
  perCustomer: number;
  revShare?: number;
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
          Start free &mdash; no follower minimum
        </Link>
      </div>
    </div>
  );
}

/* ── Two-Segment split-hero data ─────────────────────────── */
const SEGMENTS = [
  {
    id: "side",
    tag: "Side income",
    range: "T1 – T3",
    bigLabel: "$12 – $20",
    unit: "/ verified customer",
    tagline: "Post. Verify. Get paid within 48 hours.",
    bullets: [
      "5K–50K followers is the sweet spot — no minimum to start",
      "Vertical-matched rates: coffee $12 · coffee+ $20 · dessert $18",
      "Milestone bumps: 30 / 40 / 60 / 80 verified txn lifts pay to $15 / $30 / $50 / $80",
    ],
    cta: "Start side-income",
    segmentParam: "side",
    accent: "var(--tertiary)",
  },
  {
    id: "pro",
    tag: "Professional",
    range: "T4 – T6",
    bigLabel: "$800 – $3,500",
    unit: "/ mo retainer + perf + equity",
    tagline: "Retainer + per-customer perf + rev-share + equity.",
    bullets: [
      "30K+ followers or proven T3 Operator track record to qualify",
      "$800 Gold → $1,800 Ruby (+15% rev-share) → $3,500 Obsidian (+20% + equity)",
      "Partner tier unlocks 0.05–0.2% equity pool (lock-up)",
    ],
    cta: "Apply Professional",
    segmentParam: "pro",
    accent: "var(--champagne)",
  },
];

/* ── Tier journey — 6 nodes ──────────────────────────────── */
const TIER_JOURNEY = [
  {
    num: "01",
    name: "Seed",
    material: "Clay",
    pay: "$12/cust",
    color: "var(--tier-clay)",
  },
  {
    num: "02",
    name: "Explorer",
    material: "Bronze",
    pay: "$15/cust",
    color: "var(--tier-bronze)",
  },
  {
    num: "03",
    name: "Operator",
    material: "Steel",
    pay: "$20/cust",
    color: "var(--tier-steel)",
  },
  {
    num: "04",
    name: "Proven",
    material: "Gold",
    pay: "$800 + $25",
    color: "var(--tier-gold)",
  },
  {
    num: "05",
    name: "Closer",
    material: "Ruby",
    pay: "$1.8K + 15%",
    color: "var(--tier-ruby)",
  },
  {
    num: "06",
    name: "Partner",
    material: "Obsidian",
    pay: "$3.5K + equity",
    color: "var(--tier-obsidian)",
    pulse: true,
  },
];

/* ── How it works — 4 steps ──────────────────────────────── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Sign up",
    body: "Submit your profile — ConversionOracle™ predicts your per-vertical conversion rate in 48 hours. No human gatekeeping, no exclusivity.",
  },
  {
    n: "02",
    title: "Visit a shop",
    body: "We match you to Williamsburg Coffee+ and other local merchants near you. CreatorGPT drafts the brief, you walk in on your schedule.",
  },
  {
    n: "03",
    title: "Post + scan receipt",
    body: "Shoot content on any platform. Scan a verified customer's QR receipt — DisclosureBot auto-adds FTC disclosures at the platform layer.",
  },
  {
    n: "04",
    title: "Get paid verified",
    body: "3-layer verification (QR + Claude Vision OCR + geo) confirms the walk-in. Stripe payout hits in 48 hours — industry standard is 30–60 days.",
  },
];

/* ── Creator testimonials — 3-card row ───────────────────── */
const TESTIMONIALS = [
  {
    handle: "@maya.eats.nyc",
    name: "Maya R.",
    tier: "Operator",
    material: "Steel",
    color: "var(--tier-steel)",
    badge: "badge-steel",
    initial: "M",
    quote:
      "I made more in a month posting Williamsburg cafes than six months of TikTok sponsorships. Pay shows up 48 hours after I scan the receipt.",
    stat: "$820 / mo",
    statLabel: "41 verified coffee customers",
  },
  {
    handle: "@brooklyn_bites",
    name: "Jordan L.",
    tier: "Operator",
    material: "Steel",
    color: "var(--tier-steel)",
    badge: "badge-steel",
    initial: "J",
    quote:
      "ConversionOracle matches me to shops that fit my audience. I don't chase brands — the agent brings me campaigns that actually convert.",
    stat: "$640 / mo",
    statLabel: "32 verified customers",
  },
  {
    handle: "@nyc.specialty",
    name: "Priya S.",
    tier: "Proven",
    material: "Gold",
    color: "var(--tier-gold)",
    badge: "badge-gold",
    initial: "P",
    quote:
      "Hitting Proven means a $800 retainer every month on top of per-customer perf. DisclosureBot handles FTC so I never stress about #ad tags.",
    stat: "$1,625 / mo",
    statLabel: "$800 retainer + 33 customers",
  },
];

/* ── Trust — ConversionOracle guardrails ─────────────────── */
const TRUST = [
  {
    icon: "check",
    title: "Paid only for verified visits",
    body: "ConversionOracle™ cross-checks QR receipt + Claude Vision OCR + geo match. No verification, no pay — which means every dollar is earned.",
  },
  {
    icon: "shield",
    title: "DisclosureBot auto-adds FTC tags",
    body: "We auto-inject #ad / #sponsored at the platform layer before the post goes live. You never carry FTC liability.",
  },
  {
    icon: "globe",
    title: "No exclusivity — post on any platform",
    body: "TikTok, Instagram, YouTube, Twitter — your audience, your channel. Tier label is portable, your ConversionOracle context moves with you.",
  },
];

/* ── FAQ ─────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Do I need followers to start?",
    a: "No minimum. Seed · Clay tier opens at 5K followers but Push evaluates content quality, niche fit, and ZIP coverage — not raw follower count. ConversionOracle predicts your conversion rate, which is what actually determines earnings.",
  },
  {
    q: "When do I get paid?",
    a: "48 hours after a verified customer scan. Stripe transfers land in your bank ~2 business days later. Industry standard is 30–60 days — Push pays 15× faster because ConversionOracle verifies in real time.",
  },
  {
    q: "Can I be active in two cities?",
    a: "Yes. Tier status is portable across all Push neighborhoods. ConversionOracle re-ranks you per ZIP based on local performance — strong signal in Williamsburg doesn't automatically transfer to LA, but your global tier does.",
  },
  {
    q: "What if my post gets rejected?",
    a: "DisclosureBot pre-screens every draft for FTC compliance before publish. If ConversionOracle later flags a verification issue (missing QR, geo mismatch, OCR fail), you get one free revise window. Repeat violations affect tier routing, not earnings on verified customers already in your ledger.",
  },
  {
    q: "How does tier promotion work?",
    a: "Driven by verified-customer milestones, not vanity metrics. Seed → Explorer: 5 verified customers in 30 days. Explorer → Operator: 15 in rolling 60 days. Operator → Proven: 50 lifetime + 4.5 ConversionOracle score + Push invite. T5+ is invite-only.",
  },
];

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */
export default function ForCreatorsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <ScrollRevealInit />

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="cr-hero">
        <div className="container cr-hero-inner">
          <div className="cr-hero-content">
            <p className="eyebrow cr-eyebrow">For Creators</p>
            <h1 className="cr-headline">
              <span className="cr-black">Get paid for customers</span>
              <span className="cr-light">you actually brought.</span>
            </h1>
            <p className="cr-sub">
              Push is Vertical AI for Local Commerce — the Customer Acquisition
              Engine for neighborhood merchants. Two-Segment Creator Economics:
              no follower minimum, verified-only pay, 48-hour payout. Post on
              any platform, walk into any partner shop, scan one receipt.
              That&apos;s the job.
            </p>
            <div className="cr-ctas">
              <Link href="/creator/signup" className="btn btn-primary">
                Start free
              </Link>
              <a href="#calc" className="btn btn-ghost cr-ghost">
                See earnings math &rarr;
              </a>
            </div>
            <p className="cr-reassure">
              5K+ followers welcome &middot; Verified-only pay &middot; No
              exclusivity
            </p>
          </div>

          <div className="cr-hero-stats">
            {[
              {
                num: "40+",
                label: "Creators earning now",
                sub: "Williamsburg Coffee+ beachhead live",
              },
              {
                num: "48h",
                label: "Payout after verify",
                sub: "Industry: 30–60 days",
              },
              {
                num: "$12–$85",
                label: "Per verified customer",
                sub: "Vertical-matched T1–T3 rates",
              },
              {
                num: "0",
                label: "FTC liability for you",
                sub: "DisclosureBot handles disclosures",
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

      {/* ── 2. TWO-SEGMENT SPLIT-HERO ───────────────────────── */}
      <section className="section section-bright cr-segments-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">01</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">
                Two-Segment Creator Economics
              </span>
            </div>
            <h2 className="split-headline cr-segments-headline">
              <span className="wt-900">Pick your lane.</span>
              <span className="wt-300">Both pay for real customers.</span>
            </h2>
          </div>

          <div className="cr-segments-grid">
            {SEGMENTS.map((seg, i) => (
              <Link
                key={seg.id}
                href={`/creator/signup?segment=${seg.segmentParam}`}
                className="cr-seg-card reveal"
                style={{
                  transitionDelay: `${i * 120}ms`,
                  ["--seg-accent" as string]: seg.accent,
                }}
              >
                <div className="cr-seg-top">
                  <span className="cr-seg-tag">{seg.tag}</span>
                  <span className="cr-seg-range">{seg.range}</span>
                </div>
                <div className="cr-seg-number">
                  <span className="cr-seg-big">{seg.bigLabel}</span>
                  <span className="cr-seg-unit">{seg.unit}</span>
                </div>
                <p className="cr-seg-tagline">{seg.tagline}</p>
                <ul className="cr-seg-bullets">
                  {seg.bullets.map((b) => (
                    <li key={b} className="cr-seg-bullet">
                      <span className="cr-seg-dash" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <span className="cr-seg-cta">
                  {seg.cta} <span className="cr-seg-arrow">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. EARNINGS CALCULATOR ──────────────────────────── */}
      <section id="calc" className="section section-warm cr-calc-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Earnings Calculator</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Run your own math.</span>
              <span className="wt-300">Rates are live, not marketing.</span>
            </h2>
            <p className="split-body">
              Pick a tier, slide to your realistic verified-customer volume.
              ConversionOracle™ decides the number, not your inbox.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* ── 4. TIER JOURNEY RAIL ────────────────────────────── */}
      <section className="section section-bright cr-journey-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Tier Journey</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Six tiers.</span>
              <span className="wt-300">
                One path — driven by verified customers.
              </span>
            </h2>
          </div>

          <div className="cr-journey-rail reveal">
            <div className="cr-journey-track" aria-hidden="true" />
            <div className="cr-journey-nodes">
              {TIER_JOURNEY.map((t, i) => (
                <div
                  key={t.num}
                  className="cr-journey-node"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span
                    className={`cr-journey-square ${t.pulse ? "cr-journey-square--pulse" : ""}`}
                    style={{ background: t.color }}
                  >
                    <span className="cr-journey-square-num">{t.num}</span>
                  </span>
                  <span className="cr-journey-label">
                    <span className="cr-journey-mat">{t.material}</span>
                    <span className="cr-journey-name">{t.name}</span>
                  </span>
                  <span className="cr-journey-pay">{t.pay}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ─────────────────────────────────── */}
      <section className="section section-warm">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How it works</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Four steps.</span>
              <span className="wt-300">Then you&apos;re earning.</span>
            </h2>
          </div>

          <div className="cr-how-grid cr-how-grid--4">
            {HOW_STEPS.map((step, i) => (
              <div
                key={step.n}
                className="cr-how-step reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="cr-how-n">{step.n}</span>
                <h3 className="cr-how-title">{step.title}</h3>
                <p className="cr-how-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CREATOR TESTIMONIALS ─────────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">05</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Creators in the network</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Real creators.</span>
              <span className="wt-300">Real verified earnings.</span>
            </h2>
          </div>

          <div className="cr-tmy-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.handle}
                className="cr-tmy-card reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="cr-tmy-top">
                  <span
                    className="cr-tmy-avatar"
                    style={{ borderColor: t.color, color: t.color }}
                  >
                    {t.initial}
                  </span>
                  <div className="cr-tmy-who">
                    <span className="cr-tmy-handle">{t.handle}</span>
                    <span className={`cr-tier-badge ${t.badge}`}>
                      {t.material} &middot; {t.tier}
                    </span>
                  </div>
                </div>
                <blockquote className="cr-tmy-quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="cr-tmy-stat">
                  <span className="cr-tmy-stat-num" style={{ color: t.color }}>
                    {t.stat}
                  </span>
                  <span className="cr-tmy-stat-label">{t.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CONVERSIONORACLE TRUST ───────────────────────── */}
      <section className="section section-warm">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">06</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">
                ConversionOracle™ guardrails
              </span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Trust isn&apos;t a tagline.</span>
              <span className="wt-300">It&apos;s the verification stack.</span>
            </h2>
          </div>

          <div className="cr-trust-grid">
            {TRUST.map((t, i) => (
              <div
                key={t.title}
                className="cr-trust-card reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="cr-trust-icon" aria-hidden="true">
                  {t.icon === "check" && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 9.5L7 13.5L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </svg>
                  )}
                  {t.icon === "shield" && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 2L3 4V9C3 12.5 5.5 15.5 9 16.5C12.5 15.5 15 12.5 15 9V4L9 2Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  )}
                  {t.icon === "globe" && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle
                        cx="9"
                        cy="9"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M2 9H16M9 2C11 4 11.5 9 9 16M9 2C7 4 6.5 9 9 16"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  )}
                </span>
                <h3 className="cr-trust-title">{t.title}</h3>
                <p className="cr-trust-body">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────── */}
      <section className="section section-bright" id="faq">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">07</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">FAQ</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Straight answers.</span>
              <span className="wt-300">No startup fluff.</span>
            </h2>
          </div>

          <div className="cr-faq-wrap reveal">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className={`cr-faq-item ${open ? "cr-faq-item--open" : ""}`}
                >
                  <button
                    className="cr-faq-q"
                    onClick={() => setOpenFaq(open ? null : i)}
                    type="button"
                    aria-expanded={open}
                  >
                    <span className="cr-faq-q-text">{item.q}</span>
                    <span className="cr-faq-q-icon" aria-hidden="true">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                  <div className="cr-faq-a" hidden={!open}>
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ────────────────────────────────────── */}
      <section className="cr-final-cta section-warm">
        <div className="container">
          <div className="cr-cta-inner reveal">
            <p className="eyebrow" style={{ color: "var(--tertiary)" }}>
              Applications open
            </p>
            <h2 className="cr-cta-headline">
              Start free.
              <span className="cr-cta-sub">
                40+ creators already earning on Push.
              </span>
            </h2>
            <p className="cr-cta-body">
              Williamsburg Coffee+ is live. ConversionOracle™ is matching now.
              T1–T3 opens day one. T4 Proven activates at 50 lifetime verified
              customers. T6 Partner is invite-only — but you can look at the
              math.
            </p>
            <div className="cr-cta-actions">
              <Link href="/creator/signup" className="btn btn-primary">
                Start free &mdash; no follower minimum
              </Link>
              <a href="#calc" className="btn btn-ghost cr-ghost">
                See Partner tier math &rarr;
              </a>
            </div>
            <p className="cr-cta-note">
              Free forever &middot; 48-hour Stripe payout on verified customers
              &middot; Tier label portable across cities
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
