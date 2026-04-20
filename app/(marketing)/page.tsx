import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LandingInteractivity from "@/components/layout/LandingInteractivity";
import StatCounter from "@/components/layout/StatCounter";
import CountUp from "@/components/layout/CountUp";
import "./landing.css";

/* ── Merchant attribution dashboard visual ────────────────── */
const ATTR_ROWS = [
  {
    handle: "@maya.eats.nyc",
    qr: "QR-4821",
    amount: "+$32",
    verified: true,
    delay: "0s",
  },
  {
    handle: "@brooklyn_bites",
    qr: "QR-4822",
    amount: "+$32",
    verified: true,
    delay: "0.15s",
  },
  {
    handle: "@nycfoodie_",
    qr: "QR-4823",
    amount: "+$32",
    verified: false,
    delay: "0.3s",
  },
  {
    handle: "@williamsburg.e",
    qr: "QR-4824",
    amount: "+$32",
    verified: true,
    delay: "0.45s",
  },
];

function MerchantAttributionVisual() {
  return (
    <div className="merch-attr-visual" data-mock="true">
      {/* Header */}
      <div className="mav-header">
        <div className="mav-header-left">
          <span className="mav-live-dot" />
          <span className="mav-title">
            Attribution Dashboard
            <sup className="disclosure-marker">*</sup>
          </span>
        </div>
        <span className="mav-campaign">Ramen &amp; Co. · Tonight</span>
      </div>

      {/* Attribution rows */}
      <div className="mav-rows">
        {ATTR_ROWS.map((row) => (
          <div
            key={row.handle}
            className="mav-row"
            style={{ animationDelay: row.delay }}
          >
            <span className="mav-handle">{row.handle}</span>
            <span className="mav-qr">{row.qr}</span>
            <span
              className={`mav-status ${row.verified ? "mav-status--ok" : "mav-status--pending"}`}
            >
              {row.verified ? "✓" : "···"}
            </span>
            <span
              className={`mav-amount ${row.verified ? "mav-amount--ok" : ""}`}
            >
              {row.verified ? row.amount : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Summary strip */}
      <div className="mav-summary">
        <div className="mav-sum-item">
          <span className="mav-sum-num">47</span>
          <span className="mav-sum-label">QR scans</span>
        </div>
        <div className="mav-sum-item">
          <span className="mav-sum-num">$1,504</span>
          <span className="mav-sum-label">Attributed revenue</span>
        </div>
        <div className="mav-sum-item">
          <span className="mav-sum-num">3.2×</span>
          <span className="mav-sum-label">ROI vs spend</span>
        </div>
      </div>
    </div>
  );
}

/* ── QR attribution wireframe (kept for reference) ────────── */
function QRVisual() {
  const dataCells: [number, number][] = [
    [76, 76],
    [88, 76],
    [100, 76],
    [112, 76],
    [76, 88],
    [100, 88],
    [120, 88],
    [76, 100],
    [88, 100],
    [96, 100],
    [112, 100],
    [76, 112],
    [96, 112],
    [104, 112],
    [120, 112],
    [132, 112],
    [88, 120],
    [104, 120],
    [120, 120],
    [136, 120],
    [76, 128],
    [96, 128],
    [112, 128],
    [128, 128],
    [88, 136],
    [100, 136],
    [124, 136],
    [136, 136],
    [76, 144],
    [104, 144],
    [116, 144],
    [132, 144],
  ];
  const timing = [80, 90, 100, 110];
  return (
    <svg
      className="visual-svg qr-svg"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-left finder pattern */}
      <rect
        x="12"
        y="12"
        width="52"
        height="52"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect
        x="22"
        y="22"
        width="32"
        height="32"
        fill="currentColor"
        opacity="0.07"
      />
      <rect
        x="30"
        y="30"
        width="16"
        height="16"
        fill="currentColor"
        opacity="0.18"
      />

      {/* Top-right finder pattern */}
      <rect
        x="116"
        y="12"
        width="52"
        height="52"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect
        x="126"
        y="22"
        width="32"
        height="32"
        fill="currentColor"
        opacity="0.07"
      />
      <rect
        x="134"
        y="30"
        width="16"
        height="16"
        fill="currentColor"
        opacity="0.18"
      />

      {/* Bottom-left finder pattern */}
      <rect
        x="12"
        y="116"
        width="52"
        height="52"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect
        x="22"
        y="126"
        width="32"
        height="32"
        fill="currentColor"
        opacity="0.07"
      />
      <rect
        x="30"
        y="134"
        width="16"
        height="16"
        fill="currentColor"
        opacity="0.18"
      />

      {/* Horizontal timing pattern */}
      {timing.map((x, i) => (
        <rect
          key={`h${x}`}
          x={x}
          y="38"
          width="7"
          height="7"
          fill="currentColor"
          opacity={i % 2 === 0 ? 0.16 : 0.05}
        />
      ))}
      {/* Vertical timing pattern */}
      {timing.map((y, i) => (
        <rect
          key={`v${y}`}
          x="38"
          y={y}
          width="7"
          height="7"
          fill="currentColor"
          opacity={i % 2 === 0 ? 0.16 : 0.05}
        />
      ))}

      {/* Data cells */}
      {dataCells.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="7"
          height="7"
          fill="currentColor"
          opacity={0.06 + (i % 4) * 0.035}
        />
      ))}

      {/* Red accent: format indicator square */}
      <rect
        x="76"
        y="12"
        width="16"
        height="16"
        fill="var(--primary)"
        opacity="0.55"
      />
    </svg>
  );
}

