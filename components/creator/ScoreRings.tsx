"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ScoreDimension = {
  id: string;
  nameEn: string;
  nameCn: string;
  weight: number;
  color: string;
  description: string;
};

const DIMENSIONS: ScoreDimension[] = [
  {
    id: "completion",
    nameEn: "Completion",
    nameCn: "承诺力",
    weight: 0.3,
    color: "#c1121f",
    description: "Finish every campaign you accept",
  },
  {
    id: "reliability",
    nameEn: "Reliability",
    nameCn: "靠谱度",
    weight: 0.2,
    color: "#780000",
    description: "Submit on time, always show up",
  },
  {
    id: "quality",
    nameEn: "Content Quality",
    nameCn: "内容力",
    weight: 0.25,
    color: "#003049",
    description: "Higher merchant ratings = higher score",
  },
  {
    id: "satisfaction",
    nameEn: "Merchant Satisfaction",
    nameCn: "商家心水度",
    weight: 0.15,
    color: "#669bbc",
    description: "Would the merchant hire you again?",
  },
  {
    id: "engagement",
    nameEn: "Engagement",
    nameCn: "影响力",
    weight: 0.1,
    color: "#4a7a99",
    description: "Audience resonance (capped at 10%)",
  },
];

export type DimensionScores = {
  completion: number;
  reliability: number;
  quality: number;
  satisfaction: number;
  engagement: number;
};

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

// Tier metadata
const TIER_META: Record<
  CreatorTier,
  { label: string; icon: string; accentColor: string }
> = {
  seed: { label: "Seed", icon: "", accentColor: "#b8a99a" },
  explorer: { label: "Explorer", icon: "", accentColor: "#8c6239" },
  operator: { label: "Operator", icon: "", accentColor: "#4a5568" },
  proven: { label: "Proven", icon: "", accentColor: "#c9a96e" },
  closer: { label: "Closer", icon: "", accentColor: "#9b111e" },
  partner: { label: "Partner", icon: "", accentColor: "#1a1a2e" },
};

// Variant config
type Variant = "hero" | "dashboard" | "compact";

const VARIANT_CONFIG: Record<
  Variant,
  {
    defaultSize: number;
    ringWidth: number;
    ringGap: number;
    showLegendDefault: boolean;
    centerScaleFactor: number;
    labelFontSize: number;
  }
> = {
  hero: {
    defaultSize: 280,
    ringWidth: 14,
    ringGap: 10,
    showLegendDefault: true,
    centerScaleFactor: 0.22,
    labelFontSize: 13,
  },
  dashboard: {
    defaultSize: 200,
    ringWidth: 10,
    ringGap: 8,
    showLegendDefault: true,
    centerScaleFactor: 0.22,
    labelFontSize: 10,
  },
  compact: {
    defaultSize: 120,
    ringWidth: 6,
    ringGap: 6,
    showLegendDefault: false,
    centerScaleFactor: 0.24,
    labelFontSize: 8,
  },
};

type ScoreRingsProps = {
  scores: DimensionScores;
  totalScore: number;
  size?: number;
  animate?: boolean;
  showLegend?: boolean;
  className?: string;
  // New props
  tier?: CreatorTier;
  variant?: Variant;
};

// ---------------------------------------------------------------------------
// Ring math helpers
// ---------------------------------------------------------------------------

function getRingRadius(
  baseRadius: number,
  index: number,
  ringWidth: number,
  ringGap: number,
): number {
  return baseRadius - index * (ringWidth + ringGap);
}

function getCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

function getDashOffset(circumference: number, score: number): number {
  return circumference * (1 - score / 100);
}

// ---------------------------------------------------------------------------
// Count-up hook
// ---------------------------------------------------------------------------

