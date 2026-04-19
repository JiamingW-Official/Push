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
        style={{
          display: "flex",
          gap: 6,
          padding: "10px 32px",
          borderBottom: "1px solid rgba(0,48,73,0.06)",
          background: "var(--surface)",
        }}
      >
        {(["all", "unread", "campaigns"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "5px 12px",
              background: filter === f ? "var(--dark)" : "transparent",
              color: filter === f ? "#fff" : "var(--graphite)",
              border:
                filter === f
                  ? "1px solid var(--dark)"
                  : "1px solid var(--line-strong)",
              cursor: "pointer",
              borderRadius: 0,
              transition: "all 150ms ease",
            }}
            type="button"
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Campaigns"}
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

      {/* Section header */}
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
              style={{ opacity: 0.2 + i * 0.05 }}
            >
              <div
                className="inbox-row__avatar"
                style={{ background: "rgba(0,48,73,0.08)" }}
              />
              <div className="inbox-row__body">
                <span
                  style={{
                    display: "block",
                    width: 80 + i * 10,
                    height: 10,
                    background: "rgba(0,48,73,0.07)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="inbox-empty">
          <p className="inbox-empty__title">No conversations found</p>
          <p className="inbox-empty__body">
            {query
              ? `No results for "${query}"`
              : "Your messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="inbox-rows" role="list">
          {filtered.map((thread) => {
            const other = selfUserId
              ? getOtherParticipant(thread, selfUserId)
              : thread.participants[0];
            const hasUnread = thread.unreadCount > 0;
            return (
              <Link
                key={thread.id}
                href={`/creator/inbox/${thread.id}`}
                className={`inbox-row ${hasUnread ? "inbox-row--unread" : ""}`}
                role="listitem"
                aria-label={`Thread with ${other.name}`}
              >
                <div className="inbox-row__avatar">
                  {other.name.charAt(0).toUpperCase()}
                </div>
                <div className="inbox-row__body">
                  <span className="inbox-row__sender">{other.name}</span>
                  {thread.campaignTitle && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--tertiary)",
                        flexShrink: 0,
                      }}
                    >
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
