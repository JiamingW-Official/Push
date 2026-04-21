import React from "react";

// work/page.tsx redirects to work/today — mirror today's skeleton here
const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function WorkLoading() {
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
              width: "180px",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              ...skel,
              height: "64px",
              width: "200px",
              marginBottom: "14px",
            }}
          />
          <div style={{ ...skel, height: "6px", width: "260px" }} />
        </div>
        <div>
          <div
            style={{
              ...skel,
              height: "10px",
              width: "110px",
              marginBottom: "8px",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              ...skel,
              height: "44px",
              width: "96px",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1px",
          margin: "24px 32px",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "var(--surface-elevated)",
              padding: "20px 16px",
            }}
          >
            <div
              style={{
                ...skel,
                height: "32px",
                width: "56px",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                ...skel,
                height: "10px",
                width: "80px",
                marginBottom: "6px",
              }}
            />
            <div style={{ ...skel, height: "9px", width: "60px" }} />
          </div>
        ))}
      </div>

      {/* Timeline rows */}
      <div style={{ padding: "0 32px 32px" }}>
        <div
          style={{
            ...skel,
            height: "11px",
            width: "140px",
            marginBottom: "16px",
          }}
        />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              marginBottom: "2px",
              background: "var(--surface-elevated)",
              border: "1px solid rgba(0,48,73,0.06)",
            }}
          >
            <div
              style={{ ...skel, height: "36px", width: "40px", flexShrink: 0 }}
            />
            <div
              style={{ ...skel, height: "36px", width: "36px", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...skel,
                  height: "12px",
                  width: "60%",
                  marginBottom: "6px",
                }}
              />
              <div style={{ ...skel, height: "10px", width: "40%" }} />
            </div>
            <div style={{ ...skel, height: "22px", width: "52px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
