"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./referrals.css";

/* ── Leaderboard data (fictional) ─────────────────────────── */
const LEADERBOARD = [
  {
    rank: 1,
    handle: "@maya.eats.nyc",
    initials: "ME",
    tier: "Elite",
    invites: 48,
    earned: 1_320,
  },
  {
    rank: 2,
    handle: "@brooklyn_bites",
    initials: "BB",
    tier: "Pro",
    invites: 41,
    earned: 1_090,
  },
  {
    rank: 3,
    handle: "@nycfoodie_",
    initials: "NF",
    tier: "Elite",
    invites: 37,
    earned: 950,
  },
  {
    rank: 4,
    handle: "@williamsburg.eats",
    initials: "WE",
    tier: "Pro",
    invites: 31,
    earned: 780,
  },
  {
    rank: 5,
    handle: "@lowereastside_food",
    initials: "LE",
    tier: "Rising",
    invites: 28,
    earned: 700,
  },
  {
    rank: 6,
    handle: "@harlem_tastings",
    initials: "HT",
    tier: "Pro",
    invites: 24,
    earned: 620,
  },
  {
    rank: 7,
    handle: "@soho_bites",
    initials: "SB",
    tier: "Rising",
    invites: 21,
    earned: 540,
  },
  {
    rank: 8,
    handle: "@astoria_eats",
    initials: "AE",
    tier: "Pro",
    invites: 19,
    earned: 475,
  },
  {
    rank: 9,
    handle: "@upperwest_food",
    initials: "UF",
    tier: "Rising",
    invites: 16,
    earned: 410,
  },
  {
    rank: 10,
    handle: "@queens_flavors",
    initials: "QF",
    tier: "Starter",
    invites: 14,
    earned: 350,
  },
];

