import { api } from '@/lib/data/api-client';
import LocationsPageClient from './LocationsPageClient';

export default async function LocationsPage() {
  const locations = await api.merchant.getLocations();

  return <LocationsPageClient locations={locations} />;
}
