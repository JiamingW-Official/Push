// POST /api/consent-event — browser-facing proxy that stamps the internal
// secret server-side and forwards to /api/internal/consent-event. The browser
// never sees INTERNAL_API_SECRET; this route runs on the edge next to the
// user and completes in < 20 ms.
//
// Required body: same as /api/internal/consent-event. This proxy adds
// `ip_address` + `user_agent` from the incoming request so the inner writer
// can hash them.

import { getIP } from "@/lib/rate-limit";
import { checkRateLimit } from "@/lib/observability/rate-limit";

export async function POST(req: Request): Promise<Response> {
  const ip = getIP(req);

  // Consent events should not be spammable. One checkbox change = one event.
  // 20/min covers even the fidgetiest user.
  const ok = await checkRateLimit(`consent-event:${ip}`, {
    limit: 20,
    windowSec: 60,
  });
  if (!ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    // Dev / preview without the secret configured — accept the event as a
    // no-op so the consumer flow doesn't break. Production startup would
    // have already thrown from middleware.ts if the var were missing.
    return new Response(JSON.stringify({ ok: true, dry_run: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const ua = req.headers.get("user-agent") ?? "";
  const enriched = { ...body, ip_address: ip, user_agent: ua };

  // Same-origin fetch; the middleware /api/internal/* gate validates the
  // secret header.
  const url = new URL("/api/internal/consent-event", req.url);
  const inner = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-api-secret": secret,
    },
    body: JSON.stringify(enriched),
  });

  // Pass status through so the client can see 400s for validation errors.
  const text = await inner.text();
  return new Response(text, {
    status: inner.status,
    headers: { "content-type": "application/json" },
  });
}
