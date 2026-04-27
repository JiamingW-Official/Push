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

function CategoryBadge({ category }: { category: string }) {
  return <span className="mp-category-badge btn-pill">{category}</span>;
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
          {/* Bottom gradient overlay per v11 Photo Card pattern */}
          <div className="mp-campaign-img-overlay" />
          <div className="mp-campaign-img-meta">
            <span className="mp-campaign-img-title">{campaign.title}</span>
          </div>
        </div>
      )}
      <div className="mp-campaign-body">
        <div className="mp-campaign-meta">
          <CategoryBadge category={campaign.tier_required} />
          <span className={`mp-spots${spotsUrgent ? " mp-spots--urgent" : ""}`}>
            {campaign.spots_remaining} spot
            {campaign.spots_remaining !== 1 ? "s" : ""} left
          </span>
        </div>
        {!campaign.image && (
          <h3 className="mp-campaign-title">{campaign.title}</h3>
        )}
        <p className="mp-campaign-desc">{campaign.description}</p>
        <div className="mp-campaign-footer">
          <div className="mp-campaign-payout">
            {campaign.payout === 0 ? (
              <span className="mp-payout-free">Free product</span>
            ) : (
              <>
                <span className="mp-payout-amount">${campaign.payout}</span>
                <span className="mp-payout-label">/visit</span>
              </>
            )}
          </div>
          <span className="mp-deadline">{daysLeft}d left</span>
        </div>
        <Link
          href={`/creator/explore?campaign=${campaign.id}`}
          className="btn-primary click-shift mp-campaign-apply"
        >
          Scan to Visit
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
        {/* ── 01 HERO (dark, image-first) ───────────────────────── */}
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
            <p className="mp-eyebrow eyebrow">
              (MERCHANT) · {merchant.neighborhood} · {merchant.borough}
            </p>
            <h1 className="mp-hero-name">{merchant.name}</h1>
            <p className="mp-hero-tagline">{merchant.tagline}</p>
            <div className="mp-hero-badges">
              <CategoryBadge category={merchant.category} />
            </div>
          </div>

          {/* Right: visit count badge */}
          <div className="mp-hero-visit-badge lg-surface--badge">
            <p className="eyebrow mp-visit-badge-eyebrow">VERIFIED VISITS</p>
            <span className="mp-visit-badge-count">
              {merchant.stats.total_visits.toLocaleString()}
            </span>
            <span className="mp-visit-badge-label">driven by creators</span>
          </div>

          <div className="mp-hero-scroll-hint" aria-hidden="true">
            <span className="mp-scroll-label">Scroll</span>
            <span className="mp-scroll-line" />
          </div>
        </section>

        {/* ── 02 STORY ─────────────────────────────────────────── */}
        <section className="mp-section mp-story">
          <div className="mp-container mp-story-inner">
            <div className="mp-section-label">
              <p className="eyebrow">
                <span className="mp-section-num">01</span> Story
              </p>
            </div>
            <div className="mp-story-body">
              <p className="mp-story-text">{merchant.story}</p>
            </div>
          </div>
        </section>

        {/* ── 03 LIVE CAMPAIGNS ────────────────────────────────── */}
        {merchant.campaigns.length > 0 && (
          <section className="mp-section mp-campaigns">
            <div className="mp-container">
              <div className="mp-section-label">
                <p className="eyebrow">
                  <span className="mp-section-num">02</span> Live Campaigns
                </p>
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

        {/* ── 04 CREATOR WALL ──────────────────────────────────── */}
        <section className="mp-section mp-creators">
          <div className="mp-container">
            <div className="mp-section-label">
              <p className="eyebrow">
                <span className="mp-section-num">03</span> Creators Partnered
                With
              </p>
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
                    <span className="mp-creator-tier btn-pill">
                      {creator.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 VERIFIED STATS ────────────────────────────────── */}
        <section className="mp-section mp-stats">
          <div className="mp-container mp-stats-inner">
            <div className="mp-section-label">
              <p className="eyebrow">
                <span className="mp-section-num">04</span> Verified by Push
              </p>
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

        {/* ── 06 REVIEWS ───────────────────────────────────────── */}
        <section className="mp-section mp-reviews">
          <div className="mp-container">
            <div className="mp-section-label">
              <p className="eyebrow">
                <span className="mp-section-num">05</span> From Creators
              </p>
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

        {/* ── 07 VISIT INFO (about + hours + address) ───────────── */}
        <section className="mp-section mp-visit">
          <div className="mp-container mp-visit-inner">
            <div className="mp-section-label">
              <p className="eyebrow">
                <span className="mp-section-num">06</span> Visit Info
              </p>
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

        {/* ── 08 RELATED MERCHANTS ─────────────────────────────── */}
        {related.length > 0 && (
          <section className="mp-section mp-related">
            <div className="mp-container">
              <div className="mp-section-label">
                <p className="eyebrow">
                  <span className="mp-section-num">07</span> Also on Push
                </p>
              </div>
              <div className="mp-related-grid">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/m/${rel.slug}`}
                    className="mp-related-card click-shift"
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
                      <p className="mp-related-neighborhood eyebrow">
                        {rel.neighborhood} · {rel.category}
                      </p>
                      <h3 className="mp-related-name">{rel.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 09 TICKET CTA ────────────────────────────────────── */}
        <section className="mp-ticket-section">
          <div className="ticket-panel mp-ticket">
            <p className="eyebrow mp-ticket-eyebrow">(CAMPAIGNS)</p>
            <h2 className="mp-ticket-headline">
              Create a campaign at {merchant.name}.
            </h2>
            <p className="mp-ticket-sub">
              Browse open campaigns, apply in seconds, get paid per verified
              visit.
            </p>
            <Link
              href="/creator/explore"
              className="btn-primary click-shift mp-ticket-btn"
            >
              Browse campaigns
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
