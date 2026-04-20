"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { MOCK_LOCATIONS, type Location } from "@/lib/merchant/mock-locations";
import "../locations/locations.css";

/* ── Leaflet map — dynamic import (no SSR) ──────────────────────────────── */
const LocationsMap = dynamic(() => import("./LocationsMap"), { ssr: false });

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const IconGrid = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const IconMap = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="1,3 6,1 10,3 15,1 15,13 10,15 6,13 1,15" />
    <line x1="6" y1="1" x2="6" y2="13" />
    <line x1="10" y1="3" x2="10" y2="15" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="2" x2="8" y2="14" />
    <line x1="2" y1="8" x2="14" y2="8" />
  </svg>
);

const IconQR = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="5" height="5" />
    <rect x="2" y="2" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="10" y="1" width="5" height="5" />
    <rect x="11" y="2" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="1" y="10" width="5" height="5" />
    <rect x="2" y="11" width="3" height="3" fill="currentColor" stroke="none" />
    <line x1="10" y1="10" x2="10" y2="10" strokeWidth="2.5" />
    <line x1="13" y1="10" x2="13" y2="10" strokeWidth="2.5" />
    <line x1="15" y1="13" x2="15" y2="13" strokeWidth="2.5" />
    <line x1="10" y1="13" x2="12" y2="13" />
    <line x1="10" y1="10" x2="10" y2="12" />
    <line x1="13" y1="10" x2="15" y2="10" />
    <line x1="13" y1="12" x2="15" y2="12" />
    <line x1="12" y1="15" x2="15" y2="15" />
  </svg>
);

