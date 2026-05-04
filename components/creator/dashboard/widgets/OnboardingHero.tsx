"use client";

/* Repo target: components/creator/dashboard/widgets/OnboardingHero.tsx
   Replaces TodaysWork when activeApps.length === 0.
   "Apply to your first campaign — here are 3 we picked for you" */

import Link from "next/link";
import {
  catColor,
  formatCurrencyExact,
  TIER_COLORS,
} from "@/lib/creator/widget-helpers";
import type { Campaign, CreatorTier } from "../types";

export interface OnboardingHeroProps {
  picks: Campaign[];
  creatorTier: CreatorTier;
  className?: string;
}

const STEPS = [
  { n: 1, label: "Apply", active: true },
  { n: 2, label: "Visit + post", active: false },
  { n: 3, label: "Verify", active: false },
  { n: 4, label: "Get paid", active: false },
];

export function OnboardingHero({
  picks,
  creatorTier,
  className = "",
}: OnboardingHeroProps) {
  return (
    <div className={`dh-onboard ${className}`.trim()}>
      <div className="dh-onboard__eyebrow">YOUR FIRST CAMPAIGN</div>

      <h2 className="dh-onboard__title">
        Pick one. Post in your style. Get paid.
      </h2>

      <p className="dh-onboard__sub">
        We picked 3 campaigns near you that match your tier and audience. Start
        with one — finish it, get paid in 5–7 days, then pick more.
      </p>

      <div className="dh-onboard__steps">
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ display: "contents" }}>
            <div
              className={
                "dh-onboard__step" +
                (s.active ? " dh-onboard__step--active" : "")
              }
            >
              <span className="dh-onboard__step-num">{s.n}</span>
              <span>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="dh-onboard__step-line" />}
          </div>
        ))}
      </div>

      <div className="dh-onboard__picks">
        {picks.slice(0, 3).map((c) => {
          const cat = catColor(c.category) ?? TIER_COLORS[creatorTier];
          return (
            <Link
              key={c.id}
              href="/creator/discover"
              className="dh-onboard__pick"
              style={{ ["--cat" as string]: cat }}
            >
              <div>
                <div className="dh-onboard__pick-name">{c.business_name}</div>
                <div className="dh-onboard__pick-merchant">
                  {c.business_address ?? c.title}
                </div>
              </div>
              <div className="dh-onboard__pick-bottom">
                <span className="dh-onboard__pick-pay">
                  {formatCurrencyExact(c.payout)}
                </span>
                <span className="dh-onboard__pick-cta">APPLY →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
