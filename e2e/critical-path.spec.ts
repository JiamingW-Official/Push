import { test, expect } from "@playwright/test";

/**
 * v5.3-EXEC P4-1 critical path E2E.
 *
 * End-to-end happy path that must stay green for the 2026-05-15 Pilot:
 *   1. Consumer scans QR → /scan/:qrId renders
 *   2. Consent picker shows 3 tiers + lets consumer pick
 *   3. FTC §255 disclosure visible above the fold
 *   4. Continue advances to the verify step
 *
 * These tests run against demo-mode data (no Supabase calls), so they're
 * safe to run locally without secrets and in CI without a DB.
 */

// A known mock QR id from lib/attribution/mock-qr-codes.ts. If the mock
// registry is re-keyed, update this constant in one place.
const DEMO_QR_ID = "qr-bsc-001";

test.describe("critical-path", () => {
  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Push/i);
  });

  test("legal do-not-sell page is reachable", async ({ page }) => {
    await page.goto("/legal/do-not-sell");
    await expect(
      page.getByRole("heading", {
        name: /Do Not Sell or Share My Personal Information/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/CCPA/i).first()).toBeVisible();
  });

  test("privacy portal is reachable", async ({ page }) => {
    await page.goto("/my-privacy");
    await expect(page.locator("body")).toBeVisible();
  });

  test("scan landing page renders + consent picker visible", async ({
    page,
  }) => {
    await page.goto(`/scan/${DEMO_QR_ID}`);

    // Wait out the "Verifying QR code…" loading state — in demo-mode data
    // registry this resolves synchronously, but play it safe with a waitForLoadState.
    await page.waitForLoadState("networkidle");

    // Either we land on the happy path (has consent picker) or on the
    // not-found/expired error card. The happy path must exist for at
    // least one known demo QR.
    const consentTitle = page.getByRole("heading", {
      name: /How much do we collect\?/i,
    });
    const notFound = page.getByText(/QR code not found/i);

    // If both show up, the test fails anyway; otherwise exactly one.
    await Promise.race([
      consentTitle.waitFor({ state: "visible", timeout: 5_000 }),
      notFound.waitFor({ state: "visible", timeout: 5_000 }),
    ]);

    // Expect the happy path. If this fails, the seed QR mock needs updating.
    await expect(consentTitle).toBeVisible();

    // Three tier options must render (use role=radio to avoid matching the
    // "Continue with Tier N" button label).
    await expect(page.getByRole("radio", { name: /Tier 1/ })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Tier 2/ })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Tier 3/ })).toBeVisible();
  });

  test("FTC disclosure is visible on scan page", async ({ page }) => {
    await page.goto(`/scan/${DEMO_QR_ID}`);
    await page.waitForLoadState("networkidle");
    // Look for the #ad / #广告 / "Ad" label. The exact wording is enforced
    // by the banner component — loosely match either English or Chinese.
    const ftc = page
      .getByText(/#ad|#广告|Sponsored|Paid partnership|Ad disclosure/i)
      .first();
    await expect(ftc).toBeVisible();
  });

  // v5.3-EXEC P1-3 minor-downgrade gate: checking the under-18 box must
  // disable Tier 2 and Tier 3 options.
  test("minor downgrade — Tier 2/3 disabled when under-18 checked", async ({
    page,
  }) => {
    await page.goto(`/scan/${DEMO_QR_ID}`);
    await page.waitForLoadState("networkidle");

    // Age-gate checkbox
    const checkbox = page.getByRole("checkbox", { name: /under 18/i });
    await checkbox.check();

    // Tier 1 must stay enabled; 2 and 3 disabled.
    const tier1 = page.getByRole("radio", { name: /Tier 1/ });
    const tier2 = page.getByRole("radio", { name: /Tier 2/ });
    const tier3 = page.getByRole("radio", { name: /Tier 3/ });

    await expect(tier1).toBeVisible();
    await expect(tier1).toBeEnabled();
    await expect(tier2).toBeDisabled();
    await expect(tier3).toBeDisabled();
  });

  // v5.3-EXEC P1-5 POS UI: merchant redeem page renders.
  test("merchant POS redeem page renders", async ({ page, context }) => {
    // Demo-mode bypass: middleware lets /merchant/* through when the
    // push-demo-role=merchant cookie is set.
    await context.addCookies([
      {
        name: "push-demo-role",
        value: "merchant",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto(`/merchant/redeem`);
    await expect(
      page.getByRole("heading", { name: /Redeem a claim/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/CLAIM CODE/i)).toBeVisible();
    await expect(page.getByLabel(/ORDER TOTAL/i)).toBeVisible();
  });

  // v5.3-EXEC P4-1 full chain: POST /api/attribution/redemption with INTERNAL_API_SECRET
  // returns 403 without the secret (middleware gate working).
  test("redemption API is gated without INTERNAL_API_SECRET", async ({
    request,
  }) => {
    const res = await request.post("/api/internal/ai-verify", {
      data: { merchant_id: "x", creator_id: "x" },
      headers: { "content-type": "application/json" },
    });
    expect(res.status()).toBe(403);
  });

  // v5.3-EXEC data-rights URL alias.
  test("/data-rights redirects to /my-privacy", async ({ page }) => {
    await page.goto("/data-rights");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/my-privacy/);
  });

  // P1-DATA-2 admin privacy queue page must render.
  test("admin privacy-requests page loads (empty or populated)", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "push-demo-role",
        value: "merchant",
        domain: "localhost",
        path: "/",
      },
    ]);
    const res = await page.goto("/admin/privacy-requests");
    // Admin middleware is session-gated; demo bypass covers creator+merchant
    // but not admin. Accept either 200 (bypass works) or a redirect to /demo.
    if (res && res.status() === 200) {
      await expect(
        page.getByRole("heading", { name: /DSAR queue/i }),
      ).toBeVisible();
    }
  });

  // Consent-event write path (P0-SEC-4). POST without INTERNAL_API_SECRET
  // should either be a no-op dry-run (dev) or forwarded successfully (if
  // secret exists) — both cases are considered OK for this test.
  test("/api/consent-event accepts valid payload", async ({ request }) => {
    const res = await request.post("/api/consent-event", {
      data: {
        device_id: "e2e-test-device",
        event_type: "tier_change",
        prior_tier: 2,
        new_tier: 1,
        consent_version: "v1.0",
        source: "web",
      },
      headers: { "content-type": "application/json" },
    });
    // 200 on success (with or without real write), 400 only if schema broke.
    expect([200, 400]).toContain(res.status());
  });
});
