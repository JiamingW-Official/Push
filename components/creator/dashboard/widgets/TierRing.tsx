"use client";

/* Repo target: components/creator/dashboard/widgets/TierRing.tsx
   3×1 — SVG arc + tier name + pts to next.
   Shown for Seed/Explorer/Operator/Proven; replaced by PipelineHealth at Closer+. */

import Link from "next/link";
import {
  getTierProgress,
  TIER_COLORS,
  TIER_LABELS,
} from "@/lib/creator/widget-helpers";
import type { Creator } from "../types";

const RING_R = 38;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 238.76

export interface TierRingProps {
  creator: Creator;
  className?: string;
}

export function TierRing({ creator, className = "" }: TierRingProps) {
  const tierColor = TIER_COLORS[creator.tier];
  const tierLabel = TIER_LABELS[creator.tier];
  const progress = getTierProgress(creator.push_score, creator.tier);
  const offset = RING_CIRC - (RING_CIRC * progress.pct) / 100;

  return (
    <Link
      href="/creator/profile"
      className={`dh-card is-clickable ${className}`.trim()}
    >
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">
          TIER · {tierLabel.toUpperCase()}
        </span>
        <span className="dh-card__view-all">→</span>
      </div>

      <div className="dh-tier">
        <svg
          className="dh-tier__svg"
          viewBox="0 0 88 88"
          aria-label={`Tier progress ${progress.pct}%`}
        >
          <defs>
            <radialGradient
              id={`tier-halo-${creator.tier}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={tierColor} stopOpacity="0.18" />
              <stop offset="60%" stopColor={tierColor} stopOpacity="0.04" />
              <stop offset="100%" stopColor={tierColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft halo behind the ring */}
          <circle
            cx="44"
            cy="44"
            r="42"
            fill={`url(#tier-halo-${creator.tier})`}
          />

          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={RING_R}
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="44"
            cy="44"
            r={RING_R}
            fill="none"
            stroke={tierColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "44px 44px",
              transition:
                "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          <text
            x="44"
            y="44"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Darky, Inter, sans-serif"
            fontSize="22"
            fontWeight="800"
            fill="var(--ink)"
            letterSpacing="-0.02em"
          >
            {creator.push_score}
          </text>
        </svg>

        <div className="dh-tier__info">
          <span className="dh-tier__name" style={{ color: tierColor }}>
            {tierLabel}
          </span>
          <span className="dh-tier__next">
            {progress.nextLabel
              ? `${progress.pointsToNext} PTS → ${progress.nextLabel}`
              : "MAX TIER"}
          </span>
        </div>
      </div>
    </Link>
  );
}
