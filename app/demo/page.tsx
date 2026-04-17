"use client";

import { useRouter } from "next/navigation";
import { enterDemoMode, exitDemoMode } from "@/lib/demo";

export default function DemoRolePicker() {
  const router = useRouter();

  function handleSelect(role: "creator" | "merchant") {
    const dest = role === "creator" ? "/demo/creator" : "/demo/merchant";
    enterDemoMode(role, dest);
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#f5f2ec",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 40px",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display, 'Darky', sans-serif)",
            fontSize: "28px",
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-0.06em",
            color: "#003049",
          }}
        >
          Push
        </span>
        <span
          style={{
            fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#c1121f",
            border: "1px solid #c1121f",
            padding: "4px 10px",
          }}
        >
          Demo
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(0,48,73,0.45)",
            marginBottom: "24px",
          }}
        >
          Interactive Preview
        </p>

        {/* Editorial headline */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Darky', sans-serif)",
            fontSize: "clamp(64px, 10vw, 140px)",
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-0.06em",
            color: "#003049",
            lineHeight: 0.9,
            marginBottom: "56px",
          }}
        >
          Who are
          <br />
          you today?
        </h1>

        {/* Role cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2px",
            background: "rgba(0,48,73,0.12)",
          }}
        >
          {/* Creator card */}
          <button
            onClick={() => handleSelect("creator")}
            style={{
              background: "#003049",
              border: "none",
              padding: "56px 48px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c1121f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#003049")}
          >
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245,242,236,0.45)",
              }}
            >
              01 — Creator
            </span>
            <span
              style={{
                fontFamily: "var(--font-display, 'Darky', sans-serif)",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.05em",
                color: "#f5f2ec",
                lineHeight: 0.95,
                display: "block",
              }}
            >
              I am a
              <br />
              Creator
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "13px",
                color: "rgba(245,242,236,0.55)",
                lineHeight: 1.5,
                maxWidth: "280px",
              }}
            >
              Browse campaigns, apply, earn — see your dashboard, earnings, and
              analytics.
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#f5f2ec",
                marginTop: "8px",
              }}
            >
              Enter &rarr;
            </span>
          </button>

          {/* Merchant card */}
          <button
            onClick={() => handleSelect("merchant")}
            style={{
              background: "#f5f2ec",
              border: "none",
              padding: "56px 48px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c9a96e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f2ec")}
          >
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(0,48,73,0.4)",
              }}
            >
              02 — Merchant
            </span>
            <span
              style={{
                fontFamily: "var(--font-display, 'Darky', sans-serif)",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.05em",
                color: "#003049",
                lineHeight: 0.95,
                display: "block",
              }}
            >
              I am a
              <br />
              Merchant
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "13px",
                color: "rgba(0,48,73,0.55)",
                lineHeight: 1.5,
                maxWidth: "280px",
              }}
            >
              Post campaigns, review creator applications, track ROI and
              attribution.
            </span>
            <span
              style={{
                fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#003049",
                marginTop: "8px",
              }}
            >
              Enter &rarr;
            </span>
          </button>
        </div>

        {/* Exit demo */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <button
            onClick={() => exitDemoMode()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
              fontSize: "12px",
              color: "rgba(0,48,73,0.4)",
              letterSpacing: "0.04em",
              padding: 0,
              textDecoration: "underline",
              textDecorationColor: "rgba(0,48,73,0.2)",
              textUnderlineOffset: "3px",
            }}
          >
            Exit demo
          </button>
          <span
            style={{
              fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
              fontSize: "11px",
              color: "rgba(0,48,73,0.3)",
              letterSpacing: "0.02em",
            }}
          >
            Sample data only — no real transactions
          </span>
        </div>
      </div>
    </div>
  );
}
