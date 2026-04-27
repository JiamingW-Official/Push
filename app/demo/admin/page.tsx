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
        background: "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.06em",
          color: "#ffffff",
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        Push<span style={{ color: "var(--brand-red)" }}>.</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Loading ops console...
      </div>
    </div>
  );
}