/* ── LocationCard ────────────────────────────────────────────────────────── */
function LocationCard({
  location,
  style,
}: {
  location: Location;
  style?: React.CSSProperties;
}) {
  const campaignStatusClass = location.primary_campaign_status
    ? `loc-card__campaign--${location.primary_campaign_status}`
    : "loc-card__campaign--closed";

  const dotClass = location.primary_campaign_status
    ? `loc-card__campaign-dot--${location.primary_campaign_status}`
    : "loc-card__campaign-dot--closed";

  return (
    <div className="loc-card" style={style}>
      {/* Store image */}
      <div className="loc-card__img-wrap">
        {location.image_url ? (
          <img
            src={location.image_url}
            alt={location.name}
            className="loc-card__img"
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(0,48,73,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(0,48,73,0.25)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            No Image
          </div>
        )}
        <span
          className={`loc-card__status-badge loc-card__status-badge--${location.status}`}
        >
          {location.status === "open" ? "Open" : "Closed"}
        </span>
      </div>

      {/* Body */}
      <div className="loc-card__body">
        <div className="loc-card__header">
          <div>
            <div className="loc-card__name">{location.name}</div>
            <div className="loc-card__neighborhood">
              {location.neighborhood}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="loc-card__stats">
          <div className="loc-card__stat">
            <div className="loc-card__stat-value">{location.scans_7d}</div>
            <div className="loc-card__stat-label">7d Scans</div>
          </div>
          <div className="loc-card__stat">
            <div className="loc-card__stat-value">
              {location.conversions_30d}
            </div>
            <div className="loc-card__stat-label">30d Conv.</div>
          </div>
          <div className="loc-card__stat">
            <div className="loc-card__stat-value">{location.staff_count}</div>
            <div className="loc-card__stat-label">Staff</div>
          </div>
        </div>

        {/* Primary campaign */}
        {location.primary_campaign_title ? (
          <div className={`loc-card__campaign ${campaignStatusClass}`}>
            <div className={`loc-card__campaign-dot ${dotClass}`} />
            <div className="loc-card__campaign-title">
              {location.primary_campaign_title}
            </div>
            <div className="loc-card__campaign-status">
              {location.primary_campaign_status}
            </div>
          </div>
        ) : (
          <div className="loc-card__campaign loc-card__campaign--closed">
            <div className="loc-card__campaign-dot loc-card__campaign-dot--closed" />
            <div
              className="loc-card__campaign-title"
              style={{ color: "rgba(0,48,73,0.35)" }}
            >
              No active campaign
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="loc-card__actions">
          <a
            href={`/merchant/locations/${location.id}`}
            className="loc-card__action-btn loc-card__action-btn--primary"
          >
            View
          </a>
          <a
            href={`/merchant/locations/${location.id}?tab=edit`}
            className="loc-card__action-btn loc-card__action-btn--secondary"
          >
            Edit
          </a>
          <button
            className="loc-card__action-btn loc-card__action-btn--qr"
            title="Add QR Code"
          >
            <IconQR />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── AddLocationModal ────────────────────────────────────────────────────── */
function AddLocationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (loc: Location) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    neighborhood: "",
    address: "",
    city: "New York",
    state: "NY",
    zip: "",
    phone: "",
    email: "",
    hours_open: "09:00",
    hours_close: "18:00",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/merchant/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.location) onAdd(data.location);
      onClose();
    } catch {
      // stub — close anyway
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="loc-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="loc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="loc-modal__header">
          <div className="loc-modal__title" id="modal-title">
            Add Location
          </div>
          <button
            className="loc-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="loc-modal__body">
            <div className="loc-form-group">
              <label className="loc-form-label" htmlFor="name">
                Store Name
              </label>
              <input
                id="name"
                name="name"
                className="loc-form-input"
                placeholder="e.g. Blank Street — Astoria"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="loc-modal__row">
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="neighborhood">
                  Neighborhood
                </label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  className="loc-form-input"
                  placeholder="e.g. Astoria"
                  value={form.neighborhood}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="zip">
                  ZIP Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  className="loc-form-input"
                  placeholder="11103"
                  value={form.zip}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="loc-form-group">
              <label className="loc-form-label" htmlFor="address">
                Street Address
              </label>
              <input
                id="address"
                name="address"
                className="loc-form-input"
                placeholder="31-10 Broadway"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="loc-modal__row">
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className="loc-form-input"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="state">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  className="loc-form-select"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="NY">NY</option>
                  <option value="NJ">NJ</option>
                  <option value="CT">CT</option>
                </select>
              </div>
            </div>

            <div className="loc-modal__row">
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="loc-form-input"
                  placeholder="(212) 555-0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="email">
                  Location Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="loc-form-input"
                  placeholder="location@brand.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="loc-modal__row">
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="hours_open">
                  Default Open
                </label>
                <input
                  id="hours_open"
                  name="hours_open"
                  type="time"
                  className="loc-form-input"
                  value={form.hours_open}
                  onChange={handleChange}
                />
              </div>
              <div className="loc-form-group">
                <label className="loc-form-label" htmlFor="hours_close">
                  Default Close
                </label>
                <input
                  id="hours_close"
                  name="hours_close"
                  type="time"
                  className="loc-form-input"
                  value={form.hours_close}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="loc-modal__footer">
            <button
              type="button"
              className="loc-modal__cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="loc-modal__submit"
              disabled={submitting}
            >
              {submitting ? "Adding…" : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function LocationsPage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openCount = locations.filter((l) => l.status === "open").length;
  const totalScans = locations.reduce((s, l) => s + l.scans_7d, 0);

  const handleAdd = useCallback((loc: Location) => {
    setLocations((prev) => [loc, ...prev]);
  }, []);

  return (
    <div className="loc-page">
      {/* Hero */}
      <div className="loc-hero">
        <div className="loc-hero__eyebrow">Multi-Location</div>
        <div>
          <span className="loc-hero__title">Locations.</span>
          <span className="loc-hero__count">{locations.length}</span>
        </div>
        <div className="loc-hero__meta">
          <span className="loc-hero__stat">
            <strong>{openCount}</strong> open now
          </span>
          <span className="loc-hero__stat">
            <strong>{totalScans}</strong> scans this week
          </span>
          <span className="loc-hero__stat">
            <strong>
              {
                locations.filter((l) => l.primary_campaign_status === "active")
                  .length
              }
            </strong>{" "}
            active campaigns
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="loc-toolbar">
        <div className="loc-view-toggle" role="group" aria-label="View mode">
          <button
            className={`loc-view-toggle__btn${view === "grid" ? " active" : ""}`}
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <IconGrid /> Grid
          </button>
          <button
            className={`loc-view-toggle__btn${view === "map" ? " active" : ""}`}
            onClick={() => setView("map")}
            aria-pressed={view === "map"}
          >
            <IconMap /> Map
          </button>
        </div>

        <button className="loc-add-btn" onClick={() => setShowModal(true)}>
          <IconPlus /> Add Location
        </button>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="loc-map-container">
          <LocationsMap
            locations={locations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      )}

      {/* Grid view */}
      <div className="loc-grid-section">
        <div className="loc-grid">
          {locations.map((loc, i) => (
            <LocationCard
              key={loc.id}
              location={loc}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <AddLocationModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
