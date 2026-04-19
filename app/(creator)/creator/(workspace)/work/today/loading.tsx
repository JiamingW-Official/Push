const S = {
  skel: {
    background:
      "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear",
  } as React.CSSProperties,
};

import React from "react";

export default function TodayLoading() {
  return (
    <div
      style={{
        padding: "0",
        background: "var(--surface,#f5f2ec)",
        minHeight: "100vh",
      }}
    >
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Nav bar */}
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
        <div style={{ ...S.skel, height: "14px", width: "100px" }} />
        <div
          style={{
            ...S.skel,
            height: "14px",
            width: "80px",
            marginLeft: "auto",
          }}
        />
      </div>

      {/* Hero header */}
      <div
        style={{
          padding: "32px 32px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "24px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              ...S.skel,
              height: "12px",
              width: "180px",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              ...S.skel,
              height: "64px",
              width: "220px",
              marginBottom: "16px",
            }}
          />
          <div
            style={{
              ...S.skel,
              height: "10px",
              width: "160px",
              marginBottom: "8px",
            }}
          />
          <div style={{ ...S.skel, height: "6px", width: "280px" }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              ...S.skel,
              height: "10px",
              width: "120px",
              marginBottom: "8px",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              ...S.skel,
              height: "48px",
              width: "100px",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              ...S.skel,
              height: "10px",
              width: "80px",
              marginTop: "6px",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>

      {/* Stats strip — 3 cols */}
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
          <div key={i} style={{ padding: "20px 16px", background: "#fff" }}>
            <div
              style={{
                ...S.skel,
                height: "32px",
                width: "56px",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                ...S.skel,
                height: "10px",
                width: "80px",
                marginBottom: "6px",
              }}
            />
            <div style={{ ...S.skel, height: "9px", width: "60px" }} />
          </div>
        ))}
      </div>

      {/* Body — timeline + sidebar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "24px",
          padding: "0 32px 32px",
        }}
      >
        {/* Timeline */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ ...S.skel, height: "12px", width: "140px" }} />
            <div style={{ ...S.skel, height: "12px", width: "80px" }} />
          </div>
          {[72, 72, 72, 72, 72].map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "2px",
                padding: "12px 16px",
                background: "#fff",
                border: "1px solid rgba(0,48,73,0.06)",
              }}
            >
              <div
                style={{
                  ...S.skel,
                  height: "36px",
                  width: "40px",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  ...S.skel,
                  height: "36px",
                  width: "36px",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...S.skel,
                    height: "12px",
                    width: "60%",
                    marginBottom: "6px",
                  }}
                />
                <div style={{ ...S.skel, height: "10px", width: "40%" }} />
              </div>
              <div style={{ ...S.skel, height: "22px", width: "52px" }} />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ ...S.skel, height: "140px", width: "100%" }} />
          <div style={{ ...S.skel, height: "160px", width: "100%" }} />
          <div style={{ ...S.skel, height: "60px", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
