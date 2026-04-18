import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MOCK_TEAM = [
  {
    id: "tm_1",
    name: "Jordan Kim",
    email: "jordan@procellcoffee.com",
    role: "owner",
    lastActive: "2026-04-17T10:22:00Z",
  },
  {
    id: "tm_2",
    name: "Priya Mehta",
    email: "priya@procellcoffee.com",
    role: "admin",
    lastActive: "2026-04-16T15:45:00Z",
  },
  {
    id: "tm_3",
    name: "Marcus Osei",
    email: "marcus@procellcoffee.com",
    role: "viewer",
    lastActive: "2026-04-10T09:00:00Z",
  },
];

export async function GET(_req: NextRequest) {
  return NextResponse.json({ members: MOCK_TEAM });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newMember = {
    id: `tm_${Date.now()}`,
    name: body.email.split("@")[0],
    email: body.email,
    role: body.role ?? "viewer",
    lastActive: null,
  };
  return NextResponse.json({ ok: true, member: newMember }, { status: 201 });
}
