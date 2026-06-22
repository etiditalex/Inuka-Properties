"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { cn } from "@/lib/admin/utils";
import type { Profile } from "@/lib/supabase/types";

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState({ inquiries: 0, leads: 0 });

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

      const [{ count: inq }, { count: leads }] = await Promise.all([
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("property_leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setBadges({ inquiries: inq || 0, leads: leads || 0 });
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
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        badges={badges}
      />
      <AdminTopBar
        title={title}
        subtitle={subtitle}
        sidebarCollapsed={collapsed}
        userName={profile?.full_name || undefined}
        userEmail={profile?.email || undefined}
        avatarUrl={profile?.avatar_url}
      />
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] p-6 transition-all duration-300",
          collapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
