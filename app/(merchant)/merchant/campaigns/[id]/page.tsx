import { cookies } from 'next/headers';
import type { AttributionSummary } from '@/lib/data/api-client';
import type { Campaign } from '@/lib/data/types';
import CampaignDetailPageClient, { type CampaignDetailPageData } from './CampaignDetailPageClient';

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

type FetchResult<T> = {
  status: number;
  data: T | null;
};

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? '3931'}`;
}

async function fetchMerchantJson<T>(path: string): Promise<FetchResult<T>> {
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${getBaseUrl()}${path}`, {
    cache: 'no-store',
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!response.ok) {
    return { status: response.status, data: null };
  }

  return {
    status: response.status,
    data: (await response.json()) as T,
  };
}

function attributionFallback(): AttributionSummary {
  return {
    scans: 0,
    verified_customers: 0,
    revenue_attributed: 0,
    roi: 0,
    fraud_flags: 0,
    by_creator: [],
    by_location: [],
    by_day: [],
  };
}

async function getCampaignDetailPageData(id: string): Promise<CampaignDetailPageData> {
  const [campaignResult, attributionResult] = await Promise.all([
    fetchMerchantJson<Campaign>(`/api/merchant/campaigns/${id}`),
    fetchMerchantJson<AttributionSummary>(`/api/merchant/attribution/summary?campaignId=${id}`),
  ]);

  if (campaignResult.status === 404 || !campaignResult.data) {
    return {
      campaign: null,
      summary: attributionFallback(),
    };
  }

  return {
    campaign: campaignResult.data,
    summary: attributionResult.data ?? attributionFallback(),
  };
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const initialData = await getCampaignDetailPageData(id);

  return <CampaignDetailPageClient initialData={initialData} />;
}
