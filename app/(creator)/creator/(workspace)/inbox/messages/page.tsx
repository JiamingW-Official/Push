"use client";

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/notifications/useNotifications";
import "../inbox.css";
import "./messages.css";

/* ── Mock data (hardcoded, no API call) ──────────────────────────
   `time` retained for back-compat fallback. `createdAt` is the
   canonical ISO timestamp (relativized at render time). Data shape
   additive — does not break any existing consumer.            */

type Role = "merchant" | "platform" | "payments" | "system";

type MockThread = {
  id: string;
  sender: string;
  initial: string;
  preview: string;
  campaign: string | null;
  time: string;
  createdAt: string;
  unread: boolean;
  online: boolean;
  role: Role;
  group: "TODAY" | "THIS WEEK" | "EARLIER";
};

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60_000).toISOString();
const daysAgo = (d: number) =>
  new Date(now - d * 24 * 60 * 60_000).toISOString();

const MOCK_THREADS: MockThread[] = [
  {
    id: "t1",
    sender: "Push Team",
    initial: "P",
    preview: "Your application to Roberta's was accepted — next steps inside.",
    campaign: "Roberta's Spring",
    time: "2m",
    createdAt: minutesAgo(2),
    unread: true,
    online: true,
    role: "platform",
    group: "TODAY",
  },
  {
    id: "t2",
    sender: "Flamingo Estate",
    initial: "F",
    preview: "Shoot deadline reminder — 3 days left to complete your content.",
    campaign: "Wellness Weekend",
    time: "1h",
    createdAt: hoursAgo(1),
    unread: true,
    online: true,
    role: "merchant",
    group: "TODAY",
  },
  {
    id: "t3",
    sender: "Push Payments",
    initial: "$",
    preview: "$120 has been added to your wallet — campaign verified.",
    campaign: null,
    time: "3h",
    createdAt: hoursAgo(3),
    unread: false,
    online: false,
    role: "payments",
    group: "TODAY",
  },
  {
    id: "t4",
    sender: "Fort Greene Coffee",
    initial: "G",
    preview: "We loved your content — can you do a follow-up post?",
    campaign: "Morning Ritual",
    time: "Yesterday",
    createdAt: daysAgo(1),
    unread: false,
    online: false,
    role: "merchant",
    group: "THIS WEEK",
  },
  {
    id: "t5",
    sender: "Campaign Updates",
    initial: "C",
    preview: "Score updated: +3 points after Brow Theory verification.",
    campaign: null,
    time: "2d",
    createdAt: daysAgo(2),
    unread: false,
    online: false,
    role: "system",
    group: "EARLIER",
  },
];

const AVATAR_COLORS: Record<string, string> = {
  P: "var(--brand-red)",
  F: "var(--champagne)",
  $: "var(--success-dark)",
  G: "var(--ink)",
  C: "var(--accent-blue)",
};

function avatarBg(initial: string): string {
  return AVATAR_COLORS[initial] ?? "var(--ink-3)";
}

const ROLE_LABEL: Record<Role, string> = {
  merchant: "MERCHANT",
  platform: "PLATFORM",
  payments: "PAYMENTS",
  system: "SYSTEM",
};

