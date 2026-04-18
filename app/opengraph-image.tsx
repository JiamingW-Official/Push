import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push — Vertical AI for Local Commerce";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OGImage() {
  const { darkyBlack, genioMono } = await loadFonts();

  return new ImageResponse(
    ogTemplate({
      title: "Tell us how many customers you need. We deliver.",
      eyebrow: "Vertical AI for Local Commerce",
      accent: true,
      bg: "dark",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
