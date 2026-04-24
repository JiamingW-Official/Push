import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./pricing.css";

/* ── Plan data — pricing values UNCHANGED (fact-preserving) ─── */
const PLANS = [
  {
    slug: "lite",
    name: "Lite",
    scene: "kicking the tires.",
    price: "$0",
    period: "/mo",
    desc: "One QR, one creator slot, twenty verified visits a month. No card, no clock.",
    features: [
      "1 active campaign",
      "1 creator slot",
      "QR attribution from day one",
      "Weekly ROI summary",
      "Community support",
    ],
    featured: false,
    variant: "card-premium" as const,
    cta: "start →",
    href: "/merchant/signup?plan=lite",
    fine: "no card required",
    qrLimit: "20 verified visits/mo",
    campaignLimit: "1 campaign",
    applicants: "5/mo",
    analytics: "Weekly summary",
    priority: false,
    api: false,
  },
  {
    slug: "essentials",
    name: "Essentials",
    scene: "for the corner shop.",
    price: "$99",
    period: "/mo",
    desc: "Flat for legacy spots in Chinatown, Flushing, Williamsburg. Three campaigns, real attribution.",
    features: [
      "3 active campaigns",
      "5 creator slots per campaign",
      "QR + receipt-scan attribution",
      "Weekly ROI card",
      "Email support",
    ],
    featured: false,
    variant: "card-premium" as const,
    cta: "start →",
    href: "/merchant/signup?plan=essentials",
    fine: "for $5K – $25K monthly revenue shops",
    qrLimit: "150 verified visits/mo",
    campaignLimit: "3 campaigns",
    applicants: "30/mo",
    analytics: "Standard",
    priority: false,
    api: false,
  },
  {
    slug: "pro",
    name: "Pro",
    scene: "pay only when it works.",
    price: "5%",
    period: "of attributed revenue",
    desc: "Outcome-based Year 1. Cap $179/mo, floor $49/mo — when the door doesn't open, you don't pay.",
    features: [
      "Unlimited campaigns Year 1",
      "8 creator slots per campaign",
      "Three-signal attribution (QR + receipt + merchant confirm)",
      "Live ROI dashboard",
      "Priority support",
      "Auto-converts to $199 flat in Year 2 if cap hits 50%+ of months",
    ],
    featured: true,
    variant: "card-ink" as const,
    badge: "Most chosen",
    cta: "talk →",
    href: "/contact?inquiry=pro",
    fine: "cap $179, floor $49",
    qrLimit: "Unlimited",
    campaignLimit: "Unlimited",
    applicants: "Unlimited",
    analytics: "Live + export",
    priority: true,
    api: false,
  },
  {
    slug: "advanced",
    name: "Advanced",
    scene: "two doors and counting.",
    price: "$349",
    period: "/mo",
    desc: "Multi-unit operators and chef-driven concepts running ongoing creator programs.",
    features: [
      "Everything in Pro, flat",
      "Up to 5 locations",
      "Custom attribution rules",
      "Dedicated account manager",
      "API access",
      "White-glove onboarding",
    ],
    featured: false,
    variant: "card-champagne" as const,
    cta: "talk →",
    href: "/merchant/signup?plan=advanced",
    fine: "for 2+ location operators",
    qrLimit: "Unlimited",
    campaignLimit: "Unlimited",
    applicants: "Unlimited",
    analytics: "Advanced + export + API",
    priority: true,
    api: true,
  },
];

