"use client";
// PhotoCard — v11 Marketing-only pattern (Design.md § 8.7 + § 8.9.6)
// 4:5 or 1:1 image, 35% bottom gradient overlay, Darky title + mono metadata
// Optional FloatingBadge top-right (Liquid Glass use case 5, § 8.9.6)

import Link from "next/link";

interface PhotoCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  metadata?: string;
  /** Optional badge text — max 1 token */
  badge?: string;
  aspect?: "4/5" | "1/1";
  href?: string;
  className?: string;
}

export function PhotoCard({
  imageSrc,
  imageAlt,
  title,
  metadata,
  badge,
  aspect = "4/5",
  href,
  className = "",
}: PhotoCardProps) {
  const inner = (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--r-md)",
        cursor: "pointer",
        aspectRatio: aspect,
        display: "block",
      }}
    >
      {/* Full-bleed image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* 35% bottom gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "35%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.78) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Optional Liquid Glass badge — top-right (§ 8.9.6) */}
      {badge && (
        <span
          className="lg-surface--badge"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "8px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      )}

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(16px, 3vw, 24px)",
          pointerEvents: "none",
        }}
      >
        {/* Darky 20px 700 title */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--snow)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </p>

        {/* CS Genio Mono metadata */}
        {metadata && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            {metadata}
          </p>
        )}
      </div>
    </div>
  );

  // Wrap in Link when href provided, otherwise div
  if (href) {
    return (
      <Link
        href={href}
        className={`click-shift${className ? ` ${className}` : ""}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={`click-shift${className ? ` ${className}` : ""}`}>
      {inner}
    </div>
  );
}
