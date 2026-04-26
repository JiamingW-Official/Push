"use client";

/* Repo target: components/creator/dashboard/HomeHeader.tsx
   Greeting + name on left, date + pulse pills on right. */

import { PulsePill } from "./PulsePill";
import {
  derivePulseData,
  formatCurrency,
  formatDateShort,
  getGreeting,
} from "@/lib/creator/widget-helpers";
import type { Application, Creator, Payout } from "./types";

export interface HomeHeaderProps {
  creator: Creator;
  applications: Application[];
  payouts: Payout[];
}

export function HomeHeader({
  creator,
  applications,
  payouts,
}: HomeHeaderProps) {
  const firstName = creator.name.split(" ")[0];
  const greeting = getGreeting();
  const date = formatDateShort();

  const pulse = derivePulseData(creator, applications, payouts);

  return (
    <header className="dh-header">
      <div className="dh-header__left">
        <p className="dh-header__greeting">{greeting} · ALL SYSTEMS LIVE</p>
        <h1 className="dh-header__title">{firstName}</h1>
      </div>

      <div className="dh-header__pulse">
        <span className="dh-header__date">{date}</span>

        {pulse.todayCount > 0 && (
          <PulsePill
            href="/creator/work/today"
            icon="⏱"
            label={`${pulse.todayCount} today`}
            tone="urgent"
          />
        )}

        {pulse.lastSettled !== null && (
          <PulsePill
            href="/creator/earnings"
            icon="✓"
            label={`${formatCurrency(pulse.lastSettled)} settled`}
            tone="success"
          />
        )}

        {pulse.streakDays > 0 && (
          <PulsePill
            href="/creator/work/today"
            icon="🔥"
            label={`${pulse.streakDays}-day streak`}
          />
        )}

        <PulsePill
          href="/creator/profile"
          icon="◉"
          label={`${pulse.tierLabel} · ${pulse.tierScore}`}
          tone="ceremony"
        />
      </div>
    </header>
  );
}
