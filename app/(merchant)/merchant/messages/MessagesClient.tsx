"use client";

/* ============================================================
   Merchant Messages — v11 iMessage Two-Pane Layout
   Mirror of /creator/inbox/messages, role-swapped: merchant is
   the "self" / outgoing side; creator is the "other" / left
   bubble side. Authority: Design.md § 9 (Filled Secondary N2W
   Blue for outgoing self-bubbles), § 6 (negative-space tokens),
   § 16 (Product UI eyebrow LINKS · DIRECT — no parens).
   Layout: PageHeader on top, then 2-pane (360px thread list +
   flex-1 conversation) inside the existing .msg-page
   atmospheric backdrop.
   ============================================================ */

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { EmptyState, PageHeader } from "@/components/merchant/shared";
import type { Message, Thread, ThreadParticipant } from "@/lib/messaging/types";
import { useThreadStream } from "@/lib/realtime/use-thread-stream";
import {
  buildMerchantMockMessages,
  buildMerchantMockThreads,
  DEMO_MERCHANT_USER_ID,
} from "@/lib/messaging/merchant-mock-threads";
import "./messages.css";
import "../_anim/anim.css";
import "@/components/loading/Skeleton.css";

type ThreadWithMessages = Thread & { messages: Message[] };
type FilterKey = "all" | "unread" | "needs-reply";
type GroupLabel = "TODAY" | "THIS WEEK" | "EARLIER";

const GROUP_ORDER: GroupLabel[] = ["TODAY", "THIS WEEK", "EARLIER"];

/* ──────────────────────────────────────────────────────────────────
   Time helpers — clock for bubble stamps, relative ago for the
   thread list, full bubble stamp every ~30 min in the conversation. */

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatBubbleStamp(iso: string) {
  const d = new Date(iso);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" });
  const md = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const hm = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${wd}, ${md} at ${hm}`;
}

function groupOf(iso: string): GroupLabel {
  const ms = Date.now() - new Date(iso).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (ms < day) return "TODAY";
  if (ms < 7 * day) return "THIS WEEK";
  return "EARLIER";
}

/* ──────────────────────────────────────────────────────────────────
   Avatar — colored initial tile; closed-token list compliant.        */

function avatarTone(name: string): string {
  const tones = [
    "var(--brand-red)",
    "var(--accent-blue)",
    "var(--champagne-deep)",
    "var(--ink)",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i += 1)
    h = (h * 31 + name.charCodeAt(i)) | 0;
  return tones[Math.abs(h) % tones.length];
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function preview(content: string): string {
  if (content.length <= 140) return content;
  return `${content.slice(0, 137)}…`;
}

/* ──────────────────────────────────────────────────────────────────
   Other-party resolver — merchant view excludes the merchant's own
   participant. Falls back to a sensible default if missing.          */

function otherParty(thread: Thread): ThreadParticipant {
  return (
    thread.participants.find((p) => p.role !== "merchant") ?? {
      userId: "unknown",
      role: "creator",
      name: "Unknown creator",
      avatar: "",
    }
  );
}

/* ──────────────────────────────────────────────────────────────────
   Bubble grouping — mirrors creator inbox: collapses consecutive
   same-sender messages within a 5-min window so tails can trim;
   shows a date stamp on the first message and after any 30-min gap. */

type GroupedMsg = Message & {
  position: "single" | "top" | "mid" | "bottom";
  showStamp: boolean;
};

function groupMessages(msgs: Message[]): GroupedMsg[] {
  const out: GroupedMsg[] = [];
  for (let i = 0; i < msgs.length; i += 1) {
    const m = msgs[i];
    const prev = msgs[i - 1];
    const next = msgs[i + 1];
    const samePrev =
      prev &&
      prev.senderRole === m.senderRole &&
      new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() <
        5 * 60_000;
    const sameNext =
      next &&
      next.senderRole === m.senderRole &&
      new Date(next.createdAt).getTime() - new Date(m.createdAt).getTime() <
        5 * 60_000;

    let position: GroupedMsg["position"];
    if (!samePrev && !sameNext) position = "single";
    else if (!samePrev && sameNext) position = "top";
    else if (samePrev && sameNext) position = "mid";
    else position = "bottom";

    const gap = prev
      ? new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime()
      : Infinity;
    const showStamp = !samePrev || gap > 30 * 60_000;

    out.push({ ...m, position, showStamp });
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────
   Inline icons — sized to match the iMessage register (12-16px). */

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 10L13 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M9 3L5 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7l10-5-3.5 5L12 12 2 7z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Thread fetch — when the active thread is a real DB-backed row,
   we hit the API; when it's a demo thread (id starts with "mt-"),
   we hydrate from the local mock file so the page works without
   a session.                                                        */

async function fetchThread(threadId: string): Promise<ThreadWithMessages> {
  const response = await fetch(`/api/merchant/messages/threads/${threadId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load thread");
  }

  return response.json();
}

