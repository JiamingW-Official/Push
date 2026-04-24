/**
 * @jest-environment node
 *
 * Unit tests for the v6 creator-segment mapping (Community / Studio).
 * Guards the score boundary (65) and handles both lowercase and PascalCase
 * tier inputs so future-tier-renaming bugs don't silently miscategorize.
 */

import {
  SEGMENT_TIERS,
  scoreToSegment,
  tierToSegment,
} from "@/lib/services/creator-segment";

describe("creator-segment", () => {
  describe("tierToSegment — lowercase input", () => {
    it("seed is Community", () => {
      expect(tierToSegment("seed")).toBe("Community");
    });
    it("explorer is Community", () => {
      expect(tierToSegment("explorer")).toBe("Community");
    });
    it("operator is Community (upper bound)", () => {
      expect(tierToSegment("operator")).toBe("Community");
    });
    it("proven is Studio (lower bound)", () => {
      expect(tierToSegment("proven")).toBe("Studio");
    });
    it("closer is Studio", () => {
      expect(tierToSegment("closer")).toBe("Studio");
    });
    it("partner is Studio", () => {
      expect(tierToSegment("partner")).toBe("Studio");
    });
  });

  describe("tierToSegment — PascalCase input (tier-config.ts style)", () => {
    it("Seed is Community", () => {
      expect(tierToSegment("Seed")).toBe("Community");
    });
    it("Partner is Studio", () => {
      expect(tierToSegment("Partner")).toBe("Studio");
    });
  });

  describe("tierToSegment — unknown input defaults to Community", () => {
    it("unknown tier name falls back to Community (safer default)", () => {
      expect(tierToSegment("unknown-tier")).toBe("Community");
    });
    it("empty string falls back to Community", () => {
      expect(tierToSegment("")).toBe("Community");
    });
  });

  describe("scoreToSegment — boundary at 65", () => {
    it("score 0 is Community", () => {
      expect(scoreToSegment(0)).toBe("Community");
    });
    it("score 64 is Community (just below boundary)", () => {
      expect(scoreToSegment(64)).toBe("Community");
    });
    it("score 65 is Studio (boundary)", () => {
      expect(scoreToSegment(65)).toBe("Studio");
    });
    it("score 100 is Studio (top)", () => {
      expect(scoreToSegment(100)).toBe("Studio");
    });
  });

  describe("SEGMENT_TIERS mapping", () => {
    it("Community has 3 tiers (seed/explorer/operator)", () => {
      expect(SEGMENT_TIERS.Community).toEqual(["seed", "explorer", "operator"]);
    });
    it("Studio has 3 tiers (proven/closer/partner)", () => {
      expect(SEGMENT_TIERS.Studio).toEqual(["proven", "closer", "partner"]);
    });
    it("no tier appears in both segments", () => {
      const communitySet = new Set(SEGMENT_TIERS.Community);
      const overlap = SEGMENT_TIERS.Studio.filter((t) => communitySet.has(t));
      expect(overlap).toHaveLength(0);
    });
  });
});
