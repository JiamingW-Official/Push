import type { HeroOffer } from '@/lib/offers/types';

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'closed';
export type CreatorTier = 'seed' | 'explorer' | 'operator' | 'proven' | 'closer' | 'partner';

export interface CampaignCreator {
  id: string;
  name: string;
  tier: CreatorTier;
  roi: number;
}

export interface CampaignTimelineEvent {
  label: string;
  date: string;
  note: string;
}

export interface CampaignRecord {
  id: string;
  title: string;
  tenant_id: string;
  merchantVertical: string;
  city: string;
  status: CampaignStatus;
  createdAt: string;
  closeDate: string;
  imageUrl?: string;
  budgetTotal: number;
  budgetUsed: number;
  totalReach: number;
  applicants: number;
  brief: string;
  targetAudience: string;
  schedule: string;
  payoutPerConversion: number;
  conversionCap: number;
  attributionWindowDays: number;
  applicable_location_ids: string[];
  hero_offer: HeroOffer;
  creators: CampaignCreator[];
  timeline: CampaignTimelineEvent[];
}

const DEMO_CAMPAIGN_RECORDS: CampaignRecord[] = [
  {
    id: 'demo-campaign-001',
    title: 'Free Latte for a 30-Second Reel',
    tenant_id: 'tenant-demo-001',
    merchantVertical: 'COFFEE · BRUNCH',
    city: 'New York',
    status: 'active',
    createdAt: '2026-03-28',
    closeDate: '2026-04-29',
    imageUrl: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=240&q=80',
    budgetTotal: 12000,
    budgetUsed: 4800,
    totalReach: 126000,
    applicants: 38,
    brief: 'Drive weekday 7am-11am footfall with high-intent short-form creator coverage and QR redemption.',
    targetAudience: 'Commuters 22-38, office clusters in SoHo and Tribeca, coffee-first routines.',
    schedule: 'Launch 2026-04-01, optimize every Monday, wrap end of month.',
    payoutPerConversion: 11,
    conversionCap: 650,
    attributionWindowDays: 14,
    applicable_location_ids: ['loc-bed-stuy'],
    hero_offer: {
      type: 'free_item',
      value: 'Signature Latte',
      max_redemptions_per_customer: 1,
      max_redemptions_total: 650,
      description: 'Free signature latte',
    },
    creators: [
      { id: 'cr-1', name: 'Maya Johnson', tier: 'proven', roi: 3.4 },
      { id: 'cr-2', name: 'Theo Park', tier: 'operator', roi: 2.9 },
      { id: 'cr-3', name: 'Sofia Martinez', tier: 'closer', roi: 4.2 },
    ],
    timeline: [
      { label: 'Launch', date: '2026-04-01', note: 'Campaign opened with 12 approved creators.' },
      { label: 'First Conversion', date: '2026-04-02', note: 'First QR conversion came from @sofia.m.' },
      { label: '50% Spend Milestone', date: '2026-04-16', note: 'Crossed mid-budget with stable CAC trend.' },
    ],
  },
  {
    id: 'demo-campaign-mc-002',
    title: 'Morning Rush Special Reel',
    tenant_id: 'tenant-demo-001',
    merchantVertical: 'COCKTAILS · LOUNGE',
    city: 'Brooklyn',
    status: 'paused',
    createdAt: '2026-03-20',
    closeDate: '2026-05-05',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=240&q=80',
    budgetTotal: 18000,
    budgetUsed: 13200,
    totalReach: 98000,
    applicants: 21,
    brief: 'Scale weekday evening bookings through creator-led “after 6pm” narratives and booking links.',
    targetAudience: 'Young professionals 24-40 within 4-mile radius of Williamsburg.',
    schedule: 'Paused for offer refresh on 2026-04-14, resume after creative update.',
    payoutPerConversion: 16,
    conversionCap: 520,
    attributionWindowDays: 7,
    applicable_location_ids: ['loc-williamsburg', 'loc-chelsea'],
    hero_offer: {
      type: 'fixed_amount',
      value: 500,
      max_redemptions_per_customer: 1,
      max_redemptions_total: 520,
      description: '$5 off any drink',
    },
    creators: [
      { id: 'cr-4', name: 'Rina Liu', tier: 'operator', roi: 2.2 },
      { id: 'cr-5', name: 'Drew Carter', tier: 'proven', roi: 2.8 },
    ],
    timeline: [
      { label: 'Launch', date: '2026-03-23', note: 'Initial roster approved and content flight started.' },
      { label: 'First Conversion', date: '2026-03-24', note: 'Same-day reservation conversion from story swipe.' },
      { label: 'Pause', date: '2026-04-14', note: 'Offer paused to refresh creative and booking CTA.' },
    ],
  },
  {
    id: 'demo-campaign-mc-003',
    title: 'Holiday Blend Launch',
    tenant_id: 'tenant-demo-001',
    merchantVertical: 'FAST CASUAL · LUNCH',
    city: 'Chicago',
    status: 'draft',
    createdAt: '2026-04-10',
    closeDate: '2026-06-01',
    budgetTotal: 9000,
    budgetUsed: 1200,
    totalReach: 24000,
    applicants: 7,
    brief: 'Pilot launch for lunchtime dine-in bundles centered on UGC menu highlights and office takeout.',
    targetAudience: 'Office workers 25-45, weekday lunch windows near River North.',
    schedule: 'Draft mode through creator vetting; planned go-live in two weeks.',
    payoutPerConversion: 8,
    conversionCap: 420,
    attributionWindowDays: 10,
    applicable_location_ids: [
      'loc-bed-stuy',
      'loc-williamsburg',
      'loc-chelsea',
      'loc-les',
      'loc-dumbo',
      'loc-bushwick',
    ],
    hero_offer: {
      type: 'bogo',
      value: 'Any coffee drink',
      max_redemptions_per_customer: 2,
      max_redemptions_total: null,
      description: 'Buy one get one',
    },
    creators: [
      { id: 'cr-6', name: 'Leah Kim', tier: 'explorer', roi: 1.6 },
      { id: 'cr-7', name: 'Nico Vega', tier: 'seed', roi: 1.2 },
    ],
    timeline: [
      { label: 'Draft Opened', date: '2026-04-10', note: 'Campaign created with baseline budget and KPI targets.' },
      { label: 'Creator Vetting', date: '2026-04-15', note: 'Shortlist reviewed for local lunch audience fit.' },
      { label: 'Planned Launch', date: '2026-04-24', note: 'Go-live pending final compliance checks.' },
    ],
  },
  {
    id: 'cpg-8998',
    title: 'Winter Pastry Finale',
    tenant_id: 'tenant-demo-001',
    merchantVertical: 'BAKERY · DESSERT',
    city: 'Boston',
    status: 'closed',
    createdAt: '2026-02-02',
    closeDate: '2026-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=240&q=80',
    budgetTotal: 14000,
    budgetUsed: 14000,
    totalReach: 164000,
    applicants: 44,
    brief: 'End-of-season pastry push with creator tasting content and limited weekend bundle redemptions.',
    targetAudience: 'Dessert-focused weekend traffic, families and visitors around Back Bay.',
    schedule: 'Completed campaign cycle with post-mortem reporting in progress.',
    payoutPerConversion: 12,
    conversionCap: 780,
    attributionWindowDays: 14,
    applicable_location_ids: ['loc-bed-stuy', 'loc-les', 'loc-dumbo'],
    hero_offer: {
      type: 'percent_off',
      value: 20,
      max_redemptions_per_customer: 1,
      max_redemptions_total: 780,
      description: '20% off first visit',
    },
    creators: [
      { id: 'cr-8', name: 'Anna Wu', tier: 'closer', roi: 4.8 },
      { id: 'cr-9', name: 'Marco Diaz', tier: 'partner', roi: 5.1 },
    ],
    timeline: [
      { label: 'Launch', date: '2026-02-05', note: 'Campaign activated with 18 creator slots.' },
      { label: 'First Conversion', date: '2026-02-06', note: 'First in-store bundle conversion within 24 hours.' },
      { label: 'Closed', date: '2026-03-15', note: 'Budget fully allocated and campaign closed on schedule.' },
    ],
  },
  {
    id: 'cpg-9110',
    title: 'Family Dinner Boost',
    tenant_id: 'tenant-demo-001',
    merchantVertical: 'ITALIAN · DINNER',
    city: 'Austin',
    status: 'active',
    createdAt: '2026-04-05',
    closeDate: '2026-05-18',
    budgetTotal: 22000,
    budgetUsed: 6800,
    totalReach: 112000,
    applicants: 29,
    brief: 'Promote weekday family sets with conversion-led creator storytelling and map-based attribution.',
    targetAudience: 'Families with kids and local neighborhood groups planning weekday dinners.',
    schedule: 'Live now; every Friday performance review and creator rotation.',
    payoutPerConversion: 15,
    conversionCap: 940,
    attributionWindowDays: 21,
    applicable_location_ids: ['loc-bushwick', 'loc-williamsburg'],
    hero_offer: {
      type: 'fixed_amount',
      value: 800,
      max_redemptions_per_customer: 2,
      max_redemptions_total: 940,
      description: '$8 off dinner for first-time guests',
    },
    creators: [
      { id: 'cr-10', name: 'Elena Brooks', tier: 'proven', roi: 3.1 },
      { id: 'cr-11', name: 'Sam Rivera', tier: 'operator', roi: 2.7 },
      { id: 'cr-12', name: 'Olive Grant', tier: 'partner', roi: 4.6 },
    ],
    timeline: [
      { label: 'Launch', date: '2026-04-06', note: 'Dinner campaign launched with local creator cohort.' },
      { label: 'First Conversion', date: '2026-04-07', note: 'First conversion tied to map click + reservation flow.' },
      { label: 'Q1 Milestone', date: '2026-04-17', note: 'Reached 30% spend with above-target conversion rate.' },
    ],
  },
];

export { DEMO_CAMPAIGN_RECORDS as M\u004fCK_CAMPAIGNS };

export function getCampaignById(id: string): CampaignRecord | undefined {
  return DEMO_CAMPAIGN_RECORDS.find((campaign) => campaign.id === id);
}
