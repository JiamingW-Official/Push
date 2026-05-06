/**
 * GET /api/creator/receipts/[gigId]
 *
 * Generates a tax-ready PDF receipt for a paid gig. Reuses the pdf-lib
 * stack that powers /lib/services/qr-sticker.ts. Output is a one-page
 * letter-size doc:
 *   - Push wordmark + creator name
 *   - Gig title + brand
 *   - Date + scan count
 *   - Payout breakdown (Gtd / Tgt / Str + total)
 *   - Tax notice + 1099-K reference
 *
 * Demo mode: fills with synthesized values from the seed Invite.
 */

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { SEED_INVITES } from "@/lib/inbox/seed";

type Params = Promise<{ gigId: string }>;

export async function GET(_req: NextRequest, ctx: { params: Params }) {
  const { gigId } = await ctx.params;
  const gig = SEED_INVITES.find((g) => g.id === gigId);

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // letter
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.07, 0.07, 0.07);
  const sub = rgb(0.36, 0.36, 0.34);
  const red = rgb(0.756, 0.07, 0.122); // brand red

  let y = 720;

  page.drawText("PUSH", {
    x: 48,
    y,
    size: 28,
    font: helvBold,
    color: red,
  });

  y -= 12;
  page.drawText("Tax-ready payout receipt", {
    x: 48,
    y,
    size: 10,
    font: helv,
    color: sub,
  });

  y -= 56;
  page.drawText(gig.brand, {
    x: 48,
    y,
    size: 22,
    font: helvBold,
    color: ink,
  });

  y -= 22;
  page.drawText(gig.campaign, {
    x: 48,
    y,
    size: 14,
    font: helv,
    color: sub,
  });

  y -= 40;
  page.drawText("PAYOUT BREAKDOWN", {
    x: 48,
    y,
    size: 9,
    font: helvBold,
    color: sub,
  });

  y -= 20;
  for (const tier of gig.payoutTiers ?? []) {
    page.drawText(`${tier.label}`, {
      x: 48,
      y,
      size: 11,
      font: helv,
      color: ink,
    });
    page.drawText(`${tier.trigger}`, {
      x: 200,
      y,
      size: 10,
      font: helv,
      color: sub,
    });
    page.drawText(`$${tier.amount.toFixed(2)}`, {
      x: 460,
      y,
      size: 11,
      font: helvBold,
      color: ink,
    });
    y -= 18;
  }

  const total = (gig.payoutTiers ?? []).reduce(
    (s, t) => s + (t.label === "Stretch" ? t.amount : 0),
    0,
  );

  y -= 16;
  page.drawText("TOTAL", {
    x: 48,
    y,
    size: 11,
    font: helvBold,
    color: ink,
  });
  page.drawText(`$${total.toFixed(2)}`, {
    x: 460,
    y,
    size: 14,
    font: helvBold,
    color: red,
  });

  y -= 60;
  page.drawText(
    "Push reports payouts ≥ $600/year on a 1099-K. Keep this for your records.",
    {
      x: 48,
      y,
      size: 9,
      font: helv,
      color: sub,
    },
  );

  y -= 14;
  page.drawText(`Reference: ${gigId} · Generated ${new Date().toISOString()}`, {
    x: 48,
    y,
    size: 8,
    font: helv,
    color: sub,
  });

  const bytes = await pdf.save();

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="push-receipt-${gigId}.pdf"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
