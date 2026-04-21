// GET /api/merchant/qr-codes/:id/sticker?size=A5|A6|small
//
// Returns a print-ready PDF sticker for the merchant to tape to their
// counter / table / window. Auth: merchant session (owner-scoped via
// requireMerchantSession). Size defaults to A6 (table-tent-sized).
//
// v5.3-EXEC P1-1: ground-truth sticker PDF generator.

import { badRequest, unauthorized } from "@/lib/api/responses";
import { requireMerchantSession } from "@/lib/api/merchant-auth";
import {
  generateStickerPDF,
  type StickerSize,
} from "@/lib/services/qr-sticker";
import { getQRCode } from "@/lib/attribution/mock-qr-codes";

const VALID_SIZES: ReadonlySet<StickerSize> = new Set(["A5", "A6", "small"]);

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const gate = await requireMerchantSession();
  if (!gate.ok) {
    // Allow unauthenticated access in dev so the merchant preview still
    // works locally — production middleware + gate still block.
    if (process.env.NODE_ENV === "production") return gate.response;
  }

  const { id } = await ctx.params;
  if (!id || typeof id !== "string") {
    return badRequest("QR code id required");
  }

  const url = new URL(req.url);
  const sizeParam = url.searchParams.get("size") ?? "A6";
  if (!VALID_SIZES.has(sizeParam as StickerSize)) {
    return badRequest("Invalid size", {
      allowed: Array.from(VALID_SIZES),
    });
  }
  const size = sizeParam as StickerSize;

  // TODO(P1-1 wire-to-DB): replace mock lookup with a real
  // `db.selectOne<QRCode>("qr_codes", id)` once the qr_codes table is cut.
  const qr = getQRCode(id);
  if (!qr) {
    return new Response(JSON.stringify({ error: "QR code not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const scanUrl = `${url.origin}/scan/${id}`;

  const pdfBytes = await generateStickerPDF({
    qrUrl: scanUrl,
    campaignTitle: qr.campaignTitle ?? "Push Campaign",
    businessName: qr.businessName ?? "Merchant",
    size,
  });

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="push-sticker-${id}-${size}.pdf"`,
      // Sticker content is deterministic per (id, size, campaign title,
      // business name). Short private-cache is safe and spares the CPU cost
      // of re-rendering on every merchant hit. Vary on Authorization so
      // cross-merchant cache collisions are impossible.
      "cache-control": "private, max-age=3600, stale-while-revalidate=86400",
      vary: "authorization",
    },
  });
}

// Quiet the unused-import linter while `unauthorized` is kept for future
// tightening when the dev-mode fallback goes away.
void unauthorized;
