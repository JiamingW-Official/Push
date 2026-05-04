"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

export type CampaignPin = {
  id: string;
  title: string;
  business_name: string;
  payout: number;
  lat: number;
  lng: number;
  spots_remaining: number;
  description?: string | null;
  image?: string;
  category?: string;
};

// Dot pin — used on dashboard
function makeDotIcon(highlight = false) {
  return L.divIcon({
    className: "",
    html: `<div class="map-pin ${highlight ? "map-pin--highlight" : ""}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

// Price pill — used on explore page
function makePillIcon(payout: number, highlight = false) {
  const label = payout === 0 ? "Free" : `$${payout}`;
  const free = payout === 0;
  const cls = [
    "map-pill",
    highlight ? "map-pill--active" : "",
    free ? "map-pill--free" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    className: "map-pill-anchor",
    html: `<div class="${cls}">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -8],
  });
}

// Category icon system — unique color + SVG path per activity type
const CATEGORY_ICONS: Record<string, { color: string; path: string }> = {
  "FOOD & DRINK": {
    color: "#f97316",
    path: "M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v0z",
  },
  COFFEE: {
    color: "#92400e",
    path: "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2",
  },
  RETAIL: {
    color: "#7c3aed",
    path: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0",
  },
  WELLNESS: {
    color: "#15803d",
    path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10ZM2 21c0-3 1.85-5.36 5.08-6",
  },
  BEAUTY: {
    color: "#be185d",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  },
  FITNESS: {
    color: "#1d4ed8",
    path: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  },
  LIFESTYLE: {
    color: "#d97706",
    path: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  ENTERTAINMENT: {
    color: "#db2777",
    path: "m11.5 2-1.5 7H5l5.5 3.5L8 19l4-2.5 4 2.5-2.5-6.5L19 9h-5z",
  },
  TRAVEL: {
    color: "#0891b2",
    path: "M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2C4.3 5.1 3.9 5.4 3.7 5.8l-.7 1.4c-.2.4-.1.9.2 1.2l5 4-1 2.5-2.5 1-.8.8L5.5 18l2 2 1.7-1.7 1-.8 2.5-1 4 5c.3.3.8.4 1.2.2l1.4-.7c.4-.2.7-.6.6-1.1",
  },
  HEALTH: {
    color: "#059669",
    path: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
};

const DEFAULT_CATEGORY = {
  color: "#6b7280",
  path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-4H9l3-7 3 7h-2v4z",
};

function makeCategoryIcon(category: string | undefined, highlight = false) {
  const key = (category ?? "").toUpperCase().trim();
  const { color, path } = CATEGORY_ICONS[key] ?? DEFAULT_CATEGORY;
  const activeColor = highlight ? "#fff" : color;
  const bgColor = highlight ? color : "#fff";
  const border = highlight ? "none" : `2px solid ${color}`;
  return L.divIcon({
    className: "map-cat-anchor",
    html: `<div class="map-cat-pin${highlight ? " map-cat-pin--active" : ""}" style="background:${bgColor};border:${border};">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${path}"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

// Monochromatic tile layer
const MONO_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MONO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const DEFAULT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Recenter map when center prop changes
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

/* Resize observer — Leaflet calculates tile positions from container size at
   mount, so any post-mount resize (dynamic-import settle, parent reflow,
   container query breakpoint) leaves the tile grid offset. invalidateSize()
   tells Leaflet to recompute. Without this, tiles render at wrong x/y and
   the map appears empty even though tiles loaded. */
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    /* Initial fix — settle 50ms after mount when container has its real size */
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 250);

    /* Observe container resizes for container-query breakpoints */
    const container = map.getContainer();
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(container);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [map]);
  return null;
}

// Custom zoom controls using Leaflet control API
function ZoomControls() {
  const map = useMap();
  useEffect(() => {
    const ctrl = L.control.zoom({ position: "bottomright" });
    ctrl.addTo(map);
    return () => {
      ctrl.remove();
    };
  }, [map]);
  return null;
}

// Individual marker with auto-open popup
function CampaignMarker({
  campaign: c,
  isActive,
  showPricePills,
  showPopups,
  onPinClick,
  onPopupClose,
}: {
  campaign: CampaignPin;
  isActive: boolean;
  showPricePills: boolean;
  showPopups: boolean;
  onPinClick?: (id: string) => void;
  onPopupClose?: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const icon = showPricePills
    ? makeCategoryIcon(c.category, isActive)
    : makeDotIcon(isActive);

  const isFree = c.payout === 0;
  const payoutLabel = isFree ? "Free" : `$${c.payout}`;
  const spotsUrgent = c.spots_remaining <= 2;

  useEffect(() => {
    if (isActive && showPopups && markerRef.current) {
      markerRef.current.openPopup();
    } else if (!isActive && markerRef.current) {
      markerRef.current.closePopup();
    }
  }, [isActive, showPopups]);

  return (
    <Marker
      ref={markerRef}
      position={[c.lat, c.lng]}
      icon={icon}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={{
        click: () => onPinClick?.(c.id),
      }}
    >
      {showPopups && (
        <Popup
          closeButton={false}
          autoPan={true}
          autoPanPadding={L.point(40, 40)}
          eventHandlers={{
            remove: () => {
              if (isActive) onPopupClose?.();
            },
          }}
        >
          <div className="map-popup">
            <div className="map-popup-img-wrap">
              {c.image ? (
                <img src={c.image} alt={c.title} className="map-popup-img" />
              ) : (
                <div
                  className="map-popup-img"
                  style={{ background: "var(--ink)" }}
                />
              )}
              <button
                className="map-popup-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onPopupClose?.();
                }}
              >
                ✕
              </button>
              <span
                className={`map-popup-badge ${isFree ? "map-popup-badge--free" : ""}`}
              >
                {payoutLabel}
              </span>
            </div>
            <div className="map-popup-body">
              <div className="map-popup-meta">
                <span className="map-popup-biz">{c.business_name}</span>
                <span
                  className={`map-popup-spots ${spotsUrgent ? "map-popup-spots--urgent" : ""}`}
                >
                  {c.spots_remaining} left
                </span>
              </div>
              <h3 className="map-popup-title">{c.title}</h3>
              {c.description && (
                <p className="map-popup-desc">{c.description}</p>
              )}
              <Link href="/creator/signup" className="map-popup-cta">
                Apply Now
              </Link>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
}

type Props = {
  campaigns: CampaignPin[];
  center: [number, number];
  onPinClick?: (id: string) => void;
  onPopupClose?: () => void;
  activeId?: string;
  showPricePills?: boolean;
  showPopups?: boolean;
  mono?: boolean;
};

export default function MapView({
  campaigns,
  center,
  onPinClick,
  onPopupClose,
  activeId,
  showPricePills = false,
  showPopups = false,
  mono = false,
}: Props) {
  const tileUrl = mono ? MONO_TILES : DEFAULT_TILES;
  const tileAttr = mono ? MONO_ATTR : DEFAULT_ATTR;

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={true}
      attributionControl={false}
    >
      <Recenter lat={center[0]} lng={center[1]} />
      <ZoomControls />
      <ResizeFix />

      <TileLayer attribution={tileAttr} url={tileUrl} />

      {campaigns.map((c) => (
        <CampaignMarker
          key={c.id}
          campaign={c}
          isActive={c.id === activeId}
          showPricePills={showPricePills}
          showPopups={showPopups}
          onPinClick={onPinClick}
          onPopupClose={onPopupClose}
        />
      ))}
    </MapContainer>
  );
}
