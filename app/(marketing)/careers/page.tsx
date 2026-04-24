import Link from "next/link";
import type { Metadata } from "next";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import {
  JOBS,
  DEPARTMENTS,
  getJobsByDepartment,
  type JobDepartment,
} from "@/lib/careers/mock-jobs";
import "./careers.css";

export const metadata: Metadata = {
  title: "Careers — Push",
  description:
    "Eight seats. Pre-pilot. Lower Manhattan. Read each role honestly before you apply.",
};

/* ── Department one-liners ───────────────────────────────────
   One italic line per role. Plain English, specific over generic. */
const ROLE_LINES: Record<string, string> = {
  "senior-fullstack-engineer":
    "for someone who likes shipping the whole feature, not just half of it",
  "attribution-data-engineer":
    "for someone who reads receipts as carefully as they read schemas",
  "brand-designer":
    "for someone who reads spreadsheets and menus with the same eye",
  "product-manager-creator":
    "for someone who DMs creators back faster than they update Linear",
  "community-ops-lead":
    "for someone who can hold a line and pour coffee in the same hour",
  "growth-marketing-manager":
    "for someone who runs experiments without burning the brand for clicks",
  "head-of-compliance":
    "for someone who has lived inside FTC + payments rules already",
  "general-manager-nyc":
    "for someone who knows which Mott Street block closes for Lunar New Year",
};

/* ── Why work here — honest, no perks theater ─────────────── */
const WHY_LINES = [
  {
    line: "You'll wear three hats.",
    body: "Five people built this. There is no spec writer, no brand reviewer, no dedicated SRE. You will pick up things that are not in your job description, and you will hand off things that are.",
  },
  {
    line: "Equity is real. Cash runway is tight.",
    body: "Salaries are honest, not lavish. The cap table is clean and you'll see it before you sign. If you want top-of-market base, this is not the seat. If you want ownership in something you can point at, it is.",
  },
  {
    line: "First pilot opens June 22.",
    body: "Seven blocks of Lower Manhattan. Five anchored venues. Ten creators. Whoever joins now is in the room for the first scan, the first dispute, the first payout. We will not get to repeat the first month.",
  },
  {
    line: "You will meet the people you build for.",
    body: "Restaurant owners on Mott Street. Creators who walk Tribeca on weekends. You'll hear their words at the next meeting and watch the product change because of it.",
  },
];

/* ── Hiring process — four honest steps ───────────────────── */
const PROCESS_STEPS = [
  {
    num: "01",
    name: "Application",
    desc: "Send what you've shipped, not just a resume. Jiaming reads every one. Reply within five business days.",
  },
  {
    num: "02",
    name: "Intro call",
    desc: "Thirty minutes. We will tell you exactly where the company is, what is broken, and what the role looks like the first week.",
  },
  {
    num: "03",
    name: "Work sample",
    desc: "Scoped, paid, capped at three hours. Whatever you build, you keep.",
  },
  {
    num: "04",
    name: "Offer",
    desc: "Final conversation with the team. Written offer with full comp breakdown — base, equity, vesting, the cap table number. No lowball games.",
  },
];

