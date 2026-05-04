import type { Metadata } from "next";
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
        {/* ── 1. Hero (warm candy-panel) ───────────────────── */}
        <section className="invite-hero candy-panel">
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

            {/* Headline — corner-anchored, Magvix italic hero treatment */}
            <h1 className="invite-hero-headline invite-reveal">
              {invite.inviterName.split(" ")[0]} invited you
              <br />
              to <em className="invite-hero-push">Push.</em>
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
            <p className="eyebrow invite-eyebrow invite-reveal">
              (WHAT IS PUSH)
            </p>

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

        {/* ── 3. Referral code block ──────────────────────── */}
        <section className="invite-code-section">
          <div className="invite-container">
            <div className="invite-code-block invite-reveal">
              <p className="eyebrow invite-code-eyebrow">
                (YOUR REFERRAL CODE)
              </p>
              <p className="invite-code-value">{invite.code}</p>
              <p className="invite-code-note">
                Applied automatically when you sign up via the links below.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Bonus Reveal ─────────────────────────────── */}
        <section className="invite-bonus">
          <div className="invite-container">
            <div className="invite-bonus-card invite-reveal candy-panel">
              <p className="eyebrow invite-bonus-eyebrow">
                (YOUR EXCLUSIVE BONUS)
              </p>

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

        {/* ── 5. How it works ─────────────────────────────── */}
        <section className="invite-how">
          <div className="invite-container">
            <p className="eyebrow invite-eyebrow">(HOW IT WORKS)</p>

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

        {/* ── 6. Role Selector ────────────────────────────── */}
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
                className="invite-role-card invite-role-card--creator invite-reveal click-shift"
              >
                <span className="eyebrow invite-role-tag">(CREATOR)</span>
                <span className="invite-role-name">I&apos;m a creator</span>
                <p className="invite-role-desc">
                  You create content, have a following, and want to earn money
                  by driving real local visits.
                </p>
                <div className="invite-role-cta">
                  <span className="btn-primary invite-role-btn">
                    Join as creator
                  </span>
                </div>
              </a>

              {/* Business card */}
              <a
                href={merchantSignupHref}
                className="invite-role-card invite-role-card--merchant invite-reveal click-shift"
              >
                <span className="eyebrow invite-role-tag">(BUSINESS)</span>
                <span className="invite-role-name">I&apos;m a business</span>
                <p className="invite-role-desc">
                  You own or operate a local business and want creators to drive
                  measurable foot traffic.
                </p>
                <div className="invite-role-cta">
                  <span className="btn-ghost invite-role-btn">
                    Join as business
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ── 7. Social Proof ─────────────────────────────── */}
        <section className="invite-social-proof">
          <div className="invite-container">
            <p className="invite-social-proof-text">
              Joining <strong>340+ creators</strong> and{" "}
              <strong>50+ NYC merchants</strong> already on Push.
            </p>
          </div>
        </section>

        {/* ── 8. Inviter Profile Preview ───────────────────── */}
        <section className="invite-profile-preview">
          <div className="invite-container">
            <p
              className="eyebrow invite-eyebrow"
              style={{ marginBottom: "var(--space-3)" }}
            >
              (YOUR INVITER)
            </p>

            <div className="invite-profile-card invite-reveal">
              <div className="invite-profile-avatar-lg" aria-hidden="true">
                {invite.inviterAvatar}
              </div>

              <div className="invite-profile-info">
                <p className="invite-profile-name">{invite.inviterName}</p>
                <p className="invite-profile-handle">{invite.inviterHandle}</p>
                <div className="invite-profile-badges">
                  <span className="btn-pill invite-badge-tier">
                    {invite.inviterTier}
                  </span>
                  <span className="btn-pill invite-badge-location">
                    NYC · {invite.inviterNeighborhood}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. Expiry Notice ────────────────────────────── */}
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

        {/* ── 10. Ticket CTA ──────────────────────────────── */}
        <section className="invite-ticket-section">
          <div className="ticket-panel invite-ticket">
            <p className="eyebrow invite-ticket-eyebrow">(JOIN PUSH)</p>
            <h2 className="invite-ticket-headline">
              Join and earn your first $50.
            </h2>
            <a
              href={isCreator ? creatorSignupHref : merchantSignupHref}
              className="btn-primary click-shift invite-ticket-btn"
            >
              Claim your invite
            </a>
          </div>
        </section>

        {/* ── 11. Bottom ───────────────────────────────────── */}
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
