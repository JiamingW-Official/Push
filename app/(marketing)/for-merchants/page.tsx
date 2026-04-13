import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./merchants.css";

/* ── ROI calculator visual ───────────────────────────────── */
function ROIVisual() {
  const bars = [
    {
      label: "Agency",
      height: 180,
      cost: "$3,000+/mo",
      color: "rgba(0,48,73,0.12)",
    },
    { label: "Ads", height: 130, cost: "$800/mo", color: "rgba(0,48,73,0.18)" },
    {
      label: "Influencer",
      height: 100,
      cost: "$500+/post",
      color: "rgba(0,48,73,0.22)",
    },
    { label: "Push", height: 36, cost: "$19.99/mo", color: "var(--primary)" },
  ];
  return (
    <div className="roi-visual">
      {bars.map((b) => (
        <div key={b.label} className="roi-bar-wrap">
          <div className="roi-bar-cost">{b.cost}</div>
          <div
            className="roi-bar"
            style={{ height: b.height, background: b.color }}
          />
          <div className="roi-bar-label">{b.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Attribution flow visual ─────────────────────────────── */
function AttributionFlow() {
  const steps = [
    { n: "1", label: "Creator posts" },
    { n: "2", label: "Customer scans QR" },
    { n: "3", label: "Visit attributed" },
    { n: "4", label: "Payout released" },
  ];
  return (
    <div className="attr-flow">
      {steps.map((s, i) => (
        <div key={s.n} className="attr-step">
          <div className="attr-step-num">{s.n}</div>
          <div className="attr-step-label">{s.label}</div>
          {i < steps.length - 1 && <div className="attr-step-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Competitor comparison table ─────────────────────────── */
const COMPARE_ROWS = [
  {
    feature: "Verified foot traffic attribution",
    push: true,
    agency: false,
    ads: false,
    influencer: false,
  },
  {
    feature: "Pay only for verified results",
    push: true,
    agency: false,
    ads: false,
    influencer: false,
  },
  {
    feature: "Campaign live in 24 hours",
    push: true,
    agency: false,
    ads: true,
    influencer: false,
  },
  {
    feature: "Zero setup fees",
    push: true,
    agency: false,
    ads: true,
    influencer: false,
  },
  {
    feature: "No long-term contracts",
    push: true,
    agency: false,
    ads: true,
    influencer: false,
  },
  {
    feature: "Creator performance scoring",
    push: true,
    agency: false,
    ads: false,
    influencer: false,
  },
  {
    feature: "Transaction-level data",
    push: true,
    agency: false,
    ads: false,
    influencer: false,
  },
  {
    feature: "Starts at $19.99/mo",
    push: true,
    agency: false,
    ads: false,
    influencer: false,
  },
];

function CheckIcon({ yes }: { yes: boolean }) {
  if (yes) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: "var(--primary)" }}
      >
        <path
          d="M3 8L6.5 11.5L13 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color: "rgba(0,48,73,0.2)" }}
    >
      <path
        d="M4 8h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Social proof numbers ────────────────────────────────── */
const PROOF_STATS = [
  { num: "$19.99", label: "Entry price per month", sub: "No setup fee" },
  {
    num: "24h",
    label: "Campaign live time",
    sub: "From signup to first creator",
  },
  { num: "3.9×", label: "Average ROI", sub: "vs. paid social" },
  { num: "0", label: "Setup fees, ever", sub: "Cancel anytime" },
];

export default function ForMerchantsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="merch-hero">
        <div className="container merch-hero-inner">
          <div className="merch-hero-content">
            <p className="eyebrow merch-eyebrow">Push for Merchants</p>
            <h1 className="merch-headline">
              <span className="mh-black">Stop paying</span>
              <span className="mh-light">for guesswork.</span>
            </h1>
            <p className="merch-sub">
              Push gives you transaction-level attribution via QR codes. Know
              exactly which creator drove which customer — and pay only for
              verified foot traffic. No agency. No waste.
            </p>
            <div className="merch-ctas">
              <Link href="/merchant/signup" className="btn btn-primary">
                Start for $19.99 / mo
              </Link>
              <Link href="/demo/merchant" className="btn btn-ghost merch-ghost">
                See live demo →
              </Link>
            </div>
            <p className="merch-reassure">
              No credit card required to explore · Cancel anytime
            </p>
          </div>

          {/* Proof stats */}
          <div className="merch-hero-proof">
            {PROOF_STATS.map((s, i) => (
              <div
                key={s.num}
                className="merch-proof-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="merch-proof-num">{s.num}</span>
                <span className="merch-proof-label">{s.label}</span>
                <span className="merch-proof-sub">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Cost comparison ─────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="split">
            <div className="reveal">
              <div className="section-tag">
                <span className="section-tag-num">01</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">The Problem</span>
              </div>
              <h2 className="split-headline">
                <span className="wt-900">Creator marketing</span>
                <span className="wt-300">is broken for local businesses.</span>
              </h2>
              <p className="split-body">
                Agencies charge $3k/mo with no guarantee. Paid social burns
                budget on impressions, not customers. Influencer posts have zero
                attribution — you never know if it worked.
              </p>
              <ul className="feature-list">
                {[
                  "Traditional agencies: $3,000+/mo + long contracts",
                  "Paid social: CPM model — no foot-traffic guarantee",
                  "Manual influencer deals: zero ROI tracking",
                  "Push: flat $19.99/mo + pay per verified visit",
                ].map((f, i) => (
                  <li key={f} className="feature-item">
                    <span
                      className="feature-dot"
                      style={{
                        background:
                          i === 3 ? "var(--primary)" : "rgba(0,48,73,0.25)",
                      }}
                    />
                    <span
                      className="feature-text"
                      style={{ fontWeight: i === 3 ? 600 : undefined }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="split-visual reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <ROIVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works for merchants ────────────────────── */}
      <section className="section section-warm">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How it Works</span>
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Four steps,</span>
              <span className="wt-300">then data.</span>
            </h2>
            <p className="split-body" style={{ maxWidth: 560 }}>
              Launch a campaign in under 24 hours. Push handles creator
              matching, QR generation, attribution, and payout — you just review
              the results.
            </p>
          </div>

          <AttributionFlow />

          <div className="merch-steps-grid">
            {[
              {
                n: "01",
                title: "Post your campaign",
                body: "Set your goal, payout structure, and creator requirements. Takes 10 minutes. Push handles the rest.",
                icon: "◻",
              },
              {
                n: "02",
                title: "Creators apply",
                body: "Push matches creators to your campaign by performance score, tier, and neighbourhood proximity. You approve or auto-accept.",
                icon: "◻",
              },
              {
                n: "03",
                title: "QR attribution runs",
                body: "Each creator gets a unique QR code. When a customer scans it at purchase, the visit is attributed to that creator — down to the transaction.",
                icon: "◻",
              },
              {
                n: "04",
                title: "Pay for results",
                body: "Payouts are released automatically after verification. No manual tracking. No disputes. No agency overhead.",
                icon: "◻",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="merch-step reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="merch-step-n">{step.n}</span>
                <h3 className="merch-step-title">{step.title}</h3>
                <p className="merch-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitor comparison ─────────────────────────── */}
      <section className="section section-bright">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">03</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Comparison</span>
            </div>
            <h2>Push vs. everything else.</h2>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--text-muted)",
                maxWidth: 480,
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-8)",
                lineHeight: 1.8,
              }}
            >
              Most creator marketing tools were built for national brands. Push
              was built for the business owner who needs foot traffic this week,
              not a six-month campaign.
            </p>
          </div>

          <div
            className="merch-compare reveal"
            style={{ transitionDelay: "100ms" }}
          >
            {/* Header row */}
            <div className="compare-header">
              <div className="compare-feature-col" />
              <div className="compare-col compare-col--push">Push</div>
              <div className="compare-col">Agency</div>
              <div className="compare-col">Paid Ads</div>
              <div className="compare-col">Influencer</div>
            </div>

            {COMPARE_ROWS.map((row) => (
              <div key={row.feature} className="compare-row">
                <div className="compare-feature-col">{row.feature}</div>
                <div className="compare-col compare-col--push">
                  <CheckIcon yes={row.push} />
                </div>
                <div className="compare-col">
                  <CheckIcon yes={row.agency} />
                </div>
                <div className="compare-col">
                  <CheckIcon yes={row.ads} />
                </div>
                <div className="compare-col">
                  <CheckIcon yes={row.influencer} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
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
                Flat pricing.
                <br />
                <span style={{ fontWeight: 300, opacity: 0.45 }}>
                  No hidden fees.
                </span>
              </h2>
            </div>
            <p className="pricing-note">
              Cancel anytime. No contracts.
              <br />
              Creator payouts billed separately per campaign.
            </p>
          </div>

          <div className="pricing-grid">
            {[
              {
                name: "Starter",
                int: "$19",
                dec: ".99",
                period: "/mo",
                desc: "Perfect for a single location getting started with creator attribution.",
                features: [
                  "2 active campaigns",
                  "3 creator slots per campaign",
                  "AI creator matching",
                  "QR attribution",
                  "Basic analytics",
                ],
                featured: false,
                badge: null,
                cta: "Get Started",
                roi: "Avg. $420 attributed revenue in month 1",
              },
              {
                name: "Growth",
                int: "$69",
                dec: "",
                period: "/mo",
                desc: "Scale creator campaigns across your location. Better matching, deeper data.",
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
                roi: "Avg. 3.9× ROI on campaign spend",
              },
              {
                name: "Pro",
                int: "$199",
                dec: "",
                period: "/mo",
                desc: "For multi-location operators and brands running ongoing creator programs.",
                features: [
                  "Unlimited campaigns",
                  "Unlimited creator slots",
                  "Dedicated account manager",
                  "Custom attribution rules",
                  "API access",
                ],
                featured: false,
                badge: null,
                cta: "Get Pro",
                roi: "Full white-glove setup included",
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
                <p className="merch-plan-roi">{plan.roi}</p>
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

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="merch-final-cta section-warm">
        <div className="container">
          <div className="merch-cta-inner reveal">
            <p className="eyebrow" style={{ color: "var(--tertiary)" }}>
              Ready to start
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: "#fff",
                lineHeight: 1,
                marginBottom: "var(--space-4)",
              }}
            >
              Your next customer
              <br />
              <span
                style={{ fontWeight: 200, color: "rgba(255,255,255,0.35)" }}
              >
                is already on Instagram.
              </span>
            </h2>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "rgba(255,255,255,0.5)",
                maxWidth: 480,
                lineHeight: 1.8,
                marginBottom: "var(--space-6)",
              }}
            >
              Launch a campaign in 10 minutes. Pay only for verified visits. No
              agency fees. No long-term contracts.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                flexWrap: "wrap",
              }}
            >
              <Link href="/merchant/signup" className="btn btn-primary">
                Start for $19.99 / mo
              </Link>
              <Link href="/demo/merchant" className="btn btn-ghost merch-ghost">
                See the dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
