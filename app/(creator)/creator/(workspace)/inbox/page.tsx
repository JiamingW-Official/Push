"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { api } from "@/lib/messaging/api-client";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import type { Thread } from "@/lib/messaging/types";
import "./inbox.css";

/* ── Demo ──────────────────────────────────────────────────── */
const DEMO_USER_ID = "demo-user-001";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Mock invite data ──────────────────────────────────────── */
const MOCK_INVITES = [
  {
    id: "inv-001",
    campaign: "Summer Brunch Series",
    merchant: "Okonomi · Williamsburg",
    earning: "$48",
    earningLabel: "est. payout",
    deadline: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
    viewerCount: 7,
    slotsLeft: 3,
    accentClass: "invite-card__accent--urgent",
    isNew: true,
  },
  {
    id: "inv-002",
    campaign: "Cold Brew Launch",
    merchant: "Partners Coffee · Bushwick",
    earning: "$32",
    earningLabel: "est. payout",
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    viewerCount: 12,
    slotsLeft: 8,
    accentClass: "invite-card__accent--new",
    isNew: true,
  },
];

/* ── Countdown helper ──────────────────────────────────────── */
function formatCountdown(iso: string): { label: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { label: "Expired", urgent: true };
  const totalMins = Math.floor(diff / 60000);
  if (totalMins < 60)
    return { label: `Expires in ${totalMins}m`, urgent: totalMins < 30 };
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return { label: `Expires in ${h}h ${m}m`, urgent: false };
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getOtherParticipant(thread: Thread, selfUserId: string) {
  return (
    thread.participants.find((p) => p.userId !== selfUserId) ??
    thread.participants[0]
  );
}

/* ── Date group helper ─────────────────────────────────────── */
function getDateGroup(iso: string): "Today" | "This Week" | "Earlier" {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = diff / 3600000;
  if (hours < 24) return "Today";
  if (hours < 24 * 7) return "This Week";
  return "Earlier";
}

function groupThreadsByDate(
  threads: Thread[],
): Array<{ label: string; threads: Thread[] }> {
  const buckets: Record<string, Thread[]> = {
    Today: [],
    "This Week": [],
    Earlier: [],
  };
  for (const t of threads) {
    buckets[getDateGroup(t.updatedAt)].push(t);
  }
  return (["Today", "This Week", "Earlier"] as const)
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({ label: k, threads: buckets[k] }));
}

