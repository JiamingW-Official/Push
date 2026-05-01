"use client";

import { useEffect, useState } from "react";
import { exitDemoMode, type DemoAudience, getDemoRole } from "@/lib/demo";
import { DemoToastHost } from "./DemoToastHost";
import "./demo-banner.css";

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
 * Floating bottom-right demo widget. Compact pill — role + Switch + Exit.
 * The full tip text is revealed on hover. Replaces the old top sticky banner.
 */
export function DemoBanner() {
  const [role, setRole] = useState<DemoAudience | null>(null);

  useEffect(() => {
    setRole(getDemoRole());
  }, []);

  if (!role) return null;

  return (
    <>
      <div className="demo-chip" role="status" aria-live="polite">
        <span className="demo-chip__dot" aria-hidden="true" />
        <span className="demo-chip__label">{AUDIENCE_LABEL[role]}</span>
        <span className="demo-chip__tip">{AUDIENCE_TIP[role]}</span>
        <a
          href="/demo"
          className="demo-chip__action"
          aria-label="Switch demo role"
          title="Switch role"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h10M11 4l2 2-2 2M13 10H3M5 8l-2 2 2 2" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => exitDemoMode()}
          className="demo-chip__action"
          aria-label="Exit demo"
          title="Exit demo"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
      <DemoToastHost />
    </>
  );
}
