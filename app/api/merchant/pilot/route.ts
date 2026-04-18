import { NextRequest, NextResponse } from "next/server";

// Williamsburg pilot-eligible ZIPs (v5.1 beachhead)
const ELIGIBLE_ZIPS = new Set(["11211", "11206", "11249"]);

export interface PilotApplication {
  bizName: string;
  vertical: string;
  zip: string;
  ig: string;
  maps: string;
  goal: string;
  contactEmail: string;
  contactPhone?: string;
  loiAck: boolean;
}

export interface PilotResponse {
  pilotId: string;
  status: "pending_review" | "waitlist";
  zipEligible: boolean;
  message: string;
}

// POST /api/merchant/pilot — submit pilot application
export async function POST(req: NextRequest) {
  let body: Partial<PilotApplication>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Required field validation
  const required: (keyof PilotApplication)[] = [
    "bizName",
    "vertical",
    "zip",
    "ig",
    "maps",
    "goal",
    "contactEmail",
    "loiAck",
  ];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 422 },
      );
    }
  }

  if (!body.loiAck) {
    return NextResponse.json(
      { error: "LOI acknowledgement required" },
      { status: 422 },
    );
  }

  const zipEligible = ELIGIBLE_ZIPS.has((body.zip ?? "").replace(/\s/g, ""));

  // TODO: write to Supabase `pilots` table
  // const supabase = createServerClient(...)
  // const { data, error } = await supabase.from("pilots").insert({ ... })

  // TODO: send Slack notification to Prum
  // await slack.chat.postMessage({ channel: "#pilot-applications", text: `New pilot: ${body.bizName}` })

  // Placeholder: generate a deterministic mock ID
  const pilotId = `pilot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const response: PilotResponse = {
    pilotId,
    status: zipEligible ? "pending_review" : "waitlist",
    zipEligible,
    message: zipEligible
      ? "Application received. You'll hear back within 48 hours."
      : "You're on the waitlist — we'll reach out when we expand to your neighborhood.",
  };

  return NextResponse.json(response, { status: 201 });
}
