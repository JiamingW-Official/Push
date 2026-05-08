/* ============================================================
   /merchant/dashboard — MERCHANT hub. v2 (2026-05-08, Work-template parity)

   Ink-solid executive panel + champagne accent for waiting applicants.
   Each panel surfaces a different merchant subpage (campaigns / applicants
   / qr-codes / messages / billing).

   Layout (12-col, 2 rows minmax):
     Row 1: REVENUE 5 (ink solid) | APPLICANTS 4 (champ) | LIVE 3
     Row 2: CAMPAIGNS 5 | MESSAGES 4 | SPEND 3
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import {
  TrendingUp,
  Users,
  QrCode,
  Megaphone,
  MessageCircle,
  CreditCard,
  CheckCircle2,
  Eye,
  Mail,
} from "lucide-react";
import "@/components/shared/hub-shell.css";
import "./dashboard.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

export default function MerchantDashboard() {
  // Mock data for now — replace with real fetch when the merchant
  // analytics API is wired. Keep the shape stable so the swap is mechanical.
  const stats = {
    monthRevenue: 4280,
    monthDelta: 22.5,
    applicantsPending: 7,
    activeCampaigns: 3,
    liveScansToday: 142,
    spendThisMonth: 320,
    unreadMessages: 4,
  };

  return (
    <main className="md-hub" aria-label="Merchant dashboard">
      <header className="md-hero">
        <div className="md-hero__left">
          <p className="md-hero__eyebrow">Dashboard · operations</p>
          <h1 className="md-hero__title">Dashboard</h1>
          <p className="md-hero__sub">
            ${stats.monthRevenue.toLocaleString()} attributed ·{" "}
            {stats.applicantsPending} pending · refreshed just now
          </p>
        </div>
      </header>

      <section className="md-bento" aria-label="Dashboard modules">
        {/* ── Row 1 ── */}

        {/* REVENUE — ink solid hero */}
        <BentoModule
          href="/merchant/analytics"
          eyebrow="Attributed · this month"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={5}
          tone="ink"
        >
          <div className="md-revenue">
            <p className="md-revenue__num">
              ${stats.monthRevenue.toLocaleString()}
            </p>
            <p className="md-revenue__delta">
              ↑ {stats.monthDelta.toFixed(1)}% vs prior 30d
            </p>
            <div className="md-revenue__split">
              <div className="md-revenue__split-row">
                <span>Verified visits</span>
                <span>412</span>
              </div>
              <div className="md-revenue__split-row">
                <span>Repeat customers</span>
                <span>142</span>
              </div>
              <div className="md-revenue__split-row">
                <span>Avg ticket</span>
                <span>$30.16</span>
              </div>
            </div>
          </div>
        </BentoModule>

        {/* APPLICANTS — champagne accent (waiting on merchant) */}
        <BentoModule
          href="/merchant/applicants"
          eyebrow="Applicants · waiting on you"
          icon={<Users {...ICON_PROPS} />}
          span={4}
          tone="champagne"
          live="urgent"
        >
          <p className="md-applicants__num">{stats.applicantsPending}</p>
          <p className="md-applicants__lbl">PENDING REVIEW</p>
          <ul className="md-applicants__list">
            <li className="md-applicants__row">
              <span className="md-applicants__name">Alex C.</span>
              <span className="md-applicants__tier">Operator · 60</span>
            </li>
            <li className="md-applicants__row">
              <span className="md-applicants__name">Carlos T.</span>
              <span className="md-applicants__tier">Proven · 78</span>
            </li>
            <li className="md-applicants__row">
              <span className="md-applicants__name">Sasha K.</span>
              <span className="md-applicants__tier">Operator · 64</span>
            </li>
          </ul>
        </BentoModule>

        {/* LIVE — today's QR scans */}
        <BentoModule
          href="/merchant/qr-codes"
          eyebrow="Live · today"
          icon={<QrCode {...ICON_PROPS} />}
          span={3}
          live="live"
        >
          <KpiBlock
            eyebrow="QR SCANS"
            value={String(stats.liveScansToday)}
            tone="ink"
          />
          <span className="md-row-status">
            <StatusPill variant="green" label="48% verified" dot />
          </span>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* CAMPAIGNS — funnel visualization (replaces simple list with
            a 4-stage horizontal funnel: impressions → applicants →
            accepted → verified visits). Shows campaign efficiency at
            a glance. */}
        <BentoModule
          href="/merchant/campaigns"
          eyebrow={`Funnel · ${stats.activeCampaigns} campaigns`}
          icon={<Megaphone {...ICON_PROPS} />}
          span={5}
        >
          <div className="md-funnel" aria-label="Campaign conversion funnel">
            {[
              { label: "Impressions", value: 12480, pct: 100, accent: "ink-5" },
              { label: "Applicants", value: 248, pct: 60, accent: "champagne" },
              { label: "Accepted", value: 18, pct: 35, accent: "blue" },
              { label: "Verified visits", value: 412, pct: 80, accent: "ink" },
            ].map((s) => (
              <div key={s.label} className="md-funnel__row">
                <span className="md-funnel__label">{s.label}</span>
                <div className="md-funnel__track">
                  <div
                    className={`md-funnel__bar md-funnel__bar--${s.accent}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className="md-funnel__value">
                  {s.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </BentoModule>

        {/* MESSAGES */}
        <BentoModule
          href="/merchant/messages"
          eyebrow={`Messages · ${stats.unreadMessages} unread`}
          icon={<MessageCircle {...ICON_PROPS} />}
          span={4}
        >
          <ul className="md-queue" aria-label="Recent messages">
            <li className="md-queue__row md-queue__row--reply">
              <span className="md-queue__tile" aria-hidden>
                <Mail size={14} strokeWidth={2.25} />
              </span>
              <span className="md-queue__copy">
                <span className="md-queue__verb">Reply</span>
                <span className="md-queue__target">Alex · contract Q</span>
              </span>
              <span className="md-queue__when">2h</span>
            </li>
            <li className="md-queue__row md-queue__row--review">
              <span className="md-queue__tile" aria-hidden>
                <Eye size={14} strokeWidth={2.25} />
              </span>
              <span className="md-queue__copy">
                <span className="md-queue__verb">Review</span>
                <span className="md-queue__target">Carlos · draft post</span>
              </span>
              <span className="md-queue__when">5h</span>
            </li>
            <li className="md-queue__row md-queue__row--ack">
              <span className="md-queue__tile" aria-hidden>
                <CheckCircle2 size={14} strokeWidth={2.25} />
              </span>
              <span className="md-queue__copy">
                <span className="md-queue__verb">Ack</span>
                <span className="md-queue__target">Sasha · check-in</span>
              </span>
              <span className="md-queue__when">1d</span>
            </li>
          </ul>
        </BentoModule>

        {/* SPEND */}
        <BentoModule
          href="/merchant/billing"
          eyebrow="Spend · this month"
          icon={<CreditCard {...ICON_PROPS} />}
          span={3}
        >
          <KpiBlock
            eyebrow="PAID OUT"
            value={`$${stats.spendThisMonth}`}
            tone="ink"
          />
          <span className="md-row-status">
            <StatusPill variant="neutral" label="Visa · 4242" dot />
          </span>
        </BentoModule>
      </section>
    </main>
  );
}
