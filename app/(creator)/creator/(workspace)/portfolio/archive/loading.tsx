import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function ArchiveLoading() {
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

      {/* Hero */}
      <div style={{ padding: "28px 32px 0" }}>
        <div
          style={{
            ...skel,
            height: "11px",
            width: "100px",
            marginBottom: "12px",
          }}
        />
        <div
          style={{
            ...skel,
            height: "52px",
            width: "200px",
            marginBottom: "8px",
          }}
        />
        <div style={{ ...skel, height: "10px", width: "200px" }} />
      </div>

      {/* Stats bar — 3 KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1px",
          margin: "20px 32px",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "var(--surface-elevated)",
              padding: "18px 16px",
            }}
          >
            <div
              style={{
                ...skel,
                height: "9px",
                width: "70px",
                marginBottom: "10px",
              }}
            />
            <div style={{ ...skel, height: "36px", width: "80px" }} />
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: "8px", padding: "0 32px 16px" }}>
        {[70, 80, 80, 60].map((w, i) => (
          <div
            key={i}
            style={{
              ...skel,
              height: "28px",
              width: `${w}px`,
              borderRadius: "50vh",
            }}
          />
        ))}
      </div>

      {/* Year group + 6 campaign cards */}
      {[2026, 2025].map((year, yi) => (
        <div key={year} style={{ padding: "0 32px", marginBottom: "24px" }}>
          {/* Year header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(0,48,73,0.12)",
            }}
          >
            <div style={{ ...skel, height: "20px", width: "56px" }} />
            <div style={{ ...skel, height: "10px", width: "100px" }} />
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {Array.from({ length: yi === 0 ? 3 : 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid rgba(0,48,73,0.08)",
                  padding: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    ...skel,
                    height: "40px",
                    width: "40px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      ...skel,
                      height: "12px",
                      width: "80%",
                      marginBottom: "6px",
                    }}
                  />
                  <div
                    style={{
                      ...skel,
                      height: "10px",
                      width: "60%",
                      marginBottom: "8px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ ...skel, height: "18px", width: "48px" }} />
                    <div style={{ ...skel, height: "18px", width: "56px" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
