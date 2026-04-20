import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MOCK_KEYS = [
  {
    id: "key_live_01",
    name: "Production",
    prefix: "pk_live_****",
    scopes: ["campaigns:read", "analytics:read"],
    createdAt: "2026-03-01T00:00:00Z",
    lastUsed: "2026-04-16T22:10:00Z",
  },
  {
    id: "key_live_02",
    name: "Webhook Integration",
    prefix: "pk_live_****",
    scopes: ["webhooks:write", "campaigns:read"],
    createdAt: "2026-04-02T00:00:00Z",
    lastUsed: null,
  },
];

export async function GET(_req: NextRequest) {
  return NextResponse.json({ keys: MOCK_KEYS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawKey = `pk_live_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`;
  const newKey = {
    id: `key_live_${Date.now()}`,
    name: body.name ?? "New Key",
    prefix: `${rawKey.slice(0, 12)}****`,
    fullKey: rawKey, // only returned once at creation
    scopes: body.scopes ?? ["campaigns:read"],
    createdAt: new Date().toISOString(),
    lastUsed: null,
  };
  return NextResponse.json({ ok: true, key: newKey }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  return NextResponse.json({ ok: true, deleted: id });
}
