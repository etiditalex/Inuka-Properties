import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FacebookLandingPage from "@/components/landing/FacebookLandingPage";
import {
  fetchLandingTestimonials,
  fetchPublishedLandingPage,
} from "@/lib/landing-pages/getLandingPage";
import { landingPagePath } from "@/lib/landing-pages/path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await fetchPublishedLandingPage(params.slug);
  if (!page) {
    return { title: "Landing page", robots: { index: false, follow: false } };
  }

  const title = page.headline || page.name;
  const description = page.subheadline || `Get details for ${page.name} from Inuka Afrika Properties.`;
  const image = page.hero_image || page.properties?.image;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: landingPagePath(page.slug),
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function PublicLandingPage({ params }: Props) {
  const page = await fetchPublishedLandingPage(params.slug);
  if (!page) notFound();

  const testimonials = page.show_testimonials ? await fetchLandingTestimonials() : [];

  return (
    <FacebookLandingPage
      page={page}
      property={page.properties}
      testimonials={testimonials}
    />
  );
}
