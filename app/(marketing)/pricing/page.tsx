import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerticalSelector from "./_parts/VerticalSelector";
import RetentionTabs from "./_parts/RetentionTabs";
import CompareDeepDive from "./_parts/CompareDeepDive";
import "../landing.css";
import "./pricing.css";

/* ── Plan data (v5.1 tier-based per-customer pricing) ──────── */
const PLANS = [
  {
    name: "Pilot",
    price: "$0",
    period: "for first 10 Coffee+ merchants",
    desc: "Up to 10 AI-verified customers free. No credit card. Auto-flips to Operator after customer 10. Per-neighborhood cap $4,200.",
    features: [
      "First 10 AI-verified customers free",
      "Williamsburg Coffee+ beachhead only",
      "3-layer verification (QR + Claude Vision + geo)",
      "No credit card · no contract",
      "Auto-flip to Operator after customer 10",
      "72h dispute SLA · shared queue",
    ],
    featured: false,
    cta: "Apply for $0 Pilot",
    href: "/merchant/pilot",
    roi: "Per-neighborhood cap $4,200",
  },
  {
    name: "Operator",
    price: "$500",
    period: "/mo min + $15–85 per verified customer",
    desc: "Monthly base in arrears + per-customer rate tiered to your vertical. Retention Add-on opt-in. ConversionOracle™ live on every campaign.",
    features: [
      "$500/mo minimum (billed in arrears)",
      "Coffee $15 · Coffee+ $25 · Dessert $22",
      "Fitness $60 · Beauty $85",
      "Retention Add-on: $8/$6/$4 (coffee tier)",
      "Unlimited campaigns · 24h SLA",
      "Creator T2–T6 access",
    ],
    featured: true,
    badge: "Most verified",
    cta: "Talk to ops agent",
    href: "/merchant/signup",
    roi: "$15–85 per verified customer · tiered by vertical",
  },
  {
    name: "Neighborhood",
    price: "Custom",
    period: "$8–12K launch + $20–35K MRR target",
    desc: "Multi-location operator. Launch package covers Pilot subsidy, ops analyst, creator recruitment. 5.1-month payback per neighborhood.",
    features: [
      "$8,000–12,000 launch package (one-time)",
      "$20,000–35,000 MRR target by Month 12",
      "Dedicated ops analyst · 24h SLA",
      "Retention Add-on included",
      "Custom ConversionOracle™ tuning",
      "Top-100 Closer + Equity creator access",
    ],
    featured: false,
    cta: "Contact sales",
    href: "/merchant/enterprise",
    roi: "5.1-month neighborhood payback",
  },
];

/* ── LTV/CAC cohort stats (Williamsburg Coffee+ pilot M3) ───── */
const LTV_STATS = [
  {
    label: "Merchant LTV",
    value: "$6,579",
    note: "Avg Coffee+ merchant · 90-day retention cohort",
  },
  {
    label: "CAC blended",
    value: "$420",
    note: "Push per-customer + creator cost + ops overhead",
  },
  {
    label: "LTV / CAC",
    value: "15.7x",
    note: "Base ratio before Retention Add-on LTV amortization",
  },
];

