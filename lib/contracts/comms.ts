/**
 * COMMS domain contracts. Audit § 6.
 *
 * Routes:
 *   - GET  /api/creator/messages[?thread_id]         → ThreadList | Thread
 *   - POST /api/creator/messages/{thread_id}         → MessageSend
 *   - PATCH /api/creator/messages/{thread_id}/read   → ReadReceipt
 *   - GET  /api/creator/notifications?filter         → NotificationFeed
 *   - PATCH /api/creator/notifications/{id}/read     → ReadResult
 *   - WSS  /api/creator/notifications/stream         → NotificationEvent (sub-protocol)
 */

export type Thread = {
  id: string;
  brand: string;
  brandInitial: string;
  campaignId: string | null;
  unreadCount: number;
  lastMessage: {
    id: string;
    fromKind: "creator" | "merchant" | "system";
    content: string;
    sentAtIso: string;
  };
  lastActivityAtIso: string;
};

export type ThreadList = { rows: Thread[] };

export type Message = {
  id: string;
  threadId: string;
  fromKind: "creator" | "merchant" | "system";
  fromId: string;
  content: string;
  sentAtIso: string;
  /** Optional structured attachments. */
  attachments: { kind: "image" | "file"; href: string; alt?: string }[];
};

export type ThreadDetail = {
  thread: Thread;
  messages: Message[];
  /** Has more older messages — paginate via cursor. */
  hasMore: boolean;
  nextCursor: string | null;
};

export type MessageSend = {
  threadId: string;
  message: Message;
};

export type ReadReceipt = {
  threadId: string;
  /** ISO of when read_at was flipped. */
  readAtIso: string;
};

/* ── Notifications ────────────────────────────────────────── */

export type NotificationKind =
  | "imminent_shoot"
  | "payout_received"
  | "payout_cleared"
  | "brand_message"
  | "invite_arrived"
  | "verification_complete"
  | "scan_verified"
  | "system";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string | null;
  readAtIso: string | null;
  createdAtIso: string;
  metadata: Record<string, unknown>;
};

export type NotificationFeed = {
  rows: Notification[];
  unreadCount: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export type ReadResult = {
  updated: number;
};
