"use client";

import { useState } from "react";
import Link from "next/link";
import "../inbox.css";

/* ── Mock invite data ──────────────────────────────────────── */
const INITIAL_INVITES = [
  {
    id: "inv-001",
    campaign: "Summer Brunch Series",
    merchant: "Okonomi",
    region: "Williamsburg, BK",
    earning: "$48",
    earningMin: 40,
    earningMax: 56,
    earningLabel: "est. payout",
    deadline: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
    viewerCount: 7,
    slotsLeft: 3,
    accentClass: "invite-card__accent--urgent",
    accentColor: "var(--primary)",
    isNew: true,
    description:
      "Weekend brunch content — 1 Reel + 2 Stories. Must visit Sat or Sun.",
  },
  {
    id: "inv-002",
    campaign: "Cold Brew Launch",
    merchant: "Partners Coffee",
    region: "Bushwick, BK",
    earning: "$32",
    earningMin: 28,
    earningMax: 38,
    earningLabel: "est. payout",
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    viewerCount: 12,
    slotsLeft: 8,
    accentClass: "invite-card__accent--new",
    accentColor: "var(--champagne)",
    isNew: true,
    description:
      "Announce the new cold brew menu launch. Any day this week works.",
  },
  {
    id: "inv-003",
    campaign: "Neighborhood Playbook: Fort Greene",
    merchant: "Ode to Babel",
    region: "Fort Greene, BK",
    earning: "$65",
    earningMin: 55,
    earningMax: 75,
    earningLabel: "est. payout",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    viewerCount: 4,
    slotsLeft: 2,
    accentClass: "invite-card__accent--active",
    accentColor: "#16a34a",
    isNew: false,
    description:
      "Part of the Williamsburg Coffee+ Neighborhood Playbook. 2 Reels minimum.",
  },
];

/* ── Countdown ─────────────────────────────────────────────── */
function formatCountdown(iso: string): { label: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { label: "Expired", urgent: true };
  const totalMins = Math.floor(diff / 60000);
  if (totalMins < 60)
    return { label: `${totalMins}m left`, urgent: totalMins < 30 };
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h < 24)
    return { label: `${h}h ${m > 0 ? `${m}m` : ""} left`, urgent: false };
  const d = Math.floor(h / 24);
  return { label: `${d}d remaining`, urgent: false };
}

