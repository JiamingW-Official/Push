"use client";

import { useState, useEffect } from "react";
import "./contact.css";

/* ── v5.1 spec topic options ────────────────────────────────── */
type Topic =
  | "pilot"
  | "partnership"
  | "press"
  | "creator"
  | "careers"
  | "other";

type FormState = "idle" | "submitting" | "success" | "error";

const TOPICS: { value: Topic; label: string; email: string }[] = [
  { value: "pilot", label: "Pilot", email: "merchants@pushnyc.com" },
  { value: "partnership", label: "Partnership", email: "ops@pushnyc.com" },
  { value: "press", label: "Press", email: "press@pushnyc.com" },
  { value: "creator", label: "Creator", email: "creators@pushnyc.com" },
  { value: "careers", label: "Careers", email: "careers@pushnyc.com" },
  { value: "other", label: "Other", email: "ops@pushnyc.com" },
];

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

/* ── Toast notification ─────────────────────────────────────── */
function Toast({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        maxWidth: 320,
        background: "var(--surface)",
        borderLeft: "4px solid #10b981",
        borderRight: "1px solid var(--line)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "var(--space-4) var(--space-5)",
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        zIndex: 9999,
        borderRadius: 0,
        boxShadow: "0 12px 32px rgba(0,48,73,0.12)",
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--dark)",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Message sent.
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--graphite)",
            margin: 0,
          }}
        >
          We respond within 24 hours.
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--graphite)",
          padding: 4,
          borderRadius: 0,
        }}
      >
        &times;
      </button>
    </div>
  );
}

