"use client";
import { useEffect, useState } from "react";
import "./first-paycheck.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tier = "seed" | "explorer" | "operator" | "proven" | "closer" | "partner";

type FirstPaycheckProps = {
  amount: number;
  campaignTitle: string;
  merchantName: string;
  creatorName: string;
  tier?: Tier;
  onDismiss: () => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a dollar amount to English words (handles common payout sizes). */
function amountToWords(n: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const dollars = Math.floor(n);
  const cents = Math.round((n - dollars) * 100);

  function below100(num: number): string {
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 ? `-${ones[num % 10]}` : "");
  }

  function below1000(num: number): string {
    if (num < 100) return below100(num);
    return `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ` ${below100(num % 100)}` : ""}`;
  }

  let words = "";
  if (dollars >= 1000) {
    words += `${below1000(Math.floor(dollars / 1000))} Thousand `;
  }
  words += below1000(dollars % 1000);
  words = words.trim() || "Zero";

  return cents > 0 ? `${words} and ${cents}/100 Dollars` : `${words} Dollars`;
}

/** Format today's date as "April 12, 2026". */
function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a number as USD currency string. */
function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

const TIER_NEXT_LABEL: Record<Tier, string> = {
  seed: "Explorer",
  explorer: "Operator",
  operator: "Proven",
  proven: "Closer",
  closer: "Partner",
  partner: "Partner",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FirstPaycheck({
  amount,
  campaignTitle,
  merchantName,
  creatorName,
  tier = "seed",
  onDismiss,
}: FirstPaycheckProps) {
  const [counting, setCounting] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shareConfirm, setShareConfirm] = useState(false);
  // Timer bar width — starts at 100% and drains to 0 over 5 seconds
  const [timerWidth, setTimerWidth] = useState(100);

  // Count-up animation (1.2 s duration)
  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const increment = amount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= amount) {
        setCounting(amount);
        clearInterval(timer);
        // Show card + actions 300 ms after count finishes
        setTimeout(() => setShowCard(true), 300);
      } else {
        setCounting(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [amount]);

  // Auto-dismiss after 5 seconds once card is visible
  useEffect(() => {
    if (!showCard) return;

    // Kick off the CSS drain transition
    const kickOff = setTimeout(() => {
      setTimerWidth(0);
    }, 50);

    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      clearTimeout(kickOff);
      clearTimeout(dismissTimer);
    };
  }, [showCard, onDismiss]);

  // Share handler — copies a text summary to clipboard
  const handleShare = async () => {
    const text =
      `I just got my first Push paycheck!\n` +
      `${formatUSD(amount)} from "${campaignTitle}" at ${merchantName}.\n` +
      `Start earning with Push -> push.so`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard not available — silently ignore
    }

    setShareConfirm(true);
    setTimeout(() => setShareConfirm(false), 2500);
  };

  const nextTierLabel = tier !== "partner" ? TIER_NEXT_LABEL[tier] : null;

  return (
    <div
      className="fp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="First paycheck celebration"
      onClick={onDismiss}
    >
      {/* Auto-dismiss progress bar */}
      {showCard && (
        <div className="fp-timer-bar" aria-hidden="true">
          <div className="fp-timer-fill" style={{ width: `${timerWidth}%` }} />
        </div>
      )}

      {/* Confetti layers */}
      <div className="fp-confetti" aria-hidden="true" />
      <div className="fp-confetti-extra" aria-hidden="true" />

      {/* Headline */}
      <div className="fp-headline">
        <span className="fp-headline-text">
          You just earned your first payout on Push!
        </span>
      </div>

      {/* Amount counter */}
      <div className="fp-amount-wrap" onClick={(e) => e.stopPropagation()}>
        <span className="fp-label">First Push paycheck</span>
        <span className="fp-amount" aria-live="polite" aria-atomic="true">
          {formatUSD(counting)}
        </span>
      </div>

      {/* Tier badge */}
      <div className="fp-tier-badge" onClick={(e) => e.stopPropagation()}>
        <div className="fp-tier-badge-dot" aria-hidden="true" />
        <span className="fp-tier-badge-label">Current tier</span>
        <span className="fp-tier-badge-tier">
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      </div>

      {/* Motivation */}
      {nextTierLabel && (
        <div className="fp-motivation" onClick={(e) => e.stopPropagation()}>
          Keep going — {nextTierLabel} tier unlocks higher pay and faster
          payouts.
        </div>
      )}

      {/* Paycheck card — appears after count-up */}
      {showCard && (
        <div
          className="fp-card"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header row */}
          <div className="fp-card-header">
            <span className="fp-card-brand">PUSH</span>
            <span className="fp-card-date">{formatDate()}</span>
          </div>

          {/* Pay to */}
          <div className="fp-card-row">
            <span className="fp-card-payto">Pay to the order of</span>
            <span className="fp-card-name">{creatorName}</span>
          </div>

          {/* Amount in words */}
          <div className="fp-card-row">
            <span className="fp-card-payto">Amount</span>
            <span className="fp-card-amount-words">
              {amountToWords(amount)}
            </span>
          </div>

          {/* For */}
          <div className="fp-card-row">
            <span className="fp-card-for">For</span>
            <span className="fp-card-campaign">{campaignTitle}</span>
            <span className="fp-card-merchant">at {merchantName}</span>
          </div>

          {/* Rubber stamp */}
          <div className="fp-stamp" aria-hidden="true">
            PUSH
          </div>
        </div>
      )}

      {/* Action buttons */}
      {showCard && (
        <div className="fp-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="fp-share-btn"
            onClick={handleShare}
            aria-label="Share this moment"
            type="button"
          >
            {shareConfirm ? "Copied!" : "Share this moment"}
          </button>
          <button
            className="fp-continue-btn"
            onClick={onDismiss}
            aria-label="Continue earning"
            type="button"
          >
            Keep earning →
          </button>
        </div>
      )}
    </div>
  );
}
