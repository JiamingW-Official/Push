/**
 * @jest-environment node
 *
 * Unit tests for AIVerificationService.
 *
 * Mocks `@/lib/db` so no real Supabase / Postgres call is made. Each test
 * asserts a single behavior of the public API; private scorers are stubbed
 * by replacing the methods on the instance (typed via `(service as any)`).
 */

// jest.mock must be hoisted above imports.
jest.mock("@/lib/db", () => {
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
    then: (cb) => Promise.resolve({ data: [], error: null }).then(cb),
  };
  return {
    db: {
      update: jest.fn().mockResolvedValue(undefined),
      insert: jest.fn().mockResolvedValue({}),
      select: jest.fn().mockResolvedValue([]),
    },
    supabase: { from: jest.fn(() => chain) },
  };
});

import { AIVerificationService } from "@/lib/services/AIVerificationService";
import { db } from "@/lib/db";

const baseClaim = {
  merchant_id: "m1",
  creator_id: "c1",
  customer_name: "Alice",
  photo_url: "p",
  receipt_url: "r",
  merchant_lat: 40.7128,
  merchant_lon: -74.006,
  customer_lat: 40.7128,
  customer_lon: -74.006,
};

describe("AIVerificationService", () => {
  let service: AIVerificationService;

  beforeEach(() => {
    service = new AIVerificationService();
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // verifyCustomerClaim
  // -------------------------------------------------------------------------

  describe("verifyCustomerClaim()", () => {
    it("should return an object with status, confidence_score, and reasoning", async () => {
      const result = await service.verifyCustomerClaim(baseClaim);

      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("confidence_score");
      expect(result).toHaveProperty("reasoning");
      expect(typeof result.confidence_score).toBe("number");
      expect(result.confidence_score).toBeGreaterThanOrEqual(0);
      expect(result.confidence_score).toBeLessThanOrEqual(1);
      expect(["auto_verified", "manual_review_required", "rejected"]).toContain(
        result.status,
      );
      expect(result.reasoning).toMatch(/Vision: .* OCR: .* Geo: /);
    });

    it("should return auto_verified when all sub-scores are high (>= 0.85)", async () => {
      // Stub the two random scorers high; identical coords → geo = 0.95
      // Average = (0.9 + 0.9 + 0.95) / 3 ≈ 0.917 ≥ 0.85
      (
        service as unknown as { mockVisionAnalysis: () => number }
      ).mockVisionAnalysis = () => 0.9;
      (
        service as unknown as { mockOCRAnalysis: () => number }
      ).mockOCRAnalysis = () => 0.9;

      const result = await service.verifyCustomerClaim(baseClaim);

      expect(result.status).toBe("auto_verified");
      expect(result.confidence_score).toBeGreaterThanOrEqual(0.85);
    });

    it("should return manual_review_required for medium scores (0.65-0.85)", async () => {
      // vision = ocr = 0.7; ~200m apart → geo = 0.7
      // Average = 0.7
      (
        service as unknown as { mockVisionAnalysis: () => number }
      ).mockVisionAnalysis = () => 0.7;
      (
        service as unknown as { mockOCRAnalysis: () => number }
      ).mockOCRAnalysis = () => 0.7;

      const result = await service.verifyCustomerClaim({
        ...baseClaim,
        // ~0.0018° latitude ≈ 200m north of merchant
        customer_lat: 40.7128 + 0.0018,
      });

      expect(result.status).toBe("manual_review_required");
      expect(result.confidence_score).toBeGreaterThanOrEqual(0.65);
      expect(result.confidence_score).toBeLessThan(0.85);
    });

    it("should return rejected when scores are low (< 0.65)", async () => {
      // vision = ocr = 0.6; >500m apart → geo = 0.3
      // Average = (0.6 + 0.6 + 0.3) / 3 = 0.5 < 0.65
      (
        service as unknown as { mockVisionAnalysis: () => number }
      ).mockVisionAnalysis = () => 0.6;
      (
        service as unknown as { mockOCRAnalysis: () => number }
      ).mockOCRAnalysis = () => 0.6;

      const result = await service.verifyCustomerClaim({
        ...baseClaim,
        customer_lat: 40.7128 + 0.013, // ~1.4km north
      });

      expect(result.status).toBe("rejected");
      expect(result.confidence_score).toBeLessThan(0.65);
    });
  });

  // -------------------------------------------------------------------------
  // calculateDistance — Haversine
  // -------------------------------------------------------------------------

  describe("calculateDistance() (Haversine)", () => {
    type Distancer = {
      calculateDistance: (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ) => number;
    };

    it("should return ~0 for identical coordinates", () => {
      const d = (service as unknown as Distancer).calculateDistance(
        40.7128,
        -74.006,
        40.7128,
        -74.006,
      );
      expect(d).toBeCloseTo(0, 1);
    });

    it("should return a plausible distance between Manhattan and Brooklyn (~10-15km)", () => {
      // Times Square: 40.7580, -73.9855 ↔ Prospect Park: 40.6602, -73.9690
      const d = (service as unknown as Distancer).calculateDistance(
        40.758,
        -73.9855,
        40.6602,
        -73.969,
      );
      expect(d).toBeGreaterThan(10000);
      expect(d).toBeLessThan(15000);
    });

    it("should be symmetric (d(A,B) === d(B,A))", () => {
      const calc = (service as unknown as Distancer).calculateDistance;
      const a = calc(40.7128, -74.006, 40.6782, -73.9442);
      const b = calc(40.6782, -73.9442, 40.7128, -74.006);
      expect(a).toBeCloseTo(b, 5);
    });
  });

  // -------------------------------------------------------------------------
  // saveVerification — DB persistence
  // -------------------------------------------------------------------------

  describe("saveVerification()", () => {
    it("should call db.update on verified_customer_claims with the result fields", async () => {
      const result = {
        status: "auto_verified" as const,
        confidence_score: 0.91,
        reasoning: "Vision: 0.9, OCR: 0.9, Geo: 0.95",
      };

      await service.saveVerification("claim-uuid-123", result);

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(db.update).toHaveBeenCalledWith(
        "verified_customer_claims",
        "claim-uuid-123",
        expect.objectContaining({
          ai_confidence_score: 0.91,
          ai_decision: "auto_verified",
          verified_at: expect.any(String),
        }),
      );
      // verified_at should be an ISO timestamp
      const call = (db.update as jest.Mock).mock.calls[0][2];
      expect(() => new Date(call.verified_at).toISOString()).not.toThrow();
    });
  });
});
