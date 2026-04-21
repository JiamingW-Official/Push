// POST /api/admin/oracle-trigger
//
// Admin-only endpoint that runs the ConversionOracle (AIVerificationService)
// against a specific push_transactions row, writes an oracle_audit row, and
// returns the decision. Used by /admin/oracle-trigger UI.
//
// v5.3-EXEC P1-4 admin control surface: lets ops re-run the oracle on any
// transaction that landed in manual_review_required, or to re-evaluate
// after a fraud investigation.

import {
  badRequest,
  notFound,
  serverError,
  success,
} from "@/lib/api/responses";
import { requireAdminSession } from "@/lib/api/admin-auth";
import {
  AIVerificationService,
  type VerificationResult,
} from "@/lib/services/AIVerificationService";
import { supabase } from "@/lib/db";

interface TxnRow {
  transaction_id: string;
  merchant_id: string;
  creator_id: string;
  claim_timestamp: string;
  redeem_timestamp: string | null;
  claim_gps_lat: number | null;
  claim_gps_lng: number | null;
  redeem_gps_lat: number | null;
  redeem_gps_lng: number | null;
}

interface MerchantRow {
  id: string;
  lat: number | null;
  lng: number | null;
}

const oracle = new AIVerificationService();

export async function POST(req: Request): Promise<Response> {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  let body: { transaction_id?: unknown };
  try {
    body = (await req.json()) as { transaction_id?: unknown };
  } catch {
    return badRequest("Body must be JSON");
  }

  const txId = body.transaction_id;
  if (typeof txId !== "string" || txId.length === 0) {
    return badRequest("`transaction_id` is required");
  }

  // ── Load the transaction row + merchant coords ──────────────────────────
  const { data: txData, error: txErr } = await supabase
    .from("push_transactions")
    .select(
      "transaction_id, merchant_id, creator_id, claim_timestamp, redeem_timestamp, claim_gps_lat, claim_gps_lng, redeem_gps_lat, redeem_gps_lng",
    )
    .eq("transaction_id", txId)
    .maybeSingle();

  if (txErr) return serverError("oracle-trigger-load-tx", txErr);
  if (!txData) return notFound("Transaction not found");
  const tx = txData as TxnRow;

  const { data: merchData } = await supabase
    .from("merchants")
    .select("id, lat, lng")
    .eq("id", tx.merchant_id)
    .maybeSingle();
  const merch = merchData as MerchantRow | null;

  const merchLat = merch?.lat ?? 40.7128;
  const merchLng = merch?.lng ?? -74.006;
  const custLat = tx.redeem_gps_lat ?? tx.claim_gps_lat ?? merchLat;
  const custLng = tx.redeem_gps_lng ?? tx.claim_gps_lng ?? merchLng;

  // ── Run the oracle (5-signal when timing is present) ─────────────────────
  let result: VerificationResult;
  try {
    result = await oracle.verifyCustomerClaim({
      merchant_id: tx.merchant_id,
      creator_id: tx.creator_id,
      customer_name: "admin-rerun",
      photo_url: "admin://rerun",
      receipt_url: "admin://rerun",
      merchant_lat: merchLat,
      merchant_lon: merchLng,
      customer_lat: custLat,
      customer_lon: custLng,
      claim_timestamp: tx.claim_timestamp,
      redeem_timestamp: tx.redeem_timestamp ?? undefined,
      merchant_active: merch !== null,
    });
  } catch (err) {
    return serverError("oracle-trigger-run", err);
  }

  // ── Parse reasoning into signal_scores ───────────────────────────────────
  const signalScores: Record<string, number> = {};
  for (const part of result.reasoning.split(",")) {
    const [name, value] = part
      .trim()
      .split(":")
      .map((s) => s.trim());
    const n = parseFloat(value);
    if (name && Number.isFinite(n)) signalScores[name.toLowerCase()] = n;
  }

  const { error: auditErr } = await supabase.from("oracle_audit").insert([
    {
      transaction_id: tx.transaction_id,
      decision: result.status,
      confidence_score: result.confidence_score,
      signal_scores: signalScores,
      reasoning: result.reasoning,
      triggered_by: "admin",
      triggered_by_user_id: gate.userId,
    },
  ]);

  if (auditErr) return serverError("oracle-trigger-audit", auditErr);

  return success({
    transaction_id: tx.transaction_id,
    decision: result.status,
    confidence_score: result.confidence_score,
    signal_scores: signalScores,
    reasoning: result.reasoning,
  });
}
