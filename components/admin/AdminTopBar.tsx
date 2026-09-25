"use client";

import { Bell, Mail, Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { adminPath } from "@/lib/admin/path";
import { useAdminShell } from "./AdminShellContext";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

type AdminTopBarProps = {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  inquiryCount?: number;
  leadCount?: number;
};

export default function AdminTopBar({
  userName,
  avatarUrl,
  inquiryCount = 0,
  leadCount = 0,
}: AdminTopBarProps) {
  const { toggleMobile } = useAdminShell();
  const welcome = userName?.split(" ")[0] || "Admin";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-primary-700 px-3 text-white shadow-sm sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Link href={adminPath()} className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
            <Image
              src={DEFAULT_OG_IMAGE}
              alt="Inuka Afrika Properties"
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </span>
          <span className="truncate font-montserrat text-sm font-bold sm:text-base">
            Inuka Properties
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleMobile}
          className="rounded-md p-1.5 text-white/90 hover:bg-white/10 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href={adminPath("inquiries")}
          className="relative rounded-md p-2 text-white/90 hover:bg-white/10"
          aria-label="Inquiries"
        >
          <Mail size={18} />
          {inquiryCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-500 px-1 text-[10px] font-bold text-white">
              {inquiryCount > 9 ? "9+" : inquiryCount}
            </span>
          )}
        </Link>
        <Link
          href={adminPath("leads")}
          className="relative rounded-md p-2 text-white/90 hover:bg-white/10"
          aria-label="Leads"
        >
          <Bell size={18} />
          {leadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-500 px-1 text-[10px] font-bold text-white">
              {leadCount > 9 ? "9+" : leadCount}
            </span>
          )}
        </Link>
        <div className="ml-1 flex items-center gap-2 border-l border-white/20 pl-2 sm:pl-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/30" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-[11px] font-bold">
              IAPL
            </span>
          )}
          <span className="hidden items-center gap-1 text-sm sm:flex">
            Welcome, {welcome}
            <ChevronDown size={14} className="text-white/70" />
          </span>
        </div>
      </div>
    </header>
  );
}
