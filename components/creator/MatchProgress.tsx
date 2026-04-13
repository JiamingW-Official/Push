"use client";

import { useEffect, useState } from "react";

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

type MatchProgressProps = {
  /** ISO string of when the 48h clock started */
  startedAt: string;
  /** What are we waiting for? */
  mode: "first_match" | "application_review";
  /** Creator name for personalization */
  creatorName?: string;
  /** Creator tier for tier-aware context */
  creatorTier?: CreatorTier;
  /** Called when user dismisses */
  onDismiss?: () => void;
};

// ---------------------------------------------------------------------------
// Tier labels
// ---------------------------------------------------------------------------

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const TIER_MATCHING_CONTEXT: Record<CreatorTier, string> = {
  seed: "Your profile is being matched to starter campaigns in your area.",
  explorer: "As an Explorer you get priority consideration on paid campaigns.",
  operator:
    "Operator tier unlocks commission campaigns — we're scanning those first.",
  proven:
    "Proven creators get merchant-initiated invites — check your inbox too.",
  closer:
    "Merchants are likely reviewing you directly. Closer status puts you top-of-queue.",
  partner:
    "Partner status means merchants often skip the queue and DM directly.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getElapsedSeconds(startedAt: string): number {
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
}

function getProgressPercent(startedAt: string): number {
  const elapsed = getElapsedSeconds(startedAt);
  return Math.min(100, (elapsed / 172800) * 100);
}

