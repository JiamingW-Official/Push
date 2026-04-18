"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./merchants.css";

/* ── Pain → Lift (Vertical AI for Local Commerce) ───────────── */
const PAIN_LIFT = [
  {
    pain: "Ads burn cash with no verification",
    lift: "ConversionOracle™ auto-verifies foot traffic in <8s — every customer tied to a receipt.",
    tag: "Verification",
  },
  {
    pain: "Creator campaigns can't prove ROI",
    lift: "3-layer check (QR + Claude Vision OCR + geo) ties every walk-in to the creator who drove it.",
    tag: "Attribution",
  },
  {
    pain: "Ops time scales linearly with spend",
    lift: "Software Leverage Ratio (SLR) = active campaigns ÷ ops FTE. Month-12 target: 25.",
    tag: "Leverage",
  },
];

/* ── Process steps ──────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Tell the engine your goal",
    body: '"20 new customers this month, $500 budget, Williamsburg coffee." 60 seconds. No brief writing — Claude parses objective, budget, category, ZIP.',
  },
  {
    n: "02",
    title: "ConversionOracle™ matches + drafts brief",
    body: "The engine ranks top creators by geo, vertical fit, and verified conversion history — then writes the brief and predicts ROI per campaign.",
  },
  {
    n: "03",
    title: "Creators visit + post",
    body: "Matched creators walk in within 72 hours, post content with disclosure-compliant CTAs, and hand out scan-to-claim QR offers.",
  },
  {
    n: "04",
    title: "Claude Vision verifies — you pay only for verified",
    body: "Every scan runs QR + Claude Vision receipt OCR + geo-match in <8s. Fail any of the three layers, you don't get billed. No disputed clicks.",
  },
];

/* ── Pricing callout (mini 3-row) ───────────────────────────── */
const PRICING_ROWS = [
  {
    name: "Pilot",
    price: "$0",
    detail: "First 10 AI-verified customers free · cap $4,200/neighborhood",
    cta: "Apply for pilot",
    href: "/merchant/pilot",
    highlight: false,
  },
  {
    name: "Operator",
    price: "$500/mo min",
    detail:
      "+ $15–85/customer by vertical · Retention Add-on $8–24 · 24h dispute SLA",
    cta: "Talk to an operator",
    href: "/merchant/signup",
    highlight: true,
  },
  {
    name: "Neighborhood",
    price: "$8–12K launch",
    detail:
      "Full neighborhood Customer Acquisition Engine · $20–35K MRR by M12",
    cta: "Request a call",
    href: "/contact",
    highlight: false,
  },
];

/* ── JSON-LD (Service) ──────────────────────────────────────── */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Push — Customer Acquisition Engine for Coffee+ merchants",
  provider: {
    "@type": "Organization",
    name: "Push",
    url: "https://pushagent.app",
    description:
      "Vertical AI for Local Commerce — delivers AI-verified foot traffic to Coffee+ merchants in NYC.",
  },
  serviceType: "Customer Acquisition Engine",
  areaServed: {
    "@type": "City",
    name: "New York City",
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Coffee+ merchants (specialty coffee, bakery, cafe)",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Pilot",
      price: "0",
      priceCurrency: "USD",
      description: "First 10 AI-verified customers free for first 10 merchants",
    },
    {
      "@type": "Offer",
      name: "Operator",
      priceCurrency: "USD",
      description:
        "$500/mo minimum plus $15–85 per AI-verified customer by vertical",
    },
  ],
};

