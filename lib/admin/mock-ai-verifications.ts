/* ============================================================
   Mock data for /admin/ai-verifications (v5.0)
   Mirrors the shape of the ai_verifications table + joined
   merchant/creator context. Used as a fallback when Supabase
   is not configured or in dev/CI runs without the service-role
   key. Distinct from lib/admin/mock-verifications.ts which
   powers the creator-KYC queue.
   ============================================================ */

export type AiVerdict =
  | "auto_verified"
  | "auto_rejected"
  | "manual_review"
  | "human_approved"
  | "human_rejected";

export interface MockAiVerification {
  id: string;
  scanId: string;
  merchantId: string;
  merchantName: string;
  creatorHandle: string;
  campaignTitle: string;

  amountExtracted: number | null;
  merchantMatchConfidence: number | null;
  geoDistanceMeters: number | null;
  visionConfidence: number;
  visionModel: string;
  visionLatencyMs: number;
  visionCostUsd: number;
  visionMock: boolean;

  ocrMerchantName: string | null;
  ocrNotes: string;

  receiptImageUrl: string | null;

  verdict: AiVerdict;
  reviewedByHuman: boolean;
  reviewNotes: string | null;
  createdAt: string;
}

export const MOCK_AI_VERIFICATIONS: MockAiVerification[] = [
  {
    id: "aiv-001",
    scanId: "scan-10021",
    merchantId: "m-seycoffee",
    merchantName: "Sey Coffee",
    creatorHandle: "@coffee.crawl",
    campaignTitle: "Williamsburg morning rush — week 2",
    amountExtracted: 6.25,
    merchantMatchConfidence: 0.72,
    geoDistanceMeters: 185,
    visionConfidence: 0.81,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 4120,
    visionCostUsd: 0.0042,
    visionMock: false,
    ocrMerchantName: "SEY CFE",
    ocrNotes: "Faded top-of-receipt ink — cafe name partially abraded.",
    receiptImageUrl: null,
    verdict: "manual_review",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T14:32:11Z",
  },
  {
    id: "aiv-002",
    scanId: "scan-10018",
    merchantId: "m-devocion",
    merchantName: "Devocion",
    creatorHandle: "@brooklyn_bites",
    campaignTitle: "Latte + pour-over saturation",
    amountExtracted: 5.75,
    merchantMatchConfidence: 0.58,
    geoDistanceMeters: 240,
    visionConfidence: 0.69,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 3880,
    visionCostUsd: 0.0038,
    visionMock: false,
    ocrMerchantName: "DEVOTION CAFE",
    ocrNotes:
      "Scan GPS 240m from merchant — outside 200m pass window. Name OCR off by one letter.",
    receiptImageUrl: null,
    verdict: "manual_review",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T13:14:02Z",
  },
  {
    id: "aiv-003",
    scanId: "scan-10007",
    merchantId: "m-seycoffee",
    merchantName: "Sey Coffee",
    creatorHandle: "@maya.eats.nyc",
    campaignTitle: "Williamsburg morning rush — week 2",
    amountExtracted: null,
    merchantMatchConfidence: 0.88,
    geoDistanceMeters: 42,
    visionConfidence: 0.44,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 5210,
    visionCostUsd: 0.0051,
    visionMock: false,
    ocrMerchantName: "SEY COFFEE",
    ocrNotes:
      "Amount blurred — receipt folded over the total line. Vision could not extract.",
    receiptImageUrl: null,
    verdict: "manual_review",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T11:02:58Z",
  },
  {
    id: "aiv-004",
    scanId: "scan-09988",
    merchantId: "m-partners",
    merchantName: "Partners Coffee",
    creatorHandle: "@williamsburg.e",
    campaignTitle: "Partners × Williamsburg ambassador",
    amountExtracted: 8.0,
    merchantMatchConfidence: 0.91,
    geoDistanceMeters: 310,
    visionConfidence: 0.88,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 3502,
    visionCostUsd: 0.0034,
    visionMock: false,
    ocrMerchantName: "Partners Coffee",
    ocrNotes:
      "Name + amount crisp. Scan GPS fired 310m from registered address.",
    receiptImageUrl: null,
    verdict: "manual_review",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T09:47:21Z",
  },
  {
    id: "aiv-005",
    scanId: "scan-09961",
    merchantId: "m-variety",
    merchantName: "Variety Coffee",
    creatorHandle: "@sip.and.scroll",
    campaignTitle: "Cold-brew push — Williamsburg",
    amountExtracted: 4.5,
    merchantMatchConfidence: 0.95,
    geoDistanceMeters: 70,
    visionConfidence: 0.93,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 2940,
    visionCostUsd: 0.0029,
    visionMock: false,
    ocrMerchantName: "Variety Coffee",
    ocrNotes: "Clean receipt, all fields extracted confidently.",
    receiptImageUrl: null,
    verdict: "auto_verified",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T08:31:09Z",
  },
  {
    id: "aiv-006",
    scanId: "scan-09930",
    merchantId: "m-seycoffee",
    merchantName: "Sey Coffee",
    creatorHandle: "@coffee.crawl",
    campaignTitle: "Williamsburg morning rush — week 2",
    amountExtracted: 11.25,
    merchantMatchConfidence: 0.09,
    geoDistanceMeters: 1820,
    visionConfidence: 0.92,
    visionModel: "claude-sonnet-4-6",
    visionLatencyMs: 3110,
    visionCostUsd: 0.0031,
    visionMock: false,
    ocrMerchantName: "LOCANDA VERDE",
    ocrNotes:
      "Receipt belongs to a different merchant entirely — OCR extracted a Tribeca restaurant.",
    receiptImageUrl: null,
    verdict: "auto_rejected",
    reviewedByHuman: false,
    reviewNotes: null,
    createdAt: "2026-04-17T07:15:44Z",
  },
];
