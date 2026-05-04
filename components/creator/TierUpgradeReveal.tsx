"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type TierUpgradeRevealProps = {
  previousTier: CreatorTier;
  newTier: CreatorTier;
  onDismiss: () => void;
  className?: string;
  // Legacy compat — also accept newScore + onComplete
  newScore?: number;
  onComplete?: () => void;
};

// ---------------------------------------------------------------------------
// Tier config
// ---------------------------------------------------------------------------

const TIER_REVEAL_CONFIG = {
  seed: {
    name: "Seed",
    symbol: "",
    color: "#669bbc",
    bg: "#001d2e",
    tagline: "Your journey starts here.",
    accentRgb: "184,169,154",
  },
  explorer: {
    name: "Explorer",
    symbol: "",
    color: "#c9a96e",
    bg: "#001a2b",
    tagline: "You're getting paid.",
    accentRgb: "140,98,57",
  },
  operator: {
    name: "Operator",
    symbol: "",
    color: "#f5f2ec",
    bg: "#001020",
    tagline: "Commission unlocked.",
    accentRgb: "74,85,104",
  },
  proven: {
    name: "Proven",
    symbol: "",
    color: "#c1121f",
    bg: "#001520",
    tagline: "The market trusts you.",
    accentRgb: "201,169,110",
  },
  closer: {
    name: "Closer",
    symbol: "",
    color: "#780000",
    bg: "#0a0008",
    tagline: "Merchants come to you.",
    accentRgb: "155,17,30",
  },
  partner: {
    name: "Partner",
    symbol: "",
    color: "#003049",
    bg: "#120005",
    tagline: "You built something real.",
    accentRgb: "26,26,46",
  },
} as const;

// ---------------------------------------------------------------------------
// Tier benefits — before/after data
// ---------------------------------------------------------------------------

const TIER_BENEFITS: Record<
  CreatorTier,
  {
    benefits: string[];
    baseRate: string;
    slots: number;
    commission?: string;
  }
> = {
  seed: {
    benefits: ["Free product campaigns", "1 active campaign"],
    baseRate: "$0",
    slots: 1,
  },
  explorer: {
    benefits: ["$12 per campaign", "2 active campaigns", "Priority matching"],
    baseRate: "$12",
    slots: 2,
  },
  operator: {
    benefits: [
      "$20 per campaign",
      "3% commission",
      "Higher per-visit rate ($12 avg)",
      "3 campaigns",
    ],
    baseRate: "$20",
    slots: 3,
    commission: "3%",
  },
  proven: {
    benefits: [
      "$32 per campaign",
      "5% commission",
      "Studio-tier eligibility",
      "4 campaigns",
      "Content reviews",
    ],
    baseRate: "$32",
    slots: 4,
    commission: "5%",
  },
  closer: {
    benefits: [
      "$55 per campaign",
      "7% commission",
      "Premium per-visit rate ($25 avg)",
      "5 campaigns",
      "Account manager",
    ],
    baseRate: "$55",
    slots: 5,
    commission: "7%",
  },
  partner: {
    benefits: [
      "$100 per campaign",
      "10% commission",
      "Top per-visit rate ($35 avg) + Studio anchor",
      "6 campaigns",
      "Advisory access",
    ],
    baseRate: "$100",
    slots: 6,
    commission: "10%",
  },
};

// ---------------------------------------------------------------------------
// Confetti particle
// ---------------------------------------------------------------------------

type ConfettiPiece = {
  id: number;
  x: number; // vw
  delay: number; // ms
  duration: number; // ms
  size: number; // px
  color: string;
  rotation: number;
};

const CONFETTI_COLORS = ["#c1121f", "#780000", "#f5f2ec", "#003049", "#669bbc"];

function generateConfetti(count = 40): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2000,
    duration: 2500 + Math.random() * 2000,
    size: 6 + Math.random() * 8,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
  }));
}

// ---------------------------------------------------------------------------
// Confetti overlay (CSS-only, no canvas)
// ---------------------------------------------------------------------------

