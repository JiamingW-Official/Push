"use client";

/* ============================================================
   /creator/comms — COMMS domain hub. Audit § 5.5 bento spec.

   Collapses 3 fragmented surfaces into one anchor:
     - /inbox/messages  → COMMS: Messages module
     - /notifications   → COMMS: System module
     - /disputes        → COMMS: Disputes module
     - (new)            → COMMS: Daily digest module

   Bento (audit § 5.5):
     [─── MESSAGES two-pane (12) ─────────────────────]
     [─ SYSTEM (4) ─] [─ DISPUTES (4) ─] [─ DIGEST (4) ─]

   Notifications drawer in the topnav still owns the realtime
   surface — this hub provides the deep-archive entry points.
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import "@/components/shared/hub-shell.css";
import "./comms.css";

export default function CommsHub() {
  return (
    <main className="comms-hub" aria-label="Communications">
      <header className="comms-hero">
        <p className="comms-hero__eyebrow">
          COMMS · CONVERSATIONS, ALERTS, ESCALATIONS
        </p>
        <h1 className="comms-hero__title">Comms</h1>
        <p className="comms-hero__sub">
          Where everything anyone says to you converges. Brand chats up top (95%
          of your reading time) — system alerts, dispute filings, and the daily
          digest below.
        </p>
      </header>

      <section className="comms-bento" aria-label="Comms modules">
        {/* ── MESSAGES (span 12) ── */}
        <BentoModule
          href="/creator/inbox/messages"
          eyebrow="MESSAGES · BRAND THREADS"
          span={12}
          live="live"
          sub="Realtime · 3 unread · last reply 12m ago"
        >
          <div className="comms-msg-row">
            <KpiBlock eyebrow="THREADS" value="14" tone="ink" compact />
            <KpiBlock eyebrow="UNREAD" value="3" tone="red" compact />
            <KpiBlock eyebrow="RESPONSE TIME" value="14m" tone="ink" compact />
            <span className="comms-msg-status">
              <StatusPill variant="green" label="Online" dot />
            </span>
          </div>
        </BentoModule>

        {/* ── SYSTEM (span 4) ── */}
        <BentoModule
          href="/creator/inbox/system"
          eyebrow="SYSTEM · PUSH UPDATES"
          span={4}
          live="off"
          sub="Last 24h · 2 alerts"
        >
          <div className="comms-list">
            <span className="comms-list-row">
              <StatusPill variant="blue" label="Tier change" dot />
              <span className="comms-list-row__time">2h</span>
            </span>
            <span className="comms-list-row">
              <StatusPill variant="amber" label="Payout cleared" dot />
              <span className="comms-list-row__time">9h</span>
            </span>
          </div>
        </BentoModule>

        {/* ── DISPUTES (span 4) ── */}
        <BentoModule
          href="/creator/disputes"
          eyebrow="DISPUTES · ESCALATIONS"
          span={4}
          live="off"
          sub="0 open · 2 resolved this quarter"
        >
          <div className="comms-list">
            <span className="comms-list-row">
              <StatusPill variant="green" label="No open cases" dot />
            </span>
            <span className="comms-list-row__sub">
              Avg resolution · 3.2 days
            </span>
          </div>
        </BentoModule>

        {/* ── DIGEST (span 4) ── */}
        <BentoModule
          href="/creator/settings/notifications"
          eyebrow="DIGEST · DAILY EMAIL · 8AM ET"
          span={4}
          live="off"
          sub="Yesterday's bundle delivered · settings to tweak frequency"
        >
          <div className="comms-list">
            <span className="comms-list-row">
              <StatusPill variant="ink" label="Daily" />
              <span className="comms-list-row__time">on</span>
            </span>
            <span className="comms-list-row">
              <StatusPill variant="neutral" label="Weekly recap" />
              <span className="comms-list-row__time">off</span>
            </span>
          </div>
        </BentoModule>
      </section>
    </main>
  );
}
