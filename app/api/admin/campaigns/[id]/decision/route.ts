// Admin API — POST /api/admin/campaigns/[id]/decision
// Body: { action: "approve" | "request_changes" | "flag" | "suspend" | "force_refund",
//         note?: string, flag_type?: string, flag_description?: string,
//         disclosure_caption?: string  // required for "approve" — v5.3-EXEC P3-2 gate }
//
// v5.3-EXEC P3-2 activation gate:
//   Approving a campaign is the moment that moves it to status="active" — creators
//   can then start posting. The FTC § 255 Endorsement Guide requires every paid
//   post to carry a clear disclosure. We refuse the `approve` action until a
//   sample creator caption (or placeholder disclosure statement) passes the
//   DisclosureBot keyword engine. Ops supplies the caption in `disclosure_caption`.

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CAMPAIGNS,
  getAdminCampaignById,
  type AdminCampaignStatus,
  type AdminFlag,
} from "@/lib/admin/mock-campaigns";

// Inline FTC keyword set mirrors the DisclosureBot route's FTC_STRONG list.
// Keeping a copy here avoids a cross-route import cycle — if either list
// drifts, CI should fail the e2e test that exercises both paths.
const FTC_STRONG_TOKENS = [
  "#ad",
  "#sponsored",
  "#gifted",
  "#paidpartnership",
  "#brandpartner",
  "#spon",
  "paid partnership",
  "sponsored by",
  "gifted by",
  "in partnership with",
  "ad:",
  "sponsored:",
  "#advertisement",
  "#promo",
  "#promotion",
];

function passesDisclosureGate(caption: string): boolean {
  const lower = caption.toLowerCase();
  return FTC_STRONG_TOKENS.some((k) => lower.includes(k.toLowerCase()));
}

type DecisionAction =
  | "approve"
  | "request_changes"
  | "flag"
  | "suspend"
  | "force_refund";

type RouteContext = { params: Promise<{ id: string }> };

const ACTION_STATUS_MAP: Record<DecisionAction, AdminCampaignStatus | null> = {
  approve: "active",
  request_changes: "pending",
  flag: "flagged",
  suspend: "paused",
  force_refund: null, // does not change status
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const campaign = getAdminCampaignById(id);

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  let body: {
    action?: DecisionAction;
    note?: string;
    flag_type?: string;
    flag_description?: string;
    disclosure_caption?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action, note, flag_type, flag_description } = body;

  const validActions: DecisionAction[] = [
    "approve",
    "request_changes",
    "flag",
    "suspend",
    "force_refund",
  ];
  if (!action || !validActions.includes(action)) {
    return NextResponse.json(
      {
        error: `action must be one of: ${validActions.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // ── v5.3-EXEC P3-2 disclosure gate (activation only) ──────────────────────
  if (action === "approve") {
    const caption = body.disclosure_caption;
    if (!caption || typeof caption !== "string" || !caption.trim()) {
      return NextResponse.json(
        {
          error:
            "disclosure_caption is required when approving — FTC § 255 activation gate. " +
            "Paste a sample creator caption that will ship with this campaign.",
        },
        { status: 409 },
      );
    }
    if (!passesDisclosureGate(caption)) {
      return NextResponse.json(
        {
          error:
            "Disclosure gate failed: caption lacks a recognized FTC § 255 disclosure keyword. " +
            "Require creator to add #ad / #sponsored / 'Paid partnership with …' before approving.",
          sample_caption: caption.slice(0, 140),
        },
        { status: 409 },
      );
    }
  }

  const now = new Date().toISOString();
  const idx = ADMIN_CAMPAIGNS.findIndex((c) => c.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const target = ADMIN_CAMPAIGNS[idx];

  // Apply status transition
  const newStatus = ACTION_STATUS_MAP[action];
  if (newStatus !== null) {
    target.admin_status = newStatus;
    target.status = newStatus;
  }

  target.reviewed_at = now;
  target.reviewed_by = "admin@push.nyc";

  // Append internal note if provided
  if (note) {
    target.internal_notes.push({
      id: `note-${id}-${Date.now()}`,
      author: "admin@push.nyc",
      body: note,
      created_at: now,
    });
  }

  // Add flag if action is "flag"
  if (action === "flag" && flag_description) {
    const newFlag: AdminFlag = {
      id: `flag-${id}-${Date.now()}`,
      type: (flag_type as AdminFlag["type"]) ?? "compliance",
      severity: "medium",
      description: flag_description,
      raised_at: now,
      raised_by: "admin@push.nyc",
    };
    target.flags.push(newFlag);
  }

  // force_refund: set spend_total to 0 (mock)
  if (action === "force_refund") {
    target.spend_total = 0;
  }

  return NextResponse.json({
    success: true,
    action,
    new_status: target.admin_status,
    campaign_id: id,
  });
}