/* ── 6-tier progression bars ──────────────────────────────── */
function TierVisual() {
  const tiers = [
    { label: "Seed", h: 28, color: "#669bbc", opacity: 0.7 },
    { label: "Explorer", h: 52, color: "#c9a96e", opacity: 0.8 },
    { label: "Operator", h: 80, color: "#669bbc", opacity: 0.85 },
    { label: "Proven", h: 112, color: "#c1121f", opacity: 0.9 },
    { label: "Closer", h: 148, color: "#780000", opacity: 0.95 },
    { label: "Partner", h: 188, color: "#003049", opacity: 1 },
  ];
  const BAR_W = 26;
  const GAP = 10;
  const TOTAL_H = 188;
  const viewW = tiers.length * (BAR_W + GAP) - GAP; // 206
  return (
    <svg
      className="visual-svg tier-svg"
      viewBox={`0 0 ${viewW} ${TOTAL_H + 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {tiers.map((t, i) => {
        const x = i * (BAR_W + GAP);
        const y = TOTAL_H - t.h;
        return (
          <rect
            key={t.label}
            x={x}
            y={y}
            width={BAR_W}
            height={t.h}
            fill={t.color}
            opacity={t.opacity}
          />
        );
      })}
      {/* Baseline */}
      <line
        x1="0"
        y1={TOTAL_H + 1}
        x2={viewW}
        y2={TOTAL_H + 1}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
      />
    </svg>
  );
}

/* ── 6-tier showcase grid cards (v5.2 Two-Segment Economics) ── */
const TIER_SHOWCASE_DATA = [
  {
    color: "#669bbc",
    material: "Clay",
    name: "Seed",
    earning: "$5 + free item",
    earnRange: "$5 per verified customer",
    desc: "Zero followers needed. +$10 first-customer bonus.",
    highlight: false,
  },
  {
    color: "#c9a96e",
    material: "Bronze",
    name: "Explorer",
    earning: "$15",
    earnRange: "$15 per verified customer",
    desc: "Prove consistency. Build your performance score.",
    highlight: false,
  },
  {
    color: "#669bbc",
    material: "Steel",
    name: "Operator",
    earning: "$20 + 3%",
    earnRange: "$20 per customer + 3% referral",
    desc: "Commission kicks in. Reliable volume tier.",
    highlight: true,
  },
  {
    color: "#c1121f",
    material: "Gold",
    name: "Proven",
    earning: "$800/mo + $25",
    earnRange: "$800 retainer + $25 per customer",
    desc: "Contracted. 10% referral + monthly guarantee.",
    highlight: false,
  },
  {
    color: "#780000",
    material: "Ruby",
    name: "Closer",
    earning: "$1,800/mo + $40",
    earnRange: "$1,800 retainer + $40 per customer",
    desc: "Invite-only. 15% referral + 0.02% equity.",
    highlight: false,
  },
  {
    color: "#003049",
    material: "Obsidian",
    name: "Partner",
    earning: "$3,500/mo + $60",
    earnRange: "$3,500 retainer + $60 per customer",
    desc: "Senior partner. 20% referral + 0.05–0.2% equity.",
    highlight: false,
  },
];

function TierShowcaseGrid() {
  return (
    <>
      <div className="tier-showcase">
        {TIER_SHOWCASE_DATA.map((tier) => (
          <div
            key={tier.name}
            className={`tier-showcase-card tier-card--${tier.material.toLowerCase()}${tier.highlight ? " tier-showcase-card--current" : ""}`}
            style={{ "--tier-color": tier.color } as React.CSSProperties}
          >
            {/* "Start here" badge for Clay (entry) tier */}
            {tier.material === "Clay" && (
              <span className="tier-entry-badge">Start here</span>
            )}
            {/* Material color swatch — replaces emoji */}
            <span
              className="tier-showcase-swatch"
              style={{ background: tier.color }}
              aria-hidden="true"
            />
            <span className="tier-showcase-material">{tier.material}</span>
            <span className="tier-showcase-name">{tier.name}</span>
            <span className="tier-showcase-earning">{tier.earning}</span>
            <div className="tier-earn-range">{tier.earnRange}</div>
            <span className="tier-showcase-desc">{tier.desc}</span>
          </div>
        ))}
      </div>
      <div className="tier-progression reveal">
        <span className="tp-step">Start free</span>
        <span className="tp-arrow">&#8594;</span>
        <span className="tp-step">Build track record</span>
        <span className="tp-arrow">&#8594;</span>
        <span className="tp-step">Unlock higher rates</span>
        <span className="tp-arrow">&#8594;</span>
        <span className="tp-step tp-step--highlight">
          Partner: $3,500/mo + equity
        </span>
      </div>
    </>
  );
}

/* ── Hero campaign preview (right column) ─────────────────── */
function HeroCampaignPreview() {
  return (
    <div className="hero-preview" data-mock="true" aria-hidden="true">
      <div className="hcp-card">
        <span
          className="hcp-example-tag"
          style={{
            fontSize: 10,
            opacity: 0.55,
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
          }}
        >
          Illustrative campaign preview
          <sup className="disclosure-marker">*</sup>
        </span>
        <div className="hcp-live-row">
          <span className="hcp-live-dot" />
          <span className="hcp-live-text">LIVE</span>
          <span className="hcp-live-sep">·</span>
          <span className="hcp-live-title">Campaign Active</span>
        </div>

        <div className="hcp-biz-name">Ramen &amp; Co.</div>
        <div className="hcp-biz-loc">Williamsburg, Brooklyn</div>

        <div className="hcp-divider" />

        <div className="hcp-payout-row">
          <div className="hcp-payout-num">$32</div>
          <div className="hcp-payout-label">
            per verified visit
            <br />
            <span>Operator tier</span>
          </div>
        </div>

        <div className="hcp-progress-wrap">
          <div className="hcp-progress-bar">
            <div className="hcp-progress-fill" />
          </div>
          <div className="hcp-progress-meta">
            <span>14 / 20 slots filled</span>
            <span className="hcp-progress-pct">70%</span>
          </div>
        </div>
      </div>

      <div className="hcp-stats-row">
        <div className="hcp-stat">
          <span className="hcp-stat-num">47</span>
          <span className="hcp-stat-label">QR scans today</span>
        </div>
        <div className="hcp-stat">
          <span className="hcp-stat-num">$1,504</span>
          <span className="hcp-stat-label">Attributed revenue</span>
        </div>
        <div className="hcp-stat">
          <span className="hcp-stat-num">3</span>
          <span className="hcp-stat-label">Creators matched</span>
        </div>
      </div>

      <div className="hcp-match-card">
        <span className="hcp-match-check">✓</span>
        <div className="hcp-match-info">
          <span className="hcp-match-name">@maya.eats.nyc</span>
          <span className="hcp-match-meta">
            Score 94 · Operator · Williamsburg
          </span>
        </div>
        <span className="hcp-match-earn">+$32</span>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">
            <span className="section-tag-label">FAQ</span>
            <span className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="split-headline">
            <span className="wt-900">Common</span>{" "}
            <span className="wt-300">questions.</span>
          </h2>
        </div>
        <div className="faq-grid reveal">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item">
              <h3 className="faq-q">{item.q}</h3>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Ticker items ─────────────────────────────────────────── */
const TICKER_ITEMS = [
  "QR Attribution",
  "Creator Matching",
  "Verified Foot Traffic",
  "Zero Followers Needed",
  "AI-Powered Matching",
  "Pay per Verified Customer",
  "6 Creator Tiers",
  "Zero Setup Fees",
  "24-Hour Campaign Launch",
  "Transaction-Level Data",
  "No Agency Fees",
  "Retainer + Equity for Top Tiers",
];

const FAQ_ITEMS = [
  {
    q: "How is a 'visit' verified?",
    a: "Customers scan a unique QR code at your location. Push records the scan with timestamp and location — no scan, no charge.",
  },
  {
    q: "What if a creator has low followers?",
    a: "Follower count is irrelevant. We score creators on verified conversion rate. A micro-creator with 500 followers who drives 30 visits beats one with 50K who drives zero.",
  },
  {
    q: "Is there a monthly fee?",
    a: "Beachhead merchants pay a $500/mo floor (covers AI + ops) plus a per-verified-customer fee of $15–85 by category. Pilot cohort pays $0 base + $0 per customer during the first-10-merchant onboarding window.",
  },
  {
    q: "How do creators get paid?",
    a: "Earnings are calculated weekly and paid via direct deposit. No invoicing, no waiting 30 days — just results.",
  },
  {
    q: "What cities is Push available in?",
    a: "Currently NYC-only in beta. We're building network density before expanding — quality over coverage.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. Pause or cancel campaigns at any time from your dashboard.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Push",
  description:
    "Creator marketplace for NYC businesses. Pay per verified visit.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://pushnyc.co",
  offers: {
    "@type": "Offer",
    price: "500",
    priceCurrency: "USD",
    description:
      "Beachhead merchants: $500/mo minimum + $15–85 per verified customer by category. Pilot cohort: $0 base during onboarding.",
  },
  provider: {
    "@type": "Organization",
    name: "Push",
    url: "https://pushnyc.co",
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollRevealInit />
      <LandingInteractivity />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="main-content"
        className="hero"
        aria-labelledby="hero-heading"
      >
        <div className="container hero-inner">
          {/* Left: content */}
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              PERFORMANCE-BASED CREATOR MARKETING · NYC BETA
            </p>

            {/* Weight contrast: Black 900 / Thin 200 */}
            <h1 id="hero-heading" className="hero-headline">
              <span className="line-black">Turn creators</span>
              <span className="line-light">
                into <em data-text="results.">results.</em>
              </span>
            </h1>

            <p className="hero-sub">
              Pay only when a creator drives a verified visit — tracked by QR
              code. Every transaction attributed. Zero guesswork.
            </p>

            <p className="hero-audience-line">
              For businesses that want foot traffic. For creators who want to
              earn.
            </p>

            <div className="hero-ctas">
              <Link href="#pricing" className="btn btn-primary">
                Start Free
              </Link>
              <Link href="#how-it-works" className="btn btn-ghost">
                See How It Works
              </Link>
            </div>
            <p className="hero-reassurance">
              No followers minimum. No upfront fees. No contracts.
            </p>
            <a
              href="/demo/creator"
              className="hero-demo-link link-underline"
              style={{
                color: "var(--tertiary)",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              or try the demo — no account needed →
            </a>
          </div>

          {/* Right: live campaign preview */}
          <div className="hero-visual">
            <HeroCampaignPreview />
          </div>

          {/* Stats: full-width bottom row */}
          <div className="hero-stats">
            <div className="stat-item reveal" data-mock="true">
              <span className="stat-num">
                <StatCounter value={500} prefix="$" duration={1200} />
                <sup className="disclosure-marker">*</sup>
              </span>
              <span className="stat-label">
                Beachhead floor / mo + $15–85 per verified customer
              </span>
            </div>
            <div
              className="stat-item reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <span className="stat-num">
                <StatCounter value={6} duration={800} />
              </span>
              <span className="stat-label">
                Creator tiers — zero followers to start
              </span>
            </div>
            <div
              className="stat-item reveal"
              style={{ transitionDelay: "200ms" }}
            >
              <span className="stat-num">
                <StatCounter value={24} suffix="h" duration={1000} />
              </span>
              <span className="stat-label">
                Campaign live — from signup to first creator
              </span>
            </div>
          </div>

          {/* Scroll hint — bouncing indicator */}
          <div className="hero-scroll-hint" aria-hidden="true">
            <div className="hero-scroll-hint-line"></div>
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((pass) => (
            <div key={pass} className="ticker-content">
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="ticker-item">
                  <span className="ticker-dot" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Social Proof ────────────────────────────────────────── */}
      <div className="proof-strip">
        <div className="container proof-strip-inner">
          <span className="proof-strip-label">TRUSTED BY NYC BUSINESSES</span>
          <div className="proof-logos">
            {[
              "Ramen & Co.",
              "Bloom Florals",
              "The Roast Room",
              "Bodega Azul",
            ].map((name) => (
              <span key={name} className="proof-logo-pill">
                {name}
              </span>
            ))}
          </div>

          {/* Traction numbers — illustrative pilot targets */}
          <div className="proof-stats" data-mock="true">
            <div className="proof-stat">
              <span className="proof-stat-num">
                <CountUp target={12} suffix="+" duration={1400} />
              </span>
              <span className="proof-stat-label">NYC businesses</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">
                <CountUp target={47} suffix="+" duration={1600} />
              </span>
              <span className="proof-stat-label">active creators</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">
                <CountUp
                  target={8.2}
                  prefix="$"
                  suffix="K"
                  decimals={1}
                  duration={1800}
                />
              </span>
              <span className="proof-stat-label">attributed revenue</span>
            </div>
          </div>

          <div className="vc-metrics-bar reveal" data-mock="true">
            <span className="vcm-item">
              <span className="vcm-label">Market</span>
              <span className="vcm-value">
                $47B local ad spend
                <sup className="disclosure-marker">*</sup>
              </span>
            </span>
            <span className="vcm-divider" aria-hidden="true">
              —
            </span>
            <span className="vcm-item">
              <span className="vcm-label">Moat</span>
              <span className="vcm-value">
                QR attribution + creator network effects
              </span>
            </span>
            <span className="vcm-divider" aria-hidden="true">
              —
            </span>
            <span className="vcm-item">
              <span className="vcm-label">Model</span>
              <span className="vcm-value">
                Performance-based, zero upfront risk
              </span>
            </span>
          </div>

          <p className="market-hint">
            NYC&apos;s $2B+ local advertising market — 230,000+ local
            businesses, 50,000+ food &amp; lifestyle creators. One platform.
          </p>

          <span className="proof-strip-note">
            *Illustrative targets · First verified pilot results Week 4 of
            2026-Q2 · NYC-first
          </span>
        </div>
      </div>

      {/* ── 01 · For Merchants ───────────────────────────────── */}
      <section
        id="merchants"
        className="section section-bright"
        aria-labelledby="merchants-heading"
      >
        <div className="container">
          <div className="split">
            <div className="reveal">
              <div className="section-tag">
                <span className="section-ghost-num" aria-hidden="true">
                  01
                </span>
                <span className="section-tag-num">01</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">For Merchants</span>
              </div>

              <h2 id="merchants-heading" className="split-headline">
                <span className="wt-900">Know exactly</span>
                <span className="wt-300">which creators drive customers.</span>
              </h2>

              <p className="split-body">
                Push gives you transaction-level attribution via QR codes. Know
                exactly which creator drove which customer — and pay for
                verified results.
              </p>

              <ul className="feature-list">
                {[
                  "Target 87% creator match rate within 2 miles of your business",
                  "QR attribution — zero ops burden, every scan logged",
                  "Campaign live in under 24 hours, from signup to first creator",
                  "$500/mo min + $15–85 per verified customer — no setup fees, no agency markup",
                ].map((f) => (
                  <li key={f} className="feature-item">
                    <span className="feature-dot" />
                    <span className="feature-text">{f}</span>
                  </li>
                ))}
              </ul>

              {/* QR attribution flow — 3-step inline visualization */}
              <div
                className="qr-flow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                  marginTop: "var(--space-5)",
                  marginBottom: "var(--space-5)",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                }}
              >
                <div
                  className="qr-flow-step"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    className="qr-flow-num"
                    style={{
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "13px",
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                  <span
                    className="qr-flow-text"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Creator posts to their audience
                  </span>
                </div>
                <span
                  className="qr-flow-arrow"
                  style={{ color: "var(--text-muted)", fontWeight: 300 }}
                >
                  →
                </span>
                <div
                  className="qr-flow-step"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    className="qr-flow-num"
                    style={{
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "13px",
                      lineHeight: 1,
                    }}
                  >
                    2
                  </span>
                  <span
                    className="qr-flow-text"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Customer scans QR at your door
                  </span>
                </div>
                <span
                  className="qr-flow-arrow"
                  style={{ color: "var(--text-muted)", fontWeight: 300 }}
                >
                  →
                </span>
                <div
                  className="qr-flow-step"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    className="qr-flow-num"
                    style={{
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "13px",
                      lineHeight: 1,
                    }}
                  >
                    3
                  </span>
                  <span
                    className="qr-flow-text"
                    style={{ color: "var(--text-muted)" }}
                  >
                    You see verified attribution data
                  </span>
                </div>
              </div>

              <Link href="/merchant/signup" className="btn btn-primary">
                Get Started
              </Link>
              <p
                style={{
                  marginTop: "var(--space-3)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Curious what creators see?{" "}
                <Link
                  href="/creator/signup"
                  style={{
                    color: "var(--tertiary)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Preview the creator experience →
                </Link>
              </p>
            </div>

            <div
              className="split-visual visual-merchant reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <MerchantAttributionVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Attribution Explainer ────────────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="attr-explainer reveal">
            <h3 className="attr-explainer-title">How verification works</h3>
            <div className="attr-steps">
              <div className="attr-step">
                <div className="attr-step-num">1</div>
                <div className="attr-step-content">
                  <strong>Creator posts</strong>
                  <span>Content goes live with your unique campaign link</span>
                </div>
              </div>
              <div className="attr-connector" aria-hidden="true">
                →
              </div>
              <div className="attr-step">
                <div className="attr-step-num">2</div>
                <div className="attr-step-content">
                  <strong>Customer visits</strong>
                  <span>
                    They show up and scan the QR code at your location
                  </span>
                </div>
              </div>
              <div className="attr-connector" aria-hidden="true">
                →
              </div>
              <div className="attr-step">
                <div className="attr-step-num">3</div>
                <div className="attr-step-content">
                  <strong>You pay</strong>
                  <span>
                    Only for confirmed, QR-verified visits — nothing else
                  </span>
                </div>
              </div>
            </div>
            <p className="attr-note" data-mock="true">
              Verified customer fees range $15–$85 by category
              <sup className="disclosure-marker">*</sup>. Traditional ads:
              $15–$50 per click with no visit guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · For Creators ────────────────────────────────── */}
      <section
        id="creators"
        className="section section-warm"
        aria-labelledby="creators-heading"
      >
        <div className="container">
          {/* Section header + tier showcase span full width */}
          <div className="reveal">
            <div className="section-tag">
              <span className="section-ghost-num" aria-hidden="true">
                02
              </span>
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">For Creators</span>
            </div>

            <h2 id="creators-heading" className="split-headline">
              <span className="wt-900">No followers</span>
              <span className="wt-300">required.</span>
            </h2>

            <p className="creator-sub-message">Earn on results, not reach.</p>

            <p className="split-body">
              Your performance score is your currency. Build it from day one —
              regardless of your current audience size — and access
              higher-paying campaigns.
            </p>
          </div>

          {/* Tier showcase grid — full width */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <TierShowcaseGrid />
          </div>

          {/* Performance score explainer (v5.2 weights) */}
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <div className="perf-score-explainer">
              <h4>How your score works</h4>
              <div className="pse-items">
                <div className="pse-item">
                  <span className="pse-metric">Verified customer rate</span>
                  <span className="pse-weight">30%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Content quality</span>
                  <span className="pse-weight">25%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Reliability</span>
                  <span className="pse-weight">20%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Merchant satisfaction</span>
                  <span className="pse-weight">15%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Engagement</span>
                  <span className="pse-weight">10%</span>
                </div>
              </div>
              <p className="pse-note">
                Higher score = better campaigns + higher pay rates.
              </p>
            </div>
          </div>

          {/* Feature list + earning preview + CTA below the grid */}
          <div
            className="creator-bottom reveal"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="split">
              {/* Left: decorative bar chart (background) + tier strip */}
              <div className="split-visual visual-creator">
                <TierVisual />
                <div className="tier-strip">
                  <span style={{ background: "#669bbc" }} />
                  <span style={{ background: "#c9a96e" }} />
                  <span style={{ background: "#669bbc" }} />
                  <span style={{ background: "#c1121f" }} />
                  <span style={{ background: "#780000" }} />
                  <span style={{ background: "#003049" }} />
                </div>
              </div>

              {/* Right: features + earning preview + CTA */}
              <div>
                <ul className="feature-list">
                  {[
                    "Start at Seed — zero followers, zero cost to join",
                    "6-tier progression: earn $5→$60 per verified customer",
                    "Commission on every referred sale (3%→20% at top tiers)",
                    "T4+ tiers add monthly retainer ($800→$3,500) + equity grants",
                  ].map((f) => (
                    <li key={f} className="feature-item">
                      <span
                        className="feature-dot"
                        style={{ background: "var(--tertiary)" }}
                      />
                      <span className="feature-text">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="creator-workflow">
                  <h4>What you&apos;ll do</h4>
                  <ol className="creator-workflow-steps">
                    <li>Accept a campaign from a nearby business</li>
                    <li>Visit &amp; experience it authentically</li>
                    <li>Post your content to your audience</li>
                    <li>Earn when your followers show up</li>
                  </ol>
                </div>

                <div className="earning-preview" data-mock="true">
                  <p className="earning-preview-label">
                    Your earning potential
                    <sup className="disclosure-marker">*</sup>
                  </p>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Seed</span>
                    <span className="earning-tier-value">
                      $5 + free item / verified customer
                    </span>
                  </div>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Explorer</span>
                    <span className="earning-tier-value">
                      $15 / verified customer
                    </span>
                  </div>
                  <div className="earning-tier highlight">
                    <span className="earning-tier-name">Operator</span>
                    <span className="earning-tier-value">
                      $20 / customer + 3% referral commission
                    </span>
                  </div>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Partner</span>
                    <span className="earning-tier-value">
                      $3,500/mo retainer + $60 / customer + 20% + equity
                    </span>
                  </div>
                </div>

                <div className="platform-compare reveal">
                  <div className="pc-col pc-col--push">
                    <div className="pc-header">Push</div>
                    <ul className="pc-list">
                      <li>✓ Paid per verified visit</li>
                      <li>✓ No minimum followers</li>
                      <li>✓ Weekly payouts</li>
                      <li>✓ NYC-focused campaigns</li>
                      <li>✓ Build a verified track record</li>
                    </ul>
                  </div>
                  <div className="pc-col pc-col--others">
                    <div className="pc-header">
                      Traditional Influencer Platforms
                    </div>
                    <ul className="pc-list pc-list--others">
                      <li>✗ Pay per post, not per result</li>
                      <li>✗ Need 10K+ followers to qualify</li>
                      <li>✗ 30-90 day payment delays</li>
                      <li>✗ National brands, not local</li>
                      <li>✗ No performance history</li>
                    </ul>
                  </div>
                </div>

                <Link href="/creator/signup" className="btn btn-secondary">
                  Join as Creator — Start Free
                </Link>
                <p
                  style={{
                    marginTop: "var(--space-3)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Own a business?{" "}
                  <Link
                    href="/for-merchants"
                    style={{
                      color: "var(--tertiary)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    See what merchants offer →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · How it Works ────────────────────────────────── */}
      <section
        id="how-it-works"
        className="section section-bright"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-ghost-num" aria-hidden="true">
                03
              </span>
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How it Works</span>
            </div>
            <h2 id="how-it-works-heading">
              Three steps.
              <br />
              <span style={{ fontWeight: 300, opacity: 0.45 }}>
                Zero guesswork.
              </span>
            </h2>
          </div>

          <div className="how-grid">
            {[
              {
                n: "01",
                title: "Merchant posts a campaign",
                body: "Set your goal, budget, and payout. Push matches creators by score, tier, and proximity — no manual outreach.",
                bullets: [
                  "Choose your target neighborhood and budget",
                  "Go live in under 24 hours — no agency needed",
                ],
              },
              {
                n: "02",
                title: "Creator visits & creates content",
                body: "The creator gets a unique QR code matched to their campaign — assigned based on performance score, tier, and location. Customers scan it at the point of purchase, attributing the visit directly to that creator.",
                bullets: [
                  "Matched by proximity, tier, and performance score",
                  "Creator posts authentic content to their audience",
                ],
              },
              {
                n: "03",
                title: "Push verifies, merchant pays",
                body: "Every scan is logged. Payouts are released automatically after verification. No disputes, no manual tracking.",
                bullets: [
                  "Customer scans QR code at your door",
                  "Transaction logged — you only pay for verified visits",
                ],
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="how-step reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="how-step-num">{step.n}</span>
                <span className="how-step-index">{step.n} /</span>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-body">{step.body}</p>
                <ul className="how-step-bullets">
                  {step.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="reveal"
            style={{ transitionDelay: "300ms", marginTop: "var(--space-5)" }}
          >
            <Link
              href="/demo/creator"
              style={{
                color: "var(--tertiary)",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
              }}
            >
              See it live →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section
        id="pricing"
        className="section section-bright"
        aria-labelledby="pricing-heading"
      >
        <div className="container">
          <div className="pricing-header reveal">
            <div>
              <div
                className="section-tag"
                style={{ marginBottom: "var(--space-3)" }}
              >
                <span className="section-ghost-num" aria-hidden="true">
                  04
                </span>
                <span className="section-tag-num">04</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">Transparent Pricing</span>
              </div>
              <h2 id="pricing-heading">
                Pricing that scales
                <br />
                <span style={{ fontWeight: 300, opacity: 0.45 }}>
                  with results.
                </span>
              </h2>
            </div>
            <p className="pricing-note">
              Cancel anytime. No setup fees.
              <br />
              Creators always join free.
            </p>
          </div>

          <div className="pricing-grid">
            {[
              {
                name: "Pilot",
                int: "$0",
                dec: "",
                period: "",
                desc: "First 10 Williamsburg Coffee+ merchants — generates AI training data.",
                features: [
                  "$0 base + $0 per verified customer",
                  "Time-boxed to first 10 merchants per neighborhood",
                  "Full attribution + content asset delivery",
                  "White-glove onboarding",
                  "Pilot playbook & priority support",
                ],
                featured: false,
                badge: "Invite-Only",
                cta: "Apply for Pilot",
              },
              {
                name: "Beachhead",
                int: "$500",
                dec: "",
                period: "/mo",
                desc: "Merchants 11–50. Pay a floor + per verified customer.",
                features: [
                  "$500/mo floor covers AI + ops",
                  "$15–$85 per verified customer by category",
                  "Retention add-on: +$8 visit 2 / +$6 visit 3 / +$4 loyalty",
                  "Month 1 prorated if <5 verified customers",
                  "Full analytics dashboard",
                ],
                featured: true,
                badge: "Most Common",
                cta: "Join Beachhead",
              },
              {
                name: "Scale",
                int: "Custom",
                dec: "",
                period: "",
                desc: "Williamsburg 50+ / NYC-dense / other metros.",
                features: [
                  "Same $500/mo floor + per-verified-customer by category",
                  "Auto merchant preload balance + usage draw-down",
                  "Dedicated account manager",
                  "Custom attribution rules",
                  "API access",
                ],
                featured: false,
                badge: null,
                cta: "Talk to Sales",
              },
            ].map((plan, i) => (
              <div
                key={plan.name}
                className={`pricing-card reveal ${plan.featured ? "pricing-card-featured" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.badge && (
                  <span className="pricing-badge">{plan.badge}</span>
                )}
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  <span className="price-int">{plan.int}</span>
                  {plan.dec && <span className="price-dec">{plan.dec}</span>}
                  <span className="price-period">{plan.period}</span>
                </div>
                <p className="pricing-desc">{plan.desc}</p>
                <ul className="pricing-features">
                  {plan.features.map((f) => (
                    <li key={f} className="pricing-feature">
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/merchant/signup"
                  className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {plan.cta}
                </Link>
                {plan.name === "Pilot" && (
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.55,
                      marginTop: "6px",
                      fontFamily: "var(--font-body)",
                      textAlign: "center",
                    }}
                  >
                    2-minute setup · First campaign live in 24 hours
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Illustrative math — Coffee+ category at Beachhead floor */}
          <div className="roi-math reveal" data-mock="true">
            <span className="roi-example">
              Illustrative
              <sup className="disclosure-marker">*</sup>: a Coffee+ merchant at
              Beachhead pays $500/mo floor + $25 × ~85 verified customers ≈{" "}
              <strong>$2,620/mo</strong> for verified walk-in + content asset.
            </span>
          </div>

          <p className="pricing-vs">
            Compare: traditional local ads cost $500–$2,000/month with zero
            performance guarantee.
          </p>

          {/* Creator free banner — audit #25 */}
          <div
            className="pricing-creator-banner"
            style={{
              background: "#f5f2ec",
              borderTop: "2px solid #c1121f",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px 24px",
              marginTop: "32px",
            }}
          >
            <span
              className="pcb-icon"
              style={{ fontSize: "20px", color: "#c1121f", flexShrink: 0 }}
            >
              ★
            </span>
            <div style={{ flex: 1 }}>
              <strong style={{ fontFamily: "var(--font-body)" }}>
                Creators always join free.
              </strong>
              <span style={{ fontFamily: "var(--font-body)", opacity: 0.7 }}>
                {" "}
                Start building your performance score today — no credit card, no
                commitment.
              </span>
            </div>
            <a
              href="/demo/creator"
              className="btn btn--ghost"
              style={{
                fontFamily: "var(--font-body)",
                border: "1px solid #c1121f",
                color: "#c1121f",
                padding: "8px 16px",
                textDecoration: "none",
                flexShrink: 0,
                fontSize: "13px",
              }}
            >
              Start Free →
            </a>
          </div>

          {/* Trust signals — audit #63 */}
          <div
            className="trust-signals"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginTop: "16px",
              padding: "12px 0",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-body)",
                opacity: 0.55,
              }}
            >
              🔒 Secure payments
            </span>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-body)",
                opacity: 0.55,
              }}
            >
              ✓ No hidden fees
            </span>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-body)",
                opacity: 0.55,
              }}
            >
              ✓ Cancel anytime
            </span>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-body)",
                opacity: 0.55,
              }}
            >
              ✓ 24h support
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials intentionally removed until first verified pilot cohort (2026-Q2 Week 4). */}
      {/* Pre-pilot testimonials would violate FTC 16 CFR § 255.1(a) (no real customer experience yet). */}

      <FAQSection />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section id="cta" className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div
              className="cta-panel cta-panel-merchant reveal"
              style={{ borderTop: "3px solid var(--primary)" }}
            >
              <span className="cta-tag cta-tag-merchant">For Merchants</span>
              <span className="cta-urgency-badge">
                Founding Member Pricing — Limited Spots
              </span>
              <h2 className="cta-headline">
                <span className="wt-900">Ready to pay only</span>
                <span className="wt-300">for results?</span>
              </h2>
              <p className="cta-body">
                NYC founding cohort — first 50 merchants get priority creator
                matching. Launch in under 24 hours. Pay only for verified
                results.
              </p>
              <div className="guarantee-badge">
                <span className="guarantee-icon">&#10003;</span>
                <span>
                  Only pay for verified, QR-confirmed visits. Zero spend on
                  reach alone.
                </span>
              </div>
              <Link href="/merchant/signup" className="btn btn-cta-merchant">
                Start Free — $0 upfront
              </Link>
            </div>

            <div
              className="cta-panel cta-panel-creator reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <span className="cta-tag cta-tag-creator">For Creators</span>
              <h2 className="cta-headline">
                <span className="wt-900">Join NYC&apos;s performance</span>
                <span className="wt-300">creator network.</span>
              </h2>
              <p className="cta-body">
                First 50 creators get priority campaign access. Your performance
                score is your currency — build it from zero.
              </p>
              <Link href="/creator/signup" className="btn btn-cta-creator">
                Apply as Creator
              </Link>
              <p
                style={{
                  fontSize: "11px",
                  opacity: 0.5,
                  marginTop: "6px",
                  fontFamily: "var(--font-body)",
                }}
              >
                No credit card · 30-second signup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FTC 16 CFR § 255 Disclosure ──────────────────────────── */}
      <section
        className="compliance-disclosure"
        data-section="ftc-disclosure"
        role="note"
        aria-labelledby="ftc-disclosure-heading"
      >
        <div className="container">
          <h2 id="ftc-disclosure-heading" className="visually-hidden">
            Illustrative numbers disclosure
          </h2>
          <p id="ftc-disclosure-text" className="disclosure-text">
            <span className="asterisk" aria-hidden="true">
              *
            </span>{" "}
            Illustrative example from pilot target. Actual outcomes vary by
            merchant category, local market density, creator tier, and
            seasonality. Push is a pre-pilot product; first verified pilot
            results available Week 4 of 2026-Q2. Creator compensation disclosed
            in full via <Link href="/legal/creator-terms">Creator Terms</Link>.
            FTC-compliant disclosure per 16 CFR § 255.
          </p>
        </div>
      </section>
    </>
  );
}
