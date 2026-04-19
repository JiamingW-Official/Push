"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    deadline: new Date(Date.now() + 22 * 60 * 1000).toISOString(), // 22 min
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
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4h
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

/* ── Invite Card Component ─────────────────────────────────── */
function InviteCard({ invite }: { invite: (typeof MOCK_INVITES)[0] }) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const countdown = formatCountdown(invite.deadline);

  if (declined) return null;
  if (accepted)
    return (
      <div className="invite-card">
        <div className={`invite-card__accent invite-card__accent--active`} />
        <div className="invite-card__body" style={{ justifyContent: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "#16a34a",
              fontWeight: 700,
            }}
          >
            ✓ Accepted — check Campaigns for details
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
            🔥 {invite.viewerCount} creators viewed this
          </span>
          <span className="invite-card__slots">
            Limited: {invite.slotsLeft} slots left
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

  const recentThreads = threads.slice(0, 5);
  const recentNotifs = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

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
          <div className="inbox-rows">
            {[1, 2, 3].map((i) => (
              <div key={i} className="inbox-row" style={{ opacity: 0.3 }}>
                <div
                  className="inbox-row__avatar"
                  style={{ background: "rgba(0,48,73,0.1)" }}
                />
                <div className="inbox-row__body">
                  <span
                    className="inbox-row__sender"
                    style={{
                      background: "rgba(0,48,73,0.08)",
                      color: "transparent",
                      width: 80,
                    }}
                  >
                    —
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : recentThreads.length === 0 ? (
          <div className="inbox-empty">
            <p className="inbox-empty__title">No messages yet</p>
            <p className="inbox-empty__body">
              Start a conversation with a merchant.
            </p>
          </div>
        ) : (
          <div className="inbox-rows">
            {recentThreads.map((thread) => {
              const other = selfUserId
                ? getOtherParticipant(thread, selfUserId)
                : thread.participants[0];
              const hasUnread = thread.unreadCount > 0;
              return (
                <Link
                  key={thread.id}
                  href={`/creator/inbox/${thread.id}`}
                  className={`inbox-row ${hasUnread ? "inbox-row--unread" : ""}`}
                  aria-label={`Thread with ${other.name}`}
                >
                  <div className="inbox-row__avatar">
                    {other.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="inbox-row__body">
                    <span className="inbox-row__sender">{other.name}</span>
                    <span className="inbox-row__preview">
                      {thread.lastMessage.content}
                    </span>
                  </div>
                  <div className="inbox-row__meta">
                    <span className="inbox-row__time">
                      {formatRelativeTime(thread.updatedAt)}
                    </span>
                    {hasUnread && (
                      <span className="inbox-row__unread-badge">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
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
          <div className="inbox-empty">
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
                    <SysIcon title={n.title} />
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
                      <span className="inbox-row__unread-badge">•</span>
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

/* ── Utility: pick system icon by notification title ──────── */
function SysIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (
    lower.includes("payment") ||
    lower.includes("paycheck") ||
    lower.includes("pending") ||
    lower.includes("paid")
  ) {
    return <span className="sys-icon sys-icon--payment" aria-hidden />;
  }
  if (
    lower.includes("submis") ||
    lower.includes("verify") ||
    lower.includes("accepted") ||
    lower.includes("campaign")
  ) {
    return <span className="sys-icon sys-icon--check" aria-hidden />;
  }
  if (
    lower.includes("score") ||
    lower.includes("profile") ||
    lower.includes("account")
  ) {
    return <span className="sys-icon sys-icon--user" aria-hidden />;
  }
  return <span className="sys-icon sys-icon--bell" aria-hidden />;
}
