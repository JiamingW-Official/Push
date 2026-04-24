import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./merchants.css";

/* ── Creator tier data ───────────────────────────────────────── */
const TIERS = [
  {
    slug: "seed",
    name: "Seed",
    followers: "Any — 0 minimum",
    campaignSize: "$0 — Free product",
    color: "#b8a99a",
    note: "Entry tier. No followers required.",
  },
  {
    slug: "explorer",
    name: "Explorer",
    followers: "500 – 2K",
    campaignSize: "$12 – $18 / visit",
    color: "#8c6239",
    note: "Proven consistency over 3+ campaigns.",
  },
  {
    slug: "operator",
    name: "Operator",
    followers: "2K – 8K",
    campaignSize: "$20 – $35 + 3%",
    color: "#4a5568",
    note: "Commission unlocked. Bonus at 30 tx/mo.",
  },
  {
    slug: "proven",
    name: "Proven",
    followers: "8K – 25K",
    campaignSize: "$32 – $55 + 5%",
    color: "#c9a96e",
    note: "Trusted track record. Higher-value campaigns.",
  },
  {
    slug: "closer",
    name: "Closer",
    followers: "25K – 100K",
    campaignSize: "$55 – $80 + 7%",
    color: "#9b111e",
    note: "Top performers. Priority campaign access.",
  },
  {
    slug: "partner",
    name: "Partner",
    followers: "100K+",
    campaignSize: "$100 – $200 + 10%",
    color: "#1a1a2e",
    note: "Elite tier. Top per-visit rate ($35 avg) + Studio anchor status.",
  },
];

/* ── Pricing plans ───────────────────────────────────────────── */
const PLANS = [
  {
    name: "Essentials",
    price: "$99",
    period: "/mo",
    desc: "Flat pricing for legacy neighborhood shops.",
    features: [
      "3 active campaigns",
      "5 creator slots",
      "QR + receipt attribution",
      "Weekly ROI card",
    ],
    featured: false,
    badge: undefined as string | undefined,
    cta: "Start Essentials",
    roi: "Designed for $5K–$25K monthly revenue shops",
  },
  {
    name: "Pro",
    price: "5%",
    period: " of attributed revenue",
    desc: "Outcome-based Year 1. Cap $179, floor $49 — pay only when Push works.",
    features: [
      "Unlimited campaigns",
      "Three-signal attribution",
      "Live ROI dashboard",
      "Priority support",
    ],
    featured: true,
    badge: "Most chosen",
    cta: "Talk to us about Pro",
    roi: "13.8x LTV/CAC at maturity",
  },
  {
    name: "Advanced",
    price: "$349",
    period: "/mo",
    desc: "Multi-unit operators with API + dedicated CSM.",
    features: [
      "Everything in Pro, flat",
      "Up to 5 locations",
      "Custom attribution rules",
      "API access",
    ],
    featured: false,
    badge: undefined as string | undefined,
    cta: "Talk to us",
    roi: "For 2+ locations",
  },
];