export default function CareersPage() {
  const byDepartment = getJobsByDepartment();

  return (
    <>
      <ScrollRevealInit />

      {/* ═══════════════ 01 — HERO (ink) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette careers-hero-v7"
        style={{
          position: "relative",
          minHeight: "92svh",
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
            Hiring for pilot · June&nbsp;22
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            {JOBS.length} open seats · Lower Manhattan
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
            Who we need
          </div>

          {/* Massive Darky 900 + Darky 200 ghost */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 14vw, 220px)",
              fontWeight: 900,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: "#fff",
              margin: 0,
            }}
          >
            Eight seats
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
              fontSize: "clamp(40px, 8vw, 132px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            small team, loud doors
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
            Push is five people in a back room on Mott Street, building a
            QR-and-receipt rail for restaurants that watch $800 of Instagram ads
            disappear every week. We are pre-pilot. June 22 is when the first
            scan happens.
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
            We are hiring eight people. No growth team, no platform team, no
            layer of management. Each role below comes with a one-line filter —
            read it first. If it doesn&apos;t sound like you, the job probably
            is not.
          </p>

          {/* Three small facts strip */}
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
                {JOBS.length}
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
                Open seats
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
                NYC and remote-friendly
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
                People here today
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
          <a
            href="#open-roles"
            className="scroll-indicator"
            style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            Read the roles
          </a>
        </div>
      </section>

      {/* ═══════════════ 02 — OPEN ROLES (bento + card-premium) ═══════════════ */}
      <section
        className="section section-bright careers-roles-v7"
        id="open-roles"
      >
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="02">
              The eight
            </div>
            <h2 className="careers-split-headline">
              <span className="wt-900">Read the line.</span>{" "}
              <span className="wt-300">Then apply.</span>
            </h2>
            <p className="careers-split-body">
              Each role has a one-sentence filter and three or four things you
              will actually do day one. No ladders, no leveling rubric, no
              internal mobility decks.
            </p>
          </div>

          {DEPARTMENTS.filter((dept) => byDepartment[dept]?.length > 0).map(
            (dept: JobDepartment) => (
              <div key={dept} className="careers-dept-block">
                <p className="careers-dept-tag">{dept}</p>
                <div className="bento-grid careers-roles-bento">
                  {byDepartment[dept].map((job, i) => (
                    <Link
                      key={job.slug}
                      href={`/careers/${job.slug}`}
                      className="card-premium careers-role-card-v7 reveal"
                      style={{
                        gridColumn:
                          byDepartment[dept].length === 1
                            ? "span 12"
                            : "span 6",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    >
                      <div className="careers-role-card-inner">
                        <div
                          className="section-marker"
                          data-num={String(i + 1).padStart(2, "0")}
                        >
                          {dept}
                        </div>
                        <h3 className="careers-role-card-title">
                          {job.title}
                          <span
                            aria-hidden="true"
                            style={{
                              color: "var(--brand-red)",
                              marginLeft: "-0.04em",
                            }}
                          >
                            .
                          </span>
                        </h3>
                        <p className="careers-role-card-line">
                          {ROLE_LINES[job.slug] ?? ""}
                        </p>
                        <ul className="careers-role-card-bullets">
                          {job.youllBe.slice(0, 3).map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                        <div className="careers-role-card-footer">
                          <span className="careers-role-card-meta">
                            {job.location} · {job.type} · {job.compensation}
                          </span>
                          <span className="careers-role-card-cta">
                            apply&nbsp;&rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ═══════════════ 03 — WHY HERE (declarative honesty) ═══════════════ */}
      <section className="section careers-why-v7">
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="03">
              Before you apply
            </div>
            <h2 className="careers-split-headline">
              <span className="wt-900">Four things</span>{" "}
              <span className="wt-300">we say out loud.</span>
            </h2>
            <p className="careers-split-body">
              No perks theater. The list below is what we&apos;d say to a friend
              before they joined — equity over cash, ambiguity over comfort, the
              first scan in the room.
            </p>
          </div>

          <div className="careers-why-grid">
            {WHY_LINES.map((w, i) => (
              <div
                key={w.line}
                className="careers-why-row reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="careers-why-num">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="careers-why-text">
                  <h3 className="careers-why-line">{w.line}</h3>
                  <p className="careers-why-body">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 — HOW WE HIRE (process) ═══════════════ */}
      <section className="section section-bright careers-process-v7">
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="04">
              How we hire
            </div>
            <h2 className="careers-split-headline">
              <span className="wt-900">Four steps.</span>{" "}
              <span className="wt-300">No games.</span>
            </h2>
            <p className="careers-split-body">
              Read by hand. Replied by hand. Final offer comes with a written
              cap-table number, not a verbal hint.
            </p>
          </div>

          <div className="careers-process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="careers-process-step-v7 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="careers-process-num">{step.num}</div>
                <h3 className="careers-process-name">{step.name}</h3>
                <p className="careers-process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 — CTA (dark) ═══════════════ */}
      <section className="careers-cta-v7" aria-labelledby="careers-cta-heading">
        <div className="container">
          <div className="careers-cta-inner reveal">
            <div
              className="section-marker"
              data-num="05"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Don&apos;t see the seat
            </div>
            <h2 id="careers-cta-heading" className="careers-cta-headline">
              <span className="wt-900">Write anyway.</span>
              <br />
              <span className="wt-200">we read every one.</span>
            </h2>
            <p className="careers-cta-body">
              Send a note to careers@pushnyc.com — your work, the blocks you
              walk, what you want to build. No template. We answer by hand
              within five business days.
            </p>
            <div className="careers-cta-actions">
              <a href="mailto:careers@pushnyc.com" className="btn btn-primary">
                Email careers@pushnyc.com
              </a>
              <Link href="/about" className="btn btn-ghost careers-cta-ghost">
                Read about us&nbsp;&rarr;
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
              every email read by hand · 5 business-day reply
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
