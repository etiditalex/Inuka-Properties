"use client";

import { useEffect, useState } from "react";
import { Mail, Send, Link2, Copy, CheckCircle, MessageCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminToggle } from "@/components/admin/AdminForm";
import {
  DEFAULT_EMAIL_AUTOMATION,
  type EmailAutomationSettings,
} from "@/lib/email/automation";
import { formatAdminDate } from "@/lib/admin/utils";

type PropertyOption = {
  id: number;
  title: string;
  location: string;
  price: string;
};

type EmailLog = {
  id: string;
  lead_type: string;
  recipient_email: string;
  recipient_name: string | null;
  property_title: string | null;
  email_type: string;
  status: string;
  created_at: string;
};

export default function AdminEmailPage() {
  const [settings, setSettings] = useState<EmailAutomationSettings>(DEFAULT_EMAIL_AUTOMATION);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://www.inukaproperties.co.ke";
  const campaignPropertyId =
    settings.facebook_landing_property_id ?? settings.default_property_id;
  const campaignUrl = campaignPropertyId
    ? `${siteUrl}/get-property-details?property_id=${campaignPropertyId}`
    : `${siteUrl}/get-property-details`;

  const load = async () => {
    const res = await fetch("/api/admin/email");
    const data = await res.json();
    if (data.settings) setSettings(data.settings);
    if (data.logs) setLogs(data.logs);
    if (data.properties) setProperties(data.properties);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(res.ok ? "Email automation settings saved." : data.error || "Save failed");
    if (res.ok) load();
  };

  const copyCampaignLink = async () => {
    await navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const propertyOptions = [
    { value: "", label: "— Select property —" },
    ...properties.map((p) => ({ value: String(p.id), label: `${p.title} (${p.price})` })),
  ];

  return (
    <AdminShell
      title="Email Automation"
      subtitle="Collect leads from Facebook ads and auto-send property details to clients"
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Send className="text-primary-600" size={20} />
                <h3 className="text-lg font-bold font-montserrat text-dark-900">Automated Workflow</h3>
              </div>
              <p className="mb-4 text-sm text-dark-600">
                When someone fills a form on your website (e.g. from a Facebook ad), their email is saved and
                property details are sent automatically. Your team is notified by email and WhatsApp.
              </p>
              <div className="space-y-3">
                <AdminToggle
                  label="Auto-send property details to leads"
                  checked={settings.auto_send_property_details}
                  onChange={(v) => setSettings((s) => ({ ...s, auto_send_property_details: v }))}
                  description="Sends project info, price, location, and WhatsApp link to the client's email"
                />
                <AdminToggle
                  label="Email admin on new leads"
                  checked={settings.notify_admin_email}
                  onChange={(v) => setSettings((s) => ({ ...s, notify_admin_email: v }))}
                  description="Sends alert to NOTIFY_EMAIL with lead details and WhatsApp reply link"
                />
                <AdminToggle
                  label="WhatsApp admin alerts (optional)"
                  checked={settings.notify_admin_whatsapp}
                  onChange={(v) => setSettings((s) => ({ ...s, notify_admin_whatsapp: v }))}
                  description="Optional — requires Meta Business API. Email alerts work without this."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Link2 className="text-primary-600" size={20} />
                <h3 className="text-lg font-bold font-montserrat text-dark-900">Facebook Ad Landing Link</h3>
              </div>
              <p className="mb-4 text-sm text-dark-600">
                Use this URL as the destination in your Facebook/Meta ad. Visitors submit name, email, and phone —
                then receive property details automatically.
              </p>
              <AdminSelect
                label="Campaign property"
                options={propertyOptions}
                value={campaignPropertyId ? String(campaignPropertyId) : ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    facebook_landing_property_id: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
              <AdminSelect
                label="Fallback property (if none selected on form)"
                options={propertyOptions}
                value={settings.default_property_id ? String(settings.default_property_id) : ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    default_property_id: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
              <div className="mt-4 rounded-xl border border-dark-200 bg-white p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-500">Ad destination URL</p>
                <code className="block break-all text-sm text-primary-800">{campaignUrl}</code>
                <AdminButton size="sm" variant="secondary" className="mt-3" onClick={copyCampaignLink}>
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy link"}
                </AdminButton>
              </div>
            </div>

            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="text-emerald-600" size={20} />
                <h3 className="text-lg font-bold font-montserrat text-dark-900">WhatsApp</h3>
              </div>
              <AdminInput
                label="Admin WhatsApp number"
                value={settings.admin_whatsapp_number}
                onChange={(e) => setSettings((s) => ({ ...s, admin_whatsapp_number: e.target.value }))}
                hint="Default: 254711082084 (0711 082 084)"
              />
              <p className="mt-3 text-xs text-dark-500">
                WhatsApp push is optional. Email automation only needs RESEND_API_KEY, NOTIFY_EMAIL, and EMAIL_FROM in Vercel.
              </p>
            </div>

            {message && (
              <div className={`rounded-xl px-4 py-3 text-sm ${message.includes("failed") || message.includes("error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {message}
              </div>
            )}
            <AdminButton onClick={save} loading={saving}>
              <Mail size={16} /> Save automation settings
            </AdminButton>
          </div>

          <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold font-montserrat text-dark-900">Recent automated emails</h3>
            {logs.length === 0 ? (
              <p className="text-sm text-dark-500">No emails sent yet. Leads from forms will appear here.</p>
            ) : (
              <div className="max-h-[600px] space-y-3 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-dark-100 bg-dark-50/50 p-4 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${log.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {log.status}
                        </span>
                        <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700">
                          {log.email_type.replace("_", " ")}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-dark-400">{formatAdminDate(log.created_at)}</span>
                    </div>
                    <p className="mt-2 font-medium text-dark-900">{log.recipient_email}</p>
                    {log.property_title && (
                      <p className="text-dark-600">Property: {log.property_title}</p>
                    )}
                    <p className="text-xs text-dark-400">Source: {log.lead_type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
