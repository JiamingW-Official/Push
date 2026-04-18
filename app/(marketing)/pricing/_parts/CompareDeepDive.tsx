"use client";

import { useState } from "react";

/**
 * Plan comparison deep-dive — collapsible per-plan accordion.
 * Each panel details: Verification · Creator tier · Retention Add-on · SLA · Support.
 * border-radius: 0 on all surfaces.
 */

type PlanRow = {
  id: string;
  plan: string;
  headline: string;
  color: "red" | "champagne" | "blue";
  details: { label: string; value: string }[];
};

const PLAN_ROWS: PlanRow[] = [
  {
    id: "pilot",
    plan: "Pilot",
    headline: "$0 — first 10 AI-verified customers on us",
    color: "blue",
    details: [
      {
        label: "Verification layers",
        value:
          "QR + Claude Vision receipt OCR + geo-match within 200m (full 3-layer from day 1).",
      },
      {
        label: "Creator tier access",
        value:
          "Operator (T3) creators and higher. T1 Seed and T2 Explorer reserved for paid plans.",
      },
      {
        label: "Retention Add-on",
        value:
          "Not available. Pilot is single-visit acquisition only — first 10 customers then auto-flip.",
      },
      {
        label: "Dispute SLA",
        value:
          "72h response window. Shared founder+ops queue during Williamsburg Coffee+ beachhead.",
      },
      {
        label: "Dedicated support",
        value:
          "Shared Slack channel with founder. No dedicated analyst. Per-neighborhood cap $4,200 total subsidy.",
      },
    ],
  },
  {
    id: "operator",
    plan: "Operator",
    headline: "$500/mo min + $15–85 per AI-verified customer by vertical",
    color: "red",
    details: [
      {
        label: "Verification layers",
        value:
          "Full 3-layer — QR + Claude Vision + geo-match. ConversionOracle™ scoring live on every run.",
      },
      {
        label: "Creator tier access",
        value:
          "T2 Explorer through T6 Equity. Priority access to Proven+ creators in your neighborhood.",
      },
      {
        label: "Retention Add-on",
        value:
          "Opt-in. Coffee tier $8/$6/$4. Fitness+Beauty tier $24/$18/$12. Billed monthly in arrears.",
      },
      {
        label: "Dispute SLA",
        value:
          "24h response. Ops-agent routes disputes; DisclosureBot logs every decision for audit.",
      },
      {
        label: "Dedicated support",
        value:
          "Named ops contact. Monthly ConversionOracle tuning review. Exportable run logs.",
      },
    ],
  },
  {
    id: "neighborhood",
    plan: "Neighborhood",
    headline:
      "$8–12K launch + $20–35K MRR target · multi-location unit economics",
    color: "champagne",
    details: [
      {
        label: "Verification layers",
        value:
          "Full 3-layer plus neighborhood-level ConversionOracle™ calibration on walk-in ground truth.",
      },
      {
        label: "Creator tier access",
        value:
          "Top-100 Closer (T5) and Equity (T6) reserved slots. Creator Productivity Lock active.",
      },
      {
        label: "Retention Add-on",
        value:
          "Included. Full tier access per merchant vertical. Neighborhood-wide loyalty graph.",
      },
      {
        label: "Dispute SLA",
        value:
          "24h SLA with named ops analyst. Monthly unit-economics review with Neighborhood Playbook.",
      },
      {
        label: "Dedicated support",
        value:
          "Dedicated ops analyst, custom ConversionOracle™ model tuning, audit-grade DisclosureBot logs.",
      },
    ],
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`pr-dd-chev${open ? " pr-dd-chev--open" : ""}`}
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function CompareDeepDive() {
  const [openId, setOpenId] = useState<string | null>("operator");

  return (
    <div className="pr-dd-wrap">
      {PLAN_ROWS.map((row) => {
        const isOpen = openId === row.id;
        return (
          <div
            key={row.id}
            className={`pr-dd-item pr-dd-item--${row.color}${
              isOpen ? " pr-dd-item--open" : ""
            }`}
          >
            <button
              type="button"
              className="pr-dd-header"
              aria-expanded={isOpen}
              aria-controls={`pr-dd-body-${row.id}`}
              onClick={() => setOpenId(isOpen ? null : row.id)}
            >
              <span className="pr-dd-marker" aria-hidden="true" />
              <span className="pr-dd-plan">{row.plan}</span>
              <span className="pr-dd-headline">{row.headline}</span>
              <Chevron open={isOpen} />
            </button>

            <div
              id={`pr-dd-body-${row.id}`}
              className="pr-dd-body"
              role="region"
              aria-hidden={!isOpen}
              hidden={!isOpen}
            >
              <dl className="pr-dd-list">
                {row.details.map((d) => (
                  <div key={d.label} className="pr-dd-line">
                    <dt className="pr-dd-term">{d.label}</dt>
                    <dd className="pr-dd-def">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
