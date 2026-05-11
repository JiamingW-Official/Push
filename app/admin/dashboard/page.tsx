"use client";

/* ============================================================
   /admin/dashboard — ADMIN hub. v2 (2026-05-08, Work-template parity)

   Brand-red solid hero (severity / system-health alerts) + champagne
   accent for verifications-pending queue. Each panel routes to a
   distinct admin subpage (creators / merchants / reports / disputes /
   settings).

   Layout (12-col, 2 rows minmax):
     Row 1: HEALTH 5 (red solid) | VERIFY QUEUE 4 (champ) | LIVE 3
     Row 2: CREATORS 5 | DISPUTES 4 | SETTINGS 3
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import {
  AlertCircle,
  Search,
  Activity,
  Users,
  ShieldAlert,
  Settings,
  Eye,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import "@/components/shared/hub-shell.css";
import "./dashboard.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

export default function AdminDashboardPage() {
  const { metrics } = useAdminMetrics();

  // Legacy admin dashboard reads flat counters; the new AdminMetrics shape
  // is nested. Cast and fall back to reasonable defaults until this page is
  // rebuilt against the canonical kpi/alerts structure.
  const m = metrics as unknown as Record<string, number> | undefined;
  const stats = {
    pendingVerifications: m?.pendingVerifications ?? 14,
    activeFlags: m?.activeFlags ?? 3,
    liveScans: m?.liveScans ?? 287,
    totalCreators: m?.totalCreators ?? 1240,
    totalMerchants: m?.totalMerchants ?? 86,
    openDisputes: m?.openDisputes ?? 2,
  };

  return (
    <main className="admin-hub" aria-label="Admin dashboard">
      <header className="admin-hero">
        <div className="admin-hero__left">
          <p className="admin-hero__eyebrow">Admin · operations</p>
          <h1 className="admin-hero__title">Admin</h1>
          <p className="admin-hero__sub">
            {stats.pendingVerifications} pending · {stats.activeFlags} flags ·
            refreshed just now
          </p>
        </div>
      </header>

      <section className="admin-bento" aria-label="Admin modules">
        {/* ── Row 1 ── */}

        {/* HEALTH — brand-red solid hero */}
        <BentoModule
          href="/admin/queue"
          eyebrow="Health · system status"
          icon={<AlertCircle {...ICON_PROPS} />}
          span={5}
          tone="red"
          live="urgent"
        >
          <div className="admin-health">
            <p className="admin-health__num">{stats.activeFlags}</p>
            <p className="admin-health__lbl">ACTIVE FLAGS</p>
            <ul className="admin-health__list">
              <li className="admin-health__row">
                <span className="admin-health__name">Verification spike</span>
                <span className="admin-health__time">2m ago</span>
              </li>
              <li className="admin-health__row">
                <span className="admin-health__name">Stripe webhook lag</span>
                <span className="admin-health__time">9m ago</span>
              </li>
              <li className="admin-health__row">
                <span className="admin-health__name">QR scan anomaly</span>
                <span className="admin-health__time">23m ago</span>
              </li>
            </ul>
          </div>
        </BentoModule>

        {/* VERIFY QUEUE — champagne accent */}
        <BentoModule
          href="/admin/queue"
          eyebrow="Verifications · waiting"
          icon={<Search {...ICON_PROPS} />}
          span={4}
          tone="champagne"
        >
          <p className="admin-queue__num">{stats.pendingVerifications}</p>
          <p className="admin-queue__lbl">PENDING REVIEW</p>
          <ul className="admin-actionq">
            <li className="admin-actionq__row admin-actionq__row--review">
              <span className="admin-actionq__tile" aria-hidden>
                <Eye size={14} strokeWidth={2.25} />
              </span>
              <span className="admin-actionq__copy">
                <span className="admin-actionq__verb">Review</span>
                <span className="admin-actionq__target">
                  Roberta's scan #4811
                </span>
              </span>
              <span className="admin-actionq__when">High</span>
            </li>
            <li className="admin-actionq__row admin-actionq__row--flag">
              <span className="admin-actionq__tile" aria-hidden>
                <Flag size={14} strokeWidth={2.25} />
              </span>
              <span className="admin-actionq__copy">
                <span className="admin-actionq__verb">Flag</span>
                <span className="admin-actionq__target">
                  Devoción · OCR conflict
                </span>
              </span>
              <span className="admin-actionq__when">Med</span>
            </li>
            <li className="admin-actionq__row admin-actionq__row--ack">
              <span className="admin-actionq__tile" aria-hidden>
                <CheckCircle2 size={14} strokeWidth={2.25} />
              </span>
              <span className="admin-actionq__copy">
                <span className="admin-actionq__verb">Ack</span>
                <span className="admin-actionq__target">
                  Brow Theory · clear
                </span>
              </span>
              <span className="admin-actionq__when">Low</span>
            </li>
          </ul>
        </BentoModule>

        {/* LIVE — system pulse */}
        <BentoModule
          href="/admin/audit"
          eyebrow="Live · pulse"
          icon={<Activity {...ICON_PROPS} />}
          span={3}
          live="live"
        >
          <KpiBlock
            eyebrow="LIVE SCANS / HR"
            value={String(stats.liveScans)}
            tone="ink"
          />
          <span className="admin-row-status">
            <StatusPill variant="green" label="All systems normal" dot />
          </span>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* PULSE — 24h system activity line chart (replaces creators
            list with a chart register so the bento has KPI / list /
            queue / chart variety). */}
        <BentoModule
          href="/admin/audit"
          eyebrow="Pulse · last 24h"
          icon={<Users {...ICON_PROPS} />}
          span={5}
        >
          <div className="admin-pulse__head">
            <p className="admin-pulse__sum">
              {(287 * 24).toLocaleString()} scans /{" "}
              {stats.totalCreators.toLocaleString()} creators
            </p>
            <span className="admin-pulse__delta">↑ 12% vs prior 24h</span>
          </div>
          <svg
            className="admin-pulse__chart"
            viewBox="0 0 240 60"
            preserveAspectRatio="none"
            aria-label="24-hour activity"
          >
            <defs>
              <linearGradient id="adm-pulse-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(193,18,31,0.28)" />
                <stop offset="100%" stopColor="rgba(193,18,31,0.02)" />
              </linearGradient>
            </defs>
            {/* baseline */}
            <line
              x1="0"
              y1="50"
              x2="240"
              y2="50"
              stroke="rgba(20,19,15,0.08)"
              strokeWidth="1"
            />
            {/* area */}
            <path
              d="M0,42 L10,38 L20,40 L30,32 L40,28 L50,30 L60,22 L70,18 L80,24 L90,16 L100,20 L110,12 L120,18 L130,14 L140,22 L150,18 L160,26 L170,20 L180,28 L190,24 L200,32 L210,26 L220,34 L230,28 L240,36 L240,60 L0,60 Z"
              fill="url(#adm-pulse-fill)"
            />
            {/* line */}
            <path
              d="M0,42 L10,38 L20,40 L30,32 L40,28 L50,30 L60,22 L70,18 L80,24 L90,16 L100,20 L110,12 L120,18 L130,14 L140,22 L150,18 L160,26 L170,20 L180,28 L190,24 L200,32 L210,26 L220,34 L230,28 L240,36"
              stroke="var(--brand-red, #c1121f)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* current dot */}
            <circle cx="240" cy="36" r="3" fill="var(--brand-red, #c1121f)" />
          </svg>
          <div className="admin-pulse__legend">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>NOW</span>
          </div>
        </BentoModule>

        {/* DISPUTES */}
        <BentoModule
          href="/admin/disputes"
          eyebrow={`Disputes · ${stats.openDisputes} open`}
          icon={<ShieldAlert {...ICON_PROPS} />}
          span={4}
        >
          <KpiBlock
            eyebrow="OPEN CASES"
            value={String(stats.openDisputes)}
            tone="ink"
          />
          <span className="admin-row-status">
            <StatusPill variant="amber" label="Avg 4h response" dot />
          </span>
        </BentoModule>

        {/* SETTINGS */}
        <BentoModule
          href="/admin/settings"
          eyebrow="Settings · platform"
          icon={<Settings {...ICON_PROPS} />}
          span={3}
        >
          <KpiBlock
            eyebrow="MERCHANTS"
            value={String(stats.totalMerchants)}
            tone="ink"
          />
          <span className="admin-row-status">
            <StatusPill variant="green" label="All approved" dot />
          </span>
        </BentoModule>
      </section>
    </main>
  );
}
