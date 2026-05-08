"use client";

/* ============================================================
   /creator/comms — COMMS hub. v2 (2026-05-08, Work-template parity)
   Brand-red accent · 6 panels w/ TimeChart bottom row.
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import {
  Inbox,
  Bell,
  MessageCircle,
  Mail,
  CheckCircle2,
  Eye,
  TrendingUp,
} from "lucide-react";
import TimeChart from "@/components/shared/charts/TimeChart";
import "@/components/shared/hub-shell.css";
import "./comms.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

export default function CommsHub() {
  const stats = {
    unread: 4,
    threadsToday: 7,
    avgReply: "2h 14m",
    notifications: 12,
  };

  return (
    <main className="comms-hub" aria-label="Comms">
      <header className="comms-hero">
        <div className="comms-hero__left">
          <h1 className="comms-hero__title">Inbox</h1>
          <p className="comms-hero__sub">
            {stats.unread} unread · {stats.threadsToday} new today · avg reply{" "}
            {stats.avgReply}
          </p>
        </div>
      </header>

      <section className="comms-bento" aria-label="Comms modules">
        <BentoModule
          href="/creator/inbox"
          eyebrow="Unread · waiting"
          icon={<Inbox {...ICON_PROPS} />}
          span={4}
          tone="red"
          live="urgent"
        >
          <p className="comms-kpi__num">{stats.unread}</p>
          <p className="comms-kpi__lbl">UNREAD MESSAGES</p>
          <p className="comms-kpi__meta">2 from merchants · 2 system</p>
        </BentoModule>

        <BentoModule
          href="/creator/inbox/messages"
          eyebrow="Needs you · 3 actions"
          icon={<MessageCircle {...ICON_PROPS} />}
          span={5}
          live="urgent"
        >
          <ul className="comms-queue" aria-label="Message action queue">
            <li className="comms-queue__row comms-queue__row--reply">
              <span className="comms-queue__tile" aria-hidden>
                <Mail size={14} strokeWidth={2.25} />
              </span>
              <span className="comms-queue__copy">
                <span className="comms-queue__verb">Reply</span>
                <span className="comms-queue__target">
                  Roberta&apos;s · contract Q
                </span>
              </span>
              <span className="comms-queue__when">2h</span>
            </li>
            <li className="comms-queue__row comms-queue__row--review">
              <span className="comms-queue__tile" aria-hidden>
                <Eye size={14} strokeWidth={2.25} />
              </span>
              <span className="comms-queue__copy">
                <span className="comms-queue__verb">Review</span>
                <span className="comms-queue__target">
                  Devoción · brand brief
                </span>
              </span>
              <span className="comms-queue__when">5h</span>
            </li>
            <li className="comms-queue__row comms-queue__row--ack">
              <span className="comms-queue__tile" aria-hidden>
                <CheckCircle2 size={14} strokeWidth={2.25} />
              </span>
              <span className="comms-queue__copy">
                <span className="comms-queue__verb">Ack</span>
                <span className="comms-queue__target">
                  Brow Theory · accepted
                </span>
              </span>
              <span className="comms-queue__when">1d</span>
            </li>
          </ul>
        </BentoModule>

        <BentoModule
          href="/creator/notifications"
          eyebrow="System · 12 new"
          icon={<Bell {...ICON_PROPS} />}
          span={3}
        >
          <KpiBlock
            eyebrow="ALERTS"
            value={String(stats.notifications)}
            tone="ink"
          />
          <span className="comms-row-status">
            <StatusPill variant="amber" label="3 require action" dot />
          </span>
        </BentoModule>

        <BentoModule
          href="/creator/inbox/system"
          eyebrow="Threads · last 7d"
          icon={<MessageCircle {...ICON_PROPS} />}
          span={5}
        >
          <ul className="comms-list">
            <li className="comms-list__row">
              <span className="comms-list__name">
                Roberta&apos;s · contract
              </span>
              <span className="comms-list__meta">2h ago · 3 msgs</span>
            </li>
            <li className="comms-list__row">
              <span className="comms-list__name">Devoción · brief</span>
              <span className="comms-list__meta">5h ago · 1 msg</span>
            </li>
            <li className="comms-list__row">
              <span className="comms-list__name">Brow Theory · invite</span>
              <span className="comms-list__meta">1d ago · 6 msgs</span>
            </li>
          </ul>
        </BentoModule>

        <BentoModule
          href="/creator/analytics/fans"
          eyebrow="Avg reply · 7d"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={4}
        >
          <KpiBlock eyebrow="RESPONSE" value={stats.avgReply} tone="ink" />
          <span className="comms-row-status">
            <StatusPill variant="green" label="↓ 18% vs prior" dot />
          </span>
        </BentoModule>

        <BentoModule
          href="/creator/analytics"
          eyebrow="Message volume · trend"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={12}
        >
          <TimeChart
            mode="bar"
            accent="red"
            valueSuffix=" msgs"
            defaultPeriod="30d"
            data={{
              "7d": [3, 5, 4, 7, 6, 8, 4],
              "30d": Array.from({ length: 30 }, (_, i) =>
                Math.max(2, Math.round(5 + Math.sin(i * 0.6) * 3 + i * 0.1)),
              ),
              "90d": Array.from({ length: 12 }, (_, i) =>
                Math.max(8, Math.round(20 + Math.sin(i * 0.4) * 8 + i)),
              ),
              all: Array.from({ length: 12 }, (_, i) =>
                Math.max(15, Math.round(30 + Math.cos(i * 0.5) * 10 + i * 2)),
              ),
            }}
            labels={{
              "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "30d": Array.from({ length: 30 }, (_, i) =>
                i % 5 === 0 ? `D${i + 1}` : "",
              ),
              "90d": [
                "Wk1",
                "Wk2",
                "Wk3",
                "Wk4",
                "Wk5",
                "Wk6",
                "Wk7",
                "Wk8",
                "Wk9",
                "Wk10",
                "Wk11",
                "Wk12",
              ],
              all: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            }}
            ariaLabel="Message volume over time"
          />
        </BentoModule>
      </section>
    </main>
  );
}
