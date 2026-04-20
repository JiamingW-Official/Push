"use client";

import { useState, useEffect } from "react";
import "./contact.css";

/* ── Types ──────────────────────────────────────────────────── */
type Role = "merchant" | "creator" | "press" | "investor" | "other";
type FollowUp = "email" | "phone";
type FormState = "idle" | "submitting" | "success" | "error";

/* ── Outline SVG icons ─────────────────────────────────────── */
const IconSales = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSupport = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
  </svg>
);

const IconPress = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/* ── Social SVG icons (filled) ─────────────────────────────── */
const IconIG = () => (
  <svg viewBox="0 0 24 24" aria-label="Instagram">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" aria-label="TikTok">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" aria-label="X / Twitter">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" aria-label="LinkedIn">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── NYC simplified SVG map ────────────────────────────────── */
function NYCMap() {
  return (
    <div className="contact-map">
      <svg
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Simplified map of Brooklyn, New York"
      >
        {/* Water */}
        <rect width="400" height="300" fill="rgba(102, 155, 188, 0.08)" />

        {/* Manhattan silhouette (simplified) */}
        <polygon
          points="180,20 195,18 210,30 215,80 210,120 205,150 195,180 185,185 178,170 175,130 172,90 170,50"
          fill="rgba(0,48,73,0.06)"
          stroke="rgba(0,48,73,0.18)"
          strokeWidth="1"
        />

        {/* Brooklyn outline (simplified) */}
        <polygon
          points="160,160 240,145 290,155 310,175 300,230 260,255 200,260 155,245 140,215 145,185"
          fill="rgba(0,48,73,0.04)"
          stroke="rgba(0,48,73,0.15)"
          strokeWidth="1"
        />

        {/* Queens (simplified) */}
        <polygon
          points="240,80 310,70 350,100 355,155 310,175 290,155 240,145 235,120 240,90"
          fill="rgba(0,48,73,0.03)"
          stroke="rgba(0,48,73,0.12)"
          strokeWidth="1"
        />

        {/* East River */}
        <path
          d="M190,150 Q200,155 210,148 Q220,142 215,155 Q205,168 195,162 Q185,156 190,150Z"
          fill="rgba(102, 155, 188, 0.20)"
        />

        {/* Major roads — Brooklyn */}
        <line
          x1="155"
          y1="245"
          x2="300"
          y2="230"
          stroke="rgba(0,48,73,0.12)"
          strokeWidth="1"
        />
        <line
          x1="200"
          y1="160"
          x2="200"
          y2="260"
          stroke="rgba(0,48,73,0.10)"
          strokeWidth="0.75"
          strokeDasharray="4,4"
        />
        <line
          x1="160"
          y1="200"
          x2="300"
          y2="195"
          stroke="rgba(0,48,73,0.10)"
          strokeWidth="0.75"
          strokeDasharray="4,4"
        />

        {/* Pin marker — DUMBO, Brooklyn */}
        <circle cx="196" cy="185" r="6" fill="#c1121f" opacity="0.9" />
        <circle cx="196" cy="185" r="11" fill="rgba(193,18,31,0.18)" />

        {/* Labels */}
        <text
          x="160"
          y="212"
          fontFamily="monospace"
          fontSize="8"
          fill="rgba(0,48,73,0.45)"
        >
          BROOKLYN
        </text>
        <text
          x="242"
          y="108"
          fontFamily="monospace"
          fontSize="8"
          fill="rgba(0,48,73,0.35)"
        >
          QUEENS
        </text>
        <text
          x="178"
          y="70"
          fontFamily="monospace"
          fontSize="8"
          fill="rgba(0,48,73,0.35)"
        >
          MANHATTAN
        </text>
        <text
          x="162"
          y="178"
          fontFamily="monospace"
          fontSize="7"
          fill="#c1121f"
          fontWeight="bold"
        >
          PUSH HQ
        </text>

        {/* Compass rose */}
        <text
          x="22"
          y="22"
          fontFamily="monospace"
          fontSize="9"
          fill="rgba(0,48,73,0.35)"
          fontWeight="bold"
        >
          N
        </text>
        <line
          x1="26"
          y1="24"
          x2="26"
          y2="36"
          stroke="rgba(0,48,73,0.25)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* ── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Contact Form ───────────────────────────────────────────── */
const ROLES: { value: Role; label: string }[] = [
  { value: "merchant", label: "Merchant" },
  { value: "creator", label: "Creator" },
  { value: "press", label: "Press" },
  { value: "investor", label: "Investor" },
  { value: "other", label: "Other" },
];

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("merchant");
  const [message, setMessage] = useState("");
  const [followUp, setFollowUp] = useState<FollowUp | undefined>(undefined);
  const [state, setState] = useState<FormState>("idle");
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
        body: JSON.stringify({ name, email, role, message, followUp }),
      });

      // Simulate minimum 1.5s so the spinner is visible
      await new Promise((r) => setTimeout(r, 1500));

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

  if (state === "success") {
    return (
      <div className="contact-success" role="status" aria-live="polite">
        <div className="contact-success-check">
          <IconCheck />
        </div>
        <p className="contact-success-headline">
          Thanks.
          <br />
          We&apos;ll be
          <br />
          in touch.
        </p>
        <p className="contact-success-sub">
          We received your message and will follow up within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      {/* Name + Email row */}
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Role */}
      <div className="contact-role-group">
        <div className="contact-role-label" id="role-group-label">
          I am a
        </div>
        <div
          className="contact-role-options"
          role="group"
          aria-labelledby="role-group-label"
        >
          {ROLES.map(({ value, label }) => (
            <div className="role-option" key={value}>
              <input
                type="radio"
                id={`role-${value}`}
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
              />
              <label className="role-option-label" htmlFor={`role-${value}`}>
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="contact-field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          placeholder="Tell us what's on your mind…"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Preferred follow-up (optional) */}
      <div className="contact-followup-group">
        <div className="contact-followup-label" id="followup-group-label">
          Preferred follow-up{" "}
          <span
            style={{
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--text-muted)",
            }}
          >
            (optional)
          </span>
        </div>
        <div
          className="followup-options"
          role="group"
          aria-labelledby="followup-group-label"
        >
          <div className="followup-option">
            <input
              type="radio"
              id="followup-email"
              name="followUp"
              value="email"
              checked={followUp === "email"}
              onChange={() =>
                setFollowUp(followUp === "email" ? undefined : "email")
              }
            />
            <label className="followup-option-label" htmlFor="followup-email">
              <IconMail />
              Email
            </label>
          </div>
          <div className="followup-option">
            <input
              type="radio"
              id="followup-phone"
              name="followUp"
              value="phone"
              checked={followUp === "phone"}
              onChange={() =>
                setFollowUp(followUp === "phone" ? undefined : "phone")
              }
            />
            <label className="followup-option-label" htmlFor="followup-phone">
              <IconPhone />
              Phone
            </label>
          </div>
        </div>
      </div>

      {/* Error */}
      {state === "error" && errorMsg && (
        <p
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-small)",
            color: "var(--primary)",
            marginBottom: "var(--space-3)",
            paddingLeft: "12px",
            borderLeft: "2px solid var(--primary)",
          }}
        >
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="contact-submit-btn"
        disabled={state === "submitting"}
        aria-busy={state === "submitting"}
      >
        {state === "submitting" ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <IconSend />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  useReveal();

  return (
    <main>
      {/* 1. Hero */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-hero-eyebrow">Contact</p>
          <h1 className="contact-hero-headline">Let&apos;s talk.</h1>
          <p className="contact-hero-sub">
            Whether you&apos;re a merchant ready to activate, a creator looking
            to earn, or press wanting the story — we respond fast.
          </p>
        </div>
      </section>

      {/* 2. Route cards */}
      <section className="contact-routes">
        <div className="contact-routes-inner">
          <div className="contact-routes-grid">
            {/* Sales */}
            <article className="route-card reveal">
              <div className="route-card-icon">
                <IconSales />
              </div>
              <h2 className="route-card-title">Sales</h2>
              <p className="route-card-desc">
                Founders&apos; cohort inquiries, partnership tiers, and custom
                campaign pricing. We work directly with brands ready to launch.
              </p>
              <a className="route-card-email" href="mailto:team@push.nyc">
                team@push.nyc
              </a>
              <p className="route-card-sla">24 h reply SLA</p>
              <a className="route-card-cta" href="mailto:team@push.nyc">
                Start a conversation <IconArrow />
              </a>
            </article>

            {/* Support */}
            <article
              className="route-card reveal"
              style={{ transitionDelay: "80ms" }}
            >
              <div className="route-card-icon">
                <IconSupport />
              </div>
              <h2 className="route-card-title">Support</h2>
              <p className="route-card-desc">
                Check our help center first — most answers are there. For
                anything else, our team picks up fast.
              </p>
              <a className="route-card-email" href="mailto:support@push.nyc">
                support@push.nyc
              </a>
              <p className="route-card-sla">4 h reply SLA</p>
              <a className="route-card-cta" href="mailto:support@push.nyc">
                Get help <IconArrow />
              </a>
            </article>

            {/* Press */}
            <article
              className="route-card reveal"
              style={{ transitionDelay: "160ms" }}
            >
              <div className="route-card-icon">
                <IconPress />
              </div>
              <h2 className="route-card-title">Press</h2>
              <p className="route-card-desc">
                Covering the creator economy, local commerce, or NYC&apos;s food
                scene? We&apos;ll make it worth your time.
              </p>
              <a className="route-card-email" href="mailto:press@push.nyc">
                press@push.nyc
              </a>
              <p className="route-card-sla" style={{ visibility: "hidden" }}>
                —
              </p>
              <a
                className="route-card-cta"
                href="/press-kit.zip"
                download
                aria-label="Download press kit"
              >
                <IconDownload />
                Press kit
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Contact form */}
      <section className="contact-form-section">
        <div className="contact-form-inner">
          {/* Lead copy */}
          <div className="contact-form-lead reveal">
            <p className="contact-form-label">Send a message</p>
            <h2 className="contact-form-headline">
              Direct line.
              <br />
              No bots.
            </h2>
            <p className="contact-form-tagline">
              Every message is read by a real person. Tell us who you are and
              what you need — we&apos;ll take it from there.
            </p>
          </div>

          {/* Form */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 4. NYC office block */}
      <section className="contact-office">
        <div className="contact-office-inner">
          <div className="contact-office-info reveal">
            <p className="contact-office-eyebrow">Our home</p>
            <h2 className="contact-office-name">Push HQ — Brooklyn</h2>
            <address className="contact-office-address">
              45 Washington Street, Suite 800
              <br />
              DUMBO, Brooklyn, NY 11201
              <br />
              United States
            </address>

            <div className="contact-office-hours">
              <div className="contact-office-hours-row">
                <span className="contact-office-hours-day">Mon – Fri</span>
                <span>9:00 am – 7:00 pm ET</span>
              </div>
              <div className="contact-office-hours-row">
                <span className="contact-office-hours-day">Saturday</span>
                <span>10:00 am – 4:00 pm ET</span>
              </div>
              <div className="contact-office-hours-row">
                <span className="contact-office-hours-day">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <NYCMap />
          </div>
        </div>
      </section>

      {/* 5. Social */}
      <section className="contact-social">
        <div className="contact-social-inner">
          <span className="contact-social-label">Follow the story</span>
          <div className="contact-social-links">
            <a
              className="social-icon-link"
              href="https://instagram.com/push.nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Push on Instagram"
            >
              <IconIG />
            </a>
            <a
              className="social-icon-link"
              href="https://tiktok.com/@push.nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Push on TikTok"
            >
              <IconTikTok />
            </a>
            <a
              className="social-icon-link"
              href="https://x.com/push_nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Push on X"
            >
              <IconX />
            </a>
            <a
              className="social-icon-link"
              href="https://linkedin.com/company/push-nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Push on LinkedIn"
            >
              <IconLinkedIn />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
