import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import PropertyDetailLayout, {
  generateMetadata as generatePropertyMetadata,
} from "../for-sale/[id]/layout";
import {
  PROPERTY_SEO,
  getPropertySeoBySlug,
} from "@/lib/propertySeo";

type Props = {
  children: ReactNode;
  params: { projectSlug: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPERTY_SEO.filter((property) => property.slug).map((property) => ({
    projectSlug: property.slug as string,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = getPropertySeoBySlug(params.projectSlug);
  if (!property) {
    return { title: "Property Not Found" };
  }
  return generatePropertyMetadata({
    children: null,
    params: { id: String(property.id) },
  });
}

export default function FeaturedProjectLayout({ children, params }: Props) {
  const property = getPropertySeoBySlug(params.projectSlug);
  if (!property) notFound();

  return (
    <PropertyDetailLayout params={{ id: String(property.id) }}>
      {children}
    </PropertyDetailLayout>
  );
}
