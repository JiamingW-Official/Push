import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function CalendarLoading() {
  return (
    <div style={{ background: "var(--surface,#f5f2ec)", minHeight: "100vh" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Nav */}
      <div
        style={{
          height: "48px",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "12px",
        }}
      >
        <div style={{ ...skel, height: "14px", width: "110px" }} />
        <div
          style={{ ...skel, height: "14px", width: "70px", marginLeft: "auto" }}
        />
      </div>

      {/* Main layout: calendar left + side panel right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "0",
          height: "calc(100vh - 48px)",
        }}
      >
        {/* Calendar panel */}
        <div
          style={{
            padding: "24px 24px 0",
            borderRight: "1px solid rgba(0,48,73,0.12)",
          }}
        >
          {/* Month header + nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ ...skel, height: "32px", width: "28px" }} />
            <div style={{ ...skel, height: "28px", width: "160px" }} />
            <div style={{ ...skel, height: "32px", width: "28px" }} />
          </div>

          {/* View toggle */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "16px",
              justifyContent: "flex-end",
            }}
          >
            {[60, 60, 60].map((w, i) => (
              <div
                key={i}
                style={{ ...skel, height: "28px", width: `${w}px` }}
              />
            ))}
          </div>

          {/* Weekday header row — 7 cols */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "1px",
              marginBottom: "1px",
            }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...skel,
                  height: "28px",
                }}
              />
            ))}
          </div>

          {/* 5-week grid — 35 cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "1px",
              background: "rgba(0,48,73,0.06)",
            }}
          >
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "80px",
                  background: i % 9 === 0 ? "rgba(0,48,73,0.03)" : "#fff",
                  padding: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ ...skel, height: "16px", width: "24px" }} />
                {i % 4 === 1 && (
                  <div style={{ ...skel, height: "12px", width: "80%" }} />
                )}
                {i % 5 === 2 && (
                  <div style={{ ...skel, height: "12px", width: "70%" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div
          style={{
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ ...skel, height: "14px", width: "120px" }} />
          {[100, 80, 90, 80, 80].map((h, i) => (
            <div
              key={i}
              style={{
                ...skel,
                height: `${h}px`,
                width: "100%",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
