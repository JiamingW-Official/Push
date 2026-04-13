import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Push — Turn Creators into Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "72px 80px",
        background: "#003049",
        position: "relative",
      }}
    >
      {/* Ambient gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(102,155,188,0.15) 0%, transparent 65%)",
        }}
      />

      {/* Logo badge */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            fontFamily: "serif",
          }}
        >
          Push
        </div>
        <div
          style={{
            width: 1,
            height: 16,
            background: "rgba(255,255,255,0.2)",
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          NYC&apos;s Local Creator Marketplace
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontFamily: "serif",
          }}
        >
          Turn creators
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 200,
            color: "rgba(255,255,255,0.35)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontFamily: "serif",
          }}
        >
          into{" "}
          <span style={{ color: "#c1121f", fontWeight: 900 }}>results.</span>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div
        style={{
          display: "flex",
          gap: 48,
          marginTop: 48,
          paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          { num: "$19.99", label: "Merchant entry / mo" },
          { num: "6", label: "Creator tiers" },
          { num: "24h", label: "Campaign live" },
        ].map((s) => (
          <div
            key={s.num}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 200,
                color: "#ffffff",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontFamily: "serif",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
