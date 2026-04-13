import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LandingInteractivity from "@/components/layout/LandingInteractivity";
import StatCounter from "@/components/layout/StatCounter";
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
    <div className="merch-attr-visual">
      {/* Header */}
      <div className="mav-header">
        <div className="mav-header-left">
          <span className="mav-live-dot" />
          <span className="mav-title">Attribution Dashboard</span>
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
    { label: "Seed", h: 28, color: "#b8a99a", opacity: 0.7 },
    { label: "Explorer", h: 52, color: "#8c6239", opacity: 0.8 },
    { label: "Operator", h: 80, color: "#4a5568", opacity: 0.85 },
    { label: "Proven", h: 112, color: "#c9a96e", opacity: 0.9 },
    { label: "Closer", h: 148, color: "#9b111e", opacity: 0.95 },
    { label: "Partner", h: 188, color: "#1a1a2e", opacity: 1 },
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

/* ── 6-tier showcase grid cards ───────────────────────────── */
const TIER_SHOWCASE_DATA = [
  {
    color: "#b8a99a",
    material: "Clay",
    name: "Seed",
    earning: "Free product",
    desc: "Zero followers needed. Get your first campaign.",
    highlight: false,
  },
  {
    color: "#8c6239",
    material: "Bronze",
    name: "Explorer",
    earning: "$12/campaign",
    desc: "Prove consistency. Build your performance score.",
    highlight: false,
  },
  {
    color: "#4a5568",
    material: "Steel",
    name: "Operator",
    earning: "$20 + 3%",
    desc: "Commission kicks in. Bonuses at 30 transactions.",
    highlight: true,
  },
  {
    color: "#c9a96e",
    material: "Gold",
    name: "Proven",
    earning: "$32 + 5%",
    desc: "Trusted track record. Higher-value campaigns.",
    highlight: false,
  },
  {
    color: "#9b111e",
    material: "Ruby",
    name: "Closer",
    earning: "$55 + 7%",
    desc: "Top performers. Priority campaign access.",
    highlight: false,
  },
  {
    color: "#1a1a2e",
    material: "Obsidian",
    name: "Partner",
    earning: "$100 + 10%",
    desc: "Elite tier. Up to $80/month milestone bonus.",
    highlight: false,
  },
];

