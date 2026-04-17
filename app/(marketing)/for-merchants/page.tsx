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

/* ── Pricing plans ───────────────────────────────────────────── */
const PLANS = [
  {
    name: "Starter",
    price: "$19.99",
    period: "/mo",
    desc: "One location. Two campaigns. Real attribution from day one.",
    features: [
      "2 active campaigns",
      "3 creator slots per campaign",
      "AI creator matching",
      "QR attribution",
      "Basic analytics",
    ],
    featured: false,
    cta: "Get started",
    roi: "Avg. $420 attributed revenue in month 1",
  },
  {
    name: "Growth",
    price: "$69",
    period: "/mo",
    desc: "Scale across your location. Better matching, deeper data.",
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
    price: "$199",
    period: "/mo",
    desc: "Multi-location operators running ongoing creator programs.",
    features: [
      "Unlimited campaigns",
      "Unlimited creator slots",
      "Dedicated account manager",
      "Custom attribution rules",
      "API access",
    ],
    featured: false,
    cta: "Get Pro",
    roi: "Full white-glove setup included",
  },
];

export default function ForMerchantsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="fm-hero">
        <div className="container fm-hero-inner">
          <p className="eyebrow fm-eyebrow">Push for Merchants · NYC</p>

          <h1 className="fm-headline">
            <span className="fm-headline-black">Find creators who</span>
            <span className="fm-headline-ghost" aria-hidden="true">
              Find creators who
            </span>
            <em className="fm-headline-em">actually</em>
            <span className="fm-headline-light">drive foot traffic.</span>
          </h1>

          <p className="fm-sub">
            QR-verified attribution. Milestone payouts. No agency fees.
            <br />
            Know exactly which creator drove which customer — and pay only for
            results.
          </p>

          <div className="fm-ctas">
            <Link href="/merchant/signup" className="btn btn-primary">
              Launch a campaign
            </Link>
            <Link href="#pricing" className="btn fm-outline-btn">
              See pricing
            </Link>
          </div>

          <p className="fm-reassure">
            No credit card to explore &nbsp;·&nbsp; Campaign live in 24h
            &nbsp;·&nbsp; Cancel anytime
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
                  Every scan logged — transaction-level attribution
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Pay only after verification — no disputed clicks
                </li>
                <li>
                  <span className="fm-ps-bullet fm-ps-bullet--solution" />
                  Campaign live in 24 hours, from $19.99/mo
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
                title: "Post a campaign brief",
                body: "Set your goal, payout structure, and creator requirements. Takes 10 minutes. Push handles creator matching, QR generation, and attribution from there.",
              },
              {
                n: "02",
                title: "Accept applicants from verified tiers",
                body: "Push surfaces creators ranked by performance score, proximity, and tier. You approve or auto-accept — every creator is verified before they post.",
              },
              {
                n: "03",
                title: "Pay on milestones, not promises",
                body: "Payouts release automatically after QR-verified visits. No manual tracking, no invoice disputes, no agency overhead — just clean, verified results.",
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
                Flat monthly.
                <br />
                <span className="fm-pricing-headline-light">
                  No hidden fees.
                </span>
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
                &ldquo;We got 340 verified walk-ins in 6 weeks. We never paid
                for a single click.&rdquo;
              </p>
              <footer className="fm-pull-quote-footer">
                <cite className="fm-pull-quote-cite">
                  Owner, Roberta&apos;s Bed-Stuy &mdash; Brooklyn, NYC
                </cite>
                <span className="fm-pull-quote-meta">
                  Growth plan &nbsp;·&nbsp; 6 active creators &nbsp;·&nbsp;
                  $69/mo
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
              Launch a campaign in 10 minutes. Pay only for QR-verified visits.
              No agency fees. No long-term contracts.
            </p>
            <Link
              href="/merchant/signup"
              className="btn btn-primary fm-final-btn"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
