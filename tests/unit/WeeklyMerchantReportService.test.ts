/**
 * @jest-environment node
 *
 * Unit tests for WeeklyMerchantReportService.
 *
 * Mocks `@/lib/db` so no real Supabase / Postgres call is made. The Supabase
 * client is mocked as a chainable thenable; per-table data is swapped via
 * the module-level `mockClaimsData` / `mockCardsData` arrays so tests can
 * declaratively set the inputs the service will see.
 */

// Module-level mutable data so tests can mutate before each call.
const mockClaimsData: Array<{ id: string }> = [];
const mockCardsData: Array<{ creator_id: string }> = [];

jest.mock("@/lib/db", () => {
  function makeChain(getData: () => unknown[]) {
    const chain: {
      select: jest.Mock;
      eq: jest.Mock;
      gte: jest.Mock;
      lt: jest.Mock;
      then: (
        cb: (v: { data: unknown[]; error: null }) => unknown,
      ) => Promise<unknown>;
    } = {
      select: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      gte: jest.fn(() => chain),
      lt: jest.fn(() => chain),
      then: (cb) => Promise.resolve({ data: getData(), error: null }).then(cb),
    };
    return chain;
  }

  return {
    supabase: {
      from: jest.fn((table: string) => {
        if (table === "verified_customer_claims") {
          return makeChain(() => mockClaimsData);
        }
        if (table === "loyalty_cards") {
          return makeChain(() => mockCardsData);
        }
        return makeChain(() => []);
      }),
    },
    db: {
      insert: jest
        .fn()
        .mockImplementation(
          async (_t: string, payload: Record<string, unknown>) => ({
            id: "fake-id",
            ...payload,
          }),
        ),
      select: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(undefined),
    },
  };
});

import { WeeklyMerchantReportService } from "@/lib/services/WeeklyMerchantReportService";
import { db } from "@/lib/db";

describe("WeeklyMerchantReportService", () => {
  let service: WeeklyMerchantReportService;

  beforeEach(() => {
    service = new WeeklyMerchantReportService();
    mockClaimsData.length = 0;
    mockCardsData.length = 0;
    jest.clearAllMocks();
  });

  describe("generateWeeklyReport()", () => {
    it("should return an object with all required MerchantWeeklyReport fields", async () => {
      const report = await service.generateWeeklyReport(
        "merchant-uuid-1",
        new Date("2026-04-13T00:00:00Z"),
      );

      expect(report).toHaveProperty("merchant_id", "merchant-uuid-1");
      expect(report).toHaveProperty("week_start", "2026-04-13");
      expect(report).toHaveProperty("verified_customers");
      expect(report).toHaveProperty("total_revenue");
      expect(report).toHaveProperty("roi");
      expect(report).toHaveProperty("top_creators");
      expect(Array.isArray(report.top_creators)).toBe(true);
    });

    it("should compute the correct [week_start, week_end) range when persisting", async () => {
      await service.generateWeeklyReport(
        "m1",
        new Date("2026-04-13T00:00:00Z"),
      );

      // The persisted row should record week_start..week_end exactly 7 days apart.
      expect(db.insert).toHaveBeenCalledWith(
        "merchant_metrics_weekly",
        expect.objectContaining({
          merchant_id: "m1",
          week_start: "2026-04-13",
          week_end: "2026-04-20",
        }),
      );
    });

    it("should compute revenue as verified_customers × $12.50 (mock avg price)", async () => {
      // 4 approved claims → revenue = 4 * 12.50 = 50
      mockClaimsData.push(
        { id: "c1" },
        { id: "c2" },
        { id: "c3" },
        { id: "c4" },
      );

      const report = await service.generateWeeklyReport(
        "m1",
        new Date("2026-04-13T00:00:00Z"),
      );

      expect(report.verified_customers).toBe(4);
      expect(report.total_revenue).toBe(50);
    });

    it("should compute ROI as (revenue − $150) / $150 × 100", async () => {
      // 24 claims × $12.50 = $300 revenue → ROI = (300 - 150) / 150 * 100 = 100
      for (let i = 0; i < 24; i++) mockClaimsData.push({ id: `c${i}` });

      const report = await service.generateWeeklyReport(
        "m1",
        new Date("2026-04-13T00:00:00Z"),
      );

      expect(report.total_revenue).toBe(300);
      expect(report.roi).toBe(100);
    });

    it("should return top 5 creators sorted by contribution_count, with correct percentages", async () => {
      // 4 verified customers (denominator for contribution_pct)
      for (let i = 0; i < 4; i++) mockClaimsData.push({ id: `c${i}` });

      // 6 unique creators; top 5 expected:
      //   A: 3 cards, B: 2, C: 1, D: 1, E: 1   (F:1 should be cut at limit=5)
      mockCardsData.push(
        { creator_id: "A" },
        { creator_id: "A" },
        { creator_id: "A" },
        { creator_id: "B" },
        { creator_id: "B" },
        { creator_id: "C" },
        { creator_id: "D" },
        { creator_id: "E" },
        { creator_id: "F" },
      );

      const report = await service.generateWeeklyReport(
        "m1",
        new Date("2026-04-13T00:00:00Z"),
      );

      expect(report.top_creators).toHaveLength(5);
      expect(report.top_creators[0].contribution_count).toBe(3); // A
      expect(report.top_creators[1].contribution_count).toBe(2); // B
      // contribution_pct: A = 3 / 4 * 100 = 75
      expect(report.top_creators[0].contribution_pct).toBe(75);
      // names follow the "Creator <first8>" convention
      expect(report.top_creators[0].name).toMatch(/^Creator /);
    });
  });
});
