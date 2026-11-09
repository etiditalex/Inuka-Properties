import type { Metadata } from "next";
import PlayExperience from "@/components/play/PlayExperience";

export const metadata: Metadata = {
  title: "Take a break and play",
  description: "Clear a daily Sudoku, word game or coast quiz on Inuka Properties and unlock the Tulivu Haven offer.",
};

export default function PlayPage() {
  return <PlayExperience />;
}
