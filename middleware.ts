import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Edge proxy — combines two orthogonal gates:
 *
 * 1. `/api/internal/*` is guarded by a shared secret header
 *    (`x-internal-secret`) compared in constant time. These routes use
 *    the service-role Supabase client (RLS-bypassing), so without the
 *    gate anyone on the public internet could mutate funnel state or
 *    burn AI spend. Missing/mismatched secret → 404 (not 401) to avoid
 *    confirming the route exists.
 *
 * 2. `/creator/*` and `/merchant/*` protected paths require Supabase
 *    auth. Unauthenticated users redirect to the matching login page
 *    with `?redirectedFrom=`. A non-production `push-demo-role` cookie
 *    bypasses auth for investor demos only.
 *
 * Next.js 16 consolidated `middleware.ts` and `proxy.ts` — this file is
 * the single edge entry for both concerns.
 */

const CREATOR_PROTECTED = [
  "/creator/dashboard",
  "/creator/profile",
  "/creator/onboarding",
];
const CREATOR_PROTECTED_PREFIXES = ["/creator/campaigns"];

const MERCHANT_PROTECTED = ["/merchant/dashboard"];
const MERCHANT_PROTECTED_PREFIXES = ["/merchant/campaigns"];

function getDemoRole(request: NextRequest): "creator" | "merchant" | null {
  const cookie = request.cookies.get("push-demo-role")?.value;
  if (cookie === "creator" || cookie === "merchant") return cookie;
  return null;
}

function isCreatorProtected(pathname: string): boolean {
  if (CREATOR_PROTECTED.includes(pathname)) return true;
  return CREATOR_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isMerchantProtected(pathname: string): boolean {
  if (MERCHANT_PROTECTED.includes(pathname)) return true;
  return MERCHANT_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isInternalApi(pathname: string): boolean {
  return pathname === "/api/internal" || pathname.startsWith("/api/internal/");
}

/**
 * Constant-time compare relative to the longer input. Edge runtime has
 * no `crypto.timingSafeEqual`, so implement manually to defeat timing
 * oracles on both value and length.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = new TextEncoder().encode(a);
  const bBuf = new TextEncoder().encode(b);
  const len = Math.max(aBuf.length, bBuf.length);
  let mismatch = aBuf.length ^ bBuf.length;
  for (let i = 0; i < len; i++) {
    const aByte = i < aBuf.length ? aBuf[i] : 0;
    const bByte = i < bBuf.length ? bBuf[i] : 0;
    mismatch |= aByte ^ bByte;
  }
  return mismatch === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Internal API secret gate ──────────────────────────────────
  if (isInternalApi(pathname)) {
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret) {
      return new NextResponse(null, { status: 404 });
    }
    const supplied = request.headers.get("x-internal-secret") ?? "";
    if (!constantTimeEqual(supplied, secret)) {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  // ── Demo mode bypass (non-production only) ────────────────────
  // S-01 fix: restricted to non-production to prevent auth bypass in prod.
  // Investors/stakeholders use a real seed account in production.
  if (process.env.NODE_ENV !== "production") {
    const demoRole = getDemoRole(request);
    if (demoRole === "creator" && isCreatorProtected(pathname)) {
      return NextResponse.next({ request: { headers: request.headers } });
    }
    if (demoRole === "merchant" && isMerchantProtected(pathname)) {
      return NextResponse.next({ request: { headers: request.headers } });
    }
  }

  // ── Real auth check ───────────────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // S-02 fix: getUser() validates with Auth server; getSession() only reads cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Creator protected routes ──────────────────────────────────
  // S-04 fix: redirect to /creator/login (not signup) for existing creators
  if (isCreatorProtected(pathname) && !user) {
    const loginUrl = new URL("/creator/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Merchant protected routes ─────────────────────────────────
  if (isMerchantProtected(pathname) && !user) {
    const loginUrl = new URL("/merchant/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Internal API (secret-gated)
    "/api/internal",
    "/api/internal/:path*",
    // Creator auth-gated
    "/creator/dashboard",
    "/creator/profile",
    "/creator/onboarding",
    "/creator/campaigns/:path*",
    // Merchant auth-gated
    "/merchant/dashboard",
    "/merchant/campaigns/:path*",
  ],
};
