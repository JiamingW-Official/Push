"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { enterDemoMode, type DemoAudience } from "@/lib/demo";
import { DEMO_AUDIENCES } from "@/lib/nav/registry";
import "./demo.css";

// Image paths exist in /public/images.
const ROLE_IMAGES: Partial<Record<DemoAudience, string>> = {
  creator: "/images/creator-hero.jpg",
  merchant: "/images/merchant-proof.jpg",
};

// Marketing-tone copy for the gate (overrides registry blurb here only —
// registry stays the source for everything else in the app).
const GATE_COPY: Record<
  DemoAudience,
  { tag: string; title: string; blurb: string; cta: string }
> = {
  creator: {
    tag: "Creator",
    title: "I'm a creator",
    blurb:
      "Apply to local campaigns, post the work, watch verified scans land in your wallet.",
    cta: "Explore as creator",
  },
  merchant: {
    tag: "Merchant",
    title: "I'm a merchant",
    blurb:
      "Launch a campaign, print QR stickers, see real foot traffic flow into the ground-truth layer.",
    cta: "Explore as merchant",
  },
  admin: {
    tag: "Admin (ops)",
    title: "Trust & Safety ops",
    blurb:
      "Moderation queues, oracle decisions, privacy requests — every Push internal surface.",
    cta: "Open admin demo",
  },
  consumer: {
    tag: "Consumer",
    title: "Customer scan flow",
    blurb:
      "Scan a sample QR, walk the consent picker, see the FTC disclosure and data-rights flow.",
    cta: "Try a sample scan",
  },
};

