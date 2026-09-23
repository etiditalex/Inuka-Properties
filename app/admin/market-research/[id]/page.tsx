"use client";

import BlogFormPage from "../../blogs/BlogForm";

export default function EditMarketResearchPage({ params }: { params: { id: string } }) {
  return <BlogFormPage section="market-research" postId={parseInt(params.id, 10)} />;
}
