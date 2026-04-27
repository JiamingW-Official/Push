"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/db/browser";
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
    B: "var(--brand-red)",
    H: "var(--brand-red)",
    N: "var(--brand-red)",
    T: "var(--brand-red)",
    C: "var(--accent-blue)",
    I: "var(--accent-blue)",
    O: "var(--accent-blue)",
    U: "var(--accent-blue)",
    E: "#bfa170",
    K: "#bfa170",
    W: "#bfa170",
    F: "var(--ink)",
    L: "var(--ink)",
    R: "var(--ink)",
  };
  return map[initial] ?? "var(--ink-3)";
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
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100%",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--ink)",
          }}
        >
          Messages
        </span>
        {unreadCount > 0 && (
          <span
            style={{
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              background: "var(--brand-red)",
              color: "var(--snow)",
              fontSize: 11,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </header>

      {/* Tabs */}
      <nav
        aria-label="Inbox sections"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          padding: "0 24px",
        }}
      >
        {[
          { href: "/creator/inbox", label: "All" },
          {
            href: "/creator/inbox/messages",
            label: "Messages",
            active: true,
            count: unreadCount,
          },
          { href: "/creator/inbox/invites", label: "Invites" },
          { href: "/creator/inbox/system", label: "System" },
        ].map(({ href, label, active, count }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              color: active ? "var(--ink)" : "var(--ink-3)",
              textDecoration: "none",
              borderBottom: active
                ? "2px solid var(--brand-red)"
                : "2px solid transparent",
              marginBottom: -1,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            {label}
            {count != null && count > 0 && (
              <span
                style={{
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: "var(--brand-red)",
                  color: "var(--snow)",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 24px 8px",
        }}
        role="group"
        aria-label="Filter threads"
      >
        {(["all", "unread", "campaigns"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            type="button"
            aria-pressed={filter === f}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid var(--hairline)",
              background: filter === f ? "var(--ink)" : "var(--surface-2)",
              color: filter === f ? "var(--snow)" : "var(--ink-3)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
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
      <div style={{ padding: "8px 24px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            background: "var(--snow)",
            padding: "10px 14px",
          }}
        >
          <span style={{ color: "var(--ink-4)", flexShrink: 0 }} aria-hidden>
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search conversations…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search conversations"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink)",
            }}
          />
        </div>
      </div>

      {/* Section count */}
      <div
        style={{
          padding: "0 24px 12px",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {filter === "all"
          ? "All Conversations"
          : filter === "unread"
            ? "Unread"
            : "Campaigns"}
        {ready && ` · ${filtered.length}`}
      </div>

      {/* Thread list */}
      {!ready ? (
        <div style={{ padding: "0 24px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid var(--hairline)",
                opacity: 0.1 + i * 0.04,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--hairline)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: 60 + i * 14,
                    height: 9,
                    background: "var(--hairline)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              marginBottom: 16,
              color: "var(--ink-4)",
            }}
            aria-hidden
          >
            ✉
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--ink)",
              margin: "0 0 8px",
            }}
          >
            No conversations found
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-3)",
              margin: 0,
            }}
          >
            {query
              ? `No results for "${query}"`
              : "Your messages will appear here."}
          </p>
        </div>
      ) : (
        /* Date-grouped thread rows */
        dateGroups.map((group) => (
          <div key={group.label}>
            {/* Date group label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 24px 8px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                {group.label}
              </span>
              <div
                style={{ flex: 1, height: 1, background: "var(--hairline)" }}
              />
            </div>

            <div role="list" style={{ padding: "0 24px" }}>
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
                    role="listitem"
                    aria-label={`Thread with ${other.name}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: "1px solid var(--hairline)",
                      textDecoration: "none",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: avatarBg(initial),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "var(--snow)",
                        flexShrink: 0,
                      }}
                      data-initial={initial}
                      aria-hidden
                    >
                      {initial}
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: hasUnread ? 700 : 400,
                            fontSize: 14,
                            color: "var(--ink)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {other.name}
                        </span>
                        {thread.campaignTitle && (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: "var(--surface-2)",
                              border: "1px solid var(--hairline)",
                              fontFamily: "var(--font-body)",
                              fontSize: 10,
                              color: "var(--ink-3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              flexShrink: 0,
                            }}
                          >
                            {thread.campaignTitle}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--ink-3)",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {thread.lastMessage.content}
                      </span>
                    </div>

                    {/* Meta */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                        }}
                      >
                        {formatRelativeTime(thread.updatedAt)}
                      </span>
                      {hasUnread && (
                        <span
                          aria-label={`${thread.unreadCount} unread`}
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
