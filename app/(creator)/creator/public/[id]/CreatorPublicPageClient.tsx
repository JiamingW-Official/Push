"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TierBadge } from "@/components/creator/TierBadge";
import { ScoreRings } from "@/components/creator/ScoreRings";
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
  location: string;
  bio: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  completion_rate: number;
  merchant_satisfaction: number;
  earnings_total: number;
  avatar_url: string | undefined;
  campaign_history: CampaignHistoryItem[];
};

const DEMO_PUBLIC_CREATOR: PublicCreator = {
  id: "demo-creator-001",
  name: "Alex Chen",
  instagram_handle: "alexcheneats",
  location: "Lower East Side, NYC",
  bio: "NYC food & lifestyle creator. Always hunting for the next hidden gem.",
  tier: "operator" as const,
  push_score: 71,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  completion_rate: 86,
  merchant_satisfaction: 4.2,
  earnings_total: 340,
  avatar_url: undefined,
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
  seed: "var(--tier-seed)",
  explorer: "var(--tier-explorer)",
  operator: "var(--tier-operator)",
  proven: "var(--tier-proven)",
  closer: "var(--tier-closer)",
  partner: "var(--tier-partner)",
};

function deriveDimensionScores(
  pushScore: number,
  completionRate: number,
  satisfaction: number,
) {
  const satisfactionNorm = Math.round((satisfaction / 5) * 100);
  return {
    completion: Math.min(100, completionRate),
    reliability: Math.min(100, Math.round(pushScore * 0.95)),
    quality: Math.min(100, Math.round(satisfactionNorm * 0.9)),
    satisfaction: satisfactionNorm,
    engagement: Math.min(100, Math.round(pushScore * 0.7)),
  };
}

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
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
      <div className="pub-campaigns skeleton-block" style={{ height: 280 }} />
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
  const dimensionScores = deriveDimensionScores(
    creator.push_score,
    creator.completion_rate,
    creator.merchant_satisfaction,
  );

  return (
    <div className="public-profile page-fade-in">
      {/* Header strip — breadcrumb nav */}
      <div className="profile-header-strip">
        <Link href="/explore" className="header-back">
          ← Creators
        </Link>
        <span className="header-label eyebrow">(PUSH CREATOR PROFILE)</span>
      </div>

      {/* ── Hero — dark panel, corner-anchored ──────────────── */}
      <div className="pub-hero">
        <div className="pub-hero-inner">
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

            {/* Identity */}
            <div className="pub-identity">
              <h1 className="pub-name">{creator.name}</h1>
              <div className="pub-badge-row">
                <TierBadge tier={creator.tier} size="xl" />
              </div>
              <p className="pub-location">
                <span className="pub-location-icon">◎</span>
                {creator.location}
              </p>
              <p className="pub-handle">@{creator.instagram_handle}</p>
              <p className="pub-bio">{creator.bio}</p>
              <div className="pub-available">
                <span className="pub-available-dot" />
                <span className="pub-available-label eyebrow">
                  Available for campaigns
                </span>
              </div>
            </div>
          </div>

          {/* Push Score rings */}
          <div className="pub-score-section">
            <p className="pub-section-eyebrow eyebrow">Push Score</p>
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

      {/* ── Stats strip ─────────────────────────────────────── */}
      <div className="pub-stats-strip">
        <div className="pub-stat">
          <div className="pub-stat-value" style={{ color: tierColor }}>
            {creator.push_score}
          </div>
          <div className="pub-stat-label eyebrow">Push Score</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.campaigns_completed}</div>
          <div className="pub-stat-label eyebrow">Campaigns Done</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">{creator.completion_rate}%</div>
          <div className="pub-stat-label eyebrow">Completion Rate</div>
        </div>
        <div className="pub-stat">
          <div className="pub-stat-value">
            {creator.merchant_satisfaction.toFixed(1)}
          </div>
          <div className="pub-stat-label eyebrow">Merchant Rating</div>
        </div>
      </div>

      {/* ── Tier Journey ────────────────────────────────────── */}
      <div className="pub-tier-section">
        <p className="pub-section-eyebrow eyebrow">Tier Journey</p>
        <TierJourney
          currentTier={creator.tier}
          currentScore={creator.push_score}
        />
      </div>

      {/* ── Campaign History ─────────────────────────────────── */}
      <div className="pub-campaigns-section">
        <p className="pub-section-eyebrow eyebrow">Campaign History</p>
        <div className="pub-campaigns">
          {creator.campaign_history.map((c) => (
            <div
              key={c.id}
              className="pub-campaign-card"
              style={{ borderLeftColor: tierColor }}
            >
              <div className="pub-campaign-header">
                <span className="pub-campaign-business">{c.business}</span>
                <span className="pub-campaign-category btn-pill">
                  {c.category}
                </span>
              </div>
              <div className="pub-campaign-footer">
                <span className="pub-campaign-date">{c.date}</span>
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
          ))}
        </div>
      </div>

      {/* ── CTA section ─────────────────────────────────────── */}
      <div className="pub-cta-section candy-panel">
        <p className="pub-cta-eyebrow eyebrow">(WORK WITH THIS CREATOR)</p>
        <h2 className="pub-cta-headline">Work with {firstName}</h2>
        <p className="pub-cta-sub">
          Launch a campaign on Push and invite local creators like {firstName}.
        </p>
        <Link
          href="/merchant/signup"
          className="pub-cta-button btn-primary click-shift"
        >
          Start a Campaign →
        </Link>
        <p className="pub-cta-note">
          No commitments. Pay only for verified visits.
        </p>
      </div>

      <footer className="profile-footer">
        Push · Creator attribution platform
      </footer>
    </div>
  );
}
