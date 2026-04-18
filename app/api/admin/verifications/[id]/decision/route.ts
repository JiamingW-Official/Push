import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_VERIFICATIONS,
  type VerificationStatus,
} from "@/lib/admin/mock-verifications";

type DecisionBody = {
  action: VerificationStatus;
  note?: string;
};

// POST /api/admin/verifications/[id]/decision
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const verification = MOCK_VERIFICATIONS.find((v) => v.id === id);
  if (!verification) {
    return NextResponse.json(
      { error: "Verification not found" },
      { status: 404 },
    );
  }

  let body: DecisionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action, note } = body;
  const validActions: VerificationStatus[] = [
    "approved",
    "rejected",
    "more_info",
    "pending",
  ];
  if (!action || !validActions.includes(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${validActions.join(", ")}` },
      { status: 400 },
    );
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
