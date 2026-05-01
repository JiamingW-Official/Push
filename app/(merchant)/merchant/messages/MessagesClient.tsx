"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EmptyState, PageHeader } from "@/components/merchant/shared";
import type { Message, Thread, ThreadParticipant } from "@/lib/messaging/types";
import "./messages.css";

type ThreadWithMessages = Thread & { messages: Message[] };

/* ──────────────────────────────────────────────────────────────────
   Time formatting — bubble timestamps stay clock-style; thread list
   uses relative ago for scannability (parity with creator messages). */
function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

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

/* ──────────────────────────────────────────────────────────────────
   Avatar — colored initial tile; merchant view sees creators / Push
   platform / payments roles. Closed token list compliant.            */
const ROLE_LABEL: Record<
  NonNullable<ThreadParticipant["role"]> | "platform",
  string
> = {
  creator: "CREATOR",
  merchant: "MERCHANT",
  platform: "PLATFORM",
};

function avatarTone(name: string): string {
  // Deterministic hash → one of 4 allowed tones (closed token list).
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

/* ──────────────────────────────────────────────────────────────────
   Truncate at render (CSS already handles single-line ellipsis, but
   we cap at ~140 chars to bound DOM weight for chatty payloads).     */
function preview(content: string): string {
  if (content.length <= 140) return content;
  return `${content.slice(0, 137)}…`;
}

async function fetchThread(threadId: string): Promise<ThreadWithMessages> {
  const response = await fetch(`/api/merchant/messages/threads/${threadId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load thread");
  }

  return response.json();
}

/* ──────────────────────────────────────────────────────────────────
   Other-party resolver — merchant view excludes the merchant's own
   participant; falls back to a sensible default if missing.          */
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

export default function MessagesClient({
  initialThreads,
}: {
  initialThreads: Thread[];
}) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreads[0]?.id ?? null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(
    initialThreads.length > 0,
  );

  const listRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Load + mark-read whenever active thread changes. */
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    let cancelled = false;
    setIsLoadingMessages(true);

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

  /* Auto-scroll to newest bubble whenever message list changes. */
  useEffect(() => {
    if (!bubblesRef.current) return;
    bubblesRef.current.scrollTop = bubblesRef.current.scrollHeight;
  }, [messages]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  );

  const activeOther = activeThread ? otherParty(activeThread) : null;

  const totalUnread = useMemo(
    () => threads.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0),
    [threads],
  );

  /* Pinned: highest-priority thread = first unread, else first thread.
     Single liquid-glass tile (≤1 per viewport) when unread > 0.       */
  const pinned = useMemo(
    () => threads.find((t) => (t.unreadCount ?? 0) > 0) ?? null,
    [threads],
  );

  /* Keyboard navigation — J/K cycle through visible threads, Enter
     opens the focused row. Disabled while typing in the input.        */
  const orderedIds = useMemo(() => threads.map((t) => t.id), [threads]);

  const handleSend = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed || !activeThreadId) return;

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
        if (next) setActiveThreadId(next);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = orderedIds.indexOf(activeThreadId ?? "");
        const next = orderedIds[Math.max(0, idx - 1)];
        if (next) setActiveThreadId(next);
      } else if (e.key === "r" && activeThreadId) {
        e.preventDefault();
        inputRef.current?.focus();
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
        setActiveThreadId(id);
      }
    },
    [],
  );

  return (
    <section className="msg-page">
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
            title="No conversations yet"
            description="Open an applicant card and tap Message to start a thread with a creator."
          />
        </div>
      ) : (
        <>
          {/* ── Pinned (≤1 liquid-glass tile per viewport) ───────────
             Surfaces a single unread thread as a focus magnet. Click
             selects + scrolls to the thread; does not navigate away. */}
          {pinned ? (
            <button
              type="button"
              className="msg-pinned"
              onClick={() => setActiveThreadId(pinned.id)}
              aria-label={`Open conversation with ${otherParty(pinned).name}`}
            >
              <span className="msg-pinned-eyebrow">
                ACTIVE · UNREAD {totalUnread}
              </span>
              <span className="msg-pinned-row">
                <span
                  className="msg-pinned-avatar"
                  style={{ background: avatarTone(otherParty(pinned).name) }}
                  aria-hidden
                >
                  {initialOf(otherParty(pinned).name)}
                </span>
                <span className="msg-pinned-body">
                  <span className="msg-pinned-name">
                    {otherParty(pinned).name}
                  </span>
                  <span className="msg-pinned-preview">
                    {preview(pinned.lastMessage.content)}
                  </span>
                </span>
                <span className="msg-pinned-meta">
                  <span className="msg-pinned-time">
                    {timeAgo(pinned.updatedAt)}
                  </span>
                  <span className="msg-pinned-cta">Open</span>
                </span>
              </span>
            </button>
          ) : null}

          <div className="msg-layout">
            <aside className="msg-sidebar" aria-label="Conversation list">
              <div className="msg-sidebar-head" aria-hidden>
                <span className="msg-sidebar-eyebrow">THREADS</span>
                <span className="msg-sidebar-count">{threads.length}</span>
              </div>

              <div ref={listRef} className="msg-sidebar-list" role="list">
                {threads.map((thread) => {
                  const other = otherParty(thread);
                  const active = thread.id === activeThreadId;
                  const unread = (thread.unreadCount ?? 0) > 0;

                  return (
                    <button
                      key={thread.id}
                      data-thread-id={thread.id}
                      role="listitem"
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      onKeyDown={(e) => handleRowKey(e, thread.id)}
                      aria-current={active ? "true" : undefined}
                      aria-label={`${other.name}${unread ? " (unread)" : ""}`}
                      className={[
                        "msg-thread",
                        active ? "msg-thread--active" : "",
                        unread ? "msg-thread--unread" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className="msg-avatar"
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

                      <span className="msg-thread-body">
                        <span className="msg-thread-top">
                          <span className="msg-name">{other.name}</span>
                          <span
                            className="msg-time"
                            title={new Date(thread.updatedAt).toLocaleString()}
                          >
                            {timeAgo(thread.updatedAt)}
                          </span>
                        </span>
                        <span className="msg-thread-bottom">
                          <span className="msg-preview">
                            {preview(thread.lastMessage.content)}
                          </span>
                          {unread ? (
                            <span
                              className="msg-unread"
                              aria-label={`${thread.unreadCount} unread`}
                            >
                              {thread.unreadCount}
                            </span>
                          ) : null}
                        </span>
                        {thread.campaignTitle ? (
                          <span className="msg-thread-tag">
                            {thread.campaignTitle}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="msg-hint" aria-hidden>
                <kbd>J</kbd> <kbd>K</kbd> nav · <kbd>R</kbd> reply
              </p>
            </aside>

            <section
              className="msg-chat"
              aria-label="Chat window"
              aria-live="polite"
            >
              <header className="msg-chat-head">
                <div className="msg-chat-id">
                  {activeOther ? (
                    <span
                      className="msg-chat-avatar"
                      style={{ background: avatarTone(activeOther.name) }}
                      aria-hidden
                    >
                      {initialOf(activeOther.name)}
                    </span>
                  ) : null}
                  <div className="msg-chat-id-text">
                    <h2>{activeOther?.name ?? "Conversation"}</h2>
                    {activeOther ? (
                      <span className="msg-chat-role">
                        {ROLE_LABEL[activeOther.role] ??
                          activeOther.role.toUpperCase()}
                        {activeThread?.campaignTitle
                          ? ` · ${activeThread.campaignTitle}`
                          : ""}
                      </span>
                    ) : null}
                  </div>
                </div>
              </header>

              {isLoadingMessages ? (
                <div className="msg-loading" role="status">
                  Loading conversation…
                </div>
              ) : messages.length === 0 ? (
                <div className="msg-bubbles-empty">
                  <p>No messages yet — say hi to get the thread moving.</p>
                </div>
              ) : (
                <div ref={bubblesRef} className="msg-bubbles">
                  {messages.map((message) => {
                    const own = message.senderRole === "merchant";

                    return (
                      <article
                        key={message.id}
                        className={`msg-bubble ${own ? "msg-bubble--own" : "msg-bubble--other"}`}
                      >
                        <p>{message.content}</p>
                        <time
                          dateTime={message.createdAt}
                          title={new Date(message.createdAt).toLocaleString()}
                        >
                          {formatClock(message.createdAt)}
                        </time>
                      </article>
                    );
                  })}
                </div>
              )}

              <form className="msg-input-row" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={
                    activeThread ? "Type a message…" : "Select a conversation"
                  }
                  aria-label="Message input"
                  disabled={!activeThreadId}
                />
                <button
                  type="submit"
                  className="msg-send"
                  disabled={!activeThreadId || !inputValue.trim()}
                >
                  Send
                </button>
              </form>
            </section>
          </div>
        </>
      )}
    </section>
  );
}
