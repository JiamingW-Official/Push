"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TierBadge } from "@/components/creator/TierBadge";
import { TierJourney } from "@/components/creator/TierJourney";
import "./public.css";

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type CampaignHistoryItem = {
  id: string;
  business: string;
  category: string;
  date: string;
  payout: number;
};

type PublicCreator = {
  id: string;
  name: string;
  instagram_handle: string;
  tiktok_handle?: string;
  location: string;
  bio: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  completion_rate: number;
  merchant_satisfaction: number;
  earnings_total: number;
  walkins_total?: number;
  avg_customer_value?: number;
  instagram_followers?: number;
  tiktok_followers?: number;
  avatar_url: string | undefined;
  campaign_history: CampaignHistoryItem[];
  niches?: string[];
  is_verified?: boolean;
};

const DEMO_PUBLIC_CREATOR: PublicCreator = {
  id: "demo-creator-001",
  name: "Alex Chen",
  instagram_handle: "alexcheneats",
  tiktok_handle: "alexcheneats",
  location: "Lower East Side, NYC",
  bio: "NYC food & lifestyle creator. Always hunting for the next hidden gem. I cover local spots that deserve more love — from hole-in-the-wall ramen to rooftop cocktail bars.",
  tier: "operator" as const,
  push_score: 71,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  completion_rate: 86,
  merchant_satisfaction: 4.2,
  earnings_total: 340,
  walkins_total: 87,
  avg_customer_value: 24,
  instagram_followers: 4200,
  tiktok_followers: 1800,
  avatar_url: undefined,
  niches: ["Food", "Coffee", "Brooklyn", "Lifestyle"],
  is_verified: true,
  campaign_history: [
    {
      id: "1",
      business: "Blank Street Coffee",
      category: "Coffee",
      date: "Mar 2026",
      payout: 0,
    },
    {
      id: "2",
      business: "Superiority Burger",
      category: "Food",
      date: "Mar 2026",
      payout: 35,
    },
    {
      id: "3",
      business: "Flamingo Estate",
      category: "Lifestyle",
      date: "Apr 2026",
      payout: 75,
    },
    {
      id: "4",
      business: "Brow Theory",
      category: "Beauty",
      date: "Apr 2026",
      payout: 50,
    },
    {
      id: "5",
      business: "Le Bec Fin",
      category: "Food",
      date: "Mar 2026",
      payout: 20,
    },
    {
      id: "6",
      business: "Cha Cha Matcha",
      category: "Coffee",
      date: "Apr 2026",
      payout: 25,
    },
  ],
};

const TIER_COLOR: Record<CreatorTier, string> = {
  seed: "#b8a99a",
  explorer: "#8c6239",
  operator: "#4a5568",
  proven: "#c9a96e",
  closer: "#9b111e",
  partner: "#1a1a2e",
};

// Media gallery placeholder categories
const MEDIA_CATEGORIES = ["Food", "Coffee", "Lifestyle", "Brooklyn"];

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function ProfileSkeleton() {
  return (
    <div className="public-profile">
      <div className="profile-header-strip">
        <span className="header-back skeleton-line" style={{ width: 80 }} />
        <span className="header-label skeleton-line" style={{ width: 140 }} />
      </div>
      <div className="pub-hero skeleton-block" style={{ height: 320 }} />
      <div className="pub-stats-strip skeleton-block" style={{ height: 100 }} />
      <div
        className="pub-campaigns-section skeleton-block"
        style={{ height: 280 }}
      />
    </div>
  );
}

