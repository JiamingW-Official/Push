"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import type { Thread, Message, UserRole } from "@/lib/messaging/types";
import { api } from "@/lib/messaging/api-client";
import MessageBubble from "./MessageBubble";
import Composer from "./Composer";

interface Props {
  thread: Thread | null;
  selfUserId: string;
  selfRole: UserRole;
  onThreadUpdate?: (threadId: string) => void;
}

function formatDateDivider(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupMessagesByDate(
  messages: Message[],
): Array<{ date: string; messages: Message[] }> {
  const groups: Array<{ date: string; messages: Message[] }> = [];
  for (const msg of messages) {
    const label = formatDateDivider(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.date === label) {
      last.messages.push(msg);
    } else {
      groups.push({ date: label, messages: [msg] });
    }
  }
  return groups;
}

function getOtherParticipant(thread: Thread, selfUserId: string) {
  return (
    thread.participants.find((p) => p.userId !== selfUserId) ??
    thread.participants[0]
  );
}

export default function ConversationView({
  thread,
  selfUserId,
  selfRole,
  onThreadUpdate,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevThreadId = useRef<string | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (!thread) {
      setMessages([]);
      return;
    }

    const isNewThread = prevThreadId.current !== thread.id;
    prevThreadId.current = thread.id;

    setLoading(true);
    api.messages
      .getMessages(thread.id)
      .then(({ messages: msgs }) => {
        setMessages(msgs);
        setLoading(false);
        if (isNewThread) {
          // instant scroll on first load
          requestAnimationFrame(() => scrollToBottom("instant"));
        }
      })
      .catch(() => setLoading(false));

    // Mark as read when entering thread
    api.messages.markRead(thread.id, selfUserId).catch(() => {});
  }, [thread, selfUserId, scrollToBottom]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!thread || sending) return;

      // Optimistic message
      const optimistic: Message = {
        id: `opt-${Date.now()}`,
        threadId: thread.id,
        senderId: selfUserId,
        senderRole: selfRole,
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
          selfRole,
        );
        // Replace optimistic with real
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? real : m)),
        );
        onThreadUpdate?.(thread.id);
      } catch {
        // Remove optimistic on error
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      } finally {
        setSending(false);
      }
    },
    [thread, selfUserId, selfRole, sending, scrollToBottom, onThreadUpdate],
  );

  const groups = useMemo(() => groupMessagesByDate(messages), [messages]);

  if (!thread) {
    return (
      <div className="conv-view">
        <div className="conv-view__no-thread">
          <p className="conv-view__no-thread-title">No conversation selected</p>
          <p className="conv-view__no-thread-sub">
            Pick a thread on the left or start a new one
          </p>
        </div>
      </div>
    );
  }

  const other = getOtherParticipant(thread, selfUserId);

  return (
    <div className="conv-view">
      {/* Header */}
      <header className="conv-view__header">
        <Image
          src={other.avatar}
          alt={other.name}
          width={36}
          height={36}
          className="conv-view__avatar"
          unoptimized
        />
        <div className="conv-view__header-info">
          <p className="conv-view__peer-name">{other.name}</p>
          {thread.campaignTitle && (
            <p className="conv-view__campaign-badge">{thread.campaignTitle}</p>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="conv-view__messages" ref={scrollRef}>
        {loading && (
          <p
            style={{
              fontFamily: "CS Genio Mono, monospace",
              fontSize: 12,
              color: "rgba(0,48,73,0.3)",
              textAlign: "center",
              margin: "auto",
            }}
          >
            Loading…
          </p>
        )}
        {!loading && messages.length === 0 && (
          <div className="conv-view__empty">
            <p className="conv-view__empty-title">No messages yet</p>
            <p className="conv-view__empty-sub">Send the first message below</p>
          </div>
        )}
        {!loading &&
          groups.map((group) => (
            <div key={group.date}>
              <div className="conv-view__date-divider">{group.date}</div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isSelf={msg.senderId === selfUserId}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Composer */}
      <div className="conv-view__composer-wrap">
        <Composer onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
}
