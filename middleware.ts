import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Production must fail closed: missing INTERNAL_API_SECRET would either
// un-gate internal endpoints or let the gate silently always-deny with a
// blank expected value. Either failure is worse than the deploy failing.
if (process.env.NODE_ENV === "production" && !process.env.INTERNAL_API_SECRET) {
  throw new Error(
    "middleware: INTERNAL_API_SECRET is not set in production — " +
      "internal API endpoints would be un-gated. " +
      "Set the env var in Vercel and redeploy.",
  );
}

// Static/public prefixes that always pass through
const PUBLIC_PREFIXES = [
  "/_next",
  "/favicon",
  "/fonts",
  "/images",
  "/api",
  "/demo",
  "/scan",
  "/explore",
];

// Constant-time string compare for secret validation. Edge runtime has
// Web Crypto but no `node:crypto.timingSafeEqual` — roll our own.
function timingSafeEqStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

// Creator-protected route patterns
const CREATOR_PROTECTED = ["/creator/dashboard", "/creator/profile"];
const CREATOR_PROTECTED_PREFIXES = ["/creator/campaigns", "/creator/earnings"];

// Merchant-protected route patterns
const MERCHANT_PROTECTED = ["/merchant/dashboard"];
const MERCHANT_PROTECTED_PREFIXES = [
  "/merchant/campaigns",
  "/merchant/payments",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function getDemoRole(request: NextRequest): "creator" | "merchant" | null {
  const value = request.cookies.get("push-demo-role")?.value;
  if (value === "creator" || value === "merchant") return value;
  return null;
}

function isCreatorProtected(pathname: string): boolean {
  return (
    CREATOR_PROTECTED.includes(pathname) ||
    CREATOR_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

function isMerchantProtected(pathname: string): boolean {
  return (
    MERCHANT_PROTECTED.includes(pathname) ||
    MERCHANT_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

// v5.3-EXEC P0-3: request-id correlation. Every non-static response carries
// an `x-request-id` header — incoming ID is trusted if it looks safe, else
// we mint a UUID. The ID then shows up in serverError logs and Sentry events
// so a user-reported 500 can be traced to exactly one server log line.
const REQUEST_ID_HEADER = "x-request-id";
function resolveRequestId(req: NextRequest): string {
  const incoming = req.headers.get(REQUEST_ID_HEADER);
  if (incoming && /^[A-Za-z0-9-]{8,64}$/.test(incoming)) return incoming;
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Mint / carry-forward request-id and stamp it onto the inbound headers
  // so route handlers can read it via `req.headers.get("x-request-id")`.
  const requestId = resolveRequestId(request);
  request.headers.set(REQUEST_ID_HEADER, requestId);

  // ── Internal API gate ────────────────────────────────────────────────────
  // /api/internal/*     — service-to-service, shared-secret required
  // /api/attribution/*  — same gate; the redemption route writes directly to
  //                       push_transactions and must never be publicly callable.
  // Routes under these prefixes MUST NOT re-gate (see CLAUDE.md).
  if (
    pathname.startsWith("/api/internal/") ||
    pathname.startsWith("/api/attribution/")
  ) {
    const expected = process.env.INTERNAL_API_SECRET;
    const provided = request.headers.get("x-internal-api-secret");

    if (!expected || !provided || !timingSafeEqStr(provided, expected)) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Pass static/public routes immediately
  if (isPublic(pathname)) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  const needsCreator = isCreatorProtected(pathname);
  const needsMerchant = isMerchantProtected(pathname);

  // Neither protected — pass through
  if (!needsCreator && !needsMerchant) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Demo cookie bypass: matching role skips real auth
  const demoRole = getDemoRole(request);
  if (demoRole === "creator" && needsCreator) {
    return NextResponse.next({ request: { headers: request.headers } });
  }
  if (demoRole === "merchant" && needsMerchant) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Real auth check via Supabase
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase is not configured (mock/dev mode), redirect to demo
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(new URL("/demo", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (needsCreator && !session) {
    // No real session and no demo cookie → send to demo role picker
    return NextResponse.redirect(new URL("/demo", request.url));
  }

  if (needsMerchant && !session) {
    return NextResponse.redirect(new URL("/demo", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/creator/:path*",
    "/merchant/:path*",
    "/api/internal/:path*",
    "/api/attribution/:path*",
  ],
};
