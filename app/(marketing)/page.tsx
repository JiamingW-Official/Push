import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./landing.css";

/* ── QR attribution wireframe ─────────────────────────────── */
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
          className={`tier-showcase-card${tier.highlight ? " tier-showcase-card--current" : ""}`}
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

export default function LandingPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow hero-eyebrow">
            NYC&apos;s Creator Acquisition Engine
          </p>

          {/* Weight contrast: Black 900 / Thin 200 */}
          <h1 className="hero-headline">
            <span className="line-black">Turn creators</span>
            <span className="line-light">
              into <em>results.</em>
            </span>
          </h1>

          <p className="hero-sub">
            Push matches local businesses with creators who drive real foot
            traffic — verified by QR code attribution at the transaction level.
          </p>

          <div className="hero-ctas">
            <Link href="/merchant/signup" className="btn btn-primary">
              Start for $19.99 / mo
            </Link>
            <Link href="/creator/signup" className="btn btn-ghost">
              Join as Creator — Start Free
            </Link>
          </div>
          <a
            href="/demo/creator"
            style={{
              display: "block",
              marginTop: "12px",
              fontSize: "13px",
              color: "rgba(0,48,73,0.55)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              fontFamily: "var(--font-body)",
            }}
          >
            or try the demo — no account needed →
          </a>

          {/* Thin editorial stat numbers */}
          <div className="hero-stats">
            <div className="stat-item reveal">
              <span className="stat-num">$19.99</span>
              <span className="stat-label">Merchant entry price / mo</span>
            </div>
            <div
              className="stat-item reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <span className="stat-num">6</span>
              <span className="stat-label">
                Creator tiers — zero followers to start
              </span>
            </div>
            <div
              className="stat-item reveal"
              style={{ transitionDelay: "200ms" }}
            >
              <span className="stat-num">35%</span>
              <span className="stat-label">
                Platform margin target per campaign
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

      {/* ── 01 · For Merchants ───────────────────────────────── */}
      <section id="merchants" className="section section-bright">
        <div className="container">
          <div className="split">
            <div className="reveal">
              <div className="section-tag">
                <span className="section-tag-num">01</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">For Merchants</span>
              </div>

              <h2 className="split-headline">
                <span className="wt-900">Stop guessing</span>
                <span className="wt-300">which creators work.</span>
              </h2>

              <p className="split-body">
                Push gives you transaction-level attribution via QR codes. Know
                exactly which creator drove which customer — and pay for
                verified results.
              </p>

              <ul className="feature-list">
                {[
                  "Creators matched by performance score, location, and tier",
                  "QR-code attribution — zero ops burden on your side",
                  "Campaign live in under 24 hours",
                  "Starter at $19.99/mo, Growth at $69, Pro at $199",
                ].map((f) => (
                  <li key={f} className="feature-item">
                    <span className="feature-dot" />
                    <span className="feature-text">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/merchant/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>

            <div
              className="split-visual visual-merchant reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <QRVisual />
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

                <Link href="/creator/signup" className="btn btn-secondary">
                  Join as Creator — Start Free
                </Link>
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
              },
              {
                n: "02",
                title: "Creator visits & creates content",
                body: "The creator gets a unique QR code matched to their campaign — assigned based on performance score, tier, and location. Customers scan it at the point of purchase, attributing the visit directly to that creator.",
              },
              {
                n: "03",
                title: "Push verifies, merchant pays",
                body: "Every scan is logged. Payouts are released automatically after verification. No disputes, no manual tracking.",
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
              </div>
            ))}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-panel cta-panel-merchant reveal">
              <span className="cta-tag cta-tag-merchant">For Merchants</span>
              <h2 className="cta-headline">
                <span className="wt-900">Your next customer</span>
                <span className="wt-300">is already on Instagram.</span>
              </h2>
              <p className="cta-body">
                Launch a campaign in under 24 hours. Pay only for verified
                results. No agency fees. No guesswork.
              </p>
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
                From free product to $100/campaign — your performance score is
                your currency. Build it, and better campaigns come to you.
              </p>
              <Link href="/creator/signup" className="btn btn-cta-creator">
                Join Free — Start Earning
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
