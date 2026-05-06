"use client";

/* ============================================================
   /creator/settings/connections — OAuth account linking.

   P2 audit: OAuth social linking. Four platforms in pilot scope:
     - Instagram  · reach + engagement metrics shown to brands
     - TikTok     · same
     - Spotify    · niche/category enrichment
     - Threads    · cross-post reach

   Real OAuth flow needs a callback route + provider client IDs
   in env. This page is the UI scaffold — clicking "Connect"
   navigates to /api/creator/oauth/{provider} which will (when
   implemented) start the OAuth handshake.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import { StatusPill } from "@/components/shared/primitives";
import "../settings.css";
import "./connections.css";

type Provider = "instagram" | "tiktok" | "spotify" | "threads";

type Connection = {
  id: Provider;
  label: string;
  description: string;
  icon: string; // SVG path d
  /** Demo state — real version reads from creator_oauth_connections. */
  state: "linked" | "expired" | "unlinked";
  /** Last sync ISO if linked. */
  lastSyncIso?: string;
  /** Demo metric — real backend will return current follower/listen count. */
  metric?: { label: string; value: string };
};

const PROVIDERS_INITIAL: Connection[] = [
  {
    id: "instagram",
    label: "Instagram",
    description:
      "Pull reach + engagement on every story, reel, post. Shown to brands when reviewing your invite acceptance.",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    state: "linked",
    lastSyncIso: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metric: { label: "Followers", value: "14.2K" },
  },
  {
    id: "tiktok",
    label: "TikTok",
    description:
      "Reach metrics on every video. Push uses the average view count from your last 10 videos to score campaign matches.",
    icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z",
    state: "linked",
    lastSyncIso: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    metric: { label: "Followers", value: "8.7K" },
  },
  {
    id: "spotify",
    label: "Spotify",
    description:
      "Optional. Enriches your niche profile with the music genres you actually listen to — helps merchants whose brand has a sound.",
    icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12C24 5.4 18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.56.3z",
    state: "unlinked",
  },
  {
    id: "threads",
    label: "Threads",
    description:
      "Cross-post reach for brands targeting the text-first audience. Optional.",
    icon: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.74-1.756-.502-.584-1.276-.881-2.297-.89h-.032c-.69 0-1.626.183-2.222 1.068l-1.687-1.135c.802-1.184 2.106-1.835 3.91-1.835h.043c3.018.018 4.815 1.857 4.99 5.067a8.71 8.71 0 0 1 .54.288c1.247.741 2.16 1.778 2.638 3.026.696 1.823.696 4.876-1.917 7.42-2.128 2.067-4.69 2.998-7.96 3.018Zm.302-7.87c-.252 0-.508.011-.768.034-1.85.103-3.011 1.041-2.94 2.292.069 1.193 1.31 1.81 2.523 1.792 1.104-.067 2.504-.5 2.726-3.45a10.6 10.6 0 0 0-1.541-.668Z",
    state: "expired",
  },
];

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ConnectionsPage() {
  const [conns, setConns] = useState<Connection[]>(PROVIDERS_INITIAL);

  function startOAuth(id: Provider) {
    /* Real flow navigates to /api/creator/oauth/{id} which redirects
       to provider auth. Demo mode flips state locally. */
    const existing = conns.find((c) => c.id === id);
    if (existing?.state === "linked") {
      // disconnect
      if (
        !confirm(`Disconnect ${existing.label}? You'll lose enriched matching.`)
      )
        return;
      setConns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, state: "unlinked", lastSyncIso: undefined } : c,
        ),
      );
      return;
    }
    setConns((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              state: "linked",
              lastSyncIso: new Date().toISOString(),
              metric: c.metric ?? { label: "Followers", value: "1K" },
            }
          : c,
      ),
    );
  }

  const linkedCount = conns.filter((c) => c.state === "linked").length;
  const expiredCount = conns.filter((c) => c.state === "expired").length;

  return (
    <main className="conn-page" aria-label="Connected accounts">
      <Link href="/creator/settings" className="set-sub__back">
        ← Settings
      </Link>
      <h1 className="set-sub__title">Connected accounts</h1>
      <p className="set-sub__body">
        Link your social accounts so brands see real reach numbers when
        reviewing your invite acceptance. We only pull public metrics — never
        DMs, posts, or follower lists.
      </p>

      <div className="conn-pulse" aria-label="Connection status">
        <div className="conn-pulse__cell">
          <span className="conn-pulse__label">Linked</span>
          <span className="conn-pulse__value">{linkedCount}/4</span>
        </div>
        <div className="conn-pulse__cell">
          <span className="conn-pulse__label">Expired</span>
          <span className="conn-pulse__value">{expiredCount}</span>
        </div>
        <div className="conn-pulse__cell">
          <span className="conn-pulse__label">Last sync</span>
          <span className="conn-pulse__value">
            {conns.find((c) => c.lastSyncIso)
              ? relativeTime(
                  conns
                    .filter((c) => c.lastSyncIso)
                    .sort((a, b) =>
                      (b.lastSyncIso ?? "").localeCompare(a.lastSyncIso ?? ""),
                    )[0]?.lastSyncIso ?? "",
                )
              : "—"}
          </span>
        </div>
      </div>

      <ul className="conn-list" role="list">
        {conns.map((c) => (
          <li key={c.id} className={`conn-row conn-row--${c.id}`}>
            <span className="conn-row__icon" aria-hidden>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={c.icon} />
              </svg>
            </span>
            <div className="conn-row__body">
              <div className="conn-row__head">
                <span className="conn-row__label">{c.label}</span>
                {c.state === "linked" ? (
                  <StatusPill variant="green" label="Linked" dot />
                ) : c.state === "expired" ? (
                  <StatusPill variant="amber" label="Expired" dot />
                ) : (
                  <StatusPill variant="neutral" label="Not linked" />
                )}
              </div>
              <p className="conn-row__desc">{c.description}</p>
              {c.state === "linked" && c.metric && c.lastSyncIso ? (
                <div className="conn-row__metrics">
                  <span>
                    <strong>{c.metric.value}</strong>{" "}
                    {c.metric.label.toLowerCase()}
                  </span>
                  <span className="conn-row__metrics-dot" aria-hidden>
                    ·
                  </span>
                  <span>Last sync {relativeTime(c.lastSyncIso)}</span>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className={`conn-row__cta${c.state === "linked" ? " conn-row__cta--ghost" : ""}`}
              onClick={() => startOAuth(c.id)}
            >
              {c.state === "linked"
                ? "Disconnect"
                : c.state === "expired"
                  ? "Reconnect"
                  : "Connect"}
            </button>
          </li>
        ))}
      </ul>

      <p className="conn-fineprint">
        Push reads only public-profile metrics via OAuth scope-limited tokens.
        Disconnecting removes our cached data within 24h. See{" "}
        <Link href="/creator/settings/privacy">Privacy & data</Link> for the
        full DSAR controls.
      </p>
    </main>
  );
}