function ConfettiOverlay({ active }: { active: boolean }) {
  const [pieces] = useState<ConfettiPiece[]>(() => generateConfetti(50));

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-40px) rotate(var(--rot)); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(calc(var(--rot) + 540deg)); opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: 0,
              left: `${p.x}vw`,
              width: p.size,
              height: p.size,
              background: p.color,
              // confetti squares deliberately no border-radius
              borderRadius: 0,
              // CSS custom property for rotation
              ["--rot" as string]: `${p.rotation}deg`,
              animation: `confetti-fall ${p.duration}ms ${p.delay}ms ease-in forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Before/after comparison row
// ---------------------------------------------------------------------------

function DeltaRow({
  label,
  before,
  after,
  visible,
}: {
  label: string;
  before: string;
  after: string;
  visible: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition:
          "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        style={{
          fontFamily: "'CS Genio Mono', 'Courier New', monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          width: 80,
          flexShrink: 0,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'CS Genio Mono', 'Courier New', monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          textDecoration: "line-through",
        }}
      >
        {before}
      </span>
      <span
        style={{
          fontFamily: "'CS Genio Mono', 'Courier New', monospace",
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
        }}
      >
        →
      </span>
      <span
        style={{
          fontFamily: "'CS Genio Mono', 'Courier New', monospace",
          fontSize: 12,
          color: "var(--surface)",
          fontWeight: 700,
        }}
      >
        {after}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auto-dismiss progress ring
// ---------------------------------------------------------------------------

function DismissTimer({
  durationMs,
  visible,
  onComplete,
}: {
  durationMs: number;
  visible: boolean;
  onComplete: () => void;
}) {
  const size = 28;
  const r = 11;
  const circumference = 2 * Math.PI * r;

  return (
    <>
      <style>{`
        @keyframes timer-ring {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${circumference}; }
        }
        .dismiss-ring {
          animation: timer-ring ${durationMs}ms linear forwards;
          stroke-dasharray: ${circumference};
          stroke-dashoffset: 0;
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          transform: "rotate(-90deg)",
        }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={2}
        />
        <circle
          className="dismiss-ring"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={2}
          strokeLinecap="square"
        />
      </svg>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AUTO_DISMISS_MS = 8000;

type Phase = 1 | 2 | 3 | 4 | 5;

