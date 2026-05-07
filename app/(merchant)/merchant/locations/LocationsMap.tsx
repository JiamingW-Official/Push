"use client";

import { useEffect, useRef } from "react";

type LeafletLib = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletMarker = import("leaflet").Marker;
type DivIcon = import("leaflet").DivIcon;

type LocationRecord = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  status: "open" | "closed";
  // Optional metrics — surfaced in the popup when present
  scans_7d?: number;
  conversions_30d?: number;
  campaign_history?: Array<{ scans: number }>;
};

type Props = {
  locations: LocationRecord[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

/* ── Status colors — merchant register (warm grays + brand red) ───────────
   open  → brand red (active venue)
   closed → ink-3 warm gray (dormant venue) */
const STATUS_COLOR: Record<LocationRecord["status"], string> = {
  open: "#c1121f",
  closed: "#9aa0a6",
};

/* Single store-front SVG icon — minimal awning + door, premium and consistent.
   24×24 viewBox, currentColor fill, sized to match creator's pin density. */
const STORE_ICON_SVG = `
  <path fill="currentColor" d="M4 4h16l1.5 4.5a2 2 0 0 1-1.9 2.6H20V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.9h-.6A2 2 0 0 1 1.5 8.5L3 4h1zm6 8h4v3h-4v-3z"/>
`;

/** Cached DivIcon — at most 2 statuses × 2 selected-states = 4 unique pins,
 *  built lazily and reused for every marker that matches the key. */
const ICON_CACHE = new Map<string, DivIcon>();

function getStorePinIcon(
  leaflet: LeafletLib,
  status: LocationRecord["status"],
  isSelected: boolean,
): DivIcon {
  const key = `${status}|${isSelected ? 1 : 0}`;
  const hit = ICON_CACHE.get(key);
  if (hit) return hit;
  const fresh = createStorePinIcon(leaflet, status, isSelected);
  ICON_CACHE.set(key, fresh);
  return fresh;
}

function createStorePinIcon(
  leaflet: LeafletLib,
  status: LocationRecord["status"],
  isSelected: boolean,
): DivIcon {
  const accent = STATUS_COLOR[status];
  const style = `--pin-accent:${accent};color:${accent};`;
  const cls = [
    "merchant-loc-pin",
    `merchant-loc-pin--${status}`,
    isSelected ? "merchant-loc-pin--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return leaflet.divIcon({
    html: `
      <div class="${cls}" style="${style}" aria-label="${status === "open" ? "Active venue" : "Closed venue"}">
        <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;">
          ${STORE_ICON_SVG}
        </svg>
      </div>
    `,
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -18],
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function formatRoi(location: LocationRecord): string | null {
  if (
    typeof location.scans_7d !== "number" ||
    typeof location.conversions_30d !== "number"
  ) {
    return null;
  }
  const roi = (location.conversions_30d / Math.max(location.scans_7d, 1)) * 6;
  return `${roi.toFixed(1)}x`;
}

function formatScans(location: LocationRecord): number | null {
  if (typeof location.scans_7d !== "number") return null;
  return location.scans_7d;
}

function buildPopupHtml(location: LocationRecord): string {
  const safeName = escapeHtml(location.name);
  const safeAddress = escapeHtml(`${location.address}, ${location.city}`);
  const safeId = encodeURIComponent(location.id);
  const statusColor = STATUS_COLOR[location.status];
  const statusLabel = location.status === "open" ? "Active" : "Closed";
  const scans = formatScans(location);
  const roi = formatRoi(location);

  // Stats row — only render when we have metrics from the parent
  const statsBlock =
    scans !== null || roi !== null
      ? `<div class="merchant-map-popup-stats">${
          scans !== null
            ? `<span class="merchant-map-popup-stat"><span class="merchant-map-popup-stat-value">${scans}</span><span class="merchant-map-popup-stat-label">scans · 7d</span></span>`
            : ""
        }${
          roi !== null
            ? `<span class="merchant-map-popup-stat"><span class="merchant-map-popup-stat-value">${roi}</span><span class="merchant-map-popup-stat-label">roi · 30d</span></span>`
            : ""
        }</div>`
      : "";

  return `
    <div class="merchant-map-popup">
      <div class="merchant-map-popup-status">
        <span class="merchant-map-popup-status-dot" style="background:${statusColor};"></span>
        ${statusLabel}
      </div>
      <div class="merchant-map-popup-title">${safeName}</div>
      <div class="merchant-map-popup-address">${safeAddress}</div>
      ${statsBlock}
      <a class="merchant-map-popup-cta" href="/merchant/locations/${safeId}">Open venue</a>
    </div>
  `;
}

export default function LocationsMap({
  locations,
  selectedId = null,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletLib | null>(null);
  const markerMapRef = useRef<Map<string, LeafletMarker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || locations.length === 0 || mapRef.current)
      return;

    let mounted = true;

    const mount = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");
      if (!mounted || mapRef.current || !containerRef.current) return;

      leafletRef.current = L;

      const avgLat =
        locations.reduce((sum, location) => sum + location.lat, 0) /
        locations.length;
      const avgLng =
        locations.reduce((sum, location) => sum + location.lng, 0) /
        locations.length;

      const isSingleLocation = locations.length === 1;

      const map = L.map(containerRef.current, {
        center: [avgLat, avgLng],
        zoom: isSingleLocation ? 14 : 12,
        zoomControl: !isSingleLocation,
        scrollWheelZoom: !isSingleLocation,
        attributionControl: true,
      });
      mapRef.current = map;

      // CartoDB Voyager — premium pastel basemap, no API key.
      // {r} resolves to "@2x" on retina for crisp tiles. Dark variant when the
      // user prefers dark mode. Attribution required by CartoDB ToS but visually
      // hidden via .merchant-leaflet-wrap .leaflet-control-attribution rule.
      const isDark =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: getStorePinIcon(L, location.status, location.id === selectedId),
          keyboard: true,
          riseOnHover: true,
          title: location.name,
          zIndexOffset: location.id === selectedId ? 1000 : 0,
        })
          .addTo(map)
          .bindPopup(buildPopupHtml(location), {
            closeButton: true,
            autoPan: true,
            minWidth: 220,
            maxWidth: 260,
            offset: [0, -4],
            className: "merchant-map-popup-wrapper",
          })
          .on("click", () => onSelect?.(location.id));

        markerMapRef.current.set(location.id, marker);
      });
    };

    void mount();

    return () => {
      mounted = false;
      markerMapRef.current.clear();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // StrictMode/HMR cleanup — nuke any Leaflet instance still bound to the
      // container so a remount doesn't hit "Map container is being reused".
      if (containerRef.current) {
        const el = containerRef.current as HTMLElement & {
          _leaflet_id?: number;
        };
        if (el._leaflet_id) {
          delete el._leaflet_id;
          el.innerHTML = "";
        }
      }
    };
  }, [locations, onSelect, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Sync marker icons + z-index with the current selection. We avoid
    // auto-opening the popup when the page already shows a liquid-glass detail
    // peek (multi-location case) — the popup is reserved for direct marker click.
    markerMapRef.current.forEach((marker, id) => {
      const location = locations.find((item) => item.id === id);
      if (!location) return;
      marker.setIcon(getStorePinIcon(L, location.status, id === selectedId));
      marker.setZIndexOffset(id === selectedId ? 1000 : 0);
    });

    if (!selectedId) return;
    const selected = locations.find((location) => location.id === selectedId);
    if (selected) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 14), {
        duration: 0.6,
        easeLinearity: 0.25,
      });
    }
  }, [locations, selectedId]);

  return (
    <div
      ref={containerRef}
      className="loc-map-canvas merchant-leaflet-wrap"
      aria-label="Locations map"
    />
  );
}
