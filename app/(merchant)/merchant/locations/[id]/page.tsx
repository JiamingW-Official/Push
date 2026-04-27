"use client";

import { useState, useEffect, use } from "react";
import {
  MOCK_LOCATIONS,
  type Location,
  type BusinessHours,
} from "@/lib/merchant/mock-locations";
import "../locations.css";

/* -- SVG Icons -------------------------------------------------------------------- */
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

/* -- Mock scan data --------------------------------------------------------------- */
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

/* -- Campaign status chip --------------------------------------------------------- */
function CampaignStatusChip({
  status,
}: {
  status: "active" | "closed" | "paused";
}) {
  return (
    <span className={`loc-campaign-status loc-campaign-status--${status}`}>
      {status.toUpperCase()}
    </span>
  );
}

/* -- Mini bar chart --------------------------------------------------------------- */
function MiniBarChart({
  data,
  labels,
  maxVal,
  color = "var(--ink-4)",
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
              background: color,
              height: `${Math.round((v / maxVal) * 100)}%`,
            }}
          />
          <span className="loc-mini-bar-tick">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* -- Hours table (editable) ------------------------------------------------------- */
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
      <div className="loc-table">
        {hours.map((row, i) => (
          <div
            key={row.day}
            className="loc-hours-row"
            style={{
              background: row.closed ? "var(--surface-2)" : "var(--surface)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                color: row.closed ? "var(--ink-4)" : "var(--ink)",
                width: 40,
                flexShrink: 0,
              }}
            >
              {row.day}
            </span>
            <input
              type="time"
              className="loc-hours-input"
              style={{ opacity: row.closed ? 0.4 : 1 }}
              value={row.open}
              disabled={row.closed}
              onChange={(e) => update(i, "open", e.target.value)}
              aria-label={`${row.day} open time`}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              –
            </span>
            <input
              type="time"
              className="loc-hours-input"
              style={{ opacity: row.closed ? 0.4 : 1 }}
              value={row.close}
              disabled={row.closed}
              onChange={(e) => update(i, "close", e.target.value)}
              aria-label={`${row.day} close time`}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: "auto",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={row.closed}
                onChange={(e) => update(i, "closed", e.target.checked)}
                aria-label={`${row.day} closed`}
                style={{ accentColor: "var(--ink)", cursor: "pointer" }}
              />
              Closed
            </label>
          </div>
        ))}
      </div>
      <button
        className="click-shift"
        onClick={handleSave}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          fontSize: 12,
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: 8,
          border: "none",
          background: saved ? "var(--ink-4)" : "var(--brand-red)",
          color: "var(--snow)",
          transition: "background 0.2s, transform 180ms",
        }}
      >
        {saved ? "Saved" : "Save Hours"}
      </button>
    </div>
  );
}

/* -- Section card wrapper --------------------------------------------------------- */
function Card({ children }: { children: React.ReactNode }) {
  return <div className="loc-card-section">{children}</div>;
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="loc-section-header">
      <div>
        <div className="loc-section-eyebrow">{eyebrow}</div>
        <div className="loc-section-title">{title}</div>
      </div>
      {action}
    </div>
  );
}

