import { api } from '@/lib/data/api-client';
import QRCodesClient from './QRCodesClient';

async function getInitialQRs() {
  return api.merchant.qrCodes.list({ status: 'all' });
}

export default async function MerchantQRCodesPage() {
  const initialQRs = await getInitialQRs();

  return <QRCodesClient initialQRs={initialQRs} />;
}
