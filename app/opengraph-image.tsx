import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push — AI-Powered Customer Acquisition Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const { darkyBlack, genioMono } = await loadFonts();

  return new ImageResponse(
    ogTemplate({
      title: "Tell us how many customers you need. We deliver.",
      eyebrow: "AI-Powered Customer Acquisition Agency",
      accent: true,
      bg: "dark",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
