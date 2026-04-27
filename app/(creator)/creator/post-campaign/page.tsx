"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef } from "react";
import "./post-campaign.css";

/* ── Types ───────────────────────────────────────────────── */

type Tier = "seed" | "explorer" | "operator" | "proven" | "closer" | "partner";

interface PageData {
  campaign_id: string;
  amount: number;
  merchant: string;
  category: string;
  tier: Tier;
  score: number;
  score_delta: number;
  milestone: string;
}

interface DemoMetrics {
  engagement: string;
  reach: string;
  conversions: string;
}

/* ── Constants ───────────────────────────────────────────── */

const DEMO_DATA: PageData = {
  campaign_id: "demo-001",
  amount: 35,
  merchant: "Superiority Burger",
  category: "Food",
  tier: "operator",
  score: 71,
  score_delta: 3.8,
  milestone: "proof_submitted",
};

const DEMO_METRICS: DemoMetrics = {
  engagement: "4.2K",
  reach: "18.5K",
  conversions: "23",
};

const DEMO_CAMPAIGNS_COMPLETED = 12;

const TAGLINES = [
  "Keep the momentum.",
  "NYC sees you showing up.",
  "Every campaign builds your score.",
];

/* Tier thresholds — simplified for display */
const TIER_NEXT: Record<Tier, { label: string; target: number }> = {
  seed: { label: "Explorer", target: 20 },
  explorer: { label: "Operator", target: 50 },
  operator: { label: "Proven", target: 75 },
  proven: { label: "Closer", target: 100 },
  closer: { label: "Partner", target: 140 },
  partner: { label: "Partner", target: 999 },
};

/* All tiers in order for the mini journey */
const ALL_TIERS: Tier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

/* Payout speed by tier */
const PAYOUT_SPEED: Record<Tier, string> = {
  seed: "T+7 payout speed",
  explorer: "T+5 payout speed",
  operator: "T+2 payout speed",
  proven: "T+1 payout speed",
  closer: "Same-day payout",
  partner: "Instant payout",
};

/* Perk unlocked at each tier */
const TIER_PERKS: Record<Tier, string> = {
  seed: "Access to local campaigns",
  explorer: "Priority notifications + T+5",
  operator: "Batch apply + T+2 payouts",
  proven: "Exclusive brand deals + T+1",
  closer: "Same-day payouts + top placements",
  partner: "Instant payouts + dedicated support",
};

/* ── Helpers ─────────────────────────────────────────────── */

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

function pickTagline(campaignsCompleted: number): string {
  return TAGLINES[campaignsCompleted % TAGLINES.length];
}

function tierIndex(tier: Tier): number {
  return ALL_TIERS.indexOf(tier);
}

/* ── Checkmark SVG ───────────────────────────────────────── */

