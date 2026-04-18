import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "../../landing.css";
import "./williamsburg-coffee.css";

export const metadata: Metadata = {
  title: "Williamsburg Coffee+ Pilot — Vertical AI for Local Commerce | Push",
  description:
    "Push is Vertical AI for Local Commerce. Williamsburg Coffee+ × 60-day beachhead — first 10 merchants get $0 Pilot, first 10 AI-verified customers free. ConversionOracle predicts, Claude Vision verifies.",
  alternates: {
    canonical: "/neighborhoods/williamsburg-coffee",
  },
  openGraph: {
    title: "Williamsburg Coffee+ × Push — $0 Pilot, 5 slots remain",
    description:
      "Vertical AI for Local Commerce. ConversionOracle predicts. Claude Vision verifies every receipt. Pay only for AI-verified customers.",
    type: "article",
  },
};

/* ── Pilot merchant cohort — v5.1: 10 cap, 5 filled + 5 open ── */
const COHORT_SHOPS = [
  {
    name: "Sey Coffee",
    zip: "11211",
    block: "Wythe & N 3rd",
    note: "Single-origin pour-over, large window seating",
  },
  {
    name: "Devocion",
    zip: "11211",
    block: "Grand & Havemeyer",
    note: "Farm-direct Colombian, roastery storefront",
  },
  {
    name: "Partners Coffee",
    zip: "11249",
    block: "N 7th & Berry",
    note: "Morning espresso rush, Williamsburg flagship",
  },
  {
    name: "Variety Coffee",
    zip: "11206",
    block: "Graham & Moore",
    note: "Cold-brew destination, East Williamsburg",
  },
  {
    name: "Stumptown Williamsburg",
    zip: "11211",
    block: "Wythe Hotel lobby",
    note: "All-day cafe + wholesale roasts",
  },
];

/* ── Two-Segment Creator Economics: 3 T1-T3 cards + 1 T5 card ── */
const OPERATORS = [
  {
    handle: "@maya.eats.nyc",
    tier: "T2 Steel",
    color: "#4a5568",
    txt: "#ffffff",
    score: 94,
    focus: "Morning coffee + bakery pairings, Bedford Ave coverage",
    last90: "14 verified conversions · $25/customer",
  },
  {
    handle: "@brooklyn_bites",
    tier: "T3 Gold",
    color: "#c9a96e",
    txt: "#003049",
    score: 91,
    focus: "Third-wave espresso + brunch menus, pour-over geekery",
    last90: "18 verified conversions · $25/customer",
  },
  {
    handle: "@williamsburg.e",
    tier: "T1 Bronze",
    color: "#8c6239",
    txt: "#ffffff",
    score: 86,
    focus: "Neighborhood anchor, 11211 Coffee+ locals",
    last90: "10 verified conversions · $25/customer",
  },
  {
    handle: "@coffee.crawl.nyc",
    tier: "T5 Closer",
    color: "#780000",
    txt: "#ffffff",
    score: 97,
    focus:
      "Retainer-backed closer. $1,800/mo + $40/customer + 15% referral rev-share + 0.02% equity pool",
    last90: "42 verified conversions · multi-merchant owner",
  },
];

/* ── Pilot case studies — v5.1: $25/customer, Oracle predicted vs actual ── */
const CASES = [
  {
    shop: "Sey Coffee",
    campaign: "Williamsburg Coffee+ morning rush — week 2",
    matched: 5,
    predicted: 20,
    customers: 22,
    cost: "$550",
    roi: "3.2×",
    window: "April 14 – April 20",
  },
  {
    shop: "Partners Coffee",
    campaign: "Partners × Williamsburg Coffee+ ambassador",
    matched: 4,
    predicted: 16,
    customers: 18,
    cost: "$450",
    roi: "2.9×",
    window: "April 10 – April 17",
  },
  {
    shop: "Variety Coffee",
    campaign: "Cold-brew + pastry push — Williamsburg Coffee+",
    matched: 3,
    predicted: 13,
    customers: 14,
    cost: "$350",
    roi: "3.1×",
    window: "April 12 – April 18",
  },
];

/* ── Stats band — v5.1 numbers ──────────────────────────── */
const STATS = [
  { n: "10", l: "Coffee+ pilot cap (5 filled)" },
  { n: "20", l: "Operators in network" },
  { n: "54", l: "AI-verified customers (wk 1)" },
  { n: "60", l: "Days to saturation" },
];