export default function ForMerchantsPage() {
  /* ── ROI calculator state ─────────────────────────────────── */
  const [customers, setCustomers] = useState(20);
  const [aov, setAov] = useState(12);

  const RATE_COFFEE_PLUS = 25; // $25/customer (Coffee+)
  const LTV_MULT = 2.8; // LTV multiplier on AOV

  const calc = useMemo(() => {
    const cost = customers * RATE_COFFEE_PLUS;
    const revenue = customers * aov * LTV_MULT;
    const net = revenue - cost;
    // payback (days) ≈ cost / (revenue / 30)
    const daily = revenue / 30;
    const payback = daily > 0 ? Math.max(1, Math.round(cost / daily)) : 0;
    // bar graph max is whichever is bigger
    const max = Math.max(cost, revenue, 1);
    const costPct = Math.round((cost / max) * 100);
    const revPct = Math.round((revenue / max) * 100);
    return { cost, revenue, net, payback, costPct, revPct };
  }, [customers, aov]);

  return (
    <>
      <ScrollRevealInit />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="fm-hero">
        <div className="container fm-hero-inner">
          <p className="eyebrow fm-eyebrow">For Coffee+ Operators</p>

          <h1 className="fm-headline">
            <span className="fm-headline-black">Stop renting</span>
            <span className="fm-headline-ghost" aria-hidden="true">
              Stop renting
            </span>
            <span className="fm-headline-black">foot traffic.</span>
            <span className="fm-headline-light">
              <em className="fm-headline-em">Own</em> a Customer
              <br />
              Acquisition Engine.
            </span>
          </h1>

          <p className="fm-tagline">
            Vertical AI for Local Commerce · Williamsburg Coffee+ Beachhead
          </p>

          <p className="fm-sub">
            Tell the engine your goal. ConversionOracle™ predicts conversion,
            matches creators, verifies every walk-in. Our north star is Software
            Leverage Ratio — one operator running dozens of campaigns, not one
            retainer per merchant.
          </p>

          <div className="fm-ctas">
            <Link href="/merchant/pilot" className="btn-fill">
              Start $0 Pilot
            </Link>
            <Link
              href="/merchant/pilot/economics"
              className="btn-outline-light"
            >
              See pilot economics
            </Link>
          </div>

          <p className="fm-reassure">
            No credit card for Pilot &nbsp;·&nbsp; 60s AI match &nbsp;·&nbsp;
            Pay only for AI-verified customers
          </p>
        </div>

        <div className="fm-hero-ambient" aria-hidden="true" />
      </section>

      {/* ── Pain → Lift ──────────────────────────────────────── */}
      <section className="section fm-pl-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">01</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Pain → Lift</span>
            </div>
            <h2 className="fm-pl-headline">
              Every local merchant
              <br />
              <span className="fm-pl-headline-light">
                has the same three leaks.
              </span>
            </h2>
          </div>

          <div className="fm-pl-grid">
            {PAIN_LIFT.map((row, i) => (
              <article
                key={row.tag}
                className="fm-pl-card reveal"
                style={{ transitionDelay: `${i * 110}ms` }}
              >
                <span className="fm-pl-tag">{row.tag}</span>
                <div className="fm-pl-pain">
                  <span className="fm-pl-label">Pain</span>
                  <p className="fm-pl-pain-text">{row.pain}</p>
                </div>
                <div className="fm-pl-lift">
                  <span className="fm-pl-label fm-pl-label--lift">Lift</span>
                  <p className="fm-pl-lift-text">{row.lift}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ──────────────────────────────────── */}
      <section className="section section-bright fm-roi-section">
        <div className="container">
          <div className="fm-roi-head reveal">
            <div>
              <div className="section-tag">
                <span className="section-tag-num">02</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">Mini ROI calculator</span>
              </div>
              <h2 className="fm-roi-headline">
                Move the sliders.
                <br />
                <span className="fm-roi-headline-light">See your numbers.</span>
              </h2>
            </div>
            <p className="fm-roi-note">
              Coffee+ rate $25/customer · LTV multiplier 2.8× AOV.
              <br />
              Client-side model for a rough look. Final spend set in onboarding.
            </p>
          </div>

          <div className="fm-roi-grid reveal">
            {/* Inputs */}
            <div className="fm-roi-inputs">
              <div className="fm-roi-field">
                <div className="fm-roi-field-head">
                  <label htmlFor="roi-customers" className="fm-roi-label">
                    Customers / month
                  </label>
                  <span className="fm-roi-value">{customers}</span>
                </div>
                <input
                  id="roi-customers"
                  type="range"
                  min={5}
                  max={80}
                  step={1}
                  value={customers}
                  onChange={(e) => setCustomers(Number(e.target.value))}
                  className="fm-roi-range"
                />
                <div className="fm-roi-scale">
                  <span>5</span>
                  <span>80</span>
                </div>
              </div>

              <div className="fm-roi-field">
                <div className="fm-roi-field-head">
                  <label htmlFor="roi-aov" className="fm-roi-label">
                    Average order value
                  </label>
                  <span className="fm-roi-value">${aov}</span>
                </div>
                <input
                  id="roi-aov"
                  type="range"
                  min={8}
                  max={20}
                  step={1}
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="fm-roi-range"
                />
                <div className="fm-roi-scale">
                  <span>$8</span>
                  <span>$20</span>
                </div>
              </div>
            </div>

            {/* Output + SVG graph */}
            <div className="fm-roi-output">
              <div className="fm-roi-stats">
                <div className="fm-roi-stat">
                  <span className="fm-roi-stat-label">Your Push cost</span>
                  <span className="fm-roi-stat-val">
                    ${calc.cost.toLocaleString()}
                  </span>
                </div>
                <div className="fm-roi-stat">
                  <span className="fm-roi-stat-label">Projected revenue</span>
                  <span className="fm-roi-stat-val fm-roi-stat-val--rev">
                    $
                    {calc.revenue.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="fm-roi-stat">
                  <span className="fm-roi-stat-label">Net lift</span>
                  <span className="fm-roi-stat-val fm-roi-stat-val--net">
                    $
                    {calc.net.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="fm-roi-stat">
                  <span className="fm-roi-stat-label">Payback</span>
                  <span className="fm-roi-stat-val">
                    {calc.payback} {calc.payback === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>

              <div
                className="fm-roi-chart"
                role="img"
                aria-label={`Bar graph comparing Push cost $${calc.cost} to projected revenue $${Math.round(calc.revenue)}`}
              >
                <svg
                  viewBox="0 0 320 140"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  className="fm-roi-svg"
                  aria-hidden="true"
                >
                  {/* Baseline */}
                  <line
                    x1="0"
                    y1="118"
                    x2="320"
                    y2="118"
                    stroke="rgba(0,48,73,0.12)"
                    strokeWidth="1"
                  />
                  {/* Cost bar */}
                  <rect
                    x="40"
                    y={118 - (calc.costPct * 100) / 100}
                    width="80"
                    height={(calc.costPct * 100) / 100}
                    fill="#003049"
                  />
                  {/* Revenue bar */}
                  <rect
                    x="200"
                    y={118 - (calc.revPct * 100) / 100}
                    width="80"
                    height={(calc.revPct * 100) / 100}
                    fill="#c1121f"
                  />
                  {/* Labels */}
                  <text
                    x="80"
                    y="134"
                    textAnchor="middle"
                    fontFamily="CSGenioMono, monospace"
                    fontSize="10"
                    fill="rgba(0,48,73,0.55)"
                    letterSpacing="0.08em"
                  >
                    COST
                  </text>
                  <text
                    x="240"
                    y="134"
                    textAnchor="middle"
                    fontFamily="CSGenioMono, monospace"
                    fontSize="10"
                    fill="#c1121f"
                    letterSpacing="0.08em"
                    fontWeight="700"
                  >
                    REVENUE
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="section fm-how-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Process</span>
            </div>
            <h2 className="fm-how-headline">
              Four steps.
              <br />
              <span className="fm-how-headline-light">Zero guesswork.</span>
            </h2>
          </div>

          <ol className="fm-how-list">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className="fm-how-item reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="fm-how-num">{step.n}</span>
                <div className="fm-how-content">
                  <h3 className="fm-how-title">{step.title}</h3>
                  <p className="fm-how-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <section className="section section-bright fm-quote-section">
        <div className="container">
          <div className="fm-quote-wrap reveal">
            <span className="fm-quote-rule" aria-hidden="true" />
            <blockquote className="fm-pull-quote">
              <p className="fm-pull-quote-text">
                &ldquo;The engine ran 60 seconds, matched 14 creators, and
                drafted the briefs itself. Week one: 14 AI-verified customers
                walked in with receipts. I didn&apos;t write a single
                brief.&rdquo;
              </p>
              <footer className="fm-pull-quote-footer">
                <cite className="fm-pull-quote-cite">
                  Marco A., Sey Coffee &mdash; Williamsburg, NYC
                </cite>
                <span className="fm-pull-quote-meta">
                  Williamsburg Coffee+ Pilot &nbsp;·&nbsp; 14 verified customers
                  week 1 &nbsp;·&nbsp;{" "}
                  <strong className="fm-pull-quote-stat">
                    SLR 11.2 at week-1 pilot checkpoint
                  </strong>
                </span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Pricing callout (mini 3-row) ─────────────────────── */}
      <section id="pricing" className="section fm-pct-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Pricing at a glance</span>
            </div>
            <h2 className="fm-pct-headline">
              Outcome pricing.
              <br />
              <span className="fm-pct-headline-light">Not SaaS.</span>
            </h2>
          </div>

          <div className="fm-pct-table reveal">
            {PRICING_ROWS.map((row) => (
              <div
                key={row.name}
                className={`fm-pct-row${row.highlight ? " fm-pct-row--hl" : ""}`}
              >
                <div className="fm-pct-name">{row.name}</div>
                <div className="fm-pct-price">{row.price}</div>
                <div className="fm-pct-detail">{row.detail}</div>
                <div className="fm-pct-cta">
                  <Link
                    href={row.href}
                    className={row.highlight ? "btn-fill" : "btn-outline"}
                  >
                    {row.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="fm-pct-foot">
            <Link href="/pricing" className="fm-link-underline">
              Full pricing table — per-vertical rates + Retention Add-on →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="fm-final-cta">
        <div className="container">
          <div className="fm-final-inner reveal">
            <p className="eyebrow fm-final-eyebrow">Williamsburg Beachhead</p>
            <h2 className="fm-final-headline">
              First 10 Coffee+
              <br />
              <span className="fm-final-headline-light">
                merchants get $0 Pilot.
              </span>
            </h2>

            <div className="fm-final-counter">
              <span className="fm-final-counter-num">3</span>
              <span className="fm-final-counter-label">
                pilot slots remaining
                <br />
                <span className="fm-final-counter-sub">
                  Cap $4,200 / neighborhood · LTV/CAC 15.7×
                </span>
              </span>
            </div>

            <p className="fm-final-sub">
              Tell the engine your goal. Claude matches creators in 60 seconds.
              Pay only for AI-verified customers. If ConversionOracle™
              can&apos;t deliver, you don&apos;t pay.
            </p>

            <div className="fm-ctas fm-ctas--final">
              <Link href="/merchant/pilot" className="btn-fill fm-final-btn">
                Apply for pilot
              </Link>
              <Link
                href="/merchant/pilot/economics"
                className="btn-outline-light"
              >
                See pilot economics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
