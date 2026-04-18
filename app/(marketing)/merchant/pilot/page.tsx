"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "../../landing.css";
import "./pilot.css";

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
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [showLOI, setShowLOI] = useState(false);
  const [loiAck, setLoiAck] = useState(false);

  function handleApplyClick(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!showLOI) {
      setShowLOI(true);
      return;
    }
    if (!loiAck) return;
    setPending(true);
    // Mock submit — no real API yet; P2 wires /api/merchant/pilot
    setTimeout(() => {
      setPending(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <>
      <ScrollRevealInit />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pilot-hero" aria-labelledby="pilot-h">
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
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="pilot-eli-status">
                  {e.status === "active" ? "Active" : "Queue"}
                </span>
                <h3 className="pilot-eli-zip">{e.zip}</h3>
                <p className="pilot-eli-focus">{e.focus}</p>
                <p className="pilot-eli-sub">{e.sub}</p>
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
            {submitted ? (
              <div className="pilot-apply-thanks" role="status">
                <span className="pilot-apply-thanks-eyebrow">LOI received</span>
                <h3 className="pilot-apply-thanks-h">Agent is reviewing.</h3>
                <p className="pilot-apply-thanks-body">
                  LOI received. Agent reviewing. You&apos;ll hear back within 48
                  hours with your ConversionOracle brief preview.
                </p>
                <Link href="/" className="pilot-apply-thanks-link">
                  Back to home &rarr;
                </Link>
              </div>
            ) : (
              <form className="pilot-apply-form" onSubmit={handleApplyClick}>
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
                    disabled={showLOI}
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
                    disabled={showLOI}
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
                    disabled={showLOI}
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
                    defaultValue=""
                    disabled={showLOI}
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

                {showLOI && (
                  <div
                    className="pilot-loi"
                    role="group"
                    aria-labelledby="loi-h"
                  >
                    <span className="pilot-loi-eyebrow">
                      Pre-Pilot LOI · $1 nominal fee
                    </span>
                    <h3 id="loi-h" className="pilot-loi-h">
                      Before we prepare your brief.
                    </h3>
                    <ul className="pilot-loi-terms">
                      <li>
                        <strong>$1 nominal fee</strong> to activate Pre-Pilot
                        LOI (card on file, not charged beyond $1 during Pilot).
                      </li>
                      <li>
                        <strong>60-day commitment.</strong> You agree to run the
                        Pilot for the full window so ConversionOracle has enough
                        signal to optimize.
                      </li>
                      <li>
                        <strong>Case-study authorization.</strong> You authorize
                        Push to publish your results (logo, metrics, quotes) as
                        a public case study.
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
                )}

                <button
                  type="submit"
                  className="btn-fill pilot-submit"
                  disabled={pending || (showLOI && !loiAck)}
                >
                  {pending
                    ? "Submitting…"
                    : showLOI
                      ? "Sign LOI & submit"
                      : "Apply"}
                </button>

                <p className="pilot-apply-fine">
                  We&apos;ll never share your info. Agent review only.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
