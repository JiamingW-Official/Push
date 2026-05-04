"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import "../inbox.css";

/* ── Types ───────────────────────────────────────────────────── */

type InviteStatus = "pending" | "accepted" | "declined";

type ConfirmAction = "accept" | "decline" | null;

type InviteFilter = "all" | "urgent" | "match";

type Invite = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  matchScore: number;
  minEarn: number;
  maxEarn: number;
  bonusEarn: number;
  expiresAt: number;
  status: InviteStatus;
  category: string;
};

/* ── Seed data ───────────────────────────────────────────────── */

const SEED_INVITES: Invite[] = [
  {
    id: "inv-001",
    brand: "Roberta's Pizza",
    brandInitial: "R",
    campaign: "Summer Menu Launch",
    matchScore: 98,
    minEarn: 40,
    maxEarn: 65,
    bonusEarn: 85,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000 + 23 * 60 * 1000,
    status: "pending",
    category: "Food & Beverage",
  },
  {
    id: "inv-002",
    brand: "Flamingo Estate",
    brandInitial: "F",
    campaign: "Wellness Weekend",
    matchScore: 94,
    minEarn: 55,
    maxEarn: 70,
    bonusEarn: 85,
    expiresAt: Date.now() + 11 * 60 * 60 * 1000,
    status: "pending",
    category: "Lifestyle",
  },
  {
    id: "inv-003",
    brand: "Fort Greene Coffee",
    brandInitial: "G",
    campaign: "Morning Ritual Series",
    matchScore: 91,
    minEarn: 35,
    maxEarn: 55,
    bonusEarn: 70,
    expiresAt: Date.now() + 26 * 60 * 60 * 1000,
    status: "pending",
    category: "Coffee & Cafe",
  },
  {
    id: "inv-004",
    brand: "Bed-Stuy Eats",
    brandInitial: "B",
    campaign: "Local Favorites Reel",
    matchScore: 82,
    minEarn: 30,
    maxEarn: 50,
    bonusEarn: 65,
    expiresAt: Date.now() + 48 * 60 * 60 * 1000,
    status: "pending",
    category: "Food & Beverage",
  },
  {
    id: "inv-005",
    brand: "Brow Theory",
    brandInitial: "B",
    campaign: "Spring Beauty Campaign",
    matchScore: 79,
    minEarn: 45,
    maxEarn: 60,
    bonusEarn: 75,
    expiresAt: Date.now() + 72 * 60 * 60 * 1000,
    status: "pending",
    category: "Beauty & Wellness",
  },
];

/* ── Category gradients ──────────────────────────────────────── */

const CATEGORY_GRADIENT: Record<string, string> = {
  "Food & Beverage":
    "linear-gradient(140deg, var(--cat-dining-deep) 0%, var(--cat-dining) 100%)",
  Lifestyle:
    "linear-gradient(140deg, var(--cat-travel-deep) 0%, var(--cat-travel) 100%)",
  "Coffee & Cafe":
    "linear-gradient(140deg, var(--cat-fashion-deep) 0%, var(--cat-fashion) 100%)",
  "Beauty & Wellness":
    "linear-gradient(140deg, var(--cat-beauty-deep) 0%, var(--cat-beauty) 100%)",
};

function getCategoryGradient(category: string): string {
  return (
    CATEGORY_GRADIENT[category] ??
    "linear-gradient(140deg, var(--graphite) 0%, var(--char) 100%)"
  );
}

