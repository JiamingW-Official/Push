import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

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

// Creator-protected route patterns
const CREATOR_PROTECTED = ["/creator/dashboard", "/creator/profile"];
const CREATOR_PROTECTED_PREFIXES = [
  "/creator/campaigns",
  "/creator/earnings",
  "/creator/equity-pool",
];

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/creator/:path*", "/merchant/:path*"],
};
