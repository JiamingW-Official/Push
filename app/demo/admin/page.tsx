"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Sets the push-demo-role=admin cookie and redirects to the admin console.
// Entry point: /demo/admin
export default function DemoAdminEntry() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = "push-demo-role=admin; path=/; max-age=86400";
    router.push("/admin");
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
        gap: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display, 'Darky', sans-serif)",
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#f5f2ec",
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        Push<span style={{ color: "#c1121f" }}>.</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(245,242,236,0.45)",
        }}
      >
        Loading ops console...
      </div>
    </div>
  );
}
