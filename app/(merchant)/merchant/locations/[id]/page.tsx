"use client";

import { useState, useEffect, use } from "react";
import {
  MOCK_LOCATIONS,
  type Location,
  type BusinessHours,
} from "@/lib/merchant/mock-locations";
import "../locations.css";

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const IconBack = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polyline points="10,2 4,8 10,14" />
  </svg>
);

const IconQR = () => (
  <svg
    width="16"
    height="16"
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

const IconSquare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="4" height="4" fill="white" />
    <rect x="13" y="7" width="4" height="4" fill="white" />
    <rect x="7" y="13" width="4" height="4" fill="white" />
  </svg>
);

/* ── Scans by Hour data (mock) ──────────────────────────────────────────── */
const HOUR_LABELS = [
  "6a",
  "7a",
  "8a",
  "9a",
  "10a",
  "11a",
  "12p",
  "1p",
  "2p",
  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",
];
const HOUR_DATA = [1, 3, 9, 14, 11, 8, 16, 13, 10, 7, 9, 12, 8, 5, 2];
const HOUR_MAX = Math.max(...HOUR_DATA);

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOW_DATA = [22, 18, 24, 27, 41, 38, 19];
const DOW_MAX = Math.max(...DOW_DATA);

/* ── StatusBadge ────────────────────────────────────────────────────────── */
function CampaignStatusBadge({
  status,
}: {
  status: "active" | "closed" | "paused";
}) {
  return (
    <span className={`loc-status-badge loc-status-badge--${status}`}>
      {status}
    </span>
  );
}

