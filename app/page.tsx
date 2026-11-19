import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomePage from "@/components/home/HomePage";
import { HOME_HERO_DESKTOP, HOME_HERO_MOBILE } from "@/lib/images";
import { plotFinderSchema } from "@/lib/seo";
import { HOME_META_DESCRIPTION } from "@/lib/coastalSeo";

const description = HOME_META_DESCRIPTION;

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
  },
  twitter: {
    description,
  },
};

export default function Page() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={HOME_HERO_MOBILE}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HOME_HERO_DESKTOP}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <JsonLd data={plotFinderSchema} />
      <HomePage />
    </>
  );
}