/* ── Check icon ───────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ══ 1. HERO ═════════════════════════════════════════════ */}
      <section className="pr-hero">
        <div className="container pr-hero-inner">
          <div className="pr-hero-label reveal">
            <span className="eyebrow pr-hero-eyebrow">Vertical AI Pricing</span>
            <span className="rule" />
            <span className="pr-hero-eyebrow-sub">
              Customer Acquisition Engine · Williamsburg Coffee+ beachhead
            </span>
          </div>

          <h1 className="pr-hero-h">
            <span
              className="pr-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              Tiered by vertical.
            </span>
            <span
              className="pr-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              Not SaaS.
            </span>
          </h1>

          <div
            className="pr-hero-selector reveal"
            style={{ transitionDelay: "220ms" }}
          >
            <VerticalSelector />
          </div>

          <div
            className="pr-hero-bottom reveal"
            style={{ transitionDelay: "280ms" }}
          >
            <p className="pr-hero-sub">
              Push is vertical AI for local commerce — per-customer rates
              derived from each vertical&apos;s gross-margin math, never flat.
              Unit economics work at every vertical or we don&apos;t launch it.
            </p>
            <div className="pr-hero-anchors">
              <a href="#plans" className="btn btn-primary">
                See plans
              </a>
              <a href="#deep-dive" className="btn btn-secondary">
                Compare plans
              </a>
            </div>
          </div>

          <span className="pr-hero-ghost" aria-hidden="true">
            Vertical
          </span>
        </div>
      </section>

      {/* ══ 2. 3-PLAN GRID ══════════════════════════════════════ */}
      <section id="plans" className="section pr-plans-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">01</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Merchant plans</span>
          </div>

          <h2 className="pr-plans-h reveal">
            Three plans.{" "}
            <span className="pr-plans-h-light">One unit-economic rule.</span>
          </h2>

          <div className="pc pr-plans-grid">
            {PLANS.map((plan, i) => (
              <article
                key={plan.name}
                className={`pc-card pr-plan reveal${
                  plan.featured ? " pr-plan--featured" : ""
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.badge && (
                  <div className="pr-plan-badge">{plan.badge}</div>
                )}

                <div className="pr-plan-header">
                  <h3 className="pr-plan-name">{plan.name}</h3>
                  <div className="pr-plan-price-row">
                    <span className="pr-plan-price-int">{plan.price}</span>
                    <span className="pr-plan-price-period">{plan.period}</span>
                  </div>
                  <p className="pr-plan-desc">{plan.desc}</p>
                </div>

                <ul className="pr-plan-features">
                  {plan.features.map((f) => (
                    <li key={f} className="pr-plan-feature">
                      <span className="pr-plan-check">
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pr-plan-footer">
                  <p className="pr-plan-roi">{plan.roi}</p>
                  <Link
                    href={plan.href}
                    className={`btn ${
                      plan.featured ? "btn-primary" : "btn-secondary"
                    } pr-plan-cta`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="pr-plans-note reveal">
            $0 Pilot means $0 — no credit card. Auto-flip to Operator after your
            10th AI-verified customer. Per-customer rates derived from each
            vertical&apos;s gross-margin math. Never flat, never markup.
          </p>
        </div>
      </section>

      {/* ══ 3. RETENTION ADD-ON TABS ═════════════════════════════ */}
      <section className="section-bright pr-retention-section">
        <div className="container pr-retention-inner">
          <div className="pr-retention-left reveal">
            <p className="eyebrow pr-retention-eyebrow">Retention Add-on</p>
            <h2 className="pr-retention-h">
              First visit funds acquisition.{" "}
              <span className="pr-retention-h-light">
                Repeat visits fund LTV.
              </span>
            </h2>
            <p className="pr-retention-desc">
              Push charges a software-margin fee on verified repeat visits — no
              new creator cost, just LTV amortization for the merchant. Opt-in
              on Operator, included in Neighborhood engagements. Tier scales
              with vertical ticket size.
            </p>
            <ul className="pr-retention-bullets">
              <li>Same 3-layer verification (QR + Vision + Geo)</li>
              <li>Billed monthly in arrears alongside base</li>
              <li>ConversionOracle™ re-scores every repeat event</li>
            </ul>
          </div>
          <div className="pr-retention-right reveal">
            <RetentionTabs />
          </div>
        </div>
      </section>

      {/* ══ 4. COMPARISON DEEP-DIVE ══════════════════════════════ */}
      <section id="deep-dive" className="section pr-deep-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Plan deep-dive</span>
          </div>

          <h2 className="pr-deep-h reveal">
            Everything that moves{" "}
            <span className="pr-deep-h-light">when you step up a plan.</span>
          </h2>

          <p className="pr-deep-intro reveal">
            Expand a plan to see verification layers, creator tier access,
            Retention Add-on availability, SLA, and dedicated support scope.
          </p>

          <div className="reveal">
            <CompareDeepDive />
          </div>
        </div>
      </section>

      {/* ══ 5. LTV / CAC BLOCK ═══════════════════════════════════ */}
      <section className="section-bright pr-ltv-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">03</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Merchant unit economics</span>
          </div>

          <h2 className="pr-ltv-h reveal">
            <span className="pr-ltv-h-bold">15.7x LTV / CAC.</span>
            <span className="pr-ltv-h-light">Verified, not projected.</span>
          </h2>

          <p className="pr-ltv-intro reveal">
            Every number below is traced to a walk-in event the
            ConversionOracle™ verified. Source: Williamsburg Coffee+ pilot
            cohort, Month 3.
          </p>

          <div className="pr-ltv-grid reveal">
            {LTV_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`pr-ltv-stat${i === 2 ? " pr-ltv-stat--hero" : ""}`}
              >
                <span className="pr-ltv-label">{stat.label}</span>
                <span className="pr-ltv-value">{stat.value}</span>
                <span className="pr-ltv-note">{stat.note}</span>
              </div>
            ))}
          </div>

          <p className="pr-ltv-footnote reveal">
            Per-merchant Month-6 revenue $1,051 · gross margin $731 (70%). Unit
            economics derived from the Neighborhood Playbook — not modelled, not
            benchmarked.
          </p>
        </div>
      </section>

      {/* ══ 6. BOTTOM CTA ═══════════════════════════════════════ */}
      <section className="pr-cta-section">
        <div className="container pr-cta-inner">
          <div className="pr-cta-content reveal">
            <div className="pr-cta-label">
              <span className="rule rule--w" />
              <span className="eyebrow pr-cta-eyebrow">
                Williamsburg Coffee+ beachhead
              </span>
            </div>
            <h2 className="pr-cta-h">
              Tiered by vertical.
              <br />
              <em className="pr-cta-h-em">Paid by outcome.</em>
            </h2>
            <p className="pr-cta-sub">
              Vertical AI for Local Commerce. Per-customer pricing derived from
              merchant gross-margin math. Customer Acquisition Engine built for
              the Coffee+ beachhead.
            </p>
          </div>
          <div
            className="pr-cta-actions reveal"
            style={{ transitionDelay: "100ms" }}
          >
            <Link
              href="/merchant/pilot/economics"
              className="btn btn-primary pr-cta-btn-primary"
            >
              See pilot economics
            </Link>
            <Link href="/merchant/pilot" className="btn pr-cta-btn-ghost">
              Apply for $0 Pilot
            </Link>
            <p className="pr-cta-fine">
              First 10 Coffee+ merchants · Cap $4,200/neighborhood · Cancel
              anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
