import Link from "next/link";
import type { Metadata } from "next";
import "./case-studies.css";

export const metadata: Metadata = {
  title: "Case Studies — Push",
  description:
    "Real merchants. Real results. See how NYC businesses drive verified foot traffic with Push creator campaigns.",
};

const CASE_STUDIES = [
  {
    slug: "the-smith-williamsburg",
    merchant: "The Smith Williamsburg",
    category: "Dining",
    neighborhood: "Williamsburg, Brooklyn",
    stat: "240%",
    statLabel: "increase in walk-ins month 1",
    excerpt:
      "The Smith launched a 6-creator Push campaign and saw walk-ins surge 240% in the first 30 days — every visit QR-verified at the point of sale.",
  },
  {
    slug: "bar-blondeau",
    merchant: "Bar Blondeau",
    category: "Bar",
    neighborhood: "Williamsburg, Brooklyn",
    stat: "890",
    statLabel: "creator-verified visits",
    excerpt:
      "Creator content drove 890 verified visits over an 8-week campaign. Cost per new customer: under $9.",
  },
  {
    slug: "sweetcatch-poke",
    merchant: "Sweetcatch Poke",
    category: "Fast Casual",
    neighborhood: "Midtown, Manhattan",
    stat: "$8.40",
    statLabel: "avg cost per new customer",
    excerpt:
      "Sweetcatch ran 12 creators across two neighborhoods and brought their customer acquisition cost to $8.40 — verified, not modeled.",
  },
  {
    slug: "misi-restaurant",
    merchant: "Misi Restaurant",
    category: "Fine Dining",
    neighborhood: "Williamsburg, Brooklyn",
    stat: "0",
    statLabel: "fraudulent scans across 1,200 visits",
    excerpt:
      "18 creators. 1,200 verified visits. Zero fraud. Push oracle validation caught every replay attack before payout.",
  },
  {
    slug: "freehold-brooklyn",
    merchant: "Freehold Brooklyn",
    category: "Venue",
    neighborhood: "Williamsburg, Brooklyn",
    stat: "340%",
    statLabel: "ROI vs paid social",
    excerpt:
      "Freehold compared Push's verified-visit model head-to-head against a paid social campaign. Push delivered 340% better ROI.",
  },
  {
    slug: "tacos-park-slope",
    merchant: "Tacos Park Slope",
    category: "Fast Casual",
    neighborhood: "Park Slope, Brooklyn",
    stat: "400",
    statLabel: "monthly verified visits in 6 weeks",
    excerpt:
      "Zero creator program on day one. 400 verified monthly visits by week six. From cold start to full cadence in 42 days.",
  },
];

/* Featured case study = first entry */
const FEATURED = CASE_STUDIES[0];
const REST = CASE_STUDIES.slice(1);

const FILTER_CATEGORIES = [
  "All",
  "Dining",
  "Bar",
  "Fast Casual",
  "Fine Dining",
  "Venue",
];