/* -- Main detail page ------------------------------------------------------------- */
export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [location, setLocation] = useState<Location | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loc = MOCK_LOCATIONS.find((l) => l.id === id) ?? null;
    setLocation(loc);
    if (loc) setScanCount(loc.qr_codes.reduce((s, q) => s + q.scans_today, 0));
  }, [id]);

  /* Simulate live scan counter */
  useEffect(() => {
    if (!location || location.status !== "open") return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) setScanCount((n) => n + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [location]);

  if (!location) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          fontFamily: "var(--font-body)",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          Location not found.
        </span>
        <a
          href="/merchant/locations"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--accent-blue)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to locations
        </a>
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
          ← All Locations
        </a>
      </div>

      {/* Location header */}
      <div className="loc-detail-header">
        <div className="loc-detail-header__inner">
          <div>
            <div className="loc-detail-header__eyebrow">
              {location.neighborhood} ·{" "}
              <span
                style={{
                  color:
                    location.status === "open"
                      ? "var(--accent-blue)"
                      : "var(--ink-4)",
                }}
              >
                {location.status === "open" ? "Open Now" : "Currently Closed"}
              </span>
            </div>
            <h1 className="loc-detail-header__name">{location.name}</h1>
            <p className="loc-detail-header__address">
              {location.address}, {location.city}, {location.state}{" "}
              {location.zip}
            </p>
          </div>
          <button
            className="click-shift"
            onClick={() => setEditMode((v) => !v)}
            style={{
              padding: "10px 20px",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 8,
              border: "1px solid var(--hairline)",
              background: editMode ? "var(--ink)" : "transparent",
              color: editMode ? "var(--snow)" : "var(--ink)",
              transition: "all 0.15s, transform 180ms",
            }}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Body — two-column */}
      <div className="loc-detail-body">
        {/* Main column */}
        <div className="loc-detail-main">
          {/* 1. Live Operations */}
          <Card>
            <SectionHeader eyebrow="Real-time" title="Live Operations" />
            <div className="loc-ops-grid">
              {[
                {
                  label: "Today's Scans",
                  value: scanCount,
                  sub: "updating live",
                  live: true,
                },
                {
                  label: "Active QR Codes",
                  value: activeQRs.length,
                  sub: `of ${location.qr_codes.length} total`,
                },
                {
                  label: "On Shift Now",
                  value: onShiftStaff.length,
                  sub: `of ${location.staff_count} staff`,
                },
              ].map((cell) => (
                <div key={cell.label} className="loc-ops-cell">
                  <div className="loc-ops-cell__label">{cell.label}</div>
                  <div
                    className={`loc-ops-cell__value${cell.live ? " loc-ops-cell__value--live" : ""}`}
                  >
                    {cell.live && <span className="loc-live-dot" />}
                    {cell.value}
                  </div>
                  <div className="loc-ops-cell__sub">{cell.sub}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. QR Codes */}
          <Card>
            <SectionHeader
              eyebrow="Attribution"
              title="QR Codes"
              action={
                <button
                  className="click-shift"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: 6,
                    border: "1px solid var(--hairline)",
                    background: "transparent",
                    color: "var(--ink-4)",
                    transition: "transform 180ms",
                  }}
                >
                  + Add QR
                </button>
              }
            />
            <div className="loc-table">
              {location.qr_codes.map((qr) => (
                <div key={qr.id} className="loc-table__row">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: "var(--surface-2)",
                      border: "1px solid var(--hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    <IconQR />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginBottom: 4,
                      }}
                    >
                      {qr.label}
                    </div>
                    <span
                      className={`loc-qr-badge loc-qr-badge--${qr.active ? "active" : "inactive"}`}
                    >
                      {qr.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {qr.scans_today}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      {qr.scans_total} total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Campaign history */}
          <Card>
            <SectionHeader
              eyebrow="History"
              title="Campaign History"
              action={
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                  }}
                >
                  {location.campaign_history.length} campaigns
                </span>
              }
            />
            <div className="loc-table">
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 80px 80px 100px",
                  gap: 16,
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--hairline)",
                  background: "var(--surface)",
                }}
              >
                {["Campaign", "Status", "Creators", "Scans", "Revenue"].map(
                  (h) => (
                    <div
                      key={h}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                      }}
                    >
                      {h}
                    </div>
                  ),
                )}
              </div>
              {location.campaign_history.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 100px 80px 80px 100px",
                    gap: 16,
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--hairline)",
                    alignItems: "center",
                    background: "var(--surface)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginBottom: 2,
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      {c.period}
                    </div>
                  </div>
                  <div>
                    <CampaignStatusChip status={c.status} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {c.creators}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {c.scans}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    ${c.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Analytics */}
          <Card>
            <SectionHeader eyebrow="Insights" title="Analytics" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {[
                {
                  label: "Scans by Hour",
                  data: HOUR_DATA,
                  labels: HOUR_LABELS,
                  max: HOUR_MAX,
                  color: "var(--ink-4)",
                },
                {
                  label: "Scans by Day of Week",
                  data: DOW_DATA,
                  labels: DOW_LABELS,
                  max: DOW_MAX,
                  color: "var(--accent-blue)",
                },
              ].map((chart) => (
                <div
                  key={chart.label}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--ink-4)",
                      marginBottom: 12,
                    }}
                  >
                    {chart.label}
                  </div>
                  <MiniBarChart
                    data={chart.data}
                    labels={chart.labels}
                    maxVal={chart.max}
                    color={chart.color}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Business hours */}
          <Card>
            <SectionHeader eyebrow="Operations" title="Business Hours" />
            <HoursTable initialHours={location.hours} />
          </Card>
        </div>

        {/* Aside column */}
        <div className="loc-detail-aside">
          {/* Staff */}
          <Card>
            <SectionHeader eyebrow="People" title="Staff" />
            <div className="loc-table" style={{ marginBottom: 12 }}>
              {location.staff.map((member) => (
                <div key={member.id} className="loc-table__row">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar_seed}`}
                    alt={member.name}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                    width={28}
                    height={28}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {member.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      {member.role}
                    </div>
                  </div>
                  <span
                    className={`loc-shift-chip loc-shift-chip--${member.on_shift ? "on" : "off"}`}
                  >
                    {member.on_shift ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="click-shift"
              style={{
                width: "100%",
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
                transition: "transform 180ms",
              }}
            >
              Invite Staff
            </button>
          </Card>

          {/* POS Integration */}
          <Card>
            <SectionHeader eyebrow="Integrations" title="POS" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {location.pos_integrations.map((pos) => (
                <div
                  key={pos.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 16px",
                    background: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginBottom: 3,
                      }}
                    >
                      {pos.connected && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent-blue)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {pos.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      {pos.connected && pos.last_sync
                        ? `Last sync ${new Date(pos.last_sync).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                        : pos.connected
                          ? "Connected"
                          : "Not connected"}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      alert(`Connect to ${pos.name} — integration coming soon.`)
                    }
                    className="click-shift"
                    style={{
                      padding: "7px 14px",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: 6,
                      border: pos.connected
                        ? "1px solid var(--hairline)"
                        : "none",
                      background: pos.connected
                        ? "var(--surface-2)"
                        : "var(--brand-red)",
                      color: pos.connected ? "var(--ink-4)" : "var(--snow)",
                      transition: "transform 180ms",
                    }}
                  >
                    {pos.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Connect your POS to sync revenue data and attribution
              automatically.
            </p>
          </Card>

          {/* Store info */}
          <Card>
            <SectionHeader eyebrow="Contact" title="Store Info" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--ink-4)",
                      marginBottom: 3,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink)",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
