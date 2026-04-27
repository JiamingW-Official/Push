import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NYC Neighborhoods | Push",
  description:
    "Push operates block by block across NYC neighborhoods. Williamsburg, Greenpoint, SoHo, Chinatown — QR-verified foot traffic, pay only when the visit is real.",
};

/* ── Neighborhood data ─────────────────────────────────────── */

const NEIGHBORHOODS = [
  {
    slug: "williamsburg",
    name: "Williamsburg",
    borough: "Brooklyn",
    creators: 189,
    merchants: 34,
    live: true,
  },
  {
    slug: "greenpoint",
    name: "Greenpoint",
    borough: "Brooklyn",
    creators: 112,
    merchants: 21,
    live: true,
  },
  {
    slug: "park-slope",
    name: "Park Slope",
    borough: "Brooklyn",
    creators: 97,
    merchants: 18,
    live: true,
  },
  {
    slug: "dumbo",
    name: "DUMBO",
    borough: "Brooklyn",
    creators: 84,
    merchants: 15,
    live: true,
  },
  {
    slug: "crown-heights",
    name: "Crown Heights",
    borough: "Brooklyn",
    creators: 76,
    merchants: 12,
    live: true,
  },
  {
    slug: "cobble-hill",
    name: "Cobble Hill",
    borough: "Brooklyn",
    creators: 63,
    merchants: 11,
    live: true,
  },
  {
    slug: "bushwick",
    name: "Bushwick",
    borough: "Brooklyn",
    creators: 148,
    merchants: 27,
    live: true,
  },
  {
    slug: "red-hook",
    name: "Red Hook",
    borough: "Brooklyn",
    creators: 52,
    merchants: 9,
    live: true,
  },
  {
    slug: "les",
    name: "LES",
    borough: "Manhattan",
    creators: 134,
    merchants: 24,
    live: true,
  },
  {
    slug: "chinatown",
    name: "Chinatown",
    borough: "Manhattan",
    creators: 76,
    merchants: 14,
    live: true,
  },
  {
    slug: "nolita",
    name: "Nolita",
    borough: "Manhattan",
    creators: 91,
    merchants: 17,
    live: true,
  },
  {
    slug: "greenwich-village",
    name: "Greenwich Village",
    borough: "Manhattan",
    creators: 108,
    merchants: 20,
    live: true,
  },
  {
    slug: "soho",
    name: "SoHo",
    borough: "Manhattan",
    creators: 189,
    merchants: 36,
    live: true,
  },
  {
    slug: "tribeca",
    name: "Tribeca",
    borough: "Manhattan",
    creators: 101,
    merchants: 19,
    live: true,
  },
  {
    slug: "astoria",
    name: "Astoria",
    borough: "Queens",
    creators: 88,
    merchants: 16,
    live: true,
  },
  {
    slug: "long-island-city",
    name: "Long Island City",
    borough: "Queens",
    creators: 72,
    merchants: 13,
    live: true,
  },
  {
    slug: "ridgewood",
    name: "Ridgewood",
    borough: "Queens",
    creators: 59,
    merchants: 10,
    live: true,
  },
];

const COMING_SOON = [
  { name: "Flatiron", borough: "Manhattan" },
  { name: "Gramercy", borough: "Manhattan" },
  { name: "East Village", borough: "Manhattan" },
  { name: "West Village", borough: "Manhattan" },
  { name: "Chelsea", borough: "Manhattan" },
  { name: "Hell's Kitchen", borough: "Manhattan" },
];

/* ── Borough color mapping (uses category colors — editorial) ── */
const BOROUGH_COLOR: Record<string, string> = {
  Brooklyn: "var(--cat-food)",
  Manhattan: "var(--cat-travel)",
  Queens: "var(--cat-fitness)",
  Bronx: "var(--cat-beauty)",
};

/* ── Page ──────────────────────────────────────────────────── */

