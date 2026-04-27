// v11 About Page — editorial register, Grain-Archive voice, 8px grid, closed color list
// Audit pass 2026-04-25: hero bottom-left anchor, KPI scale, token-only colors, 96px section padding

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Push — Built in Brooklyn",
  description:
    "Push started on Mott Street because that's where we live, eat, and know by name. Performance marketing on the street — pay per verified visit.",
};

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
          HERO — Dark panel, bottom-left anchored title (§ 7.1)
          Background: decorative gradient exempt from closed-color list
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "clamp(560px, 82vh, 880px)",
          borderRadius: 0,
          overflow: "hidden",
          // Decorative gradient — SVG visual effect, exempt from closed-color list per § 2.7 rule 1
          background: `
            radial-gradient(ellipse 80% 70% at 75% 30%, var(--brand-red-tint) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 80%, var(--accent-blue-tint) 0%, transparent 55%),
            linear-gradient(160deg, var(--ink) 0%, var(--graphite) 55%, var(--ink-2) 100%)
          `,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Ghost NYC watermark — decorative, pointerEvents none */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-0.02em",
            bottom: "-0.12em",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(200px, 38vw, 560px)",
            letterSpacing: "-0.08em",
            lineHeight: 0.8,
            color: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          NYC
        </span>

        {/* Bottom-left anchored title block (§ 7.1 — 96px bottom, 64px left) */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 64px 96px",
            flex: "0 0 58%",
          }}
        >
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.65)", marginBottom: 16 }}
          >
            (OUR STORY)
          </p>

          {/* Darky Display Hero — clamp(56,8vw,128) per § 3.1 */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(72px, 11vw, 180px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.88,
              color: "var(--snow)",
              margin: "0 0 32px",
            }}
          >
            Built in
            <br />
            Brooklyn.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 20,
              color: "var(--snow)",
              opacity: 0.72,
              lineHeight: 1.4,
              letterSpacing: "-0.1em",
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

        {/* Right anchor — floating glass stat badge */}
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 96,
            zIndex: 2,
            textAlign: "right",
          }}
        >
          <div
            className="lg-surface--badge"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "flex-end",
              padding: "24px 32px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 1,
                color: "var(--snow)",
              }}
            >
              1.4M+
            </span>
            <span
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.65)", marginTop: 8 }}
            >
              VERIFIED VISITS
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORY Candy Panel — manifesto left, giant KPIs right
          Candy Panel: bg var(--panel-butter), r-3xl 28px, 96px all sides
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px 64px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-width)",
            margin: "0 auto",
            background: "var(--panel-butter)",
            borderRadius: "var(--r-3xl)",
            padding: "96px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: manifesto — top-left anchor (section panel) */}
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-3)", marginBottom: 16 }}
              >
                (WHY THIS EXISTS)
              </p>
              {/* H2 = exactly 40px per § 3.1 */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  color: "var(--ink)",
                  margin: "0 0 56px",
                }}
              >
                Performance
                <br />
                marketing
                <br />
                on the street.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  color: "var(--ink-3)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.1em",
                  maxWidth: "38ch",
                  margin: 0,
                }}
              >
                Impressions don&rsquo;t mean foot traffic. We measure exactly
                one thing: a real person physically entering your door.
              </p>
            </div>

            {/* Right: giant stacked KPIs — clamp(80,12vw,200) per brief */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 48,
                borderLeft: "1px solid var(--hairline)",
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
                      fontSize: "clamp(80px, 12vw, 200px)",
                      letterSpacing: "-0.06em",
                      lineHeight: 0.85,
                      color: "var(--ink)",
                      margin: "0 0 16px",
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          Sig Divider — approved phrase per § 3.1 Magvix Italic Signature Divider
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Real · Local · Verified ·</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          VALUES — Editorial numbered rows, no cards
          Section padding: 96px top+bottom, 64px horizontal (§ 6.1)
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "0 64px 96px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (WHAT WE BELIEVE)
          </p>
          {/* H2 exactly 40px */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: "0 0 56px",
            }}
          >
            Three rules
            <br />
            we don&rsquo;t break.
          </h2>

          {/* Numbered editorial rows: 120px number col, 1fr title, 2fr body */}
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
                gap: 40,
                alignItems: "baseline",
                paddingBottom: 64,
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--hairline)" : "none",
                marginBottom: i < arr.length - 1 ? 64 : 0,
              }}
            >
              {/* Number marker — CS Genio Mono 14px per § 3.1 Numbered Section marker */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "var(--ink-4)",
                }}
              >
                {item.n}
              </span>
              {/* H3 exactly 28px per § 3.1 */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  color: "var(--ink-3)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.1em",
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
          TEAM — Cool panel, editorial 5-column grid
          Panel sky (cool) alternates with surface (warm) above (§ 2.4 Candy Panel Rules)
          Section padding: 96px top+bottom (§ 6.1)
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (THE TEAM)
          </p>
          {/* H2 exactly 40px */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: "0 0 56px",
            }}
          >
            The people
            <br />
            behind the scans.
          </h2>

          {/* 5-column grid, gap 24px (§ 6.6 card grid gap) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 24,
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name + member.role}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Icon tile: 64×64, r-lg 12px (§ 4.3 icon tiles) */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "var(--r-lg)",
                    background: "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
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

                {/* Darky 18px 800 per brief */}
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    margin: "0 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  {member.name}
                </p>

                {/* Eyebrow 12px role label */}
                <p
                  className="eyebrow"
                  style={{ color: "var(--ink-3)", margin: "0 0 8px" }}
                >
                  {member.role}
                </p>

                {/* CS Genio Mono 14px italic bio per brief */}
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
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
          TICKET CTA Panel (§ 8.2)
          ga-orange bg, r-md 10px, 64px 96px padding, grommets, perf lines
          Magvix Italic centered headline, btn-ink CTA, flat no-shadow
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <div className="ticket-panel" style={{ position: "relative" }}>
            {/* Grommet corners — 16px circles, 24px inset (§ 8.2) */}
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
                  borderRadius: "var(--r-full)",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}

            <p
              className="eyebrow"
              style={{ color: "rgba(10,10,10,0.55)", marginBottom: 24 }}
            >
              (JOIN US)
            </p>

            {/* Magvix Italic clamp(40,5vw,56) centered (§ 8.2) */}
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--ink)",
                margin: "0 0 16px",
                textAlign: "center",
              }}
            >
              Join the walk-in economy.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                color: "var(--ink)",
                opacity: 0.72,
                maxWidth: "40ch",
                lineHeight: 1.55,
                margin: "0 auto 32px",
                textAlign: "center",
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
        </div>
      </section>
    </main>
  );
}
