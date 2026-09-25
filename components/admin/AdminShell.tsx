"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { useAdminShell } from "./AdminShellContext";
import { Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/admin/utils";
import type { Profile } from "@/lib/supabase/types";
import { uniquePropertyLeads } from "@/lib/leads/dedupe";

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  contentClassName?: string;
};

export default function AdminShell({ children, title, subtitle, contentClassName }: AdminShellProps) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, setMobileOpen } = useAdminShell();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState({ inquiries: 0, leads: 0 });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (prof) setProfile(prof as Profile);

      const [{ count: inq }, { data: newLeadRows }] = await Promise.all([
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("property_leads").select("id, email, phone, status, created_at").eq("status", "new"),
      ]);
      setBadges({ inquiries: inq || 0, leads: uniquePropertyLeads(newLeadRows || []).length });
    }

    load();

    const channel = supabase
      .channel("admin-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "property_leads" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminTopBar
        userName={profile?.full_name || undefined}
        userEmail={profile?.email || undefined}
        avatarUrl={profile?.avatar_url}
        inquiryCount={badges.inquiries}
        leadCount={badges.leads}
      />

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-dark-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <AdminSidebar badges={badges} />

      <div
        className={cn(
          "flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-60"
        )}
      >
        <main className={cn("flex-1 p-4 sm:p-6", contentClassName)}>
          <div className="mb-5">
            <h1 className="font-montserrat text-xl font-semibold text-dark-800">
              {title}
              {subtitle ? (
                <span className="ml-2 text-sm font-normal text-dark-400">» {subtitle}</span>
              ) : null}
            </h1>
          </div>
          {children}
        </main>

        <footer className="mt-auto border-t border-dark-200 px-6 py-4 text-center text-sm text-primary-700">
          <p>
            Inuka Properties © {new Date().getFullYear()}
            <span className="ml-3 inline-flex items-center gap-2 align-middle">
              <a href="https://x.com/Inukaproperties" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-primary-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/17aKSxGY2a/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-900">
                <Facebook size={14} />
              </a>
              <a href="https://www.instagram.com/inukaafrikaproperties?igsh=MXNtbHUxbTNuNzI2eQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary-900">
                <Instagram size={14} />
              </a>
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
