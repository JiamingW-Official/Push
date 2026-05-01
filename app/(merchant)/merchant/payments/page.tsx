import { api } from '@/lib/data/api-client';
import PaymentsClient from './PaymentsClient';

export default async function MerchantPaymentsPage() {
  const res = await api.merchant.payments();
  const payments = res.ok ? res.data : [];

  return <PaymentsClient initialPayments={payments} />;
}
