import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getMerchantBySlug,
  getRelatedMerchants,
  getAllSlugs,
  type MerchantPublic,
  type PublicCampaign,
} from "@/lib/merchant/mock-public";
import MerchantMap from "./MerchantMap";
import "./merchant-public.css";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);
  if (!merchant) return { title: "Merchant Not Found" };

  const title = `${merchant.name} — ${merchant.neighborhood} | Push`;
  const description = `${merchant.tagline} Partner with ${merchant.name} through Push. ${merchant.stats.creators_onboarded} creators onboarded, ${merchant.stats.total_visits.toLocaleString()} verified visits driven.`;

  return {
    title,
    description,
    alternates: { canonical: `/m/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://pushnyc.co/m/${slug}`,
      siteName: "Push",
      locale: "en_US",
      images: [
        {
          url: merchant.hero_image,
          width: 1400,
          height: 800,
          alt: merchant.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [merchant.hero_image],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

function JsonLd({ merchant }: { merchant: MerchantPublic }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: merchant.name,
    description: merchant.tagline,
    url: merchant.website,
    telephone: merchant.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: merchant.address.split(",")[0],
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: merchant.lat,
      longitude: merchant.lng,
    },
    image: merchant.hero_image,
    sameAs: [`https://instagram.com/${merchant.instagram.replace("@", "")}`],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: merchant.reviews.length,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TierBadge({ tier }: { tier: string }) {
  // Tier chroma sourced from Path A brand tokens (see globals.css tier aliases).
  const tierColors: Record<string, { bg: string; color: string }> = {
    Seed: { bg: "rgba(0, 48, 73, 0.06)", color: "var(--graphite)" },
    Explorer: { bg: "rgba(201, 169, 110, 0.18)", color: "var(--accent)" },
    Operator: { bg: "rgba(74, 85, 104, 0.10)", color: "var(--graphite)" },
    Proven: { bg: "rgba(193, 18, 31, 0.10)", color: "var(--primary)" },
    Closer: { bg: "rgba(120, 0, 0, 0.10)", color: "var(--accent)" },
    Partner: { bg: "rgba(0, 48, 73, 0.12)", color: "var(--dark)" },
  };
  const style = tierColors[tier] ?? tierColors.Seed;

  return (
    <span
      className="mp-tier-badge"
      style={{ background: style.bg, color: style.color }}
    >
      {tier}
    </span>
  );
}

function CampaignCard({ campaign }: { campaign: PublicCampaign }) {
  const spotsUrgent = campaign.spots_remaining <= 2;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="mp-campaign-card">
      {campaign.image && (
        <div className="mp-campaign-img">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="mp-campaign-body">
        <div className="mp-campaign-meta">
          <TierBadge tier={campaign.tier_required} />
          <span className={`mp-spots ${spotsUrgent ? "mp-spots--urgent" : ""}`}>
            {campaign.spots_remaining} spot
            {campaign.spots_remaining !== 1 ? "s" : ""} left
          </span>
        </div>
        <h3 className="mp-campaign-title">{campaign.title}</h3>
        <p className="mp-campaign-desc">{campaign.description}</p>
        <div className="mp-campaign-footer">
          <div className="mp-campaign-payout">
            {campaign.payout === 0 ? (
              <span className="mp-payout-free">Free product</span>
            ) : (
              <>
                <span className="mp-payout-amount">${campaign.payout}</span>
                <span className="mp-payout-label">payout</span>
              </>
            )}
          </div>
          <span className="mp-deadline">{daysLeft}d left</span>
        </div>
        <Link
          href={`/creator/explore?campaign=${campaign.id}`}
          className="mp-btn mp-btn--primary"
        >
          Apply now
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MerchantPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);
  if (!merchant) notFound();

  const related = getRelatedMerchants(merchant.related_slugs).slice(0, 3);

  return (
    <>
      <JsonLd merchant={merchant} />

      <main className="mp-root">
        {/* ── 01 HERO ──────────────────────────────────────────────── */}
        <section className="mp-hero">
          <div className="mp-hero-img-wrap">
            <Image
              src={merchant.hero_image}
              alt={merchant.name}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="mp-hero-overlay" />
          </div>

          <div className="mp-hero-content">
            <p className="mp-eyebrow">
              {merchant.neighborhood} &middot; {merchant.borough} &middot;{" "}
              {merchant.category}
            </p>
            <h1 className="mp-hero-name">{merchant.name}</h1>
            <p className="mp-hero-tagline">{merchant.tagline}</p>
          </div>

          <div className="mp-hero-scroll-hint" aria-hidden="true">
            <span className="mp-scroll-label">Scroll</span>
            <span className="mp-scroll-line" />
          </div>
        </section>

        {/* ── 02 STORY ─────────────────────────────────────────────── */}
        <section className="mp-section mp-story">
          <div className="mp-container mp-story-inner">
            <div className="mp-section-label">
              <span className="mp-section-num">01</span>
              <span className="mp-section-title">Story</span>
            </div>
            <div className="mp-story-body">
              <p className="mp-story-text">{merchant.story}</p>
            </div>
          </div>
        </section>

        {/* ── 03 LIVE CAMPAIGNS ────────────────────────────────────── */}
        {merchant.campaigns.length > 0 && (
          <section className="mp-section mp-campaigns">
            <div className="mp-container">
              <div className="mp-section-label">
                <span className="mp-section-num">02</span>
                <span className="mp-section-title">Live Campaigns</span>
              </div>
              <p className="mp-section-sub">
                Open now &mdash; creators can apply directly through Push.
              </p>
              <div className="mp-campaigns-grid">
                {merchant.campaigns.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 04 CREATORS ──────────────────────────────────────────── */}
        <section className="mp-section mp-creators">
          <div className="mp-container">
            <div className="mp-section-label">
              <span className="mp-section-num">03</span>
              <span className="mp-section-title">Creators Partnered With</span>
            </div>
            <div className="mp-creators-grid">
              {merchant.creators.map((creator) => (
                <div key={creator.id} className="mp-creator-chip">
                  <div className="mp-creator-avatar">
                    <Image
                      src={creator.avatar_url}
                      alt={creator.handle}
                      fill
                      sizes="48px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="mp-creator-info">
                    <span className="mp-creator-handle">{creator.handle}</span>
                    <TierBadge tier={creator.tier} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 VERIFIED STATS ────────────────────────────────────── */}
        <section className="mp-section mp-stats">
          <div className="mp-container mp-stats-inner">
            <div className="mp-section-label">
              <span className="mp-section-num">04</span>
              <span className="mp-section-title">Verified by Push</span>
            </div>
            <div className="mp-stats-grid">
              <div className="mp-stat-block">
                <span className="mp-stat-num">
                  {merchant.stats.total_visits.toLocaleString()}
                </span>
                <span className="mp-stat-label">Total visits driven</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat-block">
                <span className="mp-stat-num">
                  ${merchant.stats.avg_visit_value}
                </span>
                <span className="mp-stat-label">Avg visit value</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat-block">
                <span className="mp-stat-num">
                  {merchant.stats.creators_onboarded}
                </span>
                <span className="mp-stat-label">Creators onboarded</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 REVIEWS ───────────────────────────────────────────── */}
        <section className="mp-section mp-reviews">
          <div className="mp-container">
            <div className="mp-section-label">
              <span className="mp-section-num">05</span>
              <span className="mp-section-title">From Creators</span>
            </div>
            <div className="mp-reviews-grid">
              {merchant.reviews.map((review) => (
                <blockquote key={review.id} className="mp-review-card">
                  <p className="mp-review-quote">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <footer className="mp-review-footer">
                    <div className="mp-review-avatar">
                      <Image
                        src={review.avatar_url}
                        alt={review.creator_handle}
                        fill
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="mp-review-meta">
                      <span className="mp-review-handle">
                        {review.creator_handle}
                      </span>
                      <span className="mp-review-campaign">
                        {review.campaign_title}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ── 07 VISIT INFO ─────────────────────────────────────────── */}
        <section className="mp-section mp-visit">
          <div className="mp-container mp-visit-inner">
            <div className="mp-section-label">
              <span className="mp-section-num">06</span>
              <span className="mp-section-title">Visit Info</span>
            </div>

            <div className="mp-visit-grid">
              {/* Map */}
              <div className="mp-map-wrap">
                <MerchantMap
                  lat={merchant.lat}
                  lng={merchant.lng}
                  name={merchant.name}
                />
              </div>

              {/* Details */}
              <div className="mp-visit-details">
                <div className="mp-visit-block">
                  <h3 className="mp-visit-block-label">Address</h3>
                  <p className="mp-visit-block-value">{merchant.address}</p>
                </div>

                <div className="mp-visit-block">
                  <h3 className="mp-visit-block-label">Hours</h3>
                  <ul className="mp-hours-list">
                    {merchant.hours.map((h) => (
                      <li key={h.day} className="mp-hours-row">
                        <span className="mp-hours-day">{h.day}</span>
                        <span className="mp-hours-time">{h.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mp-visit-block">
                  <h3 className="mp-visit-block-label">Contact</h3>
                  <div className="mp-contact-links">
                    <a
                      href={`tel:${merchant.phone}`}
                      className="mp-contact-link"
                    >
                      {merchant.phone}
                    </a>
                    <a
                      href={merchant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mp-contact-link"
                    >
                      {merchant.website.replace("https://", "")}
                    </a>
                    <a
                      href={`https://instagram.com/${merchant.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mp-contact-link"
                    >
                      {merchant.instagram}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 RELATED MERCHANTS ─────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mp-section mp-related">
            <div className="mp-container">
              <div className="mp-section-label">
                <span className="mp-section-num">07</span>
                <span className="mp-section-title">Also on Push</span>
              </div>
              <div className="mp-related-grid">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/m/${rel.slug}`}
                    className="mp-related-card"
                  >
                    <div className="mp-related-img-wrap">
                      <Image
                        src={rel.hero_image}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="mp-related-overlay" />
                    </div>
                    <div className="mp-related-info">
                      <p className="mp-related-neighborhood">
                        {rel.neighborhood} &middot; {rel.category}
                      </p>
                      <h3 className="mp-related-name">{rel.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 09 CTA STRIP ─────────────────────────────────────────── */}
        <section className="mp-cta-strip">
          <div className="mp-container mp-cta-inner">
            <p className="mp-cta-eyebrow">Creators</p>
            <h2 className="mp-cta-headline">
              Want to work with {merchant.name}?
            </h2>
            <p className="mp-cta-sub">
              Browse open campaigns, apply in seconds, get paid per verified
              visit.
            </p>
            <Link href="/creator/explore" className="mp-btn mp-btn--cta">
              Browse campaigns
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
