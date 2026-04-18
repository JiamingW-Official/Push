import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import { getJobBySlug, JOBS } from "@/lib/careers/mock-jobs";
import ApplyForm from "./ApplyForm";
import "./job.css";

/* ── v5.1 spec: 3 canonical roles statically generated ──────── */
const STATIC_ROLES = [
  "founding-engineer-ai",
  "head-of-creator-ops",
  "merchant-success-lead",
] as const;

export async function generateStaticParams() {
  // Generate the 3 v5.1 spec roles plus the full mock-jobs catalog
  const allSlugs = new Set<string>([
    ...STATIC_ROLES,
    ...JOBS.map((j) => j.slug),
  ]);
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

/* ── v5.1 spec — 3 canonical v5.1 role detail records ───────── */
const V51_ROLES: Record<
  string,
  {
    title: string;
    department: string;
    location: string;
    type: string;
    compensation: string;
    aboutRole: string;
    ship90Days: string[];
    mustHaves: string[];
    niceToHaves: string[];
    pushValues: string[];
  }
> = {
  "founding-engineer-ai": {
    title: "Founding Engineer — AI",
    department: "Engineering",
    location: "NYC \u00B7 hybrid",
    type: "Full-time",
    compensation: "$180k\u2013$230k + 1.0\u20132.0% equity",
    aboutRole:
      "Own ConversionOracle\u2122 end to end. You'll harden the three-layer verification pipeline (QR + Claude Vision OCR + geo-match) and evolve the Vertical AI for Local Commerce stack from Williamsburg Coffee+ into the next Neighborhood Playbook units. This is the role that unlocks SLR 25.",
    ship90Days: [
      "Ship ConversionOracle\u2122 v2 \u2014 walk-in prediction accuracy \u226588% on the Williamsburg Coffee+ training set",
      "Harden the Claude Vision receipt-OCR pipeline with anti-fraud timing-window checks",
      "Wire the DisclosureBot pre-flight into every creator caption ship path",
      "Close the feedback loop: every verified customer auto-flows back into the Oracle training set",
    ],
    mustHaves: [
      "5+ years shipping production ML/AI systems \u2014 ideally vision, NLP, or prediction on messy real-world data",
      "Hands-on with Claude, GPT-4o, or comparable multimodal LLMs in production",
      "Strong Python + PyTorch; comfortable reading and writing TypeScript",
      "High ownership \u2014 you'll be the only ML person in the room most days",
    ],
    niceToHaves: [
      "Background in receipt/document OCR or retail computer vision",
      "Prior work on attribution, fraud, or verification systems",
      "Comfortable spending time in Williamsburg cafes watching the product work",
    ],
    pushValues: [
      "Verified beats claimed \u2014 you only count what you can prove",
      "Narrow beats broad \u2014 one vertical at a time",
      "Leverage beats labor \u2014 every human-touch hour removed is moat",
      "Trust is a moat \u2014 DisclosureBot, ConversionOracle\u2122 ground truth compound",
      "Operators before platforms \u2014 the coffee owner is the customer",
    ],
  },
  "head-of-creator-ops": {
    title: "Head of Creator Ops",
    department: "Operations",
    location: "NYC \u00B7 hybrid",
    type: "Full-time",
    compensation: "$130k\u2013$165k + 0.4\u20130.8% equity",
    aboutRole:
      "Own the Two-Segment Creator Economics network: T1\u2013T3 pay-per-verified-customer seeds/explorers/operators and T4\u2013T6 retainer/performance/rev-share/equity professionals. You're the human the creator community calls first \u2014 and the ops discipline that keeps SLR compounding every week.",
    ship90Days: [
      "Onboard 40 Two-Segment Creator Economics creators against the Williamsburg Coffee+ brief library",
      "Ship the T1\u2192T6 tier-progression dashboard with auto-flip rules from verified-customer thresholds",
      "Run the first Neighborhood Playbook creator summit across Williamsburg + Greenpoint",
      "Reduce manual campaign triage to under 20% of ops FTE hours",
    ],
    mustHaves: [
      "4+ years in creator relations, influencer management, or local commerce ops",
      "High empathy + firm judgment \u2014 you can be warm and hold a quality line",
      "Excellent written DM/email voice \u2014 every word lands like a brand asset",
      "NYC-based and active at local creator events",
    ],
    niceToHaves: [
      "Personal experience as a content creator",
      "Prior work at a creator platform during scale-up",
      "Basic SQL for pulling your own ops reports",
    ],
    pushValues: [
      "Verified beats claimed \u2014 reach without receipts is noise",
      "Narrow beats broad \u2014 the Williamsburg Coffee+ brief library is your bible",
      "Leverage beats labor \u2014 automate every triage you can",
      "Trust is a moat \u2014 DisclosureBot clears the caption; you keep the human tone",
      "Operators before platforms \u2014 every creator is a partner, not a number",
    ],
  },
  "merchant-success-lead": {
    title: "Merchant Success Lead",
    department: "Operations",
    location: "NYC \u00B7 hybrid",
    type: "Full-time",
    compensation: "$110k\u2013$145k + 0.3\u20130.6% equity",
    aboutRole:
      "Own every Williamsburg Coffee+ merchant from $0 Pilot through Operator ($500/mo + $15\u201385/customer) through Neighborhood plan upgrade. You close merchants in person, stay in their shop on launch day, and turn every verified-customer win into a replicable Neighborhood Playbook row.",
    ship90Days: [
      "Lock the 10 Williamsburg Coffee+ Pilot merchants at $0 Pilot cost (cap $4,200 / neighborhood)",
      "Run the 60-day SLR ladder \u2014 auto-flip the first merchant to Operator at 10 verified customers",
      "Ship the Pilot-to-Operator handoff runbook (standard Neighborhood Playbook row)",
      "Produce the first Williamsburg Coffee+ case-study doc that closes the next 50 merchants",
    ],
    mustHaves: [
      "4+ years in customer success, account management, or merchant-facing SaaS ops \u2014 ideally local commerce or hospitality tech",
      "Comfortable walking into a coffee shop cold and earning trust in one conversation",
      "Strong operator mindset \u2014 you read a P&L and a room equally well",
      "NYC-native knowledge of Williamsburg \u2014 block by block, not just neighborhood names",
    ],
    niceToHaves: [
      "Prior work at Toast, Resy, Square, or a hospitality-tech platform",
      "Relationships inside NYC's independent coffee or hospitality scene",
      "Basic SQL for pulling ConversionOracle\u2122 reports per merchant",
    ],
    pushValues: [
      "Verified beats claimed \u2014 only a QR + receipt + geo-match counts",
      "Narrow beats broad \u2014 Williamsburg Coffee+ is Template 0, not our TAM",
      "Leverage beats labor \u2014 every playbook row is a multiplier",
      "Trust is a moat \u2014 your word to the merchant is the brand",
      "Operators before platforms \u2014 the espresso owner is the real user",
    ],
  },
};

/* ── Metadata ─────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v51 = V51_ROLES[slug];
  const job = v51 ?? getJobBySlug(slug);
  if (!job) return { title: "Role not found \u2014 Push" };
  const title = "title" in job ? job.title : "Role";
  return {
    title: `${title} \u2014 Push`,
    description: `Join Push and help build Vertical AI for Local Commerce. Open role: ${title}.`,
  };
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v51 = V51_ROLES[slug];
  const legacy = !v51 ? getJobBySlug(slug) : undefined;

  if (!v51 && !legacy) notFound();

  // Normalized role shape — supports v5.1 spec roles + legacy mock-jobs entries
  const role = v51
    ? {
        title: v51.title,
        department: v51.department,
        location: v51.location,
        type: v51.type,
        compensation: v51.compensation,
        aboutRole: v51.aboutRole,
        ship90Days: v51.ship90Days,
        mustHaves: v51.mustHaves,
        niceToHaves: v51.niceToHaves,
        pushValues: v51.pushValues,
      }
    : {
        title: legacy!.title,
        department: legacy!.department,
        location: legacy!.location,
        type: legacy!.type,
        compensation: legacy!.compensation,
        aboutRole: legacy!.aboutRole,
        ship90Days: legacy!.youllBe,
        mustHaves: legacy!.youShouldHave,
        niceToHaves: legacy!.niceToHave,
        pushValues: [
          "Verified beats claimed",
          "Narrow beats broad",
          "Leverage beats labor",
          "Trust is a moat",
          "Operators before platforms",
        ],
      };

  return (
    <>
      <ScrollRevealInit />

      {/* ── Breadcrumb + Hero ───────────────────────────── */}
      <section className="job-hero">
        <div className="job-inner">
          <nav className="job-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true"> &rsaquo; </span>
            <Link href="/careers">Careers</Link>
            <span aria-hidden="true"> &rsaquo; </span>
            <span className="job-breadcrumb-current">{role.title}</span>
          </nav>
          <div className="job-hero-content">
            <div className="job-meta-row reveal">
              <span className="job-dept-tag">{role.department}</span>
              <span className="job-divider">&middot;</span>
              <span className="job-location">{role.location}</span>
              <span className="job-divider">&middot;</span>
              <span className="job-type">{role.type}</span>
            </div>
            <h1 className="job-title reveal">{role.title}</h1>
            <p className="job-comp reveal">{role.compensation}</p>
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────── */}
      <section className="job-body">
        <div className="job-inner job-body-grid">
          {/* Main content */}
          <div className="job-content">
            {/* About the role */}
            <div className="job-section reveal">
              <h2 className="job-section-title">About the role</h2>
              <p className="job-section-body">{role.aboutRole}</p>
            </div>

            {/* What you'll ship in 90 days */}
            <div className="job-section reveal">
              <h2 className="job-section-title">
                What you&apos;ll ship in 90 days
              </h2>
              <ul className="job-list">
                {role.ship90Days.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Must-haves */}
            <div className="job-section reveal">
              <h2 className="job-section-title">Must-haves</h2>
              <ul className="job-list">
                {role.mustHaves.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice-to-haves */}
            <div className="job-section reveal">
              <h2 className="job-section-title">Nice-to-haves</h2>
              <ul className="job-list job-list--muted">
                {role.niceToHaves.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&#9675;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Push values */}
            <div className="job-section reveal">
              <h2 className="job-section-title">Push values</h2>
              <ul className="job-list">
                {role.pushValues.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet job-list-bullet--check">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply CTA (email + LinkedIn, pre-filled role) */}
            <div className="job-section job-section--apply reveal" id="apply">
              <h2 className="job-section-title">Apply</h2>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                  marginBottom: "var(--space-6)",
                }}
              >
                <a
                  className="job-btn-primary"
                  href={`mailto:careers@pushnyc.com?subject=${encodeURIComponent(
                    `Application \u2014 ${role.title}`,
                  )}&body=${encodeURIComponent(
                    `Hi Push team,\n\nI'd like to apply for the ${role.title} role.\n\nBackground:\nLinks (portfolio / LinkedIn / GitHub):\nWhy this role, why now:\n\nThanks,\n`,
                  )}`}
                >
                  Email careers@pushnyc.com
                </a>
                <a
                  className="job-btn-secondary"
                  href="https://www.linkedin.com/company/push-nyc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DM us on LinkedIn
                </a>
                <Link
                  className="job-btn-secondary"
                  href={{
                    pathname: "/contact",
                    query: { topic: "Careers", role: role.title },
                  }}
                >
                  Use the contact form
                </Link>
              </div>
              <ApplyForm jobTitle={role.title} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="job-sidebar">
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Position</p>
              <p className="job-sidebar-value">{role.title}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Department</p>
              <p className="job-sidebar-value">{role.department}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Location</p>
              <p className="job-sidebar-value">{role.location}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Type</p>
              <p className="job-sidebar-value">{role.type}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Compensation</p>
              <p className="job-sidebar-value">{role.compensation}</p>
            </div>
            <a href="#apply" className="job-btn-primary job-sidebar-cta">
              Apply now
            </a>
            <Link href="/careers" className="job-sidebar-back">
              View all roles
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
