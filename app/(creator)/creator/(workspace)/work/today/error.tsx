"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function TodayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Today Error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f2ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "'CS Genio Mono', monospace",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "rgba(193, 18, 31, 0.08)",
            border: "1.5px solid rgba(193, 18, 31, 0.3)",
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c1121f"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "'Darky', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#003049",
            letterSpacing: "-0.02em",
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}
        >
          Today couldn&apos;t load
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#4a5568",
            margin: "0 0 32px 0",
            lineHeight: 1.6,
          }}
        >
          We couldn&apos;t load your tasks for today. Your schedule data is safe
          — try again or head back to the dashboard.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              height: 40,
              padding: "0 20px",
              background: "#c1121f",
              color: "#ffffff",
              border: "none",
              borderRadius: 0,
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Try again
          </button>

          <Link
            href="/creator/dashboard"
            style={{
              height: 40,
              padding: "0 20px",
              background: "transparent",
              color: "#003049",
              border: "1.5px solid rgba(0, 48, 73, 0.25)",
              borderRadius: 0,
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