/* ── Invite Card Component ─────────────────────────────────── */
function InviteCard({ invite }: { invite: (typeof MOCK_INVITES)[0] }) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const countdown = formatCountdown(invite.deadline);
  const initial = invite.merchant.charAt(0).toUpperCase();

  if (declined) return null;
  if (accepted)
    return (
      <div className="invite-card">
        <div className="invite-card__accent invite-card__accent--active" />
        <div
          className="invite-card__body"
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
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
            {invite.campaign} — check Campaigns
          </span>
        </div>
        <div className="invite-card__actions" />
      </div>
    );

  return (
    <div className="invite-card">
      <div className={`invite-card__accent ${invite.accentClass}`} />
      <div className="invite-card__body">
        <div className="invite-card__header-row">
          <div
            className="invite-card__logo"
            style={{
              background:
                invite.accentClass === "invite-card__accent--urgent"
                  ? "var(--primary)"
                  : invite.accentClass === "invite-card__accent--new"
                    ? "var(--champagne)"
                    : "#16a34a",
            }}
          >
            {initial}
          </div>
          {invite.isNew && (
            <span className="invite-card__new-dot" aria-label="New" />
          )}
          <span className="invite-card__campaign">{invite.campaign}</span>
        </div>
        <div className="invite-card__merchant">{invite.merchant}</div>
        <div className="invite-card__meta-row">
          <span className="invite-card__earning">{invite.earning}</span>
          <span className="invite-card__earning-label">
            {invite.earningLabel}
          </span>
          <span
            className={`invite-card__deadline ${countdown.urgent ? "invite-card__deadline--urgent" : ""}`}
          >
            ⏱ {countdown.label}
          </span>
        </div>
        <div className="invite-card__fomo-row">
          <span className="invite-card__viewers">
            🔥 {invite.viewerCount} creators viewed
          </span>
          <span className="invite-card__slots">
            {invite.slotsLeft} slots left
          </span>
        </div>
      </div>
      <div className="invite-card__actions">
        <button
          className="invite-btn invite-btn--accept"
          onClick={() => setAccepted(true)}
          type="button"
        >
          Accept
        </button>
        <button
          className="invite-btn invite-btn--decline"
          onClick={() => setDeclined(true)}
          type="button"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function InboxPage() {
  const router = useRouter();
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [ready, setReady] = useState(false);

  const {
    notifications,
    unreadCount: sysUnread,
    markAsRead,
    markAllRead,
    hydrated,
  } = useNotifications("creator");

  const unreadMessages = threads.reduce((s, t) => s + (t.unreadCount || 0), 0);
  const totalUnread = unreadMessages + sysUnread + MOCK_INVITES.length;

  /* Auth + load threads */
  useEffect(() => {
    const isDemo = checkDemoMode();
    if (isDemo) {
      setSelfUserId(DEMO_USER_ID);
      api.messages.listThreads("creator", DEMO_USER_ID).then((ts) => {
        setThreads(ts);
        setReady(true);
      });
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/creator/login");
        return;
      }
      const uid = data.user.id;
      setSelfUserId(uid);
      api.messages.listThreads("creator", uid).then((ts) => {
        setThreads(ts);
        setReady(true);
      });
    });
  }, [router]);

  const recentThreads = threads.slice(0, 8);
  const recentNotifs = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const threadGroups = groupThreadsByDate(recentThreads);

  return (
    <div className="inbox-page">
      {/* Top bar */}
      <header className="inbox-topbar">
        <div className="inbox-topbar__left">
          <span className="inbox-topbar__title">Inbox</span>
          {totalUnread > 0 && (
            <span className="inbox-topbar__badge">{totalUnread}</span>
          )}
        </div>
        <div className="inbox-topbar__actions">
          {sysUnread > 0 && (
            <button
              className="inbox-topbar__mark-all"
              onClick={markAllRead}
              type="button"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      {/* Tab nav */}
      <nav className="inbox-tabs" aria-label="Inbox sections">
        <Link href="/creator/inbox" className="inbox-tab inbox-tab--active">
          All
          {totalUnread > 0 && (
            <span className="inbox-tab__count">{totalUnread}</span>
          )}
        </Link>
        <Link href="/creator/inbox/messages" className="inbox-tab">
          Messages
          {unreadMessages > 0 && (
            <span className="inbox-tab__count">{unreadMessages}</span>
          )}
        </Link>
        <Link href="/creator/inbox/invites" className="inbox-tab">
          Invites
          <span className="inbox-tab__count">{MOCK_INVITES.length}</span>
        </Link>
        <Link href="/creator/inbox/system" className="inbox-tab">
          System
          {sysUnread > 0 && (
            <span className="inbox-tab__count">{sysUnread}</span>
          )}
        </Link>
      </nav>

      {/* ── INVITES (highest priority) ── */}
      {MOCK_INVITES.length > 0 && (
        <section aria-label="Campaign invites">
          <div className="inbox-section-header">
            <span className="inbox-section-label">Campaign Invites</span>
            <Link href="/creator/inbox/invites" className="inbox-section-link">
              View all →
            </Link>
          </div>
          <div className="inbox-invites-grid">
            {MOCK_INVITES.map((inv) => (
              <InviteCard key={inv.id} invite={inv} />
            ))}
          </div>
        </section>
      )}

      {/* ── MESSAGES ── */}
      <section aria-label="Messages">
        <div className="inbox-section-header">
          <span className="inbox-section-label">Messages</span>
          <Link href="/creator/inbox/messages" className="inbox-section-link">
            View all →
          </Link>
        </div>

        {!ready ? (
          /* Skeleton */
          <div className="inbox-rows">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="inbox-row"
                style={{ opacity: 0.15 + i * 0.06, pointerEvents: "none" }}
              >
                <div
                  className="inbox-row__avatar"
                  style={{ background: "rgba(0,48,73,0.08)" }}
                />
                <div className="inbox-row__body">
                  <span
                    style={{
                      display: "block",
                      width: 60 + i * 16,
                      height: 9,
                      background: "rgba(0,48,73,0.07)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : recentThreads.length === 0 ? (
          <div className="inbox-empty">
            <div className="inbox-empty__icon" aria-hidden>
              ✉
            </div>
            <p className="inbox-empty__title">No messages yet</p>
            <p className="inbox-empty__body">
              Accept a campaign invite and the merchant will reach out here.
            </p>
          </div>
        ) : (
          /* Date-grouped thread rows */
          threadGroups.map((group) => (
            <div key={group.label} className="inbox-date-group">
              <div className="inbox-date-group__label">
                <span className="inbox-date-group__label-text">
                  {group.label}
                </span>
                <span className="inbox-date-group__line" />
              </div>
              <div className="inbox-rows">
                {group.threads.map((thread) => {
                  const other = selfUserId
                    ? getOtherParticipant(thread, selfUserId)
                    : thread.participants[0];
                  const hasUnread = thread.unreadCount > 0;
                  const initial = other.name.charAt(0).toUpperCase();
                  return (
                    <Link
                      key={thread.id}
                      href={`/creator/inbox/${thread.id}`}
                      className={`inbox-row ${hasUnread ? "inbox-row--unread" : ""}`}
                      aria-label={`Thread with ${other.name}`}
                    >
                      <div
                        className="inbox-row__avatar"
                        data-initial={initial}
                        aria-hidden
                      >
                        {initial}
                      </div>
                      <div className="inbox-row__body">
                        <span className="inbox-row__sender">{other.name}</span>
                        {thread.campaignTitle && (
                          <span className="inbox-row__campaign-tag">
                            {thread.campaignTitle}
                          </span>
                        )}
                        <span className="inbox-row__preview">
                          {thread.lastMessage.content}
                        </span>
                      </div>
                      <div className="inbox-row__meta">
                        <span className="inbox-row__time">
                          {formatRelativeTime(thread.updatedAt)}
                        </span>
                        {hasUnread && (
                          <span
                            className="inbox-row__unread-badge"
                            aria-label={`${thread.unreadCount} unread`}
                          >
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* ── SYSTEM ── */}
      <section aria-label="System notifications">
        <div className="inbox-section-header">
          <span className="inbox-section-label">System</span>
          <Link href="/creator/inbox/system" className="inbox-section-link">
            View all →
          </Link>
        </div>
        {!hydrated || recentNotifs.length === 0 ? (
          <div className="inbox-empty" style={{ padding: "32px 32px" }}>
            <p className="inbox-empty__title">All caught up.</p>
          </div>
        ) : (
          <div className="inbox-rows">
            {recentNotifs.map((n) => {
              const isUnread = !n.read;
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className={`inbox-row ${isUnread ? "inbox-row--system-unread" : ""}`}
                  onClick={() => markAsRead(n.id)}
                  aria-label={n.title}
                >
                  <div className="inbox-row__icon">
                    <SysIconWrapped title={n.title} />
                  </div>
                  <div className="inbox-row__body">
                    <span className="inbox-row__sender">{n.title}</span>
                    <span className="inbox-row__preview">{n.body}</span>
                  </div>
                  <div className="inbox-row__meta">
                    <span className="inbox-row__time">
                      {timeAgo(n.createdAt)}
                    </span>
                    {isUnread && (
                      <span
                        className="inbox-row__unread-dot"
                        style={{ background: "var(--tertiary)" }}
                        aria-hidden
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Wrapped icon with colored background square ──────────── */
function SysIconWrapped({ title }: { title: string }) {
  const lower = title.toLowerCase();
  let variant: "payment" | "check" | "user" | "bell" = "bell";
  if (
    lower.includes("payment") ||
    lower.includes("paycheck") ||
    lower.includes("paid")
  ) {
    variant = "payment";
  } else if (
    lower.includes("submis") ||
    lower.includes("accepted") ||
    lower.includes("campaign")
  ) {
    variant = "check";
  } else if (
    lower.includes("score") ||
    lower.includes("profile") ||
    lower.includes("account")
  ) {
    variant = "user";
  }
  return (
    <span className={`sys-icon-wrap sys-icon-wrap--${variant}`}>
      <span className={`sys-icon sys-icon--${variant}`} aria-hidden />
    </span>
  );
}
