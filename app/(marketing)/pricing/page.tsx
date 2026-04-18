import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./pricing.css";

/* ── Plan data (v5.0 outcome-based) ─────────────────────────── */
const PLANS = [
  {
    name: "Pilot",
    price: "$0",
    cents: "",
    period: "for first 10 merchants",
    desc: "Run your first campaign. First 10 customers free. No catch. If the AI can't deliver, you don't pay.",
    features: [
      "Up to 10 verified customers free",
      "AI creator matching in 60 seconds",
      "Claude Vision receipt verification",
      "QR + geo triple-check attribution",
      "Weekly performance review",
      "Williamsburg coffee beachhead priority",
    ],
    featured: false,
    cta: "Apply for pilot",
    href: "/merchant/pilot",
    roi: "First 10 customers free — acquisition cost on us",
    qrLimit: "Unlimited AI-verified scans",
    campaignLimit: "1 active campaign",
    applicants: "AI-curated, top 5",
    analytics: "Weekly dashboard",
    priority: false,
    api: false,
  },
  {
    name: "Performance",
    price: "$500",
    cents: "",
    period: "/mo min + $40/customer",
    desc: "You set the target. The agent delivers. Pay only for AI-verified visits — never for promises.",
    features: [
      "Unlimited AI-matched campaigns",
      "Dedicated AI agent tuning",
      "Two-Tier Hero + Sustained offers",
      "Creator tier 2–6 access (Proven+ priority)",
      "Day-1 multi-modal verification",
      "Dispute SLA: 24h",
    ],
    featured: true,
    badge: "Outcome-Based",
    cta: "Talk to agent",
    href: "/merchant/signup",
    roi: "$40 per AI-verified customer — no cap, no markup",
    qrLimit: "Unlimited AI-verified scans",
    campaignLimit: "Unlimited",
    applicants: "Unlimited, tier 2–6",
    analytics: "Full + agent run logs",
    priority: true,
    api: true,
  },
];

/* ── Comparison table rows (Pilot vs Performance) ──────────── */
const COMPARE_ROWS = [
  {
    feature: "Monthly minimum",
    pilot: "$0",
    performance: "$500",
  },
  {
    feature: "Cost per verified customer",
    pilot: "Free (first 10)",
    performance: "$40",
  },
  {
    feature: "Active campaigns",
    pilot: "1",
    performance: "Unlimited",
  },
  {
    feature: "AI matching latency",
    pilot: "≤ 60s",
    performance: "≤ 60s",
  },
  {
    feature: "Verification method",
    pilot: "Claude Vision + QR + geo",
    performance: "Claude Vision + QR + geo",
  },
  {
    feature: "Creator tier access",
    pilot: "Operator+",
    performance: "Proven+ priority, full 2–6",
  },
  {
    feature: "Agent run logs",
    pilot: false,
    performance: true,
  },
  {
    feature: "API access",
    pilot: false,
    performance: true,
  },
  {
    feature: "Dedicated agent tuning",
    pilot: false,
    performance: true,
  },
  {
    feature: "Dispute SLA",
    pilot: "72h",
    performance: "24h",
  },
];

/* ── FAQ data ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What exactly am I paying for?",
    a: "AI-verified customers — real people who walked through your door and were triple-checked by Claude Vision (receipt OCR), QR scan, and geo-match. No impressions, no clicks, no follower counts. Only verified foot traffic.",
  },
  {
    q: "How does the $0 Pilot work?",
    a: "First 10 merchants in the Williamsburg coffee beachhead get a free pilot. First 10 verified customers are on us. Customer 11+ flips on at $40/customer with a $500/mo minimum. No contract.",
  },
  {
    q: "How does the AI verify a customer?",
    a: "Three-layer check: (1) QR scan at your door, (2) Claude Vision OCR of the receipt to confirm merchant name + amount, (3) geo-match within 200m. All three must pass in under 8 seconds, or it goes to human review.",
  },
  {
    q: "Can I switch from Pilot to Performance?",
    a: "Automatically. After customer 10, you move to $500/mo min + $40/customer. You see the crossover coming — weekly review shows pace.",
  },
  {
    q: "What if the AI can't deliver in the Pilot?",
    a: "You pay $0. That's the deal. We built the agent to hit 10 verified customers in 60 days or we eat the cost.",
  },
  {
    q: "Why only coffee × Williamsburg right now?",
    a: "Network density beats breadth. One category, one ZIP, 60 days of saturation. Beachhead discipline means the data is dense enough to train the matching agent on real outcomes — not noise.",
  },
  {
    q: "Do I need a credit card for the Pilot?",
    a: "No. $0 Pilot is actually $0. You add payment when you cross 10 verified customers, not before.",
  },
  {
    q: "What about legacy plans?",
    a: "Existing founding cohort merchants on the legacy SaaS tiers are grandfathered on their current contract. v5.0 outcome-based pricing (Pilot + Performance) applies to new merchants only.",
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
            <span className="eyebrow pr-hero-eyebrow">Outcome Pricing</span>
            <span className="rule" />
            <span className="pr-hero-eyebrow-sub">
              For Merchants · Williamsburg Coffee
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
              $0 Pilot for first 10 merchants. Then $500/mo min + $40/verified
              customer. No legacy agency markup — we are the agency, powered by
              AI.
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
            $0 Pilot means $0. No credit card required. Move to Performance
            after your 10th AI-verified customer. Creator payouts funded from
            per-customer billing — never per-impression.
          </p>
        </div>
      </section>

      {/* ══ 3. ENTERPRISE ROW ═════════════════════════════════ */}
      <section className="section-bright pr-enterprise-section reveal">
        <div className="container pr-enterprise-inner">
          <div className="pr-enterprise-left">
            <p className="eyebrow pr-enterprise-eyebrow">Enterprise Agency</p>
            <h2 className="pr-enterprise-h">
              Running 5+ locations?{" "}
              <span className="pr-enterprise-h-light">Let&apos;s talk.</span>
            </h2>
            <p className="pr-enterprise-desc">
              Custom per-customer rates, dedicated agent tuning, volume
              verification throughput, SLA guarantees, SSO + API integration.
              Built for franchise operators and multi-location chains treating
              customer acquisition as an ops function.
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
                Dedicated agent tuning + performance review
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Custom verification &amp; reporting SLA
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                SSO, API, and webhook integrations
              </li>
              <li>
                <span className="pr-enterprise-bullet" />
                Priority access to Proven+ creator tiers
              </li>
            </ul>
            <Link href="/merchant/enterprise" className="btn btn-primary">
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
            <span className="section-tag-label">Plan Comparison</span>
          </div>

          <h2 className="pr-compare-h reveal">
            Two plans, <span className="pr-compare-h-light">side by side.</span>
          </h2>

          <div className="pr-compare-wrap reveal">
            <table className="pr-compare-table">
              <thead>
                <tr>
                  <th className="pr-th-feature">Feature</th>
                  <th className="pr-th-plan">Pilot</th>
                  <th className="pr-th-plan pr-th-featured">Performance</th>
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
                      {typeof row.performance === "boolean" ? (
                        <span
                          className={`pr-td-icon ${row.performance ? "pr-td-icon--yes" : "pr-td-icon--no"}`}
                        >
                          {row.performance ? <CheckIcon /> : <XIcon />}
                        </span>
                      ) : (
                        row.performance
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
            Claude Vision receipt OCR + geo-match. No verification, no charge.
            Your budget only moves when a real customer walks through the door
            and the AI confirms it.
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
              No SaaS. No agency markup. Just verified customers.
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
            <Link href="/merchant/enterprise" className="btn pr-cta-btn-ghost">
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
