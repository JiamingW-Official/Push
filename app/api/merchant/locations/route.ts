import { NextResponse } from "next/server";
import { MOCK_LOCATIONS, type Location } from "@/lib/merchant/mock-locations";

/* ── In-memory store for demo mutations ─────────────────────────────────── */
let store: Location[] = [...MOCK_LOCATIONS];

export async function GET() {
  return NextResponse.json({ locations: store });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      merchant_id: "demo-merchant-001",
      name: body.name ?? "New Location",
      neighborhood: body.neighborhood ?? "",
      address: body.address ?? "",
      city: body.city ?? "New York",
      state: body.state ?? "NY",
      zip: body.zip ?? "",
      lat: body.lat ?? 40.7128,
      lng: body.lng ?? -74.006,
      status: "open",
      image_url: body.image_url ?? "",
      phone: body.phone ?? "",
      email: body.email ?? "",
      scans_7d: 0,
      conversions_30d: 0,
      staff_count: 0,
      primary_campaign_title: null,
      primary_campaign_status: null,
      qr_codes: [],
      staff: [],
      hours: [
        { day: "Monday", open: "09:00", close: "18:00", closed: false },
        { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
        { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
        { day: "Thursday", open: "09:00", close: "18:00", closed: false },
        { day: "Friday", open: "09:00", close: "18:00", closed: false },
        { day: "Saturday", open: "10:00", close: "17:00", closed: false },
        { day: "Sunday", open: "10:00", close: "17:00", closed: true },
      ],
      campaign_history: [],
      pos_integrations: [
        { name: "Square", connected: false },
        { name: "Toast", connected: false },
        { name: "Clover", connected: false },
      ],
      created_at: new Date().toISOString(),
    };
    store = [newLocation, ...store];
    return NextResponse.json({ location: newLocation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
