import Link from "next/link";
import "./pricing.css";

/* ── Tier data ────────────────────────────────────────────────── */
const TIERS: Array<{
  id: string;
  eyebrow: string;
  name: string;
  price: string;
  priceSub: string;
  priceNote: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaClass: string;
  variant: "default" | "highlight" | "scale";
}> = [
  {
    id: "starter",
    eyebrow: "(GET STARTED)",
    name: "Starter",
    price: "$0",
    priceSub: "/ month",
    priceNote: "Free to start · pay per verified visit",
    features: [
      "1 active campaign",
      "QR poster + shareable link",
      "Basic visit dashboard",
      "Up to 50 verified visits / mo",
      "Email support",
      "No card required",
    ],
    ctaLabel: "Start Free",
    ctaHref: "/merchant/signup",
    ctaClass: "btn btn-ghost",
    variant: "default",
  },
  {
    id: "growth",
    eyebrow: "(RECOMMENDED)",
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
    ctaClass: "btn btn-ink",
    variant: "highlight",
  },
  {
    id: "scale",
    eyebrow: "(ENTERPRISE)",
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
    ctaClass: "btn btn-primary",
    variant: "default",
  },
];

/* ── Comparison table rows ────────────────────────────────────── */
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

/* ── Grommet corner positions (Ticket Panel spec §8.2 — 4 corners) */
const GROMMETS: React.CSSProperties[] = [
  { top: "24px", left: "24px" },
  { top: "24px", right: "24px" },
  { bottom: "24px", left: "24px" },
  { bottom: "24px", right: "24px" },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <div className="pv11-wrapper">
      {/* ═══════════════════════════════════════════════════════════
          PANEL 1 — HERO  (bg: --surface  warm ivory)
          H1 bottom-left anchored — Design.md § 7.1 STRICT
          ═══════════════════════════════════════════════════════════ */}
      <section className="pv11-hero" aria-label="Pricing hero">
        {/* Decorative ghost numeral — top-right bleeds off */}
        <div className="pv11-hero-ghost" aria-hidden="true">
          $0
        </div>

        {/* Bottom-left title block — STRICT corner anchor */}
        <div className="pv11-hero-inner">
          <p className="pv11-eyebrow">(PUSH·PRICING)</p>
          <h1 className="pv11-hero-h1">
            Pricing that
            <br />
            scales with you.
          </h1>
          <p className="pv11-hero-sub">
            No impressions. No estimates. Pay only when a verified creator
            physically walks through your door.
          </p>
          <div className="pv11-hero-ctas">
            <Link href="/merchant/signup" className="btn btn-primary">
              Start Free
            </Link>
            <Link href="#pricing" className="btn btn-ghost">
              See Plans
            </Link>
          </div>
        </div>

        {/* Liquid-glass stat tile — bottom right (§8.9) */}
        <div className="pv11-hero-badge" aria-label="Free to start">
          <span className="pv11-badge-num">$0</span>
          <span className="pv11-badge-label">To get started today</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PANEL 2 — TIER CARDS  (bg: --surface-2  Pearl Stone)
          3 pricing tiers — Design.md § 8.1
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        className="pv11-tiers-panel"
        aria-label="Pricing tiers"
      >
        <div className="pv11-tiers-header">
          <p className="pv11-section-eyebrow">(THE PLANS)</p>
          <h2 className="pv11-section-h2">Three ways to run Push.</h2>
        </div>

        <div className="pv11-tiers-grid">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`pv11-tier-card${tier.variant === "highlight" ? " pv11-tier-card--highlight" : tier.id === "scale" ? " pv11-tier-card--scale" : ""}`}
            >
              {/* RECOMMENDED pill — Champagne on highlight card (≤3/vp) */}
              {tier.variant === "highlight" && (
                <div
                  className="pv11-recommended-pill"
                  aria-label="Most popular plan"
                >
                  RECOMMENDED
                </div>
              )}

              <p className="pv11-tier-eyebrow">{tier.eyebrow}</p>
              <h3 className="pv11-tier-name">{tier.name}</h3>

              {/* Price numeral — Darky 800 64px per spec */}
              <div className="pv11-price-row">
                <span className="pv11-price-main">{tier.price}</span>
                {tier.priceSub && (
                  <span className="pv11-price-sub">{tier.priceSub}</span>
                )}
              </div>
              <p className="pv11-price-note">{tier.priceNote}</p>

              {/* Feature list — 12px mono + brand-red checkmark */}
              <ul className="pv11-feature-list">
                {tier.features.map((f) => (
                  <li key={f} className="pv11-feature-item">
                    <span className="pv11-check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA — unified button system §9 */}
              <Link
                href={tier.ctaHref}
                className={`${tier.ctaClass} pv11-tier-cta`}
              >
                {tier.ctaLabel}
              </Link>
            </article>
          ))}
        </div>

        <p className="pv11-tiers-fine">
          All plans&nbsp;·&nbsp;Cancel any time&nbsp;·&nbsp;No setup
          fee&nbsp;·&nbsp;Annual saves 16%
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MAGVIX ITALIC SIGNATURE DIVIDER between panel 2 + 3
          Design.md § 8.5 — ≤2 per page
          ═══════════════════════════════════════════════════════════ */}
      <div className="pv11-sig-wrap" aria-hidden="true">
        <span className="sig-divider">
          End of free tier&nbsp;·&nbsp;Fin&nbsp;·&nbsp;Start scaling now&nbsp;·
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PANEL 3 — TICKET PANEL (GA Orange — ≤1 per page)
          Annual pricing / special offer
          Design.md § 8.2 — grommets + dashed perf + Magvix italic centered
          ═══════════════════════════════════════════════════════════ */}
      <div className="ticket-panel pv11-ticket" aria-label="Annual plan offer">
        {/* Four corner grommets — 16px diameter, 24px inset (§8.2 STRICT) */}
        {GROMMETS.map((pos, i) => (
          <div
            key={i}
            className="pv11-grommet"
            aria-hidden="true"
            style={pos}
          />
        ))}

        {/* Centered content — exception to corner-anchor rule per §7.1 */}
        <div className="pv11-ticket-content">
          <p className="pv11-ticket-eyebrow">(ANNUAL PLAN)</p>
          <h2 className="pv11-ticket-h2">
            Save 16% with
            <br />
            an annual plan.
          </h2>
          <p className="pv11-ticket-sub">
            Lock in your rate and get 2 months free. Set up in under 10 minutes.
          </p>
          <div className="pv11-ticket-ctas">
            <Link
              href="/merchant/signup?billing=annual"
              className="btn btn-ink"
            >
              Get Annual Plan
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAGVIX ITALIC SIGNATURE DIVIDER 2
          ═══════════════════════════════════════════════════════════ */}
      <div className="pv11-sig-wrap" aria-hidden="true">
        <span className="sig-divider">
          Posted&nbsp;·&nbsp;Scanned&nbsp;·&nbsp;Verified&nbsp;·
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PANEL 4 — FAQ / COMPARISON TABLE  (bg: --surface  Ivory)
          Editorial Table style — Cinema-Selects
          Design.md § 8.6 — mono 12px 700 uppercase headers + Darky 20px first col
          ═══════════════════════════════════════════════════════════ */}
      <section className="pv11-table-panel" aria-label="Feature comparison">
        <div className="pv11-table-inner">
          <p className="pv11-table-eyebrow">(HOW IT COMPARES)</p>
          <h2 className="pv11-table-h2">How Push stacks up.</h2>

          {/* Grid-based editorial table */}
          <div
            className="pv11-comp-table"
            role="table"
            aria-label="Push vs competitors feature comparison"
          >
            {/* Header row */}
            <div className="pv11-trow pv11-trow--head" role="row">
              <div
                className="pv11-tcell pv11-tcell--feature"
                role="columnheader"
              >
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
                      ? "var(--ink-5)"
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
                      ? "var(--ink-5)"
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
                      ? "var(--ink-5)"
                      : "var(--ink-3)",
                  }}
                >
                  {row.groupon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
