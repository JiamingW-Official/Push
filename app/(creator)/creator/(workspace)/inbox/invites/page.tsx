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
  const fillPct = Math.round(((max - min) / (bonus - min)) * 100);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-3)",
          marginBottom: 6,
        }}
      >
        <span>${min} base</span>
        <span>${max} max</span>
        <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
          ${bonus} bonus
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--hairline)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${fillPct}%`,
            borderRadius: 3,
            background: "var(--accent-blue)",
          }}
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
    <div
      style={{
        background: accepted ? "var(--surface)" : "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: "20px 24px",
        opacity: accepted ? 0.75 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {/* Left: avatar + meta */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--snow)",
              flexShrink: 0,
            }}
          >
            {invite.brandInitial}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--ink)",
                marginBottom: 2,
              }}
            >
              {invite.brand}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-3)",
              }}
            >
              {invite.campaign}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {invite.category}
            </div>
          </div>
        </div>

        {/* Right: badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          {invite.matchScore >= 90 && (
            <span
              className="eyebrow"
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                background: "var(--accent-blue)",
                color: "var(--snow)",
                fontSize: 11,
              }}
            >
              {invite.matchScore}% match
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-3)",
            }}
          >
            {countdown}
          </span>
        </div>
      </div>

      <EarnBar
        min={invite.minEarn}
        max={invite.maxEarn}
        bonus={invite.bonusEarn}
      />

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {accepted ? (
          <button
            className="btn-primary"
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            Accepted
          </button>
        ) : (
          <button
            className="btn-primary click-shift"
            onClick={() => onAccept(invite.id)}
          >
            Accept
          </button>
        )}
        {!accepted && (
          <button
            className="btn-ghost click-shift"
            onClick={() => onDecline(invite.id)}
          >
            Decline
          </button>
        )}
        <button
          className="btn-ghost click-shift"
          style={{ marginLeft: "auto" }}
        >
          View details
        </button>
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
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100%",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
      >
        <Link
          href="/creator/dashboard"
          className="click-shift"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-3)",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          ← Dashboard
        </Link>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--ink)",
          }}
        >
          Inbox
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Live
          </span>
        </div>
      </header>

      {/* Section tabs */}
      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          padding: "0 24px",
        }}
      >
        {[
          { href: "/creator/inbox", label: "Messages", badge: unreadMessages },
          {
            href: "/creator/inbox/invites",
            label: "Invites",
            badge: pendingCount,
          },
          {
            href: "/creator/inbox/system",
            label: "System",
            badge: systemUnread,
          },
        ].map(({ href, label, badge }) => {
          const isActive =
            label === "Invites"
              ? pathname?.endsWith("/invites")
              : label === "System"
                ? pathname?.endsWith("/system")
                : !pathname?.endsWith("/invites") &&
                  !pathname?.endsWith("/system");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "14px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--ink)" : "var(--ink-3)",
                textDecoration: "none",
                borderBottom: isActive
                  ? "2px solid var(--brand-red)"
                  : "2px solid transparent",
                marginBottom: -1,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
              {badge > 0 && (
                <span
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "var(--brand-red)",
                    color: "var(--snow)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Batch accept bar */}
      {showBatchBar && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink)",
            }}
          >
            {topMatches.length} invites match your top niches (90%+ match)
          </span>
          <button
            className="btn-secondary click-shift"
            onClick={handleAcceptAllMatching}
            style={{ fontSize: 12 }}
          >
            Accept all matching
          </button>
        </div>
      )}

      {/* Invite list */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {invites.every((i) => i.status !== "pending") ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              All done.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-3)",
                margin: 0,
              }}
            >
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
