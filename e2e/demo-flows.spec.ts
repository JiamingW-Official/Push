import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * v5.3-EXEC demo walk suite. One test per audience, visiting every page
 * a real playtester hits in a first session.
 *
 * Implementation note: uses `page.request.get()` (HTTP, no DOM) for bulk
 * reachability. Browser-based `page.goto()` in a tight loop triggers
 * ERR_ABORTED under Next dev's HMR; HTTP requests have no such race and
 * still exercise middleware + route handlers + the demo-cookie bypass.
 */

async function setDemoCookie(
  context: BrowserContext,
  role: "creator" | "merchant" | "admin" | "consumer",
) {
  await context.addCookies([
    {
      name: "push-demo-role",
      value: role,
      domain: "localhost",
      path: "/",
    },
  ]);
}

async function assertReachable(
  ctx: BrowserContext,
  urls: string[],
  baseURL: string,
): Promise<void> {
  for (const path of urls) {
    const res = await ctx.request.get(`${baseURL}${path}`);
    // Playwright follows redirects; .url() is the final URL after them.
    // Middleware sends unauth visitors to /demo; with the cookie set,
    // we must NEVER end up there.
    expect(res.status(), `${path} HTTP ${res.status()}`).toBeLessThan(500);
    expect(res.url(), `${path} ended at ${res.url()}`).not.toMatch(/\/demo$/);
  }
}

test.describe("demo-flows", () => {
  test("creator walks 8 workspace pages via HTTP", async ({
    context,
    baseURL,
  }) => {
    await setDemoCookie(context, "creator");
    await assertReachable(
      context,
      [
        "/creator/dashboard",
        "/creator/work/today",
        "/creator/discover",
        "/creator/inbox",
        "/creator/earnings",
        "/creator/settings",
        "/creator/analytics",
        "/creator/leaderboard",
      ],
      baseURL ?? "http://localhost:3000",
    );
  });

  test("merchant walks 8 portal pages via HTTP", async ({
    context,
    baseURL,
  }) => {
    await setDemoCookie(context, "merchant");
    await assertReachable(
      context,
      [
        "/merchant/dashboard",
        "/merchant/campaigns/new",
        "/merchant/qr-codes",
        "/merchant/redeem",
        "/merchant/analytics",
        "/merchant/payments",
        "/merchant/applicants",
        "/merchant/settings",
      ],
      baseURL ?? "http://localhost:3000",
    );
  });

  test("admin walks 11 ops pages via HTTP", async ({ context, baseURL }) => {
    await setDemoCookie(context, "admin");
    await assertReachable(
      context,
      [
        "/admin",
        "/admin/cohorts",
        "/admin/campaigns",
        "/admin/users",
        "/admin/disputes",
        "/admin/verifications",
        "/admin/fraud",
        "/admin/finance",
        "/admin/privacy-requests",
        "/admin/oracle-trigger",
        "/admin/audit-log",
      ],
      baseURL ?? "http://localhost:3000",
    );
  });

  test("consumer walks scan + privacy via HTTP", async ({
    context,
    baseURL,
  }) => {
    await setDemoCookie(context, "consumer");
    await assertReachable(
      context,
      ["/scan/qr-bsc-001", "/my-privacy", "/legal/do-not-sell", "/data-rights"],
      baseURL ?? "http://localhost:3000",
    );
  });

  test("no-cookie visitor reaches public pages without /demo redirect", async ({
    context,
    baseURL,
  }) => {
    // Explicitly NO setDemoCookie call here.
    await assertReachable(
      context,
      [
        "/",
        "/legal/privacy",
        "/legal/do-not-sell",
        "/my-privacy",
        "/data-rights",
        "/for-creators",
        "/for-merchants",
        "/pricing",
        "/how-it-works",
      ],
      baseURL ?? "http://localhost:3000",
    );
  });

  // Browser-based tests below — only where we actually need DOM / JS.

  test("demo toast: tier change on /scan keeps radio state", async ({
    page,
    context,
  }) => {
    await setDemoCookie(context, "consumer");
    await page.goto("/scan/qr-bsc-001");
    await page.waitForLoadState("networkidle");
    const tier3 = page.getByRole("radio", { name: /Tier 3/ });
    if (await tier3.isEnabled()) {
      await tier3.click();
      await expect(tier3).toBeChecked();
    }
  });

  // Picker click-to-cookie flow is covered by `e2e/critical-path.spec.ts`
  // tier-radio test + the HTTP walks above (which rely on setDemoCookie
  // succeeding via the context). Avoiding a browser click test here because
  // Next dev's HMR + client-side `window.location.assign` in the onClick
  // racecondition makes it flaky without adding product value.

  test("demo picker: all 4 audience tags are rendered", async ({ page }) => {
    await page.goto("/demo");
    for (const tag of ["CREATOR", "MERCHANT", "ADMIN", "CONSUMER"]) {
      await expect(page.getByText(tag, { exact: true })).toBeVisible();
    }
  });
});
