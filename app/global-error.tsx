"use client";

/**
 * v11 Global Error Boundary — last-resort fallback.
 *
 * Next.js semantics: only renders when an error escapes every nested
 * error.tsx (including the root error.tsx). Must define its own
 * <html>/<body> because layouts are unavailable at this level — and
 * crucially, must work WITHOUT globals.css since the global stylesheet
 * may itself have failed to load.
 *
 * Strategy: 100% inline styles, no token dependencies, no external
 * fonts, no SVG. Brand-red accent + warm ivory bg + Push logo. Robust,
 * fail-safe, and still on-brand.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Push v11 hex literals — duplicated here intentionally because globals.css
  // tokens may not be available at this level.
  const ink = "#0a0a0a";
  const ink3 = "#61605c";
  const ink4 = "#8a8a86";
  const surface = "#f8f4e8";
  const surface2 = "#f5f3ee";
  const surface3 = "#ece9e0";
  const mist = "#d8d4c8";
  const brandRed = "#c1121f";
  const brandRedDeep = "#9b0e19";
  const champagne = "#bfa170";
  const snow = "#ffffff";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: `radial-gradient(ellipse 900px 600px at 88% 8%, rgba(193, 18, 31, 0.10), transparent 55%), radial-gradient(ellipse 700px 500px at 5% 95%, rgba(191, 161, 112, 0.18), transparent 60%), linear-gradient(180deg, ${surface} 0%, ${surface} 60%, ${surface2} 100%)`,
          color: ink3,
          fontFamily:
            "'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "16px",
          lineHeight: 1.55,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <main
          role="alert"
          aria-live="assertive"
          style={{
            maxWidth: "560px",
            width: "100%",
            background: snow,
            border: `1px solid ${mist}`,
            borderRadius: "10px",
            boxShadow:
              "0 8px 24px rgba(10,10,10,0.08), 0 2px 6px rgba(10,10,10,0.05)",
            padding: "40px 32px",
          }}
        >
          {/* Eyebrow with pulse dot */}
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: brandRed,
              margin: "0 0 24px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                background: brandRed,
                borderRadius: "50%",
              }}
            />
            <span>(CRITICAL · APP CRASHED)</span>
          </p>

          {/* H1 — Darky-style display, falls back gracefully without custom font */}
          <h1
            style={{
              fontFamily: "'Darky', 'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: ink,
              margin: "0 0 16px",
            }}
          >
            Push hit a wall.
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.55,
              color: ink3,
              margin: "0 0 24px",
            }}
          >
            Something broke deep enough that even our error page failed to
            render. Push Ops was notified. Your data is safe — no payouts or
            verifications were affected.
          </p>

          {error?.digest && (
            <div
              style={{
                background: surface3,
                borderLeft: `3px solid ${brandRed}`,
                padding: "12px 16px",
                marginBottom: "24px",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: champagne,
                  fontSize: "10px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Reference
              </span>
              <code
                style={{
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: ink,
                }}
              >
                {error.digest}
              </code>
            </div>
          )}

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "14px 28px",
                background: brandRed,
                color: snow,
                border: "none",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                lineHeight: 1,
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  brandRedDeep;
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  brandRed;
              }}
            >
              Reload
            </button>
            <a
              href="/"
              style={{
                padding: "14px 28px",
                background: "transparent",
                color: ink,
                border: `1px solid ${ink}`,
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              Home
            </a>
          </div>

          {/* Footer reassurance */}
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "0.04em",
              color: ink4,
              margin: 0,
              paddingTop: "16px",
              borderTop: `1px solid ${mist}`,
            }}
          >
            Push · Pay per verified visit · If this keeps happening,{" "}
            <a
              href="mailto:hello@pushnyc.co"
              style={{
                color: ink,
                textDecoration: "underline",
                textDecorationColor: mist,
              }}
            >
              email hello@pushnyc.co
            </a>
            {error?.digest ? ` (ref: ${error.digest})` : ""}.
          </p>
        </main>
      </body>
    </html>
  );
}
