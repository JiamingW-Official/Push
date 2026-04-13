"use client";

import "./tier-benefits.css";
import type { CreatorTier } from "./TierBadge";

// ── Tier ordering ────────────────────────────────────────────
const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

// ── Score thresholds (min score to reach each tier) ──────────
const TIER_THRESHOLDS: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 200,
  operator: 500,
  proven: 1000,
  closer: 2000,
  partner: 4000,
};

// ── Tier colors ──────────────────────────────────────────────
const TIER_COLORS: Record<
  CreatorTier,
  { color: string; bg: string; accent: string }
> = {
  seed: { color: "#b8a99a", bg: "#f7f7f7", accent: "#718096" },
  explorer: { color: "#8c6239", bg: "#eef5fb", accent: "#5a3e22" },
  operator: { color: "#4a5568", bg: "#f2f4f5", accent: "#2d3748" },
  proven: { color: "#c9a96e", bg: "#f5f2ec", accent: "#9b7a3e" },
  closer: { color: "#9b111e", bg: "#f5f2ec", accent: "#6b0a14" },
  partner: { color: "#1a1a2e", bg: "#fdf8ee", accent: "#0a0a1a" },
};

// ── Tier icons & names ───────────────────────────────────────
const TIER_META: Record<CreatorTier, { icon: string; label: string }> = {
  seed: { icon: "", label: "Seed" },
  explorer: { icon: "", label: "Explorer" },
  operator: { icon: "", label: "Operator" },
  proven: { icon: "", label: "Proven" },
  closer: { icon: "", label: "Closer" },
  partner: { icon: "", label: "Partner" },
};

// ── Benefit lists per tier ───────────────────────────────────
const TIER_BENEFITS: Record<CreatorTier, string[]> = {
  seed: ["Free product campaigns", "Build your portfolio", "1 active campaign"],
  explorer: [
    "$12 base per campaign",
    "2 active campaigns",
    "Priority matching",
  ],
  operator: [
    "$20 base + 3% commission",
    "$15 milestone bonus",
    "3 active campaigns",
    "Campaign feedback form",
  ],
  proven: [
    "$32 base + 5% commission",
    "$30 milestone bonus",
    "4 active campaigns",
    "Merchant preference setting",
    "Content review sessions",
  ],
  closer: [
    "$55 base + 7% commission",
    "$50 milestone bonus",
    "5 active campaigns",
    "Dedicated account manager",
    "Premium brand access",
  ],
  partner: [
    "$100 base + 10% commission",
    "$80 milestone bonus",
    "6 active campaigns",
    "Advisory access",
    "Custom campaign terms",
  ],
};

// ── Stat summaries per tier ──────────────────────────────────
type TierStats = {
  baseRate: string;
  commission: string | null; // null = locked
  milestoneBonus: string | null; // null = locked
  maxCampaigns: number;
};

const TIER_STATS: Record<CreatorTier, TierStats> = {
  seed: {
    baseRate: "Free product",
    commission: null,
    milestoneBonus: null,
    maxCampaigns: 1,
  },
  explorer: {
    baseRate: "$12/campaign",
    commission: null,
    milestoneBonus: null,
    maxCampaigns: 2,
  },
  operator: {
    baseRate: "$20/campaign",
    commission: "3% per verified sale",
    milestoneBonus: "$15 at 30 txns/mo",
    maxCampaigns: 3,
  },
  proven: {
    baseRate: "$32/campaign",
    commission: "5% per verified sale",
    milestoneBonus: "$30 at 30 txns/mo",
    maxCampaigns: 4,
  },
  closer: {
    baseRate: "$55/campaign",
    commission: "7% per verified sale",
    milestoneBonus: "$50 at 30 txns/mo",
    maxCampaigns: 5,
  },
  partner: {
    baseRate: "$100/campaign",
    commission: "10% per verified sale",
    milestoneBonus: "$80 at 30 txns/mo",
    maxCampaigns: 6,
  },
};

