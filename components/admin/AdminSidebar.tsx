"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Smartphone,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminShell } from "./AdminShellContext";

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
  { segment: "sms", label: "SMS", icon: Smartphone },
  { segment: "ticketing", label: "IAPL Ticketing", icon: Ticket },
  { segment: "inquiries", label: "Inquiries", icon: MessageSquare, badge: "inquiries" as const },
  { segment: "leads", label: "Lead Generation", icon: Users, badge: "leads" as const },
  { segment: "settings", label: "Settings", icon: Settings },
];

type AdminSidebarProps = {
  badges?: { inquiries?: number; leads?: number };
};

export default function AdminSidebar({ badges = {} }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useAdminShell();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(adminPath("login"));
    router.refresh();
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-primary-600/40 bg-gradient-to-b from-primary-700 via-primary-800 to-primary-900 transition-all duration-300",
        collapsed ? "lg:w-[72px]" : "lg:w-64",
        mobileOpen ? "w-64 translate-x-0" : "-translate-x-full w-64",
        "lg:translate-x-0"
      )}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        className={cn(
          "absolute top-7 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-primary-900 text-white shadow-lg transition hover:border-white/40 hover:bg-primary-600 lg:flex",
          collapsed ? "-right-3.5" : "-right-3.5"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          collapsed ? "justify-center px-2 lg:px-2" : "justify-between px-4"
        )}
      >
        <Link
          href={adminPath()}
          onClick={handleNavClick}
          className={cn(
            "flex items-center overflow-hidden",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-lg ring-1 ring-white/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="truncate text-sm font-bold text-white font-montserrat">
                  IAPL Console
                </p>
                <p className="truncate text-[10px] text-primary-100/80">
                  Property Management
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
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
              onClick={handleNavClick}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-white/15 text-white shadow-sm ring-1 ring-white/10"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon
                size={20}
                className={cn(
                  "relative shrink-0",
                  isActive ? "text-secondary-200" : "text-white/70 group-hover:text-white"
                )}
              />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex-1 truncate overflow-hidden font-montserrat"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
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
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-red-500/20 hover:text-red-100",
            collapsed ? "justify-center" : "gap-3",
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
