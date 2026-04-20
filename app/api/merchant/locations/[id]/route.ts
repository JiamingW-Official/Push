import { NextResponse } from "next/server";
import { MOCK_LOCATIONS, type Location } from "@/lib/merchant/mock-locations";
import { notFound, badRequest } from "@/lib/api/responses";

// Mutating in-memory store (PATCH/DELETE); opt out of Next's route-level
// cache so callers always see the current snapshot.
export const dynamic = "force-dynamic";

/* ── In-memory store (shared with parent route in a real DB, stubs here) ── */
let store: Location[] = [...MOCK_LOCATIONS];

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const location = store.find((l) => l.id === id);
  if (!location) {
    return notFound("Location not found");
  }
  return NextResponse.json({ location });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const idx = store.findIndex((l) => l.id === id);
  if (idx === -1) {
    return notFound("Location not found");
  }
  try {
    const body = await request.json();
    store[idx] = { ...store[idx], ...body };
    return NextResponse.json({ location: store[idx] });
  } catch {
    return badRequest("Invalid request body");
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const idx = store.findIndex((l) => l.id === id);
  if (idx === -1) {
    return notFound("Location not found");
  }
  store = store.filter((l) => l.id !== id);
  return NextResponse.json({ success: true });
}
