"use client";

import { useEffect, useRef } from "react";
import type { Location } from "@/lib/merchant/mock-locations";

/* ── Leaflet types ──────────────────────────────────────────────────────── */
type LeafletMap = {
  remove: () => void;
  setView: (center: [number, number], zoom: number) => LeafletMap;
  flyTo: (center: [number, number], zoom: number) => void;
};

type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  on: (event: string, handler: () => void) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
  openPopup: () => LeafletMarker;
};

declare global {
  interface Window {
    L: {
      map: (el: HTMLElement, opts?: object) => LeafletMap;
      tileLayer: (
        url: string,
        opts?: object,
      ) => { addTo: (m: LeafletMap) => void };
      divIcon: (opts: object) => object;
      marker: (latlng: [number, number], opts?: object) => LeafletMarker;
    };
  }
}

type Props = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function LocationsMap({
  locations,
  selectedId,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    /* Load Leaflet CSS + JS */
    const loadLeaflet = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      await import("leaflet").then((L) => {
        const leaflet = L.default || L;
        if (mapRef.current) return;

        /* Calculate center from locations */
        const avgLat =
          locations.reduce((s, l) => s + l.lat, 0) / locations.length;
        const avgLng =
          locations.reduce((s, l) => s + l.lng, 0) / locations.length;

        const map = leaflet.map(containerRef.current!, {
          center: [avgLat, avgLng] as [number, number],
          zoom: 12,
          zoomControl: true,
        });

        mapRef.current = map as unknown as LeafletMap;

        /* Tile layer — CartoDB Positron for clean minimal look */
        (leaflet as unknown as typeof window.L)
          .tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
              subdomains: "abcd",
              maxZoom: 19,
            },
          )
          .addTo(map as unknown as LeafletMap);

        /* Add markers */
        locations.forEach((loc) => {
          const isOpen = loc.status === "open";
          const icon = (leaflet as unknown as typeof window.L).divIcon({
            className: "",
            html: `<div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: ${isOpen ? "var(--primary)" : "var(--graphite)"};
              border: 3px solid #fff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            "></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const popupHtml = `
            <div class="loc-map-popup">
              <div class="loc-map-popup__name">${loc.name}</div>
              <div class="loc-map-popup__hood">${loc.neighborhood} · ${loc.address}</div>
              <a class="loc-map-popup__link" href="/merchant/locations/${loc.id}">View location →</a>
            </div>
          `;

          const marker = (leaflet as unknown as typeof window.L)
            .marker([loc.lat, loc.lng] as [number, number], { icon })
            .addTo(map as unknown as LeafletMap)
            .bindPopup(popupHtml)
            .on("click", () => {
              onSelect(loc.id);
            });

          if (loc.id === selectedId) {
            marker.openPopup();
          }
        });
      });
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fly to selected location */
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) {
      mapRef.current.flyTo([loc.lat, loc.lng], 15);
    }
  }, [selectedId, locations]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
      aria-label="Store locations map"
    />
  );
}
