import { TIERS } from "@/lib/tier-config";
import type { CreatorTier as LibCreatorTier } from "@/lib/tier-config";
import { TierBadge, TIER_CONFIG } from "./TierBadge";

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

// Map dashboard lowercase keys to lib Title-case keys
const TIER_KEY_MAP: Record<CreatorTier, LibCreatorTier> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

export type CampaignDifficulty = "Standard" | "Premium" | "Complex";

export type Campaign = {
  id: string;
  title: string;
  business_name: string;
  business_address?: string;
  payout: number;
  spots_remaining: number;
  spots_total: number;
  deadline?: string | null;
  category?: string;
  image?: string;
  tier_required: CreatorTier;
  requirements?: string[];
  description?: string;
  difficulty?: CampaignDifficulty;
  commission_enabled?: boolean;
};

export type CreatorCampaignCardProps = {
  campaign: Campaign;
  creatorTier?: CreatorTier;
  active?: boolean;
  applied?: boolean;
  showCommission?: boolean;
  onApply?: (id: string) => void;
  onCardClick?: (id: string) => void;
  "data-campaign-id"?: string;
};

const TIER_ORDER: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 1,
  operator: 2,
  proven: 3,
  closer: 4,
  partner: 5,
};

const CATEGORY_BG: Record<string, string> = {
  Food: "rgba(193,18,31,0.12)",
  Coffee: "rgba(102,155,188,0.15)",
  Beauty: "rgba(120,0,0,0.08)",
  Retail: "rgba(10,10,10,0.10)",
  Fitness: "rgba(10,10,10,0.08)",
};

const CATEGORY_COLOR: Record<string, string> = {
  Food: "var(--brand-red)",
  Coffee: "var(--ink)",
  Beauty: "var(--accent)",
  Retail: "var(--ink)",
  Fitness: "var(--ink)",
};

const DIFFICULTY_LABEL: Record<CampaignDifficulty, string> = {
  Standard: "",
  Premium: "Premium 1.3x",
  Complex: "Complex 1.6x",
};

function formatDeadline(deadline: string): string {
  try {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return deadline;
  }
}

function formatPayout(
  campaign: Campaign,
  creatorTier: CreatorTier | undefined,
  showCommission: boolean,
): string {
  if (campaign.payout === 0) return "Free product";
  const base = `$${campaign.payout}`;
  if (!showCommission || !campaign.commission_enabled || !creatorTier)
    return base;
  const libTier = TIER_KEY_MAP[creatorTier];
  const pct = TIERS[libTier].commissionPct;
  if (pct === 0) return base;
  return `${base} + ${pct}% commission`;
}

// Spots bar urgency color
function spotsColor(remaining: number, total: number): string {
  if (total === 0) return "var(--tertiary, #669bbc)";
  const pct = remaining / total;
  if (pct > 0.5) return "var(--tertiary, #669bbc)";
  if (pct > 0.2) return "var(--dark, #003049)";
  return "var(--primary, #c1121f)";
}

