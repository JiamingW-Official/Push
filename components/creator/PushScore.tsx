import React, { useEffect, useRef, useState } from "react";

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

const TIER_COLORS: Record<CreatorTier, string> = {
  seed: "#b8a99a",
  explorer: "#8c6239",
  operator: "#4a5568",
  proven: "#c9a96e",
  closer: "#9b111e",
  partner: "#1a1a2e",
};

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

// Points required to reach each tier (lower bound of next tier)
const TIER_THRESHOLDS: Record<CreatorTier, { min: number; max: number }> = {
  seed: { min: 0, max: 39 },
  explorer: { min: 40, max: 54 },
  operator: { min: 55, max: 69 },
  proven: { min: 70, max: 79 },
  closer: { min: 80, max: 89 },
  partner: { min: 90, max: 100 },
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
    fontFamily: '"CS Genio Mono", monospace',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#003049",
    textTransform: "uppercase",
    lineHeight: 1,
  };

  const svgStyle: React.CSSProperties = {
    display: "block",
    overflow: "visible",
  };

  const trackStyle: React.CSSProperties = {
    fill: "none",
    stroke: "rgba(0,48,73,0.12)",
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
    fontFamily: '"Darky", serif',
    fontWeight: 700,
    // Use tier color for the score number
    fontSize: size * 0.26,
    fill: color,
    dominantBaseline: "middle",
    textAnchor: "middle",
    letterSpacing: "-0.02em",
  };

  const tierTextStyle: React.CSSProperties = {
    fontFamily: '"CS Genio Mono", monospace',
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              backgroundColor: color,
              color: "#f5f2ec",
            }}
          >
            <span
              style={{
                fontFamily: '"CS Genio Mono", monospace',
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
                backgroundColor: "rgba(0,48,73,0.10)",
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
                    fontFamily: '"CS Genio Mono", monospace',
                    fontSize: 9,
                    color: "rgba(0,48,73,0.45)",
                  }}
                >
                  {TIER_LABELS[tier]}
                </span>
                <span
                  style={{
                    fontFamily: '"CS Genio Mono", monospace',
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
                    fontFamily: '"CS Genio Mono", monospace',
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
              backgroundColor: "rgba(193,18,31,0.05)",
              borderLeft: "2px solid #c1121f",
            }}
          >
            <span
              style={{
                fontFamily: '"CS Genio Mono", monospace',
                fontSize: 9,
                color: "rgba(0,48,73,0.65)",
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
