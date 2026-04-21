import { NextRequest, NextResponse } from "next/server";

// TODO: wire to email (Resend/Postmark) + Slack notification

export interface ContactPayload {
  name: string;
  email: string;
  role: "merchant" | "creator" | "press" | "investor" | "other";
  message: string;
  followUp?: "email" | "phone";
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, role, message } = body;

  if (!name?.trim() || !email?.trim() || !role || !message?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 422 },
    );
  }

  // Email format check
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 422 },
    );
  }

  // TODO: Resend / Postmark — send to team@push.nyc
  // await resend.emails.send({ from: "...", to: "team@push.nyc", ... });

  // TODO: Slack notification
  // await fetch(process.env.SLACK_WEBHOOK_URL, { method: "POST", body: JSON.stringify({ text: `...` }) });

  console.log("[contact] submission", {
    name,
    email,
    role,
    followUp: body.followUp,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
