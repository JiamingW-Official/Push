/**
 * @jest-environment node
 *
 * Unit tests for CreatorRecruitmentService.
 *
 * Mocks `@/lib/db` so no real Supabase / Postgres call is made. The mock
 * is stateful: recruit → update flows return the previously-inserted row
 * so tests can assert realistic lifecycle transitions (prospect → active
 * → churn) without a live database.
 *
 * NOTE: The service's actual contract differs slightly from the initial
 * audit prompt. Aligned with the real API here:
 *   - `recruitCreator(creatorId, tier, source)` stores creator_id (row id
 *     is DB-generated), status starts as 'prospect'.
 *   - `moveCreatorToActive` transitions to 'active' (not 'early_operator').
 *   - `performance_score` is clamped to [0, 1] (out-of-range collapses,
 *     does NOT throw).
 *   - `recruitCreator('')` does NOT throw — validation lives at the DB
 *     (NOT NULL / FK), not in the service.
 */

import type {
  CreatorRecruitmentFunnel,
  CreatorRecruitmentSource,
  CreatorTier,
} from "@/types/database";

// Module-level mutable store so tests can observe what was written.
const store = new Map<string, CreatorRecruitmentFunnel>();

function makeRow(
  creatorId: string,
  overrides: Partial<CreatorRecruitmentFunnel> = {},
): CreatorRecruitmentFunnel {
  const now = new Date().toISOString();
  return {
    id: `row-${creatorId}`,
    creator_id: creatorId,
    tier: 1,
    status: "prospect",
    recruitment_source: "direct_network",
    signed_date: null,
    performance_score: 0,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

jest.mock("@/lib/db", () => {
  function makeSelectChain(rows: () => CreatorRecruitmentFunnel[]) {
    const chain: Record<string, unknown> = {};
    const fn = () => chain;
    chain.select = jest.fn(fn);
    chain.eq = jest.fn(fn);
    chain.order = jest.fn(fn);
    chain.range = jest.fn((from: number, to: number) =>
      Promise.resolve({ data: rows().slice(from, to + 1), error: null }),
    );
    chain.limit = jest.fn((n: number) =>
      Promise.resolve({ data: rows().slice(0, n), error: null }),
    );
    return chain;
  }

  function makeUpdateChain(
    patch: Partial<CreatorRecruitmentFunnel>,
  ): Record<string, unknown> {
    let creatorId = "";
    const chain: Record<string, unknown> = {};
    chain.eq = jest.fn((_col: string, val: string) => {
      creatorId = val;
      return chain;
    });
    chain.select = jest.fn(() => chain);
    chain.single = jest.fn(() => {
      const existing = store.get(creatorId);
      if (!existing) {
        return Promise.resolve({
          data: null,
          error: { code: "PGRST116", message: "no rows" },
        });
      }
      const updated = {
        ...existing,
        ...patch,
        updated_at: new Date().toISOString(),
      };
      store.set(creatorId, updated);
      return Promise.resolve({ data: updated, error: null });
    });
    return chain;
  }

  return {
    db: {
      insert: jest.fn(
        async (_table: string, payload: Record<string, unknown>) => {
          const row = makeRow(payload.creator_id as string, payload);
          store.set(row.creator_id, row);
          return row;
        },
      ),
    },
    supabase: {
      from: jest.fn((_table: string) => {
        let filterTier: CreatorTier | null = null;
        let filterStatus: string | null = null;
        const query = {
          select: jest.fn(() => query),
          eq: jest.fn((col: string, val: unknown) => {
            if (col === "tier") filterTier = val as CreatorTier;
            if (col === "status") filterStatus = val as string;
            return query;
          }),
          order: jest.fn(() => query),
          range: jest.fn((from: number, to: number) => {
            const all = Array.from(store.values()).filter(
              (r) => filterTier === null || r.tier === filterTier,
            );
            return Promise.resolve({
              data: all.slice(from, to + 1),
              error: null,
            });
          }),
          limit: jest.fn((n: number) => {
            const all = Array.from(store.values())
              .filter((r) => filterStatus === null || r.status === filterStatus)
              .sort((a, b) => b.performance_score - a.performance_score);
            return Promise.resolve({ data: all.slice(0, n), error: null });
          }),
          update: jest.fn((patch: Partial<CreatorRecruitmentFunnel>) =>
            makeUpdateChain(patch),
          ),
        };
        // supabase().from().update() returns the update chain directly.
        const topLevel = {
          ...query,
          update: jest.fn((patch: Partial<CreatorRecruitmentFunnel>) =>
            makeUpdateChain(patch),
          ),
        };
        return topLevel;
      }),
    },
  };
});

import { CreatorRecruitmentService } from "@/lib/services/CreatorRecruitmentService";

describe("CreatorRecruitmentService", () => {
  let service: CreatorRecruitmentService;

  beforeEach(() => {
    service = new CreatorRecruitmentService();
    store.clear();
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // recruitCreator
  // -------------------------------------------------------------------------

  describe("recruitCreator", () => {
    it("should recruit a new creator with prospect status", async () => {
      const result = await service.recruitCreator(
        "creator-test-001",
        3,
        "direct_network",
      );

      expect(result).toMatchObject({
        creator_id: "creator-test-001",
        tier: 3,
        status: "prospect",
        recruitment_source: "direct_network",
        performance_score: 0,
      });
      expect(result.created_at).toBeDefined();
    });

    it("should handle tier 1, 2, and 3", async () => {
      const tier1 = await service.recruitCreator("c1", 1, "community");
      const tier2 = await service.recruitCreator("c2", 2, "incentive");
      const tier3 = await service.recruitCreator("c3", 3, "direct_network");

      expect(tier1.tier).toBe(1);
      expect(tier2.tier).toBe(2);
      expect(tier3.tier).toBe(3);
    });

    it("should accept all recruitment sources", async () => {
      const sources: CreatorRecruitmentSource[] = [
        "direct_network",
        "community",
        "incentive",
      ];

      for (const source of sources) {
        const result = await service.recruitCreator(
          `creator-${source}`,
          1,
          source,
        );
        expect(result.recruitment_source).toBe(source);
      }
    });
  });

  // -------------------------------------------------------------------------
  // moveCreatorToActive
  // -------------------------------------------------------------------------

  describe("moveCreatorToActive", () => {
    it("should move creator from prospect to active", async () => {
      const recruited = await service.recruitCreator(
        "creator-test-002",
        2,
        "community",
      );
      expect(recruited.status).toBe("prospect");

      const updated = await service.moveCreatorToActive("creator-test-002");
      expect(updated.status).toBe("active");
      expect(updated.signed_date).toBeDefined();
    });

    it("should set signed_date to current time in ISO 8601", async () => {
      await service.recruitCreator("creator-test-003", 1, "incentive");
      const before = Date.now();

      const result = await service.moveCreatorToActive("creator-test-003");

      const after = Date.now();
      const signedDate = new Date(result.signed_date!).getTime();

      expect(signedDate).toBeGreaterThanOrEqual(before);
      expect(signedDate).toBeLessThanOrEqual(after);
    });

    it("should throw error if creator not found", async () => {
      await expect(
        service.moveCreatorToActive("non-existent-creator"),
      ).rejects.toThrow(/no recruitment_funnel row/);
    });
  });

  // -------------------------------------------------------------------------
  // updatePerformanceScore
  // -------------------------------------------------------------------------

  describe("updatePerformanceScore", () => {
    it("should update performance score to valid number", async () => {
      await service.recruitCreator("creator-test-004", 3, "direct_network");

      const result = await service.updatePerformanceScore(
        "creator-test-004",
        0.87,
      );

      expect(result.performance_score).toBe(0.87);
    });

    it("should accept scores between 0 and 1", async () => {
      await service.recruitCreator("creator-test-005", 2, "community");

      const scores = [0, 0.5, 0.99, 1];
      for (const score of scores) {
        const result = await service.updatePerformanceScore(
          "creator-test-005",
          score,
        );
        expect(result.performance_score).toBe(score);
      }
    });

    it("should clamp score < 0 to 0", async () => {
      await service.recruitCreator("creator-test-006", 1, "incentive");

      const result = await service.updatePerformanceScore(
        "creator-test-006",
        -0.1,
      );

      expect(result.performance_score).toBe(0);
    });

    it("should clamp score > 1 to 1", async () => {
      await service.recruitCreator("creator-test-007", 1, "incentive");

      const result = await service.updatePerformanceScore(
        "creator-test-007",
        1.1,
      );

      expect(result.performance_score).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // getCreatorsByTier
  // -------------------------------------------------------------------------

  describe("getCreatorsByTier", () => {
    beforeEach(async () => {
      await service.recruitCreator("tier1-creator-1", 1, "direct_network");
      await service.recruitCreator("tier1-creator-2", 1, "community");
      await service.recruitCreator("tier2-creator-1", 2, "incentive");
      await service.recruitCreator("tier3-creator-1", 3, "direct_network");
    });

    it("should return all creators of tier 1", async () => {
      const tier1Creators = await service.getCreatorsByTier(1);

      expect(tier1Creators.length).toBeGreaterThanOrEqual(2);
      expect(tier1Creators.every((c) => c.tier === 1)).toBe(true);
    });

    it("should return all creators of tier 2", async () => {
      const tier2Creators = await service.getCreatorsByTier(2);

      expect(tier2Creators.length).toBeGreaterThanOrEqual(1);
      expect(tier2Creators.every((c) => c.tier === 2)).toBe(true);
    });

    it("should return all creators of tier 3", async () => {
      const tier3Creators = await service.getCreatorsByTier(3);

      expect(tier3Creators.length).toBeGreaterThanOrEqual(1);
      expect(tier3Creators.every((c) => c.tier === 3)).toBe(true);
    });

    it("should return an array (possibly empty) for any tier", async () => {
      const result = await service.getCreatorsByTier(2);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // churnCreator
  // -------------------------------------------------------------------------

  describe("churnCreator", () => {
    it("should mark creator as churned", async () => {
      await service.recruitCreator("creator-test-008", 2, "community");

      const result = await service.churnCreator("creator-test-008");

      expect(result.status).toBe("churn");
    });

    it("should preserve other creator data when churning", async () => {
      const original = await service.recruitCreator(
        "creator-test-009",
        3,
        "direct_network",
      );

      const churned = await service.churnCreator("creator-test-009");

      expect(churned.creator_id).toBe(original.creator_id);
      expect(churned.tier).toBe(original.tier);
      expect(churned.recruitment_source).toBe(original.recruitment_source);
    });

    it("should throw error if creator not found", async () => {
      await expect(service.churnCreator("non-existent")).rejects.toThrow(
        /no recruitment_funnel row/,
      );
    });
  });

  // -------------------------------------------------------------------------
  // getActivators
  // -------------------------------------------------------------------------

  describe("getActivators", () => {
    beforeEach(async () => {
      for (let i = 1; i <= 15; i++) {
        const id = `activator-${i}`;
        await service.recruitCreator(
          id,
          ((i % 3) + 1) as CreatorTier,
          "direct_network",
        );
        await service.moveCreatorToActive(id);
        await service.updatePerformanceScore(id, Math.min(0.5 + i * 0.02, 1));
      }
    });

    it("should return top 10 creators by performance score", async () => {
      const activators = await service.getActivators(10);

      expect(activators.length).toBeLessThanOrEqual(10);
      expect(activators.length).toBeGreaterThan(0);

      for (let i = 0; i < activators.length - 1; i++) {
        expect(activators[i].performance_score).toBeGreaterThanOrEqual(
          activators[i + 1].performance_score,
        );
      }
    });

    it("should return top N creators when limit specified", async () => {
      const top5 = await service.getActivators(5);
      expect(top5.length).toBeLessThanOrEqual(5);
    });

    it("should default to 10 if limit not specified", async () => {
      const defaultLimit = await service.getActivators();
      expect(defaultLimit.length).toBeLessThanOrEqual(10);
    });
  });

  // -------------------------------------------------------------------------
  // Data Structure Validation
  // -------------------------------------------------------------------------

  describe("Data Structure Validation", () => {
    it("should return correct data structure for recruited creator", async () => {
      const result = await service.recruitCreator(
        "struct-test-1",
        2,
        "community",
      );

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("creator_id");
      expect(result).toHaveProperty("tier");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("performance_score");
      expect(result).toHaveProperty("recruitment_source");
      expect(result).toHaveProperty("created_at");

      expect(typeof result.id).toBe("string");
      expect(typeof result.creator_id).toBe("string");
      expect(typeof result.tier).toBe("number");
      expect(typeof result.status).toBe("string");
      expect(typeof result.performance_score).toBe("number");
      expect(typeof result.recruitment_source).toBe("string");
      expect(typeof result.created_at).toBe("string");
    });

    it("should have valid ISO 8601 dates", async () => {
      const result = await service.recruitCreator(
        "struct-test-2",
        1,
        "incentive",
      );

      const createdDate = new Date(result.created_at);
      expect(createdDate.getTime()).not.toBeNaN();
    });
  });
});
