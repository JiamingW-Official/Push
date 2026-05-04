"use client";

/**
 * Root error boundary. Replaces Next.js's default white screen with a
 * Push-branded fallback that keeps the visitor on-site and gives them a
 * route back into the functional product.
 *
 * Next 15+ semantics: this file is ONLY rendered when an error escapes
 * every nested error.tsx. It must define its own <html> / <body> because
 * layouts are unavailable at this level.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          background: "#f5f2ec",
          color: "var(--ink)",
          fontFamily:
            "var(--font-body, 'CS Genio Mono', 'Courier New', monospace)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            padding: "32px",
            background: "#ffffff",
            border: "2px solid #c1121f",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#c1121f",
              marginBottom: "12px",
            }}
          >
            Error · Push
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Darky', sans-serif)",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            Something broke here.
          </h1>
          <p style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.8 }}>
            We caught an unhandled error and kept you on-site. If you were in
            the middle of a demo walk, <code>Retry</code> usually works. If this
            keeps happening, email{" "}
            <a
              href="mailto:support@pushnyc.co"
              style={{ color: "#c1121f", textDecoration: "underline" }}
            >
              support@pushnyc.co
            </a>{" "}
            with the digest below — it correlates with server logs.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#f5f2ec",
                border: "1px solid rgba(10,10,10,0.12)",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
            >
              digest: <code>{error.digest}</code>
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                background: "#c1121f",
                color: "#f5f2ec",
                border: "none",
                fontFamily: "inherit",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
            <a
              href="/"
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                fontFamily: "inherit",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Home
            </a>
            <a
              href="/demo"
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                fontFamily: "inherit",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Demo
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
