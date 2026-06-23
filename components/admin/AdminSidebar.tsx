"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  MapPin,
  FileText,
  Newspaper,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Quote,
  Download,
  Play,
  Mail,
  Send,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { segment: "", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { segment: "profile", label: "Profile", icon: User },
  { segment: "properties", label: "Land Listings", icon: MapPin },
  { segment: "blogs", label: "Blogs", icon: FileText },
  { segment: "news", label: "News Update", icon: Newspaper },
  { segment: "market-research", label: "Market Research", icon: BarChart3 },
  { segment: "testimonials", label: "Client Testimonials", icon: Quote },
  { segment: "downloads", label: "Downloads", icon: Download },
  { segment: "videos", label: "Video Gallery", icon: Play },
  { segment: "newsletters", label: "Newsletters", icon: Mail },
  { segment: "email", label: "Email Automation", icon: Send },
  { segment: "inquiries", label: "Inquiries", icon: MessageSquare, badge: "inquiries" as const },
  { segment: "leads", label: "Lead Generation", icon: Users, badge: "leads" as const },
  { segment: "settings", label: "Settings", icon: Settings },
];

type AdminSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  badges?: { inquiries?: number; leads?: number };
};

export default function AdminSidebar({
  collapsed,
  onToggle,
  badges = {},
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(adminPath("login"));
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-gradient-to-b from-dark-900 via-[#0a1628] to-dark-900 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href={adminPath()} className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/50">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-0"
            >
              <p className="truncate text-sm font-bold text-white font-montserrat">
                IAPL Console
              </p>
              <p className="truncate text-[10px] text-primary-300/80">
                Property Management
              </p>
            </motion.div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const href = adminPath(item.segment);
          const isActive = item.exact
            ? pathname === href
            : pathname?.startsWith(href);
          const Icon = item.icon;
          const badgeCount =
            item.badge === "inquiries"
              ? badges.inquiries
              : item.badge === "leads"
                ? badges.leads
                : 0;

          return (
            <Link
              key={item.segment}
              href={href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-600/90 to-primary-700/80 text-white shadow-lg shadow-primary-900/30"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600/20 to-secondary-600/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon
                size={20}
                className={cn(
                  "relative shrink-0",
                  isActive ? "text-secondary-300" : "text-white/50 group-hover:text-primary-300"
                )}
              />
              {!collapsed && (
                <span className="relative flex-1 truncate font-montserrat">
                  {item.label}
                </span>
              )}
              {!collapsed && badgeCount ? (
                <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-500 px-1.5 text-[10px] font-bold text-white">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              ) : null}
              {collapsed && badgeCount ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary-500" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition hover:bg-red-500/10 hover:text-red-400",
            loggingOut && "opacity-50"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="font-montserrat">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
