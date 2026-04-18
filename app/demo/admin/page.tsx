"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PREVIEW_ITEMS = [
  { n: "01", label: "Push Ops console" },
  { n: "02", label: "AI Verifications queue" },
  { n: "03", label: "DisclosureBot audit trail" },
  { n: "04", label: "Cohort + finance + fraud" },
];

// Sets the push-demo-role=admin cookie and redirects to the admin console.
// Entry point: /demo/admin
export default function DemoAdminEntry() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.cookie = "push-demo-role=admin; path=/; max-age=86400";
    const tick = setInterval(
      () => setStep((s) => (s < PREVIEW_ITEMS.length - 1 ? s + 1 : s)),
      300,
    );
    const jump = setTimeout(() => {
      router.push("/admin");
    }, 1400);
    return () => {
      clearInterval(tick);
      clearTimeout(jump);
    };
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#003049",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "32px 24px",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#c9a96e",
          marginBottom: "24px",
        }}
      >
        Push · Ops Console Preview
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(48px, 9vw, 104px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#f5f2ec",
          lineHeight: 1,
          margin: "0 0 32px",
          textAlign: "center",
        }}
      >
        <span>Push</span>
        <span style={{ color: "#c1121f" }}>.</span>
      </h1>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
          maxWidth: 440,
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: 13,
          color: "#f5f2ec",
        }}
      >
        {PREVIEW_ITEMS.map((item, i) => {
          const active = i <= step;
          return (
            <li
              key={item.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                borderLeft: `2px solid ${active ? "#c9a96e" : "rgba(245,242,236,0.1)"}`,
                color: active ? "#f5f2ec" : "rgba(245,242,236,0.35)",
                transition: "color 200ms ease, border-color 200ms ease",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: active ? "#c9a96e" : "rgba(245,242,236,0.3)",
                  letterSpacing: "0.08em",
                  minWidth: 24,
                }}
              >
                {item.n}
              </span>
              <span>{item.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>
                {active ? "✓" : "·"}
              </span>
            </li>
          );
        })}
      </ul>

      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "rgba(245,242,236,0.35)",
          marginTop: 40,
        }}
      >
        Internal preview · Vertical AI for Local Commerce
      </p>
    </div>
  );
}
