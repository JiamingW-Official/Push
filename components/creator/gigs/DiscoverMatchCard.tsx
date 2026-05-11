"use client";

/* ============================================================
   <DiscoverMatchCard> — Stage 0 (Discover) card.

   Compact match preview shown on Work funnel hub. Displays:
     - Brand initial avatar
     - Brand name + category
     - Match score (e.g. 98% MATCH) — green when >=90
     - Compact reason line (top match reason)
     - Apply CTA + View brief link

   Used in: /creator/work funnel section ① (top 3 recommendations)
   Detail surface: /creator/discover/[id] or /creator/discover/[id]/apply
   ============================================================ */

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface DiscoverMatch {
  id: string;
  brand: string;
  brandInitial: string;
  category: string;
  matchScore: number;
  topReason: string;
  /** Optional payout headline for this campaign (e.g. "$40-85") */
  payoutRange?: string;
  /** Distance hint (e.g. "0.7mi") */
  distance?: string;
}

interface Props {
  match: DiscoverMatch;
}

export function DiscoverMatchCard({ match }: Props) {
  const high = match.matchScore >= 90;
  return (
    <Link
      href={`/creator/discover/${match.id}`}
      className={`disc-card${high ? " disc-card--high" : ""}`}
    >
      <span className="disc-card__avatar">{match.brandInitial}</span>
      <div className="disc-card__body">
        <div className="disc-card__line1">
          <span className="disc-card__brand">{match.brand}</span>
          <span
            className={`disc-card__match${high ? " disc-card__match--high" : ""}`}
          >
            <span className="disc-card__match-num">{match.matchScore}</span>
            <span className="disc-card__match-pct">% match</span>
          </span>
        </div>
        <p className="disc-card__reason">{match.topReason}</p>
        <div className="disc-card__meta">
          <span className="disc-card__cat">{match.category}</span>
          {match.distance && (
            <>
              <span className="disc-card__sep" aria-hidden>
                ·
              </span>
              <span className="disc-card__dist">
                <MapPin size={11} strokeWidth={2.25} />
                {match.distance}
              </span>
            </>
          )}
          {match.payoutRange && (
            <>
              <span className="disc-card__sep" aria-hidden>
                ·
              </span>
              <span className="disc-card__payout">{match.payoutRange}</span>
            </>
          )}
        </div>
      </div>
      <span className="disc-card__cta" aria-hidden>
        Apply
        <ArrowUpRight size={13} strokeWidth={2.5} />
      </span>
    </Link>
  );
}
