"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

type Pin = {
  id: string;
  name: string;
  borough: string;
  lat: number;
  lng: number;
  activeCampaigns: number;
  slug: string;
};

type Props = {
  pins: Pin[];
};

// Monochromatic CARTO tile
const MONO_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MONO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// NYC center
const NYC_CENTER: [number, number] = [40.7282, -73.9942];

function makeNeighborhoodPin(activeCampaigns: number) {
  const color =
    activeCampaigns > 25
      ? "#c1121f"
      : activeCampaigns > 15
        ? "#669bbc"
        : "#003049";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -8],
  });
}

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

export default function NeighborhoodsMap({ pins }: Props) {
  return (
    <MapContainer
      center={NYC_CENTER}
      zoom={11}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer attribution={MONO_ATTR} url={MONO_TILES} />
      <ZoomControls />

      {pins.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={makeNeighborhoodPin(p.activeCampaigns)}
        >
          <Popup closeButton={false}>
            <div
              style={{
                fontFamily: "var(--font-body, monospace)",
                minWidth: 160,
                padding: "4px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "var(--dark, #003049)",
                  marginBottom: 2,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--graphite, #4a5568)",
                  marginBottom: 8,
                }}
              >
                {p.borough}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--tertiary, #669bbc)",
                  marginBottom: 8,
                }}
              >
                {p.activeCampaigns} active campaign
                {p.activeCampaigns !== 1 ? "s" : ""}
              </div>
              <Link
                href={`/neighborhoods/${p.slug}`}
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--primary, #c1121f)",
                  textDecoration: "none",
                }}
              >
                View neighborhood →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
