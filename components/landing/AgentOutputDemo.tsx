"use client";

/* ============================================================
   AgentOutputDemo — v5.1 Hero right column
   Simulates one agent run: merchant goal input → 60s match
   Pure CSS stagger animation for the terminal card.
   Optional: showVideoCTA renders a "Watch the 90s
   ConversionOracle demo" CTA + modal beneath the terminal.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";

const MATCHES = [
  {
    handle: "@maya.eats.nyc",
    tier: "Steel",
    tierColor: "#4a5568",
    score: 94,
    est: "6 customers",
  },
  {
    handle: "@brooklyn_bites",
    tier: "Gold",
    tierColor: "#c9a96e",
    score: 91,
    est: "5 customers",
  },
  {
    handle: "@williamsburg.e",
    tier: "Steel",
    tierColor: "#4a5568",
    score: 89,
    est: "4 customers",
  },
  {
    handle: "@coffee.crawl",
    tier: "Bronze",
    tierColor: "#8c6239",
    score: 86,
    est: "4 customers",
  },
  {
    handle: "@sip.and.scroll",
    tier: "Bronze",
    tierColor: "#8c6239",
    score: 83,
    est: "3 customers",
  },
];

type Props = {
  /**
   * When true, renders a "Watch the 90s ConversionOracle demo"
   * play-triangle CTA beneath the terminal card. Clicking opens
   * a 16:9 iframe modal pointing at NEXT_PUBLIC_DEMO_VIDEO_URL.
   * Defaults to false for backward compatibility.
   */
  showVideoCTA?: boolean;
};

export default function AgentOutputDemo({ showVideoCTA = false }: Props) {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL;

  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  // Close modal on Escape
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen, closeVideo]);

  return (
    <div className="agent-demo-wrap">
      <div className="agent-demo agent-demo--shimmer" aria-hidden="true">
        <div className="agent-demo-bar">
          <span className="agent-demo-dot" />
          <span className="agent-demo-title">push-agent</span>
          <span className="agent-demo-meta">claude-sonnet-4-6</span>
        </div>

        <div className="agent-demo-body">
          <div className="agent-demo-row agent-demo-row--prompt">
            <span className="agent-demo-caret">&gt;</span>
            <span className="agent-demo-text">
              20 customers · coffee · Williamsburg · $400 / 1wk
            </span>
          </div>

          <div className="agent-demo-row agent-demo-row--status">
            <span className="agent-demo-bar-track">
              <span className="agent-demo-bar-fill" />
            </span>
            <span className="agent-demo-status-text">
              matching creators&hellip;
            </span>
          </div>

          <div className="agent-demo-output">
            <div className="agent-demo-out-label">Top 5 matches · 47s</div>
            <ul className="agent-demo-list">
              {MATCHES.map((m, i) => (
                <li
                  key={m.handle}
                  className="agent-demo-item"
                  style={{ animationDelay: `${1.6 + i * 0.35}s` }}
                >
                  <span
                    className="agent-demo-tier-dot"
                    style={{ background: m.tierColor }}
                    aria-hidden="true"
                  />
                  <span className="agent-demo-handle">{m.handle}</span>
                  <span className="agent-demo-tier">{m.tier}</span>
                  <span className="agent-demo-score">{m.score}</span>
                  <span className="agent-demo-est">{m.est}</span>
                </li>
              ))}
            </ul>
            <div className="agent-demo-footer">
              <span className="agent-demo-footer-label">Est. deliverable</span>
              <span className="agent-demo-footer-val">
                22 verified · 91% conf
              </span>
            </div>
          </div>
        </div>
      </div>

      {showVideoCTA ? (
        <button
          type="button"
          className="agent-demo-video-cta"
          onClick={openVideo}
          aria-haspopup="dialog"
          aria-expanded={videoOpen}
        >
          <span className="agent-demo-video-play" aria-hidden="true" />
          <span className="agent-demo-video-copy">
            <span className="agent-demo-video-eyebrow">
              Vertical AI for Local Commerce
            </span>
            <span className="agent-demo-video-label">
              Watch the 90s ConversionOracle demo
            </span>
          </span>
        </button>
      ) : null}

      {videoOpen ? (
        <div
          className="agent-demo-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="ConversionOracle demo video"
          onClick={closeVideo}
        >
          <div
            className="agent-demo-video-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="agent-demo-video-close"
              onClick={closeVideo}
              aria-label="Close video"
            >
              &times;
            </button>
            {videoUrl ? (
              <div className="agent-demo-video-frame">
                <iframe
                  src={videoUrl}
                  title="ConversionOracle demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="agent-demo-video-fallback">
                <div className="agent-demo-video-fallback-eyebrow">
                  Vertical AI for Local Commerce
                </div>
                <div className="agent-demo-video-fallback-title">
                  Video coming soon
                </div>
                <p className="agent-demo-video-fallback-body">
                  The 90-second ConversionOracle walkthrough is in final cut.
                  See the full breakdown of the Day-1 verification loop on the
                  ConversionOracle page.
                </p>
                <a
                  href="/conversion-oracle"
                  className="agent-demo-video-fallback-link"
                >
                  Read the ConversionOracle page &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
