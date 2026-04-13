"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoMerchantEntry() {
  const router = useRouter();

  useEffect(() => {
    // Set demo cookie (2 hours)
    document.cookie = "push-demo-role=merchant; path=/; max-age=7200";
    // Brief branded moment then redirect
    const t = setTimeout(() => {
      router.replace("/merchant/dashboard");
    }, 1200);
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
        gap: "24px",
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
        }}
      />
      {/* Loading label */}
      <p
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(245,242,236,0.5)",
        }}
      >
        Loading merchant preview&hellip;
      </p>
    </div>
  );
}
