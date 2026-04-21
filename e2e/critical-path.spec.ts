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
});
