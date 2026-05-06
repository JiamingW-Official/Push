"use client";

/**
 * /creator/settings — the canonical Settings hub (audit § P1-7).
 *
 * Renders 9 cells that route to focused sub-pages. Each cell is a
 * pressable card with eyebrow icon, title, 2-line description, and
 * (optionally) an alert hint when something needs attention (e.g.
 * "KYC pending" on Verification, "1 open" on Disputes).
 *
 * Layout: ★★ Hero (Magvix Italic "Settings") · ☆ Pulse Strip
 * (verification status / next payout / disputes / connections) ·
 * 3×3 grid of cells.
 */

import Link from "next/link";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useToday } from "@/lib/data/hooks";
import "./settings.css";

type Cell = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  alert?: string;
  icon: string; // single SVG path d-string for visual variety
};

const CELLS: Cell[] = [
  {
    href: "/creator/settings/account",
    eyebrow: "01",
    title: "Account",
    body: "Name, handle, email, password, language, time zone.",
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0",
  },
  {
    href: "/creator/settings/payments",
    eyebrow: "02",
    title: "Payments & tax",
    body: "Stripe Connect, Venmo, 1099-K download, payout schedule.",
    icon: "M3 9h18M3 15h18M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  },
  {
    href: "/creator/settings/verification",
    eyebrow: "03",
    title: "Verification",
    body: "ID upload, address, FTC disclosure, age verification.",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
  {
    href: "/creator/settings/preferences",
    eyebrow: "04",
    title: "Niches & geography",
    body: "Categories, neighborhoods, mile radius, availability windows.",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  {
    href: "/creator/settings/notifications",
    eyebrow: "05",
    title: "Notifications",
    body: "Email digest, push, imminent reminders, payout alerts.",
    icon: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M14 21a2 2 0 0 1-4 0",
  },
  {
    href: "/creator/settings/privacy",
    eyebrow: "06",
    title: "Privacy & data",
    body: "Profile visibility, DSAR export, delete account.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    href: "/creator/settings/disputes",
    eyebrow: "07",
    title: "Disputes",
    body: "Open + resolved cases. Submit appeal evidence.",
    icon: "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  },
  {
    href: "/creator/settings/connections",
    eyebrow: "08",
    title: "Connected accounts",
    body: "Instagram, TikTok, Spotify — link via OAuth.",
    icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  },
  {
    href: "/creator/settings/help",
    eyebrow: "09",
    title: "Help & support",
    body: "Knowledge base, contact, system status, changelog.",
    icon: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  },
];

export default function SettingsHub() {
  const ws = useWorkspaceState();
  const { data: today } = useToday();

  /* Pulse stats. KYC + payout date + open disputes + connection count.
     Some derive from useToday + ws; others are placeholders until the
     respective settings sub-routes wire their own data sources. */
  const openInvites =
    today?.invites?.filter((i) => i.status === "pending").length ?? 0;
  void openInvites; // referenced for future "Pending invites" stat

  const enriched: Cell[] = CELLS.map((c) => {
    if (c.title === "Verification") {
      return { ...c, alert: ws ? "KYC ready" : "Action needed" };
    }
    if (c.title === "Disputes") {
      // Placeholder — wire to /api/creator/disputes count when migrated.
      return c;
    }
    return c;
  });

  return (
    <main className="set-hub" aria-label="Settings">
      <header className="set-hero">
        <p className="set-hero__eyebrow">SETTINGS · 9 SECTIONS</p>
        <h1 className="set-hero__title">Settings</h1>
        <p className="set-hero__sub">
          Everything that controls how you appear, get paid, and stay in the
          loop. Nine focused areas — not one giant scroll.
        </p>
      </header>

      <div className="set-pulse" role="group" aria-label="Settings pulse">
        <span className="set-pulse__cell">
          <span className="set-pulse__label">Verification</span>
          <span className="set-pulse__value">Verified</span>
        </span>
        <span className="set-pulse__cell">
          <span className="set-pulse__label">Next payout</span>
          <span className="set-pulse__value">May 1</span>
        </span>
        <span className="set-pulse__cell">
          <span className="set-pulse__label">Open disputes</span>
          <span className="set-pulse__value">0</span>
        </span>
        <span className="set-pulse__cell">
          <span className="set-pulse__label">Connections</span>
          <span className="set-pulse__value">2 of 3</span>
        </span>
      </div>

      <div className="set-grid">
        {enriched.map((c) => (
          <Link key={c.href} href={c.href} className="set-cell">
            <span className="set-cell__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path
                  d={c.icon}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="set-cell__eyebrow">{c.eyebrow}</span>
            <h2 className="set-cell__title">{c.title}</h2>
            <p className="set-cell__body">{c.body}</p>
            {c.alert ? (
              <span className="set-cell__alert">{c.alert}</span>
            ) : null}
            <span className="set-cell__arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>

      <p className="set-legacy-note">
        Looking for the old all-in-one page?{" "}
        <Link href="/creator/settings/legacy">Open the legacy view</Link> — we
        kept it around while migration finishes.
      </p>
    </main>
  );
}
