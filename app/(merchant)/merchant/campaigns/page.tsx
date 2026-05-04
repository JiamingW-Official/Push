import { api } from '@/lib/data/api-client';
import type { Campaign } from '@/lib/data/types';
import CampaignsPageClient from './CampaignsPageClient';

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const result = await api.merchant.getCampaigns();
    return result.ok ? result.data : [];
  } catch {
    return [];
  }
}

export default async function CampaignsPage() {
  const initialCampaigns = await getCampaigns();

  return <CampaignsPageClient initialCampaigns={initialCampaigns} />;
}
