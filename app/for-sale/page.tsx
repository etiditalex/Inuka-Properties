import ForSaleListings from "@/components/property/ForSaleListings";
import { fetchPublishedProperties } from "@/lib/properties/getProperties";

export const revalidate = 1800;

export default async function ForSalePage() {
  const properties = await fetchPublishedProperties().catch(() => []);
  return <ForSaleListings initialProperties={properties} />;
}
