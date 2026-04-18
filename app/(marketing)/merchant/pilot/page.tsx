"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "../../landing.css";
import "./pilot.css";

/* ── Eligibility data ───────────────────────────────────── */
const ELIGIBILITY = [
  {
    zip: "Williamsburg",
    focus: "Primary beachhead",
    status: "active",
    sub: "11211 · 11206 · 11249",
  },
  {
    zip: "Greenpoint",
    focus: "Adjacent expansion",
    status: "queue",
    sub: "11222",
  },
  {
    zip: "Bushwick",
    focus: "Adjacent expansion",
    status: "queue",
    sub: "11237 · 11206",
  },
];

/* ── Flow steps ─────────────────────────────────────────── */
const FLOW = [
  {
    n: "01",
    title: "Apply",
    body: "Tell us your business, your IG, and how many customers you want. We review within 48 hours.",
  },
  {
    n: "02",
    title: "AI brief preview",
    body: "Claude matches 5 local creators, drafts a brief, predicts ROI — you see it before anyone posts.",
  },
  {
    n: "03",
    title: "Launch within 7 days",
    body: "Approve the brief. Campaign goes live. First 10 verified customers are free — AI delivers or it's free.",
  },
];

export default function PilotPage() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
              Williamsburg Coffee Pilot · First 10 Merchants
            </span>
          </div>

          <h1 id="pilot-h" className="pilot-hero-h">
            <span className="pilot-hero-l1">
              <span className="pilot-hero-conn">First 10 merchants.</span>
            </span>
            <span className="pilot-hero-l2">
              <span className="pilot-hero-key">$0 Pilot.</span>
            </span>
            <span className="pilot-hero-l3">
              <em className="pilot-hero-accent">
                AI delivers, or it&apos;s free.
              </em>
            </span>
          </h1>

          <p className="pilot-hero-sub">
            No SaaS. No agency markup. No catch. We run a
            multi-modal-AI-verified customer acquisition pilot for the first 10
            Williamsburg coffee merchants to apply. First 10 AI-verified
            customers on us.
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
            Coffee merchants,{" "}
            <span className="pilot-section-h-light">Williamsburg first.</span>
          </h2>

          <p className="pilot-section-sub reveal">
            Network density over breadth. One category, one ZIP, 60 days.
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
              Brick-and-mortar coffee shop with physical entry point
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Registered business in the New York City metro area
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Willing to display a QR code at point-of-entry
            </li>
            <li>
              <span className="pilot-criteria-dot" />
              Able to receive a short agent onboarding call
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
            <span className="pilot-section-h-light">AI does the middle.</span>
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
              We review every application within 48 hours. Agent prepares a
              brief preview for approved merchants. Launch within 7 days or we
              refund the pilot outright &mdash; but it&apos;s already $0, so
              there&apos;s nothing to refund. That&apos;s the point.
            </p>

            <ul className="pilot-apply-promise">
              <li>No credit card required</li>
              <li>First 10 AI-verified customers free</li>
              <li>Cancel anytime &mdash; keep customers already delivered</li>
            </ul>
          </div>

          <div
            className="pilot-apply-right reveal"
            style={{ transitionDelay: "100ms" }}
          >
            {submitted ? (
              <div className="pilot-apply-thanks" role="status">
                <span className="pilot-apply-thanks-eyebrow">
                  Application received
                </span>
                <h3 className="pilot-apply-thanks-h">Agent is reviewing.</h3>
                <p className="pilot-apply-thanks-body">
                  We&apos;ll reach out within 48 hours with your AI brief
                  preview. If Williamsburg coffee is your fit, you&apos;ll be
                  live within a week.
                </p>
                <Link href="/" className="pilot-apply-thanks-link">
                  Back to home &rarr;
                </Link>
              </div>
            ) : (
              <form className="pilot-apply-form" onSubmit={handleSubmit}>
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
                  disabled={pending}
                >
                  {pending ? "Submitting…" : "Apply for $0 Pilot"}
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
