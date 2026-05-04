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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 24px",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--hairline)",
        fontFamily: "var(--font-body)",
        fontSize: 12,
      }}
      aria-label="Campaign context"
    >
      <span style={{ color: "var(--ink-4)", fontSize: 10 }}>◈</span>
      <span
        style={{
          color: "var(--ink-4)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Campaign
      </span>
      <span style={{ color: "var(--ink)", fontWeight: 600 }}>{title}</span>
      <span
        style={{
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 11,
          background: isActive
            ? "var(--accent-blue)"
            : "var(--surface-3, var(--surface-2))",
          color: isActive ? "var(--snow)" : "var(--ink-3)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {isActive ? "Active" : (status ?? "Pending")}
      </span>
      {earn != null && earn > 0 && (
        <span
          style={{ marginLeft: "auto", color: "var(--ink)", fontWeight: 700 }}
        >
          ${earn}
        </span>
      )}
    </div>
  );
}

/* ── Message bubble ─────────────────────────────────────────── */
function Bubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSelf ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Campaign reference card */}
        {message.contentType === "campaign-reference" &&
          message.campaignRef && (
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "12px 16px",
                fontFamily: "var(--font-body)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                Campaign
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {message.campaignRef.title}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}
              >
                {message.campaignRef.businessName}
                {message.campaignRef.payout > 0
                  ? ` · $${message.campaignRef.payout}`
                  : " · Free product"}
              </div>
            </div>
          )}

        {/* Text bubble */}
        {message.content && (
          <div
            style={{
              background: isSelf ? "var(--brand-red)" : "var(--surface-2)",
              border: isSelf ? "none" : "1px solid var(--hairline)",
              borderRadius: 10,
              padding: "10px 14px",
              color: isSelf ? "var(--snow)" : "var(--ink)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </p>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: isSelf ? "rgba(255,255,255,0.6)" : "var(--ink-4)",
                marginTop: 4,
                textAlign: "right",
              }}
            >
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
    <div
      style={{
        borderTop: "1px solid var(--hairline)",
        background: "var(--surface)",
        padding: "12px 16px 16px",
        flexShrink: 0,
      }}
    >
      {/* Quick reply chips */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}
        role="group"
        aria-label="Quick replies"
      >
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => handleChip(qr)}
            type="button"
            tabIndex={0}
            className="btn-ghost click-shift"
            style={{
              fontSize: 12,
              padding: "4px 12px",
              fontFamily: "var(--font-body)",
            }}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
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
          style={{
            flex: 1,
            resize: "none",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink)",
            background: "var(--snow)",
            outline: "none",
            lineHeight: 1.5,
            overflow: "hidden",
          }}
        />
        <button
          className="btn-primary click-shift"
          onClick={submit}
          disabled={!canSend}
          type="button"
          aria-label="Send message"
          style={{ flexShrink: 0, opacity: canSend ? 1 : 0.5 }}
        >
          Send
        </button>
      </div>

      {/* Hint */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-4)",
          margin: "8px 0 0",
        }}
      >
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/creator/inbox/messages"
          aria-label="Back to messages"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            color: "var(--ink)",
            background: "var(--surface-2)",
            flexShrink: 0,
          }}
          className="click-shift"
        >
          <BackIcon />
        </Link>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: avatarStyle(otherInitial).background as string,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--snow)",
            }}
            data-initial={otherInitial}
          >
            {otherInitial}
          </div>
          <span
            aria-label="Online"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid var(--snow)",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--ink)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {other ? other.name : "Loading…"}
          </div>
          {other && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                marginTop: 2,
              }}
            >
              {lastSeenLabel(thread?.updatedAt ?? new Date().toISOString())}
            </div>
          )}
        </div>

        {thread?.campaignTitle && (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-3)",
              flexShrink: 0,
            }}
          >
            {thread.campaignTitle}
          </span>
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
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {loading && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
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
                fontSize: 20,
                fontWeight: 700,
                color: "var(--ink-4)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              No messages yet
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                margin: 0,
              }}
            >
              Send the first message below
            </p>
          </div>
        )}

        {!loading &&
          groups.map((group, gi) => (
            <div key={group.date} style={{ animationDelay: `${gi * 80}ms` }}>
              {/* Date divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "16px 0",
                }}
              >
                <div
                  style={{ flex: 1, height: 1, background: "var(--hairline)" }}
                />
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
                  {group.date}
                </span>
                <div
                  style={{ flex: 1, height: 1, background: "var(--hairline)" }}
                />
              </div>
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
  return { background: map[initial] ?? "var(--ink-3)" };
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
