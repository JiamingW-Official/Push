import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware — guards every `/api/internal/*` route with a shared
 * secret header. The post-audit baseline is that `/api/internal/*` uses
 * the service-role Supabase client (RLS-bypassing), so without this gate
 * anyone on the public internet could POST `action: "churn"` to mutate
 * creator funnel state, flood `/api/internal/ai-verify` to burn AI spend,
 * or scrape internal data.
 *
 * The secret is compared in constant time to defeat timing oracles.
 * Unauthenticated requests receive `404` (not `401`) to avoid confirming
 * that the route exists.
 *
 * Configuration:
 *   - Set `INTERNAL_API_SECRET` on the server (Vercel env var, NOT
 *     `NEXT_PUBLIC_*`). The production deploy MUST have this set; a
 *     build-time guard in `lib/db` already catches missing service-role
 *     keys, but this middleware fails closed on its own.
 *   - Callers (server-side cron jobs, internal tools) send the value as
 *     the `x-internal-secret` request header.
 */
export function middleware(request: NextRequest): NextResponse {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    // Fail closed: if the env var isn't set, the route is effectively
    // disabled. In dev this means you have to set a local value to hit
    // `/api/internal/*`.
    return new NextResponse(null, { status: 404 });
  }

  const supplied = request.headers.get("x-internal-secret") ?? "";
  if (!constantTimeEqual(supplied, secret)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

/**
 * Compare two strings in constant time relative to the LONGER of the
 * inputs. If the lengths differ, we still walk the whole longer string
 * so a length mismatch doesn't leak via response timing. Edge runtime
 * doesn't expose `crypto.timingSafeEqual`, so we implement it manually.
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

/**
 * Matcher — only run this middleware for internal API routes. Everything
 * else (public pages, authenticated merchant/creator APIs, static assets)
 * skips the edge entirely.
 */
export const config = {
  // Include both the bare `/api/internal` path (in case a root handler is
  // ever added) and every nested path. Next's matcher treats `:path*` as
  // "at least one segment" on some versions, so list the root explicitly.
  matcher: ["/api/internal", "/api/internal/:path*"],
};
