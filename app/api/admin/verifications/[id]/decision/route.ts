import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_VERIFICATIONS,
  type VerificationStatus,
} from "@/lib/admin/mock-verifications";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { notFound, badRequest } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

type DecisionBody = {
  action: VerificationStatus;
  note?: string;
};

// POST /api/admin/verifications/[id]/decision
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;

  const verification = MOCK_VERIFICATIONS.find((v) => v.id === id);
  if (!verification) {
    return notFound("Verification not found");
  }

  let body: DecisionBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { action, note } = body;
  const validActions: VerificationStatus[] = [
    "approved",
    "rejected",
    "more_info",
    "pending",
  ];
  if (!action || !validActions.includes(action)) {
    return badRequest(`action must be one of: ${validActions.join(", ")}`);
  }

  // In production this would persist to DB — for mock we return the updated record
  const updatedRecord = {
    ...verification,
    status: action,
    decision_history: [
      ...verification.decision_history,
      {
        id: `dec-${Date.now()}`,
        reviewer: "admin@push.co",
        action,
        note: note ?? "",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return NextResponse.json({ verification: updatedRecord, success: true });
}