function CheckSVG() {
  return (
    <svg
      className="pc-check-svg"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Circle */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="var(--surface)"
        strokeWidth="2"
        opacity="0.3"
      />
      {/* Checkmark path — draws on mount */}
      <path
        className="pc-check-path"
        d="M20 33 L28 41 L44 25"
        stroke="var(--surface)"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}

/* ── Timeline ────────────────────────────────────────────── */

function Timeline() {
  const steps = [
    {
      done: true,
      label: "Proof Submitted",
      desc: "Your content has been received and logged.",
      suffix: "✓",
    },
    {
      done: false,
      current: true,
      label: "Merchant Review",
      desc: "Est. 24–48 hours. We'll notify you when approved.",
    },
    {
      done: false,
      pending: true,
      label: "Payout Released",
      desc: "Funds released to your account after approval.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => (
        <div
          key={step.label}
          style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr",
            gap: 16,
            paddingBottom: i < steps.length - 1 ? 24 : 0,
            position: "relative",
          }}
        >
          {/* Line */}
          {i < steps.length - 1 && (
            <div
              style={{
                position: "absolute",
                left: 15,
                top: 28,
                width: 2,
                height: "calc(100% - 8px)",
                background: step.done ? "var(--brand-red)" : "var(--hairline)",
              }}
            />
          )}
          {/* Dot */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: step.done
                ? "var(--brand-red)"
                : step.current
                  ? "var(--surface)"
                  : "var(--surface-3)",
              border: step.done
                ? "2px solid var(--brand-red)"
                : step.current
                  ? "2px solid var(--brand-red)"
                  : "2px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            {step.done && (
              <span style={{ color: "var(--snow)", fontSize: 14 }}>✓</span>
            )}
            {step.current && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--brand-red)",
                }}
              />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingTop: 4 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: step.pending ? "var(--ink-4)" : "var(--ink)",
                marginBottom: 4,
              }}
            >
              {step.label}
              {step.suffix && ` ${step.suffix}`}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                lineHeight: 1.5,
              }}
            >
              {step.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Results Summary ─────────────────────────────────────── */

function ResultsSummary({
  data,
  metrics,
}: {
  data: PageData;
  metrics: DemoMetrics;
}) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        CAMPAIGN RESULTS
      </span>

      {/* Content thumbnails */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 72,
              height: 72,
              background: "var(--surface-3)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--ink-4)",
            }}
            aria-label="Content image placeholder"
          >
            ▶
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--ink-4)",
          marginBottom: 16,
        }}
      >
        Content submitted for {data.merchant}
      </p>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Engagement",
            value: metrics.engagement,
            sub: "likes + comments",
          },
          { label: "Reach", value: metrics.reach, sub: "accounts reached" },
          {
            label: "Conversions",
            value: metrics.conversions,
            sub: "verified walk-ins",
          },
          {
            label: "Payout Earned",
            value: `$${data.amount}`,
            sub: "+ 3% on walk-ins",
          },
        ].map((cell) => (
          <div
            key={cell.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {cell.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1,
              }}
            >
              {cell.value}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              {cell.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Score Impact ────────────────────────────────────────── */

function ScoreImpact({ data }: { data: PageData }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const scoreBefore = data.score - data.score_delta;
  const nextTier = TIER_NEXT[data.tier];
  const remaining = Math.max(0, nextTier.target - data.score);
  const maxScore = 140;
  const fillPct = Math.min(100, (data.score / maxScore) * 100);
  const isClose = remaining > 0 && remaining <= 8;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.width = `${fillPct}%`;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [fillPct]);

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        SCORE IMPACT
      </span>

      {/* +X pts impact callout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
          padding: 16,
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 40,
            fontWeight: 700,
            color: "var(--brand-red)",
            lineHeight: 1,
          }}
        >
          +{data.score_delta.toFixed(1)}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink)",
              fontWeight: 600,
            }}
          >
            Points earned this campaign
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
            }}
          >
            Based on similar campaigns at your tier
          </span>
        </div>
      </div>

      {/* Before → After */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink-4)",
          }}
        >
          {scoreBefore.toFixed(1)} pts
        </span>
        <span style={{ color: "var(--ink-4)", fontSize: 14 }}>→</span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          {data.score.toFixed(1)} pts
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
          }}
        >
          0
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
          }}
        >
          {maxScore}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--surface-3)",
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          ref={fillRef}
          style={{
            width: "0%",
            height: "100%",
            background: "var(--brand-red)",
            borderRadius: 4,
            transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          role="progressbar"
          aria-valuenow={data.score}
          aria-valuemax={maxScore}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          fontStyle: "italic",
          margin: "0 0 12px",
        }}
      >
        Estimated — final score updates after merchant approval
      </p>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-3)",
        }}
      >
        {remaining > 0
          ? `${data.score.toFixed(0)} → ${nextTier.target} pts — ${remaining} more points to reach ${nextTier.label}`
          : `${nextTier.label} tier reached!`}
      </div>

      {isClose && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 16px",
            background: "rgba(193,18,31,0.08)",
            border: "1px solid rgba(193,18,31,0.2)",
            borderRadius: 8,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--brand-red)",
            fontWeight: 600,
          }}
        >
          Just {remaining} points away from {nextTier.label}!
        </div>
      )}
    </div>
  );
}

/* ── Tier Progress ───────────────────────────────────────── */

