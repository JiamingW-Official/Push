import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function DraftsLoading() {
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
            width: "120px",
            marginBottom: "12px",
          }}
        />
        <div
          style={{
            ...skel,
            height: "52px",
            width: "180px",
            marginBottom: "8px",
          }}
        />
        <div style={{ ...skel, height: "10px", width: "220px" }} />
      </div>

      {/* Status pipeline — 4 count boxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "1px",
          margin: "20px 32px",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {["IN PROGRESS", "READY", "SUBMITTED", "OVERDUE"].map((label) => (
          <div
            key={label}
            style={{
              background: "#fff",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ ...skel, height: "9px", width: "70px" }} />
            <div style={{ ...skel, height: "32px", width: "40px" }} />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "0 32px 16px",
          alignItems: "center",
        }}
      >
        {[100, 80, 90, 80].map((w, i) => (
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
        <div
          style={{ ...skel, height: "28px", width: "60px", marginLeft: "auto" }}
        />
      </div>

      {/* Draft cards grid — 2 cols × 3 rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "0 32px 32px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid rgba(0,48,73,0.10)",
              overflow: "hidden",
            }}
          >
            {/* Thumbnail */}
            <div style={{ ...skel, height: "120px", width: "100%" }} />
            {/* Card body */}
            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  ...skel,
                  height: "11px",
                  width: "60px",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  ...skel,
                  height: "14px",
                  width: "85%",
                  marginBottom: "6px",
                }}
              />
              <div
                style={{
                  ...skel,
                  height: "10px",
                  width: "65%",
                  marginBottom: "12px",
                }}
              />
              {/* Progress bar */}
              <div
                style={{
                  height: "4px",
                  background: "rgba(0,48,73,0.08)",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    ...skel,
                    height: "4px",
                    width: `${40 + i * 12}%`,
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ ...skel, height: "9px", width: "50px" }} />
                <div style={{ ...skel, height: "9px", width: "60px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
