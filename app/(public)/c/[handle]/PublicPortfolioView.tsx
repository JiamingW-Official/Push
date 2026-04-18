"use client";

import type { CreatorProfile } from "@/lib/portfolio/mock-profiles";
import {
  TIERS,
  TIER_ORDER,
  getNextTier,
  type CreatorTier,
} from "@/lib/tier-config";
import "./public-portfolio.css";

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

// ── Sub-components ────────────────────────────────────────────────────────────

function TierPips({ tier }: { tier: CreatorTier }) {
  return (
    <div className="pub-tier-pips">
      {TIER_ORDER.map((t) => {
        const reached = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier);
        return (
          <div
            key={t}
            className={`pub-tier-pip ${reached ? "pub-tier-pip--active" : ""}`}
          >
            <div className="pub-tier-pip-dot" />
            <span className="pub-tier-pip-label">{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PublicPortfolioView({ profile }: { profile: CreatorProfile }) {
  const tier = tierNormalized(profile.tier);
  const tierCfg = TIERS[tier];
  const nextTier = getNextTier(tier);
  const nextCfg = nextTier ? TIERS[nextTier] : null;
  const tierPct = nextCfg
    ? Math.min(
        100,
        Math.round(
          ((profile.pushScore - tierCfg.minScore) /
            (nextCfg.minScore - tierCfg.minScore)) *
            100,
        ),
      )
    : 100;

  const visibleGallery = profile.gallery.filter((g) => g.visible);
  const visibleCampaigns = profile.pastCampaigns
    .filter((c) => c.visible)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pub-page">
      {/* ── Hero / Header ──────────────────────────────────────── */}
      <header className="pub-hero">
        <div className="pub-hero-inner">
          <div className="pub-hero-main">
            {/* Avatar */}
            <div className="pub-avatar">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="pub-avatar-img"
                />
              ) : (
                <span className="pub-avatar-initials">
                  {getInitials(profile.displayName)}
                </span>
              )}
            </div>

            {/* Identity block */}
            <div className="pub-hero-identity">
              <div className="pub-hero-eyebrow">
                <span className="pub-tier-badge">{tier}</span>
                <span className="pub-hero-location">
                  NYC — {profile.neighborhood}
                </span>
              </div>

              <h1 className="pub-hero-name">{profile.displayName}</h1>

              <div className="pub-hero-handles">
                {profile.instagramHandle && (
                  <span className="pub-handle-chip">
                    @{profile.instagramHandle} on Instagram
                  </span>
                )}
                {profile.tiktokHandle && (
                  <span className="pub-handle-chip">
                    @{profile.tiktokHandle} on TikTok
                  </span>
                )}
              </div>

              <p className="pub-hero-bio">{profile.bio}</p>
            </div>
          </div>

          {/* Tier progress strip */}
          <div className="pub-hero-progress">
            <div className="pub-progress-header">
              <span className="pub-progress-label">Push Score</span>
              <span className="pub-progress-score">{profile.pushScore}</span>
            </div>
            <div className="pub-progress-track">
              <div
                className="pub-progress-fill"
                style={{ width: `${tierPct}%` }}
              />
            </div>
            <TierPips tier={tier} />
          </div>
        </div>
      </header>

      {/* ── Main layout: content + sticky sidebar ─────────────── */}
      <div className="pub-layout">
        <main className="pub-main">
          {/* Stats strip */}
          <section className="pub-section pub-stats-section">
            <div className="pub-stats-strip">
              <div className="pub-stat">
                <div className="pub-stat-number">{profile.totalCampaigns}</div>
                <div className="pub-stat-label">Campaigns</div>
              </div>
              <div className="pub-stat">
                <div className="pub-stat-number">
                  {formatNumber(profile.verifiedVisits)}
                </div>
                <div className="pub-stat-label">Verified Visits</div>
              </div>
              <div className="pub-stat">
                <div className="pub-stat-number">{profile.avgDeliveryTime}</div>
                <div className="pub-stat-label">Avg Delivery</div>
              </div>
              <div className="pub-stat">
                <div className="pub-stat-number">{profile.tierScore}</div>
                <div className="pub-stat-label">Tier Score</div>
              </div>
            </div>
          </section>

          {/* Tier benefits */}
          <section className="pub-section">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow">02</span>
              <h2 className="pub-section-title">Creator Tier</h2>
            </div>
            <div className="pub-tier-block">
              <div className="pub-tier-name-block">
                <span className="pub-tier-name-large">{tier}</span>
                <span className="pub-tier-desc">{tierCfg.description}</span>
              </div>
              <ul className="pub-benefits-list">
                {tierCfg.benefits.map((b, i) => (
                  <li key={i} className="pub-benefit-item">
                    <span className="pub-benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Content gallery */}
          {visibleGallery.length > 0 && (
            <section className="pub-section">
              <div className="pub-section-header">
                <span className="pub-section-eyebrow">03</span>
                <h2 className="pub-section-title">Content Gallery</h2>
              </div>
              <div className="pub-gallery-grid">
                {visibleGallery.map((item) => (
                  <div key={item.id} className="pub-gallery-item">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="pub-gallery-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="pub-gallery-video">
                        <span className="pub-gallery-play">▶</span>
                      </div>
                    )}
                    {item.caption && (
                      <p className="pub-gallery-caption">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past campaigns */}
          {visibleCampaigns.length > 0 && (
            <section className="pub-section">
              <div className="pub-section-header">
                <span className="pub-section-eyebrow">04</span>
                <h2 className="pub-section-title">Past Campaigns</h2>
              </div>
              <div className="pub-campaigns-list">
                {visibleCampaigns.map((c) => (
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
                        <span className="pub-campaign-metric-label">
                          Visits
                        </span>
                      </div>
                      <div className="pub-campaign-metric">
                        <span className="pub-campaign-metric-val">
                          {c.deliveryTime}
                        </span>
                        <span className="pub-campaign-metric-label">
                          Delivery
                        </span>
                      </div>
                      <span className="pub-campaign-date">{c.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials */}
          {profile.testimonials.length > 0 && (
            <section className="pub-section">
              <div className="pub-section-header">
                <span className="pub-section-eyebrow">05</span>
                <h2 className="pub-section-title">Merchant Testimonials</h2>
              </div>
              <div className="pub-testimonials">
                {profile.testimonials.map((t) => (
                  <div key={t.id} className="pub-testimonial">
                    <div className="pub-testimonial-stars">
                      {"★".repeat(t.rating)}
                      {"☆".repeat(5 - t.rating)}
                    </div>
                    <blockquote className="pub-testimonial-quote">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="pub-testimonial-attr">
                      <span className="pub-testimonial-name">{t.merchant}</span>
                      <span className="pub-testimonial-role">{t.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── Sticky sidebar ──────────────────────────────────── */}
        <aside className="pub-sidebar">
          <div className="pub-sidebar-inner">
            <div className="pub-cta-card">
              <p className="pub-cta-eyebrow">Ready to collaborate?</p>
              <h3 className="pub-cta-heading">
                Work with {profile.displayName.split(" ")[0]}
              </h3>
              <p className="pub-cta-body">
                {profile.displayName.split(" ")[0]} is a verified Push {tier}{" "}
                creator with {profile.totalCampaigns} completed campaigns and{" "}
                {formatNumber(profile.verifiedVisits)} verified visits delivered
                to NYC restaurants.
              </p>
              <div className="pub-cta-stats">
                <div className="pub-cta-stat">
                  <span className="pub-cta-stat-val">
                    {profile.avgDeliveryTime}
                  </span>
                  <span className="pub-cta-stat-label">Avg delivery</span>
                </div>
                <div className="pub-cta-stat">
                  <span className="pub-cta-stat-val">{profile.tierScore}</span>
                  <span className="pub-cta-stat-label">Tier score</span>
                </div>
              </div>
              <a
                href={`mailto:hello@push.nyc?subject=Campaign%20with%20${encodeURIComponent(profile.displayName)}`}
                className="pub-cta-btn"
              >
                Start a Campaign
              </a>
              <p className="pub-cta-sub">
                Powered by Push — NYC&apos;s creator attribution network
              </p>
            </div>

            <div className="pub-sidebar-profile-card">
              <p className="pub-sidebar-card-label">Push Profile</p>
              <div className="pub-sidebar-tier-row">
                <span className="pub-sidebar-tier-badge">{tier}</span>
                <span className="pub-sidebar-score">
                  Score: {profile.pushScore}
                </span>
              </div>
              <div className="pub-sidebar-detail-row">
                <span className="pub-sidebar-detail-label">Neighborhood</span>
                <span className="pub-sidebar-detail-val">
                  {profile.neighborhood}
                </span>
              </div>
              {profile.instagramHandle && (
                <div className="pub-sidebar-detail-row">
                  <span className="pub-sidebar-detail-label">Instagram</span>
                  <span className="pub-sidebar-detail-val">
                    @{profile.instagramHandle}
                  </span>
                </div>
              )}
              {profile.tiktokHandle && (
                <div className="pub-sidebar-detail-row">
                  <span className="pub-sidebar-detail-label">TikTok</span>
                  <span className="pub-sidebar-detail-val">
                    @{profile.tiktokHandle}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer bar ─────────────────────────────────────────── */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <span className="pub-footer-brand">PUSH</span>
          <span className="pub-footer-tagline">
            NYC Creator Attribution Network
          </span>
          <a href="https://push.nyc" className="pub-footer-link">
            push.nyc
          </a>
        </div>
      </footer>
    </div>
  );
}
