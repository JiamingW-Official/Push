import React from "react";
import "./inbox.css";

/* ── Inbox Loading Skeleton ──────────────────────────────── */

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,var(--surface-3) 25%,var(--mist) 50%,var(--surface-3) 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.4s infinite linear",
};

export default function InboxLoading() {
  return (
    <div className="inbox-page">
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* Nav skeleton */}
      <header className="inbox-nav">
        <div style={{ ...skel, height: "13px", width: "80px" }} />
        <div style={{ ...skel, height: "28px", width: "120px", flex: 1 }} />
        <div style={{ ...skel, height: "10px", width: "40px" }} />
      </header>

      {/* Tabs skeleton */}
      <nav className="inbox-tabs">
        {[80, 64, 64].map((w, i) => (
          <div
            key={i}
            style={{
              ...skel,
              height: "13px",
              width: `${w}px`,
              margin: "0 20px",
              alignSelf: "center",
            }}
          />
        ))}
      </nav>

      {/* Thread row skeletons */}
      <div className="inbox-list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="inbox-row"
            style={{ cursor: "default", animationDelay: `${i * 40}ms` }}
          >
            {/* Avatar */}
            <div
              style={{
                ...skel,
                width: "40px",
                height: "40px",
                flexShrink: 0,
              }}
            />
            {/* Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  ...skel,
                  height: "13px",
                  width: `${50 + (i % 3) * 10}%`,
                }}
              />
              <div
                style={{
                  ...skel,
                  height: "11px",
                  width: `${60 + (i % 4) * 8}%`,
                }}
              />
            </div>
            {/* Timestamp */}
            <div
              style={{ ...skel, height: "10px", width: "40px", flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
