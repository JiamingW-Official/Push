import { api } from '@/lib/data/api-client';
import type { MockApplication } from '@/lib/data/mock-applications';
import ApplicantsPageClient from './ApplicantsPageClient';

async function getApplicants(): Promise<MockApplication[]> {
  try {
    const result = await api.merchant.getApplicants({ page: 1, limit: 200 });
    return result.data;
  } catch {
    return [];
  }
}

export default async function MerchantApplicantsPage() {
  const initialApplicants = await getApplicants();

  return <ApplicantsPageClient initialApplicants={initialApplicants} />;
}