/* ── Page ─────────────────────────────────────────────────── */
export default function CaseStudiesPage() {
  return (
    <>
      {/* ══════════════ 01 — HERO (dark, bottom-left) ══════════ */}
      <section aria-label="Hero" className="cs-hero">
        <span aria-hidden="true" className="cs-hero-watermark">
          PROOF
        </span>

        <div className="cs-hero-inner">
          {/* Left — bottom-left anchored title */}
          <div className="cs-hero-copy">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}
            >
              (PROOF)
            </p>
            <h1 className="cs-hero-title">
              Results
              <br />
              <span className="cs-hero-title-line2">speak.</span>
            </h1>
          </div>

          {/* Right — liquid glass stat badge */}
          <div
            className="lg-surface--dark cs-hero-badge"
            aria-label="100+ businesses on Push"
          >
            <div className="cs-hero-badge-num">100+</div>
            <p className="cs-hero-badge-label">Businesses</p>
          </div>
        </div>
      </section>

      {/* ══════════════ Sig divider ══════════════════════════ */}
      <span className="sig-divider" aria-hidden="true">
        Posted · Scanned · Verified ·
      </span>

      {/* ══════════════ Category filter rail ════════════════ */}
      <nav aria-label="Filter by category" className="cs-filter-rail">
        <div className="cs-filter-inner">
          <span className="cs-filter-label">(FILTER)</span>
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="btn-pill click-shift"
              aria-pressed={cat === "All"}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════════ 02 — FEATURED CASE STUDY ════════════ */}
      <section aria-label="Featured case study" className="cs-featured">
        <div className="cs-featured-inner">
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 32 }}
          >
            (FEATURED)
          </p>

          <Link
            href={`/case-studies/${FEATURED.slug}`}
            className="cs-featured-card"
            aria-label={`Read case study: ${FEATURED.merchant}`}
          >
            {/* Left — photo with gradient overlay */}
            <div className="cs-featured-image">
              <div
                className="cs-featured-image-placeholder"
                aria-hidden="true"
              />
              <div className="cs-featured-image-meta">
                <p className="cs-featured-image-title">{FEATURED.merchant}</p>
                <p className="cs-featured-image-meta-text">
                  {FEATURED.category} · {FEATURED.neighborhood}
                </p>
              </div>
            </div>

            {/* Right — content */}
            <div className="cs-featured-content">
              <p
                className="eyebrow"
                style={{ color: "var(--ink-3)", marginBottom: 16 }}
              >
                ({FEATURED.category.toUpperCase()} ·{" "}
                {FEATURED.neighborhood.toUpperCase()})
              </p>
              <div className="cs-featured-stat">{FEATURED.stat}</div>
              <p className="cs-featured-stat-label">{FEATURED.statLabel}</p>
              <p className="cs-featured-excerpt">{FEATURED.excerpt}</p>
              <span
                className="btn-ghost click-shift"
                style={{ alignSelf: "flex-start" }}
              >
                Read the case study &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════ Sig divider ══════════════════════════ */}
      <span className="sig-divider" aria-hidden="true">
        Verified · Attributed · Paid ·
      </span>

      {/* ══════════════ 03 — CASE STUDIES GRID (3-col) ══════ */}
      <section aria-label="All case studies" className="cs-grid-section">
        <div className="cs-grid-inner">
          <div className="cs-grid-header">
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (ALL CASE STUDIES)
            </p>
            <h2 className="cs-grid-title">
              Six campaigns.
              <br />
              Six proof points.
            </h2>
          </div>

          <div className="cs-grid">
            {REST.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="cs-card"
                aria-label={`Read case study: ${cs.merchant}`}
              >
                {/* Photo with overlay */}
                <div className="cs-card-photo">
                  <div
                    className="cs-card-photo-placeholder"
                    aria-hidden="true"
                  />
                  <span className="cs-card-cat">
                    ({cs.category.toUpperCase()})
                  </span>
                  <div className="cs-card-overlay">
                    <p className="cs-card-overlay-stat">{cs.stat}</p>
                    <p className="cs-card-overlay-stat-label">{cs.statLabel}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="cs-card-body">
                  <h3 className="cs-card-merchant">{cs.merchant}</h3>
                  <p className="cs-card-neighborhood">{cs.neighborhood}</p>
                  <p className="cs-card-excerpt">{cs.excerpt}</p>
                  <span className="cs-card-cta">
                    Read more{" "}
                    <span className="cs-card-cta-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 04 — METHODOLOGY (Ink strip) ════════ */}
      <section
        aria-label="How Push verifies results"
        className="cs-method-strip"
      >
        <div className="cs-method-inner">
          {/* Left — title + stats */}
          <div>
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.40)", marginBottom: 16 }}
            >
              (THE METHOD)
            </p>
            <h2 className="cs-method-title">
              Every number
              <br />
              is verified.
            </h2>
            <div className="cs-method-stats">
              {[
                { val: "100%", label: "QR-verified visits" },
                { val: "0", label: "Fraudulent scans paid" },
                { val: "3×", label: "Avg oracle confidence" },
                { val: "$0", label: "Estimated-lift billing" },
              ].map((s) => (
                <div key={s.val} className="cs-method-stat">
                  <p className="cs-method-stat-val">{s.val}</p>
                  <p className="cs-method-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — method cards */}
          <div className="cs-method-cards">
            {[
              {
                num: "01",
                title: "QR oracle scan",
                body: "Every QR code is unique per creator per campaign. The oracle validates GPS coordinates, timestamp, and device fingerprint in under 400ms.",
              },
              {
                num: "02",
                title: "Replay attack prevention",
                body: "Codes expire after a single use within a 15-minute window. Attempting to reuse a code from a screenshot or screen recording is caught automatically.",
              },
              {
                num: "03",
                title: "Pay only on verification",
                body: "Your billing is charged only after oracle confidence exceeds threshold. Borderline scans are held for human review — never auto-billed.",
              },
            ].map((m) => (
              <div key={m.num} className="cs-method-card">
                <p className="cs-method-card-num">{m.num}</p>
                <h3 className="cs-method-card-title">{m.title}</h3>
                <p className="cs-method-card-body">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 05 — TICKET CTA ════════════════════ */}
      <section aria-label="Start your campaign" className="cs-ticket-wrap">
        <div className="cs-ticket-inner">
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
              (YOUR TURN)
            </p>
            <h2 className="cs-ticket-headline">See your results.</h2>
            <Link href="/for-merchants" className="btn-ink click-shift">
              Start a campaign
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
