import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./about.css";

/* ── Team data ─────────────────────────────────────────────── */
// Five operators. Pre-pilot, Lower Manhattan-anchored.
// Only Jiaming's name is canonical here; teammate names will be added
// before the June 22 pilot opens. Until then, roles stand in.
const TEAM = [
  {
    num: "01",
    name: "Jiaming Wang",
    role: "Founder · runs the doors",
    tie: "Born and raised on Mott Street. Knows which restaurants close on Mondays.",
  },
  {
    num: "02",
    name: "—",
    role: "Engineering · attribution",
    tie: "Builds the QR → scan → payout rail. Introduced by the Mott Street block.",
  },
  {
    num: "03",
    name: "—",
    role: "Operations · creator side",
    tie: "Reads every creator application by hand. Walks Tribeca on weekends.",
  },
  {
    num: "04",
    name: "—",
    role: "Design · the whole surface",
    tie: "Sets the type, the color, the line weight. The only non-Chinese seat at the table.",
  },
  {
    num: "05",
    name: "—",
    role: "Engineering · merchant tools",
    tie: "Ships the poster generator and the dashboard. Eats at Joe's Shanghai.",
  },
];

/* ── Story / history data ─────────────────────────────────── */
// Honest, dated. Pre-pilot, so no claims of revenue or scale.
const STORY = [
  {
    period: "2025, late",
    title: "The walk",
    body: 'Jiaming spends a week walking from Canal to Worth Street, talking to restaurant owners. Same answer every time: "I tried Instagram ads. $800 in. Couldn\'t tell you who showed up."',
  },
  {
    period: "2026 · January",
    title: "The first QR",
    body: "We tape one QR on the door of a noodle shop on Doyers Street. A friend posts about it. Two people scan. We have a rail.",
  },
  {
    period: "2026 · April",
    title: "Five seats around the table",
    body: "Four more people join — two from Jiaming's Mott Street block, one from a midtown fintech, one from SVA. Five people, one shared doc, no titles.",
  },
  {
    period: "2026 · June 22",
    title: "Pilot opens",
    body: "Seven blocks of Lower Manhattan. Five anchored venues. Ten creators on the roster. We will know if this works because the door tells us.",
  },
];

/* ── Beliefs (Apple-style declarative) ─────────────────────── */
const BELIEFS = [
  {
    line: "A door is honest.",
    body: "It opens or it doesn't. We pay for the opening, not for the post.",
  },
  {
    line: "Reach is a vanity.",
    body: "Eighty thousand impressions and an empty restaurant on Tuesday is the same as zero.",
  },
  {
    line: "Local is small on purpose.",
    body: "Seven blocks done well is worth more than five boroughs done thinly.",
  },
  {
    line: "The smallest shop matters.",
    body: "We built this for the corner spot, not the chain. The math has to work for $800/mo, not just for $80K.",
  },
];

