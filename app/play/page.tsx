import PlayExperience from "@/components/play/PlayExperience";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Daily coast games",
  description: "Clear a daily Sudoku, word game or coast quiz on Inuka Properties and unlock the Tulivu Haven offer.",
  path: "/play",
});

export default function PlayPage() {
  return <PlayExperience />;
}
