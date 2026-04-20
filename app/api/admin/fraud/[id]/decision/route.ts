import { NextRequest, NextResponse } from "next/server";
import { MOCK_FRAUD_EVENTS, type FraudStatus } from "@/lib/admin/mock-fraud";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { badRequest } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const VALID_DECISIONS: FraudStatus[] = [
  "approved",
  "flagged",
  "blocked",
  "escalated",
];

// POST /api/admin/fraud/[id]/decision
// Body: { decision: FraudStatus, note?: string, bulk?: string[] }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;

  let body: { decision?: string; note?: string; bulk?: string[] };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { decision, note, bulk } = body;

  if (!decision || !VALID_DECISIONS.includes(decision as FraudStatus)) {
    // TODO(codemod): migrate to badRequest/etc. — message contains a template literal
    return NextResponse.json(
      {
        error: `Invalid decision. Must be one of: ${VALID_DECISIONS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // Handle bulk decisions — ids come from body.bulk, route id is "bulk"
  if (id === "bulk" && Array.isArray(bulk) && bulk.length > 0) {
    const updated: string[] = [];
    const missing: string[] = [];

    for (const targetId of bulk) {
      const event = MOCK_FRAUD_EVENTS.find((e) => e.id === targetId);
      if (!event) {
        missing.push(targetId);
        continue;
      }
      event.status = decision as FraudStatus;
      if (note) event.notes = note;
      updated.push(targetId);
    }

    return NextResponse.json({
      success: true,
      updated,
      missing,
      decision,
    });
  }

  // Single event decision
  const event = MOCK_FRAUD_EVENTS.find((e) => e.id === id);
  if (!event) {
    // TODO(codemod): migrate to badRequest/etc. — message contains a template literal
    return NextResponse.json(
      { error: `Event '${id}' not found` },
      { status: 404 },
    );
  }

  event.status = decision as FraudStatus;
  if (note) event.notes = note;

  return NextResponse.json({
    success: true,
    id,
    decision,
    event,
  });
}