// ── Props ────────────────────────────────────────────────────
export type TierBenefitsPanelProps = {
  currentTier: CreatorTier;
  currentScore: number;
  className?: string;
  variant?: "full" | "compact";
};

// ── Helpers ──────────────────────────────────────────────────
function getNextTier(tier: CreatorTier): CreatorTier | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
}

function pointsToNextTier(
  currentTier: CreatorTier,
  currentScore: number,
): number | null {
  const next = getNextTier(currentTier);
  if (!next) return null;
  return Math.max(0, TIER_THRESHOLDS[next] - currentScore);
}

function progressPercent(
  currentTier: CreatorTier,
  currentScore: number,
): number {
  const next = getNextTier(currentTier);
  if (!next) return 100;
  const from = TIER_THRESHOLDS[currentTier];
  const to = TIER_THRESHOLDS[next];
  return Math.min(100, Math.round(((currentScore - from) / (to - from)) * 100));
}

// ── Sub-components ────────────────────────────────────────────

type StatRowProps = {
  label: string;
  value: string | null;
  lockedLabel?: string;
};

function StatRow({
  label,
  value,
  lockedLabel = "Unlocked at Operator",
}: StatRowProps) {
  return (
    <div className="tbp-stat-row">
      <span className="tbp-stat-label">{label}</span>
      {value !== null ? (
        <span className="tbp-stat-value">{value}</span>
      ) : (
        <span className="tbp-stat-value tbp-stat-value--locked">
          {lockedLabel}
        </span>
      )}
    </div>
  );
}

type BenefitListProps = {
  tier: CreatorTier;
  /** Which benefits to mark as checked (defaults to all for current tier) */
  allAvailable?: boolean;
};

