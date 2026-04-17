"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import type { Thread, ThreadFilter } from "@/lib/messaging/types";

interface Props {
  threads: Thread[];
  activeThreadId: string | null;
  selfUserId: string;
  onSelect: (threadId: string) => void;
  onNewThread: () => void;
}

const FILTERS: { key: ThreadFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "campaigns", label: "Campaigns" },
  { key: "direct", label: "Direct" },
];

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

export default function ThreadList({
  threads,
  activeThreadId,
  selfUserId,
  onSelect,
  onNewThread,
}: Props) {
  const [filter, setFilter] = useState<ThreadFilter>("all");
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
    else if (filter === "direct") result = result.filter((t) => !t.campaignId);

    if (debouncedQuery.trim()) {
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
    <div className="thread-list">
      <div className="thread-list__header">
        <h2 className="thread-list__title">Messages</h2>
        <div className="thread-list__search-wrap">
          <span className="thread-list__search-icon">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="thread-list__search"
            placeholder="Search conversations…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
        <div className="thread-list__tabs" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`thread-list__tab ${filter === f.key ? "thread-list__tab--active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="thread-list__new-btn"
        onClick={onNewThread}
        type="button"
      >
        <PlusIcon />
        New conversation
      </button>

      <div className="thread-list__items" role="list">
        {filtered.length === 0 ? (
          <p className="thread-list__empty">No conversations found</p>
        ) : (
          filtered.map((thread) => {
            const other = getOtherParticipant(thread, selfUserId);
            const isActive = thread.id === activeThreadId;
            const hasUnread = thread.unreadCount > 0;
            const preview = thread.lastMessage.content;

            return (
              <button
                key={thread.id}
                role="listitem"
                type="button"
                className={`thread-item ${isActive ? "thread-item--active" : ""}`}
                onClick={() => onSelect(thread.id)}
                aria-current={isActive ? "true" : undefined}
              >
                <div className="thread-item__avatar">
                  <Image
                    src={other.avatar}
                    alt={other.name}
                    width={40}
                    height={40}
                    className="thread-item__avatar-img"
                    unoptimized
                  />
                  {hasUnread && (
                    <span className="thread-item__unread-dot" aria-hidden />
                  )}
                </div>
                <div className="thread-item__body">
                  <div className="thread-item__row">
                    <span
                      className={`thread-item__name ${hasUnread ? "thread-item__name--unread" : ""}`}
                    >
                      {other.name}
                    </span>
                    <span className="thread-item__time">
                      {formatRelativeTime(thread.updatedAt)}
                    </span>
                  </div>
                  {thread.campaignTitle && (
                    <span className="thread-item__campaign-tag">
                      {thread.campaignTitle}
                    </span>
                  )}
                  <div className="thread-item__preview-row">
                    <span
                      className={`thread-item__preview ${hasUnread ? "thread-item__preview--unread" : ""}`}
                    >
                      {preview}
                    </span>
                    {hasUnread && (
                      <span
                        className="thread-item__unread-count"
                        aria-label={`${thread.unreadCount} unread`}
                      >
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9.5 9.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1v10M1 6h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
