"use client";

// v11 Contact Page — utility page register, 8px grid, closed color list
// Panel 1: Hero (surface) · Panel 2: Form + Info two-column (surface-2)
// Sig Divider · Ticket CTA
// TypeScript logic preserved 1:1

import { useState } from "react";
import Link from "next/link";
import "./contact.css";

/* ── Contact Form ─────────────────────────────────────────── */
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      await new Promise((r) => setTimeout(r, 1200));
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  /* ── Success state ──────────────────────────────────────── */
  if (state === "success") {
    return (
      <div role="status" aria-live="polite" className="contact-success">
        <div className="contact-success-icon" aria-hidden>
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="contact-success-headline">Got it.</h3>
        <p className="contact-success-body">
          Jiaming reads every message and replies within one business day —
          often the same hour.
        </p>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form">
      {/* Name + Email row */}
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="cf-name" className="contact-label">
            Full Name
          </label>
          <input
            id="cf-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="contact-input"
          />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-email" className="contact-label">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="contact-input"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="contact-field">
        <label htmlFor="cf-subject" className="contact-label">
          Subject
        </label>
        <div className="contact-select-wrap">
          <select
            id="cf-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="contact-input contact-select"
          >
            <option>General</option>
            <option>Merchant</option>
            <option>Creator</option>
            <option>Press</option>
            <option>Partnership</option>
          </select>
          <span className="contact-select-arrow" aria-hidden>
            ↓
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="contact-field">
        <label htmlFor="cf-message" className="contact-label">
          Message
        </label>
        <textarea
          id="cf-message"
          placeholder="What's on your mind — one paragraph is fine."
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="contact-input contact-textarea"
        />
      </div>

      {/* Error */}
      {state === "error" && errorMsg && (
        <p role="alert" className="contact-error">
          {errorMsg}
        </p>
      )}

      {/* Submit — btn-primary per § 9 unified button system */}
      <button
        type="submit"
        className="btn-primary click-shift"
        disabled={state === "submitting"}
        aria-busy={state === "submitting"}
        style={{ alignSelf: "flex-start" }}
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

/* ── Contact method cards data ─────────────────────────────── */
const CONTACT_METHODS = [
  {
    icon: "✉",
    label: "General",
    value: "hello@pushnyc.com",
    href: "mailto:hello@pushnyc.com",
    sla: "Reply in 1 business day",
  },
  {
    icon: "🏪",
    label: "Merchants",
    value: "merchants@pushnyc.com",
    href: "mailto:merchants@pushnyc.com",
    sla: "Same-day on weekdays",
  },
  {
    icon: "✦",
    label: "Creators",
    value: "creators@pushnyc.com",
    href: "mailto:creators@pushnyc.com",
    sla: "Same-day on weekdays",
  },
  {
    icon: "◎",
    label: "Press",
    value: "press@pushnyc.com",
    href: "mailto:press@pushnyc.com",
    sla: "24h with deadline noted",
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main className="contact-page">
      {/* ═══════════════════════════════════════════════════════
          PANEL 1 — Hero · background: var(--surface)
          (CONTACT) eyebrow 12px mono · H1 "Get in touch" Darky 40px
          Utility page: NOT full Magvix hero — H1 at 40px per brief
          ═══════════════════════════════════════════════════════ */}
      <section aria-label="Hero" className="contact-hero">
        {/* Decorative ghost */}
        <span aria-hidden="true" className="contact-hero-ghost">
          hi
        </span>

        <div className="contact-hero-inner">
          {/* (CONTACT) eyebrow 12px mono per brief */}
          <p className="contact-eyebrow">(CONTACT)</p>

          {/* H1 — "Get in touch" Darky 40px (utility page, NOT clamp hero) */}
          <h1 className="contact-hero-title">Get in touch.</h1>

          <p className="contact-hero-sub">
            Push is small. Jiaming reads everything and writes back himself —
            usually within a business day, often the same hour. No bots, no
            ticket numbers.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 2 — Form + Info · background: var(--surface-2)
          Two-column: left = contact form · right = contact methods
          ═══════════════════════════════════════════════════════ */}
      <section aria-label="Contact" className="contact-panel">
        <div className="contact-section-inner contact-two-col">
          {/* Left column — contact form */}
          <div className="contact-form-col">
            <p className="contact-eyebrow-ink">(OR JUST WRITE)</p>
            <h2 className="contact-panel-h2">
              Not sure which
              <br />
              inbox to use?
            </h2>
            <p className="contact-panel-body">
              Drop a line here. It routes to the right person automatically.
              Real human on the other side, every time.
            </p>

            {/* Promise list */}
            <div className="contact-promises">
              {[
                "One reply, one human — no auto-acknowledgement",
                "1 business day or sooner, often the same hour",
                "Founder reads anything marked urgent",
              ].map((promise) => (
                <div key={promise} className="contact-promise-item">
                  <span className="contact-promise-dash" aria-hidden>
                    —
                  </span>
                  <span>{promise}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <ContactForm />
          </div>

          {/* Right column — contact methods */}
          <div className="contact-methods-col">
            <p className="contact-eyebrow-ink">(DIRECT LINES)</p>
            <h2 className="contact-panel-h2">
              Four inboxes.
              <br />
              One human per lane.
            </h2>

            {/* Contact method cards — r-md 10px, surface bg, 40×40 icon tile, hover shift */}
            <div className="contact-methods-list">
              {CONTACT_METHODS.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="contact-method-card click-shift"
                >
                  {/* Icon 40×40 tile per § 4.3 */}
                  <div className="contact-method-icon-tile" aria-hidden>
                    <span className="contact-method-icon-glyph">
                      {method.icon}
                    </span>
                  </div>

                  {/* Text block */}
                  <div className="contact-method-text">
                    <p className="contact-method-label">{method.label}</p>
                    <p className="contact-method-value">{method.value}</p>
                    <p className="contact-method-sla">{method.sla}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact info editorial table */}
            <div className="contact-info-table">
              {[
                { key: "Email", val: "hello@pushnyc.com" },
                { key: "Response time", val: "1 business day or sooner" },
                { key: "Availability", val: "Mon–Fri, 9 AM – 7 PM ET" },
                { key: "Pilot zone", val: "Brooklyn · Lower Manhattan" },
              ].map((row) => (
                <div key={row.key} className="contact-info-row">
                  <span className="contact-info-key">{row.key}</span>
                  <span className="contact-info-val">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 3 — Location Strip · var(--char) dark
          ═══════════════════════════════════════════════════════ */}
      <section aria-label="Location" className="contact-location-section">
        <div className="contact-section-inner">
          <div className="contact-location-layout">
            <div>
              <p
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.4)", marginBottom: 16 }}
              >
                (WHERE WE ARE)
              </p>
              <h2 className="contact-location-h2">
                No office yet.
                <br />
                <span className="contact-location-h2-dim">
                  We walk the block.
                </span>
              </h2>
              <p className="contact-location-body">
                Push is based in Brooklyn. The work happens on the sidewalk, in
                the venues, at the counter. Coffee is on us if you are in the
                neighborhood.
              </p>
            </div>

            <div className="contact-location-meta">
              {[
                {
                  key: "Pilot zone",
                  val: "Brooklyn · SoHo · Tribeca · Chinatown",
                },
                { key: "Hours", val: "Mon–Fri, 9–7 ET" },
                { key: "Email", val: "hello@pushnyc.com" },
                { key: "Status", val: "status.push.nyc" },
              ].map((row) => (
                <div key={row.key} className="contact-location-row">
                  <span className="contact-location-key">{row.key}</span>
                  <span className="contact-location-val">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SIG DIVIDER
          ═══════════════════════════════════════════════════════ */}
      <div className="contact-sig-wrap">
        <span className="sig-divider">Story · Scan · Pay ·</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TICKET CTA (§ 8.2)
          ═══════════════════════════════════════════════════════ */}
      <div className="contact-cta-wrap">
        <div className="ticket-panel" style={{ position: "relative" }}>
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
                borderRadius: "var(--r-full)",
                background: "var(--ink)",
                ...pos,
              }}
            />
          ))}

          <p
            className="eyebrow"
            style={{
              color: "rgba(10,10,10,0.55)",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            (READY TO START)
          </p>

          <h2
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 56px)",
              color: "var(--ink)",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            Join the pilot.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "rgba(10,10,10,0.65)",
              marginBottom: 32,
              textAlign: "center",
              lineHeight: 1.55,
              maxWidth: "40ch",
              margin: "0 auto 32px",
            }}
          >
            Merchants and creators in Brooklyn and Lower Manhattan — we are
            accepting applications now.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/for-merchants" className="btn-ink click-shift">
              I am a Merchant
            </Link>
            <Link href="/for-creators" className="btn-ghost click-shift">
              I am a Creator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
