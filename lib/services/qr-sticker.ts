/**
 * QR sticker PDF generator.
 *
 * Outputs a print-ready PDF sticker for a merchant / campaign QR code in
 * one of three paper sizes (A5, A6, and a small 75×100 mm label).
 *
 * Design alignment (Design.md):
 *   - Background uses Pearl Stone #f5f2ec (light surface color).
 *   - Headline "SCAN TO CLAIM" in Flag Red #c1121f, Darky-substitute (Helvetica-Bold).
 *   - Body / attribution in CS Genio Mono-substitute (Courier).
 *   - Square frames, zero border-radius, 8px-grid inset.
 *   - QR code uses error-correction level H (handles print scratches).
 *
 * Real Darky / Genio Mono TTFs are not embedded yet — swap StandardFonts
 * for pdf.embedFont(readFileSync('public/fonts/Darky.ttf')) when the
 * licensed webfonts are available server-side.
 */
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export type StickerSize = "A5" | "A6" | "small";

// Points (1/72 inch). A5 = 148x210 mm, A6 = 105x148 mm, small = 75x100 mm.
const SIZES: Record<StickerSize, { w: number; h: number }> = {
  A5: { w: 419.53, h: 595.28 },
  A6: { w: 297.64, h: 419.53 },
  small: { w: 212.6, h: 283.46 },
};

// Design.md palette
const COLOR_PEARL_STONE = rgb(0xf5 / 255, 0xf2 / 255, 0xec / 255);
const COLOR_FLAG_RED = rgb(0xc1 / 255, 0x12 / 255, 0x1f / 255);
const COLOR_DEEP_SPACE = rgb(0x00 / 255, 0x30 / 255, 0x49 / 255);
const COLOR_GRAPHITE = rgb(0.35, 0.35, 0.35);
const COLOR_MUTED = rgb(0.55, 0.55, 0.55);

export interface StickerInput {
  /** Absolute URL the QR encodes, e.g. https://pushnyc.co/scan/qr-abc123 */
  qrUrl: string;
  /** Campaign title shown below QR (keep under ~40 chars). */
  campaignTitle: string;
  /** Merchant name shown as secondary line. */
  businessName: string;
  /** Paper size. Defaults to A6 (table-tent size). */
  size?: StickerSize;
}

/**
 * Render a sticker PDF. Returns raw PDF bytes suitable for piping into
 * a Response body with `content-type: application/pdf`.
 */
export async function generateStickerPDF({
  qrUrl,
  campaignTitle,
  businessName,
  size = "A6",
}: StickerInput): Promise<Uint8Array> {
  const dims = SIZES[size];
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([dims.w, dims.h]);

  // Pearl Stone background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: dims.w,
    height: dims.h,
    color: COLOR_PEARL_STONE,
  });

  // Flag Red top band (8px grid → 24pt)
  const bandH = 24;
  page.drawRectangle({
    x: 0,
    y: dims.h - bandH,
    width: dims.w,
    height: bandH,
    color: COLOR_FLAG_RED,
  });

  // QR code PNG (buffer for pdf-lib embedPng)
  const qrPngBuffer = await QRCode.toBuffer(qrUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 800,
    color: { dark: "#000000", light: "#ffffff" },
  });
  const qrImg = await pdf.embedPng(qrPngBuffer);

  const qrSide = Math.min(dims.w * 0.62, dims.h * 0.48);
  const qrX = (dims.w - qrSide) / 2;
  const qrY = dims.h * 0.28;
  page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSide, height: qrSide });

  // Darky-substitute (Helvetica-Bold) for display text
  const darkyFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  // CS Genio Mono-substitute (Courier) for body / meta
  const monoFont = await pdf.embedFont(StandardFonts.Courier);

  // Headline "SCAN TO CLAIM" centered above the QR
  const headline = "SCAN TO CLAIM";
  const headlineSize = dims.w * 0.075;
  const headlineW = darkyFont.widthOfTextAtSize(headline, headlineSize);
  page.drawText(headline, {
    x: (dims.w - headlineW) / 2,
    y: dims.h - bandH - headlineSize - 20,
    size: headlineSize,
    font: darkyFont,
    color: COLOR_DEEP_SPACE,
  });

  // Campaign title centered below QR (truncate long titles)
  const safeCampaign =
    campaignTitle.length > 42
      ? campaignTitle.slice(0, 40).trimEnd() + "…"
      : campaignTitle;
  const campaignSize = dims.w * 0.038;
  const campaignW = darkyFont.widthOfTextAtSize(safeCampaign, campaignSize);
  page.drawText(safeCampaign, {
    x: (dims.w - campaignW) / 2,
    y: qrY - campaignSize - 12,
    size: campaignSize,
    font: darkyFont,
    color: COLOR_DEEP_SPACE,
  });

  // Business name (Courier / mono)
  const bizSize = dims.w * 0.025;
  const bizW = monoFont.widthOfTextAtSize(businessName, bizSize);
  page.drawText(businessName, {
    x: (dims.w - bizW) / 2,
    y: qrY - campaignSize - bizSize - 20,
    size: bizSize,
    font: monoFont,
    color: COLOR_GRAPHITE,
  });

  // Footer attribution — Push brand + required FTC-style line
  const footer = "Powered by Push — community attribution";
  const footerSize = dims.w * 0.022;
  const footerW = monoFont.widthOfTextAtSize(footer, footerSize);
  page.drawText(footer, {
    x: (dims.w - footerW) / 2,
    y: 18,
    size: footerSize,
    font: monoFont,
    color: COLOR_MUTED,
  });

  return pdf.save();
}
