import type { Metadata } from "next";
import ProjectShowcaseStyles from "@/components/ProjectShowcaseStyles";

export const metadata: Metadata = {
  title: "Project Showcase | Inuka Afrika Properties",
  description: "Full-screen project showcase for TV display",
};

export default function ProjectShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProjectShowcaseStyles />
      {children}
    </>
  );
}

