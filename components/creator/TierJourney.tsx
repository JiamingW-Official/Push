"use client";

import "./tier-journey.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

// ---------------------------------------------------------------------------
// Tier data — inline so this file has no external dependency on tier-config
// ---------------------------------------------------------------------------

// Tier colors reference brand tokens via var() — resolved at paint time from
// globals.css + tier-identity.css (Path A). No new hex values introduced.
const TIER_DATA = [
  {
    key: "seed" as CreatorTier,
    label: "Seed",
    icon: "",
    minScore: 0,
    maxScore: 39,
    benefit: "Free product",
    color: "var(--tertiary)",
  },
  {
    key: "explorer" as CreatorTier,
    label: "Explorer",
    icon: "",
    minScore: 40,
    maxScore: 54,
    benefit: "$12/campaign",
    color: "var(--champagne)",
  },
  {
    key: "operator" as CreatorTier,
    label: "Operator",
    icon: "",
    minScore: 55,
    maxScore: 64,
    benefit: "$20 + 3%",
    color: "var(--tertiary)",
  },
  {
    key: "proven" as CreatorTier,
    label: "Proven",
    icon: "",
    minScore: 65,
    maxScore: 77,
    benefit: "$32 + 5%",
    color: "var(--primary)",
  },
  {
    key: "closer" as CreatorTier,
    label: "Closer",
    icon: "",
    minScore: 78,
    maxScore: 87,
    benefit: "$55 + 7%",
    color: "var(--accent)",
  },
  {
    key: "partner" as CreatorTier,
    label: "Partner",
    icon: "",
    minScore: 88,
    maxScore: 100,
    benefit: "$100 + 10%",
    color: "var(--dark)",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTierIndex(tier: CreatorTier): number {
  return TIER_DATA.findIndex((t) => t.key === tier);
}

function getNextTier(currentIndex: number): (typeof TIER_DATA)[number] | null {
  return currentIndex < TIER_DATA.length - 1
    ? TIER_DATA[currentIndex + 1]
    : null;
}

/** Clamp progress ratio within [0, 1] */
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function getProgressToNextTier(
  score: number,
  currentTierIndex: number,
): number {
  const tier = TIER_DATA[currentTierIndex];
  const range = tier.maxScore - tier.minScore;
  if (range <= 0) return 1;
  return clamp((score - tier.minScore) / range, 0, 1);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type TierJourneyProps = {
  currentTier: CreatorTier;
  currentScore: number;
  className?: string;
  compact?: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TierJourney({
  currentTier,
  currentScore,
  className = "",
  compact = false,
}: TierJourneyProps) {
  const currentIndex = getTierIndex(currentTier);
  const nextTier = getNextTier(currentIndex);
  const progress = getProgressToNextTier(currentScore, currentIndex);
  const ptsNeeded = nextTier
    ? Math.max(0, nextTier.minScore - currentScore)
    : 0;

  // ── Compact mode: minimal dot rail ─────────────────────────────────────

  if (compact) {
    return (
      <div className={`tj-compact ${className}`} aria-label="Tier progression">
        <div className="tj-compact__rail">
          {TIER_DATA.map((tier, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={tier.key} className="tj-compact__step">
                {idx > 0 && (
                  <div
                    className={`tj-compact__line ${isPast || isCurrent ? "tj-compact__line--filled" : "tj-compact__line--dashed"}`}
                  />
                )}
                <div
                  className={`tj-compact__dot
                    ${isCurrent ? "tj-compact__dot--current" : ""}
                    ${isPast ? "tj-compact__dot--past" : ""}
                    ${!isPast && !isCurrent ? "tj-compact__dot--future" : ""}
                    ${tier.key === "partner" ? "tj-compact__dot--partner" : ""}
                  `}
                  style={
                    isCurrent ? { backgroundColor: tier.color } : undefined
                  }
                  title={tier.label}
                  aria-label={`${tier.label}${isCurrent ? " (current)" : ""}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Full mode ───────────────────────────────────────────────────────────

  return (
    <div className={`tj ${className}`} aria-label="Creator tier journey">
      {/* ── Rail ── */}
      <div className="tj__rail" role="list">
        {TIER_DATA.map((tier, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const isLast = idx === TIER_DATA.length - 1;

          return (
            <div
              key={tier.key}
              className="tj__step"
              role="listitem"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Connecting line before this node (all except first) */}
              {idx > 0 && (
                <div
                  className={`tj__line ${
                    isPast || isCurrent
                      ? "tj__line--filled"
                      : "tj__line--dashed"
                  }`}
                  aria-hidden="true"
                >
                  {/* Inline progress fill between current and next */}
                  {idx === currentIndex + 1 && (
                    <div
                      className="tj__line-progress"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </div>
              )}

              {/* Node */}
              <div
                className={`tj__node
                  ${isCurrent ? "tj__node--current" : ""}
                  ${isPast ? "tj__node--past" : ""}
                  ${isFuture ? "tj__node--future" : ""}
                  ${tier.key === "partner" ? "tj__node--partner" : ""}
                `}
                style={{
                  borderColor: isFuture ? "var(--line-strong)" : tier.color,
                  backgroundColor: isCurrent
                    ? tier.color
                    : isPast
                      ? tier.color
                      : "transparent",
                }}
                aria-label={`${tier.label}: ${tier.benefit}${isPast ? " — completed" : ""}${isFuture ? " — locked" : ""}`}
              >
                {isPast ? (
                  <span className="tj__node-checkmark" aria-hidden="true">
                    ✓
                  </span>
                ) : isFuture ? (
                  <span className="tj__node-lock" aria-hidden="true">
                    —
                  </span>
                ) : (
                  <span className="tj__node-icon" aria-hidden="true">
                    {tier.icon}
                  </span>
                )}
              </div>

              {/* Label + benefit */}
              <div
                className={`tj__label ${isFuture ? "tj__label--future" : ""}`}
              >
                <span
                  className="tj__tier-name"
                  style={{
                    color: isFuture ? "var(--text-muted)" : tier.color,
                  }}
                >
                  {tier.label}
                </span>
                <span
                  className="tj__tier-benefit"
                  style={{
                    color: isFuture ? "var(--text-muted)" : "var(--graphite)",
                  }}
                >
                  {tier.benefit}
                </span>
                {isCurrent && (
                  <span className="tj__current-tag" aria-label="Current tier">
                    NOW
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Progress bar + next-tier CTA (only when not at max tier) ── */}
      {nextTier && (
        <div className="tj__footer">
          <div className="tj__progress-wrap">
            <div className="tj__progress-bar">
              <div
                className="tj__progress-fill"
                style={{ width: `${progress * 100}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress to ${nextTier.label}`}
              />
            </div>
            <span className="tj__progress-label">
              {Math.round(progress * 100)}% to {nextTier.label}
            </span>
          </div>

          <div className="tj__cta">
            <span className="tj__cta-icon" aria-hidden="true">
              {nextTier.icon}
            </span>
            <span className="tj__cta-text">
              Next:{" "}
              <strong style={{ color: nextTier.color }}>
                {nextTier.label}
              </strong>{" "}
              —{" "}
              <span className="tj__cta-pts">
                {ptsNeeded} pt{ptsNeeded !== 1 ? "s" : ""} needed
              </span>
            </span>
          </div>
        </div>
      )}

      {/* At max tier */}
      {!nextTier && (
        <div className="tj__footer tj__footer--max">
          <span className="tj__max-label">
            Partner status — maximum tier achieved
          </span>
        </div>
      )}
    </div>
  );
}
