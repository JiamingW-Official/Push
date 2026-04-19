"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

type Pin = {
  id: string;
  title: string;
  business_name: string;
  payout: number;
  lat: number;
  lng: number;
  spots_remaining: number;
};

type Props = {
  center: [number, number];
  pins: Pin[];
  neighborhoodName: string;
};

const MONO_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MONO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function makeCenterPin() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 16px;
      height: 16px;
      background: #c1121f;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(193,18,31,0.4);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
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

export default function NeighborhoodDetailMap({
  center,
  pins,
  neighborhoodName,
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer attribution={MONO_ATTR} url={MONO_TILES} />
      <ZoomControls />

      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={makeCenterPin()}>
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
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "var(--dark, #003049)",
                  marginBottom: 4,
                }}
              >
                {neighborhoodName}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--graphite, #4a5568)",
                }}
              >
                {p.spots_remaining} active campaign
                {p.spots_remaining !== 1 ? "s" : ""}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
