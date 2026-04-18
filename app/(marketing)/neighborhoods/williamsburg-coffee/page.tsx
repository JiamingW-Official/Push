import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "../../landing.css";
import "./williamsburg-coffee.css";

export const metadata: Metadata = {
  title:
    "Williamsburg Coffee Pilot — Customer acquisition for local coffee shops | Push",
  description:
    "Push is an AI-powered customer acquisition agency. Williamsburg coffee × 60-day beachhead — first 10 merchants get a $0 pilot. AI verifies every customer. Pay only for who walks in.",
  alternates: {
    canonical: "/neighborhoods/williamsburg-coffee",
  },
  openGraph: {
    title: "Williamsburg Coffee × Push — $0 Pilot, first 10 merchants",
    description:
      "AI matches local creators. Claude Vision verifies every receipt. Pay only for AI-verified customers.",
    type: "article",
  },
};

/* ── Pilot merchant cohort ──────────────────────────────────── */
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
  {
    name: "Toby's Estate",
    zip: "11211",
    block: "N 6th & Bedford",
    note: "Australian third-wave, dedicated brew bar",
  },
];

/* ── Local operator network ─────────────────────────────────── */
const OPERATORS = [
  {
    handle: "@maya.eats.nyc",
    tier: "Steel",
    color: "#4a5568",
    txt: "#ffffff",
    score: 94,
    focus: "Morning coffee routines, Bedford Ave coverage",
    last90: "14 verified conversions",
  },
  {
    handle: "@brooklyn_bites",
    tier: "Gold",
    color: "#c9a96e",
    txt: "#003049",
    score: 91,
    focus: "Third-wave espresso, pour-over geekery",
    last90: "18 verified conversions",
  },
  {
    handle: "@williamsburg.e",
    tier: "Steel",
    color: "#4a5568",
    txt: "#ffffff",
    score: 89,
    focus: "Neighborhood anchor, 11211 locals",
    last90: "10 verified conversions",
  },
  {
    handle: "@coffee.crawl",
    tier: "Bronze",
    color: "#8c6239",
    txt: "#ffffff",
    score: 86,
    focus: "Cold-brew saturation + walk-through reels",
    last90: "8 verified conversions",
  },
];

/* ── Pilot case studies ─────────────────────────────────────── */
const CASES = [
  {
    shop: "Sey Coffee",
    campaign: "Williamsburg morning rush — week 2",
    matched: 5,
    customers: 22,
    cost: "$440",
    roi: "3.2×",
    window: "April 14 – April 20",
  },
  {
    shop: "Partners Coffee",
    campaign: "Partners × Williamsburg ambassador",
    matched: 4,
    customers: 18,
    cost: "$360",
    roi: "2.9×",
    window: "April 10 – April 17",
  },
  {
    shop: "Variety Coffee",
    campaign: "Cold-brew push — Williamsburg",
    matched: 3,
    customers: 14,
    cost: "$280",
    roi: "3.1×",
    window: "April 12 – April 18",
  },
];

/* ── Stats band ─────────────────────────────────────────────── */
const STATS = [
  { n: "6", l: "Coffee shops in cohort" },
  { n: "20", l: "Operators in network" },
  { n: "54", l: "AI-verified customers (wk 1)" },
  { n: "60", l: "Days to saturation" },
];

export default function WilliamsburgCoffeePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Push — Williamsburg Coffee Customer Acquisition Pilot",
    description:
      "AI-powered customer acquisition agency for Williamsburg coffee shops. $0 Pilot for the first 10 merchants.",
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
      name: "$0 Pilot for first 10 Williamsburg coffee merchants",
      description:
        "First 10 AI-verified customers free. If the AI can't deliver, you don't pay.",
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
              Williamsburg × Coffee · Push Beachhead Q2 2026
            </span>
          </div>

          <h1 id="wbc-h" className="wbc-hero-h">
            <span className="wbc-hero-l1">
              <span className="wbc-hero-conn">Built for</span>{" "}
              <span className="wbc-hero-key">coffee,</span>
            </span>
            <span className="wbc-hero-l2">
              <span className="wbc-hero-conn">saturated in</span>{" "}
              <em className="wbc-hero-accent">Williamsburg.</em>
            </span>
          </h1>

          <p className="wbc-hero-sub">
            Push is running a 60-day customer acquisition pilot across
            Williamsburg coffee shops. AI matches local creators, Claude Vision
            verifies every receipt, and you pay only for customers who walk
            through your door. First 10 merchants get $0 Pilot.
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
            Six shops in the pilot.{" "}
            <span className="wbc-section-h-light">Four slots open.</span>
          </h2>

          <p className="wbc-section-sub reveal">
            The first ten Williamsburg coffee merchants to apply run on a $0
            pilot. First ten AI-verified customers are free. After that, you
            move to $500/mo min + $40/customer.
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
              </div>
            ))}

            <div className="wbc-cohort-card wbc-cohort-card--open reveal">
              <span className="wbc-cohort-zip">Open</span>
              <h3 className="wbc-cohort-name">+ 4 slots</h3>
              <p className="wbc-cohort-block">Your shop here</p>
              <p className="wbc-cohort-note">
                First 10 merchants in the 11211 / 11206 / 11249 pilot zone.
              </p>
              <Link href="/merchant/pilot" className="wbc-cohort-apply">
                Apply &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATOR NETWORK ────────────────────────────────── */}
      <section className="wbc-section wbc-section--dark">
        <div className="container">
          <div className="wbc-section-tag wbc-section-tag--w reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Operator network</span>
          </div>

          <h2 className="wbc-section-h wbc-section-h--w reveal">
            Twenty local operators.{" "}
            <span className="wbc-section-h-light wbc-section-h-light--w">
              The agent schedules them.
            </span>
          </h2>

          <p className="wbc-section-sub wbc-section-sub--w reveal">
            Our creator network in Williamsburg is AI-managed. You do not pick
            creators. You tell the agent your goal; Claude routes the right
            operators to your shop based on tier, category affinity, and
            verified conversion history.
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
            <span className="section-tag-label">Case studies</span>
          </div>

          <h2 className="wbc-section-h reveal">
            Weekly results from the pilot.
          </h2>

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
                    <dt>AI-verified customers</dt>
                    <dd>{c.customers}</dd>
                  </div>
                  <div>
                    <dt>Cost @ $40 / customer</dt>
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
              Williamsburg Coffee × Push · Pilot applications open
            </span>
            <span className="rule rule--w" />
          </div>
          <h2 className="wbc-cta-h">
            Four slots left in the <em className="wbc-cta-h-em">first ten.</em>
          </h2>
          <p className="wbc-cta-body">
            If the AI can&apos;t deliver, you don&apos;t pay. The pilot is free
            &mdash; we absorb the acquisition cost for the first ten verified
            customers.
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
