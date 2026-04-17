// Push Messaging — API Client (api.messages.*)
// Reads/writes localStorage for mock mode; swap fetch() calls to wire real backend.

import type {
  Thread,
  Message,
  SendMessagePayload,
  CreateThreadPayload,
  UserRole,
} from "./types";
import { MOCK_THREADS, MOCK_MESSAGES } from "./mock-threads";

const LS_THREADS = "push_msg_threads";
const LS_MESSAGES = "push_msg_messages";

// ---------------------------------------------------------------------------
// LocalStorage helpers
// ---------------------------------------------------------------------------

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return MOCK_THREADS;
  try {
    const raw = localStorage.getItem(LS_THREADS);
    return raw ? JSON.parse(raw) : MOCK_THREADS;
  } catch {
    return MOCK_THREADS;
  }
}

function saveThreads(threads: Thread[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_THREADS, JSON.stringify(threads));
}

function loadMessages(): Record<string, Message[]> {
  if (typeof window === "undefined") return MOCK_MESSAGES;
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    return raw ? JSON.parse(raw) : MOCK_MESSAGES;
  } catch {
    return MOCK_MESSAGES;
  }
}

function saveMessages(msgs: Record<string, Message[]>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_MESSAGES, JSON.stringify(msgs));
}

function uid(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// api.messages namespace
// ---------------------------------------------------------------------------

export const api = {
  messages: {
    /** List threads for a given role/userId, newest first */
    listThreads(role: UserRole, userId: string): Promise<Thread[]> {
      const threads = loadThreads();
      const filtered = threads
        .filter((t) =>
          t.participants.some((p) => p.role === role && p.userId === userId),
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      return Promise.resolve(filtered);
    },

    /** Create a new thread (optimistic) */
    createThread(
      payload: CreateThreadPayload,
      selfUserId: string,
      selfRole: UserRole,
      selfName: string,
      selfAvatar: string,
    ): Promise<Thread> {
      const threads = loadThreads();
      const now = new Date().toISOString();
      const thread: Thread = {
        id: uid(),
        participants: [
          {
            userId: selfUserId,
            role: selfRole,
            name: selfName,
            avatar: selfAvatar,
          },
          {
            userId: payload.participantUserId,
            role: payload.participantRole,
            name: "New Contact",
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${payload.participantUserId}`,
          },
        ],
        campaignId: payload.campaignId,
        lastMessage: {
          content: payload.initialMessage,
          senderId: selfUserId,
          createdAt: now,
        },
        unreadCount: 0,
        updatedAt: now,
      };
      const updated = [thread, ...threads];
      saveThreads(updated);

      // Also seed first message
      const msgs = loadMessages();
      msgs[thread.id] = [
        {
          id: uid(),
          threadId: thread.id,
          senderId: selfUserId,
          senderRole: selfRole,
          content: payload.initialMessage,
          contentType: "text",
          attachments: [],
          createdAt: now,
        },
      ];
      saveMessages(msgs);

      return Promise.resolve(thread);
    },

    /** Get messages for a thread, oldest first, with basic pagination */
    getMessages(
      threadId: string,
      page = 1,
      pageSize = 50,
    ): Promise<{ messages: Message[]; total: number; hasMore: boolean }> {
      const all = loadMessages();
      const msgs = (all[threadId] ?? []).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const total = msgs.length;
      const start = Math.max(0, total - page * pageSize);
      const end = total - (page - 1) * pageSize;
      return Promise.resolve({
        messages: msgs.slice(start, end),
        total,
        hasMore: start > 0,
      });
    },

    /** Send a message (optimistic) — returns the created message */
    sendMessage(
      payload: SendMessagePayload,
      selfUserId: string,
      selfRole: UserRole,
    ): Promise<Message> {
      const msgs = loadMessages();
      const threads = loadThreads();
      const now = new Date().toISOString();
      const msg: Message = {
        id: uid(),
        threadId: payload.threadId,
        senderId: selfUserId,
        senderRole: selfRole,
        content: payload.content,
        contentType: payload.contentType ?? "text",
        campaignRef: payload.campaignRef,
        attachments: (payload.attachments ?? []).map((a) => ({
          ...a,
          id: uid(),
        })),
        createdAt: now,
      };

      if (!msgs[payload.threadId]) msgs[payload.threadId] = [];
      msgs[payload.threadId] = [...msgs[payload.threadId], msg];
      saveMessages(msgs);

      // Update thread lastMessage + updatedAt
      const ti = threads.findIndex((t) => t.id === payload.threadId);
      if (ti !== -1) {
        threads[ti] = {
          ...threads[ti],
          lastMessage: {
            content: payload.content,
            senderId: selfUserId,
            createdAt: now,
          },
          updatedAt: now,
        };
        saveThreads(threads);
      }

      return Promise.resolve(msg);
    },

    /** Mark all messages in a thread as read for a given user */
    markRead(threadId: string, userId: string): Promise<void> {
      const msgs = loadMessages();
      const now = new Date().toISOString();
      if (msgs[threadId]) {
        msgs[threadId] = msgs[threadId].map((m) =>
          m.senderId !== userId && !m.readAt ? { ...m, readAt: now } : m,
        );
        saveMessages(msgs);
      }
      const threads = loadThreads();
      const ti = threads.findIndex((t) => t.id === threadId);
      if (ti !== -1) {
        threads[ti] = { ...threads[ti], unreadCount: 0 };
        saveThreads(threads);
      }
      return Promise.resolve();
    },
  },
};
