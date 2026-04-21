"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/db/browser";
import { api } from "@/lib/messaging/api-client";
import type { Thread, Message, UserRole } from "@/lib/messaging/types";
import "../inbox.css";

const DEMO_USER_ID = "demo-user-001";
const DEMO_USER_NAME = "Alex Chen";
const DEMO_USER_ROLE: UserRole = "creator";

const QUICK_REPLIES = [
  "Will submit by Friday",
  "Need more info",
  "Sounds good!",
  "Can we reschedule?",
];

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Time helpers ───────────────────────────────────────────── */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateDivider(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (same(d, today)) return "Today";
  if (same(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupByDate(
  messages: Message[],
): Array<{ date: string; messages: Message[] }> {
  const groups: Array<{ date: string; messages: Message[] }> = [];
  for (const msg of messages) {
    const label = formatDateDivider(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.date === label) last.messages.push(msg);
    else groups.push({ date: label, messages: [msg] });
  }
  return groups;
}

function getOtherParticipant(thread: Thread, selfUserId: string) {
  return (
    thread.participants.find((p) => p.userId !== selfUserId) ??
    thread.participants[0]
  );
}

function lastSeenLabel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Active now";
  if (mins < 60) return `Last seen ${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `Last seen ${h}h ago`;
  return `Last seen ${Math.floor(h / 24)}d ago`;
}

/* ── Campaign Context Bar ───────────────────────────────────── */
function CampaignContextBar({
  title,
  status,
  earn,
}: {
  title: string;
  status?: string;
  earn?: number;
}) {
  const isActive =
    status === "active" || status === "live" || status === "running";

  return (
    <div className="inbox-thread__context-bar" aria-label="Campaign context">
      <span className="inbox-thread__context-bar-icon" aria-hidden>
        ◈
      </span>
      <span className="inbox-thread__context-bar-label">Campaign</span>
      <span className="inbox-thread__context-bar-name">{title}</span>
      <span
        className={`inbox-thread__context-bar-status ${
          isActive
            ? "inbox-thread__context-bar-status--active"
            : "inbox-thread__context-bar-status--pending"
        }`}
      >
        {isActive ? "Active" : (status ?? "Pending")}
      </span>
      {earn != null && earn > 0 && (
        <span className="inbox-thread__context-bar-earn">${earn}</span>
      )}
    </div>
  );
}

/* ── Message bubble ─────────────────────────────────────────── */
function Bubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  return (
    <div
      className={`msg-bubble-row ${isSelf ? "msg-bubble-row--self" : "msg-bubble-row--other"}`}
    >
      <div className="msg-bubble-wrap">
        {/* Campaign reference card */}
        {message.contentType === "campaign-reference" &&
          message.campaignRef && (
            <div className="msg-campaign-ref">
              <span className="msg-campaign-ref__label">Campaign</span>
              <span className="msg-campaign-ref__title">
                {message.campaignRef.title}
              </span>
              <span className="msg-campaign-ref__meta">
                {message.campaignRef.businessName}
                {message.campaignRef.payout > 0
                  ? ` · $${message.campaignRef.payout}`
                  : " · Free product"}
              </span>
            </div>
          )}

        {/* Text bubble */}
        {message.content && (
          <div
            className={`msg-bubble ${isSelf ? "msg-bubble--self" : "msg-bubble--other"}`}
          >
            <p className="msg-bubble__text">{message.content}</p>
            <span className="msg-bubble__time">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Composer ───────────────────────────────────────────────── */
function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [value, disabled, onSend]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) submit();
    }
  };

  const handleChip = (text: string) => {
    setValue(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="inbox-composer">
      {/* Quick reply chips */}
      <div
        className="inbox-composer__quickreply"
        role="group"
        aria-label="Quick replies"
      >
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            className="inbox-composer__chip"
            onClick={() => handleChip(qr)}
            type="button"
            tabIndex={0}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="inbox-composer__input-row">
        <textarea
          ref={textareaRef}
          className="inbox-composer__textarea"
          value={value}
          placeholder="Write a message…"
          rows={1}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={handleKey}
          aria-label="Message input"
        />
        <button
          className="inbox-composer__send"
          onClick={submit}
          disabled={!canSend}
          type="button"
          aria-label="Send message"
        >
          Send
        </button>
      </div>

      {/* Hint */}
      <p className="inbox-composer__hint">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams<{ threadId: string }>();
  const threadId = params?.threadId ?? "";

  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  /* Auth + load */
  useEffect(() => {
    if (!threadId) return;
    const isDemo = checkDemoMode();

    const load = async (uid: string) => {
      setSelfUserId(uid);
      try {
        const threads = await api.messages.listThreads("creator", uid);
        const found = threads.find((t) => t.id === threadId) ?? null;
        setThread(found);

        const { messages: msgs } = await api.messages.getMessages(threadId);
        setMessages(msgs);
        setLoading(false);
        requestAnimationFrame(() => scrollToBottom("instant"));

        api.messages.markRead(threadId, uid).catch(() => {});
      } catch {
        setLoading(false);
      }
    };

    if (isDemo) {
      load(DEMO_USER_ID);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/creator/login");
        return;
      }
      load(data.user.id);
    });
  }, [threadId, router, scrollToBottom]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!thread || !selfUserId || sending) return;

      const optimistic: Message = {
        id: `opt-${Date.now()}`,
        threadId: thread.id,
        senderId: selfUserId,
        senderRole: DEMO_USER_ROLE,
        content,
        contentType: "text",
        attachments: [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setSending(true);
      requestAnimationFrame(() => scrollToBottom());

      try {
        const real = await api.messages.sendMessage(
          { threadId: thread.id, content, contentType: "text" },
          selfUserId,
          DEMO_USER_ROLE,
        );
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? real : m)),
        );
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      } finally {
        setSending(false);
      }
    },
    [thread, selfUserId, sending, scrollToBottom],
  );

  const groups = useMemo(() => groupByDate(messages), [messages]);

  const other =
    thread && selfUserId ? getOtherParticipant(thread, selfUserId) : null;

  const otherInitial = other ? other.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="inbox-thread">
      {/* Header */}
      <header className="inbox-thread__header">
        <Link
          href="/creator/inbox/messages"
          className="inbox-thread__back"
          aria-label="Back to messages"
        >
          <BackIcon />
        </Link>

        <div className="inbox-thread__avatar-wrap">
          <div
            className="inbox-thread__avatar"
            data-initial={otherInitial}
            style={avatarStyle(otherInitial)}
          >
            {otherInitial}
          </div>
          {/* Status dot — active for demo */}
          <span className="inbox-thread__avatar-status" aria-label="Online" />
        </div>

        <div className="inbox-thread__info">
          <div className="inbox-thread__name">
            {other ? other.name : "Loading…"}
          </div>
          {other && (
            <div className="inbox-thread__status">
              {lastSeenLabel(thread?.updatedAt ?? new Date().toISOString())}
            </div>
          )}
        </div>

        {thread?.campaignTitle && (
          <div className="inbox-thread__campaign-badge">
            {thread.campaignTitle}
          </div>
        )}
      </header>

      {/* Campaign context bar — pinned below header */}
      {thread?.campaignTitle && (
        <CampaignContextBar
          title={thread.campaignTitle}
          status="active"
          earn={thread.campaignId ? 48 : undefined}
        />
      )}

      {/* Messages area */}
      <div className="inbox-thread__messages" ref={scrollRef}>
        {loading && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "rgba(0,48,73,0.28)",
              textAlign: "center",
              margin: "auto",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Loading…
          </p>
        )}

        {!loading && messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 700,
                color: "rgba(0,48,73,0.22)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              No messages yet
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "rgba(0,48,73,0.18)",
                margin: 0,
              }}
            >
              Send the first message below
            </p>
          </div>
        )}

        {!loading &&
          groups.map((group, gi) => (
            <div
              key={group.date}
              className="inbox-thread__group"
              style={{ animationDelay: `${gi * 80}ms` }}
            >
              <div className="inbox-thread__date-divider">{group.date}</div>
              {group.messages.map((msg) => (
                <Bubble
                  key={msg.id}
                  message={msg}
                  isSelf={msg.senderId === selfUserId}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Composer */}
      <Composer onSend={handleSend} disabled={sending || loading} />
    </div>
  );
}

/* ── Avatar color by initial ────────────────────────────────── */
function avatarStyle(initial: string): React.CSSProperties {
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
    F: "var(--accent)",
    L: "var(--accent)",
    R: "var(--accent)",
  };
  return { background: map[initial] ?? "var(--dark)" };
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12 4L6 10L12 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
