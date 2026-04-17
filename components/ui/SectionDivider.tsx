/** Full-bleed 1px Flag Red divider with optional section label and scaleX scroll animation. */
"use client";

import React, { useEffect, useRef } from "react";

interface SectionDividerProps {
  label?: string;
  animate?: boolean;
}

export function SectionDivider({ label, animate = true }: SectionDividerProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !lineRef.current) return;

    const el = lineRef.current;
    el.style.transformOrigin = "left center";
    el.style.transform = "scaleX(0)";
    el.style.transition = "none";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              el.style.transition =
                "transform 600ms cubic-bezier(0.32, 0.72, 0, 1)";
              el.style.transform = "scaleX(1)";
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div style={{ position: "relative", marginBlock: "var(--space-2)" }}>
      <div
        ref={lineRef}
        style={{
          height: 1,
          background: "var(--primary)",
          width: "100%",
        }}
      />
      {label && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            background: "var(--surface)",
            paddingRight: 12,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-eyebrow)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary)",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