export default function NeighborhoodsPage() {
  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      {/* ═══ 01 — HERO (dark ink, bottom-left anchored) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,96px) 96px",
          position: "relative",
          overflow: "hidden",
        }}
        aria-labelledby="nh-hero-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%" }}>
          {/* eyebrow row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "6px 16px",
              }}
            >
              (OUR TERRITORY)
            </span>
            {/* RIGHT — KPI numeral */}
            <div style={{ textAlign: "right" as const }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 700,
                  color: "var(--snow)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                47
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 8,
                }}
              >
                NEIGHBORHOODS
              </div>
            </div>
          </div>

          {/* H1 Darky Display — bottom-left anchored */}
          <h1
            id="nh-hero-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "var(--snow)",
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            Your neighborhood,
            <br />
            verified.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Push expands one neighborhood at a time. Every venue is walked in
            person before the first QR goes up. One block, one operator, one
            verified visit at a time.
          </p>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider" aria-hidden="true">
        Walk · Scan · Eat ·
      </div>

      {/* ═══ 02 — KPI STRIP ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 64px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          {[
            { value: "17", label: "Live neighborhoods" },
            { value: "100+", label: "Active merchants" },
            { value: "Weekly", label: "New venues added" },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              style={{
                padding: "48px 0",
                paddingRight: i < 2 ? 24 : 0,
                borderRight: i < 2 ? "1px solid var(--hairline)" : "none",
                paddingLeft: i > 0 ? 24 : 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                {kpi.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-4)",
                  letterSpacing: "0.02em",
                  marginTop: 8,
                }}
              >
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 03 — NEIGHBORHOOD PHOTO CARDS (candy-panel butter) ═══ */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "96px clamp(24px,6vw,64px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="nh-grid-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (WHERE PUSH LIVES)
          </span>
          <h2
            id="nh-grid-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            Active neighborhoods.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {NEIGHBORHOODS.map((hood) => (
              <Link
                key={hood.slug}
                href={`/neighborhoods/${hood.slug}`}
                className="click-shift"
                style={{
                  display: "block",
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  overflow: "hidden",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                {/* Photo card placeholder with gradient overlay */}
                <div
                  style={{
                    position: "relative",
                    height: 160,
                    background: BOROUGH_COLOR[hood.borough] ?? "var(--ink)",
                    overflow: "hidden",
                  }}
                >
                  {/* gradient overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
                    }}
                  />
                  {/* overlay title — Darky 20px snow */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "var(--snow)",
                        lineHeight: 1.25,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {hood.name}
                    </div>
                    {/* metadata overlay — mono 12px */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase" as const,
                        marginTop: 4,
                      }}
                    >
                      {hood.borough}
                    </div>
                  </div>
                </div>

                {/* card body */}
                <div style={{ padding: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                          letterSpacing: "0.02em",
                          marginBottom: 4,
                        }}
                      >
                        {hood.creators} creators
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {hood.merchants} merchants
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--brand-red)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 — COMING SOON (dark ink) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,64px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-labelledby="nh-coming-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.35)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (EXPANSION MAP)
          </span>
          <h2
            id="nh-coming-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--snow)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            Manhattan, next.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 560,
              lineHeight: 1.55,
              margin: "0 0 64px",
            }}
          >
            After the Lower Manhattan pilot closes, we walk north. One block at
            a time, same operator, same rules.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 0,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {COMING_SOON.map((hood, i) => (
              <div
                key={hood.name}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  borderRight:
                    (i + 1) % 3 !== 0
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  paddingLeft: i % 3 !== 0 ? 32 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap" as const,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.2)",
                      letterSpacing: "0.08em",
                      minWidth: 24,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.65)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {hood.name}
                  </span>
                </div>
                {/* Coming Soon pill — btn-pill style */}
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                    padding: "8px 18px",
                    borderRadius: "50vh",
                    flexShrink: 0,
                  }}
                >
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider" aria-hidden="true">
        Walked · Mapped · Verified ·
      </div>

      {/* ═══ 05 — TICKET CTA ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              background: "var(--ga-orange)",
              borderRadius: 10,
              padding: "64px 96px",
              position: "relative",
              overflow: "hidden",
              textAlign: "center" as const,
            }}
          >
            {/* grommet circles — 16px, 24px inset */}
            {[
              { top: "50%", left: 24, transform: "translateY(-50%)" },
              { top: "50%", right: 24, transform: "translateY(-50%)" },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}
            {/* perforation top */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 48,
                right: 48,
                height: 0,
                borderTop: "2px dashed rgba(0,0,0,0.15)",
              }}
            />
            {/* perforation bottom */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 48,
                right: 48,
                height: 0,
                borderBottom: "2px dashed rgba(0,0,0,0.15)",
              }}
            />

            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontSize: "clamp(40px,5vw,56px)",
                color: "var(--snow)",
                margin: "0 0 32px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Bring Push to your block.
            </h2>
            <Link href="/contact" className="btn-ink click-shift">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
