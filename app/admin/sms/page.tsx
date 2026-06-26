"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Smartphone,
  Send,
  BarChart3,
  Zap,
  Users,
  CheckCircle,
  AlertCircle,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import {
  DEFAULT_SMS_AUTOMATION,
  SMS_TEMPLATE_VARIABLES,
  type SmsAutomationSettings,
} from "@/lib/sms/settings";
import { renderSmsTemplate, smsStats } from "@/lib/sms/templates";
import { formatAdminDate } from "@/lib/admin/utils";

type SmsLog = {
  id: string;
  recipient_phone: string;
  recipient_name: string | null;
  property_title: string | null;
  sms_type: string;
  status: string;
  message_body: string;
  error_message: string | null;
  created_at: string;
};

type Insights = {
  total: number;
  sent: number;
  failed: number;
  sentToday: number;
  failedToday: number;
  successRate: number;
  byType: Record<string, number>;
};

const PRESET_TEMPLATES = [
  {
    label: "Property details",
    message:
      "Hi {{name}}, thanks for your interest in {{property}} ({{price}}) at {{location}}. Details: {{link}}. WhatsApp {{whatsapp}} - Inuka Afrika Properties",
  },
  {
    label: "Site visit invite",
    message:
      "Hi {{name}}, book your site visit for {{property}} today. Call/WhatsApp {{whatsapp}} or visit {{link}} - Inuka Afrika Properties",
  },
  {
    label: "Follow-up",
    message:
      "Hi {{name}}, following up on {{property}}. Limited plots available at {{price}}. Reply or call {{whatsapp}} - Inuka Afrika Properties",
  },
];

