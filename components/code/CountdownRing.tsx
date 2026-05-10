"use client";
import { useEffect, useState } from "react";

interface CountdownRingProps {
  secondsLeft: number;
  windowSize?: number;
  size?: number;
  stroke?: string;
}

export function CountdownRing({
  secondsLeft: initialSeconds,
  windowSize = 15,
  size = 56,
  stroke = "#bfa170",
}: CountdownRingProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = seconds / windowSize;
  const dashoffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={3}
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
          transition: "stroke-dashoffset 0.9s linear",
        }}
      />
      {/* Seconds label */}
      <text
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize={13}
        fontFamily="var(--font-darky, sans-serif)"
        fontWeight={700}
      >
        {seconds}s
      </text>
    </svg>
  );
}
