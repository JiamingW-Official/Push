"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { enterDemoMode } from "@/lib/demo";

export default function DemoCreatorEntry() {
  const router = useRouter();

  useEffect(() => {
    enterDemoMode("creator");
    const t = setTimeout(() => {
      router.replace("/creator/dashboard");
    }, 1000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(72px, 14vw, 180px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#ffffff",
          lineHeight: 0.9,
          userSelect: "none",
        }}
      >
        Loading...
      </span>
      <div
        style={{
          width: "64px",
          height: "3px",
          background: "var(--brand-red)",
          marginTop: "32px",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginTop: "24px",
        }}
      >
        Creator Preview
      </p>
    </div>
  );
}
