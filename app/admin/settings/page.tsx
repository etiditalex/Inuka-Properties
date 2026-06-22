"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminToggle } from "@/components/admin/AdminForm";
import AdminButton from "@/components/admin/AdminButton";
import { createClient } from "@/lib/supabase/client";

type Settings = {
  site_name: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  office_address: string;
  auto_sold_out_global: boolean;
  notify_new_inquiries: boolean;
  notify_new_leads: boolean;
};

const defaults: Settings = {
  site_name: "Inuka Afrika Properties Limited",
  contact_email: "info@inukaproperties.co.ke",
  contact_phone: "+254 700 000 000",
  whatsapp_number: "+254700000000",
  office_address: "Nyali, Mombasa, Kenya",
  auto_sold_out_global: true,
  notify_new_inquiries: true,
  notify_new_leads: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*").eq("key", "general").single();
      if (data?.value) setSettings({ ...defaults, ...(data.value as Settings) });
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: "general",
      value: settings,
    });
    setSaving(false);
    setMessage(error ? error.message : "Settings saved successfully!");
  };

  const update = (key: keyof Settings, value: string | boolean) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <AdminShell title="Settings" subtitle="Configure site-wide preferences">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-dark-900 font-montserrat">General</h3>
          <div className="space-y-4">
            <AdminInput label="Site Name" value={settings.site_name} onChange={(e) => update("site_name", e.target.value)} />
            <AdminInput label="Contact Email" value={settings.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
            <AdminInput label="Contact Phone" value={settings.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} />
            <AdminInput label="WhatsApp Number" value={settings.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} />
            <AdminInput label="Office Address" value={settings.office_address} onChange={(e) => update("office_address", e.target.value)} />
          </div>
        </div>

        <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-dark-900 font-montserrat">Automation</h3>
          <div className="space-y-3">
            <AdminToggle
              label="Global Auto Sold Out"
              checked={settings.auto_sold_out_global}
              onChange={(v) => update("auto_sold_out_global", v)}
              description="Enable automatic sold-out marking across all properties by default"
            />
            <AdminToggle
              label="Notify on New Inquiries"
              checked={settings.notify_new_inquiries}
              onChange={(v) => update("notify_new_inquiries", v)}
            />
            <AdminToggle
              label="Notify on New Leads"
              checked={settings.notify_new_leads}
              onChange={(v) => update("notify_new_leads", v)}
            />
          </div>
        </div>

        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <AdminButton onClick={handleSave} loading={saving}>Save Settings</AdminButton>
        </div>
      </div>
    </AdminShell>
  );
}
