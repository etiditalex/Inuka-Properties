import { Suspense } from "react";
import MarketResearchArchive from "@/components/market-research/MarketResearchArchive";

export default function MarketResearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MarketResearchArchive />
    </Suspense>
  );
}
