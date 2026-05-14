"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPostListItem } from "@/lib/blogPosts";
import { formatBlogDateCarousel } from "@/lib/blogPosts";

type Props = {
  posts: BlogPostListItem[];
};

function postHref(slug: string) {
  return `/iapl-insider/blogs/${slug}`;
}

export default function BlogsHeroCarousel({ posts }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollStep = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 1;
    const w = (card?.offsetWidth ?? 320) + gap;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * w,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      className="relative bg-neutral-950 font-montserrat"
      aria-label="Featured blog posts"
    >
      <button
        type="button"
        onClick={() => scrollStep(-1)}
        className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-neutral-700 bg-white text-neutral-900 shadow-md transition hover:bg-neutral-100 md:flex lg:left-4"
        aria-label="Previous posts"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scrollStep(1)}
        className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-neutral-700 bg-white text-neutral-900 shadow-md transition hover:bg-neutral-100 md:flex lg:right-4"
        aria-label="Next posts"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-px overflow-x-auto scroll-smooth px-3 py-6 pb-8 pt-24 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-4 md:px-6 md:pb-10 md:pt-28 lg:snap-x lg:snap-mandatory [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={postHref(post.slug)}
            data-carousel-card
            className="group relative h-[min(52vh,480px)] min-h-[380px] w-[min(88vw,340px)] shrink-0 snap-center snap-always overflow-hidden bg-neutral-900 sm:w-[min(78vw,380px)] md:h-[min(56vh,520px)] md:min-h-[420px] md:w-[min(46vw,420px)] lg:h-[520px] lg:w-[min(calc(33.333vw-12px),400px)] xl:w-[min(calc(33.333vw-16px),440px)]"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-105"
              sizes="(max-width:768px) 88vw, (max-width:1024px) 46vw, 33vw"
              priority={post.id === posts[0]?.id}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 text-left text-white md:p-7 lg:p-8">
              <span className="font-blogScript text-2xl leading-none text-white md:text-3xl lg:text-[2rem]">
                Blogs
              </span>
              <span className="mt-3 line-clamp-4 text-xl font-bold leading-snug tracking-tight text-white md:text-2xl lg:text-[1.65rem] lg:leading-tight">
                {post.title}
              </span>
              <span className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/85 md:text-xs">
                {formatBlogDateCarousel(post.date)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-5 text-center">
        <p className="text-sm text-neutral-400 md:text-base">
          Inuka Afrika Properties — insights on{" "}
          <span className="text-neutral-200">
            land, coastal growth &amp; smart buying in Kenya
          </span>
        </p>
      </div>

      <div className="flex justify-center gap-3 border-t border-neutral-800 py-3 md:hidden">
        <button
          type="button"
          onClick={() => scrollStep(-1)}
          className="flex h-10 w-10 items-center justify-center border border-neutral-600 bg-white text-neutral-900"
          aria-label="Previous posts"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollStep(1)}
          className="flex h-10 w-10 items-center justify-center border border-neutral-600 bg-white text-neutral-900"
          aria-label="Next posts"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
