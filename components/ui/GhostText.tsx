/** Editorial ghost text: bold lead + faded continuation, auto-detects dark parent. */
"use client";

import React, { useRef, useState, useEffect } from "react";

interface GhostTextProps {
  bold: React.ReactNode;
  ghost: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

function isDarkSection(el: HTMLElement | null): boolean {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      // Parse rgb values and check luminance
      const m = bg.match(/\d+/g);
      if (m && m.length >= 3) {
        const r = parseInt(m[0]);
        const g = parseInt(m[1]);
        const b = parseInt(m[2]);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum < 0.45;
      }
    }
    node = node.parentElement;
  }
  return false;
}

export function GhostText({
  bold,
  ghost,
  as: Tag = "span",
  style,
}: GhostTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setDark(isDarkSection(ref.current));
    }
  }, []);

  const ghostOpacity = dark ? 0.16 : 0.12;

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} style={{ display: "inline", ...style }}>
      <strong style={{ fontWeight: "inherit" }}>{bold}</strong>
      <span style={{ opacity: ghostOpacity }}>{ghost}</span>
    </Tag>
  );
}
