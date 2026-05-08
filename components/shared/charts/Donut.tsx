"use client";

/* ============================================================
   <Donut> — minimal SVG donut chart for income/category splits.
   No external library. ≤120 lines.

   Usage:
     <Donut
       segments={[
         { label: "Base pay", value: 60, color: "#14130f" },
         { label: "Commission", value: 12, color: "#0085ff" },
         { label: "Bonus",     value: 15, color: "#bfa170" },
       ]}
       total={87}
       valuePrefix="$"
     />
   ============================================================ */

import { useState } from "react";
import "./Donut.css";

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: DonutSegment[];
  total?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  size?: number;
  thickness?: number;
  ariaLabel?: string;
};

export default function Donut({
  segments,
  total,
  valuePrefix = "",
  valueSuffix = "",
  size = 140,
  thickness = 18,
  ariaLabel = "Distribution chart",
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const showTotal = total ?? sum;

  const r = size / 2 - thickness / 2;
  const C = 2 * Math.PI * r;

  // Compute cumulative offsets for stroke-dasharray.
  let cumulative = 0;
  const arcs = segments.map((s, i) => {
    const fraction = s.value / sum;
    const length = fraction * C;
    const offset = -cumulative;
    cumulative += length;
    return { ...s, idx: i, length, offset, fraction };
  });

  return (
    <div className="donut">
      <svg
        className="donut__svg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {arcs.map((a) => (
            <circle
              key={a.idx}
              className="donut__arc"
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={hover === a.idx ? thickness + 2 : thickness}
              strokeDasharray={`${a.length} ${C - a.length}`}
              strokeDashoffset={a.offset}
              strokeLinecap="butt"
              opacity={hover === null || hover === a.idx ? 1 : 0.45}
              onMouseEnter={() => setHover(a.idx)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </g>
      </svg>
      <div className="donut__center">
        <p className="donut__total">
          {valuePrefix}
          {(hover !== null ? segments[hover].value : showTotal).toLocaleString(
            "en-US",
          )}
          {valueSuffix}
        </p>
        <p className="donut__lbl">
          {hover !== null ? segments[hover].label : "Total"}
        </p>
      </div>
      <ul className="donut__legend">
        {segments.map((s, i) => (
          <li
            key={s.label}
            className="donut__legend-row"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="donut__legend-sw"
              style={{ background: s.color }}
            />
            <span className="donut__legend-name">{s.label}</span>
            <span className="donut__legend-val">
              {valuePrefix}
              {s.value.toLocaleString("en-US")}
              {valueSuffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
