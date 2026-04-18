import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./neighborhoods.css";

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Neighborhood Playbook — Where we operate | Push",
  description:
    "Push is Vertical AI for Local Commerce. We launch one ZIP cluster at a time. Williamsburg Coffee+ is the active beachhead; Greenpoint and Bushwick are queued. ConversionOracle inside every playbook.",
  openGraph: {
    title: "Neighborhoods — Push",
    description:
      "One ZIP cluster at a time. Williamsburg Coffee+ active. Greenpoint and Bushwick queued.",
    type: "website",
    url: "https://withpush.co/neighborhoods",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neighborhoods — Push",
    description:
      "Own the density. Williamsburg Coffee+ Beachhead. Vertical AI for Local Commerce.",
  },
  alternates: {
    canonical: "https://withpush.co/neighborhoods",
  },
};

/* ── Data: three neighborhoods on the map ─────────────────── */

type HoodStatus = "active" | "queue";

interface Hood {
  slug: string;
  name: string;
  status: HoodStatus;
  zips: string[];
  category: string;
  aov: string;
  windowNext: string;
  addressable: string;
  /** svg coordinates (200x260 viewBox) for the map pin */
  cx: number;
  cy: number;
}

const HOODS: Hood[] = [
  {
    slug: "williamsburg-coffee",
    name: "Williamsburg Coffee+",
    status: "active",
    zips: ["11211", "11206", "11249"],
    category: "Specialty coffee · bakery · brunch",
    aov: "$8 – $20",
    windowNext: "60-day beachhead · live now",
    addressable: "~200 merchants",
    cx: 134,
    cy: 128,
  },
  {
    slug: "greenpoint",
    name: "Greenpoint",
    status: "queue",
    zips: ["11222"],
    category: "Specialty coffee · bakery",
    aov: "$8 – $22",
    windowNext: "Pilot window · Month 3 – 4",
    addressable: "~110 merchants",
    cx: 132,
    cy: 110,
  },
  {
    slug: "bushwick",
    name: "Bushwick",
    status: "queue",
    zips: ["11237", "11206"],
    category: "Coffee · natural wine · bakery",
    aov: "$9 – $24",
    windowNext: "Pilot window · Month 4 – 5",
    addressable: "~140 merchants",
    cx: 146,
    cy: 148,
  },
];

/* ── NYC boroughs — hand-simplified paths for an inline SVG ── */
/* viewBox is 200x260. Shapes are intentionally abstract so      */
/* they read as NYC without being cartographic.                  */

const BOROUGH_PATHS = [
  {
    name: "Manhattan",
    d: "M112 38 L120 32 L124 50 L126 72 L130 92 L126 112 L120 128 L116 140 L112 150 L108 164 L104 174 L100 168 L98 154 L102 138 L104 120 L102 104 L98 88 L96 72 L100 58 L106 46 Z",
  },
  {
    name: "Bronx",
    d: "M118 18 L148 14 L164 22 L168 38 L154 46 L134 44 L122 40 L120 28 Z",
  },
  {
    name: "Queens",
    d: "M130 60 L176 56 L196 74 L196 126 L178 144 L150 140 L140 124 L136 108 L130 90 L128 74 Z",
  },
  {
    name: "Brooklyn",
    d: "M102 140 L138 136 L162 148 L176 168 L170 196 L150 214 L120 212 L102 196 L92 176 L94 158 Z",
  },
  {
    name: "Staten Island",
    d: "M42 206 L80 202 L92 220 L78 240 L50 242 L34 228 Z",
  },
];

/* ── JSON-LD ───────────────────────────────────────────────── */

function NeighborhoodsJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Neighborhoods — Push",
    description:
      "Push's Neighborhood Playbook lives one ZIP cluster at a time. Williamsburg Coffee+ is the active beachhead.",
    url: "https://withpush.co/neighborhoods",
    publisher: {
      "@type": "Organization",
      name: "Push",
      url: "https://withpush.co",
    },
    about: HOODS.map((h) => ({
      "@type": "Place",
      name: h.name,
      url: `https://withpush.co/neighborhoods/${h.slug}`,
      address: {
        "@type": "PostalAddress",
        postalCode: h.zips.join(", "),
        addressRegion: "NY",
        addressCountry: "US",
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function NeighborhoodsPage() {
  return (
    <>
      <NeighborhoodsJsonLd />
      <ScrollRevealInit />

      <main className="nh-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="nh-hero nh-hero--v2">
          <div className="container nh-hero-inner">
            <p className="nh-hero-eyebrow">Where we operate</p>
            <h1 className="nh-hero-headline">
              Neighborhood Playbook —
              <br />
              <em>launch one ZIP cluster, own the density.</em>
            </h1>
            <p className="nh-hero-sub">
              Push is Vertical AI for Local Commerce. We do not sell to every
              merchant in NYC. We pick a ZIP cluster, saturate it, and let{" "}
              <strong>ConversionOracle™</strong> learn its walk-in ground truth.
              Williamsburg Coffee+ is the active beachhead. Greenpoint and
              Bushwick are queued behind it.
            </p>

            <div className="nh-hero-ctas">
              <Link href="/neighborhood-playbook" className="nh-hero-btn">
                See the Playbook
              </Link>
              <Link
                href="/neighborhoods/williamsburg-coffee"
                className="nh-hero-link"
              >
                Williamsburg Coffee+ pilot →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Interactive map: inline SVG, no deps ─────────── */}
        <section className="nh-map-v2">
          <div className="container nh-map-v2-inner">
            <div className="nh-map-v2-legend reveal">
              <span className="nh-legend-item">
                <span className="nh-legend-dot nh-legend-dot--active" />
                <span>Active beachhead</span>
              </span>
              <span className="nh-legend-item">
                <span className="nh-legend-dot nh-legend-dot--queue" />
                <span>Pilot queue</span>
              </span>
            </div>

            <div className="nh-map-v2-frame reveal">
              <svg
                className="nh-map-v2-svg"
                viewBox="0 0 200 260"
                role="img"
                aria-label="NYC map of active and queued Push neighborhoods"
              >
                <defs>
                  <filter
                    id="nh-pin-glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="1.4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Boroughs */}
                {BOROUGH_PATHS.map((b) => (
                  <path
                    key={b.name}
                    d={b.d}
                    className="nh-borough"
                    aria-label={b.name}
                  />
                ))}

                {/* Borough labels — CS Genio Mono via class */}
                <text x="118" y="34" className="nh-borough-label">
                  BRONX
                </text>
                <text x="112" y="100" className="nh-borough-label">
                  MHTN
                </text>
                <text x="168" y="98" className="nh-borough-label">
                  QUEENS
                </text>
                <text x="134" y="188" className="nh-borough-label">
                  BROOKLYN
                </text>
                <text x="60" y="226" className="nh-borough-label">
                  S.I.
                </text>

                {/* Pins — circular (50% exception per Design.md) */}
                {HOODS.map((h) => (
                  <g key={h.slug}>
                    {h.status === "active" && (
                      <circle
                        className="nh-pin-ring"
                        cx={h.cx}
                        cy={h.cy}
                        r={9}
                      />
                    )}
                    <circle
                      className={`nh-pin nh-pin--${h.status}`}
                      cx={h.cx}
                      cy={h.cy}
                      r={4.5}
                      filter="url(#nh-pin-glow)"
                    />
                    <text
                      x={h.cx + 8}
                      y={h.cy + 1.5}
                      className={`nh-pin-label nh-pin-label--${h.status}`}
                    >
                      {h.name.split(" ")[0].toUpperCase()}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <p className="nh-map-v2-caption reveal">
              Density compounds. Once ConversionOracle locks one ZIP cluster,
              the next cluster inherits the verification model — not rebuilt,
              redeployed.
            </p>
          </div>
        </section>

        {/* ── Neighborhood cards ──────────────────────────── */}
        <section className="nh-grid-v2">
          <div className="container">
            <div className="nh-grid-v2-head reveal">
              <span className="nh-grid-v2-eyebrow">Neighborhoods</span>
              <h2 className="nh-grid-v2-heading">
                Three on the board. One live.
              </h2>
            </div>

            <div className="nh-hood-grid">
              {HOODS.map((h, i) => (
                <Link
                  key={h.slug}
                  href={`/neighborhoods/${h.slug}`}
                  className={`nh-hood-card nh-hood-card--${h.status} reveal`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="nh-hood-card-top">
                    <span
                      className={`nh-hood-status nh-hood-status--${h.status}`}
                    >
                      {h.status === "active" ? "Active" : "Queue"}
                    </span>
                    <span className="nh-hood-addressable">{h.addressable}</span>
                  </div>

                  <h3 className="nh-hood-name">{h.name}</h3>
                  <p className="nh-hood-cat">{h.category}</p>

                  <div className="nh-hood-meta">
                    <div className="nh-hood-meta-item">
                      <span className="nh-hood-meta-label">ZIPs</span>
                      <span className="nh-hood-meta-value">
                        {h.zips.join(" · ")}
                      </span>
                    </div>
                    <div className="nh-hood-meta-item">
                      <span className="nh-hood-meta-label">AOV</span>
                      <span className="nh-hood-meta-value">{h.aov}</span>
                    </div>
                    <div className="nh-hood-meta-item">
                      <span className="nh-hood-meta-label">Next window</span>
                      <span className="nh-hood-meta-value">{h.windowNext}</span>
                    </div>
                  </div>

                  <span className="nh-hood-cta">
                    {h.status === "active"
                      ? "See the pilot →"
                      : "Preview queue →"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Playbook CTA ────────────────────────────────── */}
        <section className="nh-cta-v2">
          <div className="container nh-cta-v2-inner">
            <p className="nh-cta-v2-eyebrow">Neighborhood Playbook</p>
            <h2 className="nh-cta-v2-h">
              Twelve steps. One unit of expansion.{" "}
              <em>Five-point-one month payback.</em>
            </h2>
            <p className="nh-cta-v2-sub">
              ICP lock → seed ten merchants → campaign templates → tier-0
              creators → Claude Vision tuning → QR roll → pilot run → brief
              review → SLR measure → expansion decision → density unlock → case
              study. Same twelve, every time.
            </p>
            <div className="nh-cta-v2-row">
              <Link href="/neighborhood-playbook" className="nh-hero-btn">
                See the Playbook
              </Link>
              <Link
                href="/neighborhoods/williamsburg-coffee"
                className="nh-cta-v2-link"
              >
                Read Template 0: Williamsburg Coffee+ →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
