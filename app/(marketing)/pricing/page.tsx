import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./pricing.css";

/* ── Plan data (v5.1 tier-based per-customer pricing) ──────── */
const PLANS = [
  {
    name: "Pilot",
    price: "$0",
    cents: "",
    period: "for first 10 merchants",
    desc: "First 10 AI-verified customers free. No credit card. Auto-flips to Operator after customer 10. If the AI can't deliver, you don't pay.",
    features: [
      "First 10 AI-verified customers free",
      "Williamsburg Coffee+ beachhead only",
      "10 merchants in active Pilot at a time",
      "No credit card required",
      "Auto-flip to Operator after customer 10",
      "QR + Claude Vision + geo verification",
    ],
    featured: false,
    cta: "Apply for Pilot",
    href: "/merchant/pilot",
    roi: "First 10 customers free — acquisition cost on us",
  },
  {
    name: "Operator",
    price: "$500",
    cents: "",
    period: "/mo min + per-customer by vertical",
    desc: "Monthly base assessed in arrears. Per-customer pricing tiered to each vertical's unit economics. Retention Add-on billed on repeat visits.",
    features: [
      "$500/mo minimum (assessed in arrears)",
      "Pure coffee $15 · Coffee+/brunch $25 · Dessert $22",
      "Fitness trial $60 · Beauty service $85",
      "Retention Add-on: v2 $8 · v3 $6 · loyalty $4",
      "Unlimited campaigns · 24h dispute SLA",
      "Creator tier 2–6 access",
    ],
    featured: true,
    badge: "Tier-Based",
    cta: "Talk to agent",
    href: "/merchant/signup",
    roi: "$15–85 per AI-verified customer — tiered to your vertical",
  },
  {
    name: "Neighborhood",
    price: "Custom",
    cents: "",
    period: "launch package + MRR",
    desc: "Multi-location ops. $8,000–12,000 launch package covers one-time ops, Pilot subsidy, and creator recruitment. 5.1-month payback per neighborhood.",
    features: [
      "$8,000–12,000 launch package (one-time)",
      "$20,000–35,000 MRR target by Month 12",
      "5.1 month payback per neighborhood",
      "Dedicated ops analyst",
      "Custom ConversionOracle tuning",
      "Priority access to Proven+ creators",
    ],
    featured: false,
    cta: "Contact sales",
    href: "/merchant/enterprise",
    roi: "5.1 month payback — neighborhood-level unit economics",
  },
];

/* ── Comparison table rows (Pilot vs Operator vs Neighborhood) ─ */
const COMPARE_ROWS: Array<{
  feature: string;
  pilot: string | boolean;
  operator: string | boolean;
  neighborhood: string | boolean;
}> = [
  {
    feature: "Monthly base",
    pilot: "$0",
    operator: "$500",
    neighborhood: "Custom",
  },
  {
    feature: "Per-customer pricing",
    pilot: "Free (first 10)",
    operator: "$15–85 by vertical",
    neighborhood: "Volume",
  },
  {
    feature: "Retention Add-on",
    pilot: "No",
    operator: "$8 / $6 / $4",
    neighborhood: "Included",
  },
  {
    feature: "Active campaigns",
    pilot: "1",
    operator: "Unlimited",
    neighborhood: "Unlimited",
  },
  {
    feature: "Verification (QR + Vision + Geo)",
    pilot: true,
    operator: true,
    neighborhood: true,
  },
  {
    feature: "Creator tier access",
    pilot: "Operator+",
    operator: "Proven+ priority",
    neighborhood: "Top-100 Closer+ exclusive",
  },
  {
    feature: "Dispute SLA",
    pilot: "72h",
    operator: "24h",
    neighborhood: "24h SLA",
  },
  {
    feature: "Agent run logs",
    pilot: false,
    operator: true,
    neighborhood: "Yes + custom exports",
  },
];

