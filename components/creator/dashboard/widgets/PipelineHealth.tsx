"use client";

/* Repo target: components/creator/dashboard/widgets/PipelineHealth.tsx
   3×1 — runway gauge for Closer+ creators. State-aware substitute for TierRing. */

import { getPipelineRunway } from "@/lib/creator/widget-helpers";
import type { Application } from "../types";

export interface PipelineHealthProps {
  applications: Application[];
  className?: string;
}

/* 6 segments map to the 18-day max runway window (3 days each). */
const SEGMENT_COUNT = 6;
const HEALTH_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "AT RISK",
  medium: "STEADY",
  high: "STRONG",
};

export function PipelineHealth({
  applications,
  className = "",
}: PipelineHealthProps) {
  const active = applications.filter((a) => a.status === "accepted");
  const { days, health, hint } = getPipelineRunway(active);

  const filledSegs = Math.max(
    0,
    Math.min(SEGMENT_COUNT, Math.round((days / 18) * SEGMENT_COUNT)),
  );

  return (
    <div className={`dh-card ${className}`.trim()}>
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">PIPELINE · RUNWAY</span>
        <span className="dh-gauge__chip" data-health={health}>
          {HEALTH_LABEL[health]}
        </span>
      </div>

      <div className="dh-gauge">
        <div className="dh-gauge__top">
          <span className="dh-gauge__num">
            {days}
            <em>{days === 1 ? "DAY" : "DAYS"}</em>
          </span>
        </div>

        <div
          className="dh-gauge__segments"
          aria-label={`${days} days of runway, ${health} health`}
        >
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <span
              key={i}
              className={
                "dh-gauge__seg" +
                (i < filledSegs ? ` dh-gauge__seg--${health}` : "")
              }
            />
          ))}
        </div>

        <span className="dh-gauge__hint">{hint}</span>
      </div>
    </div>
  );
}
