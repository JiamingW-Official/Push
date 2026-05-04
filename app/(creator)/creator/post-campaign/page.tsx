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
    <div className="pc-timeline">
      {steps.map((step, i) => (
        <div
          key={step.label}
          className={`pc-timeline-item${i < steps.length - 1 ? " pc-timeline-item--spaced" : ""}`}
        >
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={`pc-timeline-connector${step.done ? " pc-timeline-connector--done" : ""}`}
            />
          )}

          {/* Icon tile — 40×40 with surface-3 bg + 10px radius */}
          <div
            className={`pc-timeline-icon-tile${
              step.done
                ? " pc-timeline-icon-tile--done"
                : step.current
                  ? " pc-timeline-icon-tile--current"
                  : " pc-timeline-icon-tile--pending"
            }`}
          >
            {step.done && <span className="pc-timeline-check">✓</span>}
            {step.current && <span className="pc-timeline-pulse" />}
          </div>

          {/* Content */}
          <div className="pc-timeline-content">
            <div
              className={`pc-timeline-label${step.pending ? " pc-timeline-label--pending" : ""}`}
            >
              {step.label}
              {step.suffix && ` ${step.suffix}`}
            </div>
            <div className="pc-timeline-desc">{step.desc}</div>
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
    <div className="pc-section">
      <span className="pc-section-eyebrow">CAMPAIGN RESULTS</span>

      {/* Content thumbnails */}
      <div className="pc-results-thumbs">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="pc-content-thumb"
            aria-label="Content image placeholder"
          >
            ▶
          </div>
        ))}
      </div>

      <p className="pc-results-meta">Content submitted for {data.merchant}</p>

      {/* Metrics grid */}
      <div className="pc-metrics-grid">
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
          <div key={cell.label} className="pc-metric-cell">
            <span className="pc-metric-label">{cell.label}</span>
            <span className="pc-metric-value">{cell.value}</span>
            <span className="pc-metric-sub">{cell.sub}</span>
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
    <div className="pc-section">
      <span className="pc-section-eyebrow">SCORE IMPACT</span>

      {/* +X pts impact callout — champagne accent for score delta */}
      <div className="pc-score-impact-callout">
        <span className="pc-score-delta-number">
          +{data.score_delta.toFixed(1)}
        </span>
        <div className="pc-score-impact-info">
          <span className="pc-score-impact-label">
            Points earned this campaign
          </span>
          <span className="pc-score-impact-sub">
            Based on similar campaigns at your tier
          </span>
        </div>
      </div>

      {/* Before → After */}
      <div className="pc-score-transition">
        <span className="pc-score-before">{scoreBefore.toFixed(1)} pts</span>
        <span className="pc-score-arrow">→</span>
        <span className="pc-score-after">{data.score.toFixed(1)} pts</span>
      </div>

      {/* Progress bar labels */}
      <div className="pc-score-bar-labels">
        <span className="pc-score-bar-label">0</span>
        <span className="pc-score-bar-label">{maxScore}</span>
      </div>

      {/* Tier progress bar — spec I */}
      <div className="pc-tier-bar-track">
        <div
          ref={fillRef}
          className="pc-tier-bar-fill"
          style={{ width: "0%" }}
          role="progressbar"
          aria-valuenow={data.score}
          aria-valuemax={maxScore}
        />
      </div>

      <p className="pc-score-disclaimer">
        Estimated — final score updates after merchant approval
      </p>

      <div className="pc-score-next-info">
        {remaining > 0
          ? `${data.score.toFixed(0)} → ${nextTier.target} pts — ${remaining} more points to reach ${nextTier.label}`
          : `${nextTier.label} tier reached!`}
      </div>

      {isClose && (
        <div className="pc-score-close-alert">
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
    <div className="pc-section">
      <span className="pc-section-eyebrow">TIER PROGRESS</span>

      {/* Mini tier journey */}
      <div
        className="pc-tier-journey"
        role="list"
        aria-label="Tier progression"
      >
        {ALL_TIERS.map((t, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isNext = i === currentIdx + 1;
          const isLast = i === ALL_TIERS.length - 1;

          return (
            <div key={t} className="pc-tier-node-wrapper">
              <div
                className="pc-tier-node"
                role="listitem"
                aria-label={`${t}${isCurrent ? " (current)" : ""}${isDone ? " (completed)" : ""}`}
              >
                <div
                  className={`pc-tier-dot${
                    isDone
                      ? " pc-tier-dot--done"
                      : isCurrent
                        ? " pc-tier-dot--current"
                        : ""
                  }`}
                />
                <span
                  className={`pc-tier-label${
                    isCurrent
                      ? " pc-tier-label--current"
                      : isNext
                        ? " pc-tier-label--next"
                        : isDone
                          ? " pc-tier-label--done"
                          : ""
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`pc-tier-connector${isDone ? " pc-tier-connector--done" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Next tier perk — tier upgrade indicator uses champagne */}
      {data.tier !== "partner" && (
        <div className="pc-tier-perk">
          <strong className="pc-tier-upgrade-text">{nextTier.label}:</strong>{" "}
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
    <div className="pc-section">
      <span className="pc-section-eyebrow">YOUR ESTIMATED PAYOUT</span>

      <div className="pc-payout-panel-amount">${data.amount}</div>

      <p className="pc-payout-commission">
        Plus 3% on every verified walk-in (30-day window)
      </p>

      <span className="pc-payout-speed-badge">
        {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} tier:{" "}
        {PAYOUT_SPEED[data.tier]}
      </span>
    </div>
  );
}

/* ── Merchant Feedback ───────────────────────────────────── */

function MerchantFeedback({ hasFeedback }: { hasFeedback: boolean }) {
  return (
    <div className="pc-section">
      <span className="pc-section-eyebrow">MERCHANT REVIEW</span>

      {!hasFeedback ? (
        <div className="pc-feedback-waiting">
          <span className="pc-feedback-dot" />
          <span className="pc-feedback-waiting-text">
            Waiting for merchant review — typically 24–48 hours after
            submission.
          </span>
        </div>
      ) : (
        <>
          <div className="pc-feedback-stars" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <blockquote className="pc-feedback-quote">
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
    <div className="pc-section">
      <span className="pc-section-eyebrow">WHAT&apos;S NEXT</span>

      <div className="pc-next-steps-grid">
        {/* Primary CTA — Find Next Campaign → btn btn-primary */}
        <Link
          href="/creator/dashboard?tab=discover"
          className="pc-next-step-card pc-next-step-card--primary click-shift"
        >
          <span className="pc-next-step-icon">+</span>
          <span className="pc-next-step-title">Find your next campaign</span>
          <span className="pc-next-step-desc">
            New campaigns are added daily. Apply now to keep your score
            climbing.
          </span>
        </Link>

        {/* Share results — Share on Instagram → btn btn-ghost */}
        <button
          className="pc-next-step-card click-shift"
          onClick={handleShare}
          type="button"
        >
          <span className="pc-next-step-icon">↑</span>
          <span className="pc-next-step-title">Share results</span>
          <span className="pc-next-step-desc">
            Tell your network you&apos;re on Push.
          </span>
        </button>

        {/* View profile */}
        <Link href="/creator/profile" className="pc-next-step-card click-shift">
          <span className="pc-next-step-icon">◉</span>
          <span className="pc-next-step-title">View profile</span>
          <span className="pc-next-step-desc">
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
    return <div className="pc-loading">LOADING...</div>;
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

      <div className="pc-page-shell">
        <div className="pc-container">
          {/* ── 1. Hero celebration ──────────────────────── */}
          <div className="pc-hero">
            {/* Check icon tile */}
            <div className="pc-check-icon-tile">
              <CheckSVG />
            </div>

            <div className="pc-hero-heading">
              <span className="pc-hero-eyebrow">CAMPAIGN COMPLETE</span>
              <h1 className="pc-hero-title">Well done.</h1>
            </div>

            <div className="pc-hero-meta">
              <span className="pc-merchant-name">{data.merchant}</span>
              {data.category && (
                <span className="pc-category-chip">{data.category}</span>
              )}
            </div>

            {/* Liquid-glass celebration payout tile */}
            <div className="pc-payout-tile">
              <span className="pc-payout-label">Estimated payout</span>
              <span className="pc-payout-amount">${data.amount}</span>
            </div>
          </div>

          {/* Magvix Italic Signature Divider #1 */}
          <p className="pc-divider">
            Campaign complete · Payout processing · Verified ·
          </p>

          {/* ── Body sections ─────────────────────────────── */}
          <div className="pc-body-sections">
            {/* 2. Results Summary */}
            <ResultsSummary data={data} metrics={DEMO_METRICS} />

            {/* 3. What happens next */}
            <div className="pc-section">
              <span className="pc-section-eyebrow pc-section-eyebrow--wide-mb">
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
          <div className="pc-motivation">
            <div className="pc-motivation-count">
              {DEMO_CAMPAIGNS_COMPLETED} campaigns completed.{" "}
              {remaining.toFixed(0)} more points to {nextTier.label}.
            </div>
            <div className="pc-motivation-tagline">{tagline}</div>
          </div>
        </div>
      </div>
    </>
  );
}
