"use client";

import type { PosterType } from "@/lib/attribution/mock-qr-codes-extended";
import { BRAND } from "@/lib/constants/brand";

// TODO: use server-side QR generation
function QRImage({ qrId, size }: { qrId: string; size: number }) {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://app.pushnyc.com";
  const url = encodeURIComponent(`${origin}/scan/${qrId}`);
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=${size}x${size}&color=003049&bgcolor=ffffff`}
      alt="QR Code"
      width={size}
      height={size}
      style={{
        display: "block",
        imageRendering: "pixelated",
        border: "none",
      }}
    />
  );
}

// Inline SVG grid placeholder used when qrId is not yet generated
function QRPlaceholder({ size }: { size: number }) {
  const cells = 7;
  const cell = size / cells;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      {Array.from({ length: cells }).map((_, row) =>
        Array.from({ length: cells }).map((_, col) => {
          const isCorner =
            (row < 2 && col < 2) ||
            (row < 2 && col >= cells - 2) ||
            (row >= cells - 2 && col < 2);
          const fill =
            isCorner || (row % 2 === 0 && col % 2 === 0)
              ? "#003049"
              : "#f5f2ec";
          return (
            <rect
              key={`${row}-${col}`}
              x={col * cell}
              y={row * cell}
              width={cell - 1}
              height={cell - 1}
              fill={fill}
            />
          );
        }),
      )}
    </svg>
  );
}

type PosterPreviewProps = {
  posterType: PosterType;
  heroMessage: string;
  subMessage: string;
  campaignName: string;
  qrId?: string;
};

// A4 Poster: large hero text + centered QR + sub + Push logo
function A4Layout({
  heroMessage,
  subMessage,
  qrId,
}: Omit<PosterPreviewProps, "posterType" | "campaignName">) {
  return (
    <div
      className="poster-a4"
      style={{
        width: "100%",
        aspectRatio: "210/297",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px 32px 28px",
        border: "1px solid rgba(10,10,10,0.12)",
        boxSizing: "border-box",
      }}
    >
      {/* Hero text block */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(22px,6vw,40px)",
            letterSpacing: "-0.04em",
            color: "var(--ink)",
            lineHeight: 1.05,
            marginBottom: 8,
          }}
        >
          {heroMessage}
        </div>
      </div>

      {/* QR centered */}
      <div
        style={{
          background: "var(--surface-2)",
          padding: 16,
          border: "1px solid rgba(10,10,10,0.12)",
        }}
      >
        {qrId ? (
          <QRImage qrId={qrId} size={160} />
        ) : (
          <QRPlaceholder size={160} />
        )}
      </div>

      {/* Sub text */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "rgba(10,10,10,0.6)",
          textAlign: "center",
          letterSpacing: "0.04em",
          lineHeight: 1.5,
          maxWidth: "80%",
        }}
      >
        {subMessage}
      </div>

      {/* Push logo footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderTop: "1px solid rgba(10,10,10,0.1)",
          paddingTop: 12,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--ink)",
            letterSpacing: "-0.04em",
          }}
        >
          {BRAND.name}
          <span style={{ color: "var(--brand-red)" }}>.</span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            color: "rgba(10,10,10,0.45)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {BRAND.posterTagline}
        </span>
      </div>
    </div>
  );
}

// Table Tent 4×6": compact vertical
function TableTentLayout({
  heroMessage,
  subMessage,
  qrId,
}: Omit<PosterPreviewProps, "posterType" | "campaignName">) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4/6",
        background: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        gap: 16,
        border: "1px solid rgba(10,10,10,0.12)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(16px,4vw,28px)",
          color: "var(--surface)",
          textAlign: "center",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
        }}
      >
        {heroMessage}
      </div>
      <div style={{ background: "var(--surface-2)", padding: 10 }}>
        {qrId ? (
          <QRImage qrId={qrId} size={120} />
        ) : (
          <QRPlaceholder size={120} />
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 9,
          color: "rgba(245,242,236,0.6)",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {subMessage}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 14,
          color: "var(--surface)",
          letterSpacing: "-0.04em",
        }}
      >
        {BRAND.name}
        <span style={{ color: "var(--brand-red)" }}>.</span>
      </div>
    </div>
  );
}

// Window Sticker 8×8": square, QR centered
function WindowStickerLayout({
  heroMessage,
  subMessage,
  qrId,
}: Omit<PosterPreviewProps, "posterType" | "campaignName">) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1/1",
        background: "var(--surface-2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 12,
        border: "2px solid var(--ink)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(14px,3vw,22px)",
          color: "var(--ink)",
          textAlign: "center",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
        }}
      >
        {heroMessage}
      </div>
      <div
        style={{
          background: "var(--surface)",
          padding: 12,
          border: "1px solid rgba(10,10,10,0.15)",
        }}
      >
        {qrId ? (
          <QRImage qrId={qrId} size={140} />
        ) : (
          <QRPlaceholder size={140} />
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 9,
          color: "rgba(10,10,10,0.55)",
          textAlign: "center",
          letterSpacing: "0.05em",
        }}
      >
        {subMessage}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 13,
          color: "var(--ink)",
          letterSpacing: "-0.04em",
        }}
      >
        {BRAND.name}
        <span style={{ color: "var(--brand-red)" }}>.</span>
      </div>
    </div>
  );
}

// Cash Register 3×3": ultra-minimal, just QR + "Scan to earn"
function CashRegisterLayout({ qrId }: { qrId?: string }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1/1",
        background: "var(--surface-2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        gap: 10,
        border: "1px solid rgba(10,10,10,0.2)",
        boxSizing: "border-box",
      }}
    >
      {qrId ? <QRImage qrId={qrId} size={120} /> : <QRPlaceholder size={120} />}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--ink)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Scan to earn
      </div>
    </div>
  );
}

export default function PosterPreview({
  posterType,
  heroMessage,
  subMessage,
  campaignName,
  qrId,
}: PosterPreviewProps) {
  const props = { heroMessage, subMessage, campaignName, qrId };

  return (
    <div className="poster-preview-wrapper">
      {posterType === "a4" && <A4Layout {...props} />}
      {posterType === "table-tent" && <TableTentLayout {...props} />}
      {posterType === "window-sticker" && <WindowStickerLayout {...props} />}
      {posterType === "cash-register" && <CashRegisterLayout qrId={qrId} />}
    </div>
  );
}
