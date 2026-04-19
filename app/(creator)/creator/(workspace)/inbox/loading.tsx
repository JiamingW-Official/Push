import React from "react";

const skel: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(0,48,73,0.05) 25%,rgba(0,48,73,0.10) 50%,rgba(0,48,73,0.05) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
};

export default function InboxLoading() {
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
        <div style={{ ...skel, height: "14px", width: "80px" }} />
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {[60, 70, 60].map((w, i) => (
            <div key={i} style={{ ...skel, height: "14px", width: `${w}px` }} />
          ))}
        </div>
      </div>

      {/* Two-column layout: thread list + detail pane */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          height: "calc(100vh - 48px)",
        }}
      >
        {/* Thread list */}
        <div
          style={{
            borderRight: "1px solid rgba(0,48,73,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Search / filter bar */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(0,48,73,0.08)",
            }}
          >
            <div style={{ ...skel, height: "32px", width: "100%" }} />
          </div>

          {/* Tab strip */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(0,48,73,0.10)",
            }}
          >
            {[80, 80, 80].map((w, i) => (
              <div key={i} style={{ ...skel, height: "36px", flex: 1 }} />
            ))}
          </div>

          {/* Invite cards — urgent style */}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid rgba(0,48,73,0.08)",
                background:
                  i === 0 ? "rgba(193,18,31,0.04)" : "var(--surface-elevated)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ ...skel, height: "10px", width: "50px" }} />
                <div style={{ ...skel, height: "10px", width: "70px" }} />
              </div>
              <div style={{ ...skel, height: "13px", width: "80%" }} />
              <div style={{ ...skel, height: "10px", width: "60%" }} />
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <div style={{ ...skel, height: "28px", flex: 1 }} />
                <div style={{ ...skel, height: "28px", width: "80px" }} />
              </div>
            </div>
          ))}

          {/* Thread rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,48,73,0.06)",
                background: i === 0 ? "rgba(0,48,73,0.03)" : "transparent",
              }}
            >
              <div
                style={{
                  ...skel,
                  height: "36px",
                  width: "36px",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...skel,
                    height: "12px",
                    width: "65%",
                    marginBottom: "5px",
                  }}
                />
                <div style={{ ...skel, height: "10px", width: "85%" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "6px",
                }}
              >
                <div style={{ ...skel, height: "9px", width: "32px" }} />
                {i < 2 && (
                  <div
                    style={{
                      ...skel,
                      height: "16px",
                      width: "16px",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail pane */}
        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Thread header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(0,48,73,0.10)",
            }}
          >
            <div>
              <div
                style={{
                  ...skel,
                  height: "18px",
                  width: "160px",
                  marginBottom: "8px",
                }}
              />
              <div style={{ ...skel, height: "10px", width: "120px" }} />
            </div>
            <div style={{ ...skel, height: "28px", width: "80px" }} />
          </div>

          {/* Message bubbles */}
          {[
            { own: false, w: "55%" },
            { own: true, w: "45%" },
            { own: false, w: "65%" },
            { own: true, w: "40%" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.own ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...skel,
                  height: "48px",
                  width: m.w,
                  maxWidth: "420px",
                }}
              />
            </div>
          ))}

          {/* Reply box */}
          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid rgba(0,48,73,0.10)",
              paddingTop: "16px",
            }}
          >
            <div style={{ ...skel, height: "72px", width: "100%" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
              <div style={{ ...skel, height: "32px", width: "80px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
