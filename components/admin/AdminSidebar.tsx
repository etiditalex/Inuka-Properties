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
  Quote,
  Download,
  Play,
  Mail,
  Send,
  Smartphone,
  Ticket,
  Megaphone,
  Package,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminShell } from "./AdminShellContext";

const shortcuts = [
  { segment: "", label: "Dashboard", icon: BarChart3, color: "bg-primary-600" },
  { segment: "properties", label: "Land Listings", icon: MapPin, color: "bg-primary-800" },
  { segment: "leads", label: "Lead Generation", icon: Users, color: "bg-secondary-500" },
  { segment: "inquiries", label: "Inquiries", icon: MessageSquare, color: "bg-secondary-700" },
];

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
  { segment: "facebook-ads", label: "Facebook Ads", icon: Megaphone },
  { segment: "landing-pages", label: "Landing Pages", icon: LayoutTemplate },
  { segment: "sms", label: "SMS", icon: Smartphone },
  { segment: "ticketing", label: "IAPL Ticketing", icon: Ticket },
  { segment: "inventory", label: "Company Inventory", icon: Package },
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
        "fixed left-0 top-14 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r border-dark-200 bg-dark-50 transition-all duration-300",
        collapsed ? "lg:w-[72px]" : "lg:w-60",
        mobileOpen ? "w-60 translate-x-0" : "-translate-x-full w-60",
        "lg:translate-x-0"
      )}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute -right-3 top-4 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-500 shadow-sm hover:text-primary-700 lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div
        className={cn(
          "grid shrink-0 gap-2 border-b border-dark-200 p-3",
          collapsed ? "grid-cols-1" : "grid-cols-4"
        )}
      >
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={adminPath(item.segment)}
              onClick={handleNavClick}
              title={item.label}
              className={cn(
                "flex h-9 items-center justify-center rounded-md text-white shadow-sm",
                item.color
              )}
            >
              <Icon size={16} />
            </Link>
          );
        })}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden p-2">
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
                "group relative flex items-center rounded-md text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-primary-50 text-primary-800"
                  : "text-dark-600 hover:bg-white hover:text-dark-900"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "relative shrink-0",
                  isActive ? "text-primary-700" : "text-secondary-600 group-hover:text-primary-700"
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

      <div className="border-t border-dark-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-dark-600 transition hover:bg-white hover:text-primary-800",
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
