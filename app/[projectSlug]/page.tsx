import { notFound } from "next/navigation";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import { fetchPropertyDetail } from "@/lib/properties/getProperties";
import { getPropertySeoBySlug } from "@/lib/propertySeo";

export const revalidate = 1800;

type Props = {
  params: { projectSlug: string };
};

export default async function FeaturedProjectPage({ params }: Props) {
  const seo = getPropertySeoBySlug(params.projectSlug);
  if (!seo) notFound();

  const property = await fetchPropertyDetail(seo.id);
  if (!property) notFound();

  return <PropertyDetailView propertyId={seo.id} initialProperty={property} />;
}
