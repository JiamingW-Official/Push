"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "../../landing.css";
import "./pilot.css";

/* ── Stepper labels (v5.1) ──────────────────────────────── */
const STEPS = [
  { n: 1, label: "Business" },
  { n: 2, label: "Pre-Pilot LOI" },
  { n: 3, label: "Brief Preview" },
];

/* ── Goal → projected metrics (mock ConversionOracle) ───── */
const GOAL_PROJECTIONS: Record<
  string,
  { customers: number; window: string; budget: string; roi: string }
> = {
  "10": {
    customers: 10,
    window: "7 days",
    budget: "$0 (Pilot)",
    roi: "Est. 3.2x 30-day LTV",
  },
  "20": {
    customers: 20,
    window: "14 days",
    budget: "$0 (Pilot cap)",
    roi: "Est. 3.6x 30-day LTV",
  },
  "50": {
    customers: 50,
    window: "30 days",
    budget: "$0 Pilot + $500 Operator",
    roi: "Est. 4.1x 30-day LTV",
  },
  custom: {
    customers: 0,
    window: "Custom",
    budget: "Custom",
    roi: "Will scope on call",
  },
};

/* ── Mock creator matches (for brief preview) ───────────── */
const MOCK_CREATORS = [
  { handle: "@maya.eats.nyc", tier: "Operator · Steel", fit: 94 },
  { handle: "@brooklyn_bites", tier: "Operator · Steel", fit: 91 },
  { handle: "@nyc.specialty", tier: "Proven · Gold", fit: 88 },
  { handle: "@williamsburg.e", tier: "Explorer · Bronze", fit: 85 },
  { handle: "@coffee.nyc", tier: "Operator · Steel", fit: 82 },
];

/* ── Eligibility data (v5.1) ────────────────────────────── */
const ELIGIBILITY = [
  {
    zip: "Williamsburg",
    focus: "5 slots remain · next 14 days",
    status: "active",
    sub: "11211 · 11206 · 11249",
  },
  {
    zip: "Greenpoint",
    focus: "Queued post-Template-0 saturation",
    status: "queue",
    sub: "11222",
  },
  {
    zip: "Bushwick",
    focus: "Queued",
    status: "queue",
    sub: "11237 · 11206",
  },
];

/* ── Flow steps (v5.1) ──────────────────────────────────── */
const FLOW = [
  {
    n: "01",
    title: "Apply & Sign LOI",
    body: "Tell us your business, IG, and customer goal. Sign $1 Pre-Pilot LOI.",
  },
  {
    n: "02",
    title: "AI brief preview",
    body: "ConversionOracle matches 5 local creators, drafts brief, predicts ROI — you see it before posting.",
  },
  {
    n: "03",
    title: "Launch within 7 days",
    body: "Approve brief. Campaign runs. First 10 AI-verified customers free. DisclosureBot handles FTC compliance automatically.",
  },
];

