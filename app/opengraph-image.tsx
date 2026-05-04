import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push — Pay Per Verified Visit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const { darkyBlack, genioMono } = await loadFonts();

  return new ImageResponse(
    ogTemplate({
      title: "The Attribution Rail for Local Commerce",
      eyebrow: "Pay Per Verified Visit",
      accent: true,
      bg: "dark",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
