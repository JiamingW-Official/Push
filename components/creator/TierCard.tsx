"use client";
import "./tier-card.css";

// ── Types ────────────────────────────────────────────────────────────────────

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type TierCardProps = {
  tier: CreatorTier;
  score: number;
  creatorName: string;
  city: string; // e.g. "Lower East Side, NYC"
  campaignsCompleted: number;
  earningsTotal: number;
  month?: string; // e.g. "April 2026" — if omitted shows "All Time"
  neighborhood?: string; // e.g. "Astoria" for local expert badge
  isLocalExpert?: boolean; // show "Local Expert" badge
  onShare?: () => void;
  onClose?: () => void;
};

// ── Tier visual identity ─────────────────────────────────────────────────────

const TIER_CARD_STYLE: Record<
  CreatorTier,
  {
    bg: string;
    accent: string;
    textColor: string;
    symbol: string;
    name: string;
  }
> = {
  seed: {
    bg: "#f5f2ec",
    accent: "#b8a99a",
    textColor: "#003049",
    symbol: "",
    name: "Seed",
  },
  explorer: {
    bg: "#003049",
    accent: "#8c6239",
    textColor: "#f5f2ec",
    symbol: "",
    name: "Explorer",
  },
  operator: {
    bg: "#001d2e",
    accent: "#4a5568",
    textColor: "#f5f2ec",
    symbol: "",
    name: "Operator",
  },
  proven: {
    bg: "#003049",
    accent: "#c9a96e",
    textColor: "#f5f2ec",
    symbol: "",
    name: "Proven",
  },
  closer: {
    bg: "#0a0005",
    accent: "#9b111e",
    textColor: "#f5f2ec",
    symbol: "",
    name: "Closer",
  },
  partner: {
    bg: "linear-gradient(160deg, #1a1a2e 0%, #0a0005 100%)",
    accent: "#1a1a2e",
    textColor: "#f5f2ec",
    symbol: "",
    name: "Partner",
  },
};

// ── Helper: hex accent with alpha for borders ─────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Helper: share action ─────────────────────────────────────────────────────

async function defaultShare(creatorName: string, tier: string): Promise<void> {
  const shareData = {
    title: `${creatorName} is a ${tier} creator on Push`,
    text: `I just hit ${tier} tier on Push — the platform that pays creators to create locally. push.nyc`,
    url: "https://push.nyc",
  };

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled or share failed — fall through to clipboard
      await copyFallback();
    }
  } else {
    await copyFallback();
  }
}

async function copyFallback(): Promise<void> {
  try {
    await navigator.clipboard.writeText("https://push.nyc");
  } catch {
    // Clipboard unavailable in this context
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TierCard({
  tier,
  score,
  creatorName,
  city,
  campaignsCompleted,
  earningsTotal,
  month,
  neighborhood,
  isLocalExpert = false,
  onShare,
  onClose,
}: TierCardProps) {
  const style = TIER_CARD_STYLE[tier];

  // Determine whether bg is a gradient or solid color
  const isGradient = style.bg.startsWith("linear-gradient");

  const cardInlineStyle: React.CSSProperties = {
    background: style.bg,
    color: style.textColor,
    ...(isGradient ? {} : { backgroundColor: style.bg }),
  };

  const accentBorder = `1px solid ${hexToRgba(style.accent, 0.25)}`;

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      defaultShare(creatorName, style.name);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="tier-card-wrapper">
      {/* ── Screenshottable card ───────────────────────────────────── */}
      <div className="tier-card" style={cardInlineStyle} id="tier-card-capture">
        {/* Header */}
        <div className="tc-header">
          <span className="tc-logo" style={{ color: style.textColor }}>
            PUSH
          </span>
          <span className="tc-month" style={{ color: style.textColor }}>
            {month ?? "All Time"}
          </span>
        </div>

        {/* Tier symbol */}
        <div className="tc-symbol" aria-hidden="true">
          {style.symbol}
        </div>

        {/* Tier name */}
        <div className="tc-tier-name" style={{ color: style.textColor }}>
          {style.name.toUpperCase()}
        </div>

        {/* Accent line */}
        <div
          className="tc-accent-line"
          style={{ backgroundColor: style.accent }}
          aria-hidden="true"
        />

        {/* Push Score */}
        <div className="tc-score-label" style={{ color: style.textColor }}>
          Push Score
        </div>
        <div className="tc-score-value" style={{ color: style.textColor }}>
          {score}
          <span
            style={{
              fontSize: "0.45em",
              opacity: 0.5,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            /100
          </span>
        </div>

        {/* Stat cards */}
        <div className="tc-stats-grid">
          <div className="tc-stat" style={{ border: accentBorder }}>
            <div className="tc-stat-value" style={{ color: style.textColor }}>
              {campaignsCompleted}
            </div>
            <div className="tc-stat-label" style={{ color: style.textColor }}>
              Campaigns
            </div>
          </div>

          <div className="tc-stat" style={{ border: accentBorder }}>
            <div className="tc-stat-value" style={{ color: style.textColor }}>
              ${earningsTotal.toLocaleString()}
            </div>
            <div className="tc-stat-label" style={{ color: style.textColor }}>
              Earned
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="tc-location" style={{ color: style.textColor }}>
          {city}
        </div>

        {/* Local Expert badge — optional */}
        {isLocalExpert && neighborhood && (
          <div
            className="tc-local-expert"
            style={{
              border: `1px solid ${style.accent}`,
              color: style.accent,
            }}
          >
            {neighborhood} Local Expert
          </div>
        )}

        {/* Footer */}
        <div className="tc-footer" style={{ color: style.textColor }}>
          <div className="tc-footer-domain">push.nyc</div>
          <div className="tc-footer-tagline">Get paid to create locally.</div>
        </div>
      </div>

      {/* ── Controls — outside the card, not in screenshot ────────── */}
      <div className="tc-controls">
        <button
          type="button"
          className="tc-share-btn"
          onClick={handleShare}
          aria-label="Share this tier card"
        >
          Share Card
        </button>

        <button
          type="button"
          className="tc-close-btn"
          onClick={handleClose}
          aria-label="Close tier card"
        >
          × Close
        </button>
      </div>
    </div>
  );
}