export default function AboutPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ═══════════════ 01 — HERO (ink) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette about-hero-v7"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          paddingTop: "clamp(80px, 8vw, 120px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill + eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            Five people · Lower Manhattan
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Pre-pilot · June&nbsp;22
          </span>
        </div>

        {/* Hero center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 8vh, 96px)",
            paddingBottom: "clamp(48px, 8vh, 96px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Who we are
          </div>

          {/* Massive Darky 900 + Darky 200 ghost */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 13vw, 200px)",
              fontWeight: 900,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: "#fff",
              margin: 0,
            }}
          >
            Built by locals
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.04em",
              }}
            >
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(40px, 8vw, 124px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            walked, not pitched
          </div>

          <p
            style={{
              marginTop: "clamp(32px, 5vw, 56px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Jiaming grew up on Mott Street. He watched restaurants on his block
            spend $800 on Instagram ads and have nothing to show for it on
            Tuesday night. Push started there — at the door, not in a pitch
            deck.
          </p>
          <p
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.46)",
            }}
          >
            Five people built this. Four are 华人 from the Manhattan-Brooklyn
            corridor; one is from Bangkok. We're pre-pilot. We don't have a
            Series A, a national roster, or a press tour. We have seven blocks,
            five venues, ten creators, and one operator (Jiaming) walking the
            doors with them.
          </p>

          {/* Three small facts strip — borderless, factual */}
          <div
            style={{
              marginTop: "clamp(40px, 6vw, 72px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "clamp(16px, 3vw, 40px)",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              maxWidth: 880,
            }}
          >
            <div
              style={{
                paddingLeft: 18,
                borderLeft: "2px solid var(--brand-red)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 4vw, 60px)",
                  fontWeight: 200,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: "#fff",
                }}
              >
                05
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                People building it
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                no titles, one shared doc
              </div>
            </div>
            <div
              style={{
                paddingLeft: 18,
                borderLeft: "2px solid var(--champagne)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 4vw, 60px)",
                  fontWeight: 200,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: "#fff",
                }}
              >
                07
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Blocks of Lower Manhattan
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                SoHo · Tribeca · Chinatown
              </div>
            </div>
            <div
              style={{
                paddingLeft: 18,
                borderLeft: "2px solid var(--cat-travel)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 4vw, 60px)",
                  fontWeight: 200,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: "#fff",
                }}
              >
                Jun&nbsp;22
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Pilot opens
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                first QR scanned
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: scroll indicator */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div
            className="scroll-indicator"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Read on
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 — TEAM (bento + card-premium) ═══════════════ */}
      <section className="section section-bright about-team-v7">
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="02">
              Five people
            </div>
            <h2 className="split-headline">
              <span className="wt-900">No titles.</span>{" "}
              <span className="wt-300">One shared doc.</span>
            </h2>
            <p className="split-body">
              Four 华人 from the Manhattan-Brooklyn corridor, one designer from
              Bangkok. We meet on Wednesdays in a back room on Mott Street. We
              answer email by hand.
            </p>
          </div>

          <div className="bento-grid about-team-bento">
            {TEAM.map((m, i) => (
              <article
                key={m.name}
                className="card-premium about-team-card-v7 reveal"
                style={{
                  gridColumn: i === 0 ? "span 6" : "span 3",
                  gridRow: i === 0 ? "span 2" : "span 1",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div className="about-team-card-inner">
                  <span className="about-team-card-num">{m.num}</span>
                  <h3 className="about-team-card-name">{m.name}</h3>
                  <p className="about-team-card-role">{m.role}</p>
                  <p className="about-team-card-tie">{m.tie}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 — STORY (timeline) ═══════════════ */}
      <section className="section about-story-v7">
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="03">
              The start
            </div>
            <h2 className="split-headline">
              <span className="wt-900">From the door,</span>{" "}
              <span className="wt-300">not the deck.</span>
            </h2>
            <p className="split-body">
              Push didn't start with a slide. It started with one taped-up QR on
              Doyers Street, and the question of whether two people would scan
              it.
            </p>
          </div>

          <div className="about-timeline-v7">
            {STORY.map((s, i) => (
              <div
                key={s.period}
                className="about-timeline-row reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="about-timeline-period">{s.period}</div>
                <div className="about-timeline-mark" aria-hidden="true" />
                <div className="about-timeline-content">
                  <h3 className="about-timeline-title">{s.title}</h3>
                  <p className="about-timeline-body">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 — BELIEFS (declarative) ═══════════════ */}
      <section className="section section-bright about-beliefs-v7">
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="04">
              What we believe
            </div>
            <h2 className="split-headline">
              <span className="wt-900">Four lines.</span>{" "}
              <span className="wt-300">No slogans.</span>
            </h2>
          </div>

          <div className="about-beliefs-grid">
            {BELIEFS.map((b, i) => (
              <div
                key={b.line}
                className="about-belief-row reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="about-belief-num">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="about-belief-text">
                  <h3 className="about-belief-line">{b.line}</h3>
                  <p className="about-belief-body">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 — CTA (dark) ═══════════════ */}
      <section className="about-cta-v7" aria-labelledby="about-cta-heading">
        <div className="container">
          <div className="about-cta-inner reveal">
            <div
              className="section-marker"
              data-num="05"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Come find us
            </div>
            <h2 id="about-cta-heading" className="about-cta-headline">
              <span className="wt-900">June 22.</span>
              <br />
              <span className="wt-200">Seven blocks.</span>
            </h2>
            <p className="about-cta-body">
              We're not running a waitlist for hype. If you run a venue in SoHo,
              Tribeca, or Chinatown — or you post about food within walking
              distance of Canal Street — say hello.
            </p>
            <div className="about-cta-actions">
              <Link href="/merchant/signup" className="btn btn-primary">
                Run a venue
              </Link>
              <Link
                href="/creator/signup"
                className="btn btn-ghost about-cta-ghost"
              >
                Apply as creator&nbsp;→
              </Link>
            </div>
            <p
              style={{
                marginTop: 16,
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.34)",
              }}
            >
              every email read by hand · 48-hour reply
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
