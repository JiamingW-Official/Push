"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useState, useEffect, useRef } from "react";

// Fix Leaflet default icon issue in Next.js / webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

/* ── Category colors — synced with CATEGORY_THEMES in discover/page.tsx ──── */
const CAT_COLOR: Record<string, string> = {
  "FOOD & DRINK": "#ff5e2b",
  FITNESS: "#16a34a",
  BEAUTY: "#e8447d",
  WELLNESS: "#0d9488",
  RETAIL: "#7c3aed",
  LIFESTYLE: "#1e5fad",
};

/* ── Category SVG icons — uniform visual weight set.
   Every icon: 24×24 viewBox · solid fill · ink bbox ~x:3-21 y:3-21 ·
   roughly equal ink density (60% fill of inner box). */
const CAT_ICON: Record<string, string> = {
  // Coffee mug with handle — food/drink
  "FOOD & DRINK": `
    <path fill="currentColor" d="M5 8a2 2 0 0 1 2-2h9v11a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8zm11 3v3h1.5a1.5 1.5 0 1 0 0-3H16zM8 3a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0V3zm4 0a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0V3z"/>
  `,
  // Shopping bag with curved handle
  RETAIL: `
    <path fill="currentColor" d="M9 6a3 3 0 0 1 6 0v1H9V6zm-2 1V6a5 5 0 1 1 10 0v1h2.5a1 1 0 0 1 .996 1.09l-1.1 12A2 2 0 0 1 17.4 22H6.6a2 2 0 0 1-1.992-1.91l-1.1-12A1 1 0 0 1 4.5 7H7z"/>
  `,
  // Heart — wellness / health
  WELLNESS: `
    <path fill="currentColor" d="M12 21.5s-9-5.5-9-12.5c0-3.038 2.462-5.5 5.5-5.5 1.59 0 3.067.677 4.114 1.794a.5.5 0 0 0 .772 0A5.49 5.49 0 0 1 17.5 3.5C20.538 3.5 23 5.962 23 9c0 7-9 12.5-9 12.5h-2z"/>
  `,
  // Five-point star — beauty
  BEAUTY: `
    <path fill="currentColor" d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.27l-6.18 3.23L7 14.63l-5-4.87 6.91-1L12 2.5z"/>
  `,
  // Horizontal dumbbell — fitness
  FITNESS: `
    <path fill="currentColor" d="M3 10a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0v-4zm3-2a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8zm3 3h6v2H9v-2zm7-3a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8zm3 2a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0v-4z"/>
  `,
  // Camera — lifestyle / capture
  LIFESTYLE: `
    <path fill="currentColor" d="M9.5 4 8 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2h-5zM12 9.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
  `,
};

/** Cache by `cat|active|locked` — there are at most 6 cats × 2 × 2 = 24
 *  unique icon shapes, so we lazily build each once and reuse forever. */
const ICON_CACHE = new Map<string, L.DivIcon>();

function getCategoryMarker(
  category: string,
  active = false,
  locked = false,
): L.DivIcon {
  const key = `${category}|${active ? 1 : 0}|${locked ? 1 : 0}`;
  const hit = ICON_CACHE.get(key);
  if (hit) return hit;
  const fresh = createCategoryMarker(category, active, locked);
  ICON_CACHE.set(key, fresh);
  return fresh;
}

function createCategoryMarker(
  category: string,
  active = false,
  locked = false,
) {
  const color = CAT_COLOR[category] ?? "#9a9a9a";
  const icon =
    CAT_ICON[category] ?? `<circle cx="12" cy="12" r="5" fill="currentColor"/>`;
  // Locked pins paint as gray regardless of category; --pin-accent stays the
  // category color so hover-flip on the locked variant still shows category.
  const accent = locked ? "#9aa0a6" : color;
  const style = `--pin-accent:${accent};color:${accent};`;
  const cls = [
    "push-cat-pin",
    active ? "push-cat-pin--active" : "",
    locked ? "push-cat-pin--locked" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    html: `
      <div class="${cls}" style="${style}">
        <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;">
          ${icon}
        </svg>
      </div>
    `,
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -18],
  });
}

/* ── CampaignPin type ───────────────────────────────────────── */

export interface CampaignPin {
  id: string;
  title: string;
  merchantName: string;
  neighborhood: string;
  category: string;
  slotsRemaining: number;
  slotsTotal: number;
  lat: number;
  lng: number;
  applicationStatus?: "none" | "applied" | "pending";
}

