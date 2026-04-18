// Push — Mock job listings (8 open roles)
// Used by /careers and /careers/[slug]

export type JobType = "Full-time" | "Part-time" | "Contract";
export type JobLocation = "NYC" | "Remote" | "NYC / Remote";
export type JobDepartment =
  | "Engineering"
  | "Design"
  | "Product"
  | "Growth"
  | "Ops";

export interface Job {
  slug: string;
  title: string;
  department: JobDepartment;
  location: JobLocation;
  type: JobType;
  compensation: string;
  aboutRole: string;
  youllBe: string[];
  youShouldHave: string[];
  niceToHave: string[];
  whatWeOffer: string[];
}

export const JOBS: Job[] = [
  {
    slug: "senior-fullstack-engineer",
    title: "Senior Full-stack Engineer",
    department: "Engineering",
    location: "NYC / Remote",
    type: "Full-time",
    compensation: "$160k – $200k + equity",
    aboutRole:
      "You'll own core product surfaces across our creator dashboard, merchant portal, and the ConversionOracle verification pipeline. Push is building Vertical AI for Local Commerce — software that promises a real walk-in customer and then proves it. You'll ship features weekly that real New Yorkers interact with the next day. The stack is Next.js 15, Supabase, TypeScript, and GSAP for the motion layer. No legacy cruft, no layers of abstraction for the sake of it.",
    youllBe: [
      "Building end-to-end features across frontend and backend with full ownership",
      "Designing and optimizing the real-time verification pipeline (QR + Claude Vision OCR + geo-match) powering ConversionOracle",
      "Collaborating directly with the designer (that's one person) to ship pixel-precise UIs",
      "Writing clean, tested TypeScript — no cowboy code",
      "Setting architecture patterns the team will follow as we grow",
    ],
    youShouldHave: [
      "5+ years building production web apps — ideally AI-native SaaS or vertical software",
      "Deep React / Next.js expertise, comfortable with RSC and App Router",
      "PostgreSQL and real-time data (Supabase, Postgres triggers, or similar)",
      "A strong opinion on when NOT to add abstraction",
      "NYC resident or willing to be on-site quarterly",
    ],
    niceToHave: [
      "Experience with GSAP or Lenis for scroll-driven animations",
      "Background in AI-powered verification, fintech, or local commerce software",
      "Prior startup experience (seed through Series A preferred)",
    ],
    whatWeOffer: [
      "100% health, dental, vision — you pick the plan",
      "4 weeks PTO, minimum — use it",
      "$3k annual learning budget, no questions asked",
      "Meaningful equity with a clear cap table",
      "Quarterly NYC all-hands (flights + hotel covered)",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "attribution-data-engineer",
    title: "Attribution Data Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    compensation: "$140k – $180k + equity",
    aboutRole:
      "Push's core promise is verified attribution — every dollar a merchant pays maps to a real walk-in customer captured by ConversionOracle's three-layer pipeline (QR + Claude Vision OCR + geo-match). You'll build the systems that make that promise bulletproof. We're processing scan events, OCR signals, and geo verifications at growing scale. Fraud prevention is a first-class concern.",
    youllBe: [
      "Architecting and maintaining the ConversionOracle verification pipeline end-to-end",
      "Building fraud detection heuristics that don't false-positive on legit scans",
      "Designing data models that merchants can actually understand in their dashboard",
      "Owning the data quality guarantees we make to paying customers",
      "Working closely with the Full-stack engineer on API contracts",
    ],
    youShouldHave: [
      "4+ years in data engineering or backend systems with a data focus",
      "Strong SQL (PostgreSQL preferred) and event pipeline experience",
      "Familiarity with fraud signals and anomaly detection patterns",
      "Experience with webhook ingestion, deduplication, and idempotency",
      "Comfort in TypeScript or Python for pipeline tooling",
    ],
    niceToHave: [
      "Background in ad tech, affiliate verification, or local commerce data",
      "Experience with Supabase Edge Functions or serverless event processing",
      "Prior work on financial reconciliation systems",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "brand-designer",
    title: "Brand Designer",
    department: "Design",
    location: "NYC",
    type: "Full-time",
    compensation: "$110k – $145k + equity",
    aboutRole:
      "Push has a design language that's sharp, editorial, and genuinely different from the sea of rounded-corner SaaS. You'll be the person who maintains that edge — and extends it across every surface we ship. From campaign creative to product UI to the pitch deck we send investors, it all comes from you. One designer, full ownership, real trust.",
    youllBe: [
      "Owning the Push visual identity across digital, print, and in-venue materials",
      "Designing product UI in close collaboration with engineering (Figma → shipped code)",
      "Creating campaign-specific assets for merchants and creators",
      "Evolving the design system: tokens, components, motion principles",
      "Reviewing every public-facing page before it goes live",
    ],
    youShouldHave: [
      "4+ years designing for digital products — startup experience preferred",
      "Portfolio with genuine editorial sensibility (not just clean SaaS UI)",
      "Expert Figma skills — variables, auto-layout, prototype handoff",
      "Understanding of type systems and real typographic craft",
      "Comfort collaborating directly with engineers on CSS-level details",
    ],
    niceToHave: [
      "Motion design experience (GSAP, After Effects, or Lottie)",
      "Experience designing for vertical software or local commerce products",
      "NYC-based and obsessed with the city's visual culture",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "product-manager-creator",
    title: "Product Manager, Creator",
    department: "Product",
    location: "NYC / Remote",
    type: "Full-time",
    compensation: "$130k – $165k + equity",
    aboutRole:
      "The creator side of Push — discovery, tier progression, campaign applications, payout transparency — is where supply-side retention lives. Push runs a Two-Segment creator economy (T1–T3 seed/explorer/operator + T4–T6 retainer/performance/rev-share/equity), and you'll own that surface end-to-end. That means talking to creators in the field (literally, at events and on DMs), translating what you learn into specs the team can build, and measuring whether it worked. No PM theater: you write your own tickets and sit with engineering.",
    youllBe: [
      "Owning the creator product roadmap — discovery through payout",
      "Running continuous discovery: interviews, field research, social listening",
      "Writing crisp specs with clear acceptance criteria — no 40-slide PRDs",
      "Defining and tracking the metrics that signal creator health",
      "Shipping fast and iterating based on real data",
    ],
    youShouldHave: [
      "3+ years in product management, ideally AI-native vertical software or creator-economy products",
      "Track record of shipping and measuring — not just planning",
      "Strong instinct for creator psychology and motivation",
      "Comfort with SQL for pulling your own data",
      "Excellent written communication — you'll write more than you'll present",
    ],
    niceToHave: [
      "Personal experience as a content creator or influencer",
      "Background in creator economy, local commerce, or social platforms",
      "NYC residency — you'll want to attend events your creators work",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "community-ops-lead",
    title: "Community Ops Lead",
    department: "Ops",
    location: "NYC",
    type: "Full-time",
    compensation: "$85k – $110k + equity",
    aboutRole:
      "Push works because real creators show up to real venues and ConversionOracle verifies that real customers walked in. You're the person who keeps the supply side humming — managing the creator community, resolving disputes, enforcing quality standards, and making sure every campaign closes cleanly. This is operational excellence meets community psychology. You'll be in the field, on DMs, and in the data every day.",
    youllBe: [
      "Managing creator onboarding, verification, and Two-Segment tier progression",
      "Moderating campaign disputes and escalations with fairness and speed",
      "Running quality audits on deliverables across active campaigns",
      "Building community programming: feedback sessions, creator spotlights, local meetups",
      "Feeding creator insights back to Product and Growth",
    ],
    youShouldHave: [
      "3+ years in community management, creator relations, or local commerce ops",
      "High empathy + firm judgment — you can be warm and hold a line",
      "Excellent written communication across email, DMs, and documentation",
      "Comfort with ambiguity and fast-changing priorities",
      "NYC-based — you'll be attending local events regularly",
    ],
    niceToHave: [
      "Experience with creator or influencer management platforms",
      "Background in event production or hospitality",
      "Familiarity with basic SQL for ops reporting",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    department: "Growth",
    location: "NYC / Remote",
    type: "Full-time",
    compensation: "$100k – $135k + equity",
    aboutRole:
      "Push is pre-viral. You'll help us get there — without shortcuts. Our brand is built on real local credibility (Williamsburg Coffee+ is the 60-day beachhead; Neighborhood Playbook units come next), and growth needs to feel the same way. You'll own the channels that bring in merchants and creators, run experiments without burning cash, and build the content engine that makes Push feel like the obvious choice for NYC's food and venue scene.",
    youllBe: [
      "Running merchant acquisition across email, LinkedIn, local partnerships, and events",
      "Building and executing the creator recruitment funnel (top of the market through conversion)",
      "Owning content strategy — case studies, newsletters, creator spotlights",
      "Running structured growth experiments with clear hypotheses and measurements",
      "Collaborating with Design on every campaign asset before it ships",
    ],
    youShouldHave: [
      "4+ years in growth marketing — B2B and B2C experience both valuable",
      "Strong written voice — you'll be writing a lot, and it needs to sound like Push",
      "Data-literate: you pull your own reports, spot trends, make decisions",
      "Track record of running scrappy experiments that worked",
      "Genuine interest in NYC's local restaurant and hospitality scene",
    ],
    niceToHave: [
      "Experience marketing to creators or in local commerce",
      "SEO and organic growth background",
      "Prior startup experience where you wore multiple hats",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "head-of-compliance",
    title: "Head of Compliance",
    department: "Ops",
    location: "NYC",
    type: "Full-time",
    compensation: "$130k – $170k + equity",
    aboutRole:
      "Creator payouts touch financial regulation, FTC disclosure requirements, and NYC-specific business licensing. Push's DisclosureBot gates every piece of creator content before it posts — a compliance-by-default design that still needs a human owner. As we scale, we need someone who has lived in this intersection before, not a generalist who will learn on the job. You'll build the compliance function, own legal counsel relationships, and ensure Push can grow fast without cutting corners that matter.",
    youllBe: [
      "Building and maintaining Push's compliance framework across payments, creator disclosures, and data privacy",
      "Owning the FTC / ASA creator disclosure standards across all active campaigns",
      "Advising Product on regulatory implications of new features before they ship",
      "Managing relationships with payment processors, legal counsel, and NYC licensing bodies",
      "Running periodic compliance audits and training for internal teams",
    ],
    youShouldHave: [
      "6+ years in compliance, regulatory affairs, or fintech legal",
      "Deep knowledge of FTC endorsement guidelines and influencer marketing regulations",
      "Experience with payment regulations (Regulation E, money transmission licensing)",
      "Strong written communication — you'll draft policies, not just review them",
      "NYC-based — the regulatory landscape here is specific",
    ],
    niceToHave: [
      "JD or compliance certification (CRCM, CCEP)",
      "Experience at a fintech startup during a growth phase",
      "Background in local commerce, creator platform, or ad-tech compliance",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "general-manager-nyc",
    title: "General Manager, NYC",
    department: "Ops",
    location: "NYC",
    type: "Full-time",
    compensation: "$140k – $185k + equity",
    aboutRole:
      "Push lives or dies in New York. The GM NYC is the person who owns the city — starting with the Williamsburg Coffee+ beachhead and stepping outward through Neighborhood Playbook units. You're part business developer, part operator, part face of the brand. You'll know every major food block in Manhattan, Brooklyn, and Queens by name. If something isn't working in the market, it's your call to fix it.",
    youllBe: [
      "Owning merchant acquisition and retention across all active NYC neighborhoods",
      "Building and expanding the creator network: recruitment, events, field activation",
      "Running weekly market reviews and escalating blockers to leadership",
      "Representing Push at industry events, media opportunities, and partner meetings",
      "Hiring and managing the first NYC-based field team (3–5 people)",
    ],
    youShouldHave: [
      "8+ years in business development, market management, or general management",
      "Deep NYC hospitality and food & beverage network — this is non-negotiable",
      "Track record of building and growing local markets for a tech or local commerce company",
      "Strong operator mindset: you measure everything and move fast on data",
      "NYC resident with a genuine love for the city's food and culture scene",
    ],
    niceToHave: [
      "Experience at a delivery, reservation, or restaurant-tech platform",
      "Prior experience managing city-level P&L",
      "Background in local commerce or creator economy at the neighborhood level",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Significant equity — this role shapes the company",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "senior-ml-engineer-conversionoracle",
    title: "Senior ML Engineer — ConversionOracle v2",
    department: "Engineering",
    location: "NYC / Remote",
    type: "Full-time",
    compensation: "$180k – $230k + equity",
    aboutRole:
      "ConversionOracle is the model at the heart of Push — the system that predicts how many walk-in customers a campaign will deliver and then verifies each one in real time via a three-layer stack (QR + Claude Vision OCR + geo-match). You'll own v2: tighter walk-in prediction, lower false-positive rates on verification, and a feedback loop that gets sharper every neighborhood we enter. This is a Month-9 hire on the v5.1 plan — you'll inherit a working v1 and ship a version merchants feel immediately.",
    youllBe: [
      "Owning ConversionOracle prediction and verification models end-to-end",
      "Improving Claude Vision OCR pipelines for receipt extraction and geo reconciliation",
      "Designing the training data flywheel: how every verified scan sharpens the next prediction",
      "Shipping measurable wins against the Software Leverage Ratio 25 target by Month 12",
      "Collaborating tightly with the Attribution Data Engineer and Senior Full-stack Engineer",
    ],
    youShouldHave: [
      "5+ years in applied ML — ideally vision, NLP, or prediction on messy real-world data",
      "Hands-on experience shipping LLM pipelines (Claude, GPT-4o, or comparable) in production",
      "Strong Python and PyTorch (or JAX); comfortable reading production TypeScript",
      "Track record of shipping models where business metrics, not accuracy numbers, are what counts",
      "High ownership mindset — you'll often be the only ML person in the room",
    ],
    niceToHave: [
      "Experience with Claude Vision, GPT-4o Vision, or other multimodal OCR at scale",
      "Background in computer vision for receipts, documents, or retail imagery",
      "Prior work on verification, fraud, or attribution systems",
      "NYC-based and willing to spend time in Williamsburg cafes watching the product work",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Meaningful equity — ML is core IP",
      "Quarterly NYC offsite",
      "$1,500 home office stipend",
    ],
  },
  {
    slug: "neighborhood-lead-nyc-dense-expansion",
    title: "Neighborhood Lead — NYC Dense Expansion",
    department: "Growth",
    location: "NYC",
    type: "Full-time",
    compensation: "$95k – $130k + equity",
    aboutRole:
      "After the Williamsburg Coffee+ beachhead proves out, Push expands one dense neighborhood at a time — each one a repeatable Neighborhood Playbook unit. You'll be the human on the ground executing the next three: block-by-block merchant development, creator recruitment in the zip codes that matter, and the daily judgment calls that make a neighborhood tip from cold to self-sustaining. If you love New York as a lattice of micro-economies, this job was written for you.",
    youllBe: [
      "Running the Neighborhood Playbook for your assigned zones (think Park Slope, Bushwick, LES)",
      "Closing merchant Pilots door-by-door and upgrading them to retainer once ConversionOracle proves the model",
      "Recruiting T1–T3 creators who actually live and work in each neighborhood",
      "Measuring neighborhood health weekly — scans, retention, organic referrals — and flagging blockers early",
      "Feeding playbook improvements back to the GM NYC and the Growth team",
    ],
    youShouldHave: [
      "3+ years in field sales, local business development, or neighborhood-level ops",
      "NYC-native knowledge of at least two boroughs — block by block, not just neighborhood names",
      "Comfort walking into a coffee shop cold and earning trust in one conversation",
      "Strong operator instincts — you read a room and a spreadsheet equally well",
      "Unflappable in the face of a cold week (they happen in every zip code)",
    ],
    niceToHave: [
      "Prior experience at Toast, Resy, Yelp, DoorDash, or a hyperlocal startup",
      "Relationships inside NYC's independent coffee, bar, or restaurant scene",
      "Background in creator recruitment or local community building",
    ],
    whatWeOffer: [
      "100% health, dental, vision",
      "4 weeks PTO",
      "$3k learning budget",
      "Equity — early neighborhood leads shape the expansion playbook",
      "Quarterly NYC offsite (you'll likely be hosting it)",
      "$1,500 home office stipend",
    ],
  },
];

export const DEPARTMENTS: JobDepartment[] = [
  "Engineering",
  "Design",
  "Product",
  "Growth",
  "Ops",
];

export function getJobBySlug(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}

export function getJobsByDepartment(): Record<JobDepartment, Job[]> {
  return DEPARTMENTS.reduce(
    (acc, dept) => {
      acc[dept] = JOBS.filter((j) => j.department === dept);
      return acc;
    },
    {} as Record<JobDepartment, Job[]>,
  );
}