/* ── FAQ data (v5.1) ────────────────────────────────────────── */
const FAQS = [
  {
    q: "What's Vertical AI for Local Commerce?",
    a: "Push is vertical AI specialized for local-commerce customer acquisition. Not a general marketing tool, not an influencer platform. Every customer comes through 3-layer AI verification (QR + Claude Vision receipt OCR + geo-match within 200m).",
  },
  {
    q: "Why tiered per-customer pricing, not flat?",
    a: "Because coffee AOV $6 can't support the same per-customer rate as a $80 beauty service. We derive each vertical's price from the merchant's per-customer gross margin × 2. Coffee+ merchants pay $25 per acquired customer because their avg $14 AOV × 65% GM = $9 merchant margin > $8 Push net cost. Unit economics work at every vertical or we don't launch it.",
  },
  {
    q: "What's the Retention Add-on?",
    a: "First visit is worth more than repeat. But repeat visits are where merchant LTV lives. Push charges $8 for verified visit 2 within 30 days, $6 for visit 3 within 60 days, $4 for loyalty opt-in at first visit. Software margin for Push (no new creator cost); LTV amortization for merchant.",
  },
  {
    q: "How does the $0 Pilot work?",
    a: "First 10 merchants in the Williamsburg Coffee+ beachhead get a free pilot. First 10 AI-verified customers are on us. Per-neighborhood cap $4,200 in total subsidy. If the AI can't deliver, you don't pay.",
  },
  {
    q: "What's Software Leverage Ratio?",
    a: "Active campaigns ÷ ops FTE. Traditional influencer shops run 3–5. Our Month-12 target is 25, Month-24 target 50. SLR is what separates software-leverage from human-leverage businesses. Our north-star.",
  },
  {
    q: "ConversionOracle — what's that?",
    a: "Push's proprietary walk-in prediction model, trained on the AI-verified customer ground truth that only Push can generate. After 1,000+ events it hits ±25% accuracy; 10,000+ events hits ±15%. Meta and Google cannot train this model because they don't see offline foot traffic.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. No contracts. Pilot merchants keep any verified customers already delivered. Operator plan is month-to-month. Neighborhood engagement has a 30-day notice.",
  },
  {
    q: "What about legacy tiers?",
    a: "Existing founding-cohort merchants on old SaaS contracts stay on their original contract until renewal. v5.1 pricing applies to new merchants only; legacy tiers are not available for new signup.",
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
            <span className="eyebrow pr-hero-eyebrow">Tier-Based Pricing</span>
            <span className="rule" />
            <span className="pr-hero-eyebrow-sub">
              For Merchants · Williamsburg Coffee+
            </span>
          </div>

          <h1 className="pr-hero-h">
            <span
              className="pr-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              Pay only for
            </span>
            <span
              className="pr-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              customers we deliver.
            </span>
          </h1>

          <div
            className="pr-hero-bottom reveal"
            style={{ transitionDelay: "220ms" }}
          >
            <p className="pr-hero-sub">
              $0 Pilot for first 10 merchants. Then $500/mo min plus
              per-customer pricing tiered to your vertical — $15 pure coffee,
              $25 coffee+/brunch, up to $85 beauty. Unit economics work at every
              vertical or we don&apos;t launch it.
            </p>
            <div className="pr-hero-anchors">
              <a href="#plans" className="btn btn-primary">
                See pricing
              </a>
              <a href="#compare" className="btn btn-secondary">
                Compare plans
              </a>
            </div>
          </div>

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
            $0 Pilot means $0. No credit card required. Auto-flip to Operator
            after your 10th AI-verified customer. Per-customer rates derived
            from each vertical&apos;s gross-margin math — never flat, never
            markup.
          </p>
        </div>
      </section>

      {/* ══ 3. RETENTION ADD-ON ROW ═══════════════════════════ */}
      <section className="section-bright pr-enterprise-section reveal">
        <div className="container pr-enterprise-inner">
          <div className="pr-enterprise-left">
            <p className="eyebrow pr-enterprise-eyebrow">Retention Add-on</p>
            <h2 className="pr-enterprise-h">
              First visit funds acquisition.{" "}
              <span className="pr-enterprise-h-light">
                Repeat visits fund LTV.
              </span>
            </h2>
            <p className="pr-enterprise-desc">
              Push charges a software-margin fee on verified repeat visits — no
              new creator cost, just LTV amortization for the merchant. Enabled
              on Operator plan, included in Neighborhood engagements.
            </p>
          </div>
          <div className="pr-enterprise-right">
            <ul className="pr-enterprise-list">
              <li>
                <span className="pr-enterprise-bullet" />
                Verified visit 2 within 30 days: $8
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Verified visit 3 within 60 days: $6
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Loyalty opt-in at first visit: $4
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Same 3-layer AI verification (QR + Vision + Geo)
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Billed monthly in arrears alongside base
              </li>
            </ul>
            <Link href="/merchant/signup" className="btn btn-primary">
              Enable on Operator
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
            <span className="section-tag-label">Plan Comparison</span>
          </div>

          <h2 className="pr-compare-h reveal">
            Three plans,{" "}
            <span className="pr-compare-h-light">side by side.</span>
          </h2>

          <div className="pr-compare-wrap reveal">
            <table className="pr-compare-table">
              <thead>
                <tr>
                  <th className="pr-th-feature">Feature</th>
                  <th className="pr-th-plan">Pilot</th>
                  <th className="pr-th-plan pr-th-featured">Operator</th>
                  <th className="pr-th-plan">Neighborhood</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className="pr-tr">
                    <td className="pr-td-feature">{row.feature}</td>
                    <td className="pr-td">
                      {typeof row.pilot === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.pilot ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.pilot ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.pilot
                      )}
                    </td>
                    <td className="pr-td pr-td--featured">
                      {typeof row.operator === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.operator ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.operator ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.operator
                      )}
                    </td>
                    <td className="pr-td">
                      {typeof row.neighborhood === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.neighborhood ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.neighborhood ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.neighborhood
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
              AI delivers,
            </span>
            <span
              className="pr-guarantee-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              or it&apos;s free.
            </span>
          </h2>
          <p
            className="pr-guarantee-body reveal"
            style={{ transitionDelay: "200ms" }}
          >
            Every customer requires a three-layer AI verification: QR scan +
            Claude Vision receipt OCR + geo-match within 200m. No verification,
            no charge. Your budget only moves when a real customer walks through
            the door and the AI confirms it.
          </p>
          <div
            className="pr-guarantee-stats reveal"
            style={{ transitionDelay: "260ms" }}
          >
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">100%</span>
              <span className="pr-g-stat-l">AI-verified customers</span>
            </div>
            <div className="pr-g-stat-div" aria-hidden="true" />
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">&lt;8s</span>
              <span className="pr-g-stat-l">Verification latency</span>
            </div>
            <div className="pr-g-stat-div" aria-hidden="true" />
            <div className="pr-g-stat">
              <span className="pr-g-stat-n">$0</span>
              <span className="pr-g-stat-l">Unverified charges</span>
            </div>
          </div>
        </div>

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
              <span className="eyebrow pr-cta-eyebrow">Start $0 today</span>
            </div>
            <h2 className="pr-cta-h">
              Hand customer
              <br />
              <em className="pr-cta-h-em">acquisition</em>
              <br />
              to the agent.
            </h2>
            <p className="pr-cta-sub">
              Vertical AI for local commerce. Tier-based per-customer pricing.
              No flat fees, no legacy markup.
            </p>
          </div>
          <div
            className="pr-cta-actions reveal"
            style={{ transitionDelay: "100ms" }}
          >
            <Link
              href="/merchant/pilot"
              className="btn btn-primary pr-cta-btn-primary"
            >
              Apply for $0 Pilot
            </Link>
            <Link href="/merchant/signup" className="btn pr-cta-btn-ghost">
              Talk to agent
            </Link>
            <p className="pr-cta-fine">
              First 10 merchants · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
