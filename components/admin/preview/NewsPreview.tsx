"use client";

import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import { formatIsoDate } from "@/lib/admin/utils";
import type { NewsItem } from "@/lib/supabase/types";

type NewsPreviewProps = {
  item: Partial<NewsItem>;
};

export default function NewsPreview({ item }: NewsPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white">
      <div className="border-b border-dark-200 bg-dark-900 px-4 py-2">
        <p className="text-xs font-medium text-white/60">Frontend Preview — News Update</p>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-2/5">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title || "News preview"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center bg-dark-100 text-dark-400 text-sm">
              News image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center p-5">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            {item.category && (
              <span className="rounded-full bg-primary-500 px-3 py-0.5 text-xs font-semibold text-white">
                {item.category}
              </span>
            )}
            {item.featured && (
              <span className="rounded-full bg-secondary-500 px-2 py-0.5 text-[10px] font-bold text-white">
                FEATURED
              </span>
            )}
          </div>
          <h3 className="mb-2 text-lg font-bold text-dark-900 font-montserrat line-clamp-2">
            {item.title || "News Title"}
          </h3>
          <p className="mb-3 text-sm text-dark-600 line-clamp-3">
            {item.excerpt || "News excerpt..."}
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {item.published_at ? formatIsoDate(item.published_at) : "—"}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {item.category || "Category"}
            </span>
          </div>
          {item.details && item.details.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-dark-100 pt-3">
              {item.details.slice(0, 4).map((d, i) => (
                <li key={i} className="text-xs text-dark-600 before:mr-2 before:text-primary-500 before:content-['•']">
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
