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

export default function PortfolioLoading() {
  return (
    <div style={{ background: "var(--surface,#f5f2ec)", minHeight: "100vh" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Dark hero — avatar + name + tier */}
      <div
        style={{
          height: "240px",
          background: "var(--dark)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <div
          style={{
            ...skelDark,
            height: "56px",
            width: "56px",
            borderRadius: "50%",
          }}
        />
        <div style={{ ...skelDark, height: "20px", width: "160px" }} />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ ...skelDark, height: "12px", width: "80px" }} />
          <div
            style={{
              ...skelDark,
              height: "20px",
              width: "64px",
              borderRadius: "50vh",
            }}
          />
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div
        style={{
          display: "flex",
          gap: "1px",
          borderBottom: "1px solid rgba(0,48,73,0.12)",
          background: "rgba(0,48,73,0.06)",
        }}
      >
        {[100, 90, 100, 80].map((w, i) => (
          <div key={i} style={{ ...skel, height: "40px", width: `${w}px` }} />
        ))}
      </div>

      {/* Score ring + niche chips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "24px",
          padding: "24px 32px",
          alignItems: "start",
        }}
      >
        {/* Score ring placeholder */}
        <div
          style={{
            ...skel,
            height: "200px",
            width: "200px",
            borderRadius: "50%",
          }}
        />

        {/* Right: bio + niches */}
        <div style={{ paddingTop: "8px" }}>
          <div
            style={{
              ...skel,
              height: "11px",
              width: "200px",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              ...skel,
              height: "11px",
              width: "160px",
              marginBottom: "20px",
            }}
          />
          <div
            style={{
              ...skel,
              height: "10px",
              width: "80px",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[64, 72, 56, 80, 68, 60].map((w, i) => (
              <div
                key={i}
                style={{
                  ...skel,
                  height: "26px",
                  width: `${w}px`,
                  borderRadius: "50vh",
                }}
              />
            ))}
          </div>
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
          <div
            key={i}
            style={{ background: "var(--surface-elevated)", padding: "16px" }}
          >
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

      {/* Gallery grid */}
      <div style={{ padding: "0 32px 32px" }}>
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "4px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...skel, height: "140px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
