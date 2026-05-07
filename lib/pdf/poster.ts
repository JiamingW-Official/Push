import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

import type { AttributionLocation } from "@/lib/attribution/queries";
import type {
  PosterType,
  QRCodeRecord,
} from "@/lib/attribution/mock-qr-codes-extended";

// Poster size matrix in PDF points (72 dpi).
// a4 = 210×297 mm — printed wall poster
// table-tent = 4×6" — bar / counter
// window-sticker = 8×8" — storefront window decal
// cash-register = 3×3" — POS sticker
const SIZE_POINTS: Record<
  PosterType,
  { width: number; height: number; qrSize: number }
> = {
  a4: { width: 595, height: 842, qrSize: 220 },
  "table-tent": { width: 288, height: 432, qrSize: 132 },
  "window-sticker": { width: 576, height: 576, qrSize: 220 },
  "cash-register": { width: 216, height: 216, qrSize: 96 },
};

function decodeDataUrl(dataUrl: string) {
  const [, base64] = dataUrl.split(",");
  return Buffer.from(base64, "base64");
}

export async function renderPosterPdf(input: {
  qr: QRCodeRecord;
  campaign: { title: string };
  hero_offer: string | null;
  applicable_locations: AttributionLocation[];
  size: PosterType;
}) {
  const doc = await PDFDocument.create();
  const { width, height, qrSize } = SIZE_POINTS[input.size];
  const page = doc.addPage([width, height]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  // Push v11 surface tone — warm cream background.
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.96, 0.95, 0.93),
  });

  page.drawText(input.campaign.title, {
    x: 32,
    y: height - 72,
    size: input.size === "cash-register" ? 14 : 22,
    font: bold,
    color: rgb(0.0, 0.19, 0.29),
    maxWidth: width - 64,
  });

  page.drawText(input.qr.hero_message, {
    x: 32,
    y: height - 116,
    size: input.size === "cash-register" ? 11 : 18,
    font: bold,
    color: rgb(0.76, 0.07, 0.12),
    maxWidth: width - 64,
    lineHeight: 20,
  });

  if (input.hero_offer) {
    page.drawText(`Offer: ${input.hero_offer}`, {
      x: 32,
      y: height - 148,
      size: input.size === "cash-register" ? 9 : 12,
      font: regular,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: width - 64,
      lineHeight: 14,
    });
  }

  const qrDataUrl = await QRCode.toDataURL(input.qr.scan_url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: qrSize,
    color: { dark: "#003049", light: "#FFFFFF" },
  });
  const png = await doc.embedPng(decodeDataUrl(qrDataUrl));
  page.drawImage(png, {
    x: (width - qrSize) / 2,
    y: height / 2 - qrSize / 2,
    width: qrSize,
    height: qrSize,
  });

  page.drawText(input.qr.sub_message, {
    x: 32,
    y: height / 2 - qrSize / 2 - 28,
    size: input.size === "cash-register" ? 8 : 11,
    font: regular,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 64,
    lineHeight: 14,
  });

  const footerLocations = input.applicable_locations.length
    ? input.applicable_locations.map((location) => location.name).join(", ")
    : "All campaign locations";

  page.drawText(`Applicable at: ${footerLocations}`, {
    x: 24,
    y: 24,
    size: input.size === "cash-register" ? 7 : 10,
    font: regular,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 48,
    lineHeight: 12,
  });

  return Buffer.from(await doc.save());
}
