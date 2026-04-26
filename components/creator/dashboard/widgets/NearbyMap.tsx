"use client";

/* Repo target: components/creator/dashboard/widgets/NearbyMap.tsx
   6×2 — wraps the existing MapView component with KPI Card chrome. */

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Campaign } from "../types";
import { ArrowUpRight } from "../CircleArrow";

const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => <div className="dh-map-wrap" />,
});

export interface NearbyMapProps {
  campaigns: Campaign[];
  className?: string;
}

/* Leaflet expects [lat, lng] order. Williamsburg, Brooklyn. */
const DEFAULT_CENTER: [number, number] = [40.7081, -73.9442];

export function NearbyMap({ campaigns, className = "" }: NearbyMapProps) {
  const [expanded, setExpanded] = useState(false);

  const center: [number, number] = campaigns[0]
    ? [campaigns[0].lat, campaigns[0].lng]
    : DEFAULT_CENTER;

  return (
    <>
      <div className={`dh-card ${className}`.trim()}>
        <div className="dh-card__header">
          <span className="dh-card__eyebrow">
            CAMPAIGNS NEAR YOU · {campaigns.length} within 1 mi
          </span>
          <button
            className="dh-circle-arrow"
            onClick={() => setExpanded(true)}
            type="button"
            aria-label="Expand map"
          >
            <ArrowUpRight />
          </button>
        </div>
        <div className="dh-map-wrap">
          <MapView
            campaigns={campaigns}
            center={center}
            onPinClick={() => {}}
            showPricePills
            mono
          />
        </div>
      </div>

      {expanded && (
        <div
          className="dh-map-overlay"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Campaign map"
          style={overlayStyle}
        >
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={modalHeaderStyle}>
              <span className="dh-card__eyebrow">
                CAMPAIGNS NEAR YOU — {campaigns.length} active
              </span>
              <button
                onClick={() => setExpanded(false)}
                type="button"
                aria-label="Close map"
                style={closeBtnStyle}
              >
                ✕
              </button>
            </div>
            <div style={modalBodyStyle}>
              <MapView
                campaigns={campaigns}
                center={center}
                onPinClick={() => {}}
                showPricePills
                showPopups
                mono
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(10,10,10,0.65)",
  zIndex: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
};

const modalStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: 20,
  width: "min(1280px, 100%)",
  height: "min(820px, 100%)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 24px 80px rgba(10,10,10,0.4)",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "1px solid var(--hairline)",
};

const closeBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
  color: "var(--ink)",
  borderRadius: 8,
};

const modalBodyStyle: React.CSSProperties = {
  flex: 1,
  position: "relative",
};
