"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminForm";
import AdminButton from "@/components/admin/AdminButton";
import type { Profile } from "@/lib/supabase/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      phone: profile.phone,
      job_title: profile.job_title,
      avatar_url: profile.avatar_url,
    });

    setSaving(false);
    setMessage(error ? error.message : "Profile updated successfully!");
  };

  return (
    <AdminShell title="Profile" subtitle="Manage your admin account">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-dark-200/60 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white">
              {(profile.full_name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900 font-montserrat">{profile.full_name || "Admin User"}</h2>
              <p className="text-sm text-dark-500">{profile.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 capitalize">
                {profile.role || "admin"}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <AdminInput
              label="Full Name"
              value={profile.full_name || ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
            <AdminInput
              label="Job Title"
              value={profile.job_title || ""}
              onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
              placeholder="e.g. Property Manager"
            />
            <AdminInput
              label="Phone"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX"
            />
            <AdminInput
              label="Avatar URL"
              value={profile.avatar_url || ""}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              hint="Paste an image URL or upload to Supabase Storage"
            />
          </div>

          {message && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <AdminButton onClick={handleSave} loading={saving}>Save Profile</AdminButton>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
