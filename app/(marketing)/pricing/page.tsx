import Link from "next/link";
import "./pricing.css";

/* ── Plan data (preserved from v9) ──────────────────────── */
const PLANS = [
  {
    id: "pilot",
    eyebrow: "(GET STARTED)",
    eyebrowColor: "var(--ink-3)" as const,
    name: "Pilot",
    price: "$0",
    priceSub: "/ month",
    priceNote: "Free to start · pay per verified visit",
    features: [
      "1 active campaign",
      "QR poster + shareable link",
      "Basic visit dashboard",
      "Up to 50 verified visits / mo",
      "Email support",
      "No commitment, no card required",
    ],
    ctaLabel: "Start Free",
    ctaHref: "/merchant/signup",
    ctaVariant: "ghost" as const,
    highlight: false,
  },
  {
    id: "growth",
    eyebrow: "(MOST POPULAR)",
    eyebrowColor: "var(--ga-orange)" as const,
    name: "Growth",
    price: "$49",
    priceSub: "/ month",
    priceNote: "+ per verified visit fee",
    features: [
      "3 concurrent campaigns",
      "Multi-creator outreach",
      "Real-time scan dashboard",
      "200 verified visits / mo included",
      "Weekly payout reports",
      "Priority support",
      "Creator performance metrics",
      "Monthly strategy call",
    ],
    ctaLabel: "Start Growth",
    ctaHref: "/merchant/signup?plan=growth",
    ctaVariant: "primary" as const,
    highlight: true,
  },
  {
    id: "scale",
    eyebrow: "(ENTERPRISE)",
    eyebrowColor: "var(--ink-3)" as const,
    name: "Scale",
    price: "Custom",
    priceSub: "",
    priceNote: "Unlimited visits · dedicated support",
    features: [
      "Unlimited campaigns",
      "Multi-location support",
      "Dedicated success rep",
      "Custom analytics exports",
      "White-label QR materials",
      "API access",
      "SLA uptime guarantee",
      "Quarterly business review",
    ],
    ctaLabel: "Contact Sales",
    ctaHref: "/contact?inquiry=scale",
    ctaVariant: "secondary" as const,
    highlight: false,
  },
] as const;

/* ── Comparison table rows ───────────────────────────────── */
const TABLE_ROWS: {
  feature: string;
  push: string;
  yelp: string;
  influencer: string;
  groupon: string;
  pushIsGood: boolean;
}[] = [
  {
    feature: "Verified physical visits",
    push: "✓ Yes",
    yelp: "✗ Never",
    influencer: "Partial",
    groupon: "✗ Never",
    pushIsGood: true,
  },
  {
    feature: "Local NYC creators",
    push: "✓ Yes",
    yelp: "✗ No",
    influencer: "✗ No",
    groupon: "✗ No",
    pushIsGood: true,
  },
  {
    feature: "Pay per visit model",
    push: "✓ Yes",
    yelp: "✗ CPM",
    influencer: "✗ Retainer",
    groupon: "✗ Rev share",
    pushIsGood: true,
  },
  {
    feature: "No upfront cost",
    push: "✓ Yes",
    yelp: "✗ Deposit",
    influencer: "✗ Monthly",
    groupon: "✗ Setup fee",
    pushIsGood: true,
  },
  {
    feature: "Real-time dashboard",
    push: "✓ Yes",
    yelp: "✓ Basic",
    influencer: "✗ No",
    groupon: "Partial",
    pushIsGood: true,
  },
  {
    feature: "Fraud prevention",
    push: "✓ Yes",
    yelp: "✗ None",
    influencer: "✗ None",
    groupon: "✗ None",
    pushIsGood: true,
  },
];

