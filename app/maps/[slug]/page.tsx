import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlotExplorer from "@/components/maps/PlotExplorer";
import { loadPublishedPlotMap } from "@/lib/maps/repository";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loaded = await loadPublishedPlotMap(params.slug);
  if (!loaded) return { title: "Plot map" };
  const georeferenced = loaded.document.alignmentStatus === "verified";
  return buildPageMetadata({
    title: `${loaded.document.projectName} plot map`,
    description: georeferenced
      ? `Interactive satellite plot map for ${loaded.document.projectName}, ${loaded.document.location}.`
      : `Subdivision plan for ${loaded.document.projectName}${loaded.document.surveyRef ? `, ${loaded.document.surveyRef}` : ""}. Plot corners are not georeferenced onto satellite imagery yet.`,
    path: `/maps/${loaded.document.slug}`,
  });
}

export default async function PlotMapPage({ params }: PageProps) {
  const loaded = await loadPublishedPlotMap(params.slug);
  if (!loaded) notFound();
  return (
    <div className="h-[100dvh] pt-24">
      <PlotExplorer initial={loaded.document} variant="page" />
    </div>
  );
}
