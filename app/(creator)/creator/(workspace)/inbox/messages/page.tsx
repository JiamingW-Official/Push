"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { api } from "@/lib/messaging/api-client";
import type { Thread } from "@/lib/messaging/types";
import "../inbox.css";

const DEMO_USER_ID = "demo-user-001";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
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

/* ── Date grouping ─────────────────────────────────────────── */
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

/* ── Avatar color ──────────────────────────────────────────── */
function avatarBg(initial: string): string {
  const map: Record<string, string> = {
    B: "var(--primary)",
    H: "var(--primary)",
    N: "var(--primary)",
    T: "var(--primary)",
    C: "var(--tertiary)",
    I: "var(--tertiary)",
    O: "var(--tertiary)",
    U: "var(--tertiary)",
    E: "var(--champagne)",
    K: "var(--champagne)",
    W: "var(--champagne)",
    F: "#780000",
    L: "#780000",
    R: "#780000",
  };
  return map[initial] ?? "var(--dark)";
}

export default function InboxMessagesPage() {
  const router = useRouter();
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "campaigns">("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const unreadCount = threads.reduce((s, t) => s + (t.unreadCount || 0), 0);

  /* Auth + load */
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

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 200);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const filtered = useMemo(() => {
    let result = threads;
    if (filter === "unread") result = result.filter((t) => t.unreadCount > 0);
    else if (filter === "campaigns")
      result = result.filter((t) => !!t.campaignId);

    if (debouncedQuery.trim() && selfUserId) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((t) => {
        const other = getOtherParticipant(t, selfUserId);
        return (
          other.name.toLowerCase().includes(q) ||
          t.lastMessage.content.toLowerCase().includes(q) ||
          (t.campaignTitle ?? "").toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [threads, filter, debouncedQuery, selfUserId]);

  const dateGroups = groupThreadsByDate(filtered);

  return (
    <div className="inbox-page">
      {/* Top bar */}
      <header className="inbox-topbar">
        <div className="inbox-topbar__left">
          <span className="inbox-topbar__title">Messages</span>
          {unreadCount > 0 && (
            <span className="inbox-topbar__badge">{unreadCount}</span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="inbox-tabs" aria-label="Inbox sections">
        <Link href="/creator/inbox" className="inbox-tab">
          All
        </Link>
        <Link
          href="/creator/inbox/messages"
          className="inbox-tab inbox-tab--active"
        >
          Messages
          {unreadCount > 0 && (
            <span className="inbox-tab__count">{unreadCount}</span>
          )}
        </Link>
        <Link href="/creator/inbox/invites" className="inbox-tab">
          Invites
        </Link>
        <Link href="/creator/inbox/system" className="inbox-tab">
          System
        </Link>
      </nav>

      {/* Filter chips */}
      <div
        className="inbox-filter-row"
        role="group"
        aria-label="Filter threads"
      >
        {(["all", "unread", "campaigns"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inbox-filter-chip ${filter === f ? "inbox-filter-chip--active" : ""}`}
            type="button"
            aria-pressed={filter === f}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Campaigns"}
            {f === "unread" && unreadCount > 0 && (
              <span style={{ marginLeft: 4, opacity: 0.8 }}>
                · {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="inbox-search-bar">
        <div className="inbox-search-inner">
          <span className="inbox-search-icon" aria-hidden>
            <SearchIcon />
          </span>
          <input
            type="search"
            className="inbox-search-input"
            placeholder="Search conversations…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Section count */}
      <div className="inbox-section-header">
        <span className="inbox-section-label">
          {filter === "all"
            ? "All Conversations"
            : filter === "unread"
              ? "Unread"
              : "Campaigns"}
          {ready && ` · ${filtered.length}`}
        </span>
      </div>

      {/* Thread list */}
      {!ready ? (
        <div className="inbox-rows">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="inbox-row"
              style={{ opacity: 0.1 + i * 0.04, pointerEvents: "none" }}
            >
              <div
                className="inbox-row__avatar"
                style={{ background: "rgba(0,48,73,0.07)" }}
              />
              <div className="inbox-row__body">
                <span
                  style={{
                    display: "block",
                    width: 60 + i * 14,
                    height: 9,
                    background: "rgba(0,48,73,0.06)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="inbox-empty">
          <div className="inbox-empty__icon" aria-hidden>
            ✉
          </div>
          <p className="inbox-empty__title">No conversations found</p>
          <p className="inbox-empty__body">
            {query
              ? `No results for "${query}"`
              : "Your messages will appear here."}
          </p>
        </div>
      ) : (
        /* Date-grouped thread rows */
        dateGroups.map((group) => (
          <div key={group.label} className="inbox-date-group">
            <div className="inbox-date-group__label">
              <span className="inbox-date-group__label-text">
                {group.label}
              </span>
              <span className="inbox-date-group__line" />
            </div>
            <div className="inbox-rows" role="list">
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
                    role="listitem"
                    aria-label={`Thread with ${other.name}`}
                  >
                    <div
                      className="inbox-row__avatar"
                      data-initial={initial}
                      style={{ background: avatarBg(initial) }}
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
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9 9L12 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}
