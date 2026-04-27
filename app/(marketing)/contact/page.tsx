"use client";

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
        <p
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--brand-red)",
            paddingLeft: 12,
            borderLeft: "2px solid var(--brand-red)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {errorMsg}
        </p>
      )}

      {/* Submit */}
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

/* ── Page ─────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main>
      {/* ═══ 01 — HERO (dark, bottom-left anchored) ══════════ */}
      <section aria-label="Hero" className="contact-hero">
        {/* Decorative ghost text */}
        <span aria-hidden="true" className="contact-hero-ghost">
          hi
        </span>

        <div className="contact-hero-inner">
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}
          >
            (GET IN TOUCH)
          </p>
          <h1 className="contact-hero-title">{"Let's"} talk.</h1>
          <p className="contact-hero-sub">
            Push is small. Jiaming reads everything and writes back himself —
            usually within a business day, often the same hour. No bots, no
            ticket numbers.
          </p>
        </div>
      </section>

      {/* ═══ 02 — CONTACT METHODS GRID ════════════════════════ */}
      <section
        aria-label="Contact methods"
        style={{
          background: "var(--surface-2)",
          padding: "96px 0",
        }}
      >
        <div className="contact-section-inner">
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (DIRECT LINES)
          </p>
          <h2 className="contact-section-h2">
            Four inboxes.
            <br />
            One human per lane.
          </h2>

          <div className="contact-routes-grid">
            {[
              {
                lane: "General",
                email: "hello@pushnyc.com",
                sla: "Reply in 1 business day",
                desc: "Anything that does not fit another lane. We route it to the right person.",
              },
              {
                lane: "Merchants",
                email: "merchants@pushnyc.com",
                sla: "Same-day on weekdays",
                desc: "Pricing, campaign setup, block availability, platform questions.",
              },
              {
                lane: "Creators",
                email: "creators@pushnyc.com",
                sla: "Same-day on weekdays",
                desc: "Application status, tier questions, payout issues, verification disputes.",
              },
              {
                lane: "Press",
                email: "press@pushnyc.com",
                sla: "24h with deadline noted",
                desc: "Story pitches, founder interviews, data requests, embargoed releases.",
              },
            ].map((card) => (
              <div key={card.lane} className="contact-route-card">
                <p className="eyebrow" style={{ color: "var(--ink-3)" }}>
                  {card.lane}
                </p>
                <a
                  href={`mailto:${card.email}`}
                  className="contact-route-email"
                >
                  {card.email}
                </a>
                <p className="contact-route-desc">{card.desc}</p>
                <div className="contact-route-sla">
                  <span className="eyebrow" style={{ color: "var(--ink-4)" }}>
                    {card.sla}
                  </span>
                </div>
                <a
                  href={`mailto:${card.email}`}
                  className="btn-ghost click-shift"
                  style={{ alignSelf: "flex-start", fontSize: 14 }}
                >
                  Send email
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 — CONTACT FORM ════════════════════════════════ */}
      <section
        aria-label="Contact form"
        style={{
          background: "var(--surface)",
          padding: "96px 0",
        }}
      >
        <div className="contact-section-inner contact-form-layout">
          {/* Left — lead copy + promises */}
          <div className="contact-form-lead">
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (OR JUST WRITE)
            </p>
            <h2 className="contact-section-h2" style={{ marginBottom: 24 }}>
              Not sure which
              <br />
              inbox to use?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.55,
                color: "var(--ink-3)",
                marginBottom: 40,
              }}
            >
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

          {/* Right — form */}
          <ContactForm />
        </div>
      </section>

      {/* ═══ 04 — LOCATION STRIP (dark) ═══════════════════════ */}
      <section
        aria-label="Location"
        style={{
          background: "var(--char)",
          padding: "96px 0",
        }}
      >
        <div className="contact-section-inner">
          <div className="contact-location-layout">
            <div>
              <p
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.4)", marginBottom: 16 }}
              >
                (WHERE WE ARE)
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.0,
                  color: "var(--snow)",
                  margin: "0 0 24px",
                }}
              >
                No office yet.
                <br />
                <span
                  style={{
                    fontWeight: 200,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  We walk the block.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: 480,
                }}
              >
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

      {/* ═══ SIG DIVIDER ══════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Story · Scan · Pay ·</span>
      </div>

      {/* ═══ TICKET CTA ═══════════════════════════════════════ */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "0 64px 120px",
        }}
      >
        <div className="ticket-panel">
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.65)",
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
              color: "var(--snow)",
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
              color: "rgba(255,255,255,0.7)",
              marginBottom: 32,
              textAlign: "center",
              lineHeight: 1.55,
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
            <Link
              href="/for-creators"
              className="btn-ghost click-shift"
              style={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "var(--snow)",
              }}
            >
              I am a Creator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