const GROUP_ORDER: MockThread["group"][] = ["TODAY", "THIS WEEK", "EARLIER"];

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 10L13 13"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="ib-thread-chev"
    >
      <path
        d="M5 3L9 7L5 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function InboxMessagesPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<MockThread[]>(MOCK_THREADS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "campaigns">("all");
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 200);
  }, []);

  const markRead = useCallback((id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t)),
    );
  }, []);

  const filtered = useMemo(() => {
    let result = threads;
    if (filter === "unread") result = result.filter((t) => t.unread);
    else if (filter === "campaigns")
      result = result.filter((t) => t.campaign !== null);

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.sender.toLowerCase().includes(q) ||
          t.preview.toLowerCase().includes(q),
      );
    }
    return result;
  }, [threads, filter, debouncedQuery]);

  const groupedThreads = useMemo(() => {
    return GROUP_ORDER.map((label) => ({
      label,
      threads: filtered.filter((t) => t.group === label),
    })).filter((g) => g.threads.length > 0);
  }, [filtered]);

  /* Flat ordered list mirrors visual order — drives keyboard nav */
  const flatThreads = useMemo(
    () => groupedThreads.flatMap((g) => g.threads),
    [groupedThreads],
  );

  const unreadCount = threads.filter((t) => t.unread).length;
  const pinned = useMemo(
    () => threads.find((t) => t.unread && t.online) ?? threads[0],
    [threads],
  );

  /* Reset focus when filter / search results change */
  useEffect(() => {
    setFocusIndex((idx) => (idx >= flatThreads.length ? -1 : idx));
  }, [flatThreads.length]);

  /* ── Global keyboard shortcuts: J/K nav, Enter open, / focus search,
     Esc clear / blur. Disabled while typing in inputs.            */
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (isTyping) {
        if (e.key === "Escape") {
          if (query) {
            handleSearch("");
          } else {
            (target as HTMLInputElement).blur();
          }
        }
        return;
      }

      if (flatThreads.length === 0) return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => Math.min(flatThreads.length - 1, i + 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter" && focusIndex >= 0) {
        e.preventDefault();
        const t = flatThreads[focusIndex];
        if (t) {
          markRead(t.id);
          router.push(`/creator/inbox/${t.id}`);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flatThreads, focusIndex, query, handleSearch, markRead, router]);

  /* Scroll focused row into view */
  useEffect(() => {
    if (focusIndex < 0 || !listRef.current) return;
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-thread-idx="${focusIndex}"]`,
    );
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusIndex]);

  const handleRowKey = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const t = flatThreads[idx];
        if (t) markRead(t.id);
      }
    },
    [flatThreads, markRead],
  );

  return (
    <div className="ib-content msg-content">
      {/* ── (LINKS) eyebrow — product UI canonical, no parenthetical ──
         Kept as plain LINKS to match Product register. */}

      {/* Pinned active conversation — single liquid-glass tile (≤1 per viewport).
         Surfaces highest-priority unread+online thread as a focus magnet. */}
      {pinned && pinned.unread && (
        <Link
          href={`/creator/inbox/${pinned.id}`}
          onClick={() => markRead(pinned.id)}
          className="msg-pinned"
          aria-label={`Open conversation with ${pinned.sender}`}
        >
          <span className="msg-pinned-eyebrow">
            ACTIVE · {ROLE_LABEL[pinned.role]}
          </span>
          <div className="msg-pinned-row">
            <span
              className="msg-pinned-avatar"
              style={{ background: avatarBg(pinned.initial) }}
              aria-hidden
            >
              {pinned.initial}
              {pinned.online && (
                <span className="msg-pinned-online" aria-hidden />
              )}
            </span>
            <div className="msg-pinned-body">
              <span className="msg-pinned-sender">{pinned.sender}</span>
              <span className="msg-pinned-preview">{pinned.preview}</span>
            </div>
            <div className="msg-pinned-meta">
              <span className="msg-pinned-time">
                {timeAgo(pinned.createdAt)}
              </span>
              <span className="msg-pinned-cta">
                Open
                <ChevronRight />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Search */}
      <div className="ib-search-wrap msg-search-wrap">
        <span className="ib-search-icon" aria-hidden>
          <SearchIcon />
        </span>
        <input
          ref={searchRef}
          type="search"
          className="ib-search-input"
          placeholder="Search conversations…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search conversations"
        />
        <kbd className="msg-search-kbd" aria-hidden>
          /
        </kbd>
      </div>

      {/* Filter chips */}
      <div className="ib-filter-row" role="group" aria-label="Filter threads">
        {(["all", "unread", "campaigns"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`ib-chip${filter === f ? " ib-chip--active" : ""}`}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Campaigns"}
            {f === "unread" && unreadCount > 0 && (
              <span className="ib-chip-count"> · {unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Keyboard hint — subtle parenthetical caption */}
      {flatThreads.length > 0 && (
        <p className="msg-hint" aria-hidden>
          (TIP) <kbd>J</kbd> <kbd>K</kbd> navigate · <kbd>Enter</kbd> open ·{" "}
          <kbd>/</kbd> search
        </p>
      )}

      {/* Thread list */}
      {filtered.length === 0 ? (
        <div className="ib-empty msg-empty">
          <span className="ib-empty-icon" aria-hidden>
            ✉
          </span>
          <p className="ib-empty-title">
            {query
              ? "No conversations found"
              : filter === "unread"
                ? "Inbox zero."
                : "Quiet for now."}
          </p>
          <p className="ib-empty-body">
            {query
              ? `Nothing matches "${query}". Try a different sender or campaign.`
              : filter === "unread"
                ? "Every thread is up to date — new messages will appear here."
                : "Reply to invites or wait for merchant updates — they land here."}
          </p>
          {(query || filter !== "all") && (
            <button
              type="button"
              className="msg-empty-reset"
              onClick={() => {
                handleSearch("");
                setFilter("all");
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div ref={listRef}>
          {(() => {
            let runningIdx = -1;
            return groupedThreads.map((group) => (
              <div key={group.label} className="ib-group">
                <div className="ib-group-label">
                  <span>{group.label}</span>
                  <span className="ib-group-line" aria-hidden />
                  <span className="msg-group-count">
                    {group.threads.length}
                  </span>
                </div>

                <div role="list">
                  {group.threads.map((thread) => {
                    runningIdx += 1;
                    const idx = runningIdx;
                    const isFocused = idx === focusIndex;
                    return (
                      <Link
                        key={thread.id}
                        role="listitem"
                        href={`/creator/inbox/${thread.id}`}
                        aria-label={`Open conversation with ${thread.sender}${thread.unread ? " (unread)" : ""}`}
                        onClick={() => markRead(thread.id)}
                        onKeyDown={(e) => handleRowKey(e, idx)}
                        onMouseEnter={() => setFocusIndex(idx)}
                        data-thread-idx={idx}
                        className={`ib-thread-row msg-thread-row${thread.unread ? " ib-thread-row--unread" : ""}${isFocused ? " msg-thread-row--focused" : ""}`}
                      >
                        {/* Avatar with online dot */}
                        <span
                          className="ib-thread-avatar msg-thread-avatar"
                          style={{ background: avatarBg(thread.initial) }}
                          aria-hidden
                        >
                          {thread.initial}
                          {thread.online && (
                            <span className="msg-thread-online" aria-hidden />
                          )}
                        </span>

                        {/* Body */}
                        <span className="ib-thread-body msg-thread-body">
                          <span className="msg-thread-row-top">
                            <span className="ib-thread-sender">
                              {thread.sender}
                            </span>
                            <span className="msg-thread-role">
                              {ROLE_LABEL[thread.role]}
                            </span>
                          </span>
                          <span className="ib-thread-preview msg-thread-preview">
                            {thread.preview}
                          </span>
                          {thread.campaign && (
                            <span className="ib-thread-campaign">
                              {thread.campaign}
                            </span>
                          )}
                        </span>

                        {/* Meta */}
                        <span className="ib-thread-meta">
                          <span
                            className="ib-thread-time"
                            title={new Date(thread.createdAt).toLocaleString()}
                          >
                            {timeAgo(thread.createdAt)}
                          </span>
                          {thread.unread && (
                            <span
                              className="ib-thread-dot"
                              aria-label="Unread"
                            />
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