export default function AdminSmsPage() {
  const [settings, setSettings] = useState<SmsAutomationSettings>(DEFAULT_SMS_AUTOMATION);
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [recipientCounts, setRecipientCounts] = useState({ leads: 0, inquiries: 0, all: 0 });
  const [properties, setProperties] = useState<{ id: number; title: string; price: string; location: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [composerMode, setComposerMode] = useState<"bulk" | "property_auto">("bulk");
  const [bulkMessage, setBulkMessage] = useState(PRESET_TEMPLATES[0].message);
  const [bulkAudience, setBulkAudience] = useState("all");
  const [bulkPropertyId, setBulkPropertyId] = useState("");
  const [testPhone, setTestPhone] = useState("0711082084");

  const previewVars = useMemo(() => {
    const prop = bulkPropertyId
      ? properties.find((p) => String(p.id) === bulkPropertyId)
      : properties[0];
    const site =
      typeof window !== "undefined" ? window.location.host : "www.inukaproperties.co.ke";
    return {
      name: "John Kamau",
      property: prop?.title || "Tulivu Haven",
      price: prop?.price || "KES 850,000",
      location: prop?.location || "Kikambala",
      link: prop ? `${site}/for-sale/${prop.id}` : `${site}/for-sale/14`,
      whatsapp: "0711 082 084",
      type: "lead",
      phone: "0712 345 678",
    };
  }, [bulkPropertyId, properties]);

  const previewText = useMemo(
    () => renderSmsTemplate(bulkMessage, previewVars),
    [bulkMessage, previewVars]
  );
  const stats = useMemo(() => smsStats(previewText), [previewText]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/sms");
    const data = await res.json();
    if (data.settings) setSettings(data.settings);
    if (data.logs) setLogs(data.logs);
    if (data.insights) setInsights(data.insights);
    if (data.recipientCounts) setRecipientCounts(data.recipientCounts);
    if (data.properties) setProperties(data.properties);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const insertVariable = (key: string) => {
    setBulkMessage((m) => `${m}${m && !m.endsWith(" ") ? " " : ""}${key}`);
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(res.ok ? "SMS settings saved." : data.error || "Save failed");
    if (res.ok) load();
  };

  const sendBulk = async () => {
    setSending(true);
    setMessage("");
    const res = await fetch("/api/admin/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send_bulk",
        message: bulkMessage,
        audience: bulkAudience,
        property_id: bulkPropertyId || null,
      }),
    });
    const data = await res.json();
    setSending(false);
    setMessage(
      res.ok
        ? `Bulk SMS sent: ${data.sent} delivered, ${data.failed} failed (${data.total} total).`
        : data.error || "Send failed"
    );
    if (res.ok) load();
  };

  const sendTest = async () => {
    setSending(true);
    setMessage("");
    const res = await fetch("/api/admin/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send_test",
        phone: testPhone,
        message: previewText,
      }),
    });
    const data = await res.json();
    setSending(false);
    if (data.success) {
      setMessage("Test SMS sent!");
      load();
    } else {
      setMessage(data.error || "Test failed — check Sender ID and API key in Vercel.");
    }
  };

  const propertyOptions = [
    { value: "", label: "— No property merge —" },
    ...properties.map((p) => ({ value: String(p.id), label: p.title })),
  ];

  const audienceOptions = [
    { value: "all", label: `All contacts (${recipientCounts.all})` },
    { value: "leads", label: `Leads only (${recipientCounts.leads})` },
    { value: "inquiries", label: `Inquiries only (${recipientCounts.inquiries})` },
  ];

  return (
    <AdminShell
      title="SMS"
      subtitle="Send bulk SMS to website contacts and automate property alerts"
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* LEFT — Interactive SMS composer */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="text-primary-600" size={20} />
                  <h3 className="text-lg font-bold font-montserrat text-dark-900">SMS Composer</h3>
                </div>
                <div className="flex rounded-lg border border-dark-200 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setComposerMode("bulk")}
                    className={`rounded-md px-3 py-1.5 font-medium ${composerMode === "bulk" ? "bg-primary-600 text-white" : "text-dark-600"}`}
                  >
                    Bulk send
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode("property_auto")}
                    className={`rounded-md px-3 py-1.5 font-medium ${composerMode === "property_auto" ? "bg-primary-600 text-white" : "text-dark-600"}`}
                  >
                    Auto template
                  </button>
                </div>
              </div>

              {composerMode === "bulk" ? (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {PRESET_TEMPLATES.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setBulkMessage(t.message)}
                        className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800 transition hover:bg-primary-100"
                      >
                        <Sparkles size={12} className="mr-1 inline" />
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-500">
                    Insert variables
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {SMS_TEMPLATE_VARIABLES.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => insertVariable(v.key)}
                        className="rounded-lg border border-dark-200 bg-dark-50 px-2.5 py-1 text-xs font-medium text-dark-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  <AdminTextarea
                    label="Message"
                    rows={5}
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    hint="Click variables above to insert. Each SMS is personalized per recipient."
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${stats.segments > 1 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {stats.chars} chars · {stats.segments} SMS segment{stats.segments > 1 ? "s" : ""}
                    </span>
                    <span className="text-dark-500">{stats.encoding} encoding</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <AdminSelect
                      label="Recipients"
                      options={audienceOptions}
                      value={bulkAudience}
                      onChange={(e) => setBulkAudience(e.target.value)}
                    />
                    <AdminSelect
                      label="Merge property data"
                      options={propertyOptions}
                      value={bulkPropertyId}
                      onChange={(e) => setBulkPropertyId(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <AdminButton onClick={sendBulk} loading={sending}>
                      <Send size={16} /> Send bulk SMS
                    </AdminButton>
                    <AdminButton variant="secondary" onClick={sendTest} loading={sending}>
                      <Smartphone size={16} /> Send test
                    </AdminButton>
                  </div>
                  <AdminInput
                    className="mt-3"
                    label="Test phone number"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    hint="Sends the live preview below to this number"
                  />
                </>
              ) : (
                <>
                  <AdminTextarea
                    label="Auto property SMS template"
                    rows={4}
                    value={settings.property_template}
                    onChange={(e) => setSettings((s) => ({ ...s, property_template: e.target.value }))}
                    hint="Sent automatically when users submit forms with a phone number"
                  />
                  <AdminTextarea
                    className="mt-3"
                    label="Admin alert SMS template"
                    rows={2}
                    value={settings.admin_template}
                    onChange={(e) => setSettings((s) => ({ ...s, admin_template: e.target.value }))}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SMS_TEMPLATE_VARIABLES.map((v) => (
                      <span key={v.key} className="rounded-md bg-dark-100 px-2 py-0.5 text-[10px] font-mono text-dark-600">
                        {v.key}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Live phone preview */}
            <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary-700">Live preview</p>
              <div className="mx-auto max-w-xs rounded-[2rem] border-4 border-dark-900 bg-dark-900 p-3 shadow-xl">
                <div className="rounded-2xl bg-[#e5ddd5] p-4 min-h-[160px]">
                  <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-sm text-dark-900 shadow-sm">
                    {previewText || "Your message preview appears here…"}
                  </div>
                  <p className="mt-2 text-right text-[10px] text-dark-500">Inuka Afrika · now</p>
                </div>
              </div>
            </div>

            {/* Automation toggles */}
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="text-secondary-600" size={20} />
                <h3 className="text-lg font-bold font-montserrat text-dark-900">Website automation</h3>
              </div>
              <div className="space-y-3">
                <AdminToggle
                  label="Auto-send property SMS to leads"
                  checked={settings.auto_send_property_details_sms}
                  onChange={(v) => setSettings((s) => ({ ...s, auto_send_property_details_sms: v }))}
                  description="When someone fills a form, they receive property details by SMS"
                />
                <AdminToggle
                  label="SMS admin on new leads"
                  checked={settings.notify_admin_sms}
                  onChange={(v) => setSettings((s) => ({ ...s, notify_admin_sms: v }))}
                  description="Sends alert to admin phone when a new lead is captured"
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <AdminInput
                  label="Sender ID"
                  value={settings.sender_id}
                  onChange={(e) => setSettings((s) => ({ ...s, sender_id: e.target.value.toUpperCase().slice(0, 11) }))}
                  hint="Must match your registered Okay SMS sender ID exactly (max 11 chars)"
                />
                <AdminInput
                  label="Admin SMS number"
                  value={settings.admin_sms_number}
                  onChange={(e) => setSettings((s) => ({ ...s, admin_sms_number: e.target.value }))}
                  hint="0711 082 084"
                />
              </div>
              {message && (
                <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.includes("failed") || message.includes("error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {message}
                </div>
              )}
              <AdminButton className="mt-4" onClick={saveSettings} loading={saving}>
                Save SMS settings
              </AdminButton>
            </div>
          </div>

          {/* RIGHT — Insights & log */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Sent today", value: insights?.sentToday ?? 0, icon: Send, color: "text-primary-600" },
                { label: "Failed today", value: insights?.failedToday ?? 0, icon: AlertCircle, color: "text-red-600" },
                { label: "Total sent", value: insights?.sent ?? 0, icon: CheckCircle, color: "text-emerald-600" },
                { label: "Success rate", value: `${insights?.successRate ?? 0}%`, icon: BarChart3, color: "text-secondary-600" },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm">
                  <card.icon className={card.color} size={18} />
                  <p className="mt-2 text-2xl font-bold text-dark-900">{card.value}</p>
                  <p className="text-xs text-dark-500">{card.label}</p>
                </div>
              ))}
            </div>

            {insights && Object.keys(insights.byType).length > 0 && (
              <div className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-dark-900">
                  <Users size={16} /> SMS by type
                </h3>
                <div className="space-y-2">
                  {Object.entries(insights.byType).map(([type, count]) => {
                    const pct = insights.total ? Math.round((count / insights.total) * 100) : 0;
                    return (
                      <div key={type}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="capitalize text-dark-700">{type.replace(/_/g, " ")}</span>
                          <span className="text-dark-500">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-dark-100">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold font-montserrat text-dark-900">Recent SMS activity</h3>
              {logs.length === 0 ? (
                <p className="text-sm text-dark-500">No SMS sent yet. Automated and bulk messages appear here.</p>
              ) : (
                <div className="max-h-[520px] space-y-3 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-dark-100 bg-dark-50/50 p-4 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${log.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {log.status}
                          </span>
                          <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700">
                            {log.sms_type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-dark-400">{formatAdminDate(log.created_at)}</span>
                      </div>
                      <p className="mt-2 font-medium text-dark-900">{log.recipient_phone}</p>
                      {log.recipient_name && <p className="text-dark-600">{log.recipient_name}</p>}
                      <p className="mt-2 line-clamp-2 text-xs text-dark-500">{log.message_body}</p>
                      {log.status === "failed" && log.error_message && (
                        <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-700">
                          {log.error_message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-900">
              <p className="font-semibold">API setup (Vercel) — Okay SMS International</p>
              <p className="mt-1 text-amber-800">
                Set <code className="rounded bg-white px-1">OKAYSMS_API_KEY</code> (Bearer token from{" "}
                <a href="https://my.okaysms.com" className="underline" target="_blank" rel="noopener noreferrer">
                  my.okaysms.com
                </a>
                ), <code className="rounded bg-white px-1">SMS_SENDER_ID</code> (your registered sender ID), and optionally{" "}
                <code className="rounded bg-white px-1">OKAYSMS_API_URL</code> (default: https://my.okaysms.com/api/http).
                Send endpoint: <code className="rounded bg-white px-1">POST /sms/send</code>. Status:{" "}
                <code className="rounded bg-white px-1">GET /sms/&#123;uid&#125;</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
