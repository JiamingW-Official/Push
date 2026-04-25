// v11 About Page — editorial register, asymmetric compositions, no card grids

import Link from "next/link";

/* ── Team data ─────────────────────────────────────────────── */
const TEAM = [
  {
    initial: "J",
    name: "Jiaming Wang",
    role: "FOUNDER · CEO",
    origin: "Mott Street native · Built Push from a restaurant booth",
  },
  {
    initial: "?",
    name: "—",
    role: "ENGINEERING · ATTRIBUTION",
    origin: "QR → scan → payout rail · Previously Square",
  },
  {
    initial: "?",
    name: "—",
    role: "OPERATIONS · CREATOR SIDE",
    origin: "Reads every application · Walks Tribeca on weekends",
  },
  {
    initial: "?",
    name: "—",
    role: "DESIGN · BRAND SURFACE",
    origin: "Sets the type, the color, the weight",
  },
  {
    initial: "?",
    name: "—",
    role: "GROWTH · MERCHANT SIDE",
    origin: "Cold-opens new neighborhoods · Brooklyn-born",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          HERO — Asymmetric split: title left, giant pull stat right
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "clamp(520px, 80vh, 840px)",
          borderRadius: 0,
          overflow: "hidden",
          background: `
            radial-gradient(ellipse 80% 70% at 75% 30%, rgba(193,18,31,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 80%, rgba(0,133,255,0.06) 0%, transparent 55%),
            linear-gradient(160deg, #1a1816 0%, #2c2a26 55%, #1e1c19 100%)
          `,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Left anchor — title block */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 64px 96px",
            flex: "0 0 55%",
          }}
        >
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.55)", marginBottom: 24 }}
          >
            (OUR STORY)
          </p>

          <h1
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(64px, 9vw, 144px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.88,
              color: "var(--snow)",
              margin: "0 0 40px",
            }}
          >
            Built in
            <br />
            Brooklyn.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.6,
              maxWidth: "36ch",
              margin: "0 0 48px",
            }}
          >
            Push started in Williamsburg because that&rsquo;s where we live,
            eat, and know by name.
          </p>

          <Link href="/creator/signup" className="btn-primary click-shift">
            Join Push
          </Link>
        </div>

        {/* Right anchor — giant editorial stat */}
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 64,
            zIndex: 2,
            textAlign: "right",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(96px, 14vw, 220px)",
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              color: "rgba(255,255,255,0.07)",
              margin: 0,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            NYC
          </p>
          <div
            className="lg-surface--badge"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "flex-end",
              padding: "20px 28px",
              marginTop: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "var(--snow)",
              }}
            >
              1.4M+
            </span>
            <span
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.60)", marginTop: 8 }}
            >
              VERIFIED VISITS
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORY Panel — 2-column: manifesto left, giant KPIs right
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "120px 64px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-width)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* Left: manifesto */}
          <div>
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 24 }}
            >
              (WHY THIS EXISTS)
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "var(--ink)",
                margin: "0 0 32px",
              }}
            >
              Performance
              <br />
              marketing
              <br />
              that lives
              <br />
              on the street.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 20,
                color: "var(--ink-3)",
                lineHeight: 1.55,
                maxWidth: "38ch",
                margin: 0,
              }}
            >
              Impressions don&rsquo;t mean foot traffic. We measure exactly one
              thing: a real person physically entering your door.
            </p>
          </div>

          {/* Right: giant stacked KPIs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 48,
              borderLeft: "1px solid rgba(10,10,10,0.12)",
              paddingLeft: 64,
            }}
          >
            {[
              { num: "1.4M+", label: "Verified visits to date" },
              { num: "100+", label: "NYC merchants active" },
              { num: "87%", label: "Creator retention rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(56px, 7vw, 96px)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "var(--ink)",
                    margin: "0 0 12px",
                  }}
                >
                  {stat.num}
                </p>
                <p
                  className="eyebrow"
                  style={{ color: "var(--ink-3)", margin: 0 }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          Sig Divider
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Real · Local · Verified ·</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          VALUES — Editorial numbered list, no cards
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "0 64px 160px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (WHAT WE BELIEVE)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "var(--ink)",
              margin: "0 0 96px",
            }}
          >
            Three rules
            <br />
            we don&rsquo;t break.
          </h2>

          {/* Numbered editorial rows */}
          {[
            {
              n: "01",
              title: "Verified scans only.",
              body: "QR scan + GPS dwell + timestamp. If all three don't match, it doesn't count.",
            },
            {
              n: "02",
              title: "Real creators, real blocks.",
              body: "Our network lives in the neighborhoods they promote. We expand only when we can verify the same ground-level density.",
            },
            {
              n: "03",
              title: "Physical presence counts.",
              body: "We're a Public Benefit Corporation. Creator payouts flow directly from foot traffic — no intermediary margin.",
            },
          ].map((item, i, arr) => (
            <div
              key={item.n}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 2fr",
                gap: "40px",
                alignItems: "baseline",
                paddingBottom: 64,
                borderBottom:
                  i < arr.length - 1 ? "1px solid rgba(10,10,10,0.10)" : "none",
                marginBottom: i < arr.length - 1 ? 64 : 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--ink-4)",
                }}
              >
                {item.n}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 18,
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TEAM — Editorial card row, big initials
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "120px 64px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (THE TEAM)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "var(--ink)",
              margin: "0 0 80px",
            }}
          >
            The people
            <br />
            behind the scans.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 32,
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name + member.role}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {/* Big initial tile */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "var(--r-lg)",
                    background: "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-hero)",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: 28,
                      color: "var(--snow)",
                      lineHeight: 1,
                    }}
                  >
                    {member.initial}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    margin: "0 0 6px",
                    lineHeight: 1.2,
                  }}
                >
                  {member.name}
                </p>

                <p
                  className="eyebrow"
                  style={{ color: "var(--ink-3)", margin: "0 0 10px" }}
                >
                  {member.role}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "var(--ink-3)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {member.origin}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TICKET CTA Panel
          ═══════════════════════════════════════════════════════ */}
      <div
        className="ticket-panel"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "112px 64px",
          margin: "80px 64px",
        }}
      >
        {/* Grommet corners */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24 },
          { bottom: 24, left: 24 },
          { bottom: 24, right: 24 },
        ].map((pos, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid var(--ink)",
              ...pos,
            }}
          />
        ))}

        <h2
          style={{
            fontFamily: "var(--font-hero)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(40px, 5vw, 72px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "var(--ink)",
            margin: "0 0 24px",
          }}
        >
          Join the walk-in economy.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            color: "var(--ink-3)",
            maxWidth: "40ch",
            lineHeight: 1.55,
            margin: "0 0 48px",
          }}
        >
          We&rsquo;re building in NYC right now. Merchants get early access.
          Creators get first-mover territory.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link href="/merchant/signup" className="btn-ink click-shift">
            For Merchants
          </Link>
          <Link href="/creator/signup" className="btn-ghost click-shift">
            For Creators
          </Link>
        </div>
      </div>
    </main>
  );
}
