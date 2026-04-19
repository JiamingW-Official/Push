"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./auth-brand-panel.css";

export type BrandPanelRhythm = "quote" | "stat-live" | "numeric-large";

interface AuthBrandPanelProps {
  rhythm?: BrandPanelRhythm;
  eyebrow?: string;
  headline: string;
  bigNumber?: string;
  bigNumberLabel?: string;
  ctaHref?: string;
  backHref?: string;
  /** Quotes for rhythm="quote". Rotated every 7s. */
  quotes?: string[];
  /** Live stat text for rhythm="stat-live". */
  liveStat?: string;
}

const DEFAULT_QUOTES = [
  "Push matched me with a café two blocks away. I earned $45 in one morning.",
  "Finally a platform that actually gets local — Williamsburg needs this.",
  "Went from zero to Explorer tier in 3 weeks. ConversionOracle is real.",
];

export function AuthBrandPanel({
  rhythm = "numeric-large",
  eyebrow,
  headline,
  bigNumber,
  bigNumberLabel,
  ctaHref,
  backHref = "/",
  quotes = DEFAULT_QUOTES,
  liveStat,
}: AuthBrandPanelProps) {
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const quoteIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (rhythm !== "quote" || !quoteRef.current) return;
    quoteRef.current.textContent = quotes[0];

    timerRef.current = setInterval(() => {
      const el = quoteRef.current;
      if (!el) return;
      el.classList.add("abp-quote--fade-out");
      setTimeout(() => {
        quoteIdx.current = (quoteIdx.current + 1) % quotes.length;
        el.textContent = quotes[quoteIdx.current];
        el.classList.remove("abp-quote--fade-out");
      }, 300);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rhythm, quotes]);

  return (
    <div className="abp-panel">
      <div className="abp-top">
        <Link href="/" className="abp-logo">
          Push
        </Link>

        {eyebrow && <span className="abp-eyebrow">{eyebrow}</span>}

        <h2 className="abp-headline">{headline}</h2>

        <span className="abp-rule" aria-hidden="true" />

        {/* Moving signal slot */}
        {rhythm === "quote" && (
          <p className="abp-quote" ref={quoteRef} aria-live="polite" />
        )}
        {rhythm === "stat-live" && liveStat && (
          <p className="abp-live-stat">{liveStat}</p>
        )}
      </div>

      {/* Editorial numeric */}
      {bigNumber && (
        <div className="abp-editorial">
          <span className="abp-big-number">{bigNumber}</span>
          {bigNumberLabel && <p className="abp-big-label">{bigNumberLabel}</p>}
        </div>
      )}

      <div className="abp-bottom">
        {ctaHref && (
          <Link href={ctaHref} className="abp-cta-link">
            Get started →
          </Link>
        )}
        <Link href={backHref} className="abp-back">
          ← Back
        </Link>
      </div>
    </div>
  );
}
