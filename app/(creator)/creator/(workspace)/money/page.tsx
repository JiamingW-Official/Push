"use client";

/* ============================================================
   /creator/money — MONEY hub. v2 (2026-05-08, Work-template parity)

   N2W-blue accented hub: BIG balance solid panel + champagne accent
   for milestones + 4 white glass panels for pending/methods/history/tax.

   Layout (12-col, 2 rows minmax):
     Row 1: BALANCE 5 (blue solid) | MILESTONES 4 (champ) | PENDING 3
     Row 2: METHODS 4 | HISTORY 5 | TAX 3
   ============================================================ */

import { useEarnings } from "@/lib/data/hooks";
import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import TimeChart from "@/components/shared/charts/TimeChart";
import Donut from "@/components/shared/charts/Donut";
import {
  Wallet,
  Sparkles,
  Hourglass,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
} from "lucide-react";
import "@/components/shared/hub-shell.css";
import "./money.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export default function MoneyHub() {
  const { data: earnings } = useEarnings();

  const summary = earnings?.summary ?? {
    thisMonthEarned: 412,
    lastMonthEarned: 348,
    delta: 18.4,
    pendingNext: 87,
  };
  const balances = earnings?.balances ?? {
    pending: 87,
    cleared: 240,
    processing: 0,
    paidOut: 1840,
    total: 2167,
  };
  const milestones = earnings?.activeMilestones ?? [];
  const lifetime = balances.paidOut + balances.cleared + balances.processing;

  // Adapt ActiveMilestone (campaignId/milestones[]) to the legacy shape this
  // tile renders against. Keeps render code stable; fix when the milestone
  // panel is rebuilt with the modular GigCard system.
  const topMilestoneRaw = milestones[0];
  const topMilestone = topMilestoneRaw
    ? {
        name: topMilestoneRaw.campaign,
        progress: topMilestoneRaw.milestones.filter((m) => m.done).length,
        threshold: topMilestoneRaw.milestones.length,
        bonusAmount: topMilestoneRaw.totalPayout,
      }
    : {
        name: "Weekly bonus",
        progress: 42,
        threshold: 50,
        bonusAmount: 25,
      };
  const weeklyHistory = [42, 56, 48, 72, 65, 88, 96, 78, 102, 115, 98, 124];
  const historyMax = Math.max(...weeklyHistory);
  const pct = Math.min(
    100,
    Math.round(
      (topMilestone.progress / Math.max(topMilestone.threshold, 1)) * 100,
    ),
  );

  return (
    <main className="money-hub" aria-label="Money">
      <header className="money-hero">
        <div className="money-hero__left">
          <h1 className="money-hero__title">Money</h1>
          <p className="money-hero__sub">
            ${fmtMoney(summary.thisMonthEarned)} this month · $
            {fmtMoney(lifetime)} lifetime · refreshed just now
          </p>
        </div>
      </header>

      <section className="money-bento" aria-label="Money modules">
        {/* ── Row 1 ── */}

        {/* BALANCE — N2W blue solid hero */}
        <BentoModule
          href="/creator/money/earnings"
          eyebrow="Balance · this month"
          icon={<Wallet {...ICON_PROPS} />}
          span={5}
          tone="blue"
        >
          <div className="money-balance">
            <p className="money-balance__num">
              ${fmtMoney(summary.thisMonthEarned)}
            </p>
            <p className="money-balance__delta">
              {summary.delta >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(summary.delta).toFixed(1)}% vs prior 30d
            </p>
            <div className="money-balance__split">
              <div className="money-balance__split-row">
                <span className="money-balance__split-lbl">Cleared</span>
                <span className="money-balance__split-val">
                  ${fmtMoney(balances.cleared)}
                </span>
              </div>
              <div className="money-balance__split-row">
                <span className="money-balance__split-lbl">Pending</span>
                <span className="money-balance__split-val">
                  ${fmtMoney(balances.pending)}
                </span>
              </div>
              <div className="money-balance__split-row">
                <span className="money-balance__split-lbl">Processing</span>
                <span className="money-balance__split-val">
                  ${fmtMoney(balances.processing)}
                </span>
              </div>
            </div>
          </div>
        </BentoModule>

        {/* MILESTONES — champagne accent */}
        <BentoModule
          href="/creator/money/milestones"
          eyebrow="Milestone · in progress"
          icon={<Sparkles {...ICON_PROPS} />}
          span={4}
          tone="champagne"
        >
          <h2 className="money-milestone__title">{topMilestone.name}</h2>
          <p className="money-milestone__count">
            {topMilestone.progress} <span>/ {topMilestone.threshold}</span>
          </p>
          <div className="money-milestone__track">
            <div
              className="money-milestone__fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="money-milestone__meta">
            {topMilestone.threshold - topMilestone.progress} to go · +$
            {topMilestone.bonusAmount} unlock
          </p>
        </BentoModule>

        {/* PENDING — next payout w/ income split donut */}
        <BentoModule
          href="/creator/money/pending"
          eyebrow="Pending · split"
          icon={<Hourglass {...ICON_PROPS} />}
          span={3}
        >
          <Donut
            ariaLabel="Pending payout breakdown"
            valuePrefix="$"
            total={balances.pending}
            segments={[
              { label: "Base", value: 60, color: "#14130f" },
              { label: "Comm.", value: 12, color: "#0085ff" },
              { label: "Bonus", value: 15, color: "#bfa170" },
            ]}
          />
          <span className="money-row-status">
            <StatusPill variant="amber" label="Arrives Mon May 13" dot />
          </span>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* METHODS — payout method */}
        <BentoModule
          href="/creator/money/methods"
          eyebrow="Methods · 2 cards"
          icon={<CreditCard {...ICON_PROPS} />}
          span={4}
        >
          <ul className="money-list">
            <li className="money-list__row">
              <span className="money-list__name">Visa · 4242</span>
              <span className="money-list__tag money-list__tag--default">
                Default
              </span>
            </li>
            <li className="money-list__row">
              <span className="money-list__name">Bank · Chase ★1234</span>
              <span className="money-list__tag">Backup</span>
            </li>
          </ul>
        </BentoModule>

        {/* HISTORY — interactive TimeChart with 7D/30D/90D/ALL switcher.
            Replaces the legacy static bar chart with a live area chart
            that responds to user period selection + tooltip on hover. */}
        <BentoModule
          href="/creator/money/history"
          eyebrow="Earnings · trend"
          icon={<Receipt {...ICON_PROPS} />}
          span={5}
        >
          <TimeChart
            accent="blue"
            valuePrefix="$"
            defaultPeriod="30d"
            data={{
              /* 7D sums to $87 — matches the "this week" pulse + bonus example.
                 Daily realistic earnings for an Operator-tier creator. */
              "7d": [12, 0, 18, 0, 25, 14, 18],
              /* 30D sums to ~$412 — matches summary.thisMonthEarned. Mix of
                 zero-days (no shoots), low-days ($8-15) and high-days ($22-32). */
              "30d": [
                14, 0, 18, 22, 0, 12, 8, 24, 16, 0, 14, 28, 18, 12, 0, 22, 14,
                18, 0, 16, 24, 12, 0, 18, 22, 16, 8, 14, 18, 5,
              ],
              /* 90D sums to ~$1,240 — quarterly. Avg ~$13/day, weekly cycle. */
              "90d": Array.from({ length: 90 }, (_, i) => {
                const dayOfWeek = i % 7;
                if (dayOfWeek === 1 || dayOfWeek === 4) return 0; // off days
                return Math.max(0, Math.round(14 + Math.sin(i * 0.4) * 8));
              }),
              /* ALL · 52 weeks weekly totals. Sum ~$2,080 lifetime. */
              all: Array.from({ length: 52 }, (_, i) =>
                Math.max(20, Math.round(40 + Math.sin(i * 0.3) * 12)),
              ),
            }}
            labels={{
              "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "30d": Array.from({ length: 30 }, (_, i) => `D${i + 1}`),
              "90d": Array.from({ length: 90 }, (_, i) =>
                i % 30 === 0 ? `M${i / 30 + 1}` : "",
              ),
              all: Array.from({ length: 52 }, (_, i) =>
                i % 13 === 0 ? `Q${Math.floor(i / 13) + 1}` : "",
              ),
            }}
            ariaLabel="Earnings over time"
          />
        </BentoModule>

        {/* TAX */}
        <BentoModule
          href="/creator/money/tax"
          eyebrow="Tax · YTD"
          icon={<FileText {...ICON_PROPS} />}
          span={3}
        >
          <KpiBlock
            eyebrow="EARNED"
            value={`$${fmtMoney(lifetime)}`}
            tone="ink"
          />
          <span className="money-row-status">
            <StatusPill variant="green" label="W-9 on file" dot />
          </span>
        </BentoModule>
      </section>
    </main>
  );
}
