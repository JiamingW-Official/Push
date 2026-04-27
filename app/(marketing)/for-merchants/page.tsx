import type { Metadata } from "next";
import Link from "next/link";
import "./merchants.css";

export const metadata: Metadata = {
  title: "For Merchants — Push NYC",
  description:
    "Pay only when a customer walks in. Push connects your storefront to local creators — verified foot traffic, no upfront spend, real-time dashboard.",
};

/* ── Comparison table data ───────────────────────────────── */
const COMPARE_ROWS = [
  {
    feature: "Verified visits",
    push: true,
    yelp: false,
    agency: false,
    groupon: false,
  },
  {
    feature: "Pay per visit",
    push: true,
    yelp: false,
    agency: false,
    groupon: false,
  },
  {
    feature: "No upfront spend",
    push: true,
    yelp: false,
    agency: false,
    groupon: false,
  },
  {
    feature: "Real-time dashboard",
    push: true,
    yelp: true,
    agency: false,
    groupon: false,
  },
  {
    feature: "Fraud prevention",
    push: true,
    yelp: false,
    agency: false,
    groupon: false,
  },
];

const COMPARE_COLS = ["Push", "Yelp Ads", "Influencer Agency", "Groupon"];

/* ── Page ─────────────────────────────────────────────────── */
export default function ForMerchantsPage() {
  return (
    <main>
      {/* ═══ 01 — HERO (dark panel, bottom-left title) ══════ */}
      <section aria-label="Hero" className="mn-hero">
        {/* Ghost "NYC" watermark — opacity 0.03 */}
        <span aria-hidden="true" className="mn-hero-watermark">
          NYC
        </span>

        <div className="mn-hero-inner">
          {/* Left — title block, bottom-left anchored */}
          <div className="mn-hero-copy">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}
            >
              (FOR MERCHANTS)
            </p>

            <h1 className="mn-hero-title">
              Bring customers
              <br />
              through the <span className="mn-hero-title-accent">door.</span>
            </h1>

            <p className="mn-hero-body">
              Push ties your storefront to local creators. Customers scan a QR
              at checkout — you pay per verified walk-in, not per impression. No
              retainer. No setup fees. No guesswork.
            </p>

            <div className="mn-hero-actions">
              <Link href="/merchant/signup" className="btn-primary click-shift">
                Get started free
              </Link>
              <Link
                href="#how-it-works"
                className="btn-ghost click-shift"
                style={{
                  borderColor: "rgba(255,255,255,0.30)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Right — liquid glass stat badge */}
          <div
            className="lg-surface--dark mn-hero-badge"
            aria-label="1.4M+ verified visits"
          >
            <div className="mn-hero-live">
              <span className="mn-hero-live-dot" />
              <span className="mn-hero-live-label">Live</span>
            </div>
            <div className="mn-hero-badge-num">1.4M+</div>
            <p className="mn-hero-badge-label">Verified visits</p>
          </div>
        </div>
      </section>

      {/* ═══ Sig divider ══════════════════════════════════════ */}
      <span className="sig-divider" aria-hidden="true">
        Pay for visits · Not impressions · Verified ·
      </span>

      {/* ═══ 02 — VALUE PROP (3 numbered editorial rows, dark bg) */}
      <section aria-label="Why Push" className="mn-value">
        <div className="mn-value-inner">
          <div className="mn-value-header">
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.40)" }}>
              (WHY THIS EXISTS)
            </p>
            <h2 className="mn-value-title">
              The only platform
              <br />
              that ties ads to visits.
            </h2>
          </div>

          <div className="mn-value-rows">
            {[
              {
                num: "01",
                title: "Zero upfront risk.",
                body: "Post a campaign with no setup fee and no monthly retainer. Your first dollar only moves when a real customer scans at your door.",
              },
              {
                num: "02",
                title: "Creators you trust.",
                body: "Push surfaces your campaign to verified local creators — people who actually live, eat, and shop in your neighborhood. Not bots. Not influencer farms.",
              },
              {
                num: "03",
                title: "Every visit, proven.",
                body: "GPS timestamp + QR oracle verification on every scan. The dashboard shows you each walk-in in real time. No modeled lift. No impressions that might have driven traffic.",
              },
            ].map((row) => (
              <div key={row.num} className="mn-value-row">
                <div className="mn-value-num">{row.num}</div>
                <h3 className="mn-value-row-title">{row.title}</h3>
                <p className="mn-value-row-body">{row.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 — HOW IT WORKS (oversized step numbers) ════════ */}
      <section id="how-it-works" aria-label="How it works" className="mn-how">
        <div className="mn-how-inner">
          <div className="mn-how-header">
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (THREE STEPS)
            </p>
            <h2 className="mn-how-title">
              Up and running
              <br />
              in three moves.
            </h2>
          </div>

          <div className="mn-steps">
            {[
              {
                num: "01",
                title: "Post a campaign.",
                body: "Set your offer, daily budget cap, and block radius. Push surfaces your campaign to nearby creators — live inside 24 hours.",
              },
              {
                num: "02",
                title: "Creator promotes.",
                body: "A local creator shares your QR poster to their audience. Each creator gets a unique code tied to their account — no two scans ever look alike.",
              },
              {
                num: "03",
                title: "Pay per walk-in.",
                body: "Customer scans at the door — GPS + timestamp oracle-verified. No fraud, no replay attacks. Every visit lands in your dashboard in real time.",
              },
            ].map((step) => (
              <div key={step.num} className="mn-step click-shift">
                <div className="mn-step-num" aria-hidden="true">
                  {step.num}
                </div>
                <h3 className="mn-step-title">{step.title}</h3>
                <p className="mn-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Sig divider ══════════════════════════════════════ */}
      <span className="sig-divider" aria-hidden="true">
        Scan verified · Merchant pays · Creator earns ·
      </span>

      {/* ═══ 04 — PRICING TEASER (Butter Candy Panel) ══════════ */}
      <section aria-label="Pricing overview" className="mn-pricing">
        <div className="mn-pricing-inner">
          <div className="candy-panel mn-pricing-candy">
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (THE MATH)
            </p>
            <h2 className="mn-pricing-title">
              You pay only when
              <br />
              they walk in.
            </h2>
            <p className="mn-pricing-sub">
              Three plans. All cost-per-visit. No setup fee, no minimum spend,
              no long-term contract. Cancel anytime.
            </p>

            <div className="mn-plan-grid">
              {[
                {
                  name: "Starter",
                  price: "$3.50",
                  unit: "per visit",
                  desc: "Up to 200 verified visits / mo. Best for new merchants testing the channel.",
                  features: [
                    "5 active creators",
                    "1 location",
                    "Real-time dashboard",
                    "Basic fraud detection",
                  ],
                  featured: false,
                },
                {
                  name: "Growth",
                  price: "$3.00",
                  unit: "per visit",
                  desc: "Up to 1,000 verified visits / mo. The most popular plan for scaling merchants.",
                  features: [
                    "25 active creators",
                    "3 locations",
                    "Priority placement",
                    "Oracle fraud prevention",
                    "Campaign analytics",
                  ],
                  featured: true,
                },
                {
                  name: "Scale",
                  price: "$2.50",
                  unit: "per visit",
                  desc: "Unlimited visits. Custom creator matching, dedicated account manager.",
                  features: [
                    "Unlimited creators",
                    "Unlimited locations",
                    "Custom bid strategy",
                    "Dedicated support",
                    "API access",
                  ],
                  featured: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`mn-plan-card${plan.featured ? " mn-plan-card--featured" : ""}`}
                >
                  <p className="mn-plan-name">{plan.name}</p>
                  <div className="mn-plan-price">{plan.price}</div>
                  <p className="mn-plan-desc">
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink-4)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {plan.unit}
                    </span>
                    {" — "}
                    {plan.desc}
                  </p>
                  <ul className="mn-plan-features">
                    {plan.features.map((f) => (
                      <li key={f} className="mn-plan-feature">
                        <span
                          className="mn-plan-feature-check"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mn-pricing-fine">
              No setup fee · No minimum spend · Cancel anytime ·{" "}
              <Link
                href="/pricing"
                className="click-shift"
                style={{ color: "var(--brand-red)", fontWeight: 700 }}
              >
                See full pricing &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 05 — TESTIMONIAL PULL QUOTE (brand-red full-width) */}
      <section aria-label="Merchant testimonial" className="mn-quote-strip">
        <span aria-hidden="true" className="mn-quote-ghost">
          &ldquo;
        </span>
        <div className="mn-quote-inner">
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.50)", marginBottom: 24 }}
          >
            (FREEHOLD BROOKLYN · WILLIAMSBURG)
          </p>
          <blockquote className="mn-quote-text">
            &ldquo;Push gave us 340% better ROI than our paid social campaign —
            and every visit was verified at the door. We know exactly which
            creator drove each customer.&rdquo;
          </blockquote>
          <div className="mn-quote-attr">
            <div className="mn-quote-dash" aria-hidden="true" />
            <p className="mn-quote-name">
              Marcus Lee · General Manager, Freehold Brooklyn
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 06 — METRICS STRIP (dark panel, massive Darky numbers) */}
      <section aria-label="Platform metrics" className="mn-metrics">
        <div className="mn-metrics-inner">
          <div className="mn-metrics-header">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.40)", marginBottom: 16 }}
            >
              (THE NUMBERS)
            </p>
            <h2 className="mn-metrics-title">The platform in numbers.</h2>
          </div>

          <div className="mn-metrics-row">
            {[
              { num: "1.4M+", label: "Verified visits" },
              { num: "100+", label: "Active merchants" },
              { num: "$3.50", label: "Avg cost per visit" },
            ].map((m) => (
              <div key={m.num} className="mn-metric-item">
                <div className="mn-metric-num">{m.num}</div>
                <p className="mn-metric-label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 07 — COMPARISON TABLE (editorial) ═════════════════ */}
      <section aria-label="Comparison" className="mn-compare">
        <div className="mn-compare-inner">
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (THE COMPARISON)
          </p>
          <h2 className="mn-compare-title">Push vs. the rest.</h2>

          <div style={{ overflowX: "auto" }}>
            <table className="mn-compare-table">
              <thead>
                <tr>
                  <th scope="col" style={{ color: "var(--ink-3)" }}>
                    (FEATURE)
                  </th>
                  {COMPARE_COLS.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={i === 0 ? "col-push" : "col-other"}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td className="col-feature">{row.feature}</td>
                    {[row.push, row.yelp, row.agency, row.groupon].map(
                      (val, i) => (
                        <td
                          key={i}
                          className={
                            i === 0 ? "col-check-push" : "col-check-other"
                          }
                        >
                          {val ? "✓" : "—"}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ 08 — TICKET CTA ════════════════════════════════════ */}
      <section
        aria-label="Start your first campaign"
        className="mn-ticket-wrap"
      >
        <div className="mn-ticket-inner">
          <div className="ticket-panel">
            {/* Four corner grommets */}
            <span
              className="ticket-grommet ticket-grommet--tl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--tr"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--bl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--br"
              aria-hidden="true"
            />

            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.60)", marginBottom: 24 }}
            >
              (YOUR FIRST CAMPAIGN)
            </p>
            <h2 className="mn-ticket-headline">Launch your first campaign.</h2>
            <Link href="/merchant/signup" className="btn-ink click-shift">
              Get started — no upfront cost
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