export default function CreatorPublicPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "demo";

  const [creator, setCreator] = useState<PublicCreator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDemo = id === "demo" || checkDemoMode();
    if (isDemo) {
      setCreator(DEMO_PUBLIC_CREATOR);
      setLoading(false);
      return;
    }
    setCreator(DEMO_PUBLIC_CREATOR);
    setLoading(false);
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (!creator) {
    return (
      <div className="public-profile">
        <div className="profile-not-found">Creator not found.</div>
      </div>
    );
  }

  const tierColor = TIER_COLOR[creator.tier];
  const firstName = creator.name.split(" ")[0];
  const niches = creator.niches ?? ["Content", "Local", "NYC"];

  return (
    <div className="public-profile page-fade-in">
      {/* ── 1. Sticky nav strip ─────────────────────────────── */}
      <div className="profile-header-strip">
        <Link href="/explore" className="header-back">
          Creators
        </Link>
        <span className="header-label">Push Creator Profile</span>
      </div>

      {/* ── 2. Editorial Hero ───────────────────────────────── */}
      <div className="pub-hero">
        <div className="pub-hero-inner">
          {/* Left — name + tags + badges */}
          <div className="pub-hero-left">
            {/* Niche tags eyebrow */}
            <div className="pub-niche-tags">
              {niches.map((tag, i) => (
                <span key={tag} style={{ display: "contents" }}>
                  {i > 0 && <span className="pub-niche-dot" />}
                  {tag}
                </span>
              ))}
            </div>

            {/* Big name */}
            <h1 className="pub-name">{creator.name}</h1>

            {/* Tier + score + verified badges */}
            <div className="pub-badge-row">
              <TierBadge tier={creator.tier} size="xl" />
              <div className="pub-score-badge">
                <span
                  className="pub-score-badge-num"
                  style={{
                    color: tierColor === "#4a5568" ? "#c9a96e" : tierColor,
                  }}
                >
                  {creator.push_score}
                </span>
                <span className="pub-score-badge-label">ConversionOracle™</span>
              </div>
              {creator.is_verified && (
                <div className="pub-verified-badge">
                  <span className="pub-verified-dot" />
                  Verified
                </div>
              )}
            </div>

            {/* Meta */}
            <p className="pub-location">
              <span className="pub-location-icon">◎</span>
              {creator.location}
            </p>
            <p className="pub-handle">@{creator.instagram_handle}</p>

            {/* Available indicator */}
            <div className="pub-available">
              <span className="pub-available-dot" />
              <span className="pub-available-label">
                Available for campaigns
              </span>
            </div>
          </div>

          {/* Right — avatar */}
          <div className="pub-hero-avatar-col">
            <div
              className="pub-avatar"
              style={{
                borderColor: tierColor === "#4a5568" ? "#c1121f" : tierColor,
              }}
              aria-label={`${creator.name} avatar`}
            >
              {creator.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="pub-avatar-img"
                />
              ) : (
                <span className="pub-avatar-initial">
                  {getInitial(creator.name)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Stats bar — 5 merchant-relevant KPIs ─────────── */}
      <div className="pub-stats-strip">
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.push_score}</div>
          <div className="pub-stat-label">Push Score</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.campaigns_completed}</div>
          <div className="pub-stat-label">Campaigns Done</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.walkins_total ?? "—"}</div>
          <div className="pub-stat-label">Walk-ins Driven</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">
            {creator.avg_customer_value
              ? `$${creator.avg_customer_value}`
              : "—"}
          </div>
          <div className="pub-stat-label">Avg Customer Value</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">
            {creator.merchant_satisfaction.toFixed(1)}
          </div>
          <div className="pub-stat-label">Merchant Rating</div>
        </div>
      </div>

      {/* ── 4. Bio + trust signals ──────────────────────────── */}
      {creator.bio && (
        <div className="pub-bio-section">
          <div className="pub-bio-inner">
            <p className="pub-section-eyebrow">About</p>
            <p className="pub-bio">{creator.bio}</p>
            <div className="pub-trust-signals">
              <div className="pub-trust-item">
                <span className="pub-trust-icon" />
                <span className="pub-trust-text">
                  {creator.completion_rate}% completion rate
                </span>
              </div>
              <div className="pub-trust-item">
                <span className="pub-trust-icon" />
                <span className="pub-trust-text">
                  {creator.campaigns_completed} campaigns completed
                </span>
              </div>
              {creator.is_verified && (
                <div className="pub-trust-item">
                  <span className="pub-trust-icon" />
                  <span className="pub-trust-text">Identity verified</span>
                </div>
              )}
              <div className="pub-trust-item">
                <span className="pub-trust-icon" />
                <span className="pub-trust-text">
                  {creator.merchant_satisfaction.toFixed(1)} merchant rating
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Media gallery ────────────────────────────────── */}
      <div className="pub-media-section">
        <div className="pub-media-inner">
          <p className="pub-section-eyebrow">Past Content</p>
          <div className="pub-media-grid">
            {MEDIA_CATEGORIES.map((cat, i) => (
              <div key={i} className="pub-media-card">
                <div className="pub-media-placeholder">
                  <span className="pub-media-category">{cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Social links ─────────────────────────────────── */}
      <div className="pub-social-section">
        <div className="pub-social-inner">
          <p className="pub-section-eyebrow">Social Platforms</p>
          <div className="pub-social-scroll">
            {creator.instagram_handle && (
              <a
                href={`https://instagram.com/${creator.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pub-social-card"
              >
                <span className="pub-social-platform">Instagram</span>
                <span className="pub-social-handle">
                  @{creator.instagram_handle}
                </span>
                {creator.instagram_followers && (
                  <>
                    <span className="pub-social-followers">
                      {formatFollowers(creator.instagram_followers)}
                    </span>
                    <span className="pub-social-followers-label">
                      followers
                    </span>
                  </>
                )}
              </a>
            )}
            {creator.tiktok_handle && (
              <a
                href={`https://tiktok.com/@${creator.tiktok_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pub-social-card"
              >
                <span className="pub-social-platform">TikTok</span>
                <span className="pub-social-handle">
                  @{creator.tiktok_handle}
                </span>
                {creator.tiktok_followers && (
                  <>
                    <span className="pub-social-followers">
                      {formatFollowers(creator.tiktok_followers)}
                    </span>
                    <span className="pub-social-followers-label">
                      followers
                    </span>
                  </>
                )}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── 7. Tier journey ─────────────────────────────────── */}
      <div className="pub-tier-section">
        <div className="pub-tier-inner">
          <p className="pub-section-eyebrow">Tier Journey</p>
          <TierJourney
            currentTier={creator.tier}
            currentScore={creator.push_score}
          />
        </div>
      </div>

      {/* ── 8. Campaign history ─────────────────────────────── */}
      <div className="pub-campaigns-section">
        <div className="pub-campaigns-inner">
          <div className="pub-campaigns-header">
            <div>
              <p className="pub-section-eyebrow">Campaign History</p>
              <span className="pub-campaigns-count">
                {creator.campaign_history.length}
              </span>
              <span className="pub-campaigns-count-label">campaigns</span>
            </div>
          </div>
          <div className="pub-campaigns">
            {creator.campaign_history.map((c) => (
              <div key={c.id} className="pub-campaign-card">
                <div
                  className="pub-campaign-card-accent"
                  style={{
                    background: tierColor === "#4a5568" ? "#c1121f" : tierColor,
                  }}
                />
                <div className="pub-campaign-header">
                  <span className="pub-campaign-business">{c.business}</span>
                  <span className="pub-campaign-category">{c.category}</span>
                </div>
                <div className="pub-campaign-footer">
                  <span className="pub-campaign-date">{c.date}</span>
                  {c.payout > 0 ? (
                    <span className="pub-campaign-payout">${c.payout}</span>
                  ) : (
                    <span className="pub-campaign-payout pub-campaign-payout--product">
                      Product exchange
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 9. Invite to Campaign banner (merchant view) ────── */}
      <div className="pub-invite-banner">
        <div className="pub-invite-banner-inner">
          <div className="pub-invite-banner-text">
            <p className="pub-invite-banner-headline">
              Invite {firstName} to Your Campaign
            </p>
            <p className="pub-invite-banner-sub">
              {firstName} has driven {creator.walkins_total ?? 0} verified
              walk-ins. Pay only for results.
            </p>
          </div>
          <Link href="/merchant/signup" className="pub-invite-btn">
            Invite to Campaign →
          </Link>
        </div>
      </div>

      {/* ── 10. CTA ─────────────────────────────────────────── */}
      <div className="pub-cta-section">
        <p className="pub-cta-eyebrow">Work with this creator</p>
        <h2 className="pub-cta-headline">Work with {firstName}</h2>
        <p className="pub-cta-sub">
          Launch a campaign on Push and invite local creators like {firstName}.
          Pay only for verified walk-ins.
        </p>
        <Link href="/merchant/signup" className="pub-cta-button">
          Start a Campaign →
        </Link>
        <p className="pub-cta-note">
          No commitments. Pay only for verified visits.
        </p>
      </div>

      <footer className="profile-footer">
        Push · Customer Acquisition Engine for Local Commerce
      </footer>
    </div>
  );
}
