"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TierBadge } from "@/components/creator/TierBadge";
import { ScoreRings } from "@/components/creator/ScoreRings";
import { TierJourney } from "@/components/creator/TierJourney";
import "./public.css";

// ── Types ──────────────────────────────────────────────────────────────────────

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
  walkIns?: number;
};

type PublicCreator = {
  id: string;
  name: string;
  instagram_handle: string;
  location: string;
  neighborhood: string;
  bio: string;
  tier: CreatorTier;
  push_score: number;
  conversion_oracle_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  completion_rate: number;
  merchant_satisfaction: number;
  earnings_total: number;
  total_walk_ins: number;
  avg_walk_ins_per_campaign: number;
  top_creator_in: string;
  is_verified: boolean;
  avatar_url: string | undefined;
  campaign_history: CampaignHistoryItem[];
};

// ── Category color map ─────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Coffee: "#c9a96e",
  Food: "#c1121f",
  Beauty: "#669bbc",
  Lifestyle: "#003049",
  Fitness: "#780000",
  Retail: "#4a5568",
};

function categoryColor(cat: string): string {
  return CATEGORY_COLOR[cat] ?? "#c9a96e";
}

// ── Demo data ──────────────────────────────────────────────────────────────────

const DEMO_PUBLIC_CREATOR: PublicCreator = {
  id: "demo-creator-001",
  name: "Alex Chen",
  instagram_handle: "alexcheneats",
  location: "Williamsburg, Brooklyn",
  neighborhood: "Williamsburg",
  bio: "NYC food & lifestyle creator. Always hunting for the next hidden gem in Brooklyn and beyond.",
  tier: "operator" as const,
  push_score: 847,
  conversion_oracle_score: 847,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  completion_rate: 86,
  merchant_satisfaction: 4.9,
  earnings_total: 340,
  total_walk_ins: 144,
  avg_walk_ins_per_campaign: 12,
  top_creator_in: "Williamsburg, Brooklyn",
  is_verified: true,
  avatar_url: undefined,
  campaign_history: [
    {
      id: "1",
      business: "Blank Street Coffee",
      category: "Coffee",
      date: "Jan 2026",
      payout: 42,
      walkIns: 14,
    },
    {
      id: "2",
      business: "Superiority Burger",
      category: "Food",
      date: "Feb 2026",
      payout: 66,
      walkIns: 22,
    },
    {
      id: "3",
      business: "Flamingo Estate",
      category: "Lifestyle",
      date: "Mar 2026",
      payout: 35,
      walkIns: 7,
    },
    {
      id: "4",
      business: "Brow Theory",
      category: "Beauty",
      date: "Mar 2026",
      payout: 55,
      walkIns: 11,
    },
    {
      id: "5",
      business: "Le Bec Fin",
      category: "Food",
      date: "Oct 2025",
      payout: 48,
      walkIns: 12,
    },
    {
      id: "6",
      business: "Cha Cha Matcha",
      category: "Coffee",
      date: "Nov 2025",
      payout: 27,
      walkIns: 9,
    },
  ],
};

// ── Tier color ─────────────────────────────────────────────────────────────────

const TIER_COLOR: Record<CreatorTier, string> = {
  seed: "#b8a99a",
  explorer: "#8c6239",
  operator: "#c9a96e",
  proven: "#c9a96e",
  closer: "#9b111e",
  partner: "#003049",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function deriveDimensionScores(
  pushScore: number,
  completionRate: number,
  satisfaction: number,
) {
  const satisfactionNorm = Math.round((satisfaction / 5) * 100);
  return {
    completion: Math.min(100, completionRate),
    reliability: Math.min(100, Math.round(pushScore * 0.95 * 0.1)),
    quality: Math.min(100, Math.round(satisfactionNorm * 0.9)),
    satisfaction: satisfactionNorm,
    engagement: Math.min(100, Math.round(pushScore * 0.7 * 0.1)),
  };
}

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="pub-profile">
      <div className="pub-topbar">
        <span className="skeleton-line" style={{ width: 80 }} />
        <span className="skeleton-line" style={{ width: 140 }} />
      </div>
      <div className="pub-hero skeleton-block" style={{ height: 320 }} />
      <div className="pub-stats-strip skeleton-block" style={{ height: 100 }} />
      <div className="pub-campaigns skeleton-block" style={{ height: 280 }} />
    </div>
  );
}