function TierProgress({ data }: { data: PageData }) {
  const currentIdx = tierIndex(data.tier);
  const nextTier = TIER_NEXT[data.tier];
  const remaining = Math.max(0, nextTier.target - data.score);

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        TIER PROGRESS
      </span>

      {/* Mini tier journey */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
        }}
        role="list"
        aria-label="Tier progression"
      >
        {ALL_TIERS.map((t, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isNext = i === currentIdx + 1;
          const isLast = i === ALL_TIERS.length - 1;

          return (
            <div key={t} style={{ display: "contents" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
                role="listitem"
                aria-label={`${t}${isCurrent ? " (current)" : ""}${isDone ? " (completed)" : ""}`}
              >
                <div
                  style={{
                    width: isCurrent ? 16 : 12,
                    height: isCurrent ? 16 : 12,
                    borderRadius: "50%",
                    background: isDone
                      ? "var(--brand-red)"
                      : isCurrent
                        ? "var(--brand-red)"
                        : "var(--surface-3)",
                    border: isCurrent
                      ? "3px solid var(--brand-red)"
                      : "2px solid var(--hairline)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: isCurrent ? 11 : 10,
                    fontWeight: isCurrent ? 700 : 400,
                    color: isCurrent
                      ? "var(--brand-red)"
                      : isNext
                        ? "var(--ink-3)"
                        : isDone
                          ? "var(--ink-3)"
                          : "var(--ink-4)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </div>
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: isDone ? "var(--brand-red)" : "var(--hairline)",
                    marginBottom: 22,
                    minWidth: 16,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Next tier perk */}
      {data.tier !== "partner" && (
        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-3)",
          }}
        >
          <strong>{nextTier.label}:</strong>{" "}
          {TIER_PERKS[ALL_TIERS[currentIdx + 1] as Tier]}
          {remaining > 0 && ` — ${remaining} pts away`}
        </div>
      )}
    </div>
  );
}

/* ── Payout panel ────────────────────────────────────────── */

function PayoutPanel({ data }: { data: PageData }) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        YOUR ESTIMATED PAYOUT
      </span>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 48,
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        ${data.amount}
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          margin: "0 0 12px",
        }}
      >
        Plus 3% on every verified walk-in (30-day window)
      </p>

      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--ink-3)",
          background: "var(--surface-3)",
          border: "1px solid var(--hairline)",
          borderRadius: 40,
          padding: "4px 12px",
        }}
      >
        {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} tier:{" "}
        {PAYOUT_SPEED[data.tier]}
      </span>
    </div>
  );
}

/* ── Merchant Feedback ───────────────────────────────────── */

function MerchantFeedback({ hasFeedback }: { hasFeedback: boolean }) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        MERCHANT REVIEW
      </span>

      {!hasFeedback ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--ink-4)",
              flexShrink: 0,
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
            }}
          >
            Waiting for merchant review — typically 24–48 hours after
            submission.
          </span>
        </div>
      ) : (
        <>
          <div
            style={{
              color: "var(--brand-red)",
              fontSize: 18,
              letterSpacing: 2,
              marginBottom: 12,
            }}
            aria-label="5 out of 5 stars"
          >
            ★★★★★
          </div>
          <blockquote
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            &ldquo;Great energy and authentic content. The post drove real foot
            traffic — we noticed the spike same day. Would love to work with you
            again.&rdquo;
          </blockquote>
        </>
      )}
    </div>
  );
}

/* ── Next Steps ──────────────────────────────────────────── */

