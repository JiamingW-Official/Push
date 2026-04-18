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
  seed: "Clay · Seed",
  explorer: "Bronze · Explorer",
  operator: "Steel · Operator",
  proven: "Gold · Proven",
  closer: "Ruby · Closer",
  partner: "Obsidian · Partner",
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

  return (
    <>
      <NeighborhoodJsonLd hood={hood} />

      <main className="nh-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="nhd-hero">
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

            <p className="nhd-hero-borough">{hood.borough}</p>
            <h1 className="nhd-hero-name">{hood.name}</h1>
            <p className="nhd-hero-desc">{hood.description}</p>
          </div>
        </section>

        {/* ── Stats block ───────────────────────────────────── */}
        <section className="nhd-stats">
          <div className="container">
            <div className="nhd-stats-grid">
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.totalVerifiedVisits.toLocaleString()}
                </div>
                <div className="nhd-stat-label">Total verified visits</div>
              </div>
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.activeCampaigns}
                </div>
                <div className="nhd-stat-label">Active campaigns</div>
              </div>
              <div className="nhd-stat">
                <div className="nhd-stat-value">
                  {hood.stats.activeCreators}
                </div>
                <div className="nhd-stat-label">
                  Top tier creators operating here
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured merchants ─────────────────────────────── */}
        <section className="nhd-section">
          <div className="container">
            <p className="nhd-section-label">Active on Push</p>
            <h2 className="nhd-section-heading">Featured merchants</h2>

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
                      <span className="nhd-merchant-meta-label">Campaigns</span>
                    </div>
                    <div className="nhd-merchant-meta-item">
                      <span className="nhd-merchant-meta-value">
                        {m.avgPayout === 0 ? "Free" : `$${m.avgPayout}`}
                      </span>
                      <span className="nhd-merchant-meta-label">
                        Avg payout
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured creators ──────────────────────────────── */}
        <section
          className="nhd-section"
          style={{ background: "var(--surface-bright)" }}
        >
          <div className="container">
            <p className="nhd-section-label">Operating in {hood.name}</p>
            <h2 className="nhd-section-heading">Featured creators</h2>

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
                        <div className="nhd-creator-score-label">Campaigns</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent activity ────────────────────────────────── */}
        <section className="nhd-section">
          <div className="container">
            <p className="nhd-section-label">Live data</p>
            <h2 className="nhd-section-heading">Recent verified visits</h2>

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

        {/* ── Local leaderboard ──────────────────────────────── */}
        <section
          className="nhd-section"
          style={{ background: "var(--surface-bright)" }}
        >
          <div className="container">
            <p className="nhd-section-label">{hood.name}</p>
            <h2 className="nhd-section-heading">Local leaderboard</h2>

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

        {/* ── Map ───────────────────────────────────────────── */}
        <section className="nhd-map-section">
          <div className="container">
            <p className="nhd-section-label">Geography</p>
            <h2 className="nhd-section-heading">{hood.name} on the map</h2>
            <div className="nhd-map-container">
              <NeighborhoodDetailMap
                center={[hood.lat, hood.lng]}
                pins={mapPins}
                neighborhoodName={hood.name}
              />
            </div>
          </div>
        </section>

        {/* ── Nearby neighborhoods ───────────────────────────── */}
        {nearby.length > 0 && (
          <section className="nhd-section">
            <div className="container">
              <p className="nhd-section-label">Keep exploring</p>
              <h2 className="nhd-section-heading">Nearby neighborhoods</h2>

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
                      {n.stats.activeCampaigns} active campaigns
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="nhd-cta-section">
          <div className="container nhd-cta-inner">
            <h2 className="nhd-cta-headline">
              Run campaigns in
              <br />
              <em>{hood.name}.</em>
            </h2>
            <p className="nhd-cta-sub">
              Join the creators and merchants already building verified foot
              traffic in {hood.name}, {hood.borough}. QR attribution means every
              visit is provable.
            </p>
            <div className="nhd-cta-actions">
              <Link
                href={`/creator/explore?neighborhood=${hood.slug}`}
                className="btn btn-primary"
              >
                Explore campaigns in {hood.name}
              </Link>
              <Link href="/merchant/signup" className="btn btn-ghost">
                List your business
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