/* ── Page ────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <div className="pv11-wrapper">
      {/* ═══════════════════════════════════════════════════════
          PANEL 1 — SUB-HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="pv11-hero" aria-label="Pricing hero">
        <div className="pv11-hero-inner">
          <p className="pv11-eyebrow">(PRICING)</p>
          <h1 className="pv11-hero-h1">
            Pay for visits,
            <br />
            not promises.
          </h1>
          <p className="pv11-hero-sub">
            No impressions. No estimates. You pay only when a verified creator
            physically visits your location.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SIG DIVIDER
          ═══════════════════════════════════════════════════════ */}
      <div className="pv11-sig-wrap" aria-hidden="true">
        <span className="sig-divider">
          Story&nbsp;·&nbsp;Scan&nbsp;·&nbsp;Pay&nbsp;·
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PANEL 2 — PRICING PLANS (Candy Butter)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="candy-panel pv11-plans-panel"
        id="pricing"
        aria-label="Pricing plans"
      >
        <p className="pv11-section-eyebrow" style={{ color: "var(--ink-3)" }}>
          (THE PLANS)
        </p>
        <h2 className="pv11-section-h2">
          Three ways
          <br />
          to run Push.
        </h2>

        {/* Plan cards grid */}
        <div className="pv11-plans-grid">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`pv11-plan-card lg-surface click-shift${plan.highlight ? " pv11-plan-card--highlight" : ""}`}
            >
              <p
                className="pv11-plan-eyebrow"
                style={{ color: plan.eyebrowColor }}
              >
                {plan.eyebrow}
              </p>
              <h3 className="pv11-plan-name">{plan.name}</h3>

              {/* Price */}
              <div className="pv11-price-row">
                <span className="pv11-price-main">{plan.price}</span>
                {plan.priceSub && (
                  <span className="pv11-price-sub">{plan.priceSub}</span>
                )}
              </div>
              <p className="pv11-price-note">{plan.priceNote}</p>

              {/* Feature list */}
              <ul className="pv11-feature-list">
                {plan.features.map((f) => (
                  <li key={f} className="pv11-feature-item">
                    <span className="pv11-check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.ctaVariant === "ghost" && (
                <Link
                  href={plan.ctaHref}
                  className="btn btn-ghost pv11-card-cta"
                >
                  {plan.ctaLabel}
                </Link>
              )}
              {plan.ctaVariant === "primary" && (
                <Link
                  href={plan.ctaHref}
                  className="btn btn-primary pv11-card-cta"
                >
                  {plan.ctaLabel}
                </Link>
              )}
              {plan.ctaVariant === "secondary" && (
                <Link
                  href={plan.ctaHref}
                  className="btn btn-secondary pv11-card-cta"
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="pv11-plans-fine">
          All plans · Cancel any time · No setup fee · Annual saves 16%
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 3 — EDITORIAL TABLE (Cinema-Selects comparison)
          ═══════════════════════════════════════════════════════ */}
      <section className="pv11-table-panel" aria-label="Feature comparison">
        <h2 className="pv11-table-h2">How Push stacks up.</h2>

        {/* Grid-based table — no <table> tag */}
        <div
          className="pv11-comp-table"
          role="table"
          aria-label="Feature comparison table"
        >
          {/* Header row */}
          <div className="pv11-trow pv11-trow--head" role="row">
            <div className="pv11-tcell pv11-tcell--feature" role="columnheader">
              (WHAT YOU GET)
            </div>
            <div className="pv11-tcell pv11-tcell--push" role="columnheader">
              (PUSH)
            </div>
            <div className="pv11-tcell" role="columnheader">
              (YELP ADS)
            </div>
            <div className="pv11-tcell" role="columnheader">
              (INFLUENCER)
            </div>
            <div className="pv11-tcell pv11-tcell--last" role="columnheader">
              (GROUPON)
            </div>
          </div>

          {/* Data rows */}
          {TABLE_ROWS.map((row) => (
            <div className="pv11-trow" role="row" key={row.feature}>
              <div className="pv11-tcell pv11-tcell--feature" role="cell">
                {row.feature}
              </div>
              <div
                className="pv11-tcell pv11-tcell--push"
                role="cell"
                style={{
                  color: row.push.startsWith("✓")
                    ? "var(--brand-red)"
                    : "var(--ink-3)",
                  fontWeight: row.push.startsWith("✓") ? 700 : 400,
                }}
              >
                {row.push}
              </div>
              <div
                className="pv11-tcell"
                role="cell"
                style={{
                  color: row.yelp.startsWith("✗")
                    ? "var(--ink-4)"
                    : "var(--ink-3)",
                }}
              >
                {row.yelp}
              </div>
              <div
                className="pv11-tcell"
                role="cell"
                style={{
                  color: row.influencer.startsWith("✗")
                    ? "var(--ink-4)"
                    : "var(--ink-3)",
                }}
              >
                {row.influencer}
              </div>
              <div
                className="pv11-tcell pv11-tcell--last"
                role="cell"
                style={{
                  color: row.groupon.startsWith("✗")
                    ? "var(--ink-4)"
                    : "var(--ink-3)",
                }}
              >
                {row.groupon}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SIG DIVIDER
          ═══════════════════════════════════════════════════════ */}
      <div className="pv11-sig-wrap" aria-hidden="true">
        <span className="sig-divider">
          End of receipt&nbsp;·&nbsp;Fin&nbsp;·
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PANEL 4 — TICKET (GA Orange CTA)
          ═══════════════════════════════════════════════════════ */}
      <div className="ticket-panel pv11-ticket" aria-label="Get started CTA">
        {/* Four corner grommets */}
        {(
          [
            { top: "24px", left: "24px" },
            { top: "24px", right: "24px" },
            { bottom: "24px", left: "24px" },
            { bottom: "24px", right: "24px" },
          ] as React.CSSProperties[]
        ).map((pos, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              ...pos,
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid var(--ink)",
              background: "transparent",
            }}
          />
        ))}

        {/* Central content */}
        <div className="pv11-ticket-content">
          <h2 className="pv11-ticket-h2">
            Start counting
            <br />
            real visits.
          </h2>
          <p className="pv11-ticket-sub">
            Set up in under 10 minutes. First 30 days free.
          </p>
          <div className="pv11-ticket-ctas">
            <Link href="/merchant/signup" className="btn btn-ink click-shift">
              Get Started Free
            </Link>
            <Link href="#pricing" className="btn btn-ghost click-shift">
              See Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
