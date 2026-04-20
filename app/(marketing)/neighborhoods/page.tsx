import type { Metadata } from "next";
import NeighborhoodsMap from "@/components/neighborhoods/NeighborhoodsMapLoader";
import NeighborhoodsClient from "@/components/neighborhoods/NeighborhoodsClientLoader";
import { NEIGHBORHOODS, ALL_BOROUGHS } from "@/lib/neighborhoods/mock-hoods";
import "./neighborhoods.css";

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  title:
    "NYC Neighborhoods — Creator marketing for verified foot traffic | Push",
  description:
    "Push operates across 30 NYC neighborhoods, connecting local merchants with verified creator campaigns and QR-attributed foot traffic. Discover active campaigns in Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.",
  openGraph: {
    title: "NYC Neighborhoods — Push",
    description:
      "30 NYC neighborhoods. Real creators. Verified foot traffic. Explore Push campaigns by neighborhood.",
    type: "website",
    url: "https://withpush.co/neighborhoods",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Neighborhoods — Push",
    description: "30 NYC neighborhoods. Real creators. Verified foot traffic.",
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
            <p className="nh-hero-eyebrow">Push · NYC Coverage Map</p>
            <h1 className="nh-hero-headline">
              Neighborhoods
              <br />
              <em>Push serves.</em>
            </h1>
            <p className="nh-hero-sub">
              30 New York City neighborhoods. Verified foot traffic. Real
              creators. QR-attributed campaigns that prove the visit happened.
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

        {/* ── Borough tabs + grid (client interactive) ──────── */}
        <NeighborhoodsClient
          neighborhoods={NEIGHBORHOODS}
          boroughs={ALL_BOROUGHS}
        />
      </main>
    </>
  );
}