/* ── Comparison table rows ──────────────────────────────────── */
const COMPARE_ROWS: Array<{
  feature: string;
  lite: string | boolean;
  essentials: string | boolean;
  pro: string | boolean;
  advanced: string | boolean;
}> = [
  {
    feature: "Verified visits / mo",
    lite: "20",
    essentials: "150",
    pro: "Unlimited",
    advanced: "Unlimited",
  },
  {
    feature: "Active campaigns",
    lite: "1",
    essentials: "3",
    pro: "Unlimited",
    advanced: "Unlimited",
  },
  {
    feature: "Creator applicants / mo",
    lite: "5",
    essentials: "30",
    pro: "Unlimited",
    advanced: "Unlimited",
  },
  {
    feature: "Analytics",
    lite: "Weekly summary",
    essentials: "Standard",
    pro: "Live + export",
    advanced: "Advanced + export + API",
  },
  {
    feature: "Priority support",
    lite: false,
    essentials: false,
    pro: true,
    advanced: true,
  },
  {
    feature: "API access",
    lite: false,
    essentials: false,
    pro: false,
    advanced: true,
  },
  {
    feature: "Dedicated account manager",
    lite: false,
    essentials: false,
    pro: false,
    advanced: true,
  },
  {
    feature: "Custom attribution rules",
    lite: false,
    essentials: false,
    pro: false,
    advanced: true,
  },
];