export default function WilliamsburgCoffeePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Push — Williamsburg Coffee+ Pilot",
    description:
      "Vertical AI for Local Commerce. Williamsburg Coffee+ 60-day beachhead pilot. ConversionOracle predicts customer flow, Claude Vision verifies receipts, and merchants pay only for AI-verified customers. First 10 AI-verified customers free per merchant.",
    areaServed: {
      "@type": "City",
      name: "Brooklyn",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Williamsburg",
      },
    },
    provider: {
      "@type": "Organization",
      name: "Push",
      url: "https://push-six-flax.vercel.app",
    },
    offers: {
      "@type": "Offer",
      name: "$0 Pilot for first 10 Williamsburg Coffee+ merchants",
      description:
        "First 10 AI-verified customers free per merchant. Per-neighborhood Pilot cost capped at $4,200. If the AI can't deliver, you don't pay.",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        price: "0",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollRevealInit />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="wbc-hero" aria-labelledby="wbc-h">
        <div className="container wbc-hero-inner">
          <div className="wbc-hero-label">
            <span className="rule" />
            <span className="eyebrow wbc-hero-eyebrow">
              Williamsburg Coffee+ · Vertical AI for Local Commerce · Q2 2026
            </span>
          </div>

          <h1 id="wbc-h" className="wbc-hero-h">
            <span className="wbc-hero-l1">
              <span className="wbc-hero-conn">Built for</span>{" "}
              <span className="wbc-hero-key">Coffee+,</span>
            </span>
            <span className="wbc-hero-l2">
              <span className="wbc-hero-conn">saturated in</span>{" "}
              <em className="wbc-hero-accent">Williamsburg.</em>
            </span>
          </h1>

          <p className="wbc-hero-sub">
            Push is Vertical AI for Local Commerce. Coffee+ covers specialty
            coffee shops with bakery and brunch items — AOV $8-20, ~200
            merchants in our Williamsburg beachhead. ConversionOracle™ predicts
            customer flow before you commit. Claude Vision verifies every
            receipt. You pay only for customers who walk through your door.
            First 10 AI-verified customers free per merchant.
          </p>

          <div className="wbc-hero-ctas">
            <Link href="/merchant/pilot" className="btn-fill">
              Apply for $0 Pilot
            </Link>
            <Link href="#cohort" className="btn-outline-light">
              See the cohort
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────── */}
      <section className="wbc-stats">
        <div className="container wbc-stats-inner">
          {STATS.map((s, i) => (
            <div
              key={s.l}
              className="wbc-stat reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="wbc-stat-n">{s.n}</span>
              <span className="wbc-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── COHORT SHOPS ────────────────────────────────────── */}
      <section id="cohort" className="wbc-section">
        <div className="container">
          <div className="wbc-section-tag reveal">
            <span className="section-tag-num">01</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Pilot cohort</span>
          </div>

          <h2 className="wbc-section-h reveal">
            Ten-shop Coffee+ cap.{" "}
            <span className="wbc-section-h-light">
              Five filled, five remain.
            </span>
          </h2>

          <p className="wbc-section-sub reveal">
            First 5 Pre-Pilot LOI signed · 5 slots remain in next 14 days. First
            10 AI-verified customers free per merchant. After the pilot, Coffee+
            pricing is $500/mo min + $25/customer, with Retention Add-on $8 / $6
            / $4. Per-neighborhood Pilot cost cap: $4,200.
          </p>

          <div className="wbc-cohort-grid">
            {COHORT_SHOPS.map((s, i) => (
              <div
                key={s.name}
                className="wbc-cohort-card reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="wbc-cohort-head">
                  <h3 className="wbc-cohort-name">{s.name}</h3>
                  <span className="wbc-cohort-zip">{s.zip}</span>
                </div>
                <p className="wbc-cohort-block">{s.block}</p>
                <p className="wbc-cohort-note">{s.note}</p>
                <span className="wbc-cohort-status">LOI signed</span>
              </div>
            ))}

            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`open-${i}`}
                className="wbc-cohort-card wbc-cohort-card--open reveal"
                style={{
                  transitionDelay: `${(COHORT_SHOPS.length + i) * 60}ms`,
                }}
              >
                <div className="wbc-cohort-head">
                  <h3 className="wbc-cohort-name">Slot {i + 6}</h3>
                  <span className="wbc-cohort-zip">Open</span>
                </div>
                <p className="wbc-cohort-block">Your Coffee+ shop here</p>
                <p className="wbc-cohort-note">
                  5 slots remain in next 14 days. 11211 / 11206 / 11249 pilot
                  zone.
                </p>
                <Link href="/merchant/pilot" className="wbc-cohort-apply">
                  Apply &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* ── Neighborhood Playbook callout ─────────────── */}
          <div className="wbc-playbook reveal">
            <div className="wbc-playbook-tag">Neighborhood Playbook</div>
            <p className="wbc-playbook-body">
              Williamsburg Coffee+ is <strong>Template 0</strong>. Our expansion
              is Neighborhood Playbook units — Greenpoint, Bushwick, Brooklyn
              Heights, LES, Nolita, Astoria — at a target 5.1-month payback per
              neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* ── OPERATOR NETWORK ────────────────────────────────── */}
      <section className="wbc-section wbc-section--dark">
        <div className="container">
          <div className="wbc-section-tag wbc-section-tag--w reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">
              Two-Segment Creator Economics
            </span>
          </div>

          <h2 className="wbc-section-h wbc-section-h--w reveal">
            Twenty local operators.{" "}
            <span className="wbc-section-h-light wbc-section-h-light--w">
              T1–T3 volume + T5 Closer retainers.
            </span>
          </h2>

          <p className="wbc-section-sub wbc-section-sub--w reveal">
            Push runs Two-Segment Creator Economics. T1–T3 operators earn
            per-customer on verified conversions; T5 Closers sit on retainer
            with equity. You do not pick creators — Claude routes them based on
            tier, category affinity, and verified conversion history. Our{" "}
            <strong>Software Leverage Ratio (SLR)</strong> expands as the agent
            handles more dispatch per human hour.
          </p>

          <div className="wbc-operators">
            {OPERATORS.map((op, i) => (
              <div
                key={op.handle}
                className="wbc-operator-card reveal"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="wbc-operator-head">
                  <span
                    className="wbc-operator-dot"
                    style={{ background: op.color }}
                    aria-hidden="true"
                  />
                  <span className="wbc-operator-handle">{op.handle}</span>
                  <span
                    className="wbc-operator-tier"
                    style={{ background: op.color, color: op.txt }}
                  >
                    {op.tier}
                  </span>
                </div>
                <div className="wbc-operator-body">
                  <div className="wbc-operator-score-row">
                    <span className="wbc-operator-score">{op.score}</span>
                    <span className="wbc-operator-score-l">score</span>
                  </div>
                  <p className="wbc-operator-focus">{op.focus}</p>
                  <p className="wbc-operator-conv">{op.last90}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFICATION STRIP ──────────────────────────────── */}
      <section className="wbc-section">
        <div className="container">
          <div className="wbc-section-tag reveal">
            <span className="section-tag-num">03</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">
              How we verify every customer
            </span>
          </div>
          <h2 className="wbc-section-h reveal">
            Three layers.{" "}
            <span className="wbc-section-h-light">Under eight seconds.</span>
          </h2>
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <VerificationBadge />
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ────────────────────────────────────── */}
      <section className="wbc-section wbc-section--bright">
        <div className="container">
          <div className="wbc-section-tag reveal">
            <span className="section-tag-num">04</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">
              Case studies · ConversionOracle™
            </span>
          </div>

          <h2 className="wbc-section-h reveal">
            Predicted vs actual.{" "}
            <span className="wbc-section-h-light">Weekly pilot results.</span>
          </h2>

          <p className="wbc-section-sub reveal">
            ConversionOracle prediction: ±25% accuracy at 500 events; target
            ±15% at 5,000 events. Every Coffee+ campaign ships with a predicted
            customer count — actuals below are from the live Williamsburg pilot.
          </p>

          <div className="wbc-cases">
            {CASES.map((c, i) => (
              <article
                key={c.shop + c.window}
                className="wbc-case reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="wbc-case-head">
                  <h3 className="wbc-case-shop">{c.shop}</h3>
                  <span className="wbc-case-window">{c.window}</span>
                </div>
                <p className="wbc-case-campaign">{c.campaign}</p>
                <dl className="wbc-case-grid">
                  <div>
                    <dt>Matched operators</dt>
                    <dd>{c.matched}</dd>
                  </div>
                  <div>
                    <dt>Predicted customers vs actual</dt>
                    <dd>
                      {c.predicted} / {c.customers}
                    </dd>
                  </div>
                  <div>
                    <dt>AI-verified customers</dt>
                    <dd>{c.customers}</dd>
                  </div>
                  <div>
                    <dt>Cost @ $25 / customer</dt>
                    <dd>{c.cost}</dd>
                  </div>
                  <div>
                    <dt>Projected ROI</dt>
                    <dd>{c.roi}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="wbc-cta">
        <div className="container wbc-cta-inner">
          <div className="wbc-cta-label">
            <span className="rule rule--w" />
            <span className="eyebrow">
              Williamsburg Coffee+ Pilot · Applications open
            </span>
            <span className="rule rule--w" />
          </div>
          <h2 className="wbc-cta-h">
            Williamsburg Coffee+ Pilot —{" "}
            <em className="wbc-cta-h-em">5 slots remain.</em>
          </h2>
          <p className="wbc-cta-body">
            If the AI can&apos;t deliver, you don&apos;t pay. The pilot is free
            — we absorb the acquisition cost for your first 10 AI-verified
            customers. Per-neighborhood Pilot cost capped at $4,200.
          </p>
          <div className="wbc-cta-btns">
            <Link href="/merchant/pilot" className="btn-fill">
              Apply for $0 Pilot
            </Link>
            <Link href="/creator/signup" className="btn-outline-light">
              Join as an operator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
