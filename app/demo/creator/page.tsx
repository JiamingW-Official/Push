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
        background: "#003049",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(72px, 14vw, 180px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#f5f2ec",
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
          background: "#c1121f",
          marginTop: "32px",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,242,236,0.4)",
          marginTop: "24px",
        }}
      >
        Creator Preview
      </p>
    </div>
  );
}
