"use client";

import { useEffect, useState } from "react";
import { exitDemoMode, type DemoAudience, getDemoRole } from "@/lib/demo";
import { DemoToastHost } from "./DemoToastHost";

const AUDIENCE_LABEL: Record<DemoAudience, string> = {
  creator: "Creator demo",
  merchant: "Merchant demo",
  admin: "Admin demo",
  consumer: "Consumer demo",
};

const AUDIENCE_TIP: Record<DemoAudience, string> = {
  creator: "Apply, draft, earn — all actions are simulated.",
  merchant: "Launch a campaign, print a QR — nothing persists to prod.",
  admin: "Ops surfaces load mock data — decisions don't dispatch.",
  consumer:
    "Scan → consent → redeem flow runs on mock rows. Data-rights form is safe to submit.",
};

/**
 * Sticky top banner + toast host. Mounted once per audience layout so
 * every demo page has (1) an Exit button, (2) audience-specific context,
 * (3) the toast channel listener for useDemoAction.
 */
export function DemoBanner() {
  const [role, setRole] = useState<DemoAudience | null>(null);

  useEffect(() => {
    setRole(getDemoRole());
  }, []);

  if (!role) return null;

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 9999,
          background: "#c1121f",
          color: "#f5f2ec",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 24px",
          borderBottom: "2px solid #780000",
          fontFamily: "var(--font-body, 'CS Genio Mono', monospace)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              background: "#ffffff",
              color: "#c1121f",
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            {AUDIENCE_LABEL[role]}
          </span>
          <span
            style={{
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: "0.02em",
              opacity: 0.9,
            }}
          >
            {AUDIENCE_TIP[role]}
          </span>
        </span>
        <span style={{ display: "inline-flex", gap: "8px" }}>
          <a
            href="/demo"
            style={{
              padding: "4px 12px",
              background: "transparent",
              border: "1px solid rgba(245,242,236,0.4)",
              color: "#f5f2ec",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Switch role
          </a>
          <button
            type="button"
            onClick={() => exitDemoMode()}
            style={{
              background: "rgba(245,242,236,0.15)",
              border: "1px solid rgba(245,242,236,0.4)",
              color: "#f5f2ec",
              fontFamily: "inherit",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            Exit demo
          </button>
        </span>
      </div>
      <DemoToastHost />
    </>
  );
}
