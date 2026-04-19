// Push — Dispute Resolution Types
// Shared between creator and merchant flows

export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_response"
  | "resolved"
  | "closed";

export type DisputeOutcome =
  | "refund_creator"
  | "refund_merchant"
  | "split"
  | "dismissed";

export type DisputeReason =
  | "missing_payment"
  | "incorrect_amount"
  | "no_show_scan"
  | "content_violation"
  | "other";

export type DisputeEventType =
  | "filed"
  | "creator_response"
  | "merchant_response"
  | "admin_message"
  | "admin_decision"
  | "evidence_added"
  | "status_change"
  | "reopened";

export type ParticipantRole = "creator" | "merchant" | "admin";

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  uploadedBy: ParticipantRole;
  type: "image" | "link" | "document";
  url: string;
  label: string;
  uploadedAt: string;
}

export interface DisputeEvent {
  id: string;
  disputeId: string;
  type: DisputeEventType;
  authorRole: ParticipantRole;
  authorName: string;
  message: string;
  evidence?: DisputeEvidence[];
  createdAt: string;
}

export interface Dispute {
  id: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  creatorName: string;
  filedBy: string; // user display name
  filedByRole: ParticipantRole;
  otherPartyName: string;
  otherPartyRole: ParticipantRole;
  reason: DisputeReason;
  description: string;
  amount: number; // disputed amount in USD
  expectedOutcome: string;
  status: DisputeStatus;
  events: DisputeEvent[];
  evidence: DisputeEvidence[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  outcome?: DisputeOutcome;
  outcomeNote?: string;
  relatedPaymentId?: string;
  relatedScanId?: string;
}

export const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  missing_payment: "Missing Payment",
  incorrect_amount: "Incorrect Amount",
  no_show_scan: "No-Show / Scan Issue",
  content_violation: "Content Violation",
  other: "Other",
};

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  awaiting_response: "Awaiting Response",
  resolved: "Resolved",
  closed: "Closed",
};

export const DISPUTE_OUTCOME_LABELS: Record<DisputeOutcome, string> = {
  refund_creator: "Decided in Creator's Favor",
  refund_merchant: "Decided in Merchant's Favor",
  split: "Split Resolution",
  dismissed: "Dismissed",
};
