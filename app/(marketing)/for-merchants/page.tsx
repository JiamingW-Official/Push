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
    note: "Elite tier. Up to $80/mo milestone bonus.",
  },
];

/* ── Pricing plans (v5.0 outcome-based) ─────────────────────── */
const PLANS = [
  {
    name: "Pilot",
    price: "$0",
    period: "for first 10 merchants",
    desc: "First 10 customers free. No catch. If the AI can't deliver, you don't pay.",
    features: [
      "Up to 10 verified customers free",
      "AI creator matching in 60s",
      "Claude Vision receipt verification",
      "QR + geo attribution",
      "Weekly performance review",
    ],
    featured: false,
    cta: "Apply for pilot",
    roi: "First 10 customers on us — acquisition cost zero",
  },
  {
    name: "Performance",
    price: "$500",
    period: "/mo min + $40/customer",
    desc: "You set the target. The agent delivers. Pay only for AI-verified visits.",
    features: [
      "Unlimited AI-matched campaigns",
      "Dedicated agent tuning",
      "Two-Tier Hero + Sustained offers",
      "Creator tier 2–6 access (Proven+ priority)",
      "Day-1 multi-modal verification",
      "Dispute SLA: 24h",
    ],
    featured: true,
    badge: "Outcome-Based",
    cta: "Talk to agent",
    roi: "$40 per AI-verified customer — no cap, no markup",
  },
];

