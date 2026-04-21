// Push demo short-circuit — cooperatively shim auth-gated API routes so a
// demo cookie user gets mock data instead of 401.
//
// Problem: pages inside /creator, /merchant, /admin call auth-gated API
// routes. The middleware demo cookie bypasses PAGE rendering but the API
// still enforces its own `requireXxxSession()`, so dashboards end up with
// "no data" when a demo visitor navigates them.
//
// Pattern (at the very top of any gated route handler):
//
//   export async function GET(req: Request) {
//     const demo = await demoShortCircuit("admin", () => ({
//       rows: [...],
//       total: 0,
//     }));
//     if (demo) return demo;
//     const gate = await requireAdminSession();
//     ...
//   }
//
// Every short-circuit responds with the standard `success` envelope so
// clients don't need a demo-specific parse path.

import { cookies } from "next/headers";
import { success } from "./responses";

export type DemoAudience = "creator" | "merchant" | "admin" | "consumer";

/**
 * Reads the demo cookie on the server. Returns null when absent / invalid.
 */
export async function getDemoAudience(): Promise<DemoAudience | null> {
  try {
    const c = await cookies();
    const v = c.get("push-demo-role")?.value;
    if (
      v === "creator" ||
      v === "merchant" ||
      v === "admin" ||
      v === "consumer"
    ) {
      return v;
    }
    return null;
  } catch {
    // cookies() can throw outside a request scope — treat as "no demo"
    return null;
  }
}

/**
 * If the caller is in demo mode AND their audience matches `expected`,
 * immediately return a mock success envelope and short-circuit the route.
 *
 * @param expected  which audience should be served a mock.
 * @param mock      lazy-evaluated mock payload (called only on hit).
 * @returns         Response when short-circuiting, or null to continue
 *                  the real handler.
 */
export async function demoShortCircuit<T>(
  expected: DemoAudience,
  mock: () => T | Promise<T>,
): Promise<Response | null> {
  const audience = await getDemoAudience();
  if (audience !== expected) return null;
  const payload = await mock();
  return success(payload);
}
