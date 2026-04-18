import type { Metadata } from "next";
import Link from "next/link";
import NeighborhoodsMap from "@/components/neighborhoods/NeighborhoodsMapLoader";
import NeighborhoodsClient from "@/components/neighborhoods/NeighborhoodsClientLoader";
import {
  NEIGHBORHOODS,
  ALL_BOROUGHS,
  type Borough,
} from "@/lib/neighborhoods/mock-hoods";
import "./neighborhoods.css";

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "NYC Neighborhoods — Vertical AI for Local Commerce | Push",
  description:
    "Push operates a Neighborhood Playbook across 30 NYC neighborhoods. Williamsburg Coffee+ is the active Template 0 — priced per verified customer, verified by ConversionOracle. Explore neighborhood templates and active deployments.",
  openGraph: {
    title: "NYC Neighborhoods — Push",
    description:
      "30 NYC neighborhoods. Williamsburg Coffee+ Template 0 active. Per-customer pricing, verified by ConversionOracle.",
    type: "website",
    url: "https://withpush.co/neighborhoods",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Neighborhoods — Push",
    description:
      "Williamsburg Coffee+ Template 0. Verified by ConversionOracle.",
  },
  alternates: {
    canonical: "https://withpush.co/neighborhoods",
  },
};

/* ── JSON-LD ───────────────────────────────────────────────── */

function NeighborhoodsJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "NYC Neighborhoods — Push",
    description:
      "Push creator marketing operates across 30 NYC neighborhoods, providing verified foot traffic attribution via QR codes.",
    url: "https://withpush.co/neighborhoods",
    publisher: {
      "@type": "Organization",
      name: "Push",
      url: "https://withpush.co",
    },
    about: NEIGHBORHOODS.map((n) => ({
      "@type": "Place",
      name: n.name,
      url: `https://withpush.co/neighborhoods/${n.slug}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: n.name,
        addressRegion: "NY",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: n.lat,
        longitude: n.lng,
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

/* ── Hero aggregate stats ──────────────────────────────────── */

const totalVisits = NEIGHBORHOODS.reduce(
  (s, n) => s + n.stats.totalVerifiedVisits,
  0,
);
const totalCampaigns = NEIGHBORHOODS.reduce(
  (s, n) => s + n.stats.activeCampaigns,
  0,
);
const totalCreators = NEIGHBORHOODS.reduce(
  (s, n) => s + n.stats.activeCreators,
  0,
);

/* ── Map pins ─────────────────────────────────────────────── */

const mapPins = NEIGHBORHOODS.map((n) => ({
  id: n.slug,
  name: n.name,
  borough: n.borough,
  lat: n.lat,
  lng: n.lng,
  activeCampaigns: n.stats.activeCampaigns,
  slug: n.slug,
}));

/* ── Page ─────────────────────────────────────────────────── */

export default function NeighborhoodsPage() {
  return (
    <>
      <NeighborhoodsJsonLd />

      <main className="nh-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="nh-hero">
          <div className="container nh-hero-inner">
            <p className="nh-hero-eyebrow">
              Push · Vertical AI for Local Commerce
            </p>
            <h1 className="nh-hero-headline">
              Neighborhoods
              <br />
              <em>Push serves.</em>
            </h1>
            <p className="nh-hero-sub">
              30 NYC neighborhoods. One active Template 0:{" "}
              <strong>Williamsburg Coffee+</strong>. Every new neighborhood
              follows the same{" "}
              <Link href="/neighborhood-playbook" className="nh-hero-link">
                Neighborhood Playbook
              </Link>
              — verified per-customer outcomes via ConversionOracle, nothing
              less.
            </p>

            <div className="nh-hero-stats">
              <div>
                <div className="nh-hero-stat-value">
                  {totalVisits.toLocaleString()}
                </div>
                <div className="nh-hero-stat-label">Verified visits</div>
              </div>
              <div>
                <div className="nh-hero-stat-value">{totalCampaigns}</div>
                <div className="nh-hero-stat-label">Active campaigns</div>
              </div>
              <div>
                <div className="nh-hero-stat-value">{totalCreators}</div>
                <div className="nh-hero-stat-label">Active creators</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Map strip ─────────────────────────────────────── */}
        <div className="nh-map-strip">
          <NeighborhoodsMap pins={mapPins} />
        </div>

        {/* ── Template 0 / Neighborhood Playbook spotlight ──── */}
        <section className="nh-template">
          <div className="container nh-template-inner">
            <p className="nh-template-eyebrow">Template 0 · Active</p>
            <h2 className="nh-template-headline">
              Williamsburg Coffee+ is running live.
            </h2>
            <p className="nh-template-sub">
              One neighborhood, one vertical, one priced outcome: every new
              customer walking into a Williamsburg Coffee+ shop is verified by
              ConversionOracle before Push gets paid. Template 0 proves the
              loop. The Neighborhood Playbook makes it repeatable.
            </p>
            <div className="nh-template-cta">
              <Link
                href="/case-studies/williamsburg-coffee-5"
                className="nh-template-btn"
              >
                Read the Williamsburg Coffee+ case study
              </Link>
              <Link href="/neighborhood-playbook" className="nh-template-link">
                See the Neighborhood Playbook →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Borough tabs + grid (client interactive) ──────── */}
        <NeighborhoodsClient
          neighborhoods={NEIGHBORHOODS}
          boroughs={ALL_BOROUGHS}
        />
      </main>
    </>
  );
}
