import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function PipelineLoading() {
  return (
    <div
      style={{
        background: "var(--surface,#f5f2ec)",
        minHeight: "100vh",
      }}
    >
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Nav */}
      <div
        style={{
          height: "48px",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 24px",
        }}
      >
        <div style={{ ...skel, height: "14px", width: "110px" }} />
        <div
          style={{ ...skel, height: "14px", width: "70px", marginLeft: "auto" }}
        />
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "32px 32px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              ...skel,
              height: "11px",
              width: "140px",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              ...skel,
              height: "56px",
              width: "200px",
              marginBottom: "10px",
            }}
          />
          <div
            style={{
              ...skel,
              height: "11px",
              width: "160px",
              marginBottom: "6px",
            }}
          />
          <div style={{ ...skel, height: "10px", width: "240px" }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              ...skel,
              height: "10px",
              width: "120px",
              marginBottom: "8px",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              ...skel,
              height: "44px",
              width: "100px",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>

      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          gap: "1px",
          margin: "20px 32px 0",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[80, 80, 80, 100].map((w, i) => (
          <div key={i} style={{ ...skel, height: "36px", width: `${w}px` }} />
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px 32px",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[90, 70, 80, 70, 90, 80].map((w, i) => (
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
          style={{ ...skel, height: "28px", width: "64px", marginLeft: "auto" }}
        />
      </div>

      {/* 3 columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1px",
          padding: "24px 32px",
          background: "rgba(0,48,73,0.06)",
        }}
      >
        {(["applied", "active", "completed"] as const).map((col) => (
          <div
            key={col}
            style={{ background: "var(--surface,#f5f2ec)", padding: "0 1px" }}
          >
            {/* Column header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,48,73,0.10)",
              }}
            >
              <div
                style={{
                  ...skel,
                  height: "8px",
                  width: "8px",
                  borderRadius: "50%",
                }}
              />
              <div style={{ ...skel, height: "11px", width: "70px" }} />
              <div
                style={{
                  ...skel,
                  height: "18px",
                  width: "24px",
                  marginLeft: "auto",
                }}
              />
            </div>

            {/* Cards */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,48,73,0.06)",
                  background: "#fff",
                  margin: "2px 0",
                }}
              >
                <div
                  style={{
                    ...skel,
                    height: "36px",
                    width: "36px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      ...skel,
                      height: "11px",
                      width: "75%",
                      marginBottom: "6px",
                    }}
                  />
                  <div style={{ ...skel, height: "9px", width: "55%" }} />
                </div>
                <div style={{ ...skel, height: "20px", width: "40px" }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