/* ── MiniBarChart ───────────────────────────────────────────────────────── */
function MiniBarChart({
  data,
  labels,
  maxVal,
  color = "var(--tertiary)",
}: {
  data: number[];
  labels: string[];
  maxVal: number;
  color?: string;
}) {
  return (
    <div className="loc-mini-bars">
      {data.map((v, i) => (
        <div key={labels[i]} className="loc-mini-bar-group">
          <div
            className="loc-mini-bar"
            style={{
              height: `${Math.round((v / maxVal) * 100)}%`,
              background: color,
            }}
          />
          <div className="loc-mini-bar-tick">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

/* ── HoursTable (editable) ──────────────────────────────────────────────── */
function HoursTable({ initialHours }: { initialHours: BusinessHours[] }) {
  const [hours, setHours] = useState<BusinessHours[]>(initialHours);
  const [saved, setSaved] = useState(false);

  const update = (
    idx: number,
    field: keyof BusinessHours,
    value: string | boolean,
  ) => {
    setHours((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    );
    setSaved(false);
  };

  const handleSave = () => {
    /* Stub — would PATCH /api/merchant/locations/[id] */
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="loc-hours-table">
        {hours.map((row, i) => (
          <div key={row.day} className="loc-hours-row">
            <div className="loc-hours-row__day">{row.day}</div>
            <input
              type="time"
              className="loc-hours-input"
              value={row.open}
              disabled={row.closed}
              onChange={(e) => update(i, "open", e.target.value)}
              aria-label={`${row.day} open time`}
            />
            <input
              type="time"
              className="loc-hours-input"
              value={row.close}
              disabled={row.closed}
              onChange={(e) => update(i, "close", e.target.value)}
              aria-label={`${row.day} close time`}
            />
            <label className="loc-hours-closed-toggle">
              <input
                type="checkbox"
                checked={row.closed}
                onChange={(e) => update(i, "closed", e.target.checked)}
                aria-label={`${row.day} closed`}
              />
              Closed
            </label>
          </div>
        ))}
      </div>
      <button
        className="loc-hours-save-btn"
        onClick={handleSave}
        style={saved ? { background: "var(--tertiary)" } : undefined}
      >
        {saved ? "Saved" : "Save Hours"}
      </button>
    </div>
  );
}

/* ── Main Detail Page ───────────────────────────────────────────────────── */
export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [location, setLocation] = useState<Location | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  /* Load location */
  useEffect(() => {
    const loc = MOCK_LOCATIONS.find((l) => l.id === id) ?? null;
    setLocation(loc);
    if (loc) setScanCount(loc.qr_codes.reduce((s, q) => s + q.scans_today, 0));
  }, [id]);

  /* Simulate real-time counter tick */
  useEffect(() => {
    if (!location || location.status !== "open") return;
    const interval = setInterval(() => {
      /* Random tick every 4–8s to simulate live scans */
      if (Math.random() > 0.6) {
        setScanCount((n) => n + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [location]);

  if (!location) {
    return (
      <div className="loc-detail">
        <div
          style={{
            padding: "80px 40px",
            textAlign: "center",
            color: "var(--graphite)",
            fontFamily: "var(--font-body)",
          }}
        >
          Location not found.{" "}
          <a href="/merchant/locations" style={{ color: "var(--primary)" }}>
            Back to locations
          </a>
        </div>
      </div>
    );
  }

  const onShiftStaff = location.staff.filter((s) => s.on_shift);
  const activeQRs = location.qr_codes.filter((q) => q.active);

  return (
    <div className="loc-detail">
      {/* Back nav */}
      <div className="loc-back-nav">
        <a href="/merchant/locations" className="loc-back-link">
          <IconBack /> All Locations
        </a>
      </div>

      {/* Detail Hero */}
      <div className="loc-detail-hero">
        <div className="loc-detail-hero__left">
          <div className="loc-detail-hero__eyebrow">
            {location.neighborhood} ·{" "}
            <span
              style={{
                color:
                  location.status === "open"
                    ? "rgba(245,242,236,0.7)"
                    : "rgba(245,242,236,0.35)",
              }}
            >
              {location.status === "open" ? "Open Now" : "Currently Closed"}
            </span>
          </div>
          <div className="loc-detail-hero__name">{location.name}</div>
          <div className="loc-detail-hero__address">
            {location.address}, {location.city}, {location.state} {location.zip}
          </div>
        </div>
        <div className="loc-detail-hero__actions">
          <button
            className="loc-edit-btn"
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Body — two-column layout */}
      <div className="loc-detail-body">
        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="loc-detail-main">
          {/* 1. Live Operations */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Real-time</div>
                <div className="loc-section-title">
                  <span className="loc-live-dot" />
                  Live Operations
                </div>
              </div>
            </div>

            <div className="loc-ops-grid">
              <div className="loc-ops-cell">
                <div className="loc-ops-cell__label">Today&apos;s Scans</div>
                <div className="loc-ops-cell__value loc-ops-cell__value--live">
                  {scanCount}
                </div>
                <div className="loc-ops-cell__sub">updating live</div>
              </div>
              <div className="loc-ops-cell">
                <div className="loc-ops-cell__label">Active QR Codes</div>
                <div className="loc-ops-cell__value">{activeQRs.length}</div>
                <div className="loc-ops-cell__sub">
                  of {location.qr_codes.length} total
                </div>
              </div>
              <div className="loc-ops-cell">
                <div className="loc-ops-cell__label">On Shift Now</div>
                <div className="loc-ops-cell__value">{onShiftStaff.length}</div>
                <div className="loc-ops-cell__sub">
                  of {location.staff_count} staff
                </div>
              </div>
            </div>
          </section>

          {/* 2. Active QR Codes */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Attribution</div>
                <div className="loc-section-title">QR Codes</div>
              </div>
              <button
                className="loc-card__action-btn loc-card__action-btn--qr"
                style={{ padding: "8px 14px", fontSize: "11px" }}
                title="Add new QR Code"
              >
                + Add QR
              </button>
            </div>

            <div className="loc-qr-list">
              {location.qr_codes.map((qr) => (
                <div key={qr.id} className="loc-qr-item">
                  <div className="loc-qr-item__left">
                    <div className="loc-qr-icon">
                      <IconQR />
                    </div>
                    <div>
                      <div className="loc-qr-item__label">{qr.label}</div>
                      <span
                        className={`loc-qr-item__active-badge loc-qr-item__active-badge--${qr.active ? "on" : "off"}`}
                      >
                        {qr.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="loc-qr-item__right">
                    <div className="loc-qr-item__today">{qr.scans_today}</div>
                    <div className="loc-qr-item__total">
                      {qr.scans_total} total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Campaign History */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">History</div>
                <div className="loc-section-title">Campaign History</div>
              </div>
              <span
                style={{
                  fontSize: "var(--text-caption)",
                  color: "var(--graphite)",
                }}
              >
                {location.campaign_history.length} campaigns
              </span>
            </div>

            <div className="loc-campaign-table">
              <div className="loc-campaign-table__head">
                <div className="loc-campaign-table__head-cell">Campaign</div>
                <div className="loc-campaign-table__head-cell">Status</div>
                <div className="loc-campaign-table__head-cell">Creators</div>
                <div className="loc-campaign-table__head-cell">Scans</div>
                <div className="loc-campaign-table__head-cell">Revenue</div>
              </div>
              {location.campaign_history.map((c) => (
                <div key={c.id} className="loc-campaign-table__row">
                  <div>
                    <div className="loc-campaign-table__title">{c.title}</div>
                    <div className="loc-campaign-table__period">{c.period}</div>
                  </div>
                  <div>
                    <CampaignStatusBadge status={c.status} />
                  </div>
                  <div className="loc-campaign-table__num">{c.creators}</div>
                  <div className="loc-campaign-table__num">{c.scans}</div>
                  <div className="loc-campaign-table__rev">
                    ${c.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Analytics */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Insights</div>
                <div className="loc-section-title">Analytics</div>
              </div>
            </div>

            <div className="loc-analytics-row">
              <div className="loc-chart-box">
                <div className="loc-chart-box__label">Scans by Hour</div>
                <MiniBarChart
                  data={HOUR_DATA}
                  labels={HOUR_LABELS}
                  maxVal={HOUR_MAX}
                  color="var(--tertiary)"
                />
              </div>
              <div className="loc-chart-box">
                <div className="loc-chart-box__label">Scans by Day of Week</div>
                <MiniBarChart
                  data={DOW_DATA}
                  labels={DOW_LABELS}
                  maxVal={DOW_MAX}
                  color="var(--champagne)"
                />
              </div>
            </div>
          </section>

          {/* 5. Hours */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Operations</div>
                <div className="loc-section-title">Business Hours</div>
              </div>
            </div>
            <HoursTable initialHours={location.hours} />
          </section>
        </div>

        {/* ── Aside column ─────────────────────────────────────────────── */}
        <div className="loc-detail-aside">
          {/* Staff on shift */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">People</div>
                <div className="loc-section-title">Staff</div>
              </div>
            </div>

            <div className="loc-staff-list">
              {location.staff.map((member) => (
                <div key={member.id} className="loc-staff-item">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar_seed}`}
                    alt={member.name}
                    className="loc-staff-item__avatar"
                    width={32}
                    height={32}
                  />
                  <div className="loc-staff-item__info">
                    <div className="loc-staff-item__name">{member.name}</div>
                    <div className="loc-staff-item__role">{member.role}</div>
                  </div>
                  <span
                    className={`loc-staff-item__shift loc-staff-item__shift--${member.on_shift ? "on" : "off"}`}
                  >
                    {member.on_shift ? "On shift" : "Off"}
                  </span>
                </div>
              ))}
            </div>

            <div className="loc-staff-actions">
              <button className="loc-staff-btn loc-staff-btn--invite">
                Invite Staff
              </button>
            </div>
          </section>

          {/* POS Integration */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Integrations</div>
                <div className="loc-section-title">POS</div>
              </div>
            </div>

            <div className="loc-pos-list">
              {location.pos_integrations.map((pos) => (
                <div key={pos.name} className="loc-pos-item">
                  <div>
                    <div className="loc-pos-item__name">
                      {pos.connected && (
                        <span className="loc-pos-connected-dot" />
                      )}
                      {pos.name}
                    </div>
                    <div className="loc-pos-item__sync">
                      {pos.connected && pos.last_sync
                        ? `Last sync ${new Date(pos.last_sync).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                        : pos.connected
                          ? "Connected"
                          : "Not connected"}
                    </div>
                  </div>
                  <button
                    className={`loc-pos-connect-btn loc-pos-connect-btn--${pos.connected ? "connected" : "disconnected"}`}
                    onClick={() => {
                      /* Stub — would open OAuth flow */
                      alert(
                        `Connect to ${pos.name} — integration coming soon.`,
                      );
                    }}
                  >
                    {pos.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: "var(--text-caption)",
                color: "var(--graphite)",
                lineHeight: 1.5,
              }}
            >
              Connect your POS to sync revenue data and attribution
              automatically.
            </div>
          </section>

          {/* Store info card */}
          <section>
            <div className="loc-section-header">
              <div>
                <div className="loc-section-eyebrow">Contact</div>
                <div className="loc-section-title">Store Info</div>
              </div>
            </div>

            <div
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid rgba(0,48,73,0.1)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                { label: "Phone", value: location.phone },
                { label: "Email", value: location.email },
                {
                  label: "Address",
                  value: `${location.address}, ${location.city}, ${location.state} ${location.zip}`,
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--graphite)",
                      marginBottom: 3,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-small)",
                      color: "var(--dark)",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