/* ── FAQ data ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What am I actually paying for each month?",
    a: "Plan access — campaign tooling, QR attribution, creator matching. Creator payouts are separate: you fund a campaign escrow per campaign, and creators get paid only after a verified visit clears.",
  },
  {
    q: "Are there fees on top of the subscription?",
    a: "Four prices: $0 Lite, $99 Essentials, Pro at 5% of attributed revenue (cap $179/mo, floor $49/mo), and $349 Advanced. Creator payouts are funded by you per campaign — Push takes a 10–15% rev share on Stripe Connect payouts.",
  },
  {
    q: "What counts as a verified visit?",
    a: "Each creator gets a unique QR tied to your campaign. When someone they referred scans in-store, the visit is logged with timestamp, creator ID, and location. Fraud filters run within 60 seconds — only clean visits count toward billing.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. Upgrades take effect immediately. Downgrades apply at the start of the next billing cycle. No contracts, no cancellation fees.",
  },
  {
    q: "What if I exceed my visit or campaign limits?",
    a: "On Lite and Essentials, active campaigns pause when limits hit. Pro and Advanced are uncapped on volume. You'll get a notification — upgrade mid-cycle and we prorate.",
  },
  {
    q: "Do I need a card to start?",
    a: "No. Lite is free forever, no card required. To run more than 1 campaign or 20 verified visits/month, upgrade to Essentials or Pro (Pro = pay only on attributed revenue).",
  },
  {
    q: "Is Push live outside NYC?",
    a: "Pre-pilot, Lower Manhattan only. Pilot opens June 22 in SoHo, Tribeca, and Chinatown. Chicago, LA, and Miami are on the 2026 list — join the waitlist if you're outside NYC.",
  },
  {
    q: "What about Enterprise?",
    a: "For 5+ locations, franchise operators, or brands running large creator programs. Pricing is custom — volume QR allocations, dedicated CSM, SLA terms, SSO/API. Talk to us.",
  },
];

/* ── Check / X icons ────────────────────────────────────────── */
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

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5l6 6M11 5l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
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

      {/* ═══════════════ 01 — HERO ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette pr-hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          paddingTop: "clamp(80px, 8vw, 120px)",
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
            Pre-pilot pricing · Lower Manhattan
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Pilot opens June&nbsp;22
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
            What it costs
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
            Two prices
            <span
              aria-hidden="true"
              style={{ color: "var(--brand-red)", marginLeft: "-0.04em" }}
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
            Pay per visit. Clean math.
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
            Flat for Lite, Essentials, and Advanced. Outcome-based for Pro — 5%
            of attributed revenue, capped at $179/mo, floored at $49/mo. Creator
            payouts release only after a QR-verified visit. No agency retainers,
            no impression fees, no clawbacks.
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
            Push is pre-pilot — five anchored venues, ten creators on the
            roster, Lower Manhattan only. The numbers below are the numbers we
            quote operators on the phone.
          </p>

          {/* Inline CTAs */}
          <div
            style={{
              marginTop: "clamp(32px, 4vw, 48px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <a href="#plans" className="btn btn-primary">
              See the math
            </a>
            <a href="#compare" className="btn pr-outline-btn">
              Compare side by side
            </a>
          </div>

          {/* Hero KPI strip */}
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
                value: "$0",
                label: "to start",
                note: "Lite is free, no card",
                tint: "var(--brand-red)",
              },
              {
                value: "$5–35",
                label: "per verified visit",
                note: "by creator tier",
                tint: "var(--champagne)",
              },
              {
                value: "$49",
                label: "Pro floor",
                note: "$179 cap, 5% in between",
                tint: "var(--cat-fitness)",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{ paddingLeft: 18, borderLeft: `2px solid ${s.tint}` }}
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
      </section>

      {/* ═══════════════ 02 — PRICING TIERS ═══════════════ */}
      <section id="plans" className="section pr-plans-section">
        <div className="container">
          <div
            className="reveal"
            style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}
          >
            <div className="section-marker" data-num="02">
              The four tiers
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
              Pick what fits
              <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
                .
              </span>
              <br />
              <span className="display-ghost">
                Switch when it doesn&apos;t.
              </span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-4)",
                maxWidth: 540,
                lineHeight: 1.6,
                margin: "16px 0 0",
              }}
            >
              Start free. Upgrade the second month it makes sense. Downgrade at
              the next billing cycle. No contracts, no cancellation fees.
            </p>
          </div>

          <div className="pr-plans-grid reveal">
            {PLANS.map((plan, i) => (
              <article
                key={plan.slug}
                className={`pr-plan ${plan.variant} ${plan.featured ? "pr-plan--featured" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {plan.badge && (
                  <span className="pr-plan-badge">{plan.badge}</span>
                )}

                <div className="pr-plan-tag">
                  <span className="pr-plan-tag-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pr-plan-tag-line" aria-hidden="true" />
                  <span className="pr-plan-tag-label">Tier</span>
                </div>

                <h3 className="pr-plan-name">
                  {plan.name}
                  <span aria-hidden="true" className="pr-plan-name-dot">
                    .
                  </span>
                </h3>
                <p className="pr-plan-scene">{plan.scene}</p>

                <div className="pr-plan-price-row">
                  <span className="pr-plan-price-int">{plan.price}</span>
                  <span className="pr-plan-price-period">{plan.period}</span>
                </div>

                <p className="pr-plan-desc">{plan.desc}</p>

                <ul className="pr-plan-features">
                  {plan.features.map((f) => (
                    <li key={f} className="pr-plan-feature">
                      <span className="pr-plan-check" aria-hidden="true">
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pr-plan-footer">
                  <p className="pr-plan-fine">{plan.fine}</p>
                  <Link
                    href={plan.href}
                    className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"} pr-plan-cta`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="pr-plans-note reveal">
            Every plan: QR attribution from day one, fraud filter under 60s,
            creator payouts billed separately per campaign.
          </p>
        </div>
      </section>

      {/* ═══════════════ 03 — ENTERPRISE ═══════════════ */}
      <section className="section section-bright pr-enterprise-section reveal">
        <div className="container pr-enterprise-inner">
          <div className="pr-enterprise-left">
            <div className="section-marker" data-num="03">
              Five locations or more
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
              Talk to us
              <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
                .
              </span>
              <br />
              <span className="display-ghost">We&apos;ll write the math.</span>
            </h2>
            <p className="pr-enterprise-desc">
              Volume QR allocations, a dedicated Customer Success Manager, SLA
              terms, SSO + API integration. For franchise operators and
              multi-location chains running ongoing creator programs.
            </p>
          </div>
          <div className="pr-enterprise-right">
            <ul className="pr-enterprise-list">
              <li>
                <span className="pr-enterprise-bullet" />
                Unlimited locations &amp; campaigns
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Dedicated CSM + white-glove onboarding
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Custom attribution &amp; reporting SLA
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                SSO, API, and webhook integrations
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Volume creator network access
              </li>
            </ul>
            <Link href="/contact" className="btn btn-primary">
              talk to us →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 — COMPARISON TABLE ═══════════════ */}
      <section id="compare" className="section pr-compare-section">
        <div className="container">
          <div
            className="reveal"
            style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
          >
            <div className="section-marker" data-num="04">
              Side by side
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
              Every tier
              <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
                .
              </span>
              <br />
              <span className="display-ghost">Every line item.</span>
            </h2>
          </div>

          <div className="pr-compare-wrap reveal">
            <table className="pr-compare-table">
              <thead>
                <tr>
                  <th className="pr-th-feature">Line item</th>
                  <th className="pr-th-plan">Lite</th>
                  <th className="pr-th-plan">Essentials</th>
                  <th className="pr-th-plan pr-th-featured">Pro</th>
                  <th className="pr-th-plan">Advanced</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className="pr-tr">
                    <td className="pr-td-feature">{row.feature}</td>
                    <td className="pr-td">
                      {typeof row.lite === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.lite ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.lite ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.lite
                      )}
                    </td>
                    <td className="pr-td">
                      {typeof row.essentials === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.essentials ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.essentials ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.essentials
                      )}
                    </td>
                    <td className="pr-td pr-td--featured">
                      {typeof row.pro === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.pro ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.pro ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="pr-td">
                      {typeof row.advanced === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.advanced ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.advanced ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.advanced
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 — FAQ ═══════════════ */}
      <section className="section section-bright pr-faq-section">
        <div className="container">
          <div
            className="reveal"
            style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
          >
            <div className="section-marker" data-num="05">
              Common questions
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
              Eight answers
              <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
                .
              </span>
              <br />
              <span className="display-ghost">Nothing fancy.</span>
            </h2>
          </div>

          <div className="pr-faq-grid">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className="pr-faq-item reveal"
                style={{ transitionDelay: `${(i % 2) * 80}ms` }}
              >
                <span className="pr-faq-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="pr-faq-q">{item.q}</h3>
                <p className="pr-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 — GUARANTEE ═══════════════ */}
      <section className="pr-guarantee-section">
        <div className="container pr-guarantee-inner">
          <div
            className="reveal"
            style={{ marginBottom: "clamp(40px, 5vw, 56px)" }}
          >
            <div className="section-marker" data-num="06">
              The promise
            </div>
            <h2 className="pr-guarantee-h">
              <span className="pr-guarantee-h-bold">Door open</span>
              <span aria-hidden="true" className="pr-guarantee-h-period">
                .
              </span>
              <span className="pr-guarantee-h-light">Money on results.</span>
            </h2>
          </div>
          <p
            className="pr-guarantee-body reveal"
            style={{ transitionDelay: "120ms" }}
          >
            Every creator payout requires a QR-confirmed, fraud-filtered visit.
            If it doesn&apos;t scan, it doesn&apos;t pay. Your budget moves only
            when a real customer walks in.
          </p>
          <div
            className="pr-guarantee-stats reveal"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">100%</span>
              <span className="pr-g-stat-l">Scan-verified payouts</span>
            </div>
            <div className="pr-g-stat-div" aria-hidden="true" />
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">&lt;60s</span>
              <span className="pr-g-stat-l">Fraud filter latency</span>
            </div>
            <div className="pr-g-stat-div" aria-hidden="true" />
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">$0</span>
              <span className="pr-g-stat-l">Disputed visits billed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 — FINAL CTA ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette pr-cta-section"
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
            Start free
            <span
              aria-hidden="true"
              style={{ color: "var(--brand-red)", marginLeft: "-0.04em" }}
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
            Pay when it works.
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
            Ten minutes to write the brief. First scan inside twenty-four hours.
            The pilot opens June&nbsp;22 in SoHo, Tribeca, and Chinatown —
            Jiaming walks the doors himself.
          </p>

          <div
            style={{
              marginTop: "clamp(28px, 4vw, 40px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/merchant/signup" className="btn btn-primary">
              start free →
            </Link>
            <Link href="/contact" className="btn pr-outline-btn">
              talk to us →
            </Link>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.34)",
              }}
            >
              no card · cancel anytime
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