/* ── Countdown hook ──────────────────────────────────────────── */

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (remaining <= 0) return "Expired";

  const totalMins = Math.floor(remaining / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

/* ── Icons (inline SVG, no external deps) ────────────────────── */

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 3.5V6L7.6 7.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InboxEmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="6"
        y="10"
        width="28"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 18l14 8 14-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Invite card ─────────────────────────────────────────────── */

function InviteCard({
  invite,
  isTopRecommended,
  onAccept,
  onDecline,
}: {
  invite: Invite;
  isTopRecommended: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const countdown = useCountdown(invite.expiresAt);
  const accepted = invite.status === "accepted";
  const declined = invite.status === "declined";
  const remainingMs = invite.expiresAt - Date.now();
  const isUrgent = remainingMs < 6 * 60 * 60 * 1000 && remainingMs > 0;
  const isExpired = remainingMs <= 0;

  // Two-step confirm — first click arms, second click commits.
  const [confirming, setConfirming] = useState<ConfirmAction>(null);

  // Reset arm state if user navigates away from the card or status changes.
  useEffect(() => {
    if (accepted || declined) setConfirming(null);
  }, [accepted, declined]);

  const handleAcceptClick = useCallback(() => {
    if (confirming === "accept") {
      onAccept(invite.id);
      setConfirming(null);
    } else {
      setConfirming("accept");
    }
  }, [confirming, invite.id, onAccept]);

  const handleDeclineClick = useCallback(() => {
    if (confirming === "decline") {
      onDecline(invite.id);
      setConfirming(null);
    } else {
      setConfirming("decline");
    }
  }, [confirming, invite.id, onDecline]);

  const handleCancelConfirm = useCallback(() => setConfirming(null), []);

  if (declined) return null;

  const earnRange =
    invite.minEarn === invite.maxEarn
      ? `$${invite.minEarn}`
      : `$${invite.minEarn}–${invite.maxEarn}`;

  return (
    <article
      className={`inv-card${accepted ? " inv-card--accepted" : ""}${isTopRecommended && !accepted ? " inv-card--recommended" : ""}`}
      aria-label={`${invite.brand} — ${invite.campaign} — ${earnRange}, ${countdown}`}
    >
      {/* Image / gradient area */}
      <div
        className="inv-card-img"
        style={{ background: getCategoryGradient(invite.category) }}
        role="presentation"
      >
        {/* Brand monogram */}
        <span className="inv-card-initial" aria-hidden>
          {invite.brandInitial}
        </span>

        {/* Recommended stamp — Editorial Pink, ≤1 per page (top match only) */}
        {isTopRecommended && !accepted && (
          <span className="inv-card-recommend" aria-hidden>
            Recommended
          </span>
        )}

        {/* Match score badge */}
        <span
          className={`inv-card-match${invite.matchScore >= 90 ? " inv-card-match--high" : ""}`}
        >
          {invite.matchScore}% match
        </span>

        {/* Countdown timer — aria-live so screen readers announce urgency */}
        <span
          className={`inv-card-timer${isUrgent ? " inv-card-timer--urgent" : ""}${isExpired ? " inv-card-timer--expired" : ""}`}
          aria-live={isUrgent ? "polite" : "off"}
        >
          <span className="inv-card-timer-icon" aria-hidden>
            <ClockIcon />
          </span>
          {countdown}
        </span>
      </div>

      {/* Content — info hierarchy: brand → campaign → earn → actions */}
      <div className="inv-card-body">
        <p className="inv-card-cat">{invite.category}</p>
        <h3 className="inv-card-brand">{invite.brand}</h3>
        <p className="inv-card-campaign">{invite.campaign}</p>

        <dl className="inv-card-earn-row" aria-label="Estimated earnings">
          <div className="inv-card-earn-block">
            <dt className="inv-card-earn-label">Base</dt>
            <dd className="inv-card-earn">{earnRange}</dd>
          </div>
          <div className="inv-card-earn-block inv-card-earn-block--bonus">
            <dt className="inv-card-earn-label">Up to</dt>
            <dd className="inv-card-earn-bonus">${invite.bonusEarn}</dd>
          </div>
        </dl>

        <div className="inv-card-actions">
          {accepted ? (
            <span className="inv-card-accepted-badge" role="status">
              Accepted
            </span>
          ) : confirming ? (
            <>
              <button
                type="button"
                className={`inv-card-confirm-btn${confirming === "decline" ? " inv-card-confirm-btn--decline" : ""}`}
                onClick={
                  confirming === "accept"
                    ? handleAcceptClick
                    : handleDeclineClick
                }
                aria-label={
                  confirming === "accept"
                    ? `Confirm accept ${invite.brand}`
                    : `Confirm decline ${invite.brand}`
                }
              >
                {confirming === "accept" ? "Confirm accept" : "Confirm decline"}
              </button>
              <button
                type="button"
                className="inv-card-cancel-btn"
                onClick={handleCancelConfirm}
                aria-label="Cancel"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="inv-card-accept-btn"
                onClick={handleAcceptClick}
                disabled={isExpired}
                aria-label={`Accept invite from ${invite.brand}`}
              >
                Accept
              </button>
              <button
                type="button"
                className="inv-card-decline-btn"
                onClick={handleDeclineClick}
                aria-label={`Decline invite from ${invite.brand}`}
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>(SEED_INVITES);
  const [batchAccepted, setBatchAccepted] = useState(false);
  const [batchConfirming, setBatchConfirming] = useState(false);
  const [filter, setFilter] = useState<InviteFilter>("all");

  const pending = invites.filter((i) => i.status === "pending");
  const topMatches = pending.filter((i) => i.matchScore >= 90);
  const showBatchBar = topMatches.length >= 2 && !batchAccepted;

  // Top recommended — ONE editorial moment per page max (§ 2.3, ≤1 per viewport)
  // Picks the highest-scoring pending invite, only when score ≥ 95.
  const topRecommendedId = useMemo(() => {
    const candidates = pending.filter((i) => i.matchScore >= 95);
    if (candidates.length === 0) return null;
    return candidates.reduce((best, cur) =>
      cur.matchScore > best.matchScore ? cur : best,
    ).id;
  }, [pending]);

  const urgentCount = invites.filter(
    (i) =>
      i.status === "pending" && i.expiresAt - Date.now() < 6 * 60 * 60 * 1000,
  ).length;
  const matchCount = invites.filter(
    (i) => i.status === "pending" && i.matchScore >= 90,
  ).length;

  const filteredInvites = useMemo(() => {
    if (filter === "urgent")
      return invites.filter(
        (i) =>
          i.status === "pending" &&
          i.expiresAt - Date.now() < 6 * 60 * 60 * 1000,
      );
    if (filter === "match")
      return invites.filter(
        (i) => i.status === "pending" && i.matchScore >= 90,
      );
    return invites;
  }, [invites, filter]);

  const handleAccept = useCallback((id: string) => {
    setInvites((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "accepted" } : i)),
    );
  }, []);

  const handleDecline = useCallback((id: string) => {
    setInvites((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "declined" } : i)),
    );
  }, []);

  const handleBatchClick = useCallback(() => {
    if (batchConfirming) {
      setInvites((prev) =>
        prev.map((i) =>
          i.matchScore >= 90 && i.status === "pending"
            ? { ...i, status: "accepted" }
            : i,
        ),
      );
      setBatchAccepted(true);
      setBatchConfirming(false);
    } else {
      setBatchConfirming(true);
    }
  }, [batchConfirming]);

  return (
    <div className="ib-content">
      {/* Action bar — LINKS canonical eyebrow + count + batch CTA */}
      <div className="ib-sys-bar">
        <div className="ib-sys-bar-left">
          <span className="ib-sys-eyebrow">LINKS / INVITES</span>
          <span className="ib-sys-count" aria-live="polite">
            {pending.length > 0
              ? `${pending.length} open invite${pending.length !== 1 ? "s" : ""}`
              : "All invites handled"}
          </span>
        </div>
        {showBatchBar && (
          <div className="ib-batch-cluster">
            {batchConfirming && (
              <button
                type="button"
                className="ib-batch-cancel-btn"
                onClick={() => setBatchConfirming(false)}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className={`ib-mark-all-btn${batchConfirming ? " ib-mark-all-btn--confirm" : ""}`}
              onClick={handleBatchClick}
              aria-label={
                batchConfirming
                  ? `Confirm accepting ${topMatches.length} top matches`
                  : `Accept ${topMatches.length} top matches`
              }
            >
              {batchConfirming
                ? `Confirm · accept ${topMatches.length}`
                : `Accept ${topMatches.length} top matches`}
            </button>
          </div>
        )}
      </div>

      {/* Filter chips — unified with Messages and System tabs */}
      <div className="ib-filter-row" role="group" aria-label="Filter invites">
        {(["all", "urgent", "match"] as const).map((f) => {
          const count =
            f === "urgent"
              ? urgentCount
              : f === "match"
                ? matchCount
                : pending.length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`ib-chip${filter === f ? " ib-chip--active" : ""}`}
            >
              {f === "all" ? "All" : f === "urgent" ? "Urgent" : "Top Match"}
              {count > 0 && f !== "all" && (
                <span className="ib-chip-count"> · {count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      {filteredInvites.length === 0 ? (
        <div className="ib-empty">
          <span className="ib-empty-icon" aria-hidden>
            <InboxEmptyIcon />
          </span>
          <p className="ib-empty-title">
            {filter === "urgent"
              ? "Nothing urgent."
              : filter === "match"
                ? "No top matches right now."
                : "All caught up."}
          </p>
          <p className="ib-empty-body">
            {filter === "all"
              ? "New campaign matches land here when brands invite you."
              : "Try clearing the filter — or browse open campaigns."}
          </p>
          <Link href="/creator/discover" className="ib-empty-cta">
            Browse open campaigns
          </Link>
        </div>
      ) : (
        <div className="inv-grid">
          {filteredInvites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              isTopRecommended={invite.id === topRecommendedId}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
