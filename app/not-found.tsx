import Link from "next/link";
import type { Metadata } from "next";
import "./not-found.css";

export const metadata: Metadata = {
  title: "404 · Push",
  description:
    "This page moved, closed, or never existed. Find what you need below.",
  robots: { index: false, follow: false },
};

/* ─── Route suggestions ─────────────────────────────────────── */
const ROUTES: {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  variant: "butter" | "sky" | "peach";
}[] = [
  {
    href: "/",
    eyebrow: "(START HERE)",
    title: "Go Home",
    desc: "Back to the Push homepage. The walk-in economy starts here.",
    cta: "Go home →",
    variant: "butter",
  },
  {
    href: "/for-creators",
    eyebrow: "(CREATORS)",
    title: "For Creators",
    desc: "Get paid per verified walk-in. No follower minimum required.",
    cta: "Explore →",
    variant: "sky",
  },
  {
    href: "/for-merchants",
    eyebrow: "(MERCHANTS)",
    title: "For Merchants",
    desc: "Launch a QR attribution campaign in under 10 minutes.",
    cta: "Explore →",
    variant: "peach",
  },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function NotFound() {
  return (
    <main className="nf-page">
      {/* Ghost "404" — Darky 900 var(--ink) opacity 0.06 */}
      <span className="nf-ghost" aria-hidden="true">
        404
      </span>

      <div className="nf-content">
        {/* Eyebrow */}
        <span className="eyebrow nf-eyebrow">(WRONG BLOCK)</span>

        {/* Magvix italic — centered (spec allows centering on special pages) */}
        <h1 className="nf-title">Lost in the city.</h1>

        <p className="nf-sub">
          This page moved, closed, or never existed. Try the map below.
        </p>

        {/* 3 route cards with distinct candy panel fills */}
        <div className="nf-cards" role="navigation" aria-label="Helpful links">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`nf-card nf-card--${route.variant}`}
              aria-label={`${route.title}: ${route.desc}`}
            >
              <span className="nf-card-eyebrow">{route.eyebrow}</span>
              <h2 className="nf-card-title">{route.title}</h2>
              <p className="nf-card-desc">{route.desc}</p>
              <span className="btn-ghost nf-card-cta">{route.cta}</span>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <Link href="/" className="btn-ghost nf-back">
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
