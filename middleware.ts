import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Routes that require creator auth
const CREATOR_PROTECTED = ["/creator/dashboard", "/creator/profile"];
const CREATOR_PROTECTED_PREFIXES = ["/creator/campaigns"];

// Routes that require merchant auth
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Demo mode bypass ──────────────────────────────────────────
  // If demo cookie is present, skip auth check for matching protected routes.
  // This lets investors/stakeholders preview the app without an account.
  const demoRole = getDemoRole(request);
  if (demoRole === "creator" && isCreatorProtected(pathname)) {
    return NextResponse.next({ request: { headers: request.headers } });
  }
  if (demoRole === "merchant" && isMerchantProtected(pathname)) {
    return NextResponse.next({ request: { headers: request.headers } });
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ── Creator protected routes ──────────────────────────────────
  if (isCreatorProtected(pathname) && !session) {
    const loginUrl = new URL("/creator/signup", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Merchant protected routes ─────────────────────────────────
  if (isMerchantProtected(pathname) && !session) {
    const loginUrl = new URL("/merchant/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/creator/dashboard",
    "/creator/profile",
    "/creator/campaigns/:path*",
    "/merchant/dashboard",
    "/merchant/campaigns/:path*",
    "/creator/dashboard",
  ],
};
