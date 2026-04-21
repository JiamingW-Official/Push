import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { resolveInvite } from "@/lib/referrals/mock-invites";
import InviteReveal from "./InviteReveal";
import "./invite.css";

/* ── Types ─────────────────────────────────────────────────── */
interface PageProps {
  params: Promise<{ code: string }>;
}

/* ── Metadata ───────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  const invite = resolveInvite(code);
  const title = `${invite.inviterName} invited you to Push — get ${invite.bonusLabel}`;
  const description = `Join Push, the creator-to-merchant attribution platform built for NYC. ${invite.inviterName} is sharing their invite — claim your bonus today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Push",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── Page (Server Component) ───────────────────────────────── */
export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;
  const invite = resolveInvite(code);

  // Set ref cookie so subsequent signup pages can record attribution.
  // Next.js cookies() in Server Components is read-only for RSC;
  // the cookie is set via the client component below on mount.
  const isCreator = invite.tag === "creator";

  const creatorSignupHref = `/creator/signup?ref=${invite.code}`;
  const merchantSignupHref = `/merchant/signup?ref=${invite.code}`;

  return (
    <>
      {/* Cookie setter — client boundary */}
      <InviteReveal refCode={invite.code} />

      <main className="invite-page">
        {/* ── 1. Hero ─────────────────────────────────────── */}
        <section className="invite-hero">
          <div className="invite-hero-inner">
            {/* Inviter identity */}
            <div className="invite-inviter-row invite-reveal">
              <div className="invite-avatar" aria-hidden="true">
                {invite.inviterAvatar}
              </div>
              <div className="invite-inviter-meta">
                <span className="invite-inviter-name">
                  {invite.inviterName}
                </span>
                <span className="invite-inviter-handle">
                  {invite.inviterHandle}
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="invite-hero-headline invite-reveal">
              {invite.inviterName.split(" ")[0]} invited you
              <br />
              to <span className="invite-red">Push.</span>
            </h1>

            <p className="invite-hero-subline invite-reveal">
              {isCreator ? (
                <>
                  Claim your <strong>{invite.bonusLabel}</strong> — credited to
                  your Push wallet after your first verified campaign check-in.
                </>
              ) : (
                <>
                  Get <strong>{invite.bonusLabel}</strong> on your first Push
                  subscription — apply code <strong>{invite.code}</strong> at
                  checkout.
                </>
              )}
            </p>
          </div>
        </section>

        {/* ── 2. What's Push ──────────────────────────────── */}
        <section className="invite-whats-push">
          <div className="invite-container">
            <p className="invite-eyebrow invite-reveal">What is Push</p>

            <h2 className="invite-pitch invite-reveal">
              The attribution layer between NYC creators and local businesses.
            </h2>

            <ul className="invite-pitch-bullets">
              <li className="invite-reveal">
                Creators drive real foot traffic for local merchants — and get
                paid per verified visit.
              </li>
              <li className="invite-reveal">
                Merchants get attribution dashboards that prove which creators
                drove sales, not just clicks.
              </li>
              <li className="invite-reveal">
                Every campaign is hyperlocal — Williamsburg, SoHo, Park Slope —
                so results are tangible and measurable.
              </li>
            </ul>
          </div>
        </section>

        {/* ── 3. Bonus Reveal ─────────────────────────────── */}
        <section className="invite-bonus">
          <div className="invite-container">
            <div className="invite-bonus-card invite-reveal">
              <p className="invite-bonus-label">Your exclusive bonus</p>

              {isCreator ? (
                <>
                  <p className="invite-bonus-amount">$25</p>
                  <p className="invite-bonus-title">
                    Launch bonus for creators
                  </p>
                </>
              ) : (
                <>
                  <p className="invite-bonus-amount">20%</p>
                  <p className="invite-bonus-title">Off your first month</p>
                </>
              )}

              <p className="invite-bonus-detail">{invite.bonusDetail}</p>
            </div>
          </div>
        </section>

        {/* ── 4. How it works ─────────────────────────────── */}
        <section className="invite-how">
          <div className="invite-container">
            <p className="invite-eyebrow">How it works</p>

            <div className="invite-steps">
              <div className="invite-step invite-reveal">
                <span className="invite-step-num">01</span>
                <div className="invite-step-body">
                  <h3 className="invite-step-title">Create your account</h3>
                  <p className="invite-step-desc">
                    Sign up as a creator or business in under 2 minutes. Your
                    invite code is automatically applied.
                  </p>
                </div>
              </div>

              <div className="invite-step invite-reveal">
                <span className="invite-step-num">02</span>
                <div className="invite-step-body">
                  <h3 className="invite-step-title">
                    {isCreator ? "Join a campaign" : "Launch a campaign"}
                  </h3>
                  <p className="invite-step-desc">
                    {isCreator
                      ? "Browse local campaigns in your neighborhood and opt in to ones that fit your audience."
                      : "Set a budget, choose creator tiers, and publish your campaign — we handle creator matching."}
                  </p>
                </div>
              </div>

              <div className="invite-step invite-reveal">
                <span className="invite-step-num">03</span>
                <div className="invite-step-body">
                  <h3 className="invite-step-title">
                    {isCreator ? "Earn per check-in" : "Pay per result"}
                  </h3>
                  <p className="invite-step-desc">
                    {isCreator
                      ? "Show up, scan the QR, get paid. Attribution is instant — no waiting on invoices."
                      : "Every verified visit is recorded. You only pay when Push confirms a creator drove real foot traffic."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Role Selector ────────────────────────────── */}
        <section className="invite-roles">
          <div className="invite-container">
            <h2 className="invite-section-title invite-reveal">
              Who are you joining as?
            </h2>
            <p className="invite-section-sub invite-reveal">
              Pick your role — you can always expand later.
            </p>

            <div className="invite-role-grid">
              {/* Creator card */}
              <a
                href={creatorSignupHref}
                className="invite-role-card invite-role-card--creator invite-reveal"
              >
                <span className="invite-role-tag">Creator</span>
                <span className="invite-role-name">I&apos;m a creator</span>
                <p className="invite-role-desc">
                  You create content, have a following, and want to earn money
                  by driving real local visits.
                </p>
                <div className="invite-role-cta">
                  <span>Join as creator</span>
                  <span className="invite-role-arrow">→</span>
                </div>
              </a>

              {/* Business card */}
              <a
                href={merchantSignupHref}
                className="invite-role-card invite-role-card--merchant invite-reveal"
              >
                <span className="invite-role-tag">Business</span>
                <span className="invite-role-name">I&apos;m a business</span>
                <p className="invite-role-desc">
                  You own or operate a local business and want creators to drive
                  measurable foot traffic.
                </p>
                <div className="invite-role-cta">
                  <span>Join as business</span>
                  <span className="invite-role-arrow">→</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ── 6. Social Proof ─────────────────────────────── */}
        <section className="invite-social-proof">
          <div className="invite-container">
            <p className="invite-social-proof-text">
              Joining <strong>340+ creators</strong> and{" "}
              <strong>50+ NYC merchants</strong> already on Push.
            </p>
          </div>
        </section>

        {/* ── 7. Inviter Profile Preview ───────────────────── */}
        <section className="invite-profile-preview">
          <div className="invite-container">
            <p
              className="invite-eyebrow"
              style={{ marginBottom: "var(--space-3)" }}
            >
              Your inviter
            </p>

            <div className="invite-profile-card invite-reveal">
              <div className="invite-profile-avatar-lg" aria-hidden="true">
                {invite.inviterAvatar}
              </div>

              <div className="invite-profile-info">
                <p className="invite-profile-name">{invite.inviterName}</p>
                <p className="invite-profile-handle">{invite.inviterHandle}</p>
                <div className="invite-profile-badges">
                  <span className="invite-badge invite-badge--tier">
                    {invite.inviterTier}
                  </span>
                  <span className="invite-badge invite-badge--location">
                    NYC · {invite.inviterNeighborhood}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. Expiry Notice ────────────────────────────── */}
        <section className="invite-expiry">
          <div className="invite-container">
            <div className="invite-expiry-inner">
              <div className="invite-expiry-icon" aria-hidden="true">
                ⏳
              </div>
              <p className="invite-expiry-text">
                This invite expires in{" "}
                <strong>{invite.expiresInDays} days</strong> — your bonus is
                reserved until then.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. Bottom ───────────────────────────────────── */}
        <section className="invite-bottom">
          <div className="invite-bottom-inner">
            <p className="invite-bottom-brand">
              Push<span>.</span>
            </p>
            <p className="invite-already">
              Already have an account?{" "}
              <Link href="/creator/login">Log in as creator</Link> or{" "}
              <Link href="/merchant/login">log in as business</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
