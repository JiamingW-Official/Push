"use client";
import { useEffect, useState } from "react";
import { exitDemoMode } from "@/lib/demo";

export function DemoBanner() {
  const [role, setRole] = useState<"creator" | "merchant" | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/push-demo-role=(creator|merchant)/);
    if (match) setRole(match[1] as "creator" | "merchant");
  }, []);

  if (!role) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#c1121f",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
      role="status"
    >
      <span
        style={{
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#f5f2ec",
        }}
      >
        Demo mode
        <span
          style={{
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: "0.02em",
            opacity: 0.75,
            marginLeft: "12px",
          }}
        >
          You&apos;re in demo mode. Data is not persisted.
        </span>
      </span>
      <button
        onClick={() => exitDemoMode()}
        style={{
          background: "rgba(245,242,236,0.15)",
          border: "1px solid rgba(245,242,236,0.4)",
          color: "#f5f2ec",
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "4px 12px",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(245,242,236,0.25)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(245,242,236,0.15)")
        }
      >
        Exit
      </button>
    </div>
  );
}
