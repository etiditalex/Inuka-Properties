"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Calendar, ChevronRight, User } from "lucide-react";
import {
  formatIsoDate,
  formatLongDateFromIso,
  getSidebarArticlePosts,
} from "@/lib/blogPosts";
import { SITE_ORIGIN } from "@/lib/site";

export type BlogArticleLayoutProps = {
  currentSlug: string;
  /** Used for share links and fallbacks when `heroTitle` is omitted */
  title: string;
  /** Shorter line for the hero H1 when the SEO title is long */
  heroTitle?: string;
  heroImage: string;
  heroImageAlt: string;
  category: string;
  author: string;
  /** ISO yyyy-mm-dd */
  publishedIso: string;
  articleSchema: Record<string, unknown>;
  metaExtra?: ReactNode;
  children: ReactNode;
};

export default function BlogArticleLayout({
  currentSlug,
  title,
  heroTitle,
  heroImage,
  heroImageAlt,
  category,
  author,
  publishedIso,
  articleSchema,
  metaExtra,
  children,
}: BlogArticleLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchDraft, setSearchDraft] = useState("");

  const pageUrl = `${SITE_ORIGIN}${pathname ?? ""}`;
  const encodedUrl = useMemo(() => encodeURIComponent(pageUrl), [pageUrl]);
  const displayTitle = heroTitle ?? title;
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);

  const shareLinks = useMemo(
    () => [
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        className: "bg-[#25D366] hover:opacity-90",
      },
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        className: "bg-[#1877F2] hover:opacity-90",
      },
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        className: "bg-neutral-900 hover:opacity-90",
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        className: "bg-[#0A66C2] hover:opacity-90",
      },
    ],
    [encodedTitle, encodedUrl]
  );

  const sidebarPosts = getSidebarArticlePosts(currentSlug);

  const dateShort = formatIsoDate(publishedIso);
  const dateLong = formatLongDateFromIso(publishedIso);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDraft.trim();
    const href = q
      ? `/iapl-insider/blogs?q=${encodeURIComponent(q)}`
      : "/iapl-insider/blogs";
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-20 font-montserrat md:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="relative min-h-[320px] md:min-h-[440px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/35" />
        <div className="relative z-10 flex min-h-[320px] md:min-h-[440px] flex-col justify-end px-4 pb-10 pt-28 md:px-10 md:pb-14 lg:px-16">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {displayTitle}
            </h1>
            <nav
              className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="text-white/50" aria-hidden>
                /
              </span>
              <Link href="/iapl-insider/blogs" className="hover:text-white">
                Blogs
              </Link>
              <span className="text-white/50" aria-hidden>
                /
              </span>
              <span className="text-primary-200">{category}</span>
              <span className="text-white/50" aria-hidden>
                /
              </span>
              <span className="rounded bg-black/45 px-2 py-0.5 text-primary-100">
                {displayTitle.length > 48
                  ? `${displayTitle.slice(0, 48)}…`
                  : displayTitle}
              </span>
            </nav>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <main className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
            <Link
              href="/iapl-insider/blogs"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft size={18} />
              Back to blogs
            </Link>
            <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-secondary-700">
              {category}
            </p>

            <p className="text-sm font-medium text-primary-600">{dateLong}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-neutral-200 pb-6 text-sm text-neutral-600">
              <span className="flex items-center gap-2">
                <Calendar size={16} aria-hidden />
                {dateShort}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} aria-hidden />
                {author}
              </span>
              {metaExtra}
            </div>

            <div className="my-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
                Share this article
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {shareLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-[2.25rem] min-w-[2.25rem] items-center justify-center rounded-full px-3 text-xs font-semibold text-white ${s.className}`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-5 md:p-8">
              {children}
            </div>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
              <form onSubmit={onSearch} className="flex gap-2">
                <input
                  type="search"
                  name="q"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Search…"
                  className="min-w-0 flex-1 rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  aria-label="Search blog posts"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-secondary-700">
                Latest posts
              </h2>
              <ul className="mt-4 divide-y divide-dotted divide-neutral-200">
                {sidebarPosts.map((post) => (
                  <li key={post.slug} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      href={`/iapl-insider/blogs/${post.slug}`}
                      className="group flex gap-2 text-sm text-neutral-700 hover:text-primary-700"
                    >
                      <ChevronRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 group-hover:text-primary-600"
                        aria-hidden
                      />
                      <span className="leading-snug">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
