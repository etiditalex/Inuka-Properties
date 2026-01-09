import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate | Inuka Afrika Properties",
  description: "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya. Expert insights from Inuka Afrika Properties.",
  keywords: [
    "land investment",
    "real estate investment Kenya",
    "land for sale Kenya",
    "property investment",
    "land investment benefits",
    "real estate investment guide",
    "land investment opportunities",
    "property investment Kenya",
    "land investment strategy",
    "real estate wealth building"
  ],
};

export default function WhyLandInvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

