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
    "Join Push and rewrite local marketing. 8 open roles across Engineering, Design, Product, Growth, and Ops.",
};

const VALUES = [
  { num: "01", label: "Honest" },
  { num: "02", label: "Local" },
  { num: "03", label: "Verified" },
  { num: "04", label: "Fair" },
  { num: "05", label: "Fast" },
];

const BENEFITS = [
  {
    icon: "100%",
    name: "Full Health",
    desc: "Medical, dental, and vision — 100% company-paid. You pick the plan.",
  },
  {
    icon: "28",
    name: "4 Weeks PTO",
    desc: "Minimum. We measure output, not hours on Slack.",
  },
  {
    icon: "$3k",
    name: "Learning Budget",
    desc: "Books, courses, conferences — $3,000 annually, no approval required.",
  },
  {
    icon: "⬛",
    name: "Real Equity",
    desc: "Meaningful options with a clean cap table. You'll understand what you own.",
  },
  {
    icon: "4×",
    name: "NYC Offsite",
    desc: "Quarterly all-hands in New York City. Flights and hotel covered.",
  },
  {
    icon: "$1.5k",
    name: "Home Office",
    desc: "One-time $1,500 stipend to set up wherever you do your best work.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    name: "Application",
    desc: "Send us your work, not just your resume. We read everything. Response within 5 business days.",
  },
  {
    num: "02",
    name: "Intro call",
    desc: "30 minutes with the hiring manager. We'll tell you exactly where we are and what the role actually looks like day one.",
  },
  {
    num: "03",
    name: "Work sample",
    desc: "A scoped, paid exercise. We respect your time — nothing longer than 3 hours. You keep what you build.",
  },
  {
    num: "04",
    name: "Offer",
    desc: "Final conversation with the team, then a written offer with full comp breakdown. No lowball games.",
  },
];

export default function CareersPage() {
  const byDepartment = getJobsByDepartment();

  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="careers-hero">
        <div className="careers-hero-inner">
          <p className="careers-hero-eyebrow reveal">Push — Careers</p>
          <h1 className="careers-hero-headline reveal">
            <span className="hero-line-accent">Rewrite</span>
            <span>local</span>
            <span className="hero-line-ghost">marketing.</span>
          </h1>
          <div className="careers-hero-meta reveal">
            <p className="careers-hero-count">
              <strong>{JOBS.length}</strong>open roles right now
            </p>
            <span className="careers-hero-scroll">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── Values strip ────────────────────────────────── */}
      <section className="careers-values">
        <div className="careers-values-inner">
          {VALUES.map((v) => (
            <div key={v.num} className="careers-value-item">
              <span className="careers-value-num">{v.num}</span>
              <span className="careers-value-label">{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hiring philosophy ───────────────────────────── */}
      <section className="careers-section careers-philosophy">
        <div className="careers-inner">
          <div className="careers-philosophy-grid">
            {/* Left: decorative number */}
            <div>
              <p className="careers-philosophy-label reveal">
                Hiring philosophy
              </p>
              <div className="careers-philosophy-number reveal">→</div>
            </div>

            {/* Right: long-form editorial copy */}
            <div>
              <h2 className="careers-philosophy-headline reveal">
                We hire slowly.
                <br />
                We trust quickly.
              </h2>
              <div className="careers-philosophy-body reveal">
                <p>
                  Push is building something that hasn&apos;t existed before — a
                  verified, attribution-backed creator network for local
                  businesses. That means every person we hire is shaping the
                  product, the culture, and the market simultaneously. We
                  can&apos;t afford to get it wrong.
                </p>
                <p>
                  <strong>
                    We don&apos;t hire for roles. We hire for ownership.
                  </strong>{" "}
                  Every open position at Push comes with real responsibility
                  from day one. There&apos;s no ramp of six months before you
                  touch anything important. If you join us, you will be doing
                  consequential work in your first two weeks.
                </p>
                <p>
                  We care about craft above credentials. The background check
                  that matters at Push is your work — what you&apos;ve shipped,
                  how you think about problems, and whether you can hold a high
                  standard under pressure. Degrees are fine. Portfolios and
                  track records are what move us.
                </p>
                <p>
                  <strong>Honesty is a requirement, not a value.</strong> We
                  give direct feedback and expect the same. We tell candidates
                  exactly where we are financially, what the risks are, and what
                  the equity really means. We don&apos;t sell dreams. If Push is
                  the right move for you, you&apos;ll know it because of the
                  facts, not the pitch.
                </p>
                <p>
                  Finally: we build for New York City. If you&apos;re not
                  genuinely interested in how local businesses work — in the
                  texture of neighborhoods, in why a great restaurant in Crown
                  Heights has no marketing budget, in what creators actually
                  care about — this probably isn&apos;t the right place. If you
                  are, you&apos;ll fit right in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits grid ───────────────────────────────── */}
      <section className="careers-section careers-benefits">
        <div className="careers-inner">
          <div className="careers-benefits-header">
            <p className="careers-benefits-eyebrow reveal">What we offer</p>
            <h2 className="careers-benefits-title reveal">
              Straightforward benefits.
            </h2>
          </div>
          <div className="careers-benefits-grid">
            {BENEFITS.map((b, i) => (
              <div
                key={b.name}
                className="careers-benefit-card reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="careers-benefit-icon">{b.icon}</div>
                <h3 className="careers-benefit-name">{b.name}</h3>
                <p className="careers-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open roles ──────────────────────────────────── */}
      <section className="careers-section careers-roles" id="open-roles">
        <div className="careers-inner">
          <div className="careers-roles-header">
            <h2 className="careers-roles-title reveal">Open roles</h2>
            <span className="careers-roles-count">
              {JOBS.length} positions · NYC &amp; Remote
            </span>
          </div>

          {DEPARTMENTS.filter((dept) => byDepartment[dept]?.length > 0).map(
            (dept: JobDepartment) => (
              <div key={dept} className="careers-dept-group">
                <p className="careers-dept-label">{dept}</p>
                {byDepartment[dept].map((job) => (
                  <Link
                    key={job.slug}
                    href={`/careers/${job.slug}`}
                    className="careers-job-row"
                  >
                    <span className="careers-job-title">{job.title}</span>
                    <span className="careers-job-location">{job.location}</span>
                    <span className="careers-job-type">{job.type}</span>
                  </Link>
                ))}
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── Interview process ────────────────────────────── */}
      <section className="careers-section careers-process">
        <div className="careers-inner">
          <p className="careers-process-eyebrow reveal">How we hire</p>
          <h2 className="careers-process-title reveal">
            Four steps. No games.
          </h2>
          <div className="careers-process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="careers-process-step reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="careers-step-num">{step.num}</div>
                <h3 className="careers-step-name">{step.name}</h3>
                <p className="careers-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── General application CTA ─────────────────────── */}
      <section className="careers-section careers-general-cta">
        <div className="careers-inner">
          <div className="careers-cta-inner reveal">
            <div>
              <p className="careers-cta-label">
                Don&apos;t see the right role?
              </p>
              <h2 className="careers-cta-headline">
                We still want
                <br />
                to hear from you.
              </h2>
              <p className="careers-cta-sub">
                Send a note to <strong>careers@pushnyc.com</strong> with your
                background and what kind of work you want to do. We keep every
                application on file and reach out when something clicks.
              </p>
            </div>
            <div>
              <a
                href="mailto:careers@pushnyc.com"
                className="careers-btn-primary"
              >
                Send a general application
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
