"use client";
import Link from "next/link";

export default function DemoLanding() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#003049",
        padding: "40px 24px",
        gap: "0",
      }}
    >
      {/* Push wordmark */}
      <div
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#f5f2ec",
          lineHeight: 1,
          marginBottom: "16px",
        }}
      >
        Push
      </div>

      {/* Red accent line */}
      <div
        style={{
          width: "48px",
          height: "3px",
          background: "#c1121f",
          marginBottom: "32px",
        }}
      />

      {/* Demo environment badge */}
      <div
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#c1121f",
          border: "1px solid #c1121f",
          padding: "4px 12px",
          marginBottom: "40px",
        }}
      >
        Demo Environment
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.04em",
          color: "#f5f2ec",
          textAlign: "center",
          marginBottom: "16px",
          lineHeight: 1.1,
        }}
      >
        Choose your perspective
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "13px",
          color: "rgba(245,242,236,0.55)",
          textAlign: "center",
          maxWidth: "380px",
          lineHeight: 1.6,
          marginBottom: "48px",
          letterSpacing: "0.02em",
        }}
      >
        Explore the Push platform without an account. Select a role to enter a
        live preview — no signup required.
      </p>

      {/* Role buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <Link href="/demo/creator" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#c1121f",
              color: "#f5f2ec",
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#780000")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#c1121f")}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Darky', sans-serif)",
                fontSize: "20px",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Preview as Creator
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,242,236,0.65)",
              }}
            >
              Campaigns, earnings, analytics
            </span>
          </div>
        </Link>

        <Link href="/demo/merchant" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "transparent",
              color: "#f5f2ec",
              padding: "20px 32px",
              border: "1px solid rgba(245,242,236,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,242,236,0.6)";
              e.currentTarget.style.background = "rgba(245,242,236,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,242,236,0.25)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Darky', sans-serif)",
                fontSize: "20px",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Preview as Merchant
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,242,236,0.45)",
              }}
            >
              Campaigns, applications, ROI
            </span>
          </div>
        </Link>

        <Link
          href="/scan/demo-blank-street-001"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "transparent",
              color: "#f5f2ec",
              padding: "20px 32px",
              border: "1px solid rgba(245,242,236,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,242,236,0.45)";
              e.currentTarget.style.background = "rgba(245,242,236,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,242,236,0.15)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Darky', sans-serif)",
                fontSize: "20px",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Preview as Customer
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,242,236,0.35)",
              }}
            >
              QR scan &rarr; visit confirmation
            </span>
          </div>
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(245,242,236,0.25)",
          marginTop: "48px",
          textAlign: "center",
        }}
      >
        Demo data only &mdash; no real transactions
      </p>
    </div>
  );
}