/* ── Single invite card ────────────────────────────────────── */
function InviteCard({ invite }: { invite: (typeof INITIAL_INVITES)[0] }) {
  const [state, setState] = useState<"pending" | "accepted" | "declined">(
    "pending",
  );
  const countdown = formatCountdown(invite.deadline);
  const initial = invite.merchant.charAt(0).toUpperCase();

  if (state === "declined") return null;

  if (state === "accepted") {
    return (
      <div className="invite-card">
        <div className="invite-card__accent invite-card__accent--active" />
        <div
          className="invite-card__body"
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "#16a34a",
              fontWeight: 700,
            }}
          >
            ✓ Accepted
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--graphite)",
            }}
          >
            {invite.campaign} — check Campaigns for details
          </span>
        </div>
        <div className="invite-card__actions" />
      </div>
    );
  }

  return (
    <article className="invite-card" aria-label={`Invite: ${invite.campaign}`}>
      <div className={`invite-card__accent ${invite.accentClass}`} />

      <div className="invite-card__body">
        {/* Header row: logo + new dot + campaign name */}
        <div className="invite-card__header-row">
          <div
            className="invite-card__logo"
            style={{ background: invite.accentColor }}
            aria-hidden
          >
            {initial}
          </div>
          {invite.isNew && (
            <span className="invite-card__new-dot" aria-label="New invite" />
          )}
          <span className="invite-card__campaign">{invite.campaign}</span>
        </div>

        {/* Merchant + region */}
        <div className="invite-card__merchant">
          <span style={{ fontWeight: 600, color: "var(--dark)" }}>
            {invite.merchant}
          </span>
          <span style={{ color: "rgba(74,85,104,0.45)", margin: "0 4px" }}>
            ·
          </span>
          <span>{invite.region}</span>
        </div>

        {/* Description */}
        <p className="invite-card__description">{invite.description}</p>

        {/* Earn range + deadline countdown */}
        <div className="invite-card__meta-row">
          <span className="invite-card__earning">{invite.earning}</span>
          <span className="invite-card__earning-label">
            {invite.earningLabel}
          </span>
          {/* Earn range chip */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              color: "var(--graphite)",
              background: "rgba(0,48,73,0.06)",
              padding: "2px 7px",
              letterSpacing: "0.02em",
            }}
          >
            ${invite.earningMin}–${invite.earningMax}
          </span>
          <span
            className={`invite-card__deadline${countdown.urgent ? " invite-card__deadline--urgent" : ""}`}
          >
            ⏱ {countdown.label}
          </span>
        </div>

        {/* FOMO row */}
        <div className="invite-card__fomo-row">
          <span className="invite-card__viewers">
            🔥 {invite.viewerCount} creators viewed
          </span>
          <span className="invite-card__slots">
            {invite.slotsLeft} slot{invite.slotsLeft !== 1 ? "s" : ""} left
          </span>
        </div>
      </div>

      {/* Action buttons — full-width stacked */}
      <div className="invite-card__actions">
        <button
          className="invite-btn invite-btn--accept"
          onClick={() => setState("accepted")}
          type="button"
        >
          Accept
        </button>
        <button
          className="invite-btn invite-btn--decline"
          onClick={() => setState("declined")}
          type="button"
        >
          Decline
        </button>
      </div>
    </article>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function InboxInvitesPage() {
  const [invites] = useState(INITIAL_INVITES);
  const activeCount = invites.length;

  return (
    <div className="inbox-page">
      {/* Top bar */}
      <header className="inbox-topbar">
        <div className="inbox-topbar__left">
          <span className="inbox-topbar__title">Invites</span>
          {activeCount > 0 && (
            <span className="inbox-topbar__badge">{activeCount}</span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="inbox-tabs" aria-label="Inbox sections">
        <Link href="/creator/inbox" className="inbox-tab">
          All
        </Link>
        <Link href="/creator/inbox/messages" className="inbox-tab">
          Messages
        </Link>
        <Link
          href="/creator/inbox/invites"
          className="inbox-tab inbox-tab--active"
        >
          Invites
          {activeCount > 0 && (
            <span className="inbox-tab__count">{activeCount}</span>
          )}
        </Link>
        <Link href="/creator/inbox/system" className="inbox-tab">
          System
        </Link>
      </nav>

      {/* Hero callout */}
      <div
        style={{
          padding: "20px 32px 16px",
          borderBottom: "1px solid var(--line)",
          background: "var(--surface-bright)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 5vw, 44px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "var(--dark)",
            lineHeight: 1.05,
          }}
        >
          {activeCount > 0 ? (
            <>
              <span style={{ color: "var(--primary)" }}>{activeCount}</span>{" "}
              <span style={{ fontWeight: 200, color: "var(--graphite)" }}>
                open invite{activeCount !== 1 ? "s" : ""}.
              </span>
            </>
          ) : (
            <span style={{ fontWeight: 200, color: "var(--graphite)" }}>
              No invites right now.
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--graphite)",
            margin: "6px 0 0",
            opacity: 0.75,
          }}
        >
          Campaign invites expire — accept fast to lock in your slot.
        </p>
      </div>

      {/* Invite list */}
      {activeCount === 0 ? (
        <div className="inbox-empty" style={{ paddingTop: 80 }}>
          <div className="inbox-empty__icon" aria-hidden>
            ◈
          </div>
          <p className="inbox-empty__title">No invites right now</p>
          <p className="inbox-empty__body">
            New campaigns are added weekly. Check back soon.
          </p>
          <Link href="/creator/explore" className="inbox-empty__link">
            Explore campaigns →
          </Link>
        </div>
      ) : (
        <>
          <div className="inbox-section-header">
            <span className="inbox-section-label">
              Active Invites · {activeCount}
            </span>
          </div>
          <div className="inbox-invites-grid">
            {invites.map((inv) => (
              <InviteCard key={inv.id} invite={inv} />
            ))}
          </div>

          {/* Bottom notice */}
          <div
            style={{
              padding: "12px 32px",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              color: "rgba(0,48,73,0.3)",
              borderTop: "1px solid var(--line)",
              marginTop: 8,
              letterSpacing: "0.02em",
            }}
          >
            Invites auto-expire after their deadline. Accepting locks your
            campaign slot — view details in Campaigns.
          </div>
        </>
      )}
    </div>
  );
}
