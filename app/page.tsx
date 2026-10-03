import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomePage from "@/components/home/HomePage";
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
      <JsonLd data={plotFinderSchema} />
      <HomePage />
    </>
  );
}
