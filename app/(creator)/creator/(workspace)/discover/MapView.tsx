"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue in Next.js / webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Custom red square icon (Push brand) ───────────────────── */
// Design.md exception: map pins may use 50% border-radius
// But here we use a square flag-red pin per brand spec.
const createPinIcon = (payout: string) =>
  L.divIcon({
    html: `
      <div class="push-map-pin">
        <span class="push-map-pin-label">${payout}</span>
        <div class="push-map-pin-tail"></div>
      </div>
    `,
    className: "",
    iconSize: [58, 40],
    iconAnchor: [29, 40],
    popupAnchor: [0, -44],
  });

/* ── Campaign location data ─────────────────────────────────── */

export interface CampaignPin {
  id: string;
  title: string;
  merchantName: string;
  neighborhood: string;
  payout: number;
  payoutLabel: string;
  slotsRemaining: number;
  slotsTotal: number;
  lat: number;
  lng: number;
  applicationStatus?: "none" | "applied" | "pending";
}

// NYC neighborhood mock coordinates
export const CAMPAIGN_LOCATIONS: Omit<CampaignPin, "applicationStatus">[] = [
  {
    id: "disc-001",
    title: "Rooftop Coffee Series",
    merchantName: "Blank Street Coffee",
    neighborhood: "Williamsburg, BK",
    payout: 32,
    payoutLabel: "per visit",
    slotsTotal: 20,
    slotsRemaining: 6,
    lat: 40.7144,
    lng: -73.9565,
  },
  {
    id: "disc-002",
    title: "Chelsea Market Food Walk",
    merchantName: "Chelsea Market",
    neighborhood: "Chelsea, NYC",
    payout: 45,
    payoutLabel: "per post",
    slotsTotal: 10,
    slotsRemaining: 2,
    lat: 40.7424,
    lng: -74.0059,
  },
  {
    id: "disc-003",
    title: "Flatiron Brunch Story",
    merchantName: "Eataly NYC Flatiron",
    neighborhood: "Flatiron, NYC",
    payout: 60,
    payoutLabel: "per reel",
    slotsTotal: 8,
    slotsRemaining: 4,
    lat: 40.7421,
    lng: -73.9897,
  },
  {
    id: "disc-004",
    title: "Pilates Studio Grand Opening",
    merchantName: "Forma Pilates Chelsea",
    neighborhood: "Chelsea, NYC",
    payout: 40,
    payoutLabel: "per visit",
    slotsTotal: 12,
    slotsRemaining: 7,
    lat: 40.7448,
    lng: -74.0003,
  },
  {
    id: "disc-005",
    title: "Gallery Opening Night",
    merchantName: "Tara Downs Gallery",
    neighborhood: "Chelsea, NYC",
    payout: 75,
    payoutLabel: "per campaign",
    slotsTotal: 6,
    slotsRemaining: 3,
    lat: 40.7464,
    lng: -74.0047,
  },
  {
    id: "disc-006",
    title: "Beauty Lab Skincare Series",
    merchantName: "Bluemercury SoHo",
    neighborhood: "SoHo, NYC",
    payout: 55,
    payoutLabel: "per story set",
    slotsTotal: 8,
    slotsRemaining: 5,
    lat: 40.7228,
    lng: -74.0029,
  },
  {
    id: "disc-007",
    title: "Boutique Opening Campaign",
    merchantName: "Madewell Soho",
    neighborhood: "SoHo, NYC",
    payout: 28,
    payoutLabel: "per post",
    slotsTotal: 15,
    slotsRemaining: 10,
    lat: 40.7244,
    lng: -74.0003,
  },
  {
    id: "disc-008",
    title: "Morning Ritual Brew",
    merchantName: "Intelligentsia Coffee",
    neighborhood: "West Village, NYC",
    payout: 0,
    payoutLabel: "free entry",
    slotsTotal: 20,
    slotsRemaining: 14,
    lat: 40.7344,
    lng: -74.0054,
  },
  {
    id: "disc-009",
    title: "Wellness Studio Launch",
    merchantName: "The Well NYC",
    neighborhood: "Midtown, NYC",
    payout: 85,
    payoutLabel: "per campaign",
    slotsTotal: 5,
    slotsRemaining: 1,
    lat: 40.7489,
    lng: -73.9882,
  },
  {
    id: "disc-010",
    title: "Farm-to-Table Dinner Series",
    merchantName: "Blue Hill Restaurant",
    neighborhood: "West Village, NYC",
    payout: 250,
    payoutLabel: "per campaign",
    slotsTotal: 2,
    slotsRemaining: 1,
    lat: 40.7332,
    lng: -74.0037,
  },
];

/* ── Props ──────────────────────────────────────────────────── */

interface MapViewProps {
  campaigns?: CampaignPin[];
  applications: Record<string, "none" | "applied" | "pending">;
  onApply: (id: string) => void;
}

/* ── MapView Component ──────────────────────────────────────── */

