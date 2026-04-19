// Push Messaging — Type Definitions
// Append-only: does not modify existing lib/data types

import type { CreatorTier } from "@/lib/demo-data";

export type UserRole = "creator" | "merchant";

export interface ThreadParticipant {
  userId: string;
  role: UserRole;
  name: string;
  avatar: string;
  tier?: CreatorTier; // creators only
}

export interface MessageAttachment {
  id: string;
  type: "image" | "file";
  url: string;
  name: string;
  size?: number; // bytes
}

export type MessageContentType = "text" | "image" | "campaign-reference";

export interface CampaignReference {
  campaignId: string;
  title: string;
  businessName: string;
  payout: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  contentType: MessageContentType;
  campaignRef?: CampaignReference;
  attachments: MessageAttachment[];
  createdAt: string;
  readAt?: string;
}

export type ThreadFilter = "all" | "unread" | "campaigns" | "direct";

export interface Thread {
  id: string;
  participants: ThreadParticipant[];
  campaignId?: string; // if campaign-specific thread
  campaignTitle?: string;
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

// API shapes
export interface SendMessagePayload {
  threadId: string;
  content: string;
  contentType?: MessageContentType;
  campaignRef?: CampaignReference;
  attachments?: Omit<MessageAttachment, "id">[];
}

export interface CreateThreadPayload {
  participantUserId: string;
  participantRole: UserRole;
  campaignId?: string;
  initialMessage: string;
}
