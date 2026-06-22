"use client";

import { Bell, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/admin/utils";

type AdminTopBarProps = {
  title: string;
  subtitle?: string;
  sidebarCollapsed: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
};

export default function AdminTopBar({
  title,
  subtitle,
  sidebarCollapsed,
  userName,
  userEmail,
  avatarUrl,
}: AdminTopBarProps) {
  const initials = (userName || userEmail || "A")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-dark-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "ml-[72px]" : "ml-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-dark-900 font-montserrat">{title}</h1>
          {subtitle && (
            <p className="text-sm text-dark-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-dark-200 bg-dark-50 px-3 py-2 md:flex">
            <Search size={16} className="text-dark-400" />
            <input
              type="search"
              placeholder="Quick search..."
              className="w-48 bg-transparent text-sm text-dark-700 outline-none placeholder:text-dark-400"
            />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700 transition hover:bg-primary-100"
          >
            <ExternalLink size={14} />
            View Site
          </Link>

          <button
            type="button"
            className="relative rounded-xl p-2 text-dark-500 transition hover:bg-dark-100 hover:text-dark-700"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-500" />
          </button>

          <div className="flex items-center gap-3 border-l border-dark-200 pl-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName || "Admin"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-200"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white ring-2 ring-primary-200">
                {initials}
              </div>
            )}
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-dark-900">{userName || "Admin"}</p>
              <p className="text-xs text-dark-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
