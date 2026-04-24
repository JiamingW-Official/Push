import type { Metadata } from "next";
import Link from "next/link";
import NeighborhoodDetailMap from "@/components/neighborhoods/NeighborhoodDetailMapLoader";
import {
  NEIGHBORHOODS,
  getNeighborhoodBySlug,
  getNearbyNeighborhoods,
  getLocalLeaderboard,
} from "@/lib/neighborhoods/mock-hoods";
import "../neighborhoods.css";

/* ── Static params ─────────────────────────────────────────── */

export function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.slug }));
}

/* ── Dynamic metadata ──────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hood = getNeighborhoodBySlug(slug);
  if (!hood) return {};

  const title = `${hood.name} — Creator marketing for verified foot traffic | Push`;
  const description = `Push connects creators and merchants in ${hood.name}, ${hood.borough}. ${hood.stats.activeCampaigns} active campaigns, ${hood.stats.activeCreators} creators, and ${hood.stats.totalVerifiedVisits.toLocaleString()} verified visits powered by QR verification. Join creator marketing in ${hood.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://withpush.co/neighborhoods/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://withpush.co/neighborhoods/${slug}`,
    },
  };
}

/* ── JSON-LD ───────────────────────────────────────────────── */

function NeighborhoodJsonLd({
  hood,
}: {
  hood: NonNullable<ReturnType<typeof getNeighborhoodBySlug>>;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: hood.name,
      description: hood.description.slice(0, 200),
      url: `https://withpush.co/neighborhoods/${hood.slug}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: hood.lat,
        longitude: hood.lng,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: hood.name,
        addressRegion: "NY",
        addressCountry: "US",
      },
      containedInPlace: {
        "@type": "City",
        name: "New York City",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How does Push work in ${hood.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Push connects local creators with merchants in ${hood.name}, ${hood.borough}. Creators visit participating businesses, scan a QR code to verify their visit, then publish content. Merchants pay only for verified foot traffic — no guessing required.`,
          },
        },
        {
          "@type": "Question",
          name: `How many campaigns are active in ${hood.name} right now?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${hood.name} currently has ${hood.stats.activeCampaigns} active creator campaigns across ${hood.stats.activeMerchants} merchants, with ${hood.stats.activeCreators} creators operating in this neighborhood.`,
          },
        },
        {
          "@type": "Question",
          name: `What is the average campaign payout in ${hood.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `The average campaign payout in ${hood.name} is $${hood.stats.avgPayout} per verified visit. Total verified visits in this neighborhood have reached ${hood.stats.totalVerifiedVisits.toLocaleString()}.`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Featured Merchants in ${hood.name}`,
      numberOfItems: hood.featuredMerchants.length,
      itemListElement: hood.featuredMerchants.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "LocalBusiness",
          name: m.name,
          address: m.address,
          description: `${m.category} business in ${hood.name} with ${m.activeCampaigns} active Push campaign${m.activeCampaigns !== 1 ? "s" : ""}.`,
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Tier label display ────────────────────────────────────── */

const TIER_LABELS: Record<string, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

/* ── Per-neighborhood scene subline ────────────────────────── */
// Memorized scene for the three pilot blocks; everything else falls back
// to a generic two-stat subline. Specific over generic — friend telling
// you where to go, not a tourist board.
const SCENE_BY_SLUG: Record<string, { ghost: string; lede: string }> = {
  soho: {
    ghost: "9 cafés. 3 galleries.",
    lede: "Cast-iron facades, denim shops at street level. Walk Greene from Prince south — that is the route.",
  },
  tribeca: {
    ghost: "Quieter than the rest.",
    lede: "The good restaurants don't post a sign. Greenwich & Franklin is where you start.",
  },
  chinatown: {
    ghost: "One poster per door.",
    lede: "Two blocks of dumpling shops. Walk Mott south from Canal. Go before 8pm or you wait outside.",
  },
};

/* ── Time ago helper ───────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "< 1h ago";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Page ─────────────────────────────────────────────────── */

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hood = getNeighborhoodBySlug(slug);

  if (!hood) {
    return (
      <main
        className="nh-page"
        style={{ display: "flex", alignItems: "center", minHeight: "60vh" }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--graphite)",
              marginBottom: "var(--space-4)",
            }}
          >
            Neighborhood not found.
          </p>
          <Link href="/neighborhoods" className="btn btn-primary">
            Browse all neighborhoods
          </Link>
        </div>
      </main>
    );
  }

  const nearby = getNearbyNeighborhoods(slug);
  const leaderboard = getLocalLeaderboard(hood);

  // Build map pins: center + merchant approximations
  const mapPins = [
    {
      id: hood.slug,
      title: hood.name,
      business_name: hood.borough,
      payout: 0,
      lat: hood.lat,
      lng: hood.lng,
      spots_remaining: hood.stats.activeCampaigns,
    },
  ];

  const scene = SCENE_BY_SLUG[hood.slug] ?? {
    ghost: `${hood.stats.activeMerchants} venues. ${hood.stats.activeCreators} creators.`,
    lede: hood.description,
  };

  return (
    <>
      <NeighborhoodJsonLd hood={hood} />

      <main className="nh-page">
        {/* ═══════════════ 01 — HERO ═══════════════ */}
        <section className="nhd-hero bg-hero-ink grain-overlay bg-vignette">
          <div className="container nhd-hero-inner">
            <nav className="nhd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Push</Link>
              <span className="nhd-breadcrumb-sep">/</span>
              <Link href="/neighborhoods">Neighborhoods</Link>
              <span className="nhd-breadcrumb-sep">/</span>
              <span style={{ color: "rgba(245,242,236,0.75)" }}>
                {hood.name}
              </span>
            </nav>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: "var(--space-8)",
              }}
            >
              <span className="pill-lux" style={{ color: "#fff" }}>
                {hood.borough} · Lower Manhattan pilot
              </span>
              <span
                className="eyebrow-lux"
                style={{ color: "var(--champagne)" }}
              >
                June 22 launch
              </span>
            </div>

            <div
              className="section-marker"
              data-num="01"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {hood.name}
            </div>

            <h1 className="nhd-hero-name">
              {hood.name}
              <span
                aria-hidden="true"
                style={{ color: "var(--brand-red)", marginLeft: "-0.04em" }}
              >
                .
              </span>
            </h1>

            <div className="nhd-hero-ghost display-ghost">{scene.ghost}</div>

            <p className="nhd-hero-desc">{scene.lede}</p>
          </div>
        </section>

        {/* ═══════════════ 02 — STATS ═══════════════ */}
        <section className="nhd-stats">
          <div className="container">
            <div className="nhd-stats-grid">
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.totalVerifiedVisits.toLocaleString()}
                </div>
                <div className="nhd-stat-label">verified visits</div>
              </div>
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.activeCampaigns}
                </div>
                <div className="nhd-stat-label">live campaigns</div>
              </div>
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.activeCreators}
                </div>
                <div className="nhd-stat-label">creators on the block</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 03 — MERCHANTS ═══════════════ */}
        <section className="nhd-section">
          <div className="container">
            <div className="section-marker" data-num="02">
              The doors
            </div>
            <h2 className="nhd-section-heading">
              Where creators walk in.{" "}
              <span className="display-ghost">
                Real venues. Real addresses.
              </span>
            </h2>

            <div className="nhd-merchants-grid">
              {hood.featuredMerchants.map((m) => (
                <div key={m.id} className="nhd-merchant-card reveal">
                  <p className="nhd-merchant-category">{m.category}</p>
                  <h3 className="nhd-merchant-name">{m.name}</h3>
                  <p className="nhd-merchant-address">{m.address}</p>

                  <div className="nhd-merchant-meta">
                    <div className="nhd-merchant-meta-item">
                      <span className="nhd-merchant-meta-value">
                        {m.activeCampaigns}
                      </span>
                      <span className="nhd-merchant-meta-label">campaigns</span>
                    </div>
                    <div className="nhd-merchant-meta-item">
                      <span className="nhd-merchant-meta-value">
                        {m.avgPayout === 0 ? "Free" : `$${m.avgPayout}`}
                      </span>
                      <span className="nhd-merchant-meta-label">
                        avg payout
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 04 — CREATORS ═══════════════ */}
        <section
          className="nhd-section"
          style={{ background: "var(--surface-bright)" }}
        >
          <div className="container">
            <div className="section-marker" data-num="03">
              On the roster
            </div>
            <h2 className="nhd-section-heading">
              Creators working {hood.name}.{" "}
              <span className="display-ghost">Tier badge tells the rest.</span>
            </h2>

            <div className="nhd-creators-grid">
              {hood.featuredCreators.map((c) => (
                <Link
                  key={c.id}
                  href={`/c/${c.handle}`}
                  className="nhd-creator-card reveal"
                >
                  <div className="nhd-creator-avatar" aria-hidden="true">
                    {c.name.charAt(0)}
                  </div>
                  <div className="nhd-creator-info">
                    <span className={`nhd-tier-badge ${c.tier}`}>
                      {TIER_LABELS[c.tier]}
                    </span>
                    <div className="nhd-creator-name">{c.name}</div>
                    <div className="nhd-creator-handle">@{c.handle}</div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        marginTop: 4,
                      }}
                    >
                      <div>
                        <div className="nhd-creator-score">{c.pushScore}</div>
                        <div className="nhd-creator-score-label">
                          Push score
                        </div>
                      </div>
                      <div>
                        <div className="nhd-creator-score">
                          {c.campaignsCompleted}
                        </div>
                        <div className="nhd-creator-score-label">campaigns</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 05 — RECENT ACTIVITY ═══════════════ */}
        <section className="nhd-section">
          <div className="container">
            <div className="section-marker" data-num="04">
              Right now
            </div>
            <h2 className="nhd-section-heading">
              Last visits scanned.{" "}
              <span className="display-ghost">No guessing.</span>
            </h2>

            <div className="nhd-timeline">
              {hood.recentVisits.map((v) => (
                <div key={v.id} className="nhd-timeline-item">
                  <div className="nhd-timeline-dot" aria-hidden="true" />
                  <div className="nhd-timeline-content">
                    <div className="nhd-timeline-handle">
                      @{v.creatorHandle}
                    </div>
                    <div className="nhd-timeline-meta">
                      {v.merchantName} · {v.campaignTitle}
                    </div>
                  </div>
                  <div className="nhd-timeline-right">
                    <div
                      className={`nhd-timeline-payout${v.payout === 0 ? " free" : ""}`}
                    >
                      {v.payout === 0 ? "Free" : `$${v.payout}`}
                    </div>
                    <div className="nhd-timeline-time">
                      {timeAgo(v.verifiedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 06 — LEADERBOARD ═══════════════ */}
        <section
          className="nhd-section"
          style={{ background: "var(--surface-bright)" }}
        >
          <div className="container">
            <div className="section-marker" data-num="05">
              {hood.name} top ten
            </div>
            <h2 className="nhd-section-heading">
              Who's running this block.{" "}
              <span className="display-ghost">Push score, no shortcut.</span>
            </h2>

            <div className="nhd-leaderboard" style={{ maxWidth: 640 }}>
              {leaderboard.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/c/${c.handle}`}
                  className="nhd-leaderboard-row"
                >
                  <div
                    className={`nhd-leaderboard-rank${i === 0 ? " top" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="nhd-leaderboard-name">{c.name}</div>
                    <div className="nhd-leaderboard-handle">@{c.handle}</div>
                  </div>
                  <div className="nhd-leaderboard-score">{c.pushScore}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 07 — MAP ═══════════════ */}
        <section className="nhd-map-section">
          <div className="container">
            <div className="section-marker" data-num="06">
              The pin
            </div>
            <h2 className="nhd-section-heading">
              {hood.name} on the map.{" "}
              <span className="display-ghost">
                Walk it once before you scan.
              </span>
            </h2>
            <div className="nhd-map-container photo-frame">
              <NeighborhoodDetailMap
                center={[hood.lat, hood.lng]}
                pins={mapPins}
                neighborhoodName={hood.name}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════ 08 — NEARBY ═══════════════ */}
        {nearby.length > 0 && (
          <section className="nhd-section">
            <div className="container">
              <div className="section-marker" data-num="07">
                Walk east
              </div>
              <h2 className="nhd-section-heading">
                Next block over.{" "}
                <span className="display-ghost">
                  Different door, same rules.
                </span>
              </h2>

              <div className="nhd-nearby-grid">
                {nearby.slice(0, 3).map((n) => (
                  <Link
                    key={n.slug}
                    href={`/neighborhoods/${n.slug}`}
                    className="nhd-nearby-card"
                  >
                    <div className="nhd-nearby-name">{n.name}</div>
                    <div className="nhd-nearby-borough">{n.borough}</div>
                    <div className="nhd-nearby-campaigns">
                      {n.stats.activeCampaigns} live campaigns
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ 09 — CTA ═══════════════ */}
        <section className="nhd-cta-section bg-hero-ink grain-overlay">
          <div className="container nhd-cta-inner">
            <div
              className="section-marker"
              data-num="08"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Your move
            </div>
            <h2 className="nhd-cta-headline">
              Run {hood.name}.
              <br />
              <span className="display-ghost nhd-cta-ghost">
                One block. One QR. One verified visit at a time.
              </span>
            </h2>
            <p className="nhd-cta-sub">
              The pilot opens June 22. Same operator (Jiaming) walking every
              door. Pay only when the visit is real.
            </p>
            <div className="nhd-cta-actions">
              <Link
                href={`/creator/explore?neighborhood=${hood.slug}`}
                className="btn btn-primary"
              >
                See campaigns in {hood.name}
              </Link>
              <Link href="/merchant/signup" className="btn btn-ghost">
                List your door
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
