import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

const skelDark: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(255,255,255,0.06) 25%,rgba(255,255,255,0.12) 50%,rgba(255,255,255,0.06) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function IdentityLoading() {
  return (
    <div style={{ background: "var(--surface,#f5f2ec)", minHeight: "100vh" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Dark hero block — 280px */}
      <div
        style={{
          height: "280px",
          background: "#003049",
          padding: "40px 32px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <div style={{ ...skelDark, height: "11px", width: "120px" }} />
        <div style={{ ...skelDark, height: "72px", width: "220px" }} />
        <div style={{ ...skelDark, height: "14px", width: "90px" }} />
      </div>

      {/* Score card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          margin: "24px 32px 0",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[0, 1].map((i) => (
          <div key={i} style={{ background: "#fff", padding: "20px" }}>
            <div
              style={{
                ...skel,
                height: "10px",
                width: "80px",
                marginBottom: "10px",
              }}
            />
            <div style={{ ...skel, height: "40px", width: "80px" }} />
          </div>
        ))}
      </div>

      {/* Progress bar section */}
      <div
        style={{
          margin: "16px 32px",
          background: "#fff",
          border: "1px solid rgba(0,48,73,0.10)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ ...skel, height: "11px", width: "140px" }} />
          <div style={{ ...skel, height: "11px", width: "40px" }} />
        </div>
        <div style={{ height: "6px", background: "rgba(0,48,73,0.08)" }}>
          <div style={{ ...skel, height: "6px", width: "62%" }} />
        </div>
      </div>

      {/* Niche chips row — 6 pill shapes */}
      <div style={{ padding: "0 32px 16px" }}>
        <div
          style={{
            ...skel,
            height: "11px",
            width: "80px",
            marginBottom: "12px",
          }}
        />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[72, 64, 80, 56, 68, 76].map((w, i) => (
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
      </div>

      {/* Stats bar — 4 cols */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "1px",
          margin: "0 32px 24px",
          border: "1px solid rgba(0,48,73,0.12)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: "#fff", padding: "16px" }}>
            <div
              style={{
                ...skel,
                height: "9px",
                width: "60px",
                marginBottom: "8px",
              }}
            />
            <div style={{ ...skel, height: "28px", width: "70px" }} />
          </div>
        ))}
      </div>

      {/* Platform links section */}
      <div
        style={{
          margin: "0 32px 32px",
          background: "#fff",
          border: "1px solid rgba(0,48,73,0.10)",
          padding: "20px",
        }}
      >
        <div
          style={{
            ...skel,
            height: "11px",
            width: "100px",
            marginBottom: "16px",
          }}
        />
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "12px",
              marginBottom: "12px",
              borderBottom: i === 0 ? "1px solid rgba(0,48,73,0.07)" : "none",
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
                  width: "100px",
                  marginBottom: "5px",
                }}
              />
              <div style={{ ...skel, height: "9px", width: "70px" }} />
            </div>
            <div style={{ ...skel, height: "22px", width: "60px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