/* ── Contact form (UI-only) ─────────────────────────────────── */
function ContactForm({
  onSuccess,
  initialTopic,
}: {
  onSuccess: () => void;
  initialTopic: Topic;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    // UI-only: simulate a 1s send, then show success toast
    await new Promise((r) => setTimeout(r, 1000));
    setState("success");
    onSuccess();
    // Reset the form after success
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setState("idle"), 500);
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
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
            disabled={state === "submitting"}
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
            disabled={state === "submitting"}
          />
        </div>
      </div>

      {/* Topic select */}
      <div className="contact-field">
        <label htmlFor="cf-topic">Topic</label>
        <select
          id="cf-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          disabled={state === "submitting"}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            background: "var(--surface-elevated)",
            border: "1px solid var(--line)",
            borderRadius: 0,
            color: "var(--dark)",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              "linear-gradient(45deg, transparent 50%, var(--graphite) 50%), linear-gradient(135deg, var(--graphite) 50%, transparent 50%)",
            backgroundPosition: "calc(100% - 20px) 50%, calc(100% - 14px) 50%",
            backgroundSize: "6px 6px",
            backgroundRepeat: "no-repeat",
            paddingRight: 40,
          }}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="contact-field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          placeholder="Tell us what you need. Specific beats vague."
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={state === "submitting"}
        />
      </div>

      <button
        type="submit"
        className="contact-submit-btn"
        disabled={state === "submitting"}
        aria-busy={state === "submitting"}
      >
        {state === "submitting" ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Sending&hellip;
          </>
        ) : (
          <>Send message</>
        )}
      </button>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  useReveal();
  const [toastVisible, setToastVisible] = useState(false);
  const [initialTopic, setInitialTopic] = useState<Topic>("pilot");

  // Pre-select the topic if ?topic=... is in the URL (e.g. from a careers CTA)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic")?.toLowerCase();
    if (!t) return;
    const match = TOPICS.find(
      (x) => x.value === t || x.label.toLowerCase() === t,
    );
    if (match) setInitialTopic(match.value);
  }, []);

  return (
    <main>
      {/* 1. Hero */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-hero-eyebrow">Contact</p>
          <h1 className="contact-hero-headline">Get in touch.</h1>
          <p className="contact-hero-sub">
            Pilot, partnership, press, creator, careers, or something else
            entirely &mdash; pick a topic and say what you need. We read every
            message and reply within one business day.
          </p>
        </div>
      </section>

      {/* 2. Two-column form + direct contact */}
      <section className="contact-form-section">
        <div
          className="contact-form-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "var(--space-10)",
            alignItems: "start",
          }}
        >
          {/* Left: Contact form */}
          <div className="reveal">
            <p className="contact-form-label">Send a message</p>
            <h2 className="contact-form-headline">
              Direct line.
              <br />
              No bots.
            </h2>
            <p
              className="contact-form-tagline"
              style={{ marginBottom: "var(--space-6)" }}
            >
              Every message is read by a real person. Tell us who you are and
              what you need &mdash; we&apos;ll take it from there.
            </p>
            <ContactForm
              initialTopic={initialTopic}
              onSuccess={() => setToastVisible(true)}
            />
          </div>

          {/* Right: Direct emails + office */}
          <aside
            className="reveal"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
              transitionDelay: "100ms",
            }}
          >
            {/* Direct emails */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--tertiary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Direct inboxes
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  border: "1px solid var(--line)",
                  background: "var(--surface-elevated)",
                }}
              >
                {[
                  {
                    label: "Ops & partnerships",
                    email: "ops@pushnyc.com",
                  },
                  {
                    label: "Press",
                    email: "press@pushnyc.com",
                  },
                  {
                    label: "Careers",
                    email: "careers@pushnyc.com",
                  },
                  {
                    label: "Creators",
                    email: "creators@pushnyc.com",
                  },
                  {
                    label: "Merchants",
                    email: "merchants@pushnyc.com",
                  },
                ].map((row, idx, arr) => (
                  <li
                    key={row.email}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "var(--space-4)",
                      padding: "var(--space-3) var(--space-4)",
                      borderBottom:
                        idx < arr.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--graphite)",
                      }}
                    >
                      {row.label}
                    </span>
                    <a
                      href={`mailto:${row.email}`}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--dark)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      {row.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Creator relations lead callout (Lucy) */}
            <div
              style={{
                border: "1px solid var(--line)",
                borderLeft: "4px solid var(--champagne)",
                padding: "var(--space-5)",
                background: "var(--surface-elevated)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--champagne)",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Creator relations lead
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "var(--dark)",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Lucy
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "var(--graphite)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                First call for every Push creator. T1&ndash;T6 tier progression,
                Two-Segment Creator Economics onboarding, NYC creator summit
                coordination.
              </p>
              <a
                href="mailto:creators@pushnyc.com"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  textDecoration: "none",
                }}
              >
                creators@pushnyc.com &rarr;
              </a>
            </div>

            {/* Office + hours */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--tertiary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                NYC office
              </p>
              <address
                style={{
                  fontStyle: "normal",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--dark)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Push HQ
                <br />
                87 N 6th Street, Suite 302
                <br />
                Williamsburg, Brooklyn, NY 11211
              </address>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--graphite)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: 700 }}>Mon &ndash; Fri</span>
                  <span>9:00am &ndash; 7:00pm ET</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: 700 }}>Saturday</span>
                  <span>By appointment</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: 700 }}>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 3. FAQ snippet */}
      <section
        className="contact-faq"
        style={{
          padding: "var(--space-12) 0",
          background: "var(--surface-bright)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div
          className="contact-form-inner"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 var(--space-6)",
          }}
        >
          <p
            className="reveal"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--tertiary)",
              marginBottom: "var(--space-3)",
            }}
          >
            FAQ
          </p>
          <h2
            className="reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--dark)",
              margin: 0,
              marginBottom: "var(--space-8)",
            }}
          >
            Answers first.
          </h2>

          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "var(--space-5)",
            }}
          >
            {[
              {
                q: "Who qualifies for a Williamsburg Coffee+ Pilot?",
                a: "Independent coffee merchants in the Williamsburg zip codes (11211 / 11249) with AOV $8\u201320 and POS + QR menu capability. Pilot cost is $0 per merchant up to the neighborhood cap ($4,200). First ten merchants fill the 60-day beachhead cohort.",
              },
              {
                q: "How fast do you respond?",
                a: "Within one business day across every inbox. Merchants and creators in the active Williamsburg cohort get a same-day SLA from ops@pushnyc.com. Press inquiries routed to the founder within four hours.",
              },
              {
                q: "What partnerships do you take?",
                a: "POS and reservation-tech integrations (Square, Toast, Resy, OpenTable), SMB neighborhood associations, and creator management collectives in the NYC footprint. Pitch at ops@pushnyc.com with a one-line hypothesis and we'll schedule inside 48 hours.",
              },
            ].map((row, idx) => (
              <li
                key={row.q}
                className="reveal"
                style={{
                  transitionDelay: `${idx * 80}ms`,
                  borderTop: "1px solid var(--line)",
                  paddingTop: "var(--space-5)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "var(--dark)",
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {row.q}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--graphite)",
                    margin: 0,
                  }}
                >
                  {row.a}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Toast visible={toastVisible} onDismiss={() => setToastVisible(false)} />
    </main>
  );
}
