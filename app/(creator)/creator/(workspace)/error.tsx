"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Workspace Error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
        }}
      >
        {/* Error icon */}
        <div
          style={{
            width: 48,
            height: 48,
            background: "rgba(193, 18, 31, 0.08)",
            border: "1.5px solid rgba(193, 18, 31, 0.3)",
            borderRadius: "var(--r-sm)",
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
            stroke="var(--brand-red)"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}
        >
          Something went wrong
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: "var(--graphite)",
            margin: "0 0 32px 0",
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred in your workspace. Your data is safe —
          try refreshing or return to the dashboard.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              height: 40,
              padding: "0 20px",
              background: "var(--brand-red)",
              color: "var(--snow)",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-body)",
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
              color: "var(--ink)",
              border: "1px solid var(--ink)",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-body)",
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
