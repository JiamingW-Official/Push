"use client";

// Merchant-facing creator selector. v6 (2026-04-24): collapsed from 6-tier
// (seed/explorer/operator/proven/closer/partner) to 2-segment (Community /
// Studio) so the merchant view aligns with the v6 CANONICAL §8 narrative.
// The 6-tier scoring system still drives creator dashboards and matching;
// the merchant just picks an audience tier.
//
// Selector emits one of "" | "Community" | "Studio". Callers should expand
// to a tier array via SEGMENT_TIERS before sending to the matching API.

import {
  type CreatorSegment,
  SEGMENT_DESCRIPTIONS,
} from "@/lib/services/creator-segment";

// Legacy export — kept so existing imports of `CreatorTier` from this module
// still type-check. No new code should depend on it; use CreatorSegment
// from @/lib/services/creator-segment instead.
export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

const SEGMENTS: {
  id: "" | CreatorSegment;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: "",
    label: "Any",
    description: "Open to all creators — Push will match by score and fit.",
    color: "var(--tertiary)",
  },
  {
    id: "Community",
    label: "Community",
    description: SEGMENT_DESCRIPTIONS.Community,
    color: "var(--dark)",
  },
  {
    id: "Studio",
    label: "Studio",
    description: SEGMENT_DESCRIPTIONS.Studio,
    color: "var(--accent)",
  },
];

interface TierSelectorProps {
  value: string;
  onChange: (val: "" | CreatorSegment) => void;
  error?: string;
}

export function TierSelector({ value, onChange, error }: TierSelectorProps) {
  return (
    <div>
      <div className="cw-tier-grid">
        {SEGMENTS.map((seg) => {
          const active = value === seg.id;
          return (
            <button
              key={seg.id || "any"}
              type="button"
              className={["cw-tier-card", active ? "cw-tier-card--active" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(seg.id)}
              aria-pressed={active}
              style={
                active
                  ? {
                      borderColor: seg.color,
                      background: "rgba(0,48,73,0.04)",
                    }
                  : undefined
              }
            >
              <span className="cw-tier-dot" style={{ background: seg.color }} />
              <span className="cw-tier-name">{seg.label}</span>
              <span className="cw-tier-meta">{seg.description}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <span className="cw-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
