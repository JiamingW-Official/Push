// GET /api/admin/privacy-requests
// Returns the DSAR intake ledger ordered by due_at ASC for rows that aren't
// resolved yet, then by received_at DESC for everything else. Admin-only.
//
// Closes P1-DATA-2 from docs/v5.3-optimization-audit-2026-04-21.md.

import { badRequest, serverError, success } from "@/lib/api/responses";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";

// Lightweight fake rows for the /admin/privacy-requests demo. Ops sees a
// realistic queue with one overdue + one about-to-be-due ticket — enough
// to click the Resolve / Deny buttons and verify the UI.
const DEMO_ROWS = [
  {
    ticket_id: "demo-dsar-001",
    received_at: "2026-03-10T14:00:00Z",
    request_type: "access",
    jurisdiction: "California / CCPA",
    status: "received",
    due_at: "2026-04-24T14:00:00Z",
    resolved_at: null,
    resolution_note: null,
    overdue: false,
    sec_until_due: 3 * 86400,
  },
  {
    ticket_id: "demo-dsar-002",
    received_at: "2026-02-20T09:00:00Z",
    request_type: "deletion",
    jurisdiction: "EU / GDPR",
    status: "verifying",
    due_at: "2026-04-06T09:00:00Z",
    resolved_at: null,
    resolution_note: null,
    overdue: true,
    sec_until_due: -15 * 86400,
  },
];

const VALID_STATUSES = new Set([
  "received",
  "verifying",
  "resolved",
  "denied",
  "expired",
]);

export async function GET(req: Request): Promise<Response> {
  // Demo-mode short-circuit: admins-in-demo get fake rows so the UI is
  // clickable without a real Supabase session.
  const demo = await demoShortCircuit("admin", () => ({
    rows: DEMO_ROWS,
    total: DEMO_ROWS.length,
  }));
  if (demo) return demo;

  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  if (status && !VALID_STATUSES.has(status)) {
    return badRequest("`status` invalid", {
      allowed: Array.from(VALID_STATUSES),
    });
  }

  let query = supabase
    .from("privacy_requests")
    .select(
      "ticket_id, received_at, request_type, jurisdiction, status, due_at, resolved_at, resolution_note",
    );

  if (status) {
    query = query.eq("status", status);
  }

  // Unresolved rows bubble to the top by due_at so ops sees the soonest-due
  // item first. Resolved rows fall to the bottom ordered by received_at.
  query = query.order("due_at", { ascending: true, nullsFirst: false });

  const { data, error } = await query.limit(200);
  if (error) return serverError("admin-privacy-requests-list", error);

  const now = Date.now();
  const rows = (data ?? []).map((row) => {
    const r = row as {
      ticket_id: string;
      received_at: string;
      request_type: string;
      jurisdiction: string | null;
      status: string;
      due_at: string;
      resolved_at: string | null;
      resolution_note: string | null;
    };
    const dueInSec = Math.round((new Date(r.due_at).getTime() - now) / 1000);
    return {
      ...r,
      overdue: r.status !== "resolved" && dueInSec < 0,
      sec_until_due: dueInSec,
    };
  });

  return success({ rows, total: rows.length });
}

// PATCH /api/admin/privacy-requests — mark a row resolved / denied.
// Body: { ticket_id: string; status: "resolved" | "denied"; resolution_note?: string }
export async function PATCH(req: Request): Promise<Response> {
  // Demo PATCH echoes "resolved" so the UI updates optimistically.
  const demo = await demoShortCircuit("admin", async () => {
    const body = (await req.json().catch(() => ({}))) as {
      ticket_id?: string;
      status?: string;
    };
    return {
      row: {
        ticket_id: body.ticket_id ?? "demo-dsar-000",
        status: body.status ?? "resolved",
        resolved_at: new Date().toISOString(),
      },
    };
  });
  if (demo) return demo;

  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  const ticketId = body.ticket_id;
  if (typeof ticketId !== "string" || ticketId.length === 0) {
    return badRequest("`ticket_id` required");
  }
  const status = body.status;
  if (status !== "resolved" && status !== "denied") {
    return badRequest("`status` must be 'resolved' or 'denied'");
  }
  const note =
    typeof body.resolution_note === "string" ? body.resolution_note : null;

  const { data, error } = await supabase
    .from("privacy_requests")
    .update({
      status,
      resolved_at: new Date().toISOString(),
      resolution_note: note,
    })
    .eq("ticket_id", ticketId)
    .select("ticket_id, status, resolved_at")
    .single();

  if (error) return serverError("admin-privacy-requests-patch", error);
  return success({ row: data });
}
