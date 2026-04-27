"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MOCK_LOCATIONS, type Location } from "@/lib/merchant/mock-locations";
import "./locations.css";

/* -- Leaflet map — dynamic import (no SSR) ---------------------------------------- */
const LocationsMap = dynamic(() => import("./LocationsMap"), { ssr: false });

/* -- SVG Icons -------------------------------------------------------------------- */
const IconGrid = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const IconMap = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polygon points="1,3 6,1 10,3 15,1 15,13 10,15 6,13 1,15" />
    <line x1="6" y1="1" x2="6" y2="13" />
    <line x1="10" y1="3" x2="10" y2="15" />
  </svg>
);

const IconQR = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="1" width="5" height="5" />
    <rect x="2" y="2" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="10" y="1" width="5" height="5" />
    <rect x="11" y="2" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="1" y="10" width="5" height="5" />
    <rect x="2" y="11" width="3" height="3" fill="currentColor" stroke="none" />
    <line x1="10" y1="10" x2="12" y2="10" />
    <line x1="10" y1="10" x2="10" y2="12" />
    <line x1="13" y1="10" x2="15" y2="10" />
    <line x1="13" y1="12" x2="15" y2="12" />
    <line x1="10" y1="13" x2="12" y2="13" />
    <line x1="12" y1="15" x2="15" y2="15" />
  </svg>
);

/* -- Location card ---------------------------------------------------------------- */
function LocationCard({ location }: { location: Location }) {
  return (
    <div className="loc-card">
      {/* Image */}
      <div className="loc-card__img-wrap">
        {location.image_url ? (
          <img
            src={location.image_url}
            alt={location.name}
            className="loc-card__img"
            loading="lazy"
          />
        ) : (
          <div className="loc-card__img-placeholder">
            <span>No Image</span>
          </div>
        )}
        <div className="loc-card__status-badge">
          <span
            className={`loc-status-chip loc-status-chip--${location.status}`}
          >
            {location.status === "open" ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="loc-card__body">
        <div>
          <div className="loc-card__name">{location.name}</div>
          <div className="loc-card__neighborhood">{location.neighborhood}</div>
        </div>

        {/* Stats */}
        <div className="loc-card__stats">
          {[
            { value: location.scans_7d, label: "7d Scans" },
            { value: location.conversions_30d, label: "30d Conv." },
            { value: location.staff_count, label: "Staff" },
          ].map((s) => (
            <div key={s.label}>
              <div className="loc-card__stat-value">{s.value}</div>
              <div className="loc-card__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Campaign */}
        <div className="loc-card__campaign">
          <div className="loc-card__campaign-eyebrow">Campaign</div>
          {location.primary_campaign_title ? (
            <div className="loc-card__campaign-title">
              {location.primary_campaign_title}
            </div>
          ) : null}
          {location.primary_campaign_status ? (
            <div
              className={`loc-campaign-chip loc-campaign-chip--${
                location.primary_campaign_status === "active"
                  ? "active"
                  : "inactive"
              }`}
            >
              <span className="loc-campaign-chip__dot" />
              {location.primary_campaign_status.charAt(0).toUpperCase() +
                location.primary_campaign_status.slice(1)}
            </div>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              No active campaign
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="loc-card__actions">
          <a
            href={`/merchant/locations/${location.id}`}
            className="click-shift"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 8,
              border: "none",
              background: "var(--brand-red)",
              color: "var(--snow)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 180ms",
            }}
          >
            View
          </a>
          <a
            href={`/merchant/locations/${location.id}?tab=edit`}
            className="click-shift"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 8,
              border: "1px solid var(--hairline)",
              background: "transparent",
              color: "var(--ink)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 180ms",
            }}
          >
            Edit
          </a>
          <button
            title="Add QR Code"
            className="click-shift"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px solid var(--hairline)",
              background: "transparent",
              color: "var(--ink-4)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "transform 180ms",
            }}
          >
            <IconQR />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -- Add Location Modal ----------------------------------------------------------- */
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
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

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
          <span id="modal-title" className="loc-modal__title">
            Add Location
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="loc-modal__close"
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
              onClick={onClose}
              className="click-shift"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "1px solid var(--hairline)",
                background: "transparent",
                color: "var(--ink)",
                transition: "transform 180ms",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="click-shift"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
                opacity: submitting ? 0.7 : 1,
                transition: "transform 180ms",
              }}
            >
              {submitting ? "Adding…" : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -- Main Page -------------------------------------------------------------------- */
export default function LocationsPage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openCount = locations.filter((l) => l.status === "open").length;
  const totalScans = locations.reduce((s, l) => s + l.scans_7d, 0);
  const activeCampaigns = locations.filter(
    (l) => l.primary_campaign_status === "active",
  ).length;

  const handleAdd = useCallback((loc: Location) => {
    setLocations((prev) => [loc, ...prev]);
  }, []);

  return (
    <div className="loc-page">
      {/* Back nav */}
      <nav className="loc-back-nav">
        <Link href="/merchant/dashboard" className="loc-back-link">
          ← Dashboard
        </Link>
      </nav>

      {/* Page header */}
      <header className="loc-header">
        <div className="loc-header__inner">
          <div className="loc-header__row">
            <h1 className="loc-header__title">
              Locations
              <span className="loc-header__count">{locations.length}</span>
            </h1>
            <button
              className="click-shift"
              onClick={() => setShowModal(true)}
              style={{
                padding: "12px 24px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
                transition: "transform 180ms",
              }}
            >
              + Add Location
            </button>
          </div>

          {/* Stats */}
          <div className="loc-stats">
            {[
              { value: openCount, label: "Open now" },
              { value: totalScans, label: "Scans this week" },
              { value: activeCampaigns, label: "Active campaigns" },
            ].map((s) => (
              <div key={s.label} className="loc-stat-card">
                <div className="loc-stat-card__value">{s.value}</div>
                <div className="loc-stat-card__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* View toggle */}
      <div className="loc-toolbar">
        {(["grid", "map"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className="loc-view-btn"
          >
            {v === "grid" ? <IconGrid /> : <IconMap />}
            {v === "grid" ? "Grid" : "Map"}
          </button>
        ))}
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
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
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
