"use client";

// v11 Offline page — for service-worker hand-off (future) or manual nav.
// Auto-pings navigator.onLine every 5s; flips to "back online" when it
// returns and offers a one-click reload.
//
// Atmospheric backdrop, Liquid Glass card, Magvix Italic display, inline
// SVG WiFi-off illustration. Marketing register.

import { useEffect, useState } from "react";
import Link from "next/link";
import "./offline.css";

export default function OfflinePage() {
  const [online, setOnline] = useState<boolean>(true);
  const [pings, setPings] = useState<number>(0);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setOnline(navigator.onLine);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  // Ping every 5s — driven by interval, not by online state, so the indicator
  // stays alive even when offline
  useEffect(() => {
    const id = setInterval(() => {
      setPings((p) => p + 1);
      if (typeof navigator !== "undefined") {
        setOnline(navigator.onLine);
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="off-root" id="main-content">
      <section className="off-hero" aria-labelledby="off-h1">
        {/* Ghost watermark — "OFFLINE" / "ONLINE" */}
        <span className="off-hero-ghost" aria-hidden="true">
          {online ? "ONLINE" : "OFFLINE"}
        </span>

        <div className="off-hero-inner">
          <div className="off-hero-content">
            <p className="eyebrow off-hero-eyebrow">
              <span
                className={`off-hero-pulse ${online ? "off-hero-pulse--green" : "off-hero-pulse--red"}`}
                aria-hidden="true"
              />
              <span>
                {online
                  ? "(CONNECTED · BACK ONLINE)"
                  : "(OFFLINE · NO CONNECTION)"}
              </span>
            </p>

            <h1 id="off-h1" className="off-hero-h1">
              {online ? (
                <>
                  You&apos;re
                  <br />
                  <em className="off-hero-h1-em">back online.</em>
                </>
              ) : (
                <>
                  You&apos;re
                  <br />
                  <em className="off-hero-h1-em">offline.</em>
                </>
              )}
            </h1>

            <p className="off-hero-sub">
              {online
                ? "Connection restored. Reload the page to pick up where you left off — your queued actions will sync automatically."
                : "Push needs an internet connection to verify scans, sync payouts, and load merchant data. We're checking every 5 seconds — you'll see this update the moment you're back."}
            </p>

            <div className="off-hero-cta-row">
              <button
                type="button"
                className="btn-primary click-shift"
                onClick={() => window.location.reload()}
              >
                {online ? "Reload now" : "Try anyway"}
              </button>
              <Link href="/" className="btn-ghost click-shift">
                Back to home
              </Link>
            </div>

            <p className="off-hero-status">
              <span className="off-hero-status-dot" aria-hidden="true" />
              <span>
                Auto-checking every 5s · Last check{" "}
                <strong>
                  {pings === 0 ? "just now" : `${pings * 5}s ago`}
                </strong>
              </span>
            </p>
          </div>

          {/* Right — WiFi-off SVG illustration */}
          <aside
            className="off-hero-illustration lg-surface"
            aria-label={online ? "Connection icon" : "Offline icon"}
          >
            <svg
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
            >
              {/* WiFi arcs */}
              <g
                stroke={online ? "var(--accent-blue)" : "var(--ink-4)"}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              >
                <path
                  d="M 60 130 Q 120 80 180 130"
                  opacity={online ? "1" : "0.3"}
                />
                <path
                  d="M 80 150 Q 120 115 160 150"
                  opacity={online ? "1" : "0.5"}
                />
                <path
                  d="M 100 170 Q 120 155 140 170"
                  opacity={online ? "1" : "0.7"}
                />
              </g>
              {/* Center dot */}
              <circle
                cx="120"
                cy="190"
                r="9"
                fill={online ? "var(--accent-blue)" : "var(--ink-3)"}
              />

              {/* Strikethrough — only when offline */}
              {!online && (
                <line
                  x1="50"
                  y1="50"
                  x2="190"
                  y2="200"
                  stroke="var(--brand-red)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <p className="eyebrow off-hero-illustration-label">
              {online ? "(CONNECTED)" : "(NO SIGNAL)"}
            </p>
          </aside>
        </div>
      </section>

      {/* SIGNATURE DIVIDER */}
      <div className="off-sig-wrap" aria-hidden="true">
        <span className="off-sig-divider">
          {online
            ? "Reconnected · Syncing · Verified ·"
            : "Disconnected · Waiting · Retrying ·"}
        </span>
      </div>

      {/* PANEL 2 — What you can do offline */}
      <section className="off-actions" aria-labelledby="off-actions-h2">
        <div className="off-actions-inner">
          <p className="eyebrow off-actions-eyebrow">(WHAT WORKS OFFLINE)</p>
          <h2 id="off-actions-h2" className="off-actions-h2">
            Three things you can still do.
          </h2>

          <div className="off-action-grid">
            <div className="off-action-card off-action-card--butter">
              <span className="eyebrow off-action-card-eyebrow">(CACHED)</span>
              <h3 className="off-action-card-title">Read cached pages</h3>
              <p className="off-action-card-desc">
                Pages you viewed recently are still readable — your browser kept
                a copy. Live data may be stale until reconnect.
              </p>
            </div>

            <div className="off-action-card off-action-card--sky">
              <span className="eyebrow off-action-card-eyebrow">(QUEUED)</span>
              <h3 className="off-action-card-title">Queue scan actions</h3>
              <p className="off-action-card-desc">
                If you're a merchant mid-redemption, the QR scan will queue
                locally and post the moment you're back online.
              </p>
            </div>

            <div className="off-action-card off-action-card--peach">
              <span className="eyebrow off-action-card-eyebrow">(DRAFT)</span>
              <h3 className="off-action-card-title">Draft offline</h3>
              <p className="off-action-card-desc">
                Compose a campaign brief in a notes app — paste it back into
                Push when the connection returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="off-footer">
        <p className="off-footer-line">
          <span>Push · Pay per verified visit</span>
          <span aria-hidden="true">·</span>
          <span>
            Need help offline?{" "}
            <a href="mailto:hello@pushnyc.co" className="off-footer-link">
              hello@pushnyc.co
            </a>
          </span>
        </p>
      </footer>
    </main>
  );
}
