import ProjectShowcaseStyles from "@/components/ProjectShowcaseStyles";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Coastal project showcase",
  description: "Full-screen showcase of Inuka Properties plots currently selling on the Kenya coast.",
  path: "/project-showcase",
});

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