export default function PilotPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pending, setPending] = useState(false);
  const [loiAck, setLoiAck] = useState(false);
  const [bizName, setBizName] = useState("");
  const [ig, setIg] = useState("");
  const [maps, setMaps] = useState("");
  const [goal, setGoal] = useState("");

  /* ── GSAP parallax on hero lines (v5.1 polish) ─────────── */
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let mounted = true;
    let ctxCleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!mounted || !heroRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const el = heroRef.current!;
        const eyebrow = el.querySelector(".pilot-hero-eyebrow");
        const l1 = el.querySelector(".pilot-hero-l1");
        const l2 = el.querySelector(".pilot-hero-l2");
        const l3 = el.querySelector(".pilot-hero-l3");

        const makeTween = (target: Element | null, y: number) => {
          if (!target) return;
          gsap.to(target, {
            yPercent: y,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        };

        makeTween(eyebrow, -40);
        makeTween(l1, -28);
        makeTween(l2, -14);
        makeTween(l3, -6);
      }, heroRef);

      ctxCleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      ctxCleanup?.();
    };
  }, []);

  const step1Valid =
    bizName.trim() !== "" &&
    ig.trim() !== "" &&
    maps.trim() !== "" &&
    goal !== "";

  function handleStep1Next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!step1Valid) return;
    setStep(2);
  }

  function handleLoiSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loiAck) return;
    setPending(true);
    // Mock submit — no real API yet; P2 wires /api/merchant/pilot
    setTimeout(() => {
      setPending(false);
      setStep(3);
      if (typeof window !== "undefined") {
        // Scroll the brief into view after render
        setTimeout(
          () =>
            document
              .getElementById("brief")
              ?.scrollIntoView({ behavior: "smooth" }),
          80,
        );
      }
    }, 1200);
  }

  const projection = goal ? GOAL_PROJECTIONS[goal] : null;

  return (
    <>
      <ScrollRevealInit />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section ref={heroRef} className="pilot-hero" aria-labelledby="pilot-h">
        <div className="container pilot-hero-inner">
          <div className="pilot-hero-label">
            <span className="rule" />
            <span className="eyebrow pilot-hero-eyebrow">
              Williamsburg Coffee+ Pilot · First 10 Merchants · Pre-Pilot LOI $1
            </span>
          </div>

          <h1 id="pilot-h" className="pilot-hero-h">
            <span className="pilot-hero-l1">
              <span className="pilot-hero-conn">First 10 merchants.</span>
            </span>
            <span className="pilot-hero-l2">
              <span className="pilot-hero-key">$0 Pilot + $1 LOI.</span>
            </span>
            <span className="pilot-hero-l3">
              <em className="pilot-hero-accent">
                AI delivers, or it&apos;s free.
              </em>
            </span>
          </h1>

          <p className="pilot-hero-sub">
            Vertical AI for Local Commerce. ConversionOracle drafts the brief, a
            3-layer verification stack (QR scan + receipt OCR + geo-match)
            confirms every customer, and DisclosureBot handles FTC compliance.
            Pilot cost cap $4,200/neighborhood · Pre-Pilot LOI $1 · 60-day
            commitment.
          </p>

          <div className="pilot-hero-ctas">
            <a href="#apply" className="btn-fill">
              Apply for pilot
            </a>
            <a href="#how" className="btn-outline-light">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY STRIP ──────────────────────────────── */}
      <section className="pilot-eligibility" aria-labelledby="pilot-eli-h">
        <div className="container">
          <div className="pilot-section-tag reveal">
            <span className="section-tag-num">01</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Eligibility</span>
          </div>

          <h2 id="pilot-eli-h" className="pilot-section-h reveal">
            Williamsburg Coffee+,{" "}
            <span className="pilot-section-h-light">
              Two-Segment beachhead.
            </span>
          </h2>

          <p className="pilot-section-sub reveal">
            Neighborhood Playbook: Williamsburg Coffee+ only (AOV $8-20). One
            category, one ZIP cluster, 60 days.
          </p>

          <div className="pilot-eli-grid">
            {ELIGIBILITY.map((e, i) => (
              <div
                key={e.zip}
                className={`pilot-eli-card pilot-eli-card--${e.status} reveal`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="pilot-eli-status">
                  {e.status === "active" ? "Active" : "Queue"}
                </span>
                <h3 className="pilot-eli-zip">{e.zip}</h3>
                <p className="pilot-eli-focus">{e.focus}</p>
                <p className="pilot-eli-sub">{e.sub}</p>
                {e.status === "queue" && (
                  <a
                    href={`#apply`}
                    className="pilot-eli-notify"
                    aria-label={`Notify me when ${e.zip} opens`}
                  >
                    Notify me &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>

          <ul className="pilot-criteria reveal">
            <li>
              <span className="pilot-criteria-dot" />
              Brick-and-mortar Coffee+ shop (specialty coffee with
              bakery/brunch; AOV $8-20)
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Registered business in NYC metro
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Willing to display a QR code at point of entry
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Able to sign $1 Pre-Pilot LOI with 60-day commitment and
              case-study authorization
            </li>
          </ul>
        </div>
      </section>

      {/* ── 3-STEP FLOW ────────────────────────────────────── */}
      <section
        id="how"
        className="pilot-flow section-bright"
        aria-labelledby="pilot-flow-h"
      >
        <div className="container">
          <div className="pilot-section-tag reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">How the pilot runs</span>
          </div>

          <h2 id="pilot-flow-h" className="pilot-section-h reveal">
            Three steps.{" "}
            <span className="pilot-section-h-light">
              ConversionOracle does the middle.
            </span>
          </h2>

          <div className="pilot-flow-grid">
            {FLOW.map((step, i) => (
              <div
                key={step.n}
                className="pilot-flow-card reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="pilot-flow-ghost" aria-hidden="true">
                  {step.n}
                </span>
                <span className="pilot-flow-num">{step.n}</span>
                <h3 className="pilot-flow-title">{step.title}</h3>
                <p className="pilot-flow-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI VERIFICATION REMINDER ───────────────────────── */}
      <section className="pilot-verify-section">
        <div className="container">
          <div className="pilot-section-tag reveal">
            <span className="section-tag-num">03</span>
            <span className="section-tag-line" />
            <span className="section-tag-label">Verification</span>
          </div>
          <h2 className="pilot-section-h reveal">
            Every customer,{" "}
            <span className="pilot-section-h-light">triple-checked.</span>
          </h2>
          <p className="pilot-section-sub reveal">
            Every customer triple-checked. 88% auto-verify rate target by Month
            3.
          </p>
          <ul
            className="pilot-verify-pills reveal"
            style={{ transitionDelay: "80ms" }}
            aria-label="Verification stack"
          >
            <li className="pilot-verify-pill">
              <span className="pilot-verify-pill-dot" aria-hidden="true" />
              QR scan
            </li>
            <li className="pilot-verify-pill">
              <span className="pilot-verify-pill-dot" aria-hidden="true" />
              Vision OCR
            </li>
            <li className="pilot-verify-pill">
              <span className="pilot-verify-pill-dot" aria-hidden="true" />
              Geo-fence
            </li>
          </ul>
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <VerificationBadge />
          </div>
        </div>
      </section>

      {/* ── APPLY FORM ─────────────────────────────────────── */}
      <section
        id="apply"
        className="pilot-apply-section"
        aria-labelledby="pilot-apply-h"
      >
        <div className="container pilot-apply-inner">
          <div className="pilot-apply-left reveal">
            <div className="pilot-section-tag">
              <span className="section-tag-num">04</span>
              <span className="section-tag-line" />
              <span className="section-tag-label">Apply</span>
            </div>

            <h2 id="pilot-apply-h" className="pilot-apply-h">
              Tell us{" "}
              <span className="pilot-section-h-light">how many customers</span>{" "}
              you need.
            </h2>

            <p className="pilot-apply-sub">
              We review every application within 48 hours. ConversionOracle
              prepares a brief preview for approved merchants. Launch within 7
              days. First 10 AI-verified customers free; pilot cost capped at
              $4,200/neighborhood (Push absorbs 70% of standard creator payout
              during Pilot). Customer 11 triggers Operator tier auto-flip
              ($500/mo min + $25/customer Coffee+ rate + Retention Add-on).
            </p>

            <ul className="pilot-apply-promise">
              <li>No credit card required · $1 nominal LOI fee only</li>
              <li>First 10 AI-verified customers free per merchant</li>
              <li>
                Cancel anytime &mdash; keep all customers delivered up to that
                point
              </li>
              <li>
                Day-30 checkpoint: if under 5 verified customers, Push
                terminates Pilot and reclaims 50% of creator payout
              </li>
            </ul>
          </div>

          <div
            className="pilot-apply-right reveal"
            style={{ transitionDelay: "100ms" }}
          >
            {/* ── Stepper progress ──────────────────────── */}
            <ol
              className="pilot-stepper"
              aria-label="Pilot application progress"
            >
              {STEPS.map((s) => {
                const state =
                  step > s.n ? "done" : step === s.n ? "active" : "todo";
                return (
                  <li
                    key={s.n}
                    className={`pilot-step pilot-step--${state}`}
                    aria-current={state === "active" ? "step" : undefined}
                  >
                    <span className="pilot-step-n">
                      {state === "done" ? "\u2713" : `0${s.n}`}
                    </span>
                    <span className="pilot-step-label">{s.label}</span>
                  </li>
                );
              })}
            </ol>

            {/* ── Step 1: Business fields ─────────────── */}
            {step === 1 && (
              <form className="pilot-apply-form" onSubmit={handleStep1Next}>
                <div className="pilot-field">
                  <label htmlFor="biz-name" className="pilot-label">
                    Business name
                  </label>
                  <input
                    id="biz-name"
                    name="bizName"
                    type="text"
                    required
                    placeholder="Sey Coffee"
                    className="pilot-input"
                    autoComplete="organization"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                  />
                </div>

                <div className="pilot-field">
                  <label htmlFor="ig" className="pilot-label">
                    Instagram handle
                  </label>
                  <input
                    id="ig"
                    name="ig"
                    type="text"
                    required
                    placeholder="@seycoffee"
                    className="pilot-input"
                    value={ig}
                    onChange={(e) => setIg(e.target.value)}
                  />
                </div>

                <div className="pilot-field">
                  <label htmlFor="maps" className="pilot-label">
                    Google Maps URL
                  </label>
                  <input
                    id="maps"
                    name="maps"
                    type="url"
                    required
                    placeholder="https://maps.app.goo.gl/…"
                    className="pilot-input"
                    value={maps}
                    onChange={(e) => setMaps(e.target.value)}
                  />
                </div>

                <div className="pilot-field">
                  <label htmlFor="goal" className="pilot-label">
                    How many customers do you want?
                  </label>
                  <select
                    id="goal"
                    name="goal"
                    required
                    className="pilot-input pilot-select"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a goal
                    </option>
                    <option value="10">10 new customers (1 week)</option>
                    <option value="20">20 new customers (2 weeks)</option>
                    <option value="50">50 new customers (1 month)</option>
                    <option value="custom">Custom — let&apos;s talk</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-fill pilot-submit"
                  disabled={!step1Valid}
                >
                  Continue to LOI &rarr;
                </button>

                <p className="pilot-apply-fine">
                  We&apos;ll never share your info. Agent review only.
                </p>
              </form>
            )}

            {/* ── Step 2: LOI terms ───────────────────── */}
            {step === 2 && (
              <form className="pilot-apply-form" onSubmit={handleLoiSubmit}>
                <div className="pilot-loi" role="group" aria-labelledby="loi-h">
                  <span className="pilot-loi-eyebrow">
                    Pre-Pilot LOI · $1 nominal fee
                  </span>
                  <h3 id="loi-h" className="pilot-loi-h">
                    Before we prepare your brief.
                  </h3>
                  <ul className="pilot-loi-terms">
                    <li>
                      <strong>$1 nominal fee</strong> to activate Pre-Pilot LOI
                      (card on file, not charged beyond $1 during Pilot).
                    </li>
                    <li>
                      <strong>60-day commitment.</strong> You agree to run the
                      Pilot for the full window so ConversionOracle has enough
                      signal to optimize.
                    </li>
                    <li>
                      <strong>Case-study authorization.</strong> You authorize
                      Push to publish your results (logo, metrics, quotes) as a
                      public case study.
                    </li>
                    <li>
                      <strong>Day-30 checkpoint.</strong> If under 5 verified
                      customers by Day 30, Push terminates the Pilot and
                      reclaims 50% of creator payout.
                    </li>
                    <li>
                      <strong>Post-Pilot auto-flip.</strong> Customer 11
                      triggers Operator tier: $500/mo minimum + $25/customer
                      (Coffee+ rate) + Retention Add-on ($8/$6/$4).
                    </li>
                    <li>
                      <strong>Cancellation.</strong> You can cancel anytime
                      after the 60-day commitment; you keep every customer
                      delivered up to that point.
                    </li>
                  </ul>
                  <label className="pilot-loi-check">
                    <input
                      type="checkbox"
                      checked={loiAck}
                      onChange={(e) => setLoiAck(e.target.checked)}
                      required
                    />
                    <span>
                      I acknowledge the $1 Pre-Pilot LOI terms, 60-day
                      commitment, and case-study authorization.
                    </span>
                  </label>
                </div>

                <div className="pilot-step-actions">
                  <button
                    type="button"
                    className="btn-outline pilot-step-back"
                    onClick={() => setStep(1)}
                    disabled={pending}
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    className="btn-fill pilot-submit"
                    disabled={pending || !loiAck}
                  >
                    {pending ? "Signing…" : "Sign LOI & generate brief"}
                  </button>
                </div>

                <p className="pilot-apply-fine">
                  We&apos;ll never share your info. Agent review only.
                </p>
              </form>
            )}

            {/* ── Step 3: Mock ConversionOracle brief preview ── */}
            {step === 3 && projection && (
              <div id="brief" className="pilot-brief" role="status">
                <div className="pilot-brief-head">
                  <span className="pilot-brief-eyebrow">
                    ConversionOracle&trade; · Brief preview
                  </span>
                  <h3 className="pilot-brief-h">
                    Draft for <em>{bizName || "your business"}</em>
                  </h3>
                  <p className="pilot-brief-sub">
                    Generated in 60s. A strategist will review before launch and
                    ping you via email within 48 hours.
                  </p>
                </div>

                <dl className="pilot-brief-grid">
                  <div className="pilot-brief-cell">
                    <dt>Target</dt>
                    <dd>
                      {projection.customers > 0
                        ? `${projection.customers} verified customers`
                        : "Custom target"}
                    </dd>
                  </div>
                  <div className="pilot-brief-cell">
                    <dt>Window</dt>
                    <dd>{projection.window}</dd>
                  </div>
                  <div className="pilot-brief-cell">
                    <dt>Your cost</dt>
                    <dd>{projection.budget}</dd>
                  </div>
                  <div className="pilot-brief-cell">
                    <dt>ROI projection</dt>
                    <dd>{projection.roi}</dd>
                  </div>
                </dl>

                <div className="pilot-brief-matches">
                  <span className="pilot-brief-matches-label">
                    Top 5 creator matches &middot; by ConversionOracle
                  </span>
                  <ul className="pilot-brief-list">
                    {MOCK_CREATORS.map((c, i) => (
                      <li
                        key={c.handle}
                        className="pilot-brief-match"
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        <span className="pilot-brief-handle">{c.handle}</span>
                        <span className="pilot-brief-tier">{c.tier}</span>
                        <span className="pilot-brief-fit">
                          <span
                            className="pilot-brief-fit-bar"
                            style={{ width: `${c.fit}%` }}
                          />
                          <span className="pilot-brief-fit-n">{c.fit}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pilot-brief-actions">
                  <Link href="/merchant/signup" className="btn-fill">
                    Create merchant account &rarr;
                  </Link>
                  <Link
                    href="/merchant/pilot/economics"
                    className="btn-outline"
                  >
                    See pilot economics
                  </Link>
                </div>

                <p className="pilot-apply-fine">
                  Preview only. Final brief is confirmed after the 48-hour
                  strategist review.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
