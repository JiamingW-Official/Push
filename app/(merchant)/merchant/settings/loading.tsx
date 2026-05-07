import "./settings.css";

/* ── Settings Loading Skeleton ────────────────────────────────
 * Mirrors SettingsShell: side nav (8 items, 2 groups) + main pane
 * with 1 section card containing 4 form rows.
 * Wrapped in `.settings-page` to inherit the page atmospheric backdrop.
 * ============================================================ */

const SKEL_BG =
  "linear-gradient(90deg,var(--surface-3) 25%,var(--mist,#d8d4c8) 50%,var(--surface-3) 75%)";

const skel: React.CSSProperties = {
  background: SKEL_BG,
  backgroundSize: "600px 100%",
  animation: "settings-shimmer 1.4s infinite linear",
  borderRadius: 8,
};

function Bar({
  w,
  h,
  style,
}: {
  w: string | number;
  h: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...skel,
        width: typeof w === "number" ? `${w}px` : w,
        height: typeof h === "number" ? `${h}px` : h,
        ...style,
      }}
    />
  );
}

export default function SettingsLoading() {
  return (
    <div
      className="settings-page"
      role="status"
      aria-label="Loading settings"
      aria-busy="true"
    >
      <style>{`@keyframes settings-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      <div className="settings-shell">
        {/* Side navigation */}
        <aside
          className="settings-side"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <header className="settings-side__head">
            <Bar w={64} h={12} style={{ marginBottom: 16 }} />
            <Bar w={120} h={28} style={{ marginBottom: 16 }} />
            <Bar w="100%" h={36} style={{ borderRadius: 8 }} />
          </header>

          <nav className="settings-side__nav">
            {[
              { label: 80, items: 4 },
              { label: 96, items: 4 },
            ].map((g, gi) => (
              <div key={gi} className="settings-side__group">
                <Bar w={g.label} h={10} style={{ marginBottom: 12 }} />
                <div
                  className="settings-side__items"
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {Array.from({ length: g.items }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "20px 1fr",
                        gap: 12,
                        alignItems: "center",
                        padding: "10px 12px",
                      }}
                    >
                      <Bar w={20} h={20} style={{ borderRadius: 4 }} />
                      <Bar w={`${60 + (i % 3) * 10}%`} h={14} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main pane */}
        <main className="settings-pane" aria-hidden="true">
          <div className="settings-pane__inner">
            {/* Section header */}
            <div style={{ marginBottom: 32 }}>
              <Bar w={120} h={10} style={{ marginBottom: 12 }} />
              <Bar w="min(380px, 60%)" h={36} style={{ marginBottom: 12 }} />
              <Bar w="min(520px, 80%)" h={14} />
            </div>

            {/* Form rows */}
            <div
              style={{
                background: "var(--snow,#fff)",
                borderRadius: 16,
                padding: 32,
                border: "0.5px solid rgba(0,0,0,0.06)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Bar w={`${20 + (i % 3) * 6}%`} h={12} />
                  <Bar w="100%" h={40} />
                  <Bar w={`${40 + (i % 4) * 10}%`} h={11} />
                </div>
              ))}

              {/* Action row */}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Bar w={120} h={40} />
                <Bar w={96} h={40} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
