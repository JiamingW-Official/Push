export type InboxFilter = "all" | "invites" | "messages" | "system";

export type InboxItemType = "invite" | "message" | "system";

export interface InboxItem {
  id: string;
  type: InboxItemType;
  read: boolean;
  createdAt: string;
  // invite-specific
  merchantName?: string;
  merchantLogoUrl?: string;
  campaignTitle?: string;
  payout?: number;
  expiresAt?: string; // ISO date string
  campaignId?: string;
  // message-specific
  senderName?: string;
  messagePreview?: string;
  threadId?: string;
  unreadCount?: number;
  // system-specific
  systemIcon?: "tier" | "payout" | "verify" | "compliance";
  systemTitle?: string;
  systemBody?: string;
}

const now = new Date();
function hoursFromNow(h: number) {
  return new Date(now.getTime() + h * 3600000).toISOString();
}
function hoursAgo(h: number) {
  return new Date(now.getTime() - h * 3600000).toISOString();
}

const MOCK_ITEMS: InboxItem[] = [
  {
    id: "inv-001",
    type: "invite",
    read: false,
    createdAt: hoursAgo(0.5),
    merchantName: "Onyx Coffee Bar",
    campaignTitle: "Morning Ritual — Summer Edition",
    payout: 65,
    expiresAt: hoursFromNow(1.5),
    campaignId: "camp-001",
  },
  {
    id: "inv-002",
    type: "invite",
    read: false,
    createdAt: hoursAgo(1.2),
    merchantName: "Matcha House",
    campaignTitle: "Ceremonial Grade Content Push",
    payout: 45,
    expiresAt: hoursFromNow(4),
    campaignId: "camp-002",
  },
  {
    id: "msg-001",
    type: "message",
    read: true,
    createdAt: hoursAgo(3),
    senderName: "Onyx Coffee Bar",
    messagePreview: "Hey! Just checking in on the shoot timing for next week.",
    threadId: "thread-001",
    unreadCount: 0,
  },
  {
    id: "sys-001",
    type: "system",
    read: false,
    createdAt: hoursAgo(6),
    systemIcon: "tier",
    systemTitle: "Tier progress update",
    systemBody: "You're 8 points away from Explorer tier.",
  },
  {
    id: "sys-002",
    type: "system",
    read: true,
    createdAt: hoursAgo(24),
    systemIcon: "payout",
    systemTitle: "Payout processed",
    systemBody: "$45.00 sent to your Venmo account.",
  },
];

export async function getInboxItems(
  filter: InboxFilter = "all",
): Promise<InboxItem[]> {
  await new Promise((r) => setTimeout(r, 120));
  if (filter === "all") return MOCK_ITEMS;
  if (filter === "invites")
    return MOCK_ITEMS.filter((i) => i.type === "invite");
  if (filter === "messages")
    return MOCK_ITEMS.filter((i) => i.type === "message");
  return MOCK_ITEMS.filter((i) => i.type === "system");
}

export async function respondToInvite(
  inviteId: string,
  action: "accept" | "decline",
): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  console.log(`[mock] respondToInvite: ${inviteId} → ${action}`);
}

export async function markRead(itemIds: string[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));
  console.log(`[mock] markRead: ${itemIds.join(", ")}`);
}

export function getUnreadCount(items: InboxItem[]): number {
  return items.filter((i) => !i.read).length;
}

export function formatCountdown(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export function isUrgent(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() - Date.now() < 30 * 60 * 1000;
}
