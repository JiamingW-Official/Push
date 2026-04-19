import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function EarningsLoading() {
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

      {/* KPI strip — 3 large number blocks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1px",
          margin: "28px 32px 0",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "var(--surface-elevated)",
              padding: "24px 20px",
            }}
          >
            <div
              style={{
                ...skel,
                height: "10px",
                width: "80px",
                marginBottom: "12px",
              }}
            />
            <div
              style={{
                ...skel,
                height: "44px",
                width: "120px",
                marginBottom: "8px",
              }}
            />
            <div style={{ ...skel, height: "9px", width: "60px" }} />
          </div>
        ))}
      </div>

      {/* Balance cards row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          margin: "16px 32px",
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              background: i === 0 ? "var(--dark)" : "var(--surface-elevated)",
              padding: "20px",
              border: "1px solid rgba(0,48,73,0.12)",
            }}
          >
            <div
              style={{
                ...skel,
                height: "10px",
                width: "90px",
                marginBottom: "12px",
                opacity: i === 0 ? 0.4 : 1,
              }}
            />
            <div
              style={{
                ...skel,
                height: "36px",
                width: "110px",
                marginBottom: "10px",
                opacity: i === 0 ? 0.4 : 1,
              }}
            />
            <div
              style={{
                ...skel,
                height: "32px",
                width: "120px",
                opacity: i === 0 ? 0.4 : 1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div
        style={{
          margin: "0 32px 20px",
          padding: "20px",
          background: "var(--surface-elevated)",
          border: "1px solid rgba(0,48,73,0.10)",
        }}
      >
        <div
          style={{
            ...skel,
            height: "12px",
            width: "140px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "4px",
            height: "80px",
          }}
        >
          {[40, 55, 35, 70, 60, 65, 80, 90, 50, 35, 75, 95].map((h, i) => (
            <div key={i} style={{ ...skel, height: `${h}%`, flex: 1 }} />
          ))}
        </div>
      </div>

      {/* Transaction list — 8 compact rows */}
      <div style={{ margin: "0 32px 32px" }}>
        <div
          style={{
            ...skel,
            height: "11px",
            width: "120px",
            marginBottom: "12px",
          }}
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 0",
              borderBottom: "1px solid rgba(0,48,73,0.07)",
            }}
          >
            <div
              style={{ ...skel, height: "32px", width: "32px", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...skel,
                  height: "11px",
                  width: "55%",
                  marginBottom: "5px",
                }}
              />
              <div style={{ ...skel, height: "9px", width: "35%" }} />
            </div>
            <div style={{ ...skel, height: "18px", width: "60px" }} />
            <div style={{ ...skel, height: "20px", width: "64px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
