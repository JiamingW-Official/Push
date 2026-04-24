import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./pricing.css";

/* ── Plan data ──────────────────────────────────────────────── */
const PLANS = [
  {
    name: "Attribution Lite",
    price: "$0",
    cents: "",
    period: "/mo",
    desc: "Try Push attribution with no commitment. One QR code, one creator slot.",
    features: [
      "1 active campaign",
      "1 creator slot",
      "QR attribution from day one",
      "Weekly ROI summary",
      "Community support",
    ],
    featured: false,
    cta: "Start free",
    href: "/merchant/signup?plan=lite",
    roi: "Acquisition tier — no card required",
    qrLimit: "20 verified visits/mo",
    campaignLimit: "1 campaign",
    applicants: "5/mo",
    analytics: "Weekly summary",
    priority: false,
    api: false,
  },
  {
    name: "Essentials",
    price: "$99",
    cents: "",
    period: "/mo",
    desc: "For Chinatown, Flushing, and Williamsburg legacy shops. Real attribution, flat pricing.",
    features: [
      "3 active campaigns",
      "5 creator slots per campaign",
      "QR + receipt-scan attribution",
      "Weekly ROI card",
      "Email support",
    ],
    featured: false,
    cta: "Start Essentials",
    href: "/merchant/signup?plan=essentials",
    roi: "Designed for $5K–$25K monthly revenue shops",
    qrLimit: "150 verified visits/mo",
    campaignLimit: "3 campaigns",
    applicants: "30/mo",
    analytics: "Standard",
    priority: false,
    api: false,
  },
  {
    name: "Pro",
    price: "5%",
    cents: "",
    period: " of attributed revenue",
    desc: "Outcome-based Year 1 — you only pay when Push drives revenue. Cap $179/mo, floor $49/mo.",
    features: [
      "Unlimited campaigns Year 1",
      "8 creator slots per campaign",
      "Three-signal attribution (QR + receipt + merchant confirm)",
      "Live ROI dashboard",
      "Priority support",
      "Auto-converts to $199 flat in Year 2 if you hit cap 50%+ of months",
    ],
    featured: true,
    badge: "Most chosen",
    cta: "Talk to us about Pro",
    href: "/contact?inquiry=pro",
    roi: "Pay only when verified visits land. Cap $179, floor $49.",
    qrLimit: "Unlimited",
    campaignLimit: "Unlimited",
    applicants: "Unlimited",
    analytics: "Live + export",
    priority: true,
    api: false,
  },
  {
    name: "Advanced",
    price: "$349",
    cents: "",
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
    cta: "Talk to us",
    href: "/merchant/signup?plan=advanced",
    roi: "For 2+ location operators",
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
    q: "What exactly am I paying for each month?",
    a: "Your plan covers platform access, campaign management tools, AI creator matching, and QR attribution infrastructure. Creator payouts are separate — you fund a campaign escrow per campaign, and creators are paid only after verified visits.",
  },
  {
    q: "Are there fees on top of the subscription?",
    a: "Pricing is tiered: $0 Lite / $99 Essentials / Pro outcome-based (5% of attributed revenue, capped $179/mo) / $349 Advanced. Creator payouts are funded by you per campaign — Push takes a 10–15% rev share on Stripe Connect payouts.",
  },
  {
    q: 'How does QR verification work and what counts as a "verified visit"?',
    a: "Each creator gets a unique QR code linked to your campaign. When a customer they referred scans in-store, the visit is logged with timestamp, creator ID, and location. Fraud filters run within 60 seconds — only clean visits count.",
  },
  {
    q: "Can I upgrade or downgrade my plan anytime?",
    a: "Yes. Upgrades take effect immediately. Downgrades apply at the start of the next billing cycle. No contracts, no cancellation fees.",
  },
  {
    q: "What happens if I exceed my verified-visit or campaign limits?",
    a: "On Lite and Essentials, active campaigns pause when limits are reached. Pro and Advanced are unlimited. You'll receive a notification and can upgrade mid-cycle — prorated charges apply.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "Lite is free forever — no card required. To run more than 1 campaign or 20 verified visits/month, upgrade to Essentials or Pro (Pro = pay only on attributed revenue).",
  },
  {
    q: "Is Push available outside New York City?",
    a: "Push is currently invite-only in NYC. Expansion to Chicago, LA, and Miami is planned for Q3 2026. Join the waitlist if you're outside NYC.",
  },
  {
    q: "What is the Enterprise plan and who is it for?",
    a: "Enterprise is for multi-location chains (5+ locations or franchises), franchise operators, or brands running large-scale creator programs. Pricing is custom — includes volume QR allocations, dedicated CSM, SLA guarantees, and SSO/API integration.",
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

      {/* ══ 1. EDITORIAL HERO ══════════════════════════════════ */}
      <section className="pr-hero">
        <div className="container pr-hero-inner">
          <div className="pr-hero-label reveal">
            <span className="eyebrow pr-hero-eyebrow">Push Pricing</span>
            <span className="rule" />
            <span className="pr-hero-eyebrow-sub">For Merchants · NYC</span>
          </div>

          {/* Asymmetric headline: 900 + 300 */}
          <h1 className="pr-hero-h">
            <span
              className="pr-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              Pricing that pays
            </span>
            <span
              className="pr-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              only when it works.
            </span>
          </h1>

          <div
            className="pr-hero-bottom reveal"
            style={{ transitionDelay: "220ms" }}
          >
            <p className="pr-hero-sub">
              Flat for Lite, Essentials, and Advanced. Outcome-based for Pro.
              Creator payouts only on verified foot traffic. No agency
              retainers, no mystery fees.
            </p>
            <div className="pr-hero-anchors">
              <a href="#plans" className="btn btn-primary">
                See plans
              </a>
              <a href="#compare" className="btn btn-secondary">
                Compare features
              </a>
            </div>
          </div>

          {/* Ambient decorative number */}
          <span className="pr-hero-ghost" aria-hidden="true">
            $0
          </span>
        </div>
      </section>

      {/* ══ 2. PRICING CARDS ═══════════════════════════════════ */}
      <section id="plans" className="section pr-plans-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">01</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Merchant Plans</span>
          </div>

          <div className="pr-plans-grid">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`pr-plan reveal${plan.featured ? " pr-plan--featured" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.badge && (
                  <div className="pr-plan-badge">{plan.badge}</div>
                )}

                <div className="pr-plan-header">
                  <h2 className="pr-plan-name">{plan.name}</h2>
                  <div className="pr-plan-price-row">
                    <span className="pr-plan-price-int">{plan.price}</span>
                    {plan.cents && (
                      <span className="pr-plan-price-cents">{plan.cents}</span>
                    )}
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
                    className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"} pr-plan-cta`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="pr-plans-note reveal">
            All plans include a 14-day free trial. No credit card required to
            explore. Creator payouts funded per-campaign, billed separately.
          </p>
        </div>
      </section>

      {/* ══ 3. ENTERPRISE ROW ═════════════════════════════════ */}
      <section className="section-bright pr-enterprise-section reveal">
        <div className="container pr-enterprise-inner">
          <div className="pr-enterprise-left">
            <p className="eyebrow pr-enterprise-eyebrow">Enterprise</p>
            <h2 className="pr-enterprise-h">
              Running 5+ locations?{" "}
              <span className="pr-enterprise-h-light">Let&apos;s talk.</span>
            </h2>
            <p className="pr-enterprise-desc">
              Custom QR allocations, dedicated Customer Success Manager, SLA
              guarantees, SSO + API integration, and volume campaign pricing.
              Built for franchise operators and multi-location chains.
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
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. COMPARISON TABLE ════════════════════════════════ */}
      <section id="compare" className="section pr-compare-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Feature Comparison</span>
          </div>

          <h2 className="pr-compare-h reveal">
            Every plan,{" "}
            <span className="pr-compare-h-light">side by side.</span>
          </h2>

          <div className="pr-compare-wrap reveal">
            <table className="pr-compare-table">
              <thead>
                <tr>
                  <th className="pr-th-feature">Feature</th>
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

      {/* ══ 5. FAQ INLINE ═════════════════════════════════════ */}
      <section className="section-bright pr-faq-section">
        <div className="container">
          <div className="pr-section-tag reveal">
            <span className="section-tag-num">03</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">FAQ</span>
          </div>

          <div className="pr-faq-grid">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className="pr-faq-item reveal"
                style={{ transitionDelay: `${(i % 2) * 80}ms` }}
              >
                <h3 className="pr-faq-q">{item.q}</h3>
                <p className="pr-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. GUARANTEE ══════════════════════════════════════ */}
      <section className="pr-guarantee-section">
        <div className="container pr-guarantee-inner">
          <p className="eyebrow pr-guarantee-eyebrow reveal">Our Promise</p>
          <h2 className="pr-guarantee-h">
            <span
              className="pr-guarantee-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              Pay only for
            </span>
            <span
              className="pr-guarantee-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              verified visits.
            </span>
          </h2>
          <p
            className="pr-guarantee-body reveal"
            style={{ transitionDelay: "200ms" }}
          >
            Every creator payout requires a QR-confirmed, fraud-filtered visit.
            If it doesn&apos;t scan, it doesn&apos;t pay. Your budget only moves
            when real customers walk through the door.
          </p>
          <div
            className="pr-guarantee-stats reveal"
            style={{ transitionDelay: "260ms" }}
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

        {/* Decorative ghost text */}
        <span className="pr-guarantee-ghost" aria-hidden="true">
          Verified
        </span>
      </section>

      {/* ══ 7. BOTTOM CTA ════════════════════════════════════ */}
      <section className="pr-cta-section">
        <div className="container pr-cta-inner">
          <div className="pr-cta-content reveal">
            <div className="pr-cta-label">
              <span className="rule rule--w" />
              <span className="eyebrow pr-cta-eyebrow">Get started today</span>
            </div>
            <h2 className="pr-cta-h">
              Launch your first
              <br />
              <em className="pr-cta-h-em">creator campaign</em>
              <br />
              in 24 hours.
            </h2>
            <p className="pr-cta-sub">
              No agency. No guesswork. Just verified foot traffic.
            </p>
          </div>
          <div
            className="pr-cta-actions reveal"
            style={{ transitionDelay: "100ms" }}
          >
            <Link
              href="/merchant/signup"
              className="btn btn-primary pr-cta-btn-primary"
            >
              Start free — $0 today
            </Link>
            <Link href="/contact" className="btn pr-cta-btn-ghost">
              Talk to sales
            </Link>
            <p className="pr-cta-fine">
              14-day trial · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