export default function ForMerchantsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ═══════════════ 01 — HERO ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette fm-hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill + date */}
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
            For venues in SoHo / Tribeca / Chinatown
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Pilot opens June 22
          </span>
        </div>

        {/* Hero center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 10vh, 120px)",
            paddingBottom: "clamp(48px, 10vh, 120px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            The deal
          </div>

          {/* Massive Darky 900 headline + brand-red period */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 14vw, 220px)",
              fontWeight: 900,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: "#fff",
              margin: 0,
            }}
          >
            Pay per visit
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
              fontSize: "clamp(40px, 8vw, 124px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            Real foot traffic.
          </div>

          <p
            style={{
              marginTop: "clamp(32px, 5vw, 56px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            A creator posts about your spot. Someone who saw the post walks
            through your door. We time-stamp the visit at your register. You pay
            only after that — never before. That&apos;s it.
          </p>
          <p
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.46)",
            }}
          >
            Lower Manhattan pilot opens June&nbsp;22. Five anchored venues, ten
            creators on the roster. Jiaming, the founder, walks the doors
            himself.
          </p>

          {/* CTAs */}
          <div
            style={{
              marginTop: "clamp(32px, 4vw, 48px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/merchant/signup" className="btn btn-primary">
              Open my venue
            </Link>
            <Link href="#pricing" className="btn fm-outline-btn">
              See the numbers
            </Link>
          </div>

          {/* Stats / KPI row */}
          <div
            style={{
              marginTop: "clamp(40px, 6vw, 72px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "clamp(16px, 3vw, 48px)",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              maxWidth: 960,
            }}
          >
            {[
              {
                value: "$8–35",
                label: "per verified visit",
                note: "by tier — you set ceiling",
                tint: "var(--brand-red)",
              },
              {
                value: "0",
                label: "monthly retainer",
                note: "while we earn it",
                tint: "var(--champagne)",
              },
              {
                value: "24h",
                label: "campaign live",
                note: "from signup to first scan",
                tint: "var(--cat-fitness)",
              },
            ].map((s) => (
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
                  {s.value}
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
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {s.note}
                </div>
              </div>
            ))}
          </div>
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
              <span>Coffee</span>
              <span>Bakery</span>
              <span>Studio</span>
              <span>Wear</span>
              <span>Bar</span>
              <span>After-hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 — PROBLEM / SOLUTION ═══════════════ */}
      <section className="section section-bright fm-ps-section">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 64 }}>
            <div className="section-marker" data-num="02">
              What you&apos;re replacing
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              The before
              <br />
              <span className="display-ghost">and the after.</span>
            </h2>
          </div>

          <div className="fm-ps-grid">
            {/* Left: Problem */}
            <div className="fm-ps-col reveal">
              <p className="fm-ps-label fm-ps-label--problem">Right now</p>
              <p className="fm-ps-statement">
                <strong>You pay for views</strong>
                <span className="fm-ps-ghost" aria-hidden="true">
                  You pay for views
                </span>
                <br />
                that never come in.
              </p>
              <ul className="fm-ps-list">
                <li>
                  <span className="fm-ps-bullet" />
                  Agency retainers: $3,000+ a month, locked in for a year
                </li>
                <li>
                  <span className="fm-ps-bullet" />
                  Instagram ads: charged per impression, no door check
                </li>
                <li>
                  <span className="fm-ps-bullet" />
                  Influencer one-offs: a tagged story, then silence
                </li>
              </ul>
            </div>

            {/* Vertical rule */}
            <div className="fm-ps-divider" aria-hidden="true" />

            {/* Right: Solution */}
            <div
              className="fm-ps-col reveal"
              style={{ transitionDelay: "120ms" }}
            >
              <p className="fm-ps-label fm-ps-label--solution">With Push</p>
              <p className="fm-ps-statement fm-ps-statement--solution">
                <strong>You pay only when</strong>
                <span
                  className="fm-ps-ghost fm-ps-ghost--solution"
                  aria-hidden="true"
                >
                  You pay only when
                </span>
                <br />
                someone walks in.
              </p>
              <ul className="fm-ps-list fm-ps-list--solution">
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Every visit time-stamped at your register, in the receipt log
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Payouts release after the scan, not before
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  First campaign live in 24 hours. No card required to look.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 — HOW IT WORKS ═══════════════ */}
      <section className="section fm-how-section">
        <div className="container">
          <div
            className="reveal"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: "clamp(40px, 6vw, 80px)",
            }}
          >
            <div>
              <div className="section-marker" data-num="03">
                How it works
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                Three steps.
                <br />
                <span className="display-ghost">Zero guesswork.</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                maxWidth: 320,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              From signup to first verified visit
              <br />
              is usually under a week. We move
              <br />
              at the speed you can handle.
            </p>
          </div>

          <ol className="fm-how-list">
            {[
              {
                n: "01",
                title: "Write the brief",
                body: "Tell us your spot, your budget ceiling per visit, what you want creators to mention. Ten minutes. We handle the matching, QR posters, and the receipt-side wiring after that.",
              },
              {
                n: "02",
                title: "Approve the creators",
                body: "Push surfaces a shortlist by tier and proximity — we know which ones are within a six-block walk of your door. You approve, or set auto-accept above a tier threshold. Every creator is vetted before they post.",
              },
              {
                n: "03",
                title: "Pay after the door opens",
                body: "Payouts release on QR-verified visits, never on impressions. We invoice weekly with the full ledger — every scan, every receipt, every cent. No agency markup, no clawbacks.",
              },
            ].map((step, i) => (
              <li
                key={step.n}
                className="fm-how-item reveal"
                style={{ transitionDelay: `${i * 110}ms` }}
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

      {/* ═══════════════ 04 — CREATOR TIERS ═══════════════ */}
      <section className="section section-bright fm-tiers-section">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <div className="section-marker" data-num="04">
              Who you&apos;re hiring
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: "var(--ink)",
                margin: "0 0 16px",
              }}
            >
              Six tiers.
              <br />
              <span className="display-ghost">Every creator vetted.</span>
            </h2>
            <p className="fm-tiers-sub">
              From zero-follower newcomers walking the neighborhood to
              hundred-thousand-strong partners. Everyone is ranked by what
              actually happened — visits driven, retention rate — not how many
              followers they bought.
            </p>
          </div>

          <div
            className="fm-tier-grid reveal"
            style={{ transitionDelay: "80ms" }}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.slug}
                className={`fm-tier-card fm-tier-card--${tier.slug}`}
              >
                <span
                  className="fm-tier-swatch"
                  style={{ background: tier.color }}
                  aria-hidden="true"
                />
                <span className="fm-tier-name">{tier.name}</span>
                <div className="fm-tier-row">
                  <span className="fm-tier-meta-label">Followers</span>
                  <span className="fm-tier-meta-val">{tier.followers}</span>
                </div>
                <div className="fm-tier-row">
                  <span className="fm-tier-meta-label">Campaign size</span>
                  <span className="fm-tier-meta-val fm-tier-meta-val--price">
                    {tier.campaignSize}
                  </span>
                </div>
                <p className="fm-tier-note">{tier.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 — PRICING ═══════════════ */}
      <section id="pricing" className="section fm-pricing-section">
        <div className="container">
          <div
            className="fm-pricing-header reveal"
            style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}
          >
            <div>
              <div className="section-marker" data-num="05">
                What it costs
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                Flat or outcome-based.
                <br />
                <span className="display-ghost">No hidden fees.</span>
              </h2>
            </div>
            <p className="fm-pricing-note">
              Cancel anytime. No setup fees.
              <br />
              Creator payouts billed separately per campaign.
            </p>
          </div>

          <div className="fm-plans">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`fm-plan reveal${plan.featured ? " fm-plan--featured" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {i < PLANS.length - 1 && (
                  <div className="fm-plan-rule" aria-hidden="true" />
                )}
                {plan.badge && (
                  <span className="fm-plan-badge">{plan.badge}</span>
                )}
                <h3 className="fm-plan-name">{plan.name}</h3>
                <div className="fm-plan-price">
                  <span className="fm-plan-price-int">{plan.price}</span>
                  <span className="fm-plan-price-period">{plan.period}</span>
                </div>
                <p className="fm-plan-desc">{plan.desc}</p>
                <ul className="fm-plan-features">
                  {plan.features.map((f) => (
                    <li key={f} className="fm-plan-feature">
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="fm-plan-roi">{plan.roi}</p>
                <Link
                  href="/merchant/signup"
                  className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"} fm-plan-cta`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="fm-pricing-full-link">
            <Link href="/pricing" className="fm-link-underline">
              Full pricing — including per-visit rates by tier →
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════════ 06 — PULL QUOTE ═══════════════ */}
      <section className="section section-bright fm-quote-section">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <div className="section-marker" data-num="06">
              From a venue owner
            </div>
          </div>
          <div className="fm-quote-wrap reveal">
            <span className="fm-quote-rule" aria-hidden="true" />
            <blockquote className="fm-pull-quote">
              <p className="fm-pull-quote-text">
                &ldquo;We got 340 verified walk-ins in six weeks. We never paid
                for a single click.&rdquo;
              </p>
              <footer className="fm-pull-quote-footer">
                <cite className="fm-pull-quote-cite">
                  Owner, Roberta&apos;s Bed-Stuy &mdash; Brooklyn, NYC
                </cite>
                <span className="fm-pull-quote-meta">
                  Essentials plan &nbsp;·&nbsp; 6 active creators &nbsp;·&nbsp;
                  $99/mo
                </span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 — FINAL CTA ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette fm-final-cta"
        style={{
          position: "relative",
          padding: "clamp(120px, 16vw, 200px) clamp(24px, 4vw, 64px)",
          overflow: "hidden",
        }}
      >
        <div
          className="reveal"
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div
            className="section-marker"
            data-num="07"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Open the door
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 11vw, 168px)",
              fontWeight: 900,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: "#fff",
              margin: 0,
              maxWidth: 1100,
            }}
          >
            Door open
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.04em",
              }}
            >
              .
            </span>
          </h2>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(40px, 8vw, 112px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            Money on results.
          </div>

          <p
            style={{
              marginTop: "clamp(28px, 4vw, 48px)",
              maxWidth: 540,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Ten minutes to write the brief. Twenty-four hours to first scan.
            Pilot opens June&nbsp;22 in SoHo, Tribeca, and Chinatown — Jiaming
            walks the doors himself.
          </p>

          <div
            style={{
              marginTop: "clamp(28px, 4vw, 40px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/merchant/signup"
              className="btn btn-primary fm-final-btn"
            >
              Open my venue
            </Link>
            <Link href="#pricing" className="btn fm-outline-btn">
              See the numbers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
