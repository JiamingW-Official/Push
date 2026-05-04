import { TIERS } from "@/lib/tier-config";
import type { CreatorTier as LibCreatorTier } from "@/lib/tier-config";

// Local CreatorTier keeps backward-compatible lowercase keys used throughout
// the creator dashboard. The lib uses Title-case; we normalise on access.
export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

// Map lowercase dashboard keys → lib Title-case keys
const TIER_KEY_MAP: Record<CreatorTier, LibCreatorTier> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

// Re-export a TIER_CONFIG compatible shape so existing callers (e.g.
// CreatorCampaignCard) keep working without changes.
export const TIER_CONFIG: Record<
  CreatorTier,
  { icon: string; label: string; color: string; description: string }
> = Object.fromEntries(
  (Object.keys(TIER_KEY_MAP) as CreatorTier[]).map((k) => {
    const t = TIERS[TIER_KEY_MAP[k]];
    return [
      k,
      {
        icon: t.icon,
        label: t.label,
        color: t.color,
        description: t.description,
      },
    ];
  }),
) as Record<
  CreatorTier,
  { icon: string; label: string; color: string; description: string }
>;

// Helper: build the key benefit line shown in "xl" size
function buildBenefitLine(tier: CreatorTier): string {
  const t = TIERS[TIER_KEY_MAP[tier]];
  if (t.baseRate === 0) return "Free product campaigns";
  if (t.commissionPct === 0) return `$${t.baseRate}/campaign`;
  return `$${t.baseRate}/campaign + ${t.commissionPct}% commission`;
}

type TierBadgeProps = {
  tier: CreatorTier;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showIcon?: boolean;
  variant?: "filled" | "outlined" | "subtle";
  className?: string;
};

export function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  showIcon = true,
  variant = "filled",
  className,
}: TierBadgeProps) {
  const libTier = TIER_KEY_MAP[tier];
  const config = TIERS[libTier];
  const tierCssKey = tier.toLowerCase(); // always lowercase for CSS classes

  // CSS classes that connect to tier-identity.css
  const badgeCssClass = `tier-badge tier-badge--${tierCssKey}`;
  const combinedClass = className
    ? `${badgeCssClass} ${className}`
    : badgeCssClass;

  // ── XL size ────────────────────────────────────────────────────────────────
  if (size === "xl") {
    const xlBorderColor = variant === "outlined" ? config.color : config.accent;

    return (
      <div
        className={`tier--${tierCssKey}${className ? ` ${className}` : ""}`}
        role="img"
        aria-label={`Creator tier ${config.label}`}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          padding: "16px 24px",
          backgroundColor:
            variant === "filled"
              ? config.bg
              : variant === "subtle"
                ? `${config.bg}cc`
                : "transparent",
          border: `2px solid ${xlBorderColor}`,
          // § 4.2 — tier badge uses --r-sm (8px); border-radius:0 is reserved for
          // full-bleed Photo Card hero / Editorial Hero Tile / image-collage card only.
          borderRadius: "var(--r-sm)",
          fontFamily: "var(--font-body)",
        }}
      >
        {showIcon && (
          <span style={{ fontSize: "32px", lineHeight: 1 }}>{config.icon}</span>
        )}
        {showLabel && (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "20px",
              color: config.color,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {config.label}
          </span>
        )}
        <span
          style={{
            // § 3.1 min font 12px (Caption 10px is the only documented exception)
            fontSize: "12px",
            color: config.color,
            opacity: 0.75,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
          }}
        >
          {config.description}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: config.accent,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
          }}
        >
          {buildBenefitLine(tier)}
        </span>
      </div>
    );
  }

  // ── LG size ────────────────────────────────────────────────────────────────
  if (size === "lg") {
    const lgBg =
      variant === "filled"
        ? config.bg
        : variant === "subtle"
          ? `${config.bg}cc`
          : "transparent";
    const lgBorderColor = variant === "outlined" ? config.color : config.accent;

    return (
      <div
        className={`tier--${tierCssKey}${className ? ` ${className}` : ""}`}
        role="img"
        aria-label={`Creator tier ${config.label}`}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          padding: "16px 16px",
          backgroundColor: lgBg,
          border: `2px solid ${lgBorderColor}`,
          // § 4.2 — tier badge uses --r-sm (8px), never 0.
          borderRadius: "var(--r-sm)",
          fontFamily: "var(--font-body)",
        }}
      >
        {showIcon && (
          <span style={{ fontSize: "24px", lineHeight: 1 }}>{config.icon}</span>
        )}
        {showLabel && (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: config.color,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {config.label}
          </span>
        )}
        <span
          style={{
            // § 3.1 min font 12px floor.
            fontSize: "12px",
            color: config.color,
            opacity: 0.8,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
          }}
        >
          {config.description}
        </span>
      </div>
    );
  }

  // ── SM / MD sizes ──────────────────────────────────────────────────────────
  const isSm = size === "sm";

  // Variant-based style overrides applied on top of tier-identity.css base
  let variantStyle: React.CSSProperties = {};
  if (variant === "filled") {
    // filled: solid bg in tier color, light text (overrides CSS defaults)
    variantStyle = {
      backgroundColor: config.color,
      color: "var(--surface)",
      borderLeft: "none",
    };
  } else if (variant === "outlined") {
    // outlined: transparent bg, colored border all around, colored text
    variantStyle = {
      backgroundColor: "transparent",
      color: config.color,
      border: `1.5px solid ${config.color}`,
    };
  }
  // variant === "subtle" uses tier-identity.css defaults (bg + colored text + left border)

  return (
    <span
      className={combinedClass}
      role="img"
      aria-label={`Creator tier ${config.label}`}
      style={{
        gap: isSm ? "4px" : "8px",
        // § 5 — 8px grid (4px half-grid allowed for chip gaps).
        padding: isSm ? "4px 8px" : "4px 8px",
        // § 3.1 min font 12px floor; tier-identity.css default 10px is overridden.
        fontSize: "12px",
        letterSpacing: isSm ? "0.08em" : "0.06em",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        // § 4.2 — tier badge uses --r-sm (8px), never 0.
        borderRadius: "var(--r-sm)",
        ...variantStyle,
      }}
    >
      {showIcon && (
        <span style={{ fontSize: "12px", lineHeight: 1 }}>{config.icon}</span>
      )}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
