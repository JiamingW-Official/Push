"use client";

/* ============================================================
   /contact — form + offices + alt channels. v3 (2026-05-08)
   N2W blue accent · 4 sections: hero / 2-col split (form left + 3
   channel cards right) / NYC office card / footer help.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
} from "lucide-react";
import "../_styles/mkt.css";
import "./contact.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main
      className="mkt-page mkt-page--blue contact-page"
      aria-label="Contact Push"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">Contact · we read every email</p>
        <h1 className="mkt-hero__title">Get in touch.</h1>
        <p className="mkt-hero__sub">
          Sales, support, partnerships, press — pick the right channel below or
          use the form. NYC team replies within 1 business day.
        </p>
      </header>

      {/* ── Form left + 3 channels right ─────────────────── */}
      <section className="mkt-section">
        <div className="contact-grid">
          <article className="mkt-panel contact-form-card">
            <p className="mkt-panel__eyebrow">General inquiry</p>
            <h2 className="mkt-panel__title">Send us a note.</h2>
            {submitted ? (
              <div className="contact-thanks">
                <p className="contact-thanks__title">
                  Thanks — we&apos;ll reply within 1 business day.
                </p>
                <p className="contact-thanks__sub">
                  Need something urgent? Email us directly at hello@push.nyc.
                </p>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <label className="contact-form__row">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </label>
                <label className="contact-form__row">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@email.com"
                  />
                </label>
                <label className="contact-form__row">
                  <span>I&apos;m a</span>
                  <select name="role" required defaultValue="">
                    <option value="" disabled>
                      Pick one
                    </option>
                    <option value="creator">Creator</option>
                    <option value="merchant">Merchant</option>
                    <option value="press">Press</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="contact-form__row">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="What's on your mind?"
                  />
                </label>
                <button
                  type="submit"
                  className="mkt-btn mkt-btn--primary contact-form__submit"
                >
                  <Send size={14} strokeWidth={2.25} />
                  Send message
                </button>
              </form>
            )}
          </article>

          <div className="contact-channels">
            <article className="mkt-panel mkt-panel--blue">
              <span className="contact-channel__icon">
                <MessageCircle size={20} strokeWidth={1.75} />
              </span>
              <p className="mkt-panel__eyebrow">Live chat · 9–6 EST</p>
              <h3 className="mkt-panel__title">Talk to support</h3>
              <p className="mkt-panel__body">
                Logged-in creators + merchants can chat from the app. Avg
                response: 4 minutes.
              </p>
              <Link href="/help" className="contact-channel__link">
                Open chat →
              </Link>
            </article>
            <article className="mkt-panel">
              <span className="contact-channel__icon">
                <Mail size={20} strokeWidth={1.75} />
              </span>
              <p className="mkt-panel__eyebrow">Email · 1 business day</p>
              <h3 className="mkt-panel__title">Direct email</h3>
              <p className="mkt-panel__body">
                Sales · sales@push.nyc
                <br />
                Press · press@push.nyc
                <br />
                Security · security@push.nyc
              </p>
            </article>
            <article className="mkt-panel">
              <span className="contact-channel__icon">
                <Phone size={20} strokeWidth={1.75} />
              </span>
              <p className="mkt-panel__eyebrow">Phone · enterprise only</p>
              <h3 className="mkt-panel__title">Call us</h3>
              <p className="mkt-panel__body">
                Mon–Fri 10–5 EST · for merchants on Pro tier or above.
              </p>
              <a href="tel:+12125551234" className="contact-channel__link">
                +1 (212) 555-1234 →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ── NYC office ──────────────────────────────────── */}
      <section className="mkt-section">
        <article className="mkt-panel mkt-panel--ink contact-office">
          <span className="contact-office__icon">
            <MapPin size={22} strokeWidth={1.75} />
          </span>
          <p className="mkt-panel__eyebrow">HQ · NYC</p>
          <h2 className="mkt-panel__title">261 Moore St, Suite 4</h2>
          <p className="mkt-panel__body">
            Brooklyn, NY 11206 · Visits by appointment only.
          </p>
          <a
            href="https://maps.apple.com/?address=261%20Moore%20St,%20Brooklyn,%20NY"
            target="_blank"
            rel="noreferrer"
            className="mkt-btn mkt-btn--accent"
            style={{ marginTop: 16 }}
          >
            Open in Maps <ExternalLink size={14} strokeWidth={2.25} />
          </a>
        </article>
      </section>

      {/* ── Help footer ─────────────────────────────────── */}
      <section className="mkt-section">
        <div className="mkt-panel">
          <p className="mkt-panel__eyebrow">Self-serve · faster than email</p>
          <h2 className="mkt-panel__title">Try the help center first.</h2>
          <p className="mkt-panel__body">
            300+ articles covering payouts, verification, disputes, and tier
            progression. Most questions get answered in &lt;30 seconds.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/help" className="mkt-btn mkt-btn--primary">
              Help center →
            </Link>
            <Link href="/faq" className="mkt-btn mkt-btn--ghost">
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
