"use client";

/* Repo target: components/creator/dashboard/widgets/NewMatches.tsx
   3×3 tall — 3 recommended campaigns. */

import Link from "next/link";
import {
  catColor,
  formatCurrencyExact,
  TIER_COLORS,
} from "@/lib/creator/widget-helpers";
import type { Campaign, CreatorTier } from "../types";

export interface NewMatchesProps {
  recommended: Campaign[];
  creatorTier: CreatorTier;
  className?: string;
}

export function NewMatches({
  recommended,
  creatorTier,
  className = "",
}: NewMatchesProps) {
  return (
    <div className={`dh-card ${className}`.trim()}>
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">
          NEW MATCHES · {recommended.length}
        </span>
        <Link href="/creator/discover" className="dh-card__view-all">
          BROWSE →
        </Link>
      </div>

      <div className="dh-match-list">
        {recommended.slice(0, 3).map((c) => {
          const cat = catColor(c.category) ?? TIER_COLORS[creatorTier];
          const used = c.spots_total - c.spots_remaining;
          const fillPct =
            c.spots_total > 0 ? Math.round((used / c.spots_total) * 100) : 0;

          return (
            <Link
              key={c.id}
              href="/creator/discover"
              className="dh-match-item"
              style={{ ["--cat" as string]: cat }}
            >
              <div className="dh-match-item__top">
                <span className="dh-match-item__name">{c.business_name}</span>
                <span className="dh-match-item__pay">
                  {formatCurrencyExact(c.payout)}
                </span>
              </div>
              <div className="dh-match-item__bottom">
                <div className="dh-match-item__bar">
                  <div
                    className="dh-match-item__fill"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <span className="dh-match-item__meta">
                  {c.spots_remaining} LEFT
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