export default function MapView({
  campaigns,
  applications,
  onApply,
}: MapViewProps) {
  const pins: CampaignPin[] = (campaigns ?? CAMPAIGN_LOCATIONS).map((c) => ({
    ...c,
    applicationStatus: applications[c.id] ?? "none",
  }));

  return (
    <>
      {/* Leaflet CSS overrides — injected inline to scope to map view */}
      <style>{`
        /* Map container: sharp edges, Push border */
        .push-leaflet-wrap .leaflet-container {
          border-radius: 0 !important;
          font-family: inherit;
        }

        /* Popup: no border-radius, surface-elevated bg */
        .push-leaflet-wrap .leaflet-popup-content-wrapper {
          border-radius: 0 !important;
          background: #ffffff !important;
          border: 1px solid rgba(0,48,73,0.12) !important;
          box-shadow: 0 8px 32px rgba(0,48,73,0.14) !important;
          padding: 0 !important;
        }

        .push-leaflet-wrap .leaflet-popup-tip-container {
          display: none;
        }

        .push-leaflet-wrap .leaflet-popup-close-button {
          color: rgba(0,48,73,0.4) !important;
          font-size: 16px !important;
          top: 8px !important;
          right: 10px !important;
          font-weight: 400 !important;
        }

        .push-leaflet-wrap .leaflet-popup-close-button:hover {
          color: #c1121f !important;
        }

        .push-leaflet-wrap .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }

        /* Control buttons: square */
        .push-leaflet-wrap .leaflet-bar a,
        .push-leaflet-wrap .leaflet-bar a:hover {
          border-radius: 0 !important;
        }

        /* Custom pin styles */
        .push-map-pin {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .push-map-pin-label {
          display: block;
          background: #c1121f;
          color: #fff;
          font-family: 'CS Genio Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 4px 8px;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          line-height: 1.4;
        }

        .push-map-pin-tail {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #c1121f;
        }

        /* Popup card styles */
        .push-map-popup {
          width: 220px;
          padding: 16px;
          font-family: 'CS Genio Mono', 'Courier New', monospace;
        }

        .push-map-popup-eyebrow {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,48,73,0.38);
          margin-bottom: 4px;
        }

        .push-map-popup-name {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #003049;
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .push-map-popup-merchant {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,48,73,0.38);
          margin-bottom: 12px;
        }

        .push-map-popup-earn {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 10px;
        }

        .push-map-popup-amount {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #c9a96e;
          line-height: 1;
        }

        .push-map-popup-amount--free {
          color: #669bbc;
          font-size: 18px;
        }

        .push-map-popup-unit {
          font-size: 10px;
          font-weight: 700;
          color: rgba(201,169,110,0.65);
          letter-spacing: 0.03em;
        }

        .push-map-popup-slots {
          font-size: 10px;
          font-weight: 700;
          color: rgba(0,48,73,0.4);
          letter-spacing: 0.03em;
          margin-bottom: 12px;
        }

        .push-map-popup-slots--urgent {
          color: #c1121f;
        }

        .push-map-popup-apply {
          width: 100%;
          padding: 9px 0;
          font-family: 'CS Genio Mono', 'Courier New', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #c1121f;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 150ms ease;
        }

        .push-map-popup-apply:hover {
          background: #780000;
        }

        .push-map-popup-apply--applied {
          background: rgba(0,48,73,0.08);
          color: rgba(0,48,73,0.45);
          cursor: default;
        }

        .push-map-popup-apply--applied:hover {
          background: rgba(0,48,73,0.08);
        }

        .push-map-popup-apply--pending {
          background: rgba(201,169,110,0.12);
          color: #7a5a18;
          border: 1px solid rgba(201,169,110,0.35);
          cursor: default;
        }

        .push-map-popup-apply--pending:hover {
          background: rgba(201,169,110,0.12);
        }
      `}</style>

      <div
        className="push-leaflet-wrap"
        style={{ height: 480, border: "1px solid rgba(0,48,73,0.1)" }}
      >
        <MapContainer
          center={[40.7278, -74.0]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pins.map((pin) => {
            const isFree = pin.payout === 0;
            const payoutDisplay = isFree ? "FREE" : `$${pin.payout}`;
            const slotsUrgent = pin.slotsRemaining < 3;
            const appStatus = pin.applicationStatus ?? "none";

            return (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={createPinIcon(payoutDisplay)}
              >
                <Popup>
                  <div className="push-map-popup">
                    <div className="push-map-popup-eyebrow">
                      {pin.neighborhood}
                    </div>
                    <div className="push-map-popup-name">{pin.title}</div>
                    <div className="push-map-popup-merchant">
                      {pin.merchantName}
                    </div>

                    <div className="push-map-popup-earn">
                      <span
                        className={`push-map-popup-amount${isFree ? " push-map-popup-amount--free" : ""}`}
                      >
                        {payoutDisplay}
                      </span>
                      {!isFree && (
                        <span className="push-map-popup-unit">
                          /{pin.payoutLabel}
                        </span>
                      )}
                    </div>

                    <div
                      className={`push-map-popup-slots${slotsUrgent ? " push-map-popup-slots--urgent" : ""}`}
                    >
                      {slotsUrgent
                        ? `Only ${pin.slotsRemaining} spot${pin.slotsRemaining !== 1 ? "s" : ""} left!`
                        : `${pin.slotsRemaining}/${pin.slotsTotal} slots remaining`}
                    </div>

                    <button
                      className={`push-map-popup-apply${
                        appStatus === "applied"
                          ? " push-map-popup-apply--applied"
                          : appStatus === "pending"
                            ? " push-map-popup-apply--pending"
                            : ""
                      }`}
                      onClick={() => {
                        if (appStatus === "none") onApply(pin.id);
                      }}
                      disabled={appStatus !== "none"}
                    >
                      {appStatus === "applied"
                        ? "✓ APPLIED"
                        : appStatus === "pending"
                          ? "⏳ PENDING"
                          : "APPLY NOW"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
}
