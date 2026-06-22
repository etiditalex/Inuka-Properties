"use client";

import Image from "next/image";
import { Calendar, Tag, User } from "lucide-react";
import { formatIsoDate } from "@/lib/admin/utils";
import type { BlogPost } from "@/lib/supabase/types";

type BlogPreviewProps = {
  post: Partial<BlogPost>;
};

export default function BlogPreview({ post }: BlogPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200 bg-neutral-100">
      <div className="border-b border-dark-200 bg-dark-900 px-4 py-2">
        <p className="text-xs font-medium text-white/60">Frontend Preview — Blog Article</p>
      </div>

      {/* Hero carousel style */}
      <div className="relative h-48 bg-neutral-950">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title || "Blog preview"}
            fill
            className="object-cover opacity-80"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            Hero image preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          {post.category && (
            <span className="mb-2 inline-block rounded-full bg-primary-600 px-3 py-0.5 text-xs font-medium text-white">
              {post.category}
            </span>
          )}
          <h2 className="text-lg font-bold text-white font-serif line-clamp-2">
            {post.title || "Blog Title"}
          </h2>
        </div>
      </div>

      {/* Article meta */}
      <div className="bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-dark-500">
          <span className="flex items-center gap-1">
            <User size={12} className="text-primary-600" />
            {post.author || "IAPL Investment Team"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-primary-600" />
            {post.published_at ? formatIsoDate(post.published_at) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Tag size={12} className="text-primary-600" />
            {post.category || "Category"}
          </span>
        </div>
        <p className="text-sm text-dark-600 line-clamp-3">
          {post.excerpt || "Blog excerpt will appear here..."}
        </p>
        {post.content_html && (
          <div
            className="prose prose-sm mt-4 max-w-none text-dark-700"
            dangerouslySetInnerHTML={{ __html: post.content_html.slice(0, 500) + "..." }}
          />
        )}
      </div>
    </div>
  );
}
