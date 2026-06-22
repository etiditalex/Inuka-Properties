"use client";

import { Suspense, useMemo } from "react";
import BlogsHeroCarousel from "@/components/blog/BlogsHeroCarousel";
import BlogsArchiveMain from "@/components/blog/BlogsArchiveMain";
import BlogsArchiveSidebar from "@/components/blog/BlogsArchiveSidebar";
import { useBlogPosts } from "@/lib/blog/useBlogPosts";

function BlogsArchiveMainFallback() {
  return (
    <div className="space-y-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="mb-10 h-4 max-w-xl animate-pulse rounded bg-neutral-200" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-5 sm:flex-row"
        >
          <div className="h-44 w-full shrink-0 rounded bg-neutral-200 sm:w-52" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-6 w-full max-w-md rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full max-w-lg rounded bg-neutral-200" />
            <div className="mt-6 h-px w-full bg-neutral-100" />
            <div className="flex gap-6">
              <div className="h-4 w-20 rounded bg-neutral-200" />
              <div className="h-4 w-12 rounded bg-neutral-200" />
              <div className="h-4 w-24 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogsPage() {
  const { posts: carouselPosts } = useBlogPosts();
  const sortedPosts = useMemo(
    () => [...carouselPosts].sort((a, b) => b.date.localeCompare(a.date)),
    [carouselPosts]
  );

  return (
    <div className="pb-20 font-montserrat">
      <h1 className="sr-only">
        Blogs — expert property insights from Inuka Afrika Properties
      </h1>
      <BlogsHeroCarousel posts={sortedPosts} />

      <section className="bg-neutral-100 py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <Suspense fallback={<BlogsArchiveMainFallback />}>
              <BlogsArchiveMain />
            </Suspense>
            <BlogsArchiveSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
