import React, { useEffect, useRef, useState } from "react";
import { TIERS } from "@/lib/tier-config";

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type PushScoreProps = {
  score: number;
  tier: CreatorTier;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  showTier?: boolean;
  animate?: boolean;
  className?: string;
  // New prop
  showTierInfo?: boolean;
};

// Path A brand-palette mapping per Design.md §Tier Identity System.
// These hex values correspond 1:1 to brand tokens in globals.css — they are
// kept as literals here because the values are consumed by SVG stroke +
// inline style paths (not CSS-resolved). Change these only by editing the
// brand tokens they mirror.
const TIER_COLORS: Record<CreatorTier, string> = {
  seed: "#669bbc", // --tertiary Steel Blue
  explorer: "#c9a96e", // --champagne Champagne Gold
  operator: "#669bbc", // --tertiary Steel Blue
  proven: "#c1121f", // --primary Flag Red
  closer: "#780000", // --accent Molten Lava
  partner: "#003049", // --dark Deep Space Blue
};

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

// Sourced from lib/tier-config.ts. Pre-v6 had drift of 2–5 points on
// upper tiers vs the canonical scoring engine. Partner.maxScore is capped
// at 100 here for the progress-bar UI; tier-config declares Infinity.
const TIER_THRESHOLDS: Record<CreatorTier, { min: number; max: number }> = {
  seed: { min: TIERS.Seed.minScore, max: TIERS.Seed.maxScore },
  explorer: { min: TIERS.Explorer.minScore, max: TIERS.Explorer.maxScore },
  operator: { min: TIERS.Operator.minScore, max: TIERS.Operator.maxScore },
  proven: { min: TIERS.Proven.minScore, max: TIERS.Proven.maxScore },
  closer: { min: TIERS.Closer.minScore, max: TIERS.Closer.maxScore },
  partner: { min: TIERS.Partner.minScore, max: 100 },
};

const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

function getNextTier(tier: CreatorTier): CreatorTier | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
}

// ---------------------------------------------------------------------------
// Count-up hook
// ---------------------------------------------------------------------------

function useCountUp(target: number, enabled: boolean, duration = 1200): number {
  const [value, setValue] = useState(enabled ? 0 : target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    setValue(0);
    startRef.current = null;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, 60);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, enabled, duration]);

  return value;
}

export function PushScore({
  score,
  tier,
  size = 120,
  strokeWidth = 8,
  showLabel = false,
  showTier = false,
  animate = true,
  className,
  showTierInfo = false,
}: PushScoreProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = size / 2 - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - clampedScore / 100);

  const [dashOffset, setDashOffset] = useState(
    animate ? circumference : targetOffset,
  );
  const [animReady, setAnimReady] = useState(!animate);
  const hasAnimated = useRef(false);

  // Trigger animation on mount
  useEffect(() => {
    if (!animate || hasAnimated.current) return;
    hasAnimated.current = true;
    const raf = requestAnimationFrame(() => {
      setDashOffset(targetOffset);
      setAnimReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [animate, targetOffset]);

  // When animate=false update immediately if score changes
  useEffect(() => {
    if (!animate) {
      setDashOffset(targetOffset);
      setAnimReady(true);
    }
  }, [animate, targetOffset]);

  // Count-up display score
  const displayScore = useCountUp(clampedScore, animate && animReady);

  const cx = size / 2;
  const cy = size / 2;
  const color = TIER_COLORS[tier];

  // Tier info calculations
  const nextTier = getNextTier(tier);
  const currentThreshold = TIER_THRESHOLDS[tier];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const pointsToNext = nextThreshold
    ? Math.max(0, nextThreshold.min - clampedScore)
    : 0;
  // Progress within current tier band (0-1)
  const tierRangeSize = currentThreshold.max - currentThreshold.min;
  const tierProgress =
    tierRangeSize > 0
      ? Math.min(1, (clampedScore - currentThreshold.min) / tierRangeSize)
      : 1;

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "var(--dark)",
    textTransform: "uppercase",
    lineHeight: 1,
  };

  const svgStyle: React.CSSProperties = {
    display: "block",
    overflow: "visible",
  };

  const trackStyle: React.CSSProperties = {
    fill: "none",
    stroke: "var(--line)",
    strokeWidth,
  };

  const progressStyle: React.CSSProperties = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "butt",
    strokeDasharray: circumference,
    strokeDashoffset: dashOffset,
    transition: animate
      ? "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)"
      : "none",
    transformOrigin: `${cx}px ${cy}px`,
    transform: "rotate(-90deg)",
  };

  const scoreTextStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    // Use tier color for the score number
    fontSize: size * 0.26,
    fill: color,
    dominantBaseline: "middle",
    textAnchor: "middle",
    letterSpacing: "-0.02em",
  };

  const tierTextStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: size * 0.09,
    fill: color,
    dominantBaseline: "middle",
    textAnchor: "middle",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  const scoreY = showTier ? cy - size * 0.07 : cy;
  const tierY = cy + size * 0.16;

  return (
    <div style={containerStyle} className={className}>
      {showLabel && <span style={labelStyle}>Push Score</span>}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={svgStyle}
        aria-label={`Push Score: ${clampedScore}, Tier: ${TIER_LABELS[tier]}`}
        role="img"
      >
        {/* Background track */}
        <circle cx={cx} cy={cy} r={radius} style={trackStyle} />

        {/* Progress arc */}
        <circle cx={cx} cy={cy} r={radius} style={progressStyle} />

        {/* Score number — count-up, tier-colored */}
        <text x={cx} y={scoreY} style={scoreTextStyle}>
          {displayScore}
        </text>

        {/* Tier label inside ring */}
        {showTier && (
          <text x={cx} y={tierY} style={tierTextStyle}>
            {TIER_LABELS[tier]}
          </text>
        )}
      </svg>

      {/* Tier info panel */}
      {showTierInfo && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            width: "100%",
            minWidth: size,
          }}
        >
          {/* Tier badge */}
          <div
            className={`tier-badge tier-badge--${tier}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              backgroundColor: color,
              color: "var(--surface)",
              borderLeft: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {TIER_LABELS[tier]}
            </span>
          </div>

          {/* Within-tier progress bar */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div
              style={{
                height: 3,
                backgroundColor: "var(--line)",
                position: "relative",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: color,
                  width: animReady ? `${tierProgress * 100}%` : "0%",
                  transition: animate
                    ? "width 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s"
                    : "none",
                }}
              />
            </div>

            {/* Points to next tier OR max tier label */}
            {nextTier ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    color: "var(--text-muted)",
                  }}
                >
                  {TIER_LABELS[tier]}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: color,
                  }}
                >
                  {pointsToNext > 0
                    ? `+${pointsToNext} pts → ${TIER_LABELS[nextTier]}`
                    : `Ready for ${TIER_LABELS[nextTier]}`}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: color,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Top Tier
                </span>
              </div>
            )}
          </div>

          {/* Mini improvement hint */}
          <div
            style={{
              width: "100%",
              padding: "6px 8px",
              backgroundColor: "rgba(193, 18, 31, 0.05)",
              borderLeft: "2px solid var(--primary)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                color: "var(--graphite)",
                lineHeight: 1.4,
                display: "block",
              }}
            >
              {nextTier && pointsToNext > 0
                ? `Earn ${pointsToNext} more points to reach ${TIER_LABELS[nextTier]}.`
                : tier === "partner"
                  ? "Maintain your score to keep Partner status."
                  : "You qualify for the next tier — keep it up."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