function getRelativeTime(startedAt: string): string {
  const elapsed = getElapsedSeconds(startedAt);
  if (elapsed < 60) return "just now";
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ago`;
  if (elapsed < 86400) return `${Math.floor(elapsed / 3600)}h ago`;
  return `${Math.floor(elapsed / 86400)}d ago`;
}

function getRemainingLabel(startedAt: string): string {
  const deadline = new Date(startedAt).getTime() + 48 * 60 * 60 * 1000;
  const remaining = Math.max(0, deadline - Date.now());
  if (remaining === 0) return "complete";
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  if (h > 0) return `~${h}h ${m}m left`;
  return `~${m}m left`;
}

// ---------------------------------------------------------------------------
// Stage logic — 4 stages with sequential lighting
// ---------------------------------------------------------------------------

type StageState = "past" | "active" | "future";

type Stage = {
  label: string;
  sublabel: string;
  state: StageState;
};

function getStages(startedAt: string): Stage[] {
  const elapsed = getElapsedSeconds(startedAt);

  const stages: Stage[] = [
    {
      label: "Analyzing",
      sublabel: "Profile",
      state: "future",
    },
    {
      label: "Scanning",
      sublabel: "Campaigns",
      state: "future",
    },
    {
      label: "Matching",
      sublabel: "In Progress",
      state: "future",
    },
    {
      label: "Done",
      sublabel: "Results ready",
      state: "future",
    },
  ];

  if (elapsed < 7200) {
    // 0–2h: Analyzing profile
    stages[0].state = "active";
  } else if (elapsed < 86400) {
    // 2h–24h: Scanning campaigns
    stages[0].state = "past";
    stages[1].state = "active";
  } else if (elapsed < 165600) {
    // 24h–46h: Matching
    stages[0].state = "past";
    stages[1].state = "past";
    stages[2].state = "active";
  } else {
    // 46h+: Done
    stages[0].state = "past";
    stages[1].state = "past";
    stages[2].state = "past";
    stages[3].state = "active";
  }

  return stages;
}

function getMessage(
  mode: "first_match" | "application_review",
  startedAt: string,
): string {
  const elapsed = getElapsedSeconds(startedAt);

  if (mode === "application_review") {
    if (elapsed < 86400)
      return "The merchant is reviewing your application and creator profile.";
    if (elapsed < 144000)
      return "You're near the top of the merchant's review queue. Hang tight.";
    if (elapsed < 172800)
      return "Final decision coming soon. Keep notifications on to respond quickly.";
    return "Review complete — check your applications tab for the decision.";
  }

  // first_match
  if (elapsed < 86400)
    return "Our matching engine is reviewing your profile against active campaigns.";
  if (elapsed < 144000)
    return "You're near the top of our match queue. Keep your profile complete.";
  if (elapsed < 172800)
    return "Final review in progress. Expect a match notification soon.";
  return "Matching complete — check your applications tab.";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PulsingDot() {
  return (
    <>
      <style>{`
        @keyframes mp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.65); }
        }
        .mp-pulse-dot {
          animation: mp-pulse 1.6s ease-in-out infinite;
        }
      `}</style>
      <span
        className="mp-pulse-dot"
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 7,
          height: 7,
          background: "#c1121f",
          marginRight: 7,
          flexShrink: 0,
          verticalAlign: "middle",
          borderRadius: 0,
        }}
      />
    </>
  );
}

// Stage node with connecting line
function StageNode({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  const isPast = stage.state === "past";
  const isActive = stage.state === "active";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        position: "relative",
      }}
    >
      {/* Connector line — drawn from this node to the next */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            top: 7,
            left: "calc(50% + 7px)",
            right: "calc(-50% + 7px)",
            height: 1,
            background: isPast ? "#003049" : "rgba(0,48,73,0.15)",
            transition: "background 400ms ease",
            zIndex: 0,
          }}
        />
      )}

      {/* Square indicator */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 0,
          flexShrink: 0,
          background: isPast ? "#003049" : isActive ? "#c1121f" : "transparent",
          border: isPast
            ? "none"
            : isActive
              ? "none"
              : "1.5px solid rgba(0,48,73,0.25)",
          boxSizing: "border-box",
          transition: "background 400ms ease, border-color 400ms ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Pulse ring on active */}
        {isActive && (
          <>
            <style>{`
              @keyframes mp-ring-pulse {
                0%   { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(2.2); opacity: 0; }
              }
              .mp-ring {
                animation: mp-ring-pulse 1.8s ease-out infinite;
              }
            `}</style>
            <div
              className="mp-ring"
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -2,
                border: "1.5px solid #c1121f",
                borderRadius: 0,
              }}
            />
          </>
        )}

        {/* Check mark on past */}
        {isPast && (
          <svg
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
            }}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 7L6 10L11 4"
              stroke="#f5f2ec"
              strokeWidth="1.6"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: isPast
            ? "#003049"
            : isActive
              ? "#c1121f"
              : "rgba(0,48,73,0.3)",
          fontWeight: isActive ? 700 : 400,
          marginTop: 6,
          textAlign: "center",
          lineHeight: 1.3,
          transition: "color 400ms ease",
        }}
      >
        {stage.label}
        <br />
        <span
          style={{
            opacity: 0.6,
            fontWeight: 400,
            fontSize: 8,
          }}
        >
          {stage.sublabel}
        </span>
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <polyline
        points="2,6 5,9 10,3"
        stroke="#003049"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1C4.343 1 3 2.343 3 4v3L1 9h10L9 7V4c0-1.657-1.343-3-3-3z"
        stroke="#003049"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <line
        x1="5"
        y1="10.5"
        x2="7"
        y2="10.5"
        stroke="#003049"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1C4.067 1 2.5 2.567 2.5 4.5 2.5 7.5 6 11 6 11s3.5-3.5 3.5-6.5C9.5 2.567 7.933 1 6 1z"
        stroke="#003049"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <rect
        x="4.75"
        y="3.25"
        width="2.5"
        height="2.5"
        stroke="#003049"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MatchProgress({
  startedAt,
  mode,
  creatorName,
  creatorTier,
  onDismiss,
}: MatchProgressProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [tick, setTick] = useState(0);

  // Live countdown
  useEffect(() => {
    function update() {
      const start = new Date(startedAt).getTime();
      const deadline = start + 48 * 60 * 60 * 1000;
      const remaining = Math.max(0, deadline - Date.now());
      if (remaining === 0) {
        setTimeLeft("MATCHING NOW");
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} remaining`,
        );
      }
      setTick((t) => t + 1);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  // Derived — recalculated each tick
  const progress = getProgressPercent(startedAt);
  const relativeTime = getRelativeTime(startedAt);
  const remainingLabel = getRemainingLabel(startedAt);
  const stages = getStages(startedAt);
  const message = getMessage(mode, startedAt);

  const isComplete = timeLeft === "MATCHING NOW";
  const greeting = creatorName ? `Hey ${creatorName} — ` : "";
  const tierContext = creatorTier ? TIER_MATCHING_CONTEXT[creatorTier] : null;
  const tierLabel = creatorTier ? TIER_LABELS[creatorTier] : null;

  return (
    <div
      style={{
        fontFamily: "'CS Genio Mono', monospace",
        background: "#f5f2ec",
        border: "1px solid rgba(0,48,73,0.14)",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 0,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#003049",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 11,
            fontFamily: "'CS Genio Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#f5f2ec",
            fontWeight: 700,
          }}
        >
          <PulsingDot />
          {mode === "application_review"
            ? "Application Review"
            : "Match in Progress"}
        </div>

        {/* Tier badge */}
        {tierLabel && (
          <span
            style={{
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,242,236,0.55)",
              border: "1px solid rgba(245,242,236,0.2)",
              padding: "2px 8px",
            }}
          >
            {tierLabel}
          </span>
        )}

        <span
          style={{
            fontSize: 10,
            fontFamily: "'CS Genio Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: isComplete ? "#c1121f" : "rgba(245,242,236,0.45)",
            fontWeight: isComplete ? 700 : 400,
          }}
        >
          {timeLeft}
        </span>
      </div>

      <div style={{ padding: "20px" }}>
        {/* ── Progress bar ──────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 6,
            background: "rgba(0,48,73,0.08)",
            borderRadius: 0,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: isComplete ? "#003049" : "#c1121f",
              transition: "width 0.5s ease, background 0.5s ease",
              borderRadius: 0,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
            color: "rgba(0,48,73,0.45)",
            fontFamily: "'CS Genio Mono', monospace",
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}
        >
          <span>Started {relativeTime}</span>
          <span>{remainingLabel}</span>
        </div>

        {/* ── Stage indicators ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          {stages.map((stage, i) => (
            <StageNode
              key={stage.label}
              stage={stage}
              isLast={i === stages.length - 1}
            />
          ))}
        </div>

        {/* ── Message block ─────────────────────────────────────────────── */}
        <div
          style={{
            fontSize: 12,
            fontFamily: "'CS Genio Mono', monospace",
            color: "#003049",
            lineHeight: 1.6,
            padding: "12px 14px",
            background: "rgba(0,48,73,0.04)",
            border: "1px solid rgba(0,48,73,0.08)",
            borderRadius: 0,
            marginBottom: tierContext ? 10 : 20,
          }}
        >
          {greeting}
          {message}
        </div>

        {/* ── Tier-aware context ────────────────────────────────────────── */}
        {tierContext && (
          <div
            style={{
              fontSize: 11,
              fontFamily: "'CS Genio Mono', monospace",
              color: "rgba(0,48,73,0.65)",
              lineHeight: 1.55,
              padding: "10px 14px",
              background: "rgba(193,18,31,0.03)",
              borderLeft: "2px solid rgba(193,18,31,0.35)",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "#c1121f",
                textTransform: "uppercase",
                fontSize: 9,
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 4,
              }}
            >
              {tierLabel} tier
            </span>
            {tierContext}
          </div>
        )}

        {/* ── Action tips ───────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: onDismiss ? 16 : 0,
          }}
        >
          {[
            { icon: <CheckIcon />, label: "Profile complete?" },
            { icon: <BellIcon />, label: "Notifications on?" },
            { icon: <MapPinIcon />, label: "Check nearby campaigns" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                flex: "1 1 120px",
                border: "1px solid rgba(0,48,73,0.1)",
                padding: "9px 10px",
                borderRadius: 0,
                fontSize: 10,
                fontFamily: "'CS Genio Mono', monospace",
                color: "#003049",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f5f2ec",
              }}
            >
              {icon}
              {label}
            </div>
          ))}
        </div>

        {/* ── Dismiss ───────────────────────────────────────────────────── */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              display: "block",
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "'CS Genio Mono', monospace",
              color: "rgba(0,48,73,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "4px 0",
              borderRadius: 0,
            }}
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StageSquare — kept for any existing consumers
// ---------------------------------------------------------------------------

export function StageSquare({
  state,
}: {
  state: "past" | "active" | "future";
}) {
  const base: React.CSSProperties = {
    width: 14,
    height: 14,
    borderRadius: 0,
    flexShrink: 0,
  };

  if (state === "past")
    return <div style={{ ...base, background: "#003049" }} />;
  if (state === "active")
    return <div style={{ ...base, background: "#c1121f" }} />;
  return (
    <div
      style={{
        ...base,
        background: "transparent",
        border: "1.5px solid rgba(0,48,73,0.3)",
        boxSizing: "border-box",
      }}
    />
  );
}
