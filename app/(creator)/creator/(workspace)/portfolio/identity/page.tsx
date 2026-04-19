"use client";

import { useCreatorProfile } from "@/lib/creator/hooks/useCreatorProfile";
import { useTierProgress } from "@/lib/creator/hooks/useTierProgress";
import "./identity.css";

const TIER_MATERIAL: Record<string, string> = {
  seed: "Clay",
  explorer: "Bronze",
  operator: "Steel",
  proven: "Gold",
  closer: "Ruby",
  partner: "Obsidian",
};

const TIER_CSS_VAR: Record<string, string> = {
  seed: "var(--tier-clay, #b8a99a)",
  explorer: "var(--tier-bronze, #8c6239)",
  operator: "var(--tier-steel, #4a5568)",
  proven: "var(--tier-gold, #c9a96e)",
  closer: "var(--tier-ruby, #9b111e)",
  partner: "var(--tier-obsidian, #1a1a2e)",
};

export default function PortfolioIdentityPage() {
  const { creator, loading } = useCreatorProfile();
  const progress = useTierProgress(creator);

  if (loading) {
    return (
      <div className="identity-loading">
        <div className="identity-skeleton" />
      </div>
    );
  }

  if (!creator) return null;

  const tier = creator.tier;
  const material = TIER_MATERIAL[tier] ?? tier;
  const tierColor = TIER_CSS_VAR[tier] ?? "var(--dark)";
  const isPartner = tier === "partner";

  return (
    <div className="identity-page">
      {/* Hero — editorial big type */}
      <div className="identity-hero">
        <p className="identity-hero__eyebrow">Creator Identity</p>
        <h1
          className={`identity-hero__tier${isPartner ? " identity-hero__tier--obsidian" : ""}`}
          style={{ color: tierColor }}
        >
          {material}
        </h1>
        <p className="identity-hero__tier-name">
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </p>
      </div>

      {/* Score + Progress */}
      <div className="identity-score-section">
        <div className="identity-score-card">
          <span className="identity-score__label">Push Score</span>
          <span className="identity-score__value">{creator.push_score}</span>
        </div>

        {progress && progress.nextTier && (
          <div className="identity-progress-card">
            <div className="identity-progress__header">
              <span className="identity-progress__label">
                {progress.scoreToNext} pts to {TIER_MATERIAL[progress.nextTier]}
              </span>
              <span className="identity-progress__pct">
                {progress.progressPercent}%
              </span>
            </div>
            <div className="identity-progress__bar">
              <div
                className="identity-progress__fill"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {!progress?.nextTier && (
          <p className="identity-top-label">Top tier reached.</p>
        )}
      </div>

      {/* Creator stats */}
      <div className="identity-stats">
        <div className="identity-stat">
          <span className="identity-stat__value">
            {creator.campaigns_completed}
          </span>
          <span className="identity-stat__label">Completed</span>
        </div>
        <div className="identity-stat">
          <span className="identity-stat__value">
            {creator.campaigns_accepted}
          </span>
          <span className="identity-stat__label">Accepted</span>
        </div>
        <div className="identity-stat">
          <span className="identity-stat__value">
            ${(creator.earnings_total ?? 0).toFixed(0)}
          </span>
          <span className="identity-stat__label">Total earned</span>
        </div>
        {creator.instagram_followers && (
          <div className="identity-stat">
            <span className="identity-stat__value">
              {creator.instagram_followers >= 1000
                ? `${(creator.instagram_followers / 1000).toFixed(1)}k`
                : creator.instagram_followers}
            </span>
            <span className="identity-stat__label">Followers</span>
          </div>
        )}
      </div>

      {/* Profile meta */}
      <div className="identity-meta">
        {creator.name && <p className="identity-meta__name">{creator.name}</p>}
        {creator.instagram_handle && (
          <p className="identity-meta__handle">@{creator.instagram_handle}</p>
        )}
        {creator.location && (
          <p className="identity-meta__location">{creator.location}</p>
        )}
        {creator.bio && <p className="identity-meta__bio">{creator.bio}</p>}
      </div>
    </div>
  );
}