// ── Portfolio gallery grid ─────────────────────────────────────────────────────

function PortfolioGallery({ campaigns }: { campaigns: CampaignHistoryItem[] }) {
  const slots = campaigns.slice(0, 6);

  return (
    <div className="pub-gallery-grid">
      {slots.map((c, i) => (
        <div
          key={c.id}
          className="pub-gallery-cell"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Thumbnail placeholder with category bg tint */}
          <div
            className="pub-gallery-thumb"
            style={{
              background: `linear-gradient(135deg, ${categoryColor(c.category)}22 0%, ${categoryColor(c.category)}44 100%)`,
            }}
          >
            <span className="pub-gallery-placeholder-icon">📷</span>
          </div>
          {/* Category color overlay on hover */}
          <div
            className="pub-gallery-overlay"
            style={{ background: `${categoryColor(c.category)}cc` }}
          >
            <span className="pub-gallery-overlay-business">{c.business}</span>
            {c.payout > 0 && (
              <span className="pub-gallery-overlay-earn">${c.payout}</span>
            )}
          </div>
          <div
            className="pub-gallery-cat-bar"
            style={{ background: categoryColor(c.category) }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

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
    // Real fetch would go here
    setCreator(DEMO_PUBLIC_CREATOR);
    setLoading(false);
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (!creator) {
    return (
      <div className="pub-profile">
        <div className="pub-not-found">Creator not found.</div>
      </div>
    );
  }

  const tierColor = TIER_COLOR[creator.tier];
  const firstName = creator.name.split(" ")[0];
  const dimensionScores = deriveDimensionScores(
    creator.push_score,
    creator.completion_rate,
    creator.merchant_satisfaction,
  );

  return (
    <div className="pub-profile pub-fade-in">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="pub-topbar">
        <Link href="/explore" className="pub-topbar-back">
          ← Creators
        </Link>
        <span className="pub-topbar-label">Push Creator Profile</span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="pub-hero">
        <div className="pub-hero-inner">
          {/* Left: identity */}
          <div className="pub-hero-left">
            {/* Avatar */}
            <div
              className="pub-avatar"
              style={{ borderColor: tierColor }}
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
                <span
                  className="pub-avatar-initial"
                  style={{ color: tierColor }}
                >
                  {getInitial(creator.name)}
                </span>
              )}
            </div>

            {/* Name + badges */}
            <div className="pub-identity">
              <div className="pub-badge-row">
                <TierBadge tier={creator.tier} size="xl" />
                {creator.is_verified && (
                  <span className="pub-verified-badge">Verified Creator ✓</span>
                )}
              </div>

              <h1 className="pub-name">{creator.name}</h1>

              <p className="pub-location">
                <span className="pub-location-icon">◎</span>
                {creator.location}
              </p>

              <p className="pub-handle">@{creator.instagram_handle}</p>

              {/* ConversionOracle score — most important merchant metric */}
              <div className="pub-oracle-block">
                <div className="pub-oracle-score" style={{ color: tierColor }}>
                  {creator.conversion_oracle_score}
                </div>
                <div className="pub-oracle-meta">
                  <span className="pub-oracle-label">
                    ConversionOracle™ Score
                  </span>
                  <span className="pub-oracle-sub">
                    {creator.total_walk_ins} walk-ins driven
                  </span>
                </div>
              </div>

              <p className="pub-bio">{creator.bio}</p>

              <div className="pub-available">
                <span className="pub-available-dot" />
                <span className="pub-available-label">
                  Available for campaigns
                </span>
              </div>
            </div>
          </div>

          {/* Right: score rings */}
          <div className="pub-score-section">
            <p className="pub-section-eyebrow">Push Score</p>
            <ScoreRings
              scores={dimensionScores}
              totalScore={creator.push_score}
              variant="hero"
              size={260}
              tier={creator.tier}
              animate={true}
            />
          </div>
        </div>
      </div>

      {/* ── Social proof strip (merchant-facing) ─────────────────────────── */}
      <div className="pub-proof-strip">
        <div className="pub-proof-item">
          <span className="pub-proof-icon">★</span>
          <span className="pub-proof-text">
            Top creator in {creator.top_creator_in}
          </span>
        </div>
        <div className="pub-proof-divider" />
        <div className="pub-proof-item">
          <span className="pub-proof-icon">◎</span>
          <span className="pub-proof-text">
            Avg {creator.avg_walk_ins_per_campaign} walk-ins per campaign
          </span>
        </div>
        <div className="pub-proof-divider" />
        <div className="pub-proof-item">
          <span className="pub-proof-icon">✓</span>
          <span className="pub-proof-text">
            {creator.merchant_satisfaction}/5 merchant rating
          </span>
        </div>
      </div>

      {/* ── Key stats (4-col) ────────────────────────────────────────────── */}
      <div className="pub-stats-strip">
        <div className="pub-stat">
          <div className="pub-stat-value" style={{ color: tierColor }}>
            {creator.conversion_oracle_score}
          </div>
          <div className="pub-stat-label">ConversionOracle™</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.total_walk_ins}</div>
          <div className="pub-stat-label">Walk-ins Driven</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.campaigns_completed}</div>
          <div className="pub-stat-label">Campaigns Done</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">
            {creator.merchant_satisfaction.toFixed(1)}★
          </div>
          <div className="pub-stat-label">Merchant Rating</div>
        </div>
      </div>

      {/* ── Portfolio gallery ─────────────────────────────────────────────── */}
      <div className="pub-gallery-section">
        <p className="pub-section-eyebrow">Portfolio</p>
        <h2 className="pub-gallery-title">Past Campaign Content</h2>
        <PortfolioGallery campaigns={creator.campaign_history} />
      </div>

      {/* ── Tier journey ─────────────────────────────────────────────────── */}
      <div className="pub-tier-section">
        <p className="pub-section-eyebrow">Tier Journey</p>
        <TierJourney
          currentTier={creator.tier}
          currentScore={creator.push_score}
        />
      </div>

      {/* ── Past campaigns list ───────────────────────────────────────────── */}
      <div className="pub-campaigns-section">
        <p className="pub-section-eyebrow">Campaign History</p>
        <div className="pub-campaigns">
          {creator.campaign_history.map((c) => (
            <div
              key={c.id}
              className="pub-campaign-card"
              style={{ borderLeftColor: categoryColor(c.category) }}
            >
              <div className="pub-campaign-header">
                <span className="pub-campaign-business">{c.business}</span>
                <span
                  className="pub-campaign-category"
                  style={{
                    background: `${categoryColor(c.category)}18`,
                    color: categoryColor(c.category),
                  }}
                >
                  {c.category}
                </span>
              </div>
              <div className="pub-campaign-footer">
                <span className="pub-campaign-date">{c.date}</span>
                <div className="pub-campaign-metrics">
                  {c.walkIns !== undefined && (
                    <span className="pub-campaign-walkins">
                      {c.walkIns} walk-ins
                    </span>
                  )}
                  {c.payout > 0 ? (
                    <span className="pub-campaign-payout">
                      ${c.payout} earned
                    </span>
                  ) : (
                    <span className="pub-campaign-payout pub-campaign-payout--product">
                      Product exchange
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── "Invite to Campaign" CTA ──────────────────────────────────────── */}
      <div className="pub-cta-section">
        <p className="pub-cta-eyebrow">Work with this creator</p>
        <h2 className="pub-cta-headline">
          Invite {firstName} to your campaign
        </h2>
        <p className="pub-cta-sub">
          {firstName} has driven {creator.total_walk_ins} verified walk-ins
          across {creator.campaigns_completed} campaigns. ConversionOracle™
          score: {creator.conversion_oracle_score}.
        </p>
        <Link href="/merchant/signup" className="pub-cta-button">
          Invite to Campaign →
        </Link>
        <p className="pub-cta-note">
          Pay only for verified walk-ins. No commitments.
        </p>
      </div>

      <footer className="pub-footer">
        Push · Vertical AI for Local Commerce
      </footer>
    </div>
  );
}