export function CreatorCampaignCard({
  campaign,
  creatorTier,
  active,
  applied = false,
  showCommission = false,
  onApply,
  onCardClick,
  "data-campaign-id": dataCampaignId,
}: CreatorCampaignCardProps) {
  const isEligible = creatorTier
    ? TIER_ORDER[creatorTier] >= TIER_ORDER[campaign.tier_required]
    : true;

  const thumbBg = campaign.image
    ? undefined
    : (CATEGORY_BG[campaign.category ?? ""] ?? "rgba(10,10,10,0.07)");

  const tierLabel =
    TIER_CONFIG[campaign.tier_required]?.label ?? campaign.tier_required;

  const payoutLabel = formatPayout(campaign, creatorTier, showCommission);

  const spotsBarPct =
    campaign.spots_total > 0
      ? Math.max(
          0,
          Math.min(1, campaign.spots_remaining / campaign.spots_total),
        )
      : 0;
  const barColor = spotsColor(campaign.spots_remaining, campaign.spots_total);

  const difficultyLabel =
    campaign.difficulty && campaign.difficulty !== "Standard"
      ? DIFFICULTY_LABEL[campaign.difficulty]
      : null;

  function handleCardClick() {
    onCardClick?.(campaign.id);
  }

  function handleApply(e: React.MouseEvent) {
    e.stopPropagation();
    if (!applied && isEligible) {
      onApply?.(campaign.id);
    }
  }

  // --- Apply button state ---
  let applyBg = "var(--brand-red)";
  let applyColor = "var(--surface)";
  let applyLabel = "Apply";
  let applyDisabled = false;

  if (applied) {
    applyBg = "var(--accent-blue)";
    applyColor = "var(--surface)";
    applyLabel = "Applied";
    applyDisabled = true;
  } else if (!isEligible) {
    applyBg = "rgba(0,0,0,0.08)";
    applyColor = "rgba(10,10,10,0.35)";
    applyLabel = "Locked";
    applyDisabled = true;
  }

  return (
    <div
      data-campaign-id={dataCampaignId ?? campaign.id}
      onClick={handleCardClick}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--surface)",
        border: active
          ? "2px solid var(--brand-red)"
          : "1.5px solid rgba(10,10,10,0.14)",
        borderRadius: 0,
        overflow: "hidden",
        cursor: onCardClick ? "pointer" : "default",
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
        boxSizing: "border-box",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(10,10,10,0.30)";
          el.style.boxShadow = "0 4px 16px rgba(10,10,10,0.10)";
          el.style.transform = "translateY(-4px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(10,10,10,0.14)";
          el.style.boxShadow = "none";
          el.style.transform = "translateY(0)";
        }
      }}
    >
      {/* ── Thumb area ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "140px",
          aspectRatio: "4 / 3",
          backgroundColor: thumbBg,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {campaign.image && (
          <img
            src={campaign.image}
            alt={campaign.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* Category label (center, when no image) */}
        {!campaign.image && campaign.category && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"CS Genio Mono", monospace',
              fontSize: "11px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,0.35)",
              userSelect: "none",
            }}
          >
            {campaign.category}
          </span>
        )}

        {/* Top-left: tier requirement badge */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <TierBadge
            tier={campaign.tier_required}
            size="sm"
            variant="filled"
            showIcon={false}
          />
          {/* Difficulty badge (shown below tier badge if present) */}
          {difficultyLabel && (
            <span
              style={{
                display: "inline-block",
                padding: "2px 6px",
                backgroundColor: "var(--accent)",
                color: "var(--surface)",
                fontFamily: '"CS Genio Mono", monospace',
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: 0,
                lineHeight: 1.3,
              }}
            >
              {difficultyLabel}
            </span>
          )}
        </div>

        {/* Top-right: payout badge */}
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "4px 10px",
            backgroundColor: "var(--ink)",
            color: "var(--surface)",
            fontFamily: '"CS Genio Mono", monospace',
            fontSize: campaign.payout === 0 ? "11px" : "13px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            borderRadius: 0,
            lineHeight: 1.2,
            maxWidth: "180px",
            textAlign: "right",
          }}
        >
          {payoutLabel}
        </span>

        {/* Lock overlay when ineligible */}
        {!isEligible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(245,242,236,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="28"
              height="32"
              viewBox="0 0 11 13"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="1"
                y="5.5"
                width="9"
                height="7"
                rx="0"
                stroke="var(--brand-red)"
                strokeWidth="1.4"
              />
              <path
                d="M3 5.5V3.5a2.5 2.5 0 0 1 5 0v2"
                stroke="var(--brand-red)"
                strokeWidth="1.4"
                strokeLinecap="square"
              />
            </svg>
          </div>
        )}
      </div>

      {/* ── Content area ── */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {/* Business name eyebrow + category chip row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: '"CS Genio Mono", monospace',
              fontSize: "10px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--accent-blue)",
              lineHeight: 1,
            }}
          >
            {campaign.business_name}
          </span>

          {/* Category badge */}
          {campaign.category && (
            <span
              style={{
                padding: "2px 6px",
                backgroundColor:
                  CATEGORY_BG[campaign.category] ?? "rgba(10,10,10,0.07)",
                color: CATEGORY_COLOR[campaign.category] ?? "var(--ink)",
                fontFamily: '"CS Genio Mono", monospace',
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                borderRadius: 0,
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              {campaign.category}
            </span>
          )}
        </div>

        {/* Campaign title */}
        <h3
          style={{
            margin: 0,
            fontFamily: '"Darky", sans-serif',
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: 1.3,
            color: "var(--ink)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {campaign.title}
        </h3>

        {/* Tier eligibility row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "18px",
          }}
        >
          {isEligible ? (
            <>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--success)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: '"CS Genio Mono", monospace',
                  fontSize: "11px",
                  color: "var(--success)",
                  letterSpacing: "0.04em",
                }}
              >
                You qualify
              </span>
            </>
          ) : (
            <>
              <svg
                width="11"
                height="13"
                viewBox="0 0 11 13"
                fill="none"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="5.5"
                  width="9"
                  height="7"
                  rx="0"
                  stroke="var(--brand-red)"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 5.5V3.5a2.5 2.5 0 0 1 5 0v2"
                  stroke="var(--brand-red)"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                />
              </svg>
              <span
                style={{
                  fontFamily: '"CS Genio Mono", monospace',
                  fontSize: "11px",
                  color: "var(--brand-red)",
                  letterSpacing: "0.04em",
                }}
              >
                Unlock at {tierLabel}
              </span>
            </>
          )}
        </div>

        {/* Spots bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              width: "100%",
              height: "3px",
              backgroundColor: "rgba(10,10,10,0.10)",
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${spotsBarPct * 100}%`,
                height: "100%",
                backgroundColor: barColor,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: '"CS Genio Mono", monospace',
              fontSize: "10px",
              color: barColor,
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {campaign.spots_remaining} / {campaign.spots_total} spots left
          </span>
        </div>

        {/* Bottom row: deadline + apply button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          {/* Deadline */}
          <span
            style={{
              fontFamily: '"CS Genio Mono", monospace',
              fontSize: "11px",
              color: "rgba(10,10,10,0.50)",
              letterSpacing: "0.04em",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {campaign.deadline
              ? `Until ${formatDeadline(campaign.deadline)}`
              : "\u00A0"}
          </span>

          {/* Apply button */}
          <button
            type="button"
            disabled={applyDisabled}
            onClick={handleApply}
            style={{
              padding: "6px 16px",
              backgroundColor: applyBg,
              color: applyColor,
              border: "none",
              borderRadius: 0,
              fontFamily: '"CS Genio Mono", monospace',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: applyDisabled ? "default" : "pointer",
              lineHeight: 1.3,
              transition: "opacity 0.12s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!applyDisabled)
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.82";
            }}
            onMouseLeave={(e) => {
              if (!applyDisabled)
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
