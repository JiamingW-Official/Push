import { NextRequest, NextResponse } from "next/server";
import { MOCK_QR_CODES } from "@/lib/attribution/mock-qr-codes-extended";

// TODO: wire to Supabase; generate signed QR payload

// GET /api/merchant/qr-codes/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const code = MOCK_QR_CODES.find((q) => q.id === id);
  if (!code) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }
  return NextResponse.json({ data: code });
}

// PATCH /api/merchant/qr-codes/[id] — disable or regenerate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const code = MOCK_QR_CODES.find((q) => q.id === id);
  if (!code) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  let body: { disabled?: boolean; regenerate?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // TODO: update Supabase record
  // TODO: if regenerate, create new signed QR payload
  const updated = {
    ...code,
    ...(body.disabled !== undefined ? { disabled: body.disabled } : {}),
    ...(body.regenerate
      ? {
          id: `qr-${Date.now()}`,
          scan_count: 0,
          created_at: new Date().toISOString(),
        }
      : {}),
  };

  return NextResponse.json({ data: updated });
}

// DELETE /api/merchant/qr-codes/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const exists = MOCK_QR_CODES.some((q) => q.id === id);
  if (!exists) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }
  // TODO: delete from Supabase
  return NextResponse.json({ success: true });
}
