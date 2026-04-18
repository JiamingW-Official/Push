import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/admin/mock-users";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = getUserById(id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Stub: in production this would issue a signed impersonation token
  // and set a secure HttpOnly cookie. Here we return metadata only.
  const response = NextResponse.json({
    success: true,
    impersonating: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    message: "Impersonation session started (stub)",
  });

  // Write the cookie as a stub (non-HttpOnly for demo visibility)
  response.cookies.set("push-impersonating", user.id, {
    path: "/",
    maxAge: 60 * 60, // 1 hour
    sameSite: "lax",
  });

  return response;
}