function isDemoThread(threadId: string): boolean {
  return threadId.startsWith("mt-");
}

export default function MessagesClient({
  initialThreads,
  initialThreadId,
}: {
  initialThreads: Thread[];
  /** Thread id from /merchant/messages/[threadId] when deep-linked.
   *  Falls back to first thread when not provided (legacy /messages route). */
  initialThreadId?: string;
}) {
  const router = useRouter();
  const routeParams = useParams<{ threadId?: string | string[] }>();
  const urlThreadId = useMemo(() => {
    const raw = routeParams?.threadId;
    if (!raw) return null;
    return Array.isArray(raw) ? (raw[0] ?? null) : raw;
  }, [routeParams]);

  /* When the server returns no threads (demo / no-session), fall back
     to the merchant-mock seeds so the page is never empty. */
  const seedThreads = useMemo<Thread[]>(
    () =>
      initialThreads.length > 0 ? initialThreads : buildMerchantMockThreads(),
    [initialThreads],
  );

  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  /* Active thread resolution priority on first render:
     1. /messages/[threadId] URL — initialThreadId from server params
     2. seedThreads[0].id — sensible default for /messages root
     3. null — empty inbox */
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreadId ?? seedThreads[0]?.id ?? null,
  );

  /* URL → state sync: when user clicks browser back/forward or pastes a
     /messages/[threadId] URL, keep the rendered thread aligned with the
     URL. Only fires when a threadId is present in the URL — for the
     listing route /messages we keep whatever the user last selected. */
  useEffect(() => {
    if (urlThreadId && urlThreadId !== activeThreadId) {
      setActiveThreadId(urlThreadId);
    }
  }, [urlThreadId, activeThreadId]);

  /* selectThread — picks a thread AND keeps the URL in sync so deep-links
     work and browser history captures the navigation. We update local state
     immediately for snappy UI, then push the URL (router.push is enqueued).
     Demo threads (mt-*) and real DB threads use the same scheme. */
  const selectThread = useCallback(
    (id: string | null) => {
      setActiveThreadId(id);
      const target = id ? `/merchant/messages/${id}` : "/merchant/messages";
      router.push(target);
    },
    [router],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(
    seedThreads.length > 0,
  );

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  /* ── Realtime stream — appends only new INSERTs from Supabase Realtime.
     Deduplicates against `messages` so optimistic-send entries are not
     doubled. Demo threads never emit events (no DB row), so the hook
     stays idle for them — wiring is preserved verbatim. */
  const { messages: liveMessages, status: streamStatus } =
    useThreadStream(activeThreadId);

  useEffect(() => {
    if (liveMessages.length === 0) return;
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const incoming = liveMessages.filter((m) => !existingIds.has(m.id));
      if (incoming.length === 0) return prev;
      // Map ThreadMessage → Message (same shape; cast is safe — both come
      // from the same DB row, lib/messaging/types mirrors the column list).
      return [...prev, ...(incoming as unknown as Message[])];
    });
  }, [liveMessages]);

  const listRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  /* Load + mark-read whenever active thread changes. Demo threads
     resolve from the local mock file; real threads hit the API. */
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    let cancelled = false;
    setIsLoadingMessages(true);

    if (isDemoThread(activeThreadId)) {
      const mockMsgs = buildMerchantMockMessages(activeThreadId) ?? [];
      setMessages(mockMsgs);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, unreadCount: 0 } : t,
        ),
      );
      setIsLoadingMessages(false);
      return;
    }

    fetchThread(activeThreadId)
      .then((thread) => {
        if (cancelled) return;
        setMessages(thread.messages);
        setThreads((prev) =>
          prev.map((item) =>
            item.id === thread.id
              ? {
                  ...item,
                  participants: thread.participants,
                  campaignId: thread.campaignId,
                  campaignTitle: thread.campaignTitle,
                  lastMessage: thread.lastMessage,
                  unreadCount: 0,
                  updatedAt: thread.updatedAt,
                }
              : item,
          ),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMessages(false);
      });

    fetch(`/api/merchant/messages/threads/${activeThreadId}/read`, {
      method: "PATCH",
    }).then(() => {
      if (!cancelled) {
        setThreads((prev) =>
          prev.map((thread) =>
            thread.id === activeThreadId
              ? { ...thread, unreadCount: 0 }
              : thread,
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeThreadId]);

  /* Auto-scroll to newest bubble whenever the message list changes. */
  useLayoutEffect(() => {
    if (!bubblesRef.current) return;
    bubblesRef.current.scrollTop = bubblesRef.current.scrollHeight;
  }, [messages, activeThreadId]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  );

  const activeOther = activeThread ? otherParty(activeThread) : null;

  const unreadCount = useMemo(
    () => threads.filter((t) => (t.unreadCount ?? 0) > 0).length,
    [threads],
  );

  const needsReplyCount = useMemo(() => {
    const now = Date.now();
    return threads.filter((t) => {
      const last = t.lastMessage;
      if (!last) return false;
      // "Needs reply" = unread OR last incoming msg older than 12h with no
      // outgoing follow-up. We approximate by checking unreadCount > 0 OR
      // updatedAt > 12h with the last sender being the creator.
      if ((t.unreadCount ?? 0) > 0) return true;
      const isFromOther = (last.senderId !== otherParty(t).userId) === false;
      if (!isFromOther) return false;
      return now - new Date(last.createdAt).getTime() > 12 * 60 * 60 * 1000;
    }).length;
  }, [threads]);

  /* Filter + search pipeline. */
  const filtered = useMemo(() => {
    let result = threads;
    if (filter === "unread") {
      result = result.filter((t) => (t.unreadCount ?? 0) > 0);
    } else if (filter === "needs-reply") {
      const now = Date.now();
      result = result.filter((t) => {
        if ((t.unreadCount ?? 0) > 0) return true;
        return now - new Date(t.updatedAt).getTime() > 12 * 60 * 60 * 1000;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((t) => {
        const other = otherParty(t);
        return (
          other.name.toLowerCase().includes(q) ||
          t.lastMessage.content.toLowerCase().includes(q) ||
          (t.campaignTitle?.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return result;
  }, [threads, filter, query]);

  /* Group filtered threads by recency: TODAY · THIS WEEK · EARLIER. */
  const grouped = useMemo(() => {
    return GROUP_ORDER.map((label) => ({
      label,
      threads: filtered.filter((t) => groupOf(t.updatedAt) === label),
    })).filter((g) => g.threads.length > 0);
  }, [filtered]);

  const orderedIds = useMemo(() => filtered.map((t) => t.id), [filtered]);

  const handleSend = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed || !activeThreadId) return;

      // Demo threads — append locally and bail (no API).
      if (isDemoThread(activeThreadId)) {
        const newMsg: Message = {
          id: `mm-local-${Date.now()}`,
          threadId: activeThreadId,
          senderId: DEMO_MERCHANT_USER_ID,
          senderRole: "merchant",
          content: trimmed,
          contentType: "text",
          attachments: [],
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? {
                  ...t,
                  lastMessage: {
                    content: trimmed,
                    senderId: DEMO_MERCHANT_USER_ID,
                    createdAt: newMsg.createdAt,
                  },
                  updatedAt: newMsg.createdAt,
                }
              : t,
          ),
        );
        setInputValue("");
        return;
      }

      const response = await fetch(
        `/api/merchant/messages/threads/${activeThreadId}/messages`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: trimmed }),
        },
      );

      if (!response.ok) return;

      const createdMessage = (await response.json()) as Message;
      setMessages((prev) => [...prev, createdMessage]);
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThreadId
            ? {
                ...thread,
                lastMessage: {
                  content: trimmed,
                  createdAt: new Date().toISOString(),
                  senderId: createdMessage.senderId,
                },
                updatedAt: new Date().toISOString(),
              }
            : thread,
        ),
      );
      setInputValue("");
    },
    [activeThreadId, inputValue],
  );

  /* J/K shortcuts — global within the page; ignored while typing. */
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTyping) return;
      if (orderedIds.length === 0) return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = orderedIds.indexOf(activeThreadId ?? "");
        const next = orderedIds[Math.min(orderedIds.length - 1, idx + 1)];
        if (next) selectThread(next);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = orderedIds.indexOf(activeThreadId ?? "");
        const next = orderedIds[Math.max(0, idx - 1)];
        if (next) selectThread(next);
      } else if (e.key === "r" && activeThreadId) {
        e.preventDefault();
        composerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeThreadId, orderedIds]);

  /* Scroll active thread row into view when it changes. */
  useEffect(() => {
    if (!listRef.current || !activeThreadId) return;
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-thread-id="${activeThreadId}"]`,
    );
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeThreadId]);

  const handleRowKey = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThread(id);
      }
    },
    [selectThread],
  );

  const handleComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  return (
    <section className="msg-page anim-page">
      <PageHeader
        eyebrow="LINKS · DIRECT"
        title="Messages"
        subtitle="Reach creators about live campaigns, approvals, disputes, and Push platform updates."
        action={
          <button className="btn-primary" type="button">
            New message
          </button>
        }
      />

      {threads.length === 0 ? (
        <div className="msg-empty-wrap">
          <EmptyState
            artKind="messages"
            title="No conversations yet"
            description="Once you approve creators or comment on applicants, threads land here. Open an applicant card and tap Message to start a conversation."
            ctaLabel="Review applicants"
            ctaHref="/merchant/applicants"
          />
        </div>
      ) : (
        <div
          className={`mm-pane-layout${activeThread ? " has-active" : ""}`}
          aria-label="Messages"
        >
          {/* ── Left pane: thread list ──────────────────────────── */}
          <aside className="mm-list-pane" aria-label="Conversations">
            <header className="mm-list-pane-head">
              <div className="mm-list-pane-title-row">
                <span className="mm-list-pane-eyebrow">
                  THREADS · {threads.length}
                </span>
              </div>

              <label className="mm-list-search">
                <span className="mm-list-search-icon" aria-hidden>
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  placeholder="Search creators, campaigns…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search conversations"
                />
              </label>

              <div
                className="mm-list-filters"
                role="tablist"
                aria-label="Filter"
              >
                {(
                  [
                    { value: "all", label: "All", count: 0 },
                    { value: "unread", label: "Unread", count: unreadCount },
                    {
                      value: "needs-reply",
                      label: "Needs reply",
                      count: needsReplyCount,
                    },
                  ] as Array<{
                    value: FilterKey;
                    label: string;
                    count: number;
                  }>
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="tab"
                    aria-selected={filter === opt.value}
                    className={`mm-list-filter-chip${filter === opt.value ? " is-active" : ""}`}
                    onClick={() => setFilter(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {opt.count > 0 && (
                      <span className="mm-list-filter-badge">{opt.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </header>

            <div ref={listRef} className="mm-list-body anim-stagger">
              {grouped.length === 0 ? (
                <div className="mm-list-empty">
                  {query ? (
                    <>
                      <p>
                        Nothing matches &ldquo;{query}&rdquo;. Try a creator
                        name, campaign, or keyword from the message body.
                      </p>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{
                          marginTop: 12,
                          padding: "8px 16px",
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          borderRadius: 8,
                          border: "1px solid var(--hairline)",
                          background: "transparent",
                          color: "var(--ink)",
                        }}
                        onClick={() => setQuery("")}
                      >
                        Clear search
                      </button>
                    </>
                  ) : filter === "unread" ? (
                    <>
                      <p>Inbox zero — no unread threads.</p>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{
                          marginTop: 12,
                          padding: "8px 16px",
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          borderRadius: 8,
                          border: "1px solid var(--hairline)",
                          background: "transparent",
                          color: "var(--ink)",
                        }}
                        onClick={() => setFilter("all")}
                      >
                        Show all conversations
                      </button>
                    </>
                  ) : filter === "needs-reply" ? (
                    <>
                      <p>
                        Nothing waiting on you. Replies you owe creators land
                        here so nothing slips.
                      </p>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{
                          marginTop: 12,
                          padding: "8px 16px",
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          borderRadius: 8,
                          border: "1px solid var(--hairline)",
                          background: "transparent",
                          color: "var(--ink)",
                        }}
                        onClick={() => setFilter("all")}
                      >
                        Show all conversations
                      </button>
                    </>
                  ) : (
                    <p>Quiet for now — new threads will appear here.</p>
                  )}
                </div>
              ) : (
                grouped.map((g) => (
                  <div key={g.label} className="mm-list-group">
                    <p className="mm-list-group-label">{g.label}</p>
                    {g.threads.map((thread) => {
                      const other = otherParty(thread);
                      const active = thread.id === activeThreadId;
                      const unread = (thread.unreadCount ?? 0) > 0;

                      return (
                        <button
                          key={thread.id}
                          data-thread-id={thread.id}
                          type="button"
                          onClick={() => selectThread(thread.id)}
                          onKeyDown={(e) => handleRowKey(e, thread.id)}
                          aria-current={active ? "true" : undefined}
                          aria-label={`${other.name}${unread ? " (unread)" : ""}`}
                          className={[
                            "mm-list-row",
                            active ? "is-active" : "",
                            unread ? "is-unread" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {unread && (
                            <span className="mm-list-row-dot" aria-hidden />
                          )}
                          <span
                            className="mm-list-row-avatar"
                            style={{ background: avatarTone(other.name) }}
                            aria-hidden
                          >
                            {other.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={other.avatar} alt="" />
                            ) : (
                              initialOf(other.name)
                            )}
                          </span>
                          <span className="mm-list-row-body">
                            <span className="mm-list-row-top">
                              <span className="mm-list-row-name">
                                {other.name}
                              </span>
                              <span
                                className="mm-list-row-time"
                                title={new Date(
                                  thread.updatedAt,
                                ).toLocaleString()}
                              >
                                {timeAgo(thread.updatedAt)}
                              </span>
                            </span>
                            <span className="mm-list-row-bottom">
                              <span className="mm-list-row-preview">
                                {preview(thread.lastMessage.content)}
                              </span>
                              {unread ? (
                                <span
                                  className="mm-list-row-unread"
                                  aria-label={`${thread.unreadCount} unread`}
                                >
                                  {thread.unreadCount}
                                </span>
                              ) : null}
                            </span>
                            {thread.campaignTitle ? (
                              <span className="mm-list-row-tag">
                                {thread.campaignTitle}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <p className="mm-list-hint" aria-hidden>
              <kbd>J</kbd> <kbd>K</kbd> nav · <kbd>R</kbd> reply
            </p>
          </aside>

          {/* ── Right pane: active conversation ─────────────────── */}
          <section
            className="mm-thread-pane"
            aria-label="Conversation"
            aria-live="polite"
          >
            {!activeThread ? (
              <div className="mm-thread-empty">
                <span className="mm-thread-empty-icon" aria-hidden>
                  <SearchIcon />
                </span>
                <h3 className="mm-thread-empty-title">Pick a conversation.</h3>
                <p className="mm-thread-empty-body">
                  Tap any thread on the left to read it here. Use J / K to
                  cycle.
                </p>
              </div>
            ) : (
              <>
                <header className="mm-thread-head">
                  <button
                    type="button"
                    className="mm-thread-back"
                    onClick={() => selectThread(null)}
                    aria-label="Back to list"
                  >
                    <ChevronLeft />
                  </button>
                  {activeOther ? (
                    <span
                      className="mm-thread-head-avatar"
                      style={{ background: avatarTone(activeOther.name) }}
                      aria-hidden
                    >
                      {initialOf(activeOther.name)}
                    </span>
                  ) : null}
                  <div className="mm-thread-head-info">
                    <p className="mm-thread-head-name">
                      {activeOther?.name ?? "Conversation"}
                    </p>
                    <p className="mm-thread-head-meta">
                      CREATOR
                      {activeThread.campaignTitle
                        ? ` · ${activeThread.campaignTitle.toUpperCase()}`
                        : ""}
                    </p>
                  </div>
                  {/* Live/offline pill — preserved from Wave C realtime wiring */}
                  {streamStatus === "open" ? (
                    <span
                      className="msg-live-pill"
                      aria-label="Live updates active"
                    >
                      <span className="msg-live-dot" aria-hidden />
                      live
                    </span>
                  ) : streamStatus === "closed" || streamStatus === "error" ? (
                    <span
                      className="msg-live-pill msg-live-pill--offline"
                      aria-label="Offline"
                    >
                      offline
                    </span>
                  ) : null}
                </header>

                {isLoadingMessages ? (
                  <div
                    className="mm-thread-loading"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    aria-label="Loading conversation"
                    style={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      justifyContent: "flex-start",
                      padding: "24px 0",
                    }}
                  >
                    {[
                      { side: "left", w: "62%" },
                      { side: "right", w: "44%" },
                      { side: "left", w: "78%" },
                      { side: "right", w: "52%" },
                    ].map((b, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent:
                            b.side === "right" ? "flex-end" : "flex-start",
                          padding: "0 16px",
                          marginBottom: 8,
                          animation:
                            "skelCardFadeIn 320ms cubic-bezier(0.22,1,0.36,1) both",
                          animationDelay: `${i * 60}ms`,
                        }}
                      >
                        <div
                          className="skel-shimmer"
                          style={{
                            width: b.w,
                            height: 36,
                            borderRadius: 18,
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                    <span className="sr-only">Loading conversation…</span>
                  </div>
                ) : groupedMessages.length === 0 ? (
                  <div className="mm-thread-empty-bubbles">
                    <p>No messages yet — say hi to get the thread moving.</p>
                  </div>
                ) : (
                  <div className="mm-thread-body" ref={bubblesRef}>
                    {groupedMessages.map((m) => {
                      const isSelf = m.senderRole === "merchant";
                      const groupedClass =
                        m.position === "top"
                          ? "is-grouped-top"
                          : m.position === "mid"
                            ? "is-grouped-mid"
                            : m.position === "bottom"
                              ? "is-grouped-bottom"
                              : "is-single";
                      const showAvatar =
                        !isSelf &&
                        (m.position === "single" || m.position === "bottom") &&
                        activeOther;
                      return (
                        <div key={m.id}>
                          {m.showStamp && (
                            <p
                              className="mm-bubble-stamp"
                              suppressHydrationWarning
                            >
                              {formatBubbleStamp(m.createdAt)}
                            </p>
                          )}
                          <div
                            className={[
                              "mm-bubble-row",
                              isSelf ? "is-self" : "",
                              groupedClass,
                              showAvatar ? "show-avatar" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {!isSelf && activeOther ? (
                              <span
                                className="mm-bubble-avatar"
                                style={{
                                  background: avatarTone(activeOther.name),
                                }}
                                aria-hidden
                              >
                                {initialOf(activeOther.name)}
                              </span>
                            ) : null}
                            <div
                              className={`mm-bubble mm-bubble--${isSelf ? "out" : "in"}`}
                            >
                              {m.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <form className="mm-composer" onSubmit={handleSend}>
                  <textarea
                    ref={composerRef}
                    className="mm-composer-input"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleComposerKey}
                    placeholder={
                      activeOther
                        ? `Message ${activeOther.name} · Enter to send`
                        : "Select a conversation"
                    }
                    aria-label="Message input"
                    rows={1}
                    disabled={!activeThreadId}
                  />
                  <button
                    type="submit"
                    className="mm-composer-send"
                    disabled={!activeThreadId || !inputValue.trim()}
                    aria-label="Send"
                    title="Send (Enter)"
                  >
                    <SendIcon />
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
