import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/admin/mock-users";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { notFound } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const user = getUserById(id);
  if (!user) return notFound("User not found");

  // In production this would issue a signed impersonation token; here we
  // return metadata only. The cookie is hardened per Batch E audit:
  // httpOnly (no JS access), secure (https-only), sameSite:strict (no
  // cross-site POST ride-along).
  const response = NextResponse.json({
    success: true,
    impersonating: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    message: "Impersonation session started (stub)",
  });

  response.cookies.set("push-impersonating", user.id, {
    path: "/",
    maxAge: 60 * 60, // 1 hour
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return response;
}