/* ── FAQ data ─────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Who can participate in the referral program?",
    a: "Any verified Push user — creator or merchant — with an active account is eligible. You must complete your profile and have at least one campaign or event on record to receive payouts.",
  },
  {
    q: "How do I get my unique referral link?",
    a: "Sign in to Push and navigate to your dashboard. Your unique referral link is displayed in the Referrals section. Share it via any channel — DMs, stories, email, or QR code.",
  },
  {
    q: "When do creator-to-creator rewards pay out?",
    a: "The $25 credit for the referrer is granted when the invited creator completes their profile and runs their first verified campaign. The invitee receives their $25 credit on the same milestone.",
  },
  {
    q: "How does the creator-invites-merchant reward work?",
    a: "When a creator refers a merchant who subscribes to a paid Push plan, the creator earns 10% of that merchant's first-month subscription fee, paid for 3 consecutive months. The merchant receives no special discount — this is a creator-side reward only.",
  },
  {
    q: "What counts as a 'first month subscription' for the merchant reward?",
    a: "The merchant must subscribe to a paid Push plan: Essentials ($99/month), Pro (outcome-based, capped $179/mo), or Advanced ($349/month). Credits are based on the plan price at time of subscription, excluding taxes.",
  },
  {
    q: "How does the merchant-invites-merchant reward work?",
    a: "If a merchant refers another merchant who subscribes, both receive 1 free month of their respective subscription plan. Free months are applied to the current billing cycle after the referred merchant's first successful payment.",
  },
  {
    q: "Can I stack multiple referral types?",
    a: "Yes. There is no cap on how many people you refer. You can refer both creators and merchants simultaneously, and each qualifying referral earns its own reward independently.",
  },
  {
    q: "Is there a cap on total referral earnings?",
    a: "There is no cap on the number of referrals. However, per calendar month, cash-equivalent payouts are subject to a $2,000 ceiling for creators. Credits applied to merchant billing have no ceiling.",
  },
  {
    q: "How are rewards delivered?",
    a: "Creator cash rewards accumulate in your Push Wallet and can be withdrawn via Stripe Connect (minimum $25 balance) or applied as campaign credits. Merchant free months are automatically applied to your next invoice.",
  },
  {
    q: "What happens if a referred user cancels before meeting the milestone?",
    a: "Rewards are tied to specific milestones: first campaign (creator) or first paid billing cycle (merchant). If the referred user does not reach the milestone, no reward is issued. Partial milestones do not qualify.",
  },
  {
    q: "Can a referred user also refer others?",
    a: "Yes. Once a referred user joins and meets their first milestone, they receive their own unique referral link and become eligible to refer others. The program compounds naturally.",
  },
  {
    q: "Are referral rewards taxable?",
    a: "Referral rewards that exceed $600 in a calendar year may be reported on a 1099-NEC form for US users. Push will send tax documents where required by law. Consult a tax professional for your specific situation.",
  },
  {
    q: "What if someone I referred already has a Push account?",
    a: "Referral links only apply to users who sign up through your link as new accounts. Existing accounts cannot be retroactively linked to a referrer.",
  },
  {
    q: "Can I see which referrals are pending vs. confirmed?",
    a: "Yes. Your private dashboard at /creator/referrals or /merchant/referrals shows the real-time status of every referral: Invited → Profile Complete → First Milestone → Reward Issued.",
  },
  {
    q: "What if my referral link stops working?",
    a: "Contact support@pushnyc.app. Referral links are permanent and tied to your account ID. If a link returns an error, our team can investigate and manually attribute any qualifying referrals made during the outage.",
  },
];

/* ── FAQ accordion item ────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`ref-faq-item${open ? " open" : ""}`}>
      <button
        className="ref-faq-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`faq-body-${index}`}
      >
        <span className="ref-faq-q">{q}</span>
        <span className="ref-faq-icon" aria-hidden="true">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </svg>
        </span>
      </button>
      <div className="ref-faq-body" id={`faq-body-${index}`} role="region">
        <p className="ref-faq-a">{a}</p>
      </div>
    </li>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ReferralsPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── 01 HERO ──────────────────────────────────────── */}
      <section className="ref-hero">
        <div className="ref-container ref-hero-inner">
          <span className="ref-eyebrow ref-eyebrow--light reveal">
            Push Referral Program · Open to All Members
          </span>

          <h1 className="ref-hero-headline reveal reveal--delay-1">
            <span className="line-black">Invite friends.</span>
            <span className="line-light">Earn</span>
            <em> together.</em>
          </h1>

          <p className="ref-hero-sub reveal reveal--delay-2">
            Every successful referral puts real money on the table — for you and
            the person you bring in. Creators, merchants, everyone wins.
          </p>

          <div className="ref-hero-cta reveal reveal--delay-3">
            <Link href="/sign-in" className="ref-btn ref-btn--primary">
              Get My Link
            </Link>
            <a href="#how-it-works" className="ref-btn ref-btn--ghost">
              See How It Works
            </a>
          </div>

          <div className="ref-hero-stats reveal reveal--delay-4">
            <div>
              <span className="ref-hero-stat-num">$25</span>
              <span className="ref-hero-stat-label">
                creator invite bonus, both ways
              </span>
            </div>
            <div>
              <span className="ref-hero-stat-num">10%</span>
              <span className="ref-hero-stat-label">
                of merchant sub, 3 months
              </span>
            </div>
            <div>
              <span className="ref-hero-stat-num">+1mo</span>
              <span className="ref-hero-stat-label">
                free when merchants refer merchants
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 TRIPLE REWARD EXPLAINER ───────────────────── */}
      <section className="ref-section ref-rewards" id="rewards">
        <div className="ref-container">
          <div className="ref-rewards-intro reveal">
            <span className="ref-eyebrow">Three scenarios. All reward.</span>
            <h2>
              Every connection
              <br />
              <em>earns twice.</em>
            </h2>
            <p>
              Push has three distinct referral paths — each designed to reward
              the relationship that actually exists between you and the people
              you invite.
            </p>
          </div>

          <div className="ref-reward-grid">
            {/* Card 01 */}
            <div className="ref-reward-card reveal">
              <span className="ref-reward-num" aria-hidden="true">
                01
              </span>
              <span className="ref-reward-scenario">Scenario 01</span>
              <div className="ref-reward-actors">
                <span className="ref-actor-tag">Creator</span>
                <span className="ref-actor-arrow">→</span>
                <span className="ref-actor-tag">Creator</span>
              </div>
              <h3 className="ref-reward-title">Creator invites Creator</h3>
              <div className="ref-reward-amount">
                <sup>$</sup>25
                <span
                  style={{
                    fontSize: "0.5em",
                    fontWeight: 700,
                    color: "var(--graphite)",
                    marginLeft: 8,
                  }}
                >
                  each
                </span>
              </div>
              <p className="ref-reward-desc">
                Refer a fellow content creator to Push. When they complete their
                profile and run their first verified campaign, you both receive
                a $25 wallet credit — no strings attached.
              </p>
              <p className="ref-reward-note">
                Paid on: referree's first completed campaign. Credit applied to
                Push Wallet within 48 hours of milestone confirmation.
              </p>
            </div>

            {/* Card 02 */}
            <div className="ref-reward-card reveal reveal--delay-1">
              <span className="ref-reward-num" aria-hidden="true">
                02
              </span>
              <span className="ref-reward-scenario">Scenario 02</span>
              <div className="ref-reward-actors">
                <span className="ref-actor-tag">Creator</span>
                <span className="ref-actor-arrow">→</span>
                <span className="ref-actor-tag">Merchant</span>
              </div>
              <h3 className="ref-reward-title">Creator invites Merchant</h3>
              <div className="ref-reward-amount">
                <sup style={{ fontSize: "0.45em" }}>10%</sup>
                <span
                  style={{
                    fontSize: "0.5em",
                    fontWeight: 700,
                    color: "var(--graphite)",
                    marginLeft: 8,
                  }}
                >
                  × 3 months
                </span>
              </div>
              <p className="ref-reward-desc">
                Send a merchant to Push and earn 10% of their first month's
                subscription fee — recurring for three consecutive months. On
                the Essentials plan ($99/mo), that's $9.90/month. On Advanced
                ($349/mo), that's $34.90/month.
              </p>
              <p className="ref-reward-note">
                Paid on: merchant's first successful billing cycle. Earned for 3
                months total as long as merchant remains subscribed.
              </p>
            </div>

            {/* Card 03 */}
            <div className="ref-reward-card reveal reveal--delay-2">
              <span className="ref-reward-num" aria-hidden="true">
                03
              </span>
              <span className="ref-reward-scenario">Scenario 03</span>
              <div className="ref-reward-actors">
                <span className="ref-actor-tag">Merchant</span>
                <span className="ref-actor-arrow">→</span>
                <span className="ref-actor-tag">Merchant</span>
              </div>
              <h3 className="ref-reward-title">Merchant invites Merchant</h3>
              <div
                className="ref-reward-amount"
                style={{ fontSize: "clamp(28px,3.5vw,44px)" }}
              >
                1 month free
              </div>
              <p className="ref-reward-desc">
                As a merchant, when you bring another restaurant, venue, or
                brand onto Push and they complete their first paid subscription
                cycle, both of you receive one free month of your respective
                plan — credited automatically to your next invoice.
              </p>
              <p className="ref-reward-note">
                Paid on: referred merchant's first paid billing cycle
                completion. Free month applied to inviter and invitee alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 HOW IT WORKS ──────────────────────────────── */}
      <section className="ref-section ref-how" id="how-it-works">
        <div className="ref-container">
          <div className="ref-how-header reveal">
            <span className="ref-eyebrow">The process</span>
            <h2>
              Four steps.
              <br />
              Zero complexity.
            </h2>
          </div>

          <div className="ref-steps">
            <div className="ref-step reveal">
              <span className="ref-step-num">01</span>
              <span className="ref-step-label">Step one</span>
              <h3 className="ref-step-title">Sign in to Push</h3>
              <p className="ref-step-desc">
                Log in to your creator or merchant account. Your unique referral
                link is generated automatically and lives in your dashboard at
                all times.
              </p>
            </div>

            <div className="ref-step reveal reveal--delay-1">
              <span className="ref-step-num">02</span>
              <span className="ref-step-label">Step two</span>
              <h3 className="ref-step-title">Share your link</h3>
              <p className="ref-step-desc">
                Copy your link and share it anywhere — Instagram stories, group
                chats, email newsletters, or a QR code you print and post. Any
                channel works.
              </p>
            </div>

            <div className="ref-step reveal reveal--delay-2">
              <span className="ref-step-num">03</span>
              <span className="ref-step-label">Step three</span>
              <h3 className="ref-step-title">They join & hit milestone</h3>
              <p className="ref-step-desc">
                Your referral signs up through your link and reaches their
                qualifying milestone: first campaign for creators, first billing
                cycle for merchants.
              </p>
            </div>

            <div className="ref-step reveal reveal--delay-3">
              <span className="ref-step-num">04</span>
              <span className="ref-step-label">Step four</span>
              <h3 className="ref-step-title">Both of you earn</h3>
              <p className="ref-step-desc">
                Rewards hit automatically — no forms, no requests. Track every
                referral's status in real time inside your private referrals
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 EXAMPLE CALCULATIONS ──────────────────────── */}
      <section className="ref-section ref-calc" id="calculations">
        <div className="ref-container">
          <div className="ref-calc-header reveal">
            <span className="ref-eyebrow ref-eyebrow--light">Do the math</span>
            <h2>
              If you invite
              <br />
              <em>10 creators</em>
            </h2>
            <p>
              Each referral compounds. Here's what consistent sharing actually
              looks like across different scenarios in a single month.
            </p>
          </div>

          <div className="ref-calc-scenarios">
            {/* Scenario A */}
            <div className="ref-calc-scenario reveal">
              <p className="ref-calc-scenario-label">
                Scenario A — Creator → Creator
              </p>
              <h3 className="ref-calc-scenario-title">
                10 creators, all run their first campaign
              </h3>

              <div className="ref-calc-line">
                <span className="ref-calc-line-label">
                  Referrals who hit milestone
                </span>
                <span className="ref-calc-line-value">10 / 10</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">Reward per referral</span>
                <span className="ref-calc-line-value">$25</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">Your wallet credit</span>
                <span className="ref-calc-line-value ref-calc-line-value--highlight">
                  $250
                </span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">
                  Each invitee also receives
                </span>
                <span className="ref-calc-line-value">$25 each</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">
                  Total value unlocked in network
                </span>
                <span className="ref-calc-line-value ref-calc-line-value--highlight">
                  $500
                </span>
              </div>
            </div>

            {/* Scenario B */}
            <div className="ref-calc-scenario reveal reveal--delay-1">
              <p className="ref-calc-scenario-label">
                Scenario B — Creator → Merchant (Advanced plan)
              </p>
              <h3 className="ref-calc-scenario-title">
                5 merchants referred, all on Advanced ($349/mo)
              </h3>

              <div className="ref-calc-line">
                <span className="ref-calc-line-label">
                  Merchants subscribed
                </span>
                <span className="ref-calc-line-value">5</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">
                  10% × $349 per merchant
                </span>
                <span className="ref-calc-line-value">$34.90 / mo</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">Month 1 earnings</span>
                <span className="ref-calc-line-value ref-calc-line-value--highlight">
                  $174.50
                </span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">Month 2 earnings</span>
                <span className="ref-calc-line-value">$174.50</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">Month 3 earnings</span>
                <span className="ref-calc-line-value">$174.50</span>
              </div>
              <div className="ref-calc-line">
                <span className="ref-calc-line-label">3-month total</span>
                <span className="ref-calc-line-value ref-calc-line-value--highlight">
                  $523.50
                </span>
              </div>
            </div>
          </div>

          <div className="ref-calc-total reveal">
            <div>
              <span className="ref-calc-total-label">
                Combined 3-month potential
              </span>
              <div className="ref-calc-total-num">$773</div>
              <span className="ref-calc-total-period">
                from 15 referrals, zero ad spend
              </span>
            </div>
            <div style={{ maxWidth: 320 }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "rgba(245,242,236,0.55)",
                  lineHeight: 1.65,
                }}
              >
                The more consistently you share, the more these numbers
                compound. Creators who refer 30+ people per month average over
                $800 in monthly referral income based on internal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 FAQ ───────────────────────────────────────── */}
      <section className="ref-section ref-faq" id="faq">
        <div className="ref-container">
          <div className="ref-faq-layout">
            <div className="ref-faq-sidebar reveal">
              <span className="ref-eyebrow">Questions</span>
              <h2>
                Everything
                <br />
                you need
                <br />
                to know.
              </h2>
              <p>
                Still unclear? Reach out at{" "}
                <a
                  href="mailto:support@pushnyc.app"
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  support@pushnyc.app
                </a>
              </p>
            </div>

            <ul className="ref-faq-list reveal reveal--delay-1">
              {FAQS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 06 LEADERBOARD ───────────────────────────────── */}
      <section className="ref-section ref-leaderboard" id="leaderboard">
        <div className="ref-container">
          <div className="ref-leaderboard-header reveal">
            <div>
              <span className="ref-eyebrow">Community</span>
              <h2>
                Top inviters
                <br />
                this month.
              </h2>
            </div>
            <span className="ref-leaderboard-period">
              April 2026 · Resets May 1
            </span>
          </div>

          <div className="ref-lb-table reveal reveal--delay-1">
            {/* Header row */}
            <div className="ref-lb-row ref-lb-row--header" aria-hidden="true">
              <span className="ref-lb-col-label">#</span>
              <span className="ref-lb-col-label">Member</span>
              <span className="ref-lb-col-label">Invites</span>
              <span className="ref-lb-col-label">Earned</span>
            </div>

            {LEADERBOARD.map((entry) => (
              <div
                key={entry.rank}
                className={`ref-lb-row${entry.rank <= 3 ? " ref-lb-row--top" : ""}`}
              >
                <span
                  className={`ref-lb-rank${entry.rank === 1 ? " ref-lb-rank--gold" : ""}`}
                >
                  {entry.rank}
                </span>
                <div className="ref-lb-user">
                  <div
                    className={`ref-lb-avatar${entry.rank === 1 ? " ref-lb-avatar--gold" : ""}`}
                  >
                    {entry.initials}
                  </div>
                  <div>
                    <div className="ref-lb-handle">{entry.handle}</div>
                    <div className="ref-lb-tier">{entry.tier}</div>
                  </div>
                </div>
                <span className="ref-lb-invites">{entry.invites}</span>
                <span className="ref-lb-earned">
                  ${entry.earned.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <p className="ref-lb-footer reveal reveal--delay-2">
            Leaderboard shows estimated earnings based on confirmed milestones.
            Updated daily. Positions use anonymised handles for privacy. To
            appear, opt in to public leaderboard in Account Settings.
          </p>
        </div>
      </section>

      {/* ── 07 CTA ───────────────────────────────────────── */}
      <section className="ref-cta" id="get-started">
        <div className="ref-cta-ghost" aria-hidden="true">
          $$$
        </div>
        <div className="ref-container">
          <div className="ref-cta-inner">
            <div className="reveal">
              <span
                className="ref-eyebrow"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Start earning
              </span>
              <h2>
                Sign in.
                <br />
                <em>Grab your link.</em>
              </h2>
            </div>

            <p className="ref-cta-sub reveal reveal--delay-1">
              Your referral link is waiting. Share it once, earn from it
              indefinitely. No ads, no campaigns — just your network.
            </p>

            <div className="ref-cta-actions reveal reveal--delay-2">
              <Link href="/sign-in" className="ref-btn ref-btn--primary">
                Sign In to Get My Link
              </Link>
              <Link href="/sign-up" className="ref-btn ref-btn--ghost">
                Create Account
              </Link>
            </div>

            <p
              className="reveal reveal--delay-3"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-caption)",
                color: "rgba(255,255,255,0.4)",
                marginTop: "var(--space-2)",
              }}
            >
              Free to join. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
