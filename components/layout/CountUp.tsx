"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** Numeric target value to count up to */
  target: number;
  /** Animation duration in ms */
  duration?: number;
  /** Suffix appended after the number, e.g. "+", "%", "K+" */
  suffix?: string;
  /** Prefix prepended before the number, e.g. "$" */
  prefix?: string;
  /** Decimal places to display (default 0; comma formatting is skipped when decimals > 0) */
  decimals?: number;
}

/** easeOutQuart: decelerates towards the end for a natural feel */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/** Format a number with comma separators, no decimals */
function formatWithCommas(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export default function CountUp({
  target,
  duration = 1800,
  suffix = "",
  prefix = "",
  decimals = 0,
}: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const format = (n: number): string =>
      decimals > 0 ? n.toFixed(decimals) : formatWithCommas(n);

    // Set initial display value
    el.textContent = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : "0"}${suffix}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          observer.disconnect();

          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = target * easeOutQuart(progress);

            el.textContent = `${prefix}${format(current)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              // Ensure exact final value
              el.textContent = `${prefix}${format(target)}${suffix}`;
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix, prefix, decimals]);

  return (
    <span ref={spanRef}>
      {prefix}
      {decimals > 0 ? (0).toFixed(decimals) : "0"}
      {suffix}
    </span>
  );
}
