import { NextRequest, NextResponse } from "next/server";
import { getUserById, mockUsers } from "@/lib/admin/mock-users";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { notFound } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const user = getUserById(id);
  if (!user) return notFound("User not found");
  return NextResponse.json({ user });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx === -1) return notFound("User not found");

  const body = await req.json();
  // Merge allowed fields
  const allowed = ["status", "kyc_status", "tier", "notes"];
  const updated = { ...mockUsers[idx] };
  for (const key of allowed) {
    if (key in body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updated as any)[key] = body[key];
    }
  }
  mockUsers[idx] = updated;
  return NextResponse.json({ user: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx === -1) return notFound("User not found");

  // Stub: mark as banned
  mockUsers[idx] = { ...mockUsers[idx], status: "banned" };
  return NextResponse.json({
    success: true,
    message: "User deleted (stubbed as banned)",
  });
}