export default function DemoRolePicker() {
  const audiences = DEMO_AUDIENCES;
  const primary = useMemo(
    () =>
      audiences.filter((a) => a.role === "creator" || a.role === "merchant"),
    [audiences],
  );
  const secondary = useMemo(
    () => audiences.filter((a) => a.role === "admin" || a.role === "consumer"),
    [audiences],
  );

  function selectRole(role: DemoAudience, dest: string) {
    enterDemoMode(role, dest);
  }

  // Keyboard shortcuts: 1 → creator, 2 → merchant, 3 → admin, 4 → consumer.
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't capture when typing into an input/textarea.
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const map: Record<string, DemoAudience> = {
        "1": "creator",
        "2": "merchant",
        "3": "admin",
        "4": "consumer",
      };
      const role = map[e.key];
      if (!role) return;
      const opt = audiences.find((a) => a.role === role);
      if (!opt) return;
      e.preventDefault();
      selectRole(opt.role, opt.dest);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [audiences]);

  return (
    <div className="demo-page">
      {/* Top chrome — minimal, mono parenthetical eyebrow on the right */}
      <header className="demo-chrome" role="banner">
        <span className="demo-chrome-mark" aria-label="Push">
          PUSH
        </span>
        <span className="demo-chrome-tag">
          (DEMO MODE · PLAYTEST · NO SIGN-UP)
        </span>
      </header>

      <main className="demo-shell" id="main">
        {/* ── Hero: Magvix display + parenthetical eyebrow ── */}
        <section className="demo-hero" aria-labelledby="demo-hero-title">
          <p className="demo-eyebrow">(WELCOME)</p>
          <h1 className="demo-hero-title" id="demo-hero-title">
            Walk the <em>real</em> Push.
            <br />
            Pick a seat.
          </h1>
          <p className="demo-hero-lede">
            Every portal renders its real flow with simulated data. Switch roles
            or exit anytime from the banner up top — no email, no password, no
            footprints.
          </p>

          <div className="demo-hero-actions">
            <button
              type="button"
              className="demo-btn demo-btn--primary"
              onClick={() => {
                const opt = audiences.find((a) => a.role === "creator");
                if (opt) selectRole(opt.role, opt.dest);
              }}
            >
              Explore as creator <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="demo-btn demo-btn--ghost"
              onClick={() => {
                const opt = audiences.find((a) => a.role === "merchant");
                if (opt) selectRole(opt.role, opt.dest);
              }}
            >
              Or as merchant
            </button>
            <span className="demo-hero-hint" aria-hidden="true">
              Press <kbd className="demo-kbd">1</kbd> creator
              <kbd className="demo-kbd">2</kbd> merchant
            </span>
          </div>
        </section>

        {/* Magvix Italic Signature Divider */}
        <p className="demo-divider" aria-hidden="true">
          Story · Scan · Pay ·
        </p>

        {/* ── Primary role tiles (Photo Card overlay) ── */}
        <section aria-labelledby="demo-roles-title" className="demo-roles-wrap">
          <h2 className="sr-only" id="demo-roles-title">
            (CHOOSE YOUR ROLE)
          </h2>
          <p className="demo-eyebrow" aria-hidden="true">
            (CHOOSE YOUR ROLE)
          </p>

          <div
            className="demo-roles"
            role="group"
            aria-labelledby="demo-roles-title"
          >
            {primary.map((opt, idx) => {
              const copy = GATE_COPY[opt.role];
              const img = ROLE_IMAGES[opt.role];
              const isCeremonial = opt.role === "creator";
              return (
                <button
                  key={opt.role}
                  type="button"
                  className={
                    "demo-role" + (isCeremonial ? " demo-role--ceremonial" : "")
                  }
                  onClick={() => selectRole(opt.role, opt.dest)}
                  aria-label={`${copy.title}. ${copy.blurb}. Press ${idx + 1}.`}
                >
                  {img ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="demo-role-img"
                      src={img}
                      alt=""
                      aria-hidden="true"
                      loading="eager"
                    />
                  ) : null}
                  <span className="demo-role-keycap" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <span className="demo-role-tag">
                    {copy.tag.toUpperCase()}
                  </span>
                  <span className="demo-role-overlay">
                    <span className="demo-role-title">{copy.title}</span>
                    <span className="demo-role-blurb">{copy.blurb}</span>
                    <span className="demo-role-meta">
                      <span className="demo-role-cta">{copy.cta}</span>
                      <span className="demo-role-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary role rail — Admin / Consumer */}
          <div
            className="demo-second-row"
            role="group"
            aria-label="More demo seats"
          >
            {secondary.map((opt, i) => {
              const copy = GATE_COPY[opt.role];
              const idx = primary.length + i + 1;
              return (
                <button
                  key={opt.role}
                  type="button"
                  className="demo-second"
                  onClick={() => selectRole(opt.role, opt.dest)}
                  aria-label={`${copy.title}. ${copy.blurb}. Press ${idx}.`}
                >
                  <span className="demo-second-eyebrow">
                    ({copy.tag.toUpperCase()}) ·{" "}
                    <span aria-hidden="true">PRESS {idx}</span>
                  </span>
                  <span className="demo-second-label">{copy.title}</span>
                  <span className="demo-second-blurb">{copy.blurb}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Social proof rail (sober, mono) */}
        <section className="demo-proof" aria-label="What the demo simulates">
          <div className="demo-proof-cell">
            <span className="demo-proof-num">4</span>
            <span className="demo-proof-label">(Portals)</span>
          </div>
          <div className="demo-proof-cell">
            <span className="demo-proof-num">100%</span>
            <span className="demo-proof-label">
              (Local · Simulated · No real merchants)
            </span>
          </div>
          <div className="demo-proof-cell">
            <span className="demo-proof-num">2h</span>
            <span className="demo-proof-label">(Cookie TTL · Auto-clears)</span>
          </div>
        </section>

        {/* Ticket Panel — single editorial moment, GA Orange, marketing only */}
        <section className="demo-ticket" aria-labelledby="demo-ticket-title">
          <span
            className="demo-ticket-grommet demo-ticket-grommet--tl"
            aria-hidden="true"
          />
          <span
            className="demo-ticket-grommet demo-ticket-grommet--tr"
            aria-hidden="true"
          />
          <span
            className="demo-ticket-grommet demo-ticket-grommet--bl"
            aria-hidden="true"
          />
          <span
            className="demo-ticket-grommet demo-ticket-grommet--br"
            aria-hidden="true"
          />
          <p className="demo-ticket-eyebrow">(READY FOR THE REAL THING?)</p>
          <h3 className="demo-ticket-headline" id="demo-ticket-title">
            Skip the demo · Go straight to the live product
          </h3>
          <p className="demo-ticket-sub">
            Real campaigns, real merchants, real verified scans — sign up at the
            audience page that fits.
          </p>
          <div className="demo-ticket-actions">
            <Link href="/for-creators" className="demo-btn demo-btn--ink">
              For creators →
            </Link>
            <Link href="/for-merchants" className="demo-btn demo-btn--ink">
              For merchants →
            </Link>
          </div>
        </section>

        {/* Footnote — TOS / Privacy / data note */}
        <footer className="demo-foot" role="contentinfo">
          <span>
            Demo data is local + simulated. Switching roles or exiting clears
            the demo cookie.
          </span>
          <span className="demo-foot-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/">Push home</Link>
          </span>
        </footer>
      </main>

      {/* Visually-hidden helper class for sr-only labels */}
      <style jsx>{`
        :global(.sr-only) {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
