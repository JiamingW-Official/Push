"use client";

import { useEffect, useRef } from "react";

type Props = {
  lat: number;
  lng: number;
  name: string;
};

export default function MerchantMap({ lat, lng, name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.default.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      mapRef.current = map;

      L.default
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
          },
        )
        .addTo(map);

      // Custom pin using brand color
      const pinIcon = L.default.divIcon({
        html: `<div style="
          width:14px;height:14px;
          background:#c1121f;
          border:3px solid #003049;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,48,73,0.3);
        "></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.default
        .marker([lat, lng], { icon: pinIcon })
        .addTo(map)
        .bindPopup(
          `<strong style="font-family:sans-serif;font-size:13px">${name}</strong>`,
        );
    });

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: "320px" }}
      aria-label={`Map showing location of ${name}`}
    />
  );
}
