import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomePage from "@/components/home/HomePage";
import { plotFinderSchema } from "@/lib/seo";

const description =
  "Find a Kilifi plot with Inuka Afrika Properties. Open listings from KES 395,000 in Mariakani, Tezo, Bofa, Malindi, Msabaha and Mtondia.";

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
