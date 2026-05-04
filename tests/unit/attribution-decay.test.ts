/**
 * @jest-environment node
 *
 * Unit tests for the FTC 16 CFR Part 255 attribution decay curve.
 * Verifies the piecewise schedule (1.0 / 0.5 / 0.3 / 0.1 / 0) at every
 * boundary and rejects negative day deltas via clamp-to-1.0.
 */

import {
  ATTRIBUTION_WINDOW_DAYS,
  computeAttributionWeight,
  isAttributionWindowExpired,
} from "@/lib/services/attribution-decay";

const DAY_MS = 1000 * 60 * 60 * 24;

function daysAfter(base: Date, n: number): Date {
  return new Date(base.getTime() + n * DAY_MS);
}

describe("attribution-decay", () => {
  const T0 = new Date("2026-01-01T00:00:00Z");

  describe("computeAttributionWeight", () => {
    it("returns 1.0 on D0 (same day)", () => {
      expect(computeAttributionWeight(T0, T0)).toBe(1.0);
    });

    it("returns 1.0 on D29 (last day of full credit window)", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 29))).toBe(1.0);
    });

    it("returns 0.5 on D30 (first day of half credit)", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 30))).toBe(0.5);
    });

    it("returns 0.5 on D59", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 59))).toBe(0.5);
    });

    it("returns 0.3 on D60", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 60))).toBe(0.3);
    });

    it("returns 0.3 on D89", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 89))).toBe(0.3);
    });

    it("returns 0.1 on D90", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 90))).toBe(0.1);
    });

    it("returns 0.1 on D119", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 119))).toBe(0.1);
    });

    it("returns 0 on D120 (window expired)", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 120))).toBe(0);
    });

    it("returns 0 on D365 (window long expired)", () => {
      expect(computeAttributionWeight(T0, daysAfter(T0, 365))).toBe(0);
    });

    it("clamps to 1.0 if currentScanAt is before firstScanAt", () => {
      // Negative day delta — defensive behavior, never expected in prod
      expect(computeAttributionWeight(T0, daysAfter(T0, -5))).toBe(1.0);
    });
  });

  describe("isAttributionWindowExpired", () => {
    it("returns true only when weight is exactly 0", () => {
      expect(isAttributionWindowExpired(0)).toBe(true);
      expect(isAttributionWindowExpired(0.1)).toBe(false);
      expect(isAttributionWindowExpired(1.0)).toBe(false);
    });
  });

  describe("ATTRIBUTION_WINDOW_DAYS", () => {
    it("is 120 (4 month-buckets in the FTC schedule)", () => {
      expect(ATTRIBUTION_WINDOW_DAYS).toBe(120);
    });
  });
});
