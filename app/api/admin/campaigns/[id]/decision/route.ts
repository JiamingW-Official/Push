// Admin API — POST /api/admin/campaigns/[id]/decision
// Body: { action: "approve" | "request_changes" | "flag" | "suspend" | "force_refund",
//         note?: string, flag_type?: string, flag_description?: string }

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CAMPAIGNS,
  getAdminCampaignById,
  type AdminCampaignStatus,
  type AdminFlag,
} from "@/lib/admin/mock-campaigns";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { notFound, badRequest } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

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
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const campaign = getAdminCampaignById(id);

  if (!campaign) {
    return notFound("Campaign not found");
  }

  let body: {
    action?: DecisionAction;
    note?: string;
    flag_type?: string;
    flag_description?: string;
  };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
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
    // TODO(codemod): migrate to badRequest/etc. — message contains a template literal
    return NextResponse.json(
      {
        error: `action must be one of: ${validActions.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const idx = ADMIN_CAMPAIGNS.findIndex((c) => c.id === id);

  if (idx === -1) {
    return notFound("Campaign not found");
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