function TierShowcaseGrid() {
  return (
    <div className="tier-showcase">
      {TIER_SHOWCASE_DATA.map((tier) => (
        <div
          key={tier.name}
          className={`tier-showcase-card${tier.highlight ? " tier-showcase-card--current" : ""}${tier.material === "Obsidian" ? " tier-obsidian" : ""}`}
          style={{ "--tier-color": tier.color } as React.CSSProperties}
        >
          {/* Material color swatch — replaces emoji */}
          <span
            className="tier-showcase-swatch"
            style={{ background: tier.color }}
            aria-hidden="true"
          />
          <span className="tier-showcase-material">{tier.material}</span>
          <span className="tier-showcase-name">{tier.name}</span>
          <span className="tier-showcase-earning">{tier.earning}</span>
          <span className="tier-showcase-desc">{tier.desc}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Hero campaign preview (right column) ─────────────────── */
function HeroCampaignPreview() {
  return (
    <div className="hero-preview" aria-hidden="true">
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
          Live campaign preview
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
    <section className="section section-bright faq-section">
      <div className="container">
        <div className="reveal">
          <div className="section-tag">
            <span className="section-ghost-num" aria-hidden="true">
              05
            </span>
            <span className="section-tag-num">05</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">FAQ</span>
          </div>
          <h2>
            Common questions.
            <br />
            <span style={{ fontWeight: 300, opacity: 0.45 }}>
              Straight answers.
            </span>
          </h2>
        </div>
        <div className="faq-grid reveal" style={{ transitionDelay: "100ms" }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">{item.q}</p>
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
  "$19.99 / mo",
  "6 Creator Tiers",
  "Zero Setup Fees",
  "24-Hour Campaign Launch",
  "Transaction-Level Data",
  "No Agency Fees",
  "$100 / Campaign Potential",
];

const FAQ_ITEMS = [
  {
    q: "How does the QR code attribution work?",
    a: "Each creator gets a unique QR code linked to their campaign. When a customer scans it at the point of purchase, that transaction is attributed directly to that creator. Push logs every scan — no manual tracking needed.",
  },
  {
    q: "Do creators need a large following to join?",
    a: "No. Push is performance-based, not follower-based. Seed tier requires zero followers. Your performance score (built through completed campaigns and verified transactions) determines your tier and earning potential.",
  },
  {
    q: "How are payouts calculated and released?",
    a: "Payouts = flat campaign fee + transaction commission + optional milestone bonus. Funds are released automatically after verification — typically within 48 hours of campaign end.",
  },
  {
    q: "What does it cost to launch a campaign as a merchant?",
    a: "Starter at $19.99/mo (2 campaigns, 3 creator slots), Growth at $69/mo (4 campaigns, 5 slots), Pro at $199/mo (unlimited). No setup fees. No agency markup. Cancel anytime.",
  },
  {
    q: "How do you prevent fraud or fake QR scans?",
    a: "Push uses transaction-level verification — a scan only counts when it's accompanied by a real purchase. We cross-reference scan timestamps, device fingerprints, and purchase data to flag anomalies.",
  },
  {
    q: "How fast can I launch a campaign?",
    a: "From signup to live campaign: under 24 hours. Push handles creator matching — you set the goal, budget, and payout. We surface qualified creators based on score, tier, and proximity.",
  },
];

export default function LandingPage() {
  return (
    <>
      <ScrollRevealInit />
      <LandingInteractivity />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">
          {/* Left: content */}
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              NYC&apos;s Local Creator Marketplace
            </p>

            {/* Weight contrast: Black 900 / Thin 200 */}
            <h1 className="hero-headline">
              <span className="line-black">Turn creators</span>
              <span className="line-light">
                into <em data-text="results.">results.</em>
              </span>
            </h1>

            <p className="hero-sub">
              Creators post. Customers show up. You only pay when it works —
              verified by QR code attribution at every transaction.
            </p>

            <p
              className="hero-sub hero-sub--micro"
              style={{
                fontSize: "var(--text-small)",
                opacity: 0.6,
              }}
            >
              Creators: zero followers required to start earning.
            </p>

            <div className="hero-ctas">
              <Link href="/merchant/signup" className="btn btn-primary">
                Start for $19.99 / mo
              </Link>
              <Link href="/creator/signup" className="btn btn-ghost">
                Join as Creator — Free
              </Link>
            </div>
            <p
              className="hero-reassurance"
              style={{
                fontSize: "11px",
                opacity: 0.5,
                marginTop: "8px",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.04em",
              }}
            >
              No contracts · Cancel anytime · Free for creators
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
            <div className="stat-item reveal">
              <span className="stat-num">
                <StatCounter
                  value={19.99}
                  prefix="$"
                  decimals={2}
                  duration={1200}
                />
              </span>
              <span className="stat-label">Merchant entry price / mo</span>
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

          {/* Traction numbers — pilot data */}
          <div className="proof-stats">
            <div className="proof-stat">
              <span className="proof-stat-num">12+</span>
              <span className="proof-stat-label">NYC businesses</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">47+</span>
              <span className="proof-stat-label">active creators</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">$8.2K</span>
              <span className="proof-stat-label">attributed revenue</span>
            </div>
          </div>

          <p className="market-hint">
            NYC: 230,000+ local businesses. 50,000+ food &amp; lifestyle
            creators. One platform.
          </p>

          <span className="proof-strip-note">
            *Based on pilot data · Early access cohort · NYC-first
          </span>
        </div>
      </div>

      {/* ── 01 · For Merchants ───────────────────────────────── */}
      <section id="merchants" className="section section-bright">
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

              <h2 className="split-headline">
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
                  "87% creator match rate within 2 miles of your business",
                  "QR attribution — zero ops burden, every scan logged",
                  "Campaign live in under 24 hours, from signup to first creator",
                  "From $19.99/mo — no setup fees, no agency markup",
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

      {/* ── 02 · For Creators ────────────────────────────────── */}
      <section id="creators" className="section section-warm">
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

            <h2 className="split-headline">
              <span className="wt-900">No followers</span>
              <span className="wt-300">required.</span>
            </h2>

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

          {/* Performance score explainer */}
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <div className="perf-score-explainer">
              <h4>How your score works</h4>
              <div className="pse-items">
                <div className="pse-item">
                  <span className="pse-metric">Verified visits</span>
                  <span className="pse-weight">50%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Content quality</span>
                  <span className="pse-weight">30%</span>
                </div>
                <div className="pse-item">
                  <span className="pse-metric">Consistency</span>
                  <span className="pse-weight">20%</span>
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
                  <span style={{ background: "#b8a99a" }} />
                  <span style={{ background: "#8c6239" }} />
                  <span style={{ background: "#4a5568" }} />
                  <span style={{ background: "#c9a96e" }} />
                  <span style={{ background: "#9b111e" }} />
                  <span style={{ background: "#1a1a2e" }} />
                </div>
              </div>

              {/* Right: features + earning preview + CTA */}
              <div>
                <ul className="feature-list">
                  {[
                    "Start at Seed — zero followers, zero cost to join",
                    "6-tier progression: earn $12→$100/campaign as you level up",
                    "Commission on every verified sale (3%→10%)",
                    "Milestone bonuses from $15→$80/month — unlocks at 30 transactions",
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

                <div className="earning-preview">
                  <p className="earning-preview-label">
                    Your earning potential
                  </p>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Seed</span>
                    <span className="earning-tier-value">Free product</span>
                  </div>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Explorer</span>
                    <span className="earning-tier-value">$12/campaign</span>
                  </div>
                  <div className="earning-tier highlight">
                    <span className="earning-tier-name">Operator</span>
                    <span className="earning-tier-value">
                      $20 + 3% commission + $15 bonus at 30 tx/mo
                    </span>
                  </div>
                  <div className="earning-tier">
                    <span className="earning-tier-name">Partner</span>
                    <span className="earning-tier-value">
                      $100 + 10% commission + $80 bonus
                    </span>
                  </div>
                </div>

                <blockquote className="creator-testimonial">
                  <p>
                    &ldquo;I earned $320 last month just visiting restaurants
                    I&apos;d go to anyway.&rdquo;
                  </p>
                  <cite>— @maya.eats.nyc · Operator Tier</cite>
                </blockquote>

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
      <section className="section section-bright">
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
            <h2>
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
      <section id="pricing" className="section section-bright">
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
                <span className="section-tag-label">Pricing</span>
              </div>
              <h2>
                Three plans, flat pricing
                <br />
                <span style={{ fontWeight: 300, opacity: 0.45 }}>
                  merchant pricing.
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
                name: "Starter",
                int: "$19",
                dec: ".99",
                period: "/mo",
                desc: "Launch your first campaigns and see real attribution in action.",
                features: [
                  "2 active campaigns",
                  "3 creator slots",
                  "AI creator matching",
                  "QR attribution",
                  "Basic analytics",
                ],
                featured: false,
                badge: null,
                cta: "Get Started",
              },
              {
                name: "Growth",
                int: "$69",
                dec: "",
                period: "/mo",
                desc: "Scale what works. More campaigns, deeper insights, faster matching.",
                features: [
                  "4 active campaigns",
                  "5 creator slots",
                  "Priority creator matching",
                  "Full analytics dashboard",
                  "Campaign templates",
                ],
                featured: true,
                badge: "Most Popular",
                cta: "Get Growth",
              },
              {
                name: "Pro",
                int: "$199",
                dec: "",
                period: "/mo",
                desc: "Unlimited campaigns. Dedicated support. Full platform access.",
                features: [
                  "Unlimited campaigns",
                  "8 creator slots",
                  "Dedicated account manager",
                  "Custom attribution rules",
                  "API access",
                ],
                featured: false,
                badge: null,
                cta: "Get Pro",
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
                {plan.name === "Starter" && (
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

      <FAQSection />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div
              className="cta-panel cta-panel-merchant reveal"
              style={{ borderTop: "3px solid var(--primary)" }}
            >
              <span className="cta-tag cta-tag-merchant">For Merchants</span>
              <h2 className="cta-headline">
                <span className="wt-900">Your next customer</span>
                <span className="wt-300">is already on Instagram.</span>
              </h2>
              <p className="cta-body">
                NYC founding cohort — first 50 merchants get priority creator
                matching. Launch in under 24 hours. Pay only for verified
                results.
              </p>
              <span
                className="cta-urgency-badge"
                style={{
                  display: "inline-block",
                  background: "rgba(193,18,31,0.1)",
                  border: "1px solid rgba(193,18,31,0.3)",
                  color: "var(--primary)",
                  padding: "4px 10px",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-4)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                }}
              >
                ⚡ NYC Founding Cohort — Limited spots
              </span>
              <Link href="/merchant/signup" className="btn btn-cta-merchant">
                Start for $19.99 / mo
              </Link>
            </div>

            <div
              className="cta-panel cta-panel-creator reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <span className="cta-tag cta-tag-creator">For Creators</span>
              <h2 className="cta-headline">
                <span className="wt-900">Your local audience</span>
                <span className="wt-300">is your edge.</span>
              </h2>
              <p className="cta-body">
                First 50 creators get priority campaign access. Your performance
                score is your currency — build it from zero.
              </p>
              <Link href="/creator/signup" className="btn btn-cta-creator">
                Join Free — Start Earning
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
    </>
  );
}
