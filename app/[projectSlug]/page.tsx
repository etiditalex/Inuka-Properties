import { notFound } from "next/navigation";
import PropertyDetailPage from "../for-sale/[id]/page";
import { getPropertySeoBySlug } from "@/lib/propertySeo";

type Props = {
  params: { projectSlug: string };
};

export default function FeaturedProjectPage({ params }: Props) {
  const property = getPropertySeoBySlug(params.projectSlug);
  if (!property) notFound();

  return <PropertyDetailPage params={{ id: String(property.id) }} />;
}
