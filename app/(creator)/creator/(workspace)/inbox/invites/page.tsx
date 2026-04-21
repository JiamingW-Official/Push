"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/lib/notifications/useNotifications";
import "../inbox.css";

/* ── Types ───────────────────────────────────────────────────── */

type InviteStatus = "pending" | "accepted" | "declined";

type Invite = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  matchScore: number;
  minEarn: number;
  maxEarn: number;
  bonusEarn: number;
  expiresAt: number; // timestamp ms
  status: InviteStatus;
  category: string;
};

/* ── Seed invites ────────────────────────────────────────────── */

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
    expiresAt: Date.now() + 4 * 60 * 60 * 1000 + 23 * 60 * 1000, // 4h 23m
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
    expiresAt: Date.now() + 11 * 60 * 60 * 1000, // 11h
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
    expiresAt: Date.now() + 26 * 60 * 60 * 1000, // 26h
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
    expiresAt: Date.now() + 48 * 60 * 60 * 1000, // 48h
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

/* ── Countdown hook ──────────────────────────────────────────── */

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 30000); // update every 30s
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

/* ── Earn bar ────────────────────────────────────────────────── */

function EarnBar({
  min,
  max,
  bonus,
}: {
  min: number;
  max: number;
  bonus: number;
}) {
  // Fill to max as % of bonus range
  const fillPct = Math.round(((max - min) / (bonus - min)) * 100);
  const bonusMarkerPct = Math.round(((bonus - min) / (bonus - min)) * 100); // 100%

  return (
    <div className="invite-earn-bar-wrap">
      <div className="invite-earn-bar-labels">
        <span className="invite-earn-label">${min} base</span>
        <span className="invite-earn-label">${max} max</span>
        <span className="invite-earn-label invite-earn-label--bonus">
          ${bonus} bonus
        </span>
      </div>
      <div className="invite-earn-track">
        <div className="invite-earn-fill" style={{ width: `${fillPct}%` }} />
        <div
          className="invite-earn-bonus-marker"
          style={{ left: `${bonusMarkerPct - 1}%` }}
        />
      </div>
    </div>
  );
}

/* ── Invite card ─────────────────────────────────────────────── */

function InviteCard({
  invite,
  onAccept,
  onDecline,
}: {
  invite: Invite;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const countdown = useCountdown(invite.expiresAt);
  const accepted = invite.status === "accepted";
  const declined = invite.status === "declined";

  if (declined) return null;

  return (
    <div className={`invite-card${accepted ? " invite-card--accepted" : ""}`}>
      <div className="invite-card-header">
        <div className="invite-card-left">
          <div className="invite-card-avatar">{invite.brandInitial}</div>
          <div className="invite-card-meta">
            <div className="invite-card-brand">{invite.brand}</div>
            <div className="invite-card-campaign">{invite.campaign}</div>
          </div>
        </div>
        <div className="invite-card-badges">
          {invite.matchScore >= 90 && (
            <span className="invite-card-match">
              {invite.matchScore}% match
            </span>
          )}
          <span className="invite-card-countdown">{countdown}</span>
        </div>
      </div>

      <EarnBar
        min={invite.minEarn}
        max={invite.maxEarn}
        bonus={invite.bonusEarn}
      />

      <div className="invite-card-actions">
        {accepted ? (
          <button
            className="invite-btn-accept invite-btn-accept--accepted"
            disabled
          >
            Accepted ✓
          </button>
        ) : (
          <button
            className="invite-btn-accept"
            onClick={() => onAccept(invite.id)}
          >
            Accept
          </button>
        )}
        {!accepted && (
          <button
            className="invite-btn-decline"
            onClick={() => onDecline(invite.id)}
          >
            Decline
          </button>
        )}
        <button className="invite-btn-details">View details</button>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function InvitesPage() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications("creator");
  const [invites, setInvites] = useState<Invite[]>(SEED_INVITES);
  const [batchAccepted, setBatchAccepted] = useState(false);

  const pending = invites.filter((i) => i.status === "pending");
  const topMatches = pending.filter((i) => i.matchScore >= 90);
  const showBatchBar = topMatches.length >= 3 && !batchAccepted;

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

  const handleAcceptAllMatching = useCallback(() => {
    setInvites((prev) =>
      prev.map((i) =>
        i.matchScore >= 90 && i.status === "pending"
          ? { ...i, status: "accepted" }
          : i,
      ),
    );
    setBatchAccepted(true);
  }, []);

  const unreadMessages = 2;
  const systemUnread = unreadCount;
  const pendingCount = pending.length;

  return (
    <div className="invites-page">
      {/* Top nav */}
      <header className="inbox-nav">
        <Link href="/creator/dashboard" className="inbox-nav-back">
          ← Dashboard
        </Link>
        <span className="inbox-nav-title">Inbox.</span>
        <div className="inbox-live-indicator">
          <span className="inbox-live-dot" />
          <span className="inbox-live-label">Live</span>
        </div>
      </header>

      {/* Section tabs */}
      <nav className="inbox-tabs">
        <Link
          href="/creator/inbox"
          className={`inbox-tab${!pathname?.endsWith("/invites") && !pathname?.endsWith("/system") ? " inbox-tab--active" : ""}`}
        >
          Messages
          {unreadMessages > 0 && (
            <span className="inbox-tab-badge">{unreadMessages}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/invites"
          className={`inbox-tab${pathname?.endsWith("/invites") ? " inbox-tab--active" : ""}`}
        >
          Invites
          {pendingCount > 0 && (
            <span className="inbox-tab-badge">{pendingCount}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/system"
          className={`inbox-tab${pathname?.endsWith("/system") ? " inbox-tab--active" : ""}`}
        >
          System
          {systemUnread > 0 && (
            <span className="inbox-tab-badge">{systemUnread}</span>
          )}
        </Link>
      </nav>

      {/* Batch accept bar */}
      {showBatchBar && (
        <div className="invites-batch-bar">
          <span className="invites-batch-text">
            {topMatches.length} invites match your top niches (90%+ match)
          </span>
          <button
            className="invites-batch-btn"
            onClick={handleAcceptAllMatching}
          >
            Accept all matching
          </button>
        </div>
      )}

      {/* Invite list */}
      <div className="invites-list">
        {invites.every((i) => i.status !== "pending") ? (
          <div className="inbox-empty">
            <p className="inbox-empty-title">All done.</p>
            <p className="inbox-empty-body">
              No pending invites. New campaign matches will appear here.
            </p>
          </div>
        ) : (
          invites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        )}
      </div>
    </div>
  );
}
