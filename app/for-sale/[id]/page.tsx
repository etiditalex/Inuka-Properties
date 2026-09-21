import { notFound } from "next/navigation";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import { fetchPropertyDetail } from "@/lib/properties/getProperties";

export const revalidate = 1800;
export const dynamicParams = true;

type Props = {
  params: { id: string };
};

export default async function PropertyDetailPage({ params }: Props) {
  const propertyId = parseInt(params.id, 10);
  if (Number.isNaN(propertyId)) notFound();

  const property = await fetchPropertyDetail(propertyId);
  if (!property) notFound();

  return <PropertyDetailView propertyId={propertyId} initialProperty={property} />;
}
