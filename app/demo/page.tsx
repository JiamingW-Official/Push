"use client";

import { enterDemoMode, type DemoAudience } from "@/lib/demo";
import { DEMO_AUDIENCES } from "@/lib/nav/registry";

export default function DemoRolePicker() {
  function handleSelect(role: DemoAudience, dest: string) {
    enterDemoMode(role, dest);
  }

  return (
    <div style={S.page}>
      <header style={S.topBar}>
        <span style={S.brand}>Push</span>
        <span style={S.brandTag}>Demo</span>
      </header>

      <main style={S.main}>
        <p style={S.eyebrow}>Playtest without sign-up</p>
        <h1 style={S.title}>Who are you today?</h1>
        <p style={S.lede}>
          Pick an audience — every portal walks its real flow but actions are
          simulated. Exit or switch roles anytime from the top banner.
        </p>

        <div style={S.grid}>
          {DEMO_AUDIENCES.map((opt) => (
            <button
              key={opt.role}
              type="button"
              onClick={() => handleSelect(opt.role, opt.dest)}
              style={{ ...S.card, borderColor: opt.accent }}
            >
              <span style={{ ...S.cardTag, background: opt.accent }}>
                {opt.role.toUpperCase()}
              </span>
              <span style={S.cardLabel}>{opt.label}</span>
              <span style={S.cardBlurb}>{opt.blurb}</span>
              <span style={S.cardArrow}>→</span>
            </button>
          ))}
        </div>

        <p style={S.footNote}>
          All demo data is local + simulated. Switching roles or exiting clears
          the demo cookie. The real product (sign-up + real merchants) lives at{" "}
          <a href="/for-merchants" style={S.footLink}>
            /for-merchants
          </a>{" "}
          and{" "}
          <a href="/for-creators" style={S.footLink}>
            /for-creators
          </a>
          .
        </p>
      </main>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100svh",
    background: "#f5f2ec",
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 40px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
  } as React.CSSProperties,
  brand: {
    fontFamily: "var(--font-display, 'Darky', sans-serif)",
    fontSize: "28px",
    fontWeight: 900,
    fontStyle: "italic" as const,
    letterSpacing: "-0.06em",
    color: "#003049",
  } as React.CSSProperties,
  brandTag: {
    fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#c1121f",
    border: "1px solid #c1121f",
    padding: "4px 10px",
  } as React.CSSProperties,
  main: {
    flex: 1,
    maxWidth: "1080px",
    width: "100%",
    margin: "0 auto",
    padding: "64px 40px",
  } as React.CSSProperties,
  eyebrow: {
    fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#c1121f",
    marginBottom: "16px",
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-display, 'Darky', sans-serif)",
    fontSize: "clamp(36px, 7vw, 64px)",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#003049",
    marginBottom: "16px",
    lineHeight: 1.05,
  } as React.CSSProperties,
  lede: {
    fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
    fontSize: "15px",
    color: "#003049",
    opacity: 0.75,
    maxWidth: "640px",
    lineHeight: 1.5,
    marginBottom: "48px",
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "48px",
  } as React.CSSProperties,
  card: {
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: "12px",
    padding: "24px",
    background: "#ffffff",
    border: "2px solid",
    borderRadius: 0,
    cursor: "pointer",
    textAlign: "left" as const,
    fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  } as React.CSSProperties,
  cardTag: {
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#ffffff",
  } as React.CSSProperties,
  cardLabel: {
    fontFamily: "var(--font-display, 'Darky', sans-serif)",
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#003049",
  } as React.CSSProperties,
  cardBlurb: {
    fontSize: "13px",
    color: "#003049",
    opacity: 0.72,
    lineHeight: 1.5,
  } as React.CSSProperties,
  cardArrow: {
    marginTop: "auto",
    fontSize: "24px",
    fontWeight: 800,
    color: "#c1121f",
  } as React.CSSProperties,
  footNote: {
    fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
    fontSize: "12px",
    color: "#003049",
    opacity: 0.6,
    maxWidth: "640px",
    lineHeight: 1.5,
  } as React.CSSProperties,
  footLink: {
    color: "#c1121f",
    textDecoration: "underline",
  } as React.CSSProperties,
};
