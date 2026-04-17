/** Creator tier badge with per-tier color coding, sharp corners, CS Genio Mono. */
"use client";

type Tier = "seed" | "explorer" | "operator" | "proven" | "closer" | "partner";
type Size = "sm" | "md" | "lg";

interface TierBadgeProps {
  tier: Tier;
  size?: Size;
}

const TIER_STYLES: Record<Tier, { bg: string; color: string; border: string }> =
  {
    seed: {
      bg: "rgba(0, 48, 73, 0.06)",
      color: "var(--graphite)",
      border: "rgba(0, 48, 73, 0.18)",
    },
    explorer: {
      bg: "rgba(102, 155, 188, 0.12)",
      color: "var(--tertiary)",
      border: "rgba(102, 155, 188, 0.35)",
    },
    operator: {
      bg: "rgba(193, 18, 31, 0.08)",
      color: "var(--primary)",
      border: "rgba(193, 18, 31, 0.22)",
    },
    proven: {
      bg: "rgba(0, 48, 73, 0.10)",
      color: "var(--dark)",
      border: "rgba(0, 48, 73, 0.28)",
    },
    closer: {
      bg: "rgba(120, 0, 0, 0.08)",
      color: "var(--accent)",
      border: "rgba(120, 0, 0, 0.25)",
    },
    partner: {
      bg: "var(--champagne-light)",
      color: "#8a6730",
      border: "var(--champagne-border)",
    },
  };

const SIZE_STYLES: Record<
  Size,
  { fontSize: string; padding: string; letterSpacing: string }
> = {
  sm: { fontSize: "10px", padding: "2px 6px", letterSpacing: "0.08em" },
  md: {
    fontSize: "var(--text-eyebrow)",
    padding: "4px 10px",
    letterSpacing: "0.08em",
  },
  lg: {
    fontSize: "var(--text-caption)",
    padding: "6px 14px",
    letterSpacing: "0.07em",
  },
};

export function TierBadge({ tier, size = "md" }: TierBadgeProps) {
  const ts = TIER_STYLES[tier];
  const ss = SIZE_STYLES[size];

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        textTransform: "uppercase",
        borderRadius: 0,
        border: `1px solid ${ts.border}`,
        background: ts.bg,
        color: ts.color,
        fontSize: ss.fontSize,
        padding: ss.padding,
        letterSpacing: ss.letterSpacing,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {tier}
    </span>
  );
}
