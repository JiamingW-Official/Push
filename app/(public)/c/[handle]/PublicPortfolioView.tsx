"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type {
  CreatorProfile,
  GalleryItem,
} from "@/lib/portfolio/mock-profiles";
import { TIERS, type CreatorTier } from "@/lib/tier-config";
import "./public-portfolio.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tierNormalized(tier: string): CreatorTier {
  const map: Record<string, CreatorTier> = {
    seed: "Seed",
    explorer: "Explorer",
    operator: "Operator",
    proven: "Proven",
    closer: "Closer",
    partner: "Partner",
    Seed: "Seed",
    Explorer: "Explorer",
    Operator: "Operator",
    Proven: "Proven",
    Closer: "Closer",
    Partner: "Partner",
  };
  return map[tier] ?? "Seed";
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function estimateRating(testimonials: { rating: number }[]): number {
  if (testimonials.length === 0) return 4.8;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

// ─── Social Icon Components (SVG, inline) ────────────────────────────────────

function IGIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 3v2.6a4.4 4.4 0 0 0 4 4.4v2.6a6.9 6.9 0 0 1-4-1.3v6.2a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.6a2.9 2.9 0 1 0 2 2.8V3Z" />
    </svg>
  );
}

function XiaohongshuIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="monospace"
      >
        xhs
      </text>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="pub-map-pin"
    >
      <path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13Z" />
      <circle cx="12" cy="9" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StickyHeader({
  profile,
  tier,
  visible,
}: {
  profile: CreatorProfile;
  tier: CreatorTier;
  visible: boolean;
}) {
  const tierCfg = TIERS[tier];
  const handle = profile.instagramHandle ?? profile.handle;
  return (
    <div
      className={`pub-sticky-header ${visible ? "pub-sticky-header--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="pub-sticky-inner">
        <div className="pub-sticky-left">
          <div
            className="pub-sticky-avatar"
            style={{ borderColor: tierCfg.color }}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="pub-avatar-img" />
            ) : (
              <span
                className="pub-sticky-avatar-initials"
                style={{ color: tierCfg.color }}
              >
                {getInitials(profile.displayName)}
              </span>
            )}
          </div>
          <div className="pub-sticky-identity">
            <span className="pub-sticky-name">{profile.displayName}</span>
            <span className="pub-sticky-handle">@{handle}</span>
          </div>
          <span
            className="pub-sticky-tier"
            style={{
              color: tierCfg.color,
              borderColor: tierCfg.color,
            }}
          >
            {tier}
          </span>
        </div>
        <Link
          href="/merchant/signup"
          className="pub-sticky-cta"
          prefetch={false}
        >
          Work with {profile.displayName.split(" ")[0]} →
        </Link>
      </div>
    </div>
  );
}

function TierShimmerBadge({ tier }: { tier: CreatorTier }) {
  const tierCfg = TIERS[tier];
  const shimmer = tier === "Closer" || tier === "Partner";
  return (
    <span
      className={`pub-hero-tier-badge ${shimmer ? "pub-hero-tier-badge--shimmer" : ""}`}
      style={
        {
          color: tierCfg.color,
          borderColor: tierCfg.color,
          ["--tier-accent" as string]: tierCfg.accent,
          ["--tier-color" as string]: tierCfg.color,
        } as React.CSSProperties
      }
    >
      <span className="pub-hero-tier-label">{tier}</span>
      <span className="pub-hero-tier-sub">{tierCfg.description}</span>
    </span>
  );
}

function ContentCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <div
      className="pub-content-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="pub-content-card-media">
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.caption}
            className="pub-content-card-img"
            loading="lazy"
          />
        ) : (
          <div className="pub-content-card-video">
            <span className="pub-content-card-play">▶</span>
          </div>
        )}
        <div className="pub-content-card-overlay">
          <span className="pub-content-card-index">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
      {item.caption && (
        <p className="pub-content-card-caption">{item.caption}</p>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export interface PublicPortfolioViewProps {
  profile: CreatorProfile;
  /** When true, shows owner-facing preview banner + "View all work" link */
  ownerPreview?: boolean;
  /** Shown inside the preview banner (used by /creator/public/[id]) */
  previewBannerLabel?: string;
}

export function PublicPortfolioView({
  profile,
  ownerPreview = false,
  previewBannerLabel = "This is how your public profile looks",
}: PublicPortfolioViewProps) {
  const tier = tierNormalized(profile.tier);
  const tierCfg = TIERS[tier];

  const visibleGallery = profile.gallery.filter((g) => g.visible).slice(0, 6);
  const visibleCampaigns = profile.pastCampaigns
    .filter((c) => c.visible)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const avgRating = estimateRating(profile.testimonials);

  const firstName = profile.displayName.split(" ")[0];

  // Sticky header visibility tracked off hero intersection
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { rootMargin: "-120px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Share profile — copy-link with toast
  const [toast, setToast] = useState<string | null>(null);
  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://push.nyc/c/${profile.handle}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.displayName} — Push Creator`,
          text: profile.bio,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Link copied to clipboard");
      setTimeout(() => setToast(null), 2000);
    } catch {
      // fall-through: silent
    }
  };

  return (
    <div className="pub-page">
      {/* ── Sticky header (shown on scroll) ─────────────────────── */}
      <StickyHeader profile={profile} tier={tier} visible={stickyVisible} />

      {/* ── Owner preview banner (only on /creator/public/[id]) ── */}
      {ownerPreview && (
        <div className="pub-owner-banner" role="status">
          <div className="pub-owner-banner-inner">
            <div className="pub-owner-banner-copy">
              <span className="pub-owner-banner-label">PREVIEW</span>
              <span className="pub-owner-banner-text">
                {previewBannerLabel}
              </span>
            </div>
            <Link
              href="/creator/portfolio"
              className="pub-owner-banner-cta"
              prefetch={false}
            >
              Edit Profile →
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header ref={heroRef} className="pub-hero">
        <div className="pub-hero-inner">
          <div className="pub-hero-grid">
            {/* Avatar — 160px square, tier-colored border accent */}
            <div
              className="pub-avatar"
              style={{ borderColor: tierCfg.color }}
              aria-label={`${profile.displayName} avatar`}
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="pub-avatar-img"
                />
              ) : (
                <span
                  className="pub-avatar-initials"
                  style={{ color: tierCfg.color }}
                >
                  {getInitials(profile.displayName)}
                </span>
              )}
            </div>

            <div className="pub-hero-identity">
              <div className="pub-hero-toprow">
                <TierShimmerBadge tier={tier} />
                <button
                  type="button"
                  onClick={handleShare}
                  className="pub-share-button"
                  aria-label="Share profile"
                >
                  <ShareIcon />
                  <span>Share profile</span>
                </button>
              </div>

              <h1 className="pub-hero-name">{profile.displayName}</h1>
              <p className="pub-hero-handle">
                @{profile.instagramHandle ?? profile.handle}
              </p>

              <p className="pub-hero-location">
                <MapPinIcon />
                <span>
                  {profile.neighborhood} <span className="pub-hero-dot">·</span>{" "}
                  NYC
                </span>
              </p>

              <p className="pub-hero-bio">{profile.bio}</p>

              <div className="pub-socials">
                {profile.instagramHandle && (
                  <a
                    href={`https://instagram.com/${profile.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-social-link"
                  >
                    <IGIcon />
                    <span>@{profile.instagramHandle}</span>
                  </a>
                )}
                {profile.tiktokHandle && (
                  <a
                    href={`https://tiktok.com/@${profile.tiktokHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-social-link"
                  >
                    <TikTokIcon />
                    <span>@{profile.tiktokHandle}</span>
                  </a>
                )}
                <span className="pub-social-link pub-social-link--muted">
                  <XiaohongshuIcon />
                  <span>Xiaohongshu (on request)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Stats strip — Verified customers · Campaigns · Score · Rating ── */}
      <section className="pub-stats-section" aria-label="Creator stats">
        <div className="pub-stats-strip">
          <div className="pub-stat">
            <span className="pub-stat-value">
              {formatNumber(profile.verifiedVisits)}
            </span>
            <span className="pub-stat-label">Verified Customers</span>
          </div>
          <div className="pub-stat">
            <span className="pub-stat-value">{profile.totalCampaigns}</span>
            <span className="pub-stat-label">Campaigns Completed</span>
          </div>
          <div
            className="pub-stat"
            style={{ ["--stat-accent" as string]: tierCfg.color }}
          >
            <span
              className="pub-stat-value pub-stat-value--accent"
              style={{ color: tierCfg.color }}
            >
              {profile.pushScore}
            </span>
            <span className="pub-stat-label">Push Score</span>
          </div>
          <div className="pub-stat">
            <span className="pub-stat-value">{avgRating.toFixed(1)}</span>
            <span className="pub-stat-label">Avg Merchant Rating</span>
          </div>
        </div>
      </section>

      {/* ── Featured portfolio grid (top 6) ────────────────────── */}
      <section className="pub-section pub-portfolio-section">
        <div className="pub-section-header">
          <span className="pub-section-eyebrow">01 — Featured Work</span>
          <h2 className="pub-section-title">Portfolio</h2>
          {ownerPreview && (
            <Link
              href="/creator/portfolio"
              className="pub-section-link"
              prefetch={false}
            >
              View all work →
            </Link>
          )}
        </div>
        {visibleGallery.length > 0 ? (
          <div className="pub-portfolio-grid">
            {visibleGallery.map((g, i) => (
              <ContentCard key={g.id} item={g} index={i} />
            ))}
          </div>
        ) : (
          <p className="pub-empty">No featured work yet.</p>
        )}
      </section>

      {/* ── Recent campaigns (compact list) ───────────────────── */}
      {visibleCampaigns.length > 0 && (
        <section className="pub-section">
          <div className="pub-section-header">
            <span className="pub-section-eyebrow">02 — Track Record</span>
            <h2 className="pub-section-title">Recent Campaigns</h2>
          </div>
          <div className="pub-campaigns-list">
            {visibleCampaigns.slice(0, 5).map((c) => (
              <div key={c.id} className="pub-campaign-row">
                <div className="pub-campaign-identity">
                  <span className="pub-campaign-brand">{c.brand}</span>
                  <span className="pub-campaign-location">
                    {c.neighborhood}
                  </span>
                </div>
                <div className="pub-campaign-metrics">
                  <div className="pub-campaign-metric">
                    <span className="pub-campaign-metric-val">
                      {c.verifiedVisits}
                    </span>
                    <span className="pub-campaign-metric-label">Customers</span>
                  </div>
                  <div className="pub-campaign-metric">
                    <span className="pub-campaign-metric-val">
                      {c.deliveryTime}
                    </span>
                    <span className="pub-campaign-metric-label">Delivery</span>
                  </div>
                  <span className="pub-campaign-date">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── "Work with me" CTA ────────────────────────────────── */}
      <section className="pub-cta-section">
        <div className="pub-cta-inner">
          <p className="pub-cta-eyebrow">
            Vertical AI for Local Commerce · Customer Acquisition Engine
          </p>
          <h2 className="pub-cta-headline">Work with {firstName}</h2>
          <p className="pub-cta-body">
            Launch a campaign on Push and our ConversionOracle™ matches{" "}
            {firstName} to your Williamsburg Coffee+ storefront. Pay only for
            verified walk-in customers.
          </p>
          <div className="pub-cta-row">
            <Link
              href="/merchant/signup"
              className="pub-cta-button"
              prefetch={false}
            >
              Start a Campaign →
            </Link>
            <Link
              href="/explore"
              className="pub-cta-button-ghost"
              prefetch={false}
            >
              Browse more creators
            </Link>
          </div>
          <p className="pub-cta-note">
            No commitments · Pay per verified customer · $15–85 per walk-in by
            category
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <span className="pub-footer-brand">PUSH</span>
          <span className="pub-footer-tagline">
            Vertical AI for Local Commerce
          </span>
          <a href="https://push.nyc" className="pub-footer-link">
            push.nyc
          </a>
        </div>
      </footer>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <div className="pub-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