function useCountUp(target: number, enabled: boolean, duration = 1000): number {
  const [value, setValue] = useState(enabled ? 0 : target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    // Reset and start
    setValue(0);
    startRef.current = null;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    // Small delay so ring animations start together
    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, 80);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, enabled, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Tooltip component
// ---------------------------------------------------------------------------

type TooltipData = {
  dim: ScoreDimension;
  score: number;
  x: number;
  y: number;
};

function RingTooltip({
  data,
  containerSize,
}: {
  data: TooltipData;
  containerSize: number;
}) {
  const { dim, score, x, y } = data;
  // Offset tooltip so it doesn't overlap the ring center
  const tipWidth = 160;
  const tipHeight = 72;
  // Clamp inside container
  const left = Math.min(
    Math.max(x - tipWidth / 2, 0),
    containerSize - tipWidth,
  );
  const top = y > containerSize / 2 ? y - tipHeight - 12 : y + 12;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: tipWidth,
        background: "#003049",
        color: "#f5f2ec",
        padding: "8px 10px",
        pointerEvents: "none",
        zIndex: 10,
        boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
      }}
    >
      {/* Dimension name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 5,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            backgroundColor: dim.color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'CS Genio Mono', monospace",
            fontWeight: 700,
            fontSize: 11,
            color: "#f5f2ec",
          }}
        >
          {dim.nameCn}
        </span>
        <span
          style={{
            fontFamily: "'CS Genio Mono', monospace",
            fontSize: 9,
            color: "rgba(245,242,236,0.55)",
          }}
        >
          {dim.nameEn}
        </span>
      </div>
      {/* Score + weight */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: "'Darky', serif",
            fontWeight: 900,
            fontSize: 18,
            color: dim.color === "#003049" ? "#669bbc" : dim.color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontFamily: "'CS Genio Mono', monospace",
            fontSize: 9,
            color: "rgba(245,242,236,0.55)",
            alignSelf: "flex-end",
          }}
        >
          weight {Math.round(dim.weight * 100)}%
        </span>
      </div>
      {/* Description */}
      <div
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: 9,
          color: "rgba(245,242,236,0.70)",
          lineHeight: 1.4,
        }}
      >
        {dim.description}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScoreRings({
  scores,
  totalScore,
  size,
  animate = true,
  showLegend,
  className,
  tier,
  variant = "dashboard",
}: ScoreRingsProps) {
  const cfg = VARIANT_CONFIG[variant];
  const resolvedSize = size ?? cfg.defaultSize;
  const resolvedShowLegend = showLegend ?? cfg.showLegendDefault;
  const isCompact = variant === "compact";

  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Count-up for center score
  const displayScore = useCountUp(Math.round(totalScore), animate && mounted);

  useEffect(() => {
    if (!animate) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, [animate]);

  const cx = resolvedSize / 2;
  const cy = resolvedSize / 2;
  const baseRadius = resolvedSize / 2 - 12;

  const dimensionScoreMap: Record<string, number> = {
    completion: scores.completion,
    reliability: scores.reliability,
    quality: scores.quality,
    satisfaction: scores.satisfaction,
    engagement: scores.engagement,
  };

  // More dramatic stagger delays
  const staggerDelays = [0, 200, 400, 600, 800];

  // Tier accent for outermost ring (index 0 = completion)
  const tierAccentColor = tier ? TIER_META[tier].accentColor : null;

  const handleRingMouseEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    dim: ScoreDimension,
    score: number,
  ) => {
    const svgRect = (e.currentTarget.closest(
      "div[data-rings-container]",
    ) as HTMLElement)!.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    setTooltip({ dim, score, x: mouseX, y: mouseY });
  };

  const handleRingMouseMove = (e: React.MouseEvent<SVGCircleElement>) => {
    if (!tooltip) return;
    const svgRect = (e.currentTarget.closest(
      "div[data-rings-container]",
    ) as HTMLElement)!.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    setTooltip((prev) => (prev ? { ...prev, x: mouseX, y: mouseY } : null));
  };

  const handleRingMouseLeave = () => setTooltip(null);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isCompact ? 0 : 24,
        fontFamily: "'CS Genio Mono', monospace",
      }}
    >
      {/* SVG rings + center */}
      <div
        data-rings-container
        style={{
          position: "relative",
          width: resolvedSize,
          height: resolvedSize,
        }}
      >
        <svg
          width={resolvedSize}
          height={resolvedSize}
          viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
          style={{ transform: "rotate(-90deg)", display: "block" }}
        >
          {DIMENSIONS.map((dim, i) => {
            const radius = getRingRadius(
              baseRadius,
              i,
              cfg.ringWidth,
              cfg.ringGap,
            );
            const circumference = getCircumference(radius);
            const score = dimensionScoreMap[dim.id] ?? 0;
            const targetOffset = getDashOffset(circumference, score);
            const currentOffset = mounted ? targetOffset : circumference;
            const transitionDelay = animate ? `${staggerDelays[i]}ms` : "0ms";
            // Outermost ring (i === 0) gets tier accent if tier provided
            const ringColor =
              i === 0 && tierAccentColor ? tierAccentColor : dim.color;

            return (
              <g key={dim.id}>
                {/* Track ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(0,48,73,0.08)"
                  strokeWidth={cfg.ringWidth}
                />
                {/* Invisible wider hit area for easier hover */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={cfg.ringWidth + 8}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleRingMouseEnter(e, dim, score)}
                  onMouseMove={handleRingMouseMove}
                  onMouseLeave={handleRingMouseLeave}
                />
                {/* Fill ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={cfg.ringWidth}
                  strokeLinecap="butt"
                  strokeDasharray={circumference}
                  strokeDashoffset={currentOffset}
                  style={{
                    transition: mounted
                      ? `stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1) ${transitionDelay}`
                      : "none",
                    pointerEvents: "none",
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Center label (absolute, on top of SVG) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* Score number with count-up */}
          <span
            style={{
              fontFamily: "'Darky', serif",
              fontWeight: 900,
              fontSize: resolvedSize * cfg.centerScaleFactor,
              lineHeight: 1,
              color: "#003049",
              letterSpacing: "-0.02em",
            }}
          >
            {displayScore}
          </span>

          {/* "Push Score" sub-label OR tier info */}
          {tier ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                marginTop: 4,
              }}
            >
              {!isCompact && (
                <span
                  style={{
                    fontSize: resolvedSize * 0.07,
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {TIER_META[tier].icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "'CS Genio Mono', monospace",
                  fontSize: isCompact ? 7 : cfg.labelFontSize,
                  fontWeight: 700,
                  color: TIER_META[tier].accentColor,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {TIER_META[tier].label}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontFamily: "'CS Genio Mono', monospace",
                fontSize: isCompact ? 7 : cfg.labelFontSize,
                fontWeight: 600,
                color: "#669bbc",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              Push Score
            </span>
          )}
        </div>

        {/* Tooltip */}
        {tooltip && <RingTooltip data={tooltip} containerSize={resolvedSize} />}
      </div>

      {/* Legend — hidden in compact variant */}
      {resolvedShowLegend && !isCompact && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minWidth: variant === "hero" ? 320 : 260,
          }}
        >
          {DIMENSIONS.map((dim, idx) => {
            const score = dimensionScoreMap[dim.id] ?? 0;
            const weightedContribution = (score * dim.weight) / 100;
            // Outermost ring accent override in legend swatch too
            const swatchColor =
              idx === 0 && tierAccentColor ? tierAccentColor : dim.color;

            return (
              <div
                key={dim.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "12px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Color swatch */}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: swatchColor,
                    flexShrink: 0,
                  }}
                />

                {/* Name + progress bar */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                  >
                    <span
                      style={{
                        fontFamily: "'CS Genio Mono', monospace",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#003049",
                      }}
                    >
                      {dim.nameCn}
                    </span>
                    <span
                      style={{
                        fontFamily: "'CS Genio Mono', monospace",
                        fontSize: 10,
                        color: "rgba(0,48,73,0.45)",
                      }}
                    >
                      {dim.nameEn}
                    </span>
                    <span
                      style={{
                        fontFamily: "'CS Genio Mono', monospace",
                        fontSize: 9,
                        color: "rgba(0,48,73,0.30)",
                        marginLeft: "auto",
                      }}
                    >
                      ({Math.round(dim.weight * 100)}%)
                    </span>
                  </div>

                  {/* Progress bar — shows weighted contribution */}
                  <div
                    style={{
                      height: 3,
                      backgroundColor: "rgba(0,48,73,0.08)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: swatchColor,
                        width: mounted
                          ? `${weightedContribution * 100}%`
                          : "0%",
                        transition: mounted
                          ? `width 1s cubic-bezier(0.22,1,0.36,1) ${staggerDelays[idx]}ms`
                          : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Score value */}
                <span
                  style={{
                    fontFamily: "'CS Genio Mono', monospace",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#003049",
                    whiteSpace: "nowrap",
                    minWidth: 48,
                    textAlign: "right",
                  }}
                >
                  {score}/100
                </span>
              </div>
            );
          })}

          {/* Improvement hint — show lowest dimension */}
          {(() => {
            const lowest = DIMENSIONS.reduce((a, b) =>
              dimensionScoreMap[a.id] <= dimensionScoreMap[b.id] ? a : b,
            );
            return (
              <div
                style={{
                  marginTop: 4,
                  padding: "8px 10px",
                  backgroundColor: "rgba(193,18,31,0.05)",
                  borderLeft: `2px solid #c1121f`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'CS Genio Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#c1121f",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  提升建议 · {lowest.nameCn}
                </span>
                <span
                  style={{
                    fontFamily: "'CS Genio Mono', monospace",
                    fontSize: 10,
                    color: "rgba(0,48,73,0.65)",
                  }}
                >
                  {lowest.description}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
