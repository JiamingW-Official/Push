/** Editorial empty state with Darky-900 title, generous whitespace, left-aligned. */
"use client";

import React from "react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}

export function EmptyState({ title, subtitle, cta }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "var(--space-10) 0",
        gap: "var(--space-3)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(40px, 6vw, 80px)",
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "var(--dark)",
          margin: 0,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            color: "var(--text-muted)",
            margin: 0,
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}

      {cta && <div style={{ marginTop: "var(--space-2)" }}>{cta}</div>}
    </div>
  );
}