function BenefitList({ tier, allAvailable = true }: BenefitListProps) {
  const benefits = TIER_BENEFITS[tier];
  return (
    <>
      <p className="tbp-benefits-label">Includes</p>
      <ul className="tbp-benefits-list">
        {benefits.map((benefit, i) => {
          const available = allAvailable;
          return (
            <li
              key={benefit}
              className={`tbp-benefit-item ${
                available
                  ? "tbp-benefit-item--available"
                  : "tbp-benefit-item--locked"
              }`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span
                className={`tbp-benefit-marker ${
                  available
                    ? "tbp-benefit-marker--check"
                    : "tbp-benefit-marker--lock"
                }`}
              >
                {available ? "✓" : "—"}
              </span>
              <span>{benefit}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ── Tier column card ─────────────────────────────────────────

type TierColumnProps = {
  tier: CreatorTier;
  role: "current" | "next" | "top";
  currentScore?: number;
};

function TierColumn({ tier, role, currentScore }: TierColumnProps) {
  const colors = TIER_COLORS[tier];
  const meta = TIER_META[tier];
  const stats = TIER_STATS[tier];

  const cssVars = {
    "--tbp-color": colors.color,
    "--tbp-bg": colors.bg,
    "--tbp-accent": colors.accent,
  } as React.CSSProperties;

  if (role === "top") {
    return (
      <div className="tbp-card tbp-card--top" style={cssVars}>
        <div className="tbp-crown"></div>
        <p className="tbp-top-title">Top Tier Reached</p>
        <p className="tbp-top-sub">
          You&apos;ve unlocked every benefit Push has to offer.
          <br />
          Keep earning — legacy perks incoming.
        </p>
      </div>
    );
  }

  const isNext = role === "next";
  const cardClass = isNext
    ? "tbp-card tbp-card--next"
    : "tbp-card tbp-card--current";

  const lockedLabelForTier = (unlockTier: CreatorTier) =>
    `Unlocked at ${TIER_META[unlockTier].label}`;

  // Commission and milestone bonus unlock at Operator+
  const commissionUnlockLabel = lockedLabelForTier("operator");
  const bonusUnlockLabel = lockedLabelForTier("operator");

  return (
    <div className={cardClass} style={cssVars}>
      <p className="tbp-card-label">{isNext ? "Next Level" : "Your Tier"}</p>

      <div className="tbp-tier-header">
        <span className="tbp-tier-icon">{meta.icon}</span>
        <span className="tbp-tier-name">{meta.label}</span>
      </div>

      <div className="tbp-stats">
        <StatRow label="Base Rate" value={stats.baseRate} />
        <StatRow
          label="Commission"
          value={stats.commission}
          lockedLabel={commissionUnlockLabel}
        />
        <StatRow
          label="Milestone Bonus"
          value={stats.milestoneBonus}
          lockedLabel={bonusUnlockLabel}
        />
        <StatRow label="Max Campaigns" value={String(stats.maxCampaigns)} />
      </div>

      <BenefitList tier={tier} allAvailable={!isNext} />

      {isNext && currentScore !== undefined && (
        <div className="tbp-cta">
          <p className="tbp-cta-points">
            {pointsToNextTier(
              TIER_ORDER[TIER_ORDER.indexOf(tier) - 1] as CreatorTier,
              currentScore,
            )}{" "}
            pts to unlock
          </p>
          <p className="tbp-cta-sub">Keep completing campaigns to progress.</p>
        </div>
      )}
    </div>
  );
}

// ── Compact variant ───────────────────────────────────────────

function CompactRow({
  currentTier,
  currentScore,
}: {
  currentTier: CreatorTier;
  currentScore: number;
}) {
  const colors = TIER_COLORS[currentTier];
  const meta = TIER_META[currentTier];
  const next = getNextTier(currentTier);
  const pct = progressPercent(currentTier, currentScore);
  const pts = pointsToNextTier(currentTier, currentScore);

  const cssVars = {
    "--tbp-color": colors.color,
    "--tbp-accent": colors.accent,
    "--tbp-next-accent": next ? TIER_COLORS[next].accent : colors.accent,
  } as React.CSSProperties;

  return (
    <div className="tbp-compact" style={cssVars}>
      <span className="tbp-compact-badge">
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </span>

      <span className="tbp-compact-score">{currentScore}</span>

      <div className="tbp-compact-progress">
        <div className="tbp-compact-progress-labels">
          <span className="tbp-compact-progress-label">Score</span>
          <span className="tbp-compact-progress-label">{pct}%</span>
        </div>
        <div className="tbp-progress-track">
          <div className="tbp-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {next ? (
        <div className="tbp-compact-next">
          <p className="tbp-compact-next-name">{TIER_META[next].label}</p>
          <p className="tbp-compact-next-pts">{pts} pts away</p>
        </div>
      ) : (
        <div className="tbp-compact-next">
          <p className="tbp-compact-next-name">Max Tier</p>
          <p className="tbp-compact-next-pts">Partner reached</p>
        </div>
      )}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────

export function TierBenefitsPanel({
  currentTier,
  currentScore,
  className,
  variant = "full",
}: TierBenefitsPanelProps) {
  const nextTier = getNextTier(currentTier);

  if (variant === "compact") {
    return (
      <div className={`tbp-panel${className ? ` ${className}` : ""}`}>
        <CompactRow currentTier={currentTier} currentScore={currentScore} />
      </div>
    );
  }

  // Full variant
  const currentColors = TIER_COLORS[currentTier];
  const nextColors = nextTier ? TIER_COLORS[nextTier] : null;

  const panelVars = {
    "--tbp-color": currentColors.color,
    "--tbp-bg": currentColors.bg,
    "--tbp-accent": currentColors.accent,
    "--tbp-next-accent": nextColors ? nextColors.accent : currentColors.accent,
  } as React.CSSProperties;

  return (
    <div
      className={`tbp-panel${className ? ` ${className}` : ""}`}
      style={panelVars}
    >
      <div className="tbp-grid">
        <TierColumn tier={currentTier} role="current" />

        {nextTier ? (
          <TierColumn tier={nextTier} role="next" currentScore={currentScore} />
        ) : (
          <TierColumn tier={currentTier} role="top" />
        )}
      </div>
    </div>
  );
}
