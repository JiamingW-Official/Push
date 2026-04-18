/* ============================================================
   Push AI — Vision wrapper
   Calls Anthropic Messages API with an image block. If the
   ANTHROPIC_API_KEY env var is missing, the wrapper returns a
   deterministic mock shaped identically to a real response so
   the rest of the pipeline (verdict logic, DB writes, admin UI)
   can run end-to-end without a paid API key.
   ============================================================ */

import Anthropic from "@anthropic-ai/sdk";
import { VERIFICATION_SYSTEM_PROMPT } from "./prompts";

export interface VisionInput {
  /** Receipt image as a base64-encoded data string (without the data: prefix). */
  receiptBase64: string;
  /** MIME type of the receipt image. */
  mediaType: "image/png" | "image/jpeg" | "image/webp";
  /** Merchant name as registered — used by callers to compare against OCR output. */
  expectedMerchantName?: string;
}

export interface VisionOutput {
  merchant_name: string | null;
  amount_usd: number | null;
  timestamp_iso: string | null;
  confidence: number;
  notes: string;
  /** Metadata about the call itself. */
  meta: {
    model: string;
    latency_ms: number;
    cost_usd: number;
    mock: boolean;
  };
}

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL_VISION ?? "claude-sonnet-4-6";

/**
 * Verify a receipt image. Returns structured OCR output + metadata.
 *
 * In mock mode (no ANTHROPIC_API_KEY) this returns a fixed response
 * that passes verification if expectedMerchantName is provided, and
 * a soft-fail if it isn't — matching the shape of a real extraction.
 */
export async function verifyReceipt(input: VisionInput): Promise<VisionOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return mockVisionOutput(input);
  }

  const client = new Anthropic({ apiKey });
  const start = Date.now();

  const response = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 400,
    system: VERIFICATION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.mediaType,
              data: input.receiptBase64,
            },
          },
          {
            type: "text",
            text:
              (input.expectedMerchantName
                ? `Expected merchant: "${input.expectedMerchantName}". `
                : "") + "Extract the receipt fields now.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Vision response missing text block");
  }

  const parsed = safeParseJson<VisionOutput>(textBlock.text);
  if (!parsed) {
    throw new Error(
      `Vision returned non-JSON text: ${textBlock.text.slice(0, 120)}`,
    );
  }

  const latency = Date.now() - start;
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;

  return {
    ...parsed,
    meta: {
      model: response.model,
      latency_ms: latency,
      cost_usd: estimateSonnetCost(inputTokens, outputTokens),
      mock: false,
    },
  };
}

/**
 * Mock path used when ANTHROPIC_API_KEY is not set.
 * Deterministic, safe for CI, shape-identical to live API.
 */
function mockVisionOutput(input: VisionInput): VisionOutput {
  const match = input.expectedMerchantName
    ? input.expectedMerchantName
    : "Sey Coffee";
  return {
    merchant_name: match,
    amount_usd: 6.25,
    timestamp_iso: new Date().toISOString(),
    confidence: 0.92,
    notes: "Mock verification (no ANTHROPIC_API_KEY set).",
    meta: {
      model: "mock-vision",
      latency_ms: 120,
      cost_usd: 0,
      mock: true,
    },
  };
}

function safeParseJson<T>(raw: string): T | null {
  // Strip markdown code fences if the model wrapped JSON in one
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

/**
 * Rough cost estimate for Sonnet 4.6. Real pricing should come from
 * the Anthropic price list — this is a defensive default so the DB
 * has *some* cost attribution even before billing is formalized.
 */
function estimateSonnetCost(input_tokens: number, output_tokens: number) {
  // $3 / 1M input, $15 / 1M output (placeholder — override via env in P3)
  const inputUsd = (input_tokens / 1_000_000) * 3;
  const outputUsd = (output_tokens / 1_000_000) * 15;
  return Number((inputUsd + outputUsd).toFixed(6));
}

/**
 * Great-circle distance in meters between two lat/lng pairs.
 * Used by the scan route for the geo-match layer of verification.
 */
export function haversineMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6_371_000; // earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/**
 * Fuzzy name match between the OCR result and the registered merchant name.
 * Returns a 0–1 similarity score; 0.85+ is considered a pass.
 */
export function merchantNameSimilarity(
  ocrName: string | null,
  registered: string,
): number {
  if (!ocrName) return 0;
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const a = norm(ocrName);
  const b = norm(registered);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.93;
  // Token overlap — cheap bag-of-words Jaccard
  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  const intersection = [...aTokens].filter((t) => bTokens.has(t)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
}
