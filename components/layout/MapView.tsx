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
    ? makePillIcon(c.payout, isActive)
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
                  style={{ background: "var(--dark)" }}
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
