import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement } from "react";

// ---------------------------------------------------------------------------
// Brand tokens — mirrors Design.md exactly, no new colors
// ---------------------------------------------------------------------------
export const BRAND = {
  flagRed: "#c1121f",
  moltenLava: "#780000",
  pearlStone: "#f5f2ec",
  deepSpaceBlue: "#003049",
  steelBlue: "#669bbc",
  champagneGold: "#c9a96e",
  graphite: "#4a5568",
} as const;

// ---------------------------------------------------------------------------
// Font loader — reads from public/fonts, returns ArrayBuffer
// Memoised at module level so multiple routes in the same request don't
// re-read from disk.
// ---------------------------------------------------------------------------
let _darkyBlack: ArrayBuffer | null = null;
let _genioMono: ArrayBuffer | null = null;

export async function loadFonts(): Promise<{
  darkyBlack: ArrayBuffer;
  genioMono: ArrayBuffer;
}> {
  const [darkyBlack, genioMono] = await Promise.all([
    _darkyBlack ??
      readFile(join(process.cwd(), "public/fonts/Darky-Black.ttf")).then(
        (b) => b.buffer as ArrayBuffer,
      ),
    _genioMono ??
      readFile(
        join(process.cwd(), "public/fonts/CSGenioMono-Regular.ttf"),
      ).then((b) => b.buffer as ArrayBuffer),
  ]);

  _darkyBlack = darkyBlack;
  _genioMono = genioMono;

  return { darkyBlack, genioMono };
}

// ---------------------------------------------------------------------------
// Shared ImageResponse fonts array — pass straight into ImageResponse options
// ---------------------------------------------------------------------------
export function buildFonts(darkyBlack: ArrayBuffer, genioMono: ArrayBuffer) {
  return [
    {
      name: "Darky",
      data: darkyBlack,
      weight: 900 as const,
      style: "normal" as const,
    },
    {
      name: "CSGenioMono",
      data: genioMono,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

// ---------------------------------------------------------------------------
// Shared OG JSX template
// Props:
//   title    — big Darky-900 headline, max ~3 lines
//   eyebrow  — small uppercase label shown bottom-right (category / handle)
//   accent   — optional left-side red bar (default: true)
//   bg       — background variant: "light" | "dark" (default: "light")
// ---------------------------------------------------------------------------
export interface OgTemplateProps {
  title: string;
  eyebrow?: string;
  accent?: boolean;
  bg?: "light" | "dark";
}

export function ogTemplate({
  title,
  eyebrow,
  accent = true,
  bg = "light",
}: OgTemplateProps): ReactElement {
  const isDark = bg === "dark";

  const surface = isDark ? BRAND.deepSpaceBlue : BRAND.pearlStone;
  const titleColor = isDark ? "#ffffff" : BRAND.deepSpaceBlue;
  const logoColor = isDark ? "rgba(255,255,255,0.55)" : BRAND.graphite;
  const eyebrowColor = isDark ? "rgba(255,255,255,0.35)" : `rgba(0,48,73,0.45)`;
  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : `rgba(0,48,73,0.12)`;

  // Clamp title: trim to ~72 chars + ellipsis if too long
  const displayTitle =
    title.length > 72 ? title.slice(0, 70).trimEnd() + "…" : title;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: surface,
        position: "relative",
        // No border-radius — sharp corners per Design.md
      }}
    >
      {/* ── Flag Red left accent bar ─────────────────────────── */}
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            background: BRAND.flagRed,
          }}
        />
      )}

      {/* ── Subtle ambient overlay (dark mode only) ──────────── */}
      {isDark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 55% at 90% 15%, rgba(102,155,188,0.12) 0%, transparent 65%)",
          }}
        />
      )}

      {/* ── Main content area ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          flex: 1,
          padding: accent ? "72px 80px 72px 104px" : "72px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Big title — Darky 900 */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            fontFamily: "Darky",
            color: titleColor,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            maxWidth: 960,
          }}
        >
          {displayTitle}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 64,
            height: 3,
            background: BRAND.flagRed,
            marginTop: 40,
          }}
        />

        {/* Bottom row: logo + eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: 40,
          }}
        >
          {/* push.nyc logo (bottom-left) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                fontFamily: "Darky",
                color: isDark ? "#ffffff" : BRAND.deepSpaceBlue,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Push
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 400,
                fontFamily: "CSGenioMono",
                color: logoColor,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              push.nyc
            </div>
          </div>

          {/* Category / handle eyebrow (bottom-right) */}
          {eyebrow && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 1,
                  height: 32,
                  background: dividerColor,
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: "CSGenioMono",
                  color: eyebrowColor,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
