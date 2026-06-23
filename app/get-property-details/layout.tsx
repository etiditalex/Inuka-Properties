import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Property Details | Inuka Afrika Properties",
  description: "Request property details and receive project information by email.",
  robots: { index: false, follow: false },
};

export default function GetPropertyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
