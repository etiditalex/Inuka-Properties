import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Gallery | Inuka Afrika Properties",
  description: "Watch our collection of videos showcasing Inuka Afrika Properties' projects, properties, and company highlights. Explore our real estate portfolio through engaging video content.",
  keywords: [
    "Inuka Afrika Properties videos",
    "property videos Kenya",
    "real estate videos",
    "property showcase videos",
    "Kilifi property videos",
    "Mariakani property videos",
    "Mtwapa property videos",
  ],
};

export default function VideoGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


