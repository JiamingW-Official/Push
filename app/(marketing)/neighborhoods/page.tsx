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
  title:
    "NYC Neighborhoods — Creator marketing for verified foot traffic | Push",
  description:
    "Push runs creator marketing across 30 NYC neighborhoods. SoHo, Tribeca, Chinatown first — Lower Manhattan pilot opens June 22. QR-verified foot traffic, no guessing.",
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

/* ── Pilot block — three real Manhattan blocks ─────────────── */

const PILOT_BLOCKS = [
  {
    slug: "chinatown",
    name: "Chinatown",
    cross: "Canal & Mott",
    venues: 21,
    creators: 76,
    scene:
      "Two blocks of dumpling shops, one poster per door. Walk Mott south from Canal — that is the route.",
    cardClass: "card-ink",
    accent: "var(--brand-red)",
  },
  {
    slug: "soho",
    name: "SoHo",
    cross: "Greene & Prince",
    venues: 53,
    creators: 189,
    scene:
      "Cast-iron facades, denim shops on the ground floor, the people who set the rest of Manhattan's taste live two blocks over.",
    cardClass: "card-premium",
    accent: "var(--ink)",
  },
  {
    slug: "tribeca",
    name: "Tribeca",
    cross: "Greenwich & Franklin",
    venues: 29,
    creators: 101,
    scene:
      "Quieter than its neighbors. The good restaurants don't post a sign. You go because someone you trust told you.",
    cardClass: "card-champagne",
    accent: "var(--champagne)",
  },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function NeighborhoodsPage() {
  return (
    <>
      <NeighborhoodsJsonLd />

      <main className="nh-page">
        {/* ═══════════════ 01 — HERO ═══════════════ */}
        <section className="nh-hero bg-hero-ink grain-overlay bg-vignette">
          <div className="container nh-hero-inner">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: "var(--space-10)",
              }}
            >
              <span className="pill-lux" style={{ color: "#fff" }}>
                Pilot 01 · Lower Manhattan
              </span>
              <span
                className="eyebrow-lux"
                style={{ color: "var(--champagne)" }}
              >
                Three blocks. June 22.
              </span>
            </div>

            <div
              className="section-marker"
              data-num="01"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              The map
            </div>

            <h1 className="nh-hero-headline">
              Three blocks.
              <br />
              <span className="display-ghost nh-hero-ghost">
                Three neighborhoods.
              </span>
            </h1>

            <p className="nh-hero-sub">
              SoHo. Tribeca. Chinatown. The Lower Manhattan pilot opens June 22
              — same operator (Jiaming) walking every door. The wider list below
              is where Push goes next.
            </p>

            <div className="nh-hero-stats">
              <div>
                <div className="nh-hero-stat-value">
                  {totalVisits.toLocaleString()}
                </div>
                <div className="nh-hero-stat-label">verified visits</div>
              </div>
              <div>
                <div className="nh-hero-stat-value">{totalCampaigns}</div>
                <div className="nh-hero-stat-label">live campaigns</div>
              </div>
              <div>
                <div className="nh-hero-stat-value">{totalCreators}</div>
                <div className="nh-hero-stat-label">creators on roster</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 02 — PILOT BENTO ═══════════════ */}
        <section className="nh-pilot-section">
          <div className="container">
            <div className="section-marker" data-num="02">
              The pilot
            </div>
            <h2 className="nh-pilot-heading">
              SoHo, Tribeca, Chinatown —{" "}
              <span className="display-ghost">three different doors.</span>
            </h2>

            <div className="bento-grid nh-pilot-grid">
              {PILOT_BLOCKS.map((block, i) => (
                <Link
                  key={block.slug}
                  href={`/neighborhoods/${block.slug}`}
                  className={`${block.cardClass} nh-pilot-card`}
                >
                  <div
                    className="section-marker"
                    data-num={String(i + 1).padStart(2, "0")}
                    style={{
                      color:
                        block.cardClass === "card-ink"
                          ? "rgba(255,255,255,0.55)"
                          : "var(--ink-4)",
                    }}
                  >
                    {block.cross}
                  </div>

                  <h3 className="nh-pilot-card-name">{block.name}</h3>

                  <p className="nh-pilot-card-scene">{block.scene}</p>

                  <div className="nh-pilot-card-stats">
                    <div>
                      <div className="nh-pilot-card-num">~{block.venues}</div>
                      <div className="nh-pilot-card-num-label">venues</div>
                    </div>
                    <div>
                      <div className="nh-pilot-card-num">~{block.creators}</div>
                      <div className="nh-pilot-card-num-label">
                        creators on roster
                      </div>
                    </div>
                  </div>

                  <span className="nh-pilot-card-cta">Walk {block.name} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 03 — MAP ═══════════════ */}
        <section className="nh-map-section">
          <div className="container">
            <div className="section-marker" data-num="03">
              Where the pins land
            </div>
            <h2 className="nh-map-heading">
              Lower Manhattan first.{" "}
              <span className="display-ghost">The rest later.</span>
            </h2>
          </div>

          <div className="nh-map-strip photo-frame">
            <NeighborhoodsMap pins={mapPins} />
          </div>
        </section>

        {/* ═══════════════ 04 — FULL ROSTER ═══════════════ */}
        <NeighborhoodsClient
          neighborhoods={NEIGHBORHOODS}
          boroughs={ALL_BOROUGHS}
        />
      </main>
    </>
  );
}