export function TierUpgradeReveal({
  newTier,
  previousTier,
  onDismiss,
  className,
  // Legacy compat
  newScore,
  onComplete,
}: TierUpgradeRevealProps) {
  const [phase, setPhase] = useState<Phase>(1);
  const [visibleBenefits, setVisibleBenefits] = useState<number[]>([]);
  const [visibleDeltas, setVisibleDeltas] = useState<number[]>([]);
  const [symbolVisible, setSymbolVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [benefitsHeaderVisible, setBenefitsHeaderVisible] = useState(false);
  const [deltaHeaderVisible, setDeltaHeaderVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [washVisible, setWashVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);

  const tierConfig = TIER_REVEAL_CONFIG[newTier];
  const prevConfig = TIER_REVEAL_CONFIG[previousTier];
  const newBenefits = TIER_BENEFITS[newTier];
  const prevBenefits = TIER_BENEFITS[previousTier];

  // Compute deltas: what changed between tiers
  const deltas: Array<{ label: string; before: string; after: string }> = [
    {
      label: "Base pay",
      before: prevBenefits.baseRate + "/campaign",
      after: newBenefits.baseRate + "/campaign",
    },
    {
      label: "Slots",
      before: `${prevBenefits.slots} campaign${prevBenefits.slots === 1 ? "" : "s"}`,
      after: `${newBenefits.slots} campaign${newBenefits.slots === 1 ? "" : "s"}`,
    },
    ...(newBenefits.commission
      ? [
          {
            label: "Commission",
            before: prevBenefits.commission ?? "None",
            after: newBenefits.commission,
          },
        ]
      : []),
  ];

  const handleDismiss = useCallback(() => {
    if (onComplete) onComplete();
    onDismiss();
  }, [onDismiss, onComplete]);

  // Sequence: staggered reveal then auto-dismiss
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    // Phase 1 – overlay fades in + confetti burst
    t(() => setOverlayVisible(true), 50);
    t(() => setWashVisible(true), 300);
    t(() => setConfettiActive(true), 600);

    // Phase 2 – "Level Up!" + symbol
    t(() => {
      setPhase(2);
      setLevelUpVisible(true);
    }, 700);
    t(() => setSymbolVisible(true), 950);

    // Phase 3 – tier name + tagline
    t(() => {
      setPhase(3);
      setNameVisible(true);
    }, 1300);
    t(() => setTaglineVisible(true), 1600);

    // Phase 4 – benefits
    t(() => {
      setPhase(4);
      setBenefitsHeaderVisible(true);
    }, 1900);
    newBenefits.benefits.forEach((_, i) => {
      t(() => setVisibleBenefits((prev) => [...prev, i]), 2100 + i * 160);
    });

    // Phase 5 – what changed
    const deltaStart = 2100 + newBenefits.benefits.length * 160 + 200;
    t(() => {
      setPhase(5);
      setDeltaHeaderVisible(true);
    }, deltaStart);
    deltas.forEach((_, i) => {
      t(
        () => setVisibleDeltas((prev) => [...prev, i]),
        deltaStart + 200 + i * 150,
      );
    });

    // CTA + timer
    const ctaStart = deltaStart + 200 + deltas.length * 150 + 300;
    t(() => {
      setCtaVisible(true);
      setTimerVisible(true);
    }, ctaStart);

    // Auto-dismiss
    t(handleDismiss, ctaStart + AUTO_DISMISS_MS);

    return () => timers.forEach(clearTimeout);
  }, [handleDismiss]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Global keyframe injection */}
      <style>{`
        @keyframes tier-symbol-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes level-up-stamp {
          0%   { transform: scale(1.6) translateY(-8px); opacity: 0; letter-spacing: 0.3em; }
          60%  { transform: scale(0.97) translateY(0); opacity: 1; letter-spacing: 0.12em; }
          100% { transform: scale(1) translateY(0); opacity: 1; letter-spacing: 0.12em; }
        }
        .tier-symbol-visible {
          animation: tier-symbol-pop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .level-up-visible {
          animation: level-up-stamp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        className={className}
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10001,
          background: tierConfig.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          overflow: "hidden",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
          cursor: "pointer",
        }}
      >
        {/* Radial glow wash */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: washVisible ? "140%" : "0%",
            aspectRatio: "1 / 0.6",
            background: `radial-gradient(ellipse at center, rgba(${tierConfig.accentRgb},0.18) 0%, transparent 70%)`,
            transition: "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
          }}
        />

        {/* Confetti */}
        <ConfettiOverlay active={confettiActive} />

        {/* Progression label — top left */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontFamily: "'CS Genio Mono', 'Courier New', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            opacity: nameVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {prevConfig.name.toUpperCase()} &rarr; {tierConfig.name.toUpperCase()}
        </div>

        {/* Auto-dismiss timer + score — top right */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {newScore !== undefined && (
            <span
              style={{
                fontFamily: "'CS Genio Mono', 'Courier New', monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                opacity: nameVisible ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
            >
              SCORE {newScore}
            </span>
          )}
          <DismissTimer
            durationMs={AUTO_DISMISS_MS}
            visible={timerVisible}
            onComplete={handleDismiss}
          />
        </div>

        {/* Main content — vertically scrollable if needed */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            width: "100%",
            maxWidth: 520,
            position: "relative",
            zIndex: 3,
            overflowY: "auto",
            maxHeight: "calc(100vh - 96px)",
            paddingBottom: 8,
          }}
        >
          {/* "LEVEL UP!" headline */}
          <div
            className={levelUpVisible ? "level-up-visible" : ""}
            style={{
              fontFamily: "var(--font-display, Darky, serif)",
              fontSize: "clamp(14px, 3vw, 18px)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 12,
              opacity: levelUpVisible ? undefined : 0,
            }}
          >
            Level Up!
          </div>

          {/* Tier icon — 64px */}
          <div
            className={symbolVisible ? "tier-symbol-visible" : ""}
            style={{
              fontSize: 64,
              lineHeight: 1,
              marginBottom: 16,
              opacity: symbolVisible ? undefined : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {tierConfig.symbol}
          </div>

          {/* Tier name — H1 scale */}
          <div
            style={{
              fontFamily: "var(--font-display, Darky, serif)",
              fontSize: "clamp(40px, 9vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              color: tierConfig.color,
              lineHeight: 1,
              textAlign: "center",
              marginBottom: 8,
              opacity: nameVisible ? 1 : 0,
              transform: nameVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {tierConfig.name}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: "'CS Genio Mono', 'Courier New', monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              letterSpacing: "0.04em",
              marginBottom: 32,
              opacity: taglineVisible ? 1 : 0,
              transform: taglineVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {tierConfig.tagline}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.08)",
              marginBottom: 24,
              opacity: benefitsHeaderVisible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Benefits header */}
          <div
            style={{
              width: "100%",
              fontFamily: "'CS Genio Mono', 'Courier New', monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 12,
              opacity: benefitsHeaderVisible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            You&apos;ve unlocked:
          </div>

          {/* Benefits list */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {newBenefits.benefits.map((benefit, i) => (
              <div
                key={benefit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: visibleBenefits.includes(i) ? 1 : 0,
                  transform: visibleBenefits.includes(i)
                    ? "translateX(0)"
                    : "translateX(-10px)",
                  transition:
                    "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Flag Red square bullet — zero border-radius */}
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--brand-red)",
                    borderRadius: 0,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'CS Genio Mono', 'Courier New', monospace",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.82)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* What changed section */}
          {deltas.length > 0 && (
            <>
              <div
                style={{
                  width: "100%",
                  fontFamily: "'CS Genio Mono', 'Courier New', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 12,
                  opacity: deltaHeaderVisible ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                What changed:
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 32,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "14px 16px",
                }}
              >
                {deltas.map((delta, i) => (
                  <DeltaRow
                    key={delta.label}
                    label={delta.label}
                    before={delta.before}
                    after={delta.after}
                    visible={visibleDeltas.includes(i)}
                  />
                ))}
              </div>
            </>
          )}

          {/* CTA button */}
          <button
            onClick={handleDismiss}
            style={{
              width: "100%",
              padding: "16px 24px",
              background: "var(--brand-red)",
              color: "var(--surface)",
              border: "none",
              borderRadius: 0,
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--brand-red)";
            }}
          >
            Explore New Campaigns &rarr;
          </button>

          {/* Dismiss hint */}
          <p
            style={{
              fontFamily: "'CS Genio Mono', 'Courier New', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              marginTop: 12,
              letterSpacing: "0.06em",
              opacity: ctaVisible ? 1 : 0,
              transition: "opacity 0.4s ease 0.2s",
              textAlign: "center",
            }}
          >
            Auto-closes in {Math.round(AUTO_DISMISS_MS / 1000)}s · tap anywhere
            to dismiss
          </p>
        </div>
      </div>
    </>
  );
}