export default function ForMerchantsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="fm-hero">
        <div className="container fm-hero-inner">
          <p className="eyebrow fm-eyebrow">
            Push for Merchants · Williamsburg Coffee Pilot
          </p>

          <h1 className="fm-headline">
            <span className="fm-headline-black">Tell us how many</span>
            <span className="fm-headline-ghost" aria-hidden="true">
              Tell us how many
            </span>
            <em className="fm-headline-em">customers</em>
            <span className="fm-headline-light">you need. We deliver.</span>
          </h1>

          <p className="fm-sub">
            AI-powered customer acquisition agency. Claude matches creators.
            <br />
            Every customer triple-checked by QR + Vision OCR + geo-match. Pay
            only for who walks through your door.
          </p>

          <div className="fm-ctas">
            <Link href="/merchant/pilot" className="btn btn-primary">
              Apply for $0 Pilot
            </Link>
            <Link href="#pricing" className="btn fm-outline-btn">
              See pricing
            </Link>
          </div>

          <p className="fm-reassure">
            No credit card for Pilot &nbsp;·&nbsp; 60s AI match &nbsp;·&nbsp;
            Cancel anytime
          </p>
        </div>

        {/* Ambient light layer */}
        <div className="fm-hero-ambient" aria-hidden="true" />
      </section>

      {/* ── Problem / Solution split ──────────────────────────── */}
      <section className="section section-bright fm-ps-section">
        <div className="container">
          <div className="fm-ps-grid">
            {/* Left: Problem */}
            <div className="fm-ps-col reveal">
              <p className="fm-ps-label fm-ps-label--problem">The Problem</p>
              <p className="fm-ps-statement">
                <strong>Paying for views</strong>
                <span className="fm-ps-ghost" aria-hidden="true">
                  Paying for views
                </span>
                <br />
                you can&apos;t verify.
              </p>
              <ul className="fm-ps-list">
                <li>
                  <span className="fm-ps-bullet" />
                  Agencies: $3,000+/mo + long-term contracts
                </li>
                <li>
                  <span className="fm-ps-bullet" />
                  Paid social: CPM model — no foot-traffic guarantee
                </li>
                <li>
                  <span className="fm-ps-bullet" />
                  Influencer posts: zero attribution, zero ROI tracking
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
              <p className="fm-ps-label fm-ps-label--solution">The Push Way</p>
              <p className="fm-ps-statement fm-ps-statement--solution">
                <strong>QR-verified foot traffic.</strong>
                <span
                  className="fm-ps-ghost fm-ps-ghost--solution"
                  aria-hidden="true"
                >
                  QR-verified foot traffic.
                </span>
                <br />
                Milestone payouts.
              </p>
              <ul className="fm-ps-list fm-ps-list--solution">
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Claude Vision + OCR + geo — triple-checked per customer
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Pay only after AI verifies — no disputed clicks
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  $0 Pilot for first 10 merchants &mdash; AI match in 60s
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="section fm-how-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">01</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">How It Works</span>
            </div>
            <h2 className="fm-how-headline">
              Three steps.
              <br />
              <span className="fm-how-headline-light">Zero guesswork.</span>
            </h2>
          </div>

          <ol className="fm-how-list">
            {[
              {
                n: "01",
                title: "Tell the agent your goal",
                body: 'Input: "20 new customers this month, $400 budget, coffee, Williamsburg." Takes 60 seconds. Claude parses objective, budget, category, and ZIP — no brief writing.',
              },
              {
                n: "02",
                title: "AI matches + runs the campaign",
                body: "Claude ranks top 5 creators by geo, category, and verified conversion history. Drafts briefs. Predicts ROI. You approve — or let the agent auto-run.",
              },
              {
                n: "03",
                title: "Delivered customers — or it's free",
                body: "Every scan runs through Claude Vision (receipt OCR) + QR + geo-match in <8s. Pay $40/customer only when all three pass. If the AI can't deliver, you don't pay.",
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

      {/* ── Creator tier showcase ─────────────────────────────── */}
      <section className="section section-bright fm-tiers-section">
        <div className="container">
          <div className="reveal">
            <div className="section-tag">
              <span className="section-tag-num">02</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Creator Tiers</span>
            </div>
            <h2 className="fm-tiers-headline">
              Six tiers.
              <br />
              <span className="fm-tiers-headline-light">
                Every creator verified.
              </span>
            </h2>
            <p className="fm-tiers-sub">
              From zero-follower newcomers to 100K+ partners — every creator on
              Push is ranked by verified performance, not vanity metrics.
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

      {/* ── Pricing teaser ───────────────────────────────────── */}
      <section id="pricing" className="section fm-pricing-section">
        <div className="container">
          <div className="fm-pricing-header reveal">
            <div>
              <div
                className="section-tag"
                style={{ marginBottom: "var(--space-3)" }}
              >
                <span className="section-tag-num">03</span>
                <span className="section-tag-line" />
                <span className="section-tag-label">Pricing</span>
              </div>
              <h2 className="fm-pricing-headline">
                Outcome pricing.
                <br />
                <span className="fm-pricing-headline-light">Not SaaS.</span>
              </h2>
            </div>
            <p className="fm-pricing-note">
              Cancel anytime. No agency markup.
              <br />
              Pay only for AI-verified customers.
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
              Full pricing details, including per-visit rates →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Case study pull-quote ─────────────────────────────── */}
      <section className="section section-bright fm-quote-section">
        <div className="container">
          <div className="fm-quote-wrap reveal">
            <span className="fm-quote-rule" aria-hidden="true" />
            <blockquote className="fm-pull-quote">
              <p className="fm-pull-quote-text">
                &ldquo;Push agent ran 60 seconds, matched 14 creators, drafted
                briefs. First week: 11 AI-verified customers.&rdquo;
              </p>
              <footer className="fm-pull-quote-footer">
                <cite className="fm-pull-quote-cite">
                  Marco A., Sey Coffee &mdash; Williamsburg, NYC
                </cite>
                <span className="fm-pull-quote-meta">
                  $0 Pilot &nbsp;·&nbsp; 5 active creators &nbsp;·&nbsp; $440 in
                  verified customers
                </span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="fm-final-cta">
        <div className="container">
          <div className="fm-final-inner reveal">
            <p className="eyebrow fm-final-eyebrow">Ready to start</p>
            <h2 className="fm-final-headline">
              Start getting verified
              <br />
              <span className="fm-final-headline-light">customers.</span>
            </h2>
            <p className="fm-final-sub">
              Tell the agent your goal. Claude matches creators in 60s. Pay only
              for AI-verified customers. First 10 merchants get $0 Pilot.
            </p>
            <Link
              href="/merchant/pilot"
              className="btn btn-primary fm-final-btn"
            >
              Apply for $0 Pilot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
