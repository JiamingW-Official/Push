/**
 * Push — Demo Data Seed
 *
 * Populates a Supabase project with deterministic demo rows for the admin /
 * creator / customer / merchant dashboards. Runs with the service-role key
 * so it bypasses RLS. Safe to re-run: every insert is an upsert on the real
 * UNIQUE constraint from the migrations.
 *
 * Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 *
 * Dependency order (matches FK graph):
 *   auth.users (admin.createUser)
 *     → public.users (handle_new_user trigger)
 *     → merchants | creators
 *       → creator_recruitment_funnel
 *       → loyalty_cards
 *       → verified_customer_claims
 *       → merchant_metrics_weekly
 *     → ai_accuracy_audits (standalone)
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

// ---------------------------------------------------------------------------
// Env + client
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = "DemoPush2026!";
const STAMP_REDEMPTION_FEE = 12.5; // USD per verified claim — matches weekly-report math

// ---------------------------------------------------------------------------
// Demo merchants (5)
// ---------------------------------------------------------------------------

interface DemoMerchant {
  id: string;
  business_name: string;
  address: string;
  lat: number;
  lng: number;
  contact_email: string;
  pricing_tier:
    | "legacy_starter"
    | "legacy_growth"
    | "legacy_scale"
    | "v5_pilot"
    | "v5_performance";
}

const merchants: DemoMerchant[] = [
  {
    id: randomUUID(),
    business_name: "Coffee Plus Downtown",
    address: "Williamsburg, Brooklyn, NY",
    lat: 40.7128,
    lng: -74.006,
    contact_email: "demo+merchant1@push.local",
    pricing_tier: "v5_pilot",
  },
  {
    id: randomUUID(),
    business_name: "Bagel Bakery Williamsburg",
    address: "Williamsburg, Brooklyn, NY",
    lat: 40.715,
    lng: -74.005,
    contact_email: "demo+merchant2@push.local",
    pricing_tier: "v5_pilot",
  },
  {
    id: randomUUID(),
    business_name: "Pasta Kitchen East",
    address: "East Village, Manhattan, NY",
    lat: 40.728,
    lng: -73.985,
    contact_email: "demo+merchant3@push.local",
    pricing_tier: "legacy_growth",
  },
  {
    id: randomUUID(),
    business_name: "Pizza House",
    address: "Lower East Side, Manhattan, NY",
    lat: 40.72,
    lng: -73.988,
    contact_email: "demo+merchant4@push.local",
    pricing_tier: "legacy_starter",
  },
  {
    id: randomUUID(),
    business_name: "Sushi Spot Astoria",
    address: "Astoria, Queens, NY",
    lat: 40.7614,
    lng: -73.9776,
    contact_email: "demo+merchant5@push.local",
    pricing_tier: "v5_performance",
  },
];

// ---------------------------------------------------------------------------
// Demo creators (10)
// ---------------------------------------------------------------------------

interface DemoCreator {
  id: string;
  name: string;
  email: string;
  location: string;
  lat: number;
  lng: number;
  tier: "seed" | "explorer" | "operator" | "proven" | "closer" | "partner";
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  funnel_tier: 1 | 2 | 3;
  funnel_status: "prospect" | "early_operator" | "active" | "churn";
  funnel_source: "direct_network" | "community" | "incentive";
  funnel_performance: number; // 0..1
  funnel_signed_date: string | null;
}

const creators: DemoCreator[] = [
  {
    id: randomUUID(),
    name: "Alex",
    email: "demo+creator1@push.local",
    location: "Brooklyn, NY",
    lat: 40.714,
    lng: -74.002,
    tier: "proven",
    push_score: 88,
    campaigns_completed: 12,
    campaigns_accepted: 14,
    funnel_tier: 3,
    funnel_status: "active",
    funnel_source: "direct_network",
    funnel_performance: 0.95,
    funnel_signed_date: "2026-02-01T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Lucy",
    email: "demo+creator2@push.local",
    location: "Brooklyn, NY",
    lat: 40.716,
    lng: -74.004,
    tier: "operator",
    push_score: 80,
    campaigns_completed: 8,
    campaigns_accepted: 10,
    funnel_tier: 2,
    funnel_status: "active",
    funnel_source: "community",
    funnel_performance: 0.92,
    funnel_signed_date: "2026-02-15T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Marcus",
    email: "demo+creator3@push.local",
    location: "Manhattan, NY",
    lat: 40.727,
    lng: -73.984,
    tier: "proven",
    push_score: 82,
    campaigns_completed: 10,
    campaigns_accepted: 12,
    funnel_tier: 3,
    funnel_status: "active",
    funnel_source: "incentive",
    funnel_performance: 0.88,
    funnel_signed_date: "2026-02-10T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Jessica",
    email: "demo+creator4@push.local",
    location: "Manhattan, NY",
    lat: 40.721,
    lng: -73.989,
    tier: "operator",
    push_score: 75,
    campaigns_completed: 6,
    campaigns_accepted: 9,
    funnel_tier: 2,
    funnel_status: "active",
    funnel_source: "direct_network",
    funnel_performance: 0.85,
    funnel_signed_date: "2026-02-20T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Daniel",
    email: "demo+creator5@push.local",
    location: "Queens, NY",
    lat: 40.76,
    lng: -73.978,
    tier: "explorer",
    push_score: 62,
    campaigns_completed: 2,
    campaigns_accepted: 4,
    funnel_tier: 1,
    funnel_status: "early_operator",
    funnel_source: "community",
    funnel_performance: 0.72,
    funnel_signed_date: "2026-03-01T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Emma",
    email: "demo+creator6@push.local",
    location: "Brooklyn, NY",
    lat: 40.713,
    lng: -74.0,
    tier: "closer",
    push_score: 91,
    campaigns_completed: 18,
    campaigns_accepted: 20,
    funnel_tier: 3,
    funnel_status: "active",
    funnel_source: "direct_network",
    funnel_performance: 0.9,
    funnel_signed_date: "2026-01-20T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "James",
    email: "demo+creator7@push.local",
    location: "Manhattan, NY",
    lat: 40.725,
    lng: -73.99,
    tier: "operator",
    push_score: 70,
    campaigns_completed: 5,
    campaigns_accepted: 7,
    funnel_tier: 2,
    funnel_status: "active",
    funnel_source: "community",
    funnel_performance: 0.81,
    funnel_signed_date: "2026-02-25T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Sophie",
    email: "demo+creator8@push.local",
    location: "Queens, NY",
    lat: 40.762,
    lng: -73.976,
    tier: "seed",
    push_score: 50,
    campaigns_completed: 0,
    campaigns_accepted: 0,
    funnel_tier: 1,
    funnel_status: "prospect",
    funnel_source: "incentive",
    funnel_performance: 0.5,
    funnel_signed_date: null,
  },
  {
    id: randomUUID(),
    name: "Chris",
    email: "demo+creator9@push.local",
    location: "Brooklyn, NY",
    lat: 40.717,
    lng: -74.003,
    tier: "operator",
    push_score: 68,
    campaigns_completed: 4,
    campaigns_accepted: 6,
    funnel_tier: 2,
    funnel_status: "active",
    funnel_source: "direct_network",
    funnel_performance: 0.78,
    funnel_signed_date: "2026-02-05T00:00:00.000Z",
  },
  {
    id: randomUUID(),
    name: "Olivia",
    email: "demo+creator10@push.local",
    location: "Manhattan, NY",
    lat: 40.726,
    lng: -73.987,
    tier: "proven",
    push_score: 85,
    campaigns_completed: 11,
    campaigns_accepted: 13,
    funnel_tier: 3,
    funnel_status: "active",
    funnel_source: "community",
    funnel_performance: 0.87,
    funnel_signed_date: "2026-01-25T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Generated demo rows — built from the merchant / creator arrays above
// ---------------------------------------------------------------------------

const LOYALTY_CARD_COUNT = 15;
const CLAIM_COUNT = 20;
const WEEKLY_REPORT_WEEKS = ["2026-04-13", "2026-04-06"]; // Mondays — 2 weeks x 5 merchants = 10

const loyaltyCards = Array.from({ length: LOYALTY_CARD_COUNT }, (_, i) => {
  const merchant = merchants[i % merchants.length];
  const creator = creators[i % creators.length];
  const stamps = (i % 10) + 1;
  return {
    customer_id: randomUUID(),
    creator_id: creator.id,
    merchant_id: merchant.id,
    stamp_count: stamps,
    max_stamps: 10,
    redeemed_at:
      stamps >= 10
        ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        : null,
  };
});

const CLAIM_DECISIONS = [
  "auto_verified",
  "manual_review_required",
  "rejected",
] as const;

const verifiedClaims = Array.from({ length: CLAIM_COUNT }, (_, i) => {
  const merchant = merchants[i % merchants.length];
  const creator = creators[i % creators.length];
  const decision = CLAIM_DECISIONS[i % CLAIM_DECISIONS.length];
  const confidence =
    decision === "auto_verified"
      ? 0.9 + (i % 5) * 0.01
      : decision === "manual_review_required"
        ? 0.55 + (i % 5) * 0.02
        : 0.2 + (i % 5) * 0.03;
  const manualStatus =
    decision === "manual_review_required"
      ? i % 2 === 0
        ? "approved"
        : "rejected"
      : null;
  return {
    merchant_id: merchant.id,
    creator_id: creator.id,
    customer_name: `Customer #${i + 1}`,
    photo_url: `https://picsum.photos/seed/claim-photo-${i}/400`,
    receipt_url: `https://picsum.photos/seed/claim-receipt-${i}/400`,
    customer_lat: merchant.lat + ((i % 10) - 5) * 0.0002,
    customer_lon: merchant.lng + ((i % 10) - 5) * 0.0002,
    ai_confidence_score: Number(confidence.toFixed(3)),
    ai_decision: decision,
    manual_review_status: manualStatus,
    verified_at: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
  };
});

const weeklyReports = WEEKLY_REPORT_WEEKS.flatMap((weekStart) =>
  merchants.map((merchant, i) => {
    const verified = 12 + (i % 5) * 6; // 12..36 deterministic
    const revenue = Number((verified * STAMP_REDEMPTION_FEE).toFixed(2));
    const cost = 150; // placeholder tooling cost
    const roi = Number((((revenue - cost) / cost) * 100).toFixed(2));
    const weekEnd = addDaysIso(weekStart, 7);
    return {
      merchant_id: merchant.id,
      week_start: weekStart,
      week_end: weekEnd,
      verified_customers: verified,
      total_revenue: revenue,
      roi,
      creator_count: 3 + (i % 3),
      average_transaction: Number((revenue / verified).toFixed(2)),
    };
  }),
);

// Standalone weekly AI accuracy rollup (one row per ISO week — week_number UNIQUE)
const aiAccuracyAudits = [
  buildAudit(15, 120, 3, 2),
  buildAudit(14, 104, 4, 1),
  buildAudit(13, 98, 2, 3),
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addDaysIso(dateIso: string, days: number): string {
  const d = new Date(`${dateIso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildAudit(
  week: number,
  autoVerified: number,
  falsePositives: number,
  falseNegatives: number,
) {
  const fpRate = Number(((falsePositives / autoVerified) * 100).toFixed(2));
  const fnRate = Number(((falseNegatives / autoVerified) * 100).toFixed(2));
  return {
    week_number: week,
    total_auto_verified: autoVerified,
    false_positive_count: falsePositives,
    false_negative_count: falseNegatives,
    false_positive_rate: fpRate,
    false_negative_rate: fnRate,
    manual_approved: 6,
    manual_rejected: 2,
    creator_appeals: 1,
    average_confidence: 0.87,
    audit_date: new Date().toISOString(),
    notes: `Week ${week} automated rollup (demo seed).`,
  };
}

function die(step: string, error: unknown): never {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  console.error(`[seed] FAILED at step: ${step}\n  reason: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Auth user provisioning
// Creates (or re-uses) one auth.users row per demo account and returns its id.
// The handle_new_user trigger mirrors each row into public.users with the
// requested role, so no direct public.users insert is needed.
// ---------------------------------------------------------------------------

async function ensureAuthUser(
  email: string,
  role: "creator" | "merchant",
  targetId: string,
): Promise<string> {
  // Fast path — look up by email across pages. admin.listUsers has no filter.
  // 10 demo merchants + creators, so page 1 of 1000 is always sufficient.
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) die(`listUsers(${role})`, listError);

  const existing = list?.users.find((u) => u.email === email);
  if (existing) return existing.id;

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { role },
    });
  if (createError || !created?.user) die(`createUser(${role})`, createError);

  // We don't get to pick the auth.users UUID — capture the real one the
  // trigger mirrored into public.users. targetId becomes irrelevant; the
  // caller must use the returned id for all downstream FK writes.
  void targetId;
  return created.user.id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("[seed] starting demo data seed");

  // 1. Auth users → capture real public.users ids
  console.log("[seed] provisioning auth users (merchants)");
  for (const m of merchants) {
    const userId = await ensureAuthUser(m.contact_email, "merchant", m.id);
    m.id = userId; // temporary reassignment; merchants.id is set on insert below
  }

  console.log("[seed] provisioning auth users (creators)");
  for (const c of creators) {
    const userId = await ensureAuthUser(c.email, "creator", c.id);
    c.id = userId;
  }

  // At this point m.id / c.id hold the auth.users UUID. The merchants /
  // creators tables have their own gen_random_uuid() PK; we let the DB
  // generate it and key all downstream inserts off the returned row.

  // 2. Merchants (PK generated by DB; we supply user_id from step 1)
  console.log("[seed] upserting 5 merchants");
  const merchantIdByUserId = new Map<string, string>();
  for (const m of merchants) {
    const { data, error } = await supabase
      .from("merchants")
      .upsert(
        {
          user_id: m.id,
          business_name: m.business_name,
          address: m.address,
          lat: m.lat,
          lng: m.lng,
          contact_email: m.contact_email,
          pricing_tier: m.pricing_tier,
        },
        { onConflict: "user_id" },
      )
      .select("id, user_id")
      .single();
    if (error || !data) die(`merchants/${m.business_name}`, error);
    merchantIdByUserId.set(m.id, data.id);
    m.id = data.id; // swap in the real merchants.id for downstream use
  }

  // 3. Creators
  console.log("[seed] upserting 10 creators");
  const creatorIdByUserId = new Map<string, string>();
  for (const c of creators) {
    const { data, error } = await supabase
      .from("creators")
      .upsert(
        {
          user_id: c.id,
          name: c.name,
          location: c.location,
          lat: c.lat,
          lng: c.lng,
          tier: c.tier,
          push_score: c.push_score,
          campaigns_completed: c.campaigns_completed,
          campaigns_accepted: c.campaigns_accepted,
          is_active: true,
        },
        { onConflict: "user_id" },
      )
      .select("id, user_id")
      .single();
    if (error || !data) die(`creators/${c.name}`, error);
    creatorIdByUserId.set(c.id, data.id);
    c.id = data.id; // swap in real creators.id
  }

  // 4. creator_recruitment_funnel (one row per creator, UNIQUE creator_id)
  console.log("[seed] upserting 10 recruitment-funnel rows");
  for (const c of creators) {
    const { error } = await supabase.from("creator_recruitment_funnel").upsert(
      {
        creator_id: c.id,
        tier: c.funnel_tier,
        status: c.funnel_status,
        recruitment_source: c.funnel_source,
        signed_date: c.funnel_signed_date,
        performance_score: c.funnel_performance,
      },
      { onConflict: "creator_id" },
    );
    if (error) die(`creator_recruitment_funnel/${c.name}`, error);
  }

  // 5. loyalty_cards — UNIQUE(customer_id, merchant_id)
  console.log(`[seed] upserting ${loyaltyCards.length} loyalty cards`);
  for (const card of loyaltyCards) {
    const { error } = await supabase
      .from("loyalty_cards")
      .upsert(card, { onConflict: "customer_id,merchant_id" });
    if (error) die(`loyalty_cards/${card.customer_id}`, error);
  }

  // 6. verified_customer_claims — no UNIQUE key, so plain insert (idempotent
  //    seeds usually don't need re-running, but we tag demo rows so a manual
  //    DELETE can target them if needed).
  console.log(`[seed] inserting ${verifiedClaims.length} verified claims`);
  const { error: claimError } = await supabase
    .from("verified_customer_claims")
    .insert(verifiedClaims);
  if (claimError) die("verified_customer_claims", claimError);

  // 7. merchant_metrics_weekly — UNIQUE(merchant_id, week_start)
  console.log(`[seed] upserting ${weeklyReports.length} weekly reports`);
  for (const report of weeklyReports) {
    const { error } = await supabase
      .from("merchant_metrics_weekly")
      .upsert(report, { onConflict: "merchant_id,week_start" });
    if (error) die(`merchant_metrics_weekly/${report.merchant_id}`, error);
  }

  // 8. ai_accuracy_audits — UNIQUE(week_number)
  console.log(`[seed] upserting ${aiAccuracyAudits.length} ai-accuracy audits`);
  for (const audit of aiAccuracyAudits) {
    const { error } = await supabase
      .from("ai_accuracy_audits")
      .upsert(audit, { onConflict: "week_number" });
    if (error) die(`ai_accuracy_audits/week-${audit.week_number}`, error);
  }

  console.log("[seed] done");
  console.log(
    `[seed] demo merchants=${merchants.length} creators=${creators.length} cards=${loyaltyCards.length} claims=${verifiedClaims.length} reports=${weeklyReports.length} audits=${aiAccuracyAudits.length}`,
  );
  console.log(
    "[seed] demo logins use password from DEMO_PASSWORD constant (see source)",
  );
}

main().catch((e) => die("main", e));
