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
};

type Props = {
  locations: LocationRecord[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

function getPinIcon(
  leaflet: LeafletLib,
  status: LocationRecord["status"],
  isSelected: boolean,
): DivIcon {
  const selectedClass = isSelected ? " loc-map-pin--selected" : "";

  return leaflet.divIcon({
    className: "loc-map-pin-wrap",
    html: `<div class="loc-map-pin loc-map-pin--${status}${selectedClass}" aria-label="${status === "open" ? "Active venue" : "Closed venue"}"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
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

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map);

      locations.forEach((location) => {
        const safeName = escapeHtml(location.name);
        const safeAddress = escapeHtml(`${location.address}, ${location.city}`);
        const safeId = encodeURIComponent(location.id);

        const marker = L.marker([location.lat, location.lng], {
          icon: getPinIcon(L, location.status, location.id === selectedId),
          keyboard: true,
          riseOnHover: true,
          title: location.name,
        })
          .addTo(map)
          .bindPopup(
            `<div class="loc-map-popup"><p class="loc-map-popup__name">${safeName}</p><p class="loc-map-popup__address">${safeAddress}</p><a class="loc-map-popup__link" href="/merchant/locations/${safeId}">View location</a></div>`,
            {
              closeButton: false,
              autoPan: true,
              minWidth: 200,
              maxWidth: 260,
              offset: [0, -4],
            },
          )
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
    };
  }, [locations, onSelect, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Sync marker icons with the current selection. We avoid auto-opening the
    // popup when the page already shows a liquid-glass detail peek (multi-
    // location case) — the popup is reserved for direct marker click.
    markerMapRef.current.forEach((marker, id) => {
      const location = locations.find((item) => item.id === id);
      if (!location) return;
      marker.setIcon(getPinIcon(L, location.status, id === selectedId));
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
      className="loc-map-canvas"
      aria-label="Locations map"
    />
  );
}
