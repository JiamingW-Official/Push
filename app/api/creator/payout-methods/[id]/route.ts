import { NextRequest, NextResponse } from "next/server";

// TODO: wire to Stripe Connect + Supabase

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // TODO: auth check + verify ownership
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // TODO: update in supabase, handle setDefault logic (unset others)
  return NextResponse.json({ id, updated: body });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // TODO: auth check + verify ownership + prevent deleting default method
  // TODO: delete from supabase + revoke Stripe Connect if applicable
  return NextResponse.json({ id, deleted: true });
}