/* ── Fallback pins (used when campaigns prop is not provided) ── */
export const CAMPAIGN_LOCATIONS: Omit<CampaignPin, "applicationStatus">[] = [
  {
    id: "disc-001",
    title: "Rooftop Coffee Series",
    merchantName: "Blank Street Coffee",
    neighborhood: "Williamsburg, BK",
    category: "FOOD & DRINK",
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
    category: "FOOD & DRINK",
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
    category: "FOOD & DRINK",
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
    category: "FITNESS",
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
    category: "LIFESTYLE",
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
    category: "BEAUTY",
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
    category: "RETAIL",
    slotsTotal: 15,
    slotsRemaining: 10,
    lat: 40.7244,
    lng: -74.0003,
  },
  {
    id: "disc-009",
    title: "Wellness Studio Launch",
    merchantName: "The Well NYC",
    neighborhood: "Midtown, NYC",
    category: "WELLNESS",
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
    category: "FOOD & DRINK",
    slotsTotal: 2,
    slotsRemaining: 1,
    lat: 40.7332,
    lng: -74.0037,
  },
  {
    id: "disc-011",
    title: "Spring Retail Lookbook",
    merchantName: "COS Soho",
    neighborhood: "SoHo, NYC",
    category: "RETAIL",
    slotsTotal: 4,
    slotsRemaining: 2,
    lat: 40.7268,
    lng: -73.9987,
  },
];

/* ── Props ──────────────────────────────────────────────────── */

interface MapViewProps {
  campaigns?: CampaignPin[];
  applications: Record<string, "none" | "applied" | "pending">;
  onApply: (id: string) => void;
  /** Highlights the matching pin (scale + ring) when set. */
  activeId?: string | null;
  /** Optional accent color for the active pin's pulse ring. */
  accent?: string;
  /** Set of campaign IDs that the creator is NOT eligible to apply for. */
  lockedIds?: Set<string>;
}

/* ── MapView ────────────────────────────────────────────────── */

export default function MapView({
  campaigns,
  applications,
  onApply,
  activeId,
  accent,
  lockedIds,
}: MapViewProps) {
  const [mapKey, setMapKey] = useState(() => Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // On unmount, nuke any Leaflet instance attached to the container
      // so StrictMode/HMR remounts don't hit "Map container is being reused"
      if (containerRef.current) {
        const el = containerRef.current.querySelector(
          ".leaflet-container",
        ) as HTMLElement & { _leaflet_id?: number };
        if (el && el._leaflet_id) {
          // Force Leaflet to forget this container
          delete (el as any)._leaflet_id;
          el.innerHTML = "";
        }
      }
    };
  }, []);

  const pins: CampaignPin[] = (campaigns ?? CAMPAIGN_LOCATIONS).map((c) => ({
    ...c,
    applicationStatus: applications[c.id] ?? "none",
  }));

  const isDark =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div
      ref={containerRef}
      className="push-leaflet-wrap"
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      <MapContainer
        key={mapKey}
        center={[40.7278, -74.0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* CartoDB Voyager — premium pastel basemap, no API key.
              {r} resolves to "@2x" on retina for crisp tiles.
              Attribution required by CartoDB ToS — visually hidden via CSS
              (.leaflet-control-attribution { display: none }). */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />

        {pins.map((pin) => {
          const slotsUrgent = pin.slotsRemaining < 3;
          const appStatus = pin.applicationStatus ?? "none";
          const catColor = CAT_COLOR[pin.category] ?? "#9a9a9a";

          const isActive = pin.id === activeId;
          const isLocked = lockedIds?.has(pin.id) ?? false;
          return (
            <Marker
              /* Stable key — `icon` prop updates in place via setIcon, no
                   remount needed. Including state in the key would re-mount
                   ALL 80+ markers on every card hover. */
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={getCategoryMarker(pin.category, isActive, isLocked)}
              zIndexOffset={isActive ? 1000 : isLocked ? -100 : 0}
            >
              <Popup>
                <div className="push-map-popup">
                  <div className="push-map-popup-cat">
                    <span
                      className="push-map-popup-cat-dot"
                      style={{ background: catColor }}
                    />
                    {pin.category}
                  </div>

                  <div className="push-map-popup-title">{pin.title}</div>
                  <div className="push-map-popup-merchant">
                    {pin.merchantName} · {pin.neighborhood}
                  </div>

                  <div
                    className={`push-map-popup-slots${slotsUrgent ? " push-map-popup-slots--urgent" : ""}`}
                  >
                    {slotsUrgent
                      ? `Only ${pin.slotsRemaining} spot${pin.slotsRemaining !== 1 ? "s" : ""} left`
                      : `${pin.slotsRemaining} of ${pin.slotsTotal} slots open`}
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
                      ? "✓ Applied"
                      : appStatus === "pending"
                        ? "Accepted"
                        : "Apply Now"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
