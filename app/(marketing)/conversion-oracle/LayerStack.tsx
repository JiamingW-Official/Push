"use client";

import { useState } from "react";

type Layer = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  checks: string[];
  latency: string;
  failModes: string[];
};

const LAYERS: Layer[] = [
  {
    id: "qr",
    index: "01",
    name: "QR scan",
    tagline: "Point-of-sale hit at the counter.",
    checks: [
      "QR payload signature matches the campaign token (HMAC-signed, 60s rolling nonce).",
      "Creator ID in the payload is active on the merchant's campaign roster at scan time.",
      "Scan is the first of its payload (replay attacks are locked out instantly).",
    ],
    latency: "p50 120ms · p95 380ms",
    failModes: [
      "Expired QR (> 60s since generation)",
      "Replay (payload already redeemed)",
      "Creator off-roster for this merchant",
    ],
  },
  {
    id: "ocr",
    index: "02",
    name: "Claude Vision OCR",
    tagline: "Receipt read, matched to expected basket.",
    checks: [
      "Vision pass extracts line items, merchant name, timestamp, total, tax.",
      "Line items matched against the merchant's SKU dictionary for the day.",
      "Total in-range against merchant AOV band (Coffee+ beachhead: $8 to $20).",
    ],
    latency: "p50 1.4s · p95 3.6s (Claude Sonnet 4.6, shared prompt cache)",
    failModes: [
      "OCR confidence under threshold → downgrade to manual_review",
      "Merchant name mismatch (wrong location)",
      "Total outside AOV band by > 3x (likely not this business)",
    ],
  },
  {
    id: "geo",
    index: "03",
    name: "Geo-fence 200m",
    tagline: "Scanner inside the merchant's 200m radius.",
    checks: [
      "Device GPS at scan time within 200m of registered merchant lat/lng.",
      "Accuracy radius of the GPS fix is < 50m (low confidence fixes are abstained).",
      "Geo trace consistent with pedestrian motion (no teleport pattern).",
    ],
    latency: "p50 80ms · p95 240ms (client-side fix, server-side validation)",
    failModes: [
      "GPS accuracy > 50m → abstain (counts as low-confidence, not fail)",
      "Geo > 200m from merchant → hard fail",
      "Teleport pattern → flag for fraud review",
    ],
  },
];

export default function LayerStack() {
  const [openId, setOpenId] = useState<string | null>("qr");

  return (
    <div className="co-stack reveal" role="list">
      {LAYERS.map((layer) => {
        const isOpen = openId === layer.id;
        return (
          <div
            key={layer.id}
            role="listitem"
            className={`co-stack-card${isOpen ? " co-stack-card--open" : ""}`}
          >
            <button
              type="button"
              className="co-stack-head"
              onClick={() => setOpenId(isOpen ? null : layer.id)}
              aria-expanded={isOpen}
              aria-controls={`co-stack-body-${layer.id}`}
            >
              <span className="co-stack-icon" aria-hidden="true">
                {layer.id === "qr" && <QrIcon />}
                {layer.id === "ocr" && <EyeIcon />}
                {layer.id === "geo" && <PinIcon />}
              </span>

              <span className="co-stack-meta">
                <span className="co-stack-idx">{layer.index}</span>
                <span className="co-stack-name">{layer.name}</span>
                <span className="co-stack-tagline">{layer.tagline}</span>
              </span>

              <span
                className="co-stack-chev"
                aria-hidden="true"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>

            <div
              id={`co-stack-body-${layer.id}`}
              className="co-stack-body"
              hidden={!isOpen}
            >
              <div className="co-stack-col">
                <span className="co-stack-col-k">What it checks</span>
                <ul className="co-stack-list">
                  {layer.checks.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="co-stack-col">
                <span className="co-stack-col-k">Latency budget</span>
                <div className="co-stack-latency">{layer.latency}</div>

                <span className="co-stack-col-k co-stack-col-k--mt">
                  Fail modes
                </span>
                <ul className="co-stack-list">
                  {layer.failModes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Inline SVG icons (Material-Symbols-style stroke) ─── */

function QrIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="6" y="6" width="1" height="1" fill="currentColor" />
      <rect x="17" y="6" width="1" height="1" fill="currentColor" />
      <rect x="6" y="17" width="1" height="1" fill="currentColor" />
      <line x1="14" y1="14" x2="17" y2="14" />
      <line x1="14" y1="17" x2="14" y2="21" />
      <line x1="17" y1="17" x2="17" y2="21" />
      <line x1="20" y1="14" x2="20" y2="17" />
      <line x1="20" y1="20" x2="21" y2="20" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M2 12 C5 6, 9 4, 12 4 C15 4, 19 6, 22 12 C19 18, 15 20, 12 20 C9 20, 5 18, 2 12 Z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M8 8 L6 6 M16 8 L18 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M12 22 C8 16, 5 12, 5 9 A7 7 0 0 1 19 9 C19 12, 16 16, 12 22 Z" />
      <circle cx="12" cy="9" r="2.4" />
      <line x1="3" y1="22" x2="21" y2="22" strokeDasharray="2 3" />
    </svg>
  );
}
