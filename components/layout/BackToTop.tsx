"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 600);
      setProgress(docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // SVG progress ring — 44px button, 2px stroke
  const size = 44;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2; // 21
  const circumference = 2 * Math.PI * radius; // ~131.9
  const dashOffset = circumference * (1 - progress);

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top"
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "var(--ink)",
        border: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 9990,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 300ms ease, transform 300ms ease",
        padding: 0,
      }}
    >
      {/* Progress ring overlay */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: "absolute", top: 0, left: 0, rotate: "-90deg" }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-red)"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>

      {/* Arrow icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path
          d="M7 12V2M2 7l5-5 5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
