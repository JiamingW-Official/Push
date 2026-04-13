"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./scan.css";

/* ── Demo data keyed by QR code ─────────────────────────── */
type ScanData = {
  business_name: string;
  business_address: string;
  campaign_title: string;
  offer: string | null;
  creator_handle: string;
  category: string;
};

const DEMO_SCANS: Record<string, ScanData> = {
  "demo-blank-street-001": {
    business_name: "Blank Street Coffee",
    business_address: "284 W Broadway, SoHo",
    campaign_title: "Free Latte for a 30-Second Reel",
    offer: "Free latte with any purchase",
    creator_handle: "@alexchen.nyc",
    category: "Food & Drink",
  },
};

type State = "loading" | "ready" | "confirming" | "done" | "error";

export default function ScanPageClient() {
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : "";

  const [state, setState] = useState<State>("loading");
  const [scanData, setScanData] = useState<ScanData | null>(null);

  useEffect(() => {
    if (DEMO_SCANS[code]) {
      setScanData(DEMO_SCANS[code]);
      setState("ready");
      return;
    }
    setState("error");
  }, [code]);

  const handleConfirm = () => {
    setState("confirming");
    setTimeout(() => setState("done"), 1200);
  };

  if (state === "loading") {
    return (
      <div className="scan-shell scan-loading">
        <div className="scan-spinner" />
      </div>
    );
  }

  if (state === "error" || !scanData) {
    return (
      <div className="scan-shell">
        <div className="scan-error">
          <div className="scan-error__brand">Push.</div>
          <div className="scan-error__code">Invalid QR Code</div>
          <div className="scan-error__body">
            This QR code is not recognized or has expired. Ask the business for
            a new code.
          </div>
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="scan-shell">
        <div className="scan-success">
          <div className="scan-success__check">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <polyline
                points="6,19 14,27 30,11"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="square"
              />
            </svg>
          </div>
          <div className="scan-success__headline">Done.</div>
          <div className="scan-success__sub">
            {scanData.offer
              ? "Show this screen to claim your offer."
              : "Your visit has been recorded. Thank you for supporting local."}
          </div>
          {scanData.offer && (
            <div className="scan-success__offer-card">
              <div className="scan-success__offer-label">Your offer</div>
              <div className="scan-success__offer-text">{scanData.offer}</div>
            </div>
          )}
          <div className="scan-success__powered">
            Powered by Push &mdash; {scanData.business_name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-shell">
      <div className="scan-brand">Push.</div>
      <div className="scan-card">
        <div className="scan-card__top">
          <div className="scan-card__eyebrow">You&apos;re at</div>
          <div className="scan-card__biz">{scanData.business_name}</div>
          <div className="scan-card__address">{scanData.business_address}</div>
        </div>
        <div className="scan-card__tear" />
        <div className="scan-card__bottom">
          <div className="scan-card__campaign-label">Campaign</div>
          <div className="scan-card__campaign">{scanData.campaign_title}</div>
          {scanData.offer && (
            <div className="scan-card__offer">{scanData.offer}</div>
          )}
        </div>
      </div>
      <div className="scan-attribution">
        This visit supports <strong>{scanData.creator_handle}</strong>
        &apos;s campaign. Tap below to confirm you&apos;re here.
      </div>
      <button
        className="scan-cta"
        onClick={handleConfirm}
        disabled={state === "confirming"}
      >
        {state === "confirming" ? "Recording..." : "Confirm Visit"}
      </button>
      <div className="scan-footer-note">No app download required</div>
    </div>
  );
}
