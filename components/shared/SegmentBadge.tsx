"use client";

// Merchant-facing creator segment badge. Renders "Community" or "Studio"
// instead of the internal 6-tier label. Accept either an explicit segment or
// a tier string (which is mapped via tierToSegment) so callers can drop it
// in anywhere an existing TierBadge sat.
//
// See lib/services/creator-segment.ts for the mapping rule. Creator-facing
// UI should keep using 6-tier badges — this component is NOT for them.

import {
  type CreatorSegment,
  SEGMENT_BADGE_COLORS,
  tierToSegment,
} from "@/lib/services/creator-segment";

type Props =
  | { segment: CreatorSegment; tier?: never; className?: string }
  | { tier: string; segment?: never; className?: string };

export function SegmentBadge({ segment, tier, className }: Props) {
  const seg: CreatorSegment = segment ?? tierToSegment(tier as string);
  const colors = SEGMENT_BADGE_COLORS[seg];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: colors.fg,
        background: colors.bg,
        borderRadius: "var(--r-sm)",
      }}
    >
      {seg}
    </span>
  );
}
