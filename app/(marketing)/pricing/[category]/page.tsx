import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../../landing.css";
import "./category.css";

/* ── Vertical catalog (v5.1 authoritative numbers from UPDATE_INSTRUCTIONS_v5_1.md §2 problem 2) ── */

type RetentionTier = {
  visit2: number; // $/verified visit 2 within 30 days
  visit3: number; // $/verified visit 3 within 60 days
  loyalty: number; // $/loyalty opt-in at first visit
};

type Vertical = {
  slug: string;
  name: string; // Short vertical label
  title: string; // Full marketing title
  eyebrow: string; // Hero eyebrow qualifier
  avgAOV: number; // Merchant avg transaction $
  annualVisits: number; // Avg annual repeat visits per customer
  perCustomer: number; // Push per-customer price $
  breakevenVisit: number; // Visit # at which merchant recoups Push spend
  merchantGM: number; // Assumed gross-margin rate on AOV (illustrative)
  retention: RetentionTier;
  rationale: string; // Why this rate (GM × 2 explanation)
  eligibility: string[]; // Business-type examples in this vertical
};

const VERTICALS: Vertical[] = [
  {
    slug: "coffee",
    name: "Pure coffee",
    title: "Pure coffee",
    eyebrow: "Pure coffee",
    avgAOV: 6,
    annualVisits: 8,
    perCustomer: 15,
    breakevenVisit: 3,
    merchantGM: 0.7,
    retention: { visit2: 8, visit3: 6, loyalty: 4 },
    rationale:
      "Pure coffee AOV $6 × 70% GM = $4.20 per-visit merchant margin. Push $15 per-customer is capped at merchant GM × 2 — merchant recoups at visit 3, and 8× annual repeat makes the math carry. Priced for volume, not luxury.",
    eligibility: [
      "Independent coffee shops with $5–8 ticket average",
      "Third-wave espresso-first cafés without food program",
      "Drip & cold brew kiosks in high-density residential ZIPs",
      "Williamsburg, Bushwick, LES — hip neighborhood, lean menu",
    ],
  },
  {
    slug: "coffee-plus",
    name: "Coffee+",
    title: "Coffee+ (specialty coffee with bakery or brunch)",
    eyebrow: "Coffee+ · brunch + bakery",
    avgAOV: 14,
    annualVisits: 4,
    perCustomer: 25,
    breakevenVisit: 2,
    merchantGM: 0.65,
    retention: { visit2: 8, visit3: 6, loyalty: 4 },
    rationale:
      "Coffee+ AOV $14 × 65% GM = $9.10 merchant margin > $8 Push net cost (after creator payout). Merchant clears margin at visit 1 and recoups Push spend at visit 2. This is Push's v5.1 beachhead rate — unit economics verified.",
    eligibility: [
      "Specialty cafés with bakery or pastry program ($10–20 ticket)",
      "All-day brunch spots with espresso service",
      "Third-wave roasters with breakfast or light lunch menu",
      "Any Williamsburg Coffee+ shop already running Pilot",
    ],
  },
  {
    slug: "dessert",
    name: "Specialty dessert",
    title: "Specialty dessert",
    eyebrow: "Specialty dessert",
    avgAOV: 11,
    annualVisits: 3,
    perCustomer: 22,
    breakevenVisit: 2,
    merchantGM: 0.68,
    retention: { visit2: 8, visit3: 6, loyalty: 4 },
    rationale:
      "Dessert AOV $11 × 68% GM = $7.48 margin per visit. Push $22 per-customer recoups at visit 2. Dessert has Instagram-native content (latte-art-equivalent visuals) — creator conversion rate runs higher, so we hold rate ceiling near coffee+ without subsidizing.",
    eligibility: [
      "Specialty bakeries, patisseries, French-Japanese-Korean dessert",
      "Ice cream, gelato, soft-serve shops ($6–15 ticket)",
      "Specialty chocolate, cookie, or doughnut shops",
      "Matcha, boba, or dessert-forward café concepts",
    ],
  },
  {
    slug: "fitness",
    name: "Boutique fitness",
    title: "Boutique fitness trial class",
    eyebrow: "Boutique fitness · trial class",
    avgAOV: 55,
    annualVisits: 5,
    perCustomer: 60,
    breakevenVisit: 2,
    merchantGM: 0.75,
    retention: { visit2: 24, visit3: 18, loyalty: 12 },
    rationale:
      "Boutique fitness trial AOV $55 × 75% GM = $41 margin. Push $60 per-customer recoups at visit 2 — and post-trial membership LTV is 6–12 months. The Retention Add-on ($24/$18/$12) prices the higher conversion-to-member value that Push keeps pulling in after trial 1.",
    eligibility: [
      "Boutique pilates, barre, yoga, spin studios",
      "Climbing gyms and strength-training microgyms",
      "Martial arts, dance, or hybrid HIIT studios",
      "Anywhere a $30–90 trial converts to a monthly membership",
    ],
  },
  {
    slug: "beauty",
    name: "Beauty service",
    title: "Beauty service",
    eyebrow: "Beauty service",
    avgAOV: 80,
    annualVisits: 3,
    perCustomer: 85,
    breakevenVisit: 2,
    merchantGM: 0.7,
    retention: { visit2: 24, visit3: 18, loyalty: 12 },
    rationale:
      "Beauty AOV $80 × 70% GM = $56 merchant margin. Push $85 per-customer — still capped at merchant GM × 2 boundary. Merchant recoups at visit 2, and 3× annual repeat puts LTV at $240 spend / $168 margin. The higher retention tier reflects high-ticket loyalty economics.",
    eligibility: [
      "Independent hair salons, barbers, colorists",
      "Nail studios, lash, brow, waxing specialists",
      "Facials, skincare, medspa, and aesthetic service providers",
      "Any service studio with $50–150 ticket and 6–12 week repeat cadence",
    ],
  },
];

