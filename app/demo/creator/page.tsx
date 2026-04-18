"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enterDemoMode } from "@/lib/demo";

const PREVIEW_ITEMS = [
  { n: "01", label: "Campaign discovery" },
  { n: "02", label: "Earnings dashboard" },
  { n: "03", label: "Tier journey" },
  { n: "04", label: "ConversionOracle™ payouts" },
];

export default function DemoCreatorEntry() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    enterDemoMode("creator");
    const tick = setInterval(
      () => setStep((s) => (s < PREVIEW_ITEMS.length - 1 ? s + 1 : s)),
      300,
    );
    const jump = setTimeout(() => {
      router.replace("/creator/dashboard");
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#003049",
        padding: "32px 24px",
        color: "#f5f2ec",
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
        Push · Creator Preview
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(56px, 10vw, 128px)",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          color: "#f5f2ec",
          lineHeight: 0.95,
          margin: "0 0 32px",
          textAlign: "center",
        }}
      >
        <span style={{ fontWeight: 200, color: "rgba(245,242,236,0.35)" }}>
          Stepping into
        </span>
        <br />
        the operator network.
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

      <div
        style={{
          width: 64,
          height: 3,
          background: "#c1121f",
          marginTop: 40,
        }}
        aria-hidden="true"
      />
      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "rgba(245,242,236,0.35)",
          marginTop: 16,
        }}
      >
        Demo data only · No real account created
      </p>
    </div>
  );
}