function NextSteps({ data }: { data: PageData }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I just completed a campaign at ${data.merchant}!`,
        text: `Earned $${data.amount} creating content for ${data.merchant} on Push. Check it out at push.so`,
      });
    } else {
      navigator.clipboard
        .writeText(
          `I just completed a campaign at ${data.merchant} on Push! Check out push.so`,
        )
        .catch(() => {});
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 16,
        }}
      >
        WHAT&apos;S NEXT
      </span>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        {/* Primary CTA */}
        <Link
          href="/creator/dashboard?tab=discover"
          className="click-shift"
          style={{
            background: "var(--brand-red)",
            border: "1px solid var(--brand-red)",
            borderRadius: 10,
            padding: 20,
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--snow)",
              lineHeight: 1,
            }}
          >
            +
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--snow)",
            }}
          >
            Find your next campaign
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            New campaigns are added daily. Apply now to keep your score
            climbing.
          </span>
        </Link>

        {/* Share results */}
        <button
          className="click-shift"
          onClick={handleShare}
          type="button"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 20,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            ↑
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            Share results
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
            }}
          >
            Tell your network you&apos;re on Push.
          </span>
        </button>

        {/* View profile */}
        <Link
          href="/creator/profile"
          className="click-shift"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 20,
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            ◉
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            View profile
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
            }}
          >
            See your updated score and tier.
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Tier Upgrade Celebration Overlay ────────────────────── */

function TierCelebration({
  newTier,
  onDismiss,
}: {
  newTier: Tier;
  onDismiss: () => void;
}) {
  return (
    <div
      className="pc-celebration"
      role="dialog"
      aria-modal="true"
      aria-label="Tier upgrade celebration"
    >
      <div className="pc-celebration-confetti" aria-hidden="true" />
      <div className="pc-celebration-eyebrow">Tier Unlocked</div>
      <div className="pc-celebration-title">You&apos;re now</div>
      <div className="pc-celebration-tier">
        {newTier.charAt(0).toUpperCase() + newTier.slice(1)}
      </div>
      <div className="pc-celebration-desc">
        {TIER_PERKS[newTier]} — your new benefits take effect immediately.
      </div>
      <button
        className="pc-celebration-dismiss"
        onClick={onDismiss}
        type="button"
      >
        Let&apos;s go →
      </button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function PostCampaignPage() {
  return (
    <Suspense fallback={<div className="pc-loading">Loading results...</div>}>
      <PostCampaignContent />
    </Suspense>
  );
}

function PostCampaignContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PageData | null>(null);
  const [tagline, setTagline] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [tierUpgraded, setTierUpgraded] = useState<Tier | null>(null);

  // Demo: show merchant feedback after 2s (simulates async load)
  const [feedbackLoaded, setFeedbackLoaded] = useState(false);

  useEffect(() => {
    const isDemo = checkDemoMode();
    let resolved: PageData;

    if (isDemo) {
      resolved = { ...DEMO_DATA };
    } else {
      const amount = parseFloat(searchParams.get("amount") ?? "0");
      const scoreDelta = parseFloat(searchParams.get("score_delta") ?? "0");
      const score = parseFloat(searchParams.get("score") ?? "0");

      resolved = {
        campaign_id: searchParams.get("campaign_id") ?? "",
        amount: isNaN(amount) ? 0 : amount,
        merchant: searchParams.get("merchant") ?? "Campaign",
        category: searchParams.get("category") ?? "",
        tier: (searchParams.get("tier") as Tier) ?? "seed",
        score: isNaN(score) ? 0 : score,
        score_delta: isNaN(scoreDelta) ? 0 : scoreDelta,
        milestone: searchParams.get("milestone") ?? "proof_submitted",
      };
    }

    setData(resolved);
    setTagline(pickTagline(DEMO_CAMPAIGNS_COMPLETED));

    // Check if a tier boundary was crossed
    const scoreBefore = resolved.score - resolved.score_delta;
    const prevTierTarget = TIER_NEXT[resolved.tier]?.target ?? 999;
    const currentIdx = tierIndex(resolved.tier);
    if (currentIdx < ALL_TIERS.length - 1) {
      // Detect if score_delta pushed score past a threshold
      const prevIdx = currentIdx - 1;
      if (prevIdx >= 0) {
        const prevTarget = TIER_NEXT[ALL_TIERS[prevIdx]].target;
        if (scoreBefore < prevTarget && resolved.score >= prevTarget) {
          setTierUpgraded(resolved.tier);
          setShowCelebration(true);
        }
      }
    }

    // Simulate demo feedback arriving
    const feedbackTimer = setTimeout(() => setFeedbackLoaded(true), 2000);
    return () => clearTimeout(feedbackTimer);
  }, [searchParams]);

  if (!data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--surface)",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        LOADING...
      </div>
    );
  }

  const nextTier = TIER_NEXT[data.tier];
  const remaining = Math.max(0, nextTier.target - data.score);

  return (
    <>
      {/* Tier upgrade overlay */}
      {showCelebration && tierUpgraded && (
        <TierCelebration
          newTier={tierUpgraded}
          onDismiss={() => setShowCelebration(false)}
        />
      )}

      <div
        style={{
          background: "var(--surface)",
          minHeight: "100vh",
          paddingBottom: 96,
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 64px" }}>
          {/* ── 1. Hero celebration ──────────────────────── */}
          <div
            style={{
              paddingTop: 56,
              paddingBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            {/* Check icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--brand-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckSVG />
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                CAMPAIGN COMPLETE
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 56,
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                Well done.
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink-3)",
                }}
              >
                {data.merchant}
              </span>
              {data.category && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                    background: "var(--surface-3)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 40,
                    padding: "2px 10px",
                  }}
                >
                  {data.category}
                </span>
              )}
            </div>

            {/* Big celebratory payout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Estimated payout
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "var(--brand-red)",
                  lineHeight: 1,
                }}
              >
                ${data.amount}
              </span>
            </div>
          </div>

          {/* ── Body sections ─────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 2. Results Summary */}
            <ResultsSummary data={data} metrics={DEMO_METRICS} />

            {/* 3. What happens next */}
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: 24,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 24,
                }}
              >
                WHAT HAPPENS NEXT
              </span>
              <Timeline />
            </div>

            {/* 4. Score Impact */}
            <ScoreImpact data={data} />

            {/* 5. Tier Progress */}
            <TierProgress data={data} />

            {/* 6. Merchant Feedback */}
            <MerchantFeedback hasFeedback={feedbackLoaded} />

            {/* 7. Next Steps */}
            <NextSteps data={data} />
          </div>

          {/* ── Bottom motivation ──────────────────────────── */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
              }}
            >
              {DEMO_CAMPAIGNS_COMPLETED} campaigns completed.{" "}
              {remaining.toFixed(0)} more points to {nextTier.label}.
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              {tagline}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