const SLUGS = VERTICALS.map((v) => v.slug);

function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

/* ── Static generation ────────────────────────────────────────── */

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ category: v.slug }));
}

/* ── Dynamic metadata ─────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const v = getVerticalBySlug(category);
  if (!v) {
    return {
      title: "Vertical pricing — Push Vertical AI for Local Commerce | Push",
    };
  }

  const title = `${v.name} pricing — Push Vertical AI for Local Commerce | Push`;
  const description = `Push charges $${v.perCustomer} per AI-verified ${v.name.toLowerCase()} customer. Rate derived from merchant gross-margin × 2 on $${v.avgAOV} AOV. QR + Claude Vision + geo verification, Retention Add-on on repeat visits. Software Leverage Ratio priced for local commerce.`;

  const url = `https://withpush.co/pricing/${v.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

/* ── JSON-LD Product offer ───────────────────────────────────── */

function VerticalJsonLd({ v }: { v: Vertical }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Push per-customer pricing — ${v.name}`,
    description: `AI-verified customer acquisition for ${v.name.toLowerCase()} merchants. Per-customer rate derived from merchant gross-margin × 2.`,
    brand: {
      "@type": "Brand",
      name: "Push",
    },
    category: v.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: v.perCustomer.toFixed(2),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: v.perCustomer.toFixed(2),
        priceCurrency: "USD",
        unitText: "per AI-verified customer",
      },
      availability: "https://schema.org/InStock",
      url: `https://withpush.co/pricing/${v.slug}`,
      seller: {
        "@type": "Organization",
        name: "Push",
        url: "https://withpush.co",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Currency formatter ──────────────────────────────────────── */
function money(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function VerticalPricingPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const v = getVerticalBySlug(category);
  if (!v) notFound();

  // Derived economics
  const merchantPerVisitGM = v.avgAOV * v.merchantGM;
  const merchantLTV = v.avgAOV * v.annualVisits * v.merchantGM;
  const pushShareOfLTV = merchantLTV > 0 ? v.perCustomer / merchantLTV : 0;

  // Compact comparison — other verticals
  const others = VERTICALS.filter((x) => x.slug !== v.slug);

  return (
    <>
      <ScrollRevealInit />
      <VerticalJsonLd v={v} />

      {/* ══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pcat-hero">
        <div className="container pcat-hero-inner">
          <nav className="pcat-breadcrumb" aria-label="Breadcrumb">
            <Link href="/pricing">Pricing</Link>
            <span aria-hidden="true">/</span>
            <span className="pcat-breadcrumb-current">{v.name}</span>
          </nav>

          <div className="pcat-hero-label reveal">
            <span className="eyebrow pcat-hero-eyebrow">
              Vertical Pricing · {v.eyebrow}
            </span>
            <span className="rule" />
            <span className="pcat-hero-eyebrow-sub">
              Vertical AI for Local Commerce
            </span>
          </div>

          <h1 className="pcat-hero-h">
            <span
              className="pcat-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              {v.name}
            </span>
            <span
              className="pcat-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              {money(v.perCustomer)}/customer
            </span>
          </h1>

          <div
            className="pcat-hero-bottom reveal"
            style={{ transitionDelay: "220ms" }}
          >
            <p className="pcat-hero-sub">{v.rationale}</p>
            <div className="pcat-hero-anchors">
              <Link
                href={`/merchant/pilot?vertical=${v.slug}`}
                className="btn btn-primary"
              >
                Apply for Pilot
              </Link>
              <a href="#economics" className="btn btn-secondary">
                See unit economics
              </a>
            </div>
          </div>

          <span className="pcat-hero-ghost" aria-hidden="true">
            {money(v.perCustomer)}
          </span>
        </div>
      </section>

      {/* ══ 2. UNIT ECONOMICS BREAKDOWN ══════════════════════════ */}
      <section id="economics" className="section pcat-econ-section">
        <div className="container">
          <div className="pcat-section-tag reveal">
            <span className="pcat-tag-num">01</span>
            <span className="pcat-tag-line" />
            <span className="pcat-tag-label">Unit Economics</span>
          </div>

          <h2 className="pcat-econ-h reveal">
            How {money(v.perCustomer)} is{" "}
            <span className="pcat-econ-h-light">derived, not priced.</span>
          </h2>

          <p className="pcat-econ-intro reveal">
            Every vertical's per-customer rate is capped at merchant gross
            margin × 2. Not flat, not markup. Below is the exact math for{" "}
            {v.name.toLowerCase()}.
          </p>

          <div className="pcat-econ-grid reveal">
            <div className="pcat-econ-card">
              <span className="pcat-econ-label">Avg ticket (AOV)</span>
              <span className="pcat-econ-value">{money(v.avgAOV)}</span>
              <span className="pcat-econ-note">
                Observed {v.name.toLowerCase()} merchant baseline
              </span>
            </div>
            <div className="pcat-econ-arrow" aria-hidden="true">
              ×
            </div>
            <div className="pcat-econ-card">
              <span className="pcat-econ-label">Annual repeat visits</span>
              <span className="pcat-econ-value">{v.annualVisits}×</span>
              <span className="pcat-econ-note">
                Industry category retention baseline
              </span>
            </div>
            <div className="pcat-econ-arrow" aria-hidden="true">
              ×
            </div>
            <div className="pcat-econ-card">
              <span className="pcat-econ-label">Merchant gross margin</span>
              <span className="pcat-econ-value">
                {Math.round(v.merchantGM * 100)}%
              </span>
              <span className="pcat-econ-note">
                Per-unit contribution, post-COGS
              </span>
            </div>
            <div className="pcat-econ-arrow" aria-hidden="true">
              =
            </div>
            <div className="pcat-econ-card pcat-econ-card--hero">
              <span className="pcat-econ-label">Merchant LTV</span>
              <span className="pcat-econ-value">
                {money(Math.round(merchantLTV * 100) / 100)}
              </span>
              <span className="pcat-econ-note">
                Per AI-verified customer, gross-margin basis
              </span>
            </div>
          </div>

          <div className="pcat-derivation reveal">
            <div className="pcat-derivation-row">
              <span className="pcat-derivation-label">
                Per-visit merchant margin
              </span>
              <span className="pcat-derivation-value">
                {money(Math.round(merchantPerVisitGM * 100) / 100)}
              </span>
            </div>
            <div className="pcat-derivation-row">
              <span className="pcat-derivation-label">
                Push per-customer (capped at GM × 2)
              </span>
              <span className="pcat-derivation-value pcat-derivation-primary">
                {money(v.perCustomer)}
              </span>
            </div>
            <div className="pcat-derivation-row">
              <span className="pcat-derivation-label">
                Merchant recoups Push spend at
              </span>
              <span className="pcat-derivation-value">
                Visit {v.breakevenVisit}
              </span>
            </div>
            <div className="pcat-derivation-row pcat-derivation-row--final">
              <span className="pcat-derivation-label">
                Push share of merchant LTV
              </span>
              <span className="pcat-derivation-value">
                {Math.round(pushShareOfLTV * 100)}%
              </span>
            </div>
          </div>

          <p className="pcat-econ-footnote reveal">
            Unit economics work at every vertical, or we don't launch it.
            ConversionOracle trains on these verified walk-in events — the
            ground truth no horizontal platform can reach.
          </p>
        </div>
      </section>

      {/* ══ 3. RETENTION ADD-ON ═══════════════════════════════════ */}
      <section className="section-bright pcat-retention-section">
        <div className="container">
          <div className="pcat-section-tag reveal">
            <span className="pcat-tag-num">02</span>
            <span className="pcat-tag-line" />
            <span className="pcat-tag-label">Retention Add-on</span>
          </div>

          <h2 className="pcat-retention-h reveal">
            First visit funds acquisition.{" "}
            <span className="pcat-retention-h-light">
              Repeat visits fund LTV.
            </span>
          </h2>

          <p className="pcat-retention-intro reveal">
            Same 3-layer AI verification (QR + Claude Vision + geo-match).
            Software-margin fee, no new creator cost. Tier scales with{" "}
            {v.name.toLowerCase()} ticket size.
          </p>

          <div className="pcat-retention-table reveal">
            <div className="pcat-retention-row pcat-retention-row--head">
              <span className="pcat-retention-col">Event</span>
              <span className="pcat-retention-col">Window</span>
              <span className="pcat-retention-col pcat-retention-col--right">
                Rate ({v.name.toLowerCase()})
              </span>
            </div>
            <div className="pcat-retention-row">
              <span className="pcat-retention-col">Verified visit 2</span>
              <span className="pcat-retention-col">30 days</span>
              <span className="pcat-retention-col pcat-retention-col--right pcat-retention-rate">
                {money(v.retention.visit2)}
              </span>
            </div>
            <div className="pcat-retention-row">
              <span className="pcat-retention-col">Verified visit 3</span>
              <span className="pcat-retention-col">60 days</span>
              <span className="pcat-retention-col pcat-retention-col--right pcat-retention-rate">
                {money(v.retention.visit3)}
              </span>
            </div>
            <div className="pcat-retention-row">
              <span className="pcat-retention-col">Loyalty opt-in</span>
              <span className="pcat-retention-col">At first visit</span>
              <span className="pcat-retention-col pcat-retention-col--right pcat-retention-rate">
                {money(v.retention.loyalty)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. COMPARISON ROW ═════════════════════════════════════ */}
      <section className="section pcat-compare-section">
        <div className="container">
          <div className="pcat-section-tag reveal">
            <span className="pcat-tag-num">03</span>
            <span className="pcat-tag-line" />
            <span className="pcat-tag-label">Across Verticals</span>
          </div>

          <h2 className="pcat-compare-h reveal">
            {v.name} vs{" "}
            <span className="pcat-compare-h-light">other verticals.</span>
          </h2>

          <div className="pcat-compare-wrap reveal">
            <table className="pcat-compare-table">
              <thead>
                <tr>
                  <th className="pcat-th-feature">Vertical</th>
                  <th className="pcat-th">AOV</th>
                  <th className="pcat-th">Annual visits</th>
                  <th className="pcat-th">Per-customer</th>
                  <th className="pcat-th">Breakeven</th>
                </tr>
              </thead>
              <tbody>
                <tr className="pcat-tr pcat-tr--current">
                  <td className="pcat-td-feature">
                    <span className="pcat-current-dot" aria-hidden="true" />
                    {v.name}
                  </td>
                  <td className="pcat-td">{money(v.avgAOV)}</td>
                  <td className="pcat-td">{v.annualVisits}×</td>
                  <td className="pcat-td pcat-td-price">
                    {money(v.perCustomer)}
                  </td>
                  <td className="pcat-td">Visit {v.breakevenVisit}</td>
                </tr>
                {others.map((o) => (
                  <tr key={o.slug} className="pcat-tr">
                    <td className="pcat-td-feature">
                      <Link
                        href={`/pricing/${o.slug}`}
                        className="pcat-compare-link"
                      >
                        {o.name}
                      </Link>
                    </td>
                    <td className="pcat-td">{money(o.avgAOV)}</td>
                    <td className="pcat-td">{o.annualVisits}×</td>
                    <td className="pcat-td pcat-td-price">
                      {money(o.perCustomer)}
                    </td>
                    <td className="pcat-td">Visit {o.breakevenVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ 5. ELIGIBILITY ═══════════════════════════════════════ */}
      <section className="section-bright pcat-eligibility-section">
        <div className="container">
          <div className="pcat-section-tag reveal">
            <span className="pcat-tag-num">04</span>
            <span className="pcat-tag-line" />
            <span className="pcat-tag-label">Eligibility</span>
          </div>

          <h2 className="pcat-elig-h reveal">
            Who qualifies for{" "}
            <span className="pcat-elig-h-light">
              the {v.name.toLowerCase()} tier.
            </span>
          </h2>

          <p className="pcat-elig-intro reveal">
            Each vertical is scoped by ticket size and repeat-visit cadence —
            not by business label. Below are the business types typically
            signing at the {money(v.perCustomer)}/customer rate.
          </p>

          <ul className="pcat-elig-list reveal">
            {v.eligibility.map((item, i) => (
              <li key={i} className="pcat-elig-item">
                <span className="pcat-elig-mark" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="pcat-elig-footnote reveal">
            If your business straddles categories, Push's ConversionOracle
            scoring will slot you to the nearest tier at Pilot onboarding. The
            Software Leverage Ratio north-star keeps unit economics honest
            across every vertical we operate.
          </p>
        </div>
      </section>

      {/* ══ 6. CTA ═══════════════════════════════════════════════ */}
      <section className="pcat-cta-section">
        <div className="container pcat-cta-inner">
          <p className="eyebrow pcat-cta-eyebrow reveal">Ready to start</p>
          <h2 className="pcat-cta-h">
            <span
              className="pcat-cta-h-bold reveal"
              style={{ transitionDelay: "60ms" }}
            >
              {money(v.perCustomer)} per customer.
            </span>
            <span
              className="pcat-cta-h-light reveal"
              style={{ transitionDelay: "140ms" }}
            >
              Or it's free.
            </span>
          </h2>
          <p
            className="pcat-cta-body reveal"
            style={{ transitionDelay: "200ms" }}
          >
            First 10 {v.name.toLowerCase()} customers free under the
            Williamsburg Coffee+ beachhead Pilot. No credit card. Auto-flip to
            Operator at customer 10. Every customer passes QR + Claude Vision +
            geo verification before you're charged.
          </p>
          <div
            className="pcat-cta-actions reveal"
            style={{ transitionDelay: "260ms" }}
          >
            <Link
              href={`/merchant/pilot?vertical=${v.slug}`}
              className="btn btn-primary"
            >
              Apply for Pilot
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              Back to pricing overview
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* Export SLUGS internally for possible future consumption */
export { SLUGS };
