"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Wifi,
  Monitor,
  AlertTriangle,
  DollarSign,
  CalendarClock,
  X,
  Search,
  FileSpreadsheet,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import StatCard from "@/components/admin/StatCard";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type {
  CompanyAsset,
  CompanySubscription,
  AssetPurchaseCondition,
  AssetStatus,
  SubscriptionType,
  SubscriptionBillingCycle,
  SubscriptionStatus,
} from "@/lib/supabase/types";
import { cn } from "@/lib/admin/utils";
import {
  exportAssetsToExcel,
  exportFullInventoryToExcel,
  exportSubscriptionsToExcel,
} from "@/lib/admin/inventory-export";

type Tab = "overview" | "assets" | "subscriptions" | "challenges";

const emptyAsset: Partial<CompanyAsset> = {
  name: "",
  model: "",
  purchase_date: new Date().toISOString().split("T")[0],
  department: "",
  cost: 0,
  purchase_condition: "new",
  serial_number: "",
  notes: "",
  challenges: "",
  status: "active",
};

const emptySubscription: Partial<CompanySubscription> = {
  name: "",
  subscription_type: "internet",
  provider: "",
  acquisition_date: new Date().toISOString().split("T")[0],
  renewal_date: "",
  cost: 0,
  billing_cycle: "annual",
  challenges: "",
  status: "active",
  notes: "",
};

function formatKES(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date + (date.includes("T") ? "" : "T00:00:00")).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(date: string | null) {
  if (!date) return null;
  const target = new Date(date + (date.includes("T") ? "" : "T00:00:00"));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "Overview", icon: DollarSign },
  { id: "assets", label: "Assets", icon: Package },
  { id: "subscriptions", label: "Subscriptions", icon: Wifi },
  { id: "challenges", label: "Challenges", icon: AlertTriangle },
];

const DEPARTMENTS = [
  "Administration",
  "Sales & Marketing",
  "Finance",
  "Operations",
  "IT",
  "Human Resources",
  "Legal",
  "Other",
];

export default function AdminInventoryPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [assets, setAssets] = useState<CompanyAsset[]>([]);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [editingAsset, setEditingAsset] = useState<Partial<CompanyAsset> | null>(null);
  const [editingSub, setEditingSub] = useState<Partial<CompanySubscription> | null>(null);

  const load = async () => {
    const supabase = createClient();
    const [{ data: assetData }, { data: subData }] = await Promise.all([
      supabase.from("company_assets").select("*").order("purchase_date", { ascending: false }),
      supabase.from("company_subscriptions").select("*").order("renewal_date", { ascending: true }),
    ]);
    setAssets((assetData as CompanyAsset[]) || []);
    setSubscriptions((subData as CompanySubscription[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const totalAssetValue = assets.reduce((sum, a) => sum + Number(a.cost), 0);
    const activeAssets = assets.filter((a) => a.status === "active").length;
    const activeSubs = subscriptions.filter((s) => s.status === "active");
    const annualSubCost = activeSubs.reduce((sum, s) => {
      const cost = Number(s.cost);
      if (s.billing_cycle === "monthly") return sum + cost * 12;
      if (s.billing_cycle === "one_time") return sum;
      return sum + cost;
    }, 0);
    const upcomingRenewals = subscriptions.filter((s) => {
      const days = daysUntil(s.renewal_date);
      return s.status === "active" && days !== null && days >= 0 && days <= 30;
    });
    const challengeCount =
      assets.filter((a) => a.challenges?.trim()).length +
      subscriptions.filter((s) => s.challenges?.trim()).length;
    return { totalAssetValue, activeAssets, annualSubCost, upcomingRenewals, challengeCount };
  }, [assets, subscriptions]);

  const challengeItems = useMemo(() => {
    const items: { type: "asset" | "subscription"; name: string; detail: string; challenges: string; id: number }[] = [];
    for (const a of assets) {
      if (a.challenges?.trim()) {
        items.push({
          type: "asset",
          name: a.name,
          detail: `${a.model} · ${a.department}`,
          challenges: a.challenges,
          id: a.id,
        });
      }
    }
    for (const s of subscriptions) {
      if (s.challenges?.trim()) {
        items.push({
          type: "subscription",
          name: s.name,
          detail: `${s.subscription_type === "internet" ? "Internet" : "Software"} · ${s.provider || "—"}`,
          challenges: s.challenges,
          id: s.id,
        });
      }
    }
    return items;
  }, [assets, subscriptions]);

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.model.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.serial_number?.toLowerCase().includes(q)
    );
  }, [assets, search]);

  const filteredSubs = useMemo(() => {
    if (!search.trim()) return subscriptions;
    const q = search.toLowerCase();
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.provider?.toLowerCase().includes(q) ||
        s.subscription_type.includes(q)
    );
  }, [subscriptions, search]);

  const saveAsset = async () => {
    if (!editingAsset?.name?.trim() || !editingAsset.model?.trim() || !editingAsset.department?.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: editingAsset.name.trim(),
      model: editingAsset.model.trim(),
      purchase_date: editingAsset.purchase_date,
      department: editingAsset.department.trim(),
      cost: Number(editingAsset.cost) || 0,
      purchase_condition: editingAsset.purchase_condition as AssetPurchaseCondition,
      serial_number: editingAsset.serial_number?.trim() || null,
      notes: editingAsset.notes?.trim() || null,
      challenges: editingAsset.challenges?.trim() || null,
      status: editingAsset.status as AssetStatus,
    };
    const { error } = editingAsset.id
      ? await supabase.from("company_assets").update(payload).eq("id", editingAsset.id)
      : await supabase.from("company_assets").insert(payload);
    setSaving(false);
    if (!error) {
      setEditingAsset(null);
      load();
    }
  };

  const saveSubscription = async () => {
    if (!editingSub?.name?.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: editingSub.name.trim(),
      subscription_type: editingSub.subscription_type as SubscriptionType,
      provider: editingSub.provider?.trim() || null,
      acquisition_date: editingSub.acquisition_date,
      renewal_date: editingSub.renewal_date || null,
      cost: Number(editingSub.cost) || 0,
      billing_cycle: editingSub.billing_cycle as SubscriptionBillingCycle,
      challenges: editingSub.challenges?.trim() || null,
      status: editingSub.status as SubscriptionStatus,
      notes: editingSub.notes?.trim() || null,
    };
    const { error } = editingSub.id
      ? await supabase.from("company_subscriptions").update(payload).eq("id", editingSub.id)
      : await supabase.from("company_subscriptions").insert(payload);
    setSaving(false);
    if (!error) {
      setEditingSub(null);
      load();
    }
  };

  const deleteAsset = async (id: number) => {
    if (!confirm("Delete this asset record? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("company_assets").delete().eq("id", id);
    load();
  };

  const deleteSubscription = async (id: number) => {
    if (!confirm("Delete this subscription record? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("company_subscriptions").delete().eq("id", id);
    load();
  };

  const conditionBadge = (c: AssetPurchaseCondition) =>
    c === "new" ? (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">New</span>
    ) : (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">Refurbished</span>
    );

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700",
      retired: "bg-dark-100 text-dark-500",
      under_repair: "bg-amber-100 text-amber-700",
      expired: "bg-red-100 text-red-700",
      cancelled: "bg-dark-100 text-dark-500",
    };
    return (
      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", styles[status] || "bg-dark-100 text-dark-600")}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const renewalBadge = (date: string | null) => {
    const days = daysUntil(date);
    if (days === null) return null;
    if (days < 0) return <span className="text-xs font-medium text-red-600">Overdue</span>;
    if (days <= 7) return <span className="text-xs font-medium text-red-600">{days}d left</span>;
    if (days <= 30) return <span className="text-xs font-medium text-amber-600">{days}d left</span>;
    return <span className="text-xs text-dark-400">{days}d left</span>;
  };

  return (
    <AdminShell
      title="Company Inventory"
      subtitle="Track assets, subscriptions, renewals, and operational challenges for future records"
    >
      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                tab === t.id
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                  : "border border-dark-200 bg-white text-dark-600 hover:bg-dark-50"
              )}
            >
              <Icon size={16} />
              {t.label}
              {t.id === "challenges" && stats.challengeCount > 0 && (
                <span className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                  tab === t.id ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                )}>
                  {stats.challengeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <>
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-end gap-2">
                <AdminButton
                  variant="secondary"
                  onClick={() => exportAssetsToExcel(assets)}
                  disabled={assets.length === 0}
                >
                  <FileSpreadsheet size={16} /> Download Assets Excel
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => exportSubscriptionsToExcel(subscriptions)}
                  disabled={subscriptions.length === 0}
                >
                  <FileSpreadsheet size={16} /> Download Subscriptions Excel
                </AdminButton>
                <AdminButton
                  onClick={() => exportFullInventoryToExcel(assets, subscriptions)}
                  disabled={assets.length === 0 && subscriptions.length === 0}
                >
                  <FileSpreadsheet size={16} /> Download Full Inventory
                </AdminButton>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Asset Value" value={formatKES(stats.totalAssetValue)} icon={DollarSign} gradient="from-emerald-500 to-emerald-700" delay={0} />
                <StatCard title="Active Assets" value={stats.activeAssets} icon={Package} gradient="from-primary-500 to-primary-700" delay={0.1} />
                <StatCard title="Annual Subscriptions" value={formatKES(stats.annualSubCost)} icon={Monitor} gradient="from-secondary-500 to-secondary-700" delay={0.2} />
                <StatCard title="Open Challenges" value={stats.challengeCount} icon={AlertTriangle} gradient="from-amber-500 to-amber-700" delay={0.3} />
              </div>

              {stats.upcomingRenewals.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarClock size={18} className="text-amber-600" />
                    <h3 className="font-bold text-amber-900 font-montserrat">Upcoming Renewals (30 days)</h3>
                  </div>
                  <div className="space-y-2">
                    {stats.upcomingRenewals.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                        <div>
                          <p className="text-sm font-medium text-dark-800">{s.name}</p>
                          <p className="text-xs text-dark-400 capitalize">{s.subscription_type} · {s.provider || "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-dark-800">{formatDate(s.renewal_date)}</p>
                          {renewalBadge(s.renewal_date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 font-bold text-dark-900 font-montserrat">Recent Asset Purchases</h3>
                  {assets.slice(0, 5).length === 0 ? (
                    <p className="text-sm text-dark-400">No assets recorded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {assets.slice(0, 5).map((a) => (
                        <div key={a.id} className="flex items-center justify-between border-b border-dark-100 pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="text-sm font-medium text-dark-800">{a.name}</p>
                            <p className="text-xs text-dark-400">{a.model} · {a.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-dark-800">{formatKES(Number(a.cost))}</p>
                            <p className="text-xs text-dark-400">{formatDate(a.purchase_date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 font-bold text-dark-900 font-montserrat">Active Subscriptions</h3>
                  {subscriptions.filter((s) => s.status === "active").slice(0, 5).length === 0 ? (
                    <p className="text-sm text-dark-400">No subscriptions recorded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {subscriptions.filter((s) => s.status === "active").slice(0, 5).map((s) => (
                        <div key={s.id} className="flex items-center justify-between border-b border-dark-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            {s.subscription_type === "internet" ? <Wifi size={14} className="text-primary-500" /> : <Monitor size={14} className="text-secondary-500" />}
                            <div>
                              <p className="text-sm font-medium text-dark-800">{s.name}</p>
                              <p className="text-xs text-dark-400 capitalize">{s.billing_cycle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-dark-800">{formatKES(Number(s.cost))}</p>
                            <p className="text-xs text-dark-400">Renews {formatDate(s.renewal_date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ASSETS ── */}
          {tab === "assets" && !editingAsset && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative max-w-xs flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    onClick={() => exportAssetsToExcel(filteredAssets)}
                    disabled={filteredAssets.length === 0}
                  >
                    <FileSpreadsheet size={16} /> Download Excel
                  </AdminButton>
                  <AdminButton onClick={() => setEditingAsset({ ...emptyAsset })}>
                    <Plus size={16} /> Add Asset
                  </AdminButton>
                </div>
              </div>

              {filteredAssets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
                  <Package size={40} className="mx-auto text-dark-300" />
                  <p className="mt-3 text-dark-500">No assets recorded yet</p>
                  <AdminButton className="mt-4" size="sm" onClick={() => setEditingAsset({ ...emptyAsset })}>
                    <Plus size={14} /> Record first asset
                  </AdminButton>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-dark-200/60 bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-dark-100 bg-dark-50/50 text-xs font-semibold uppercase tracking-wide text-dark-500">
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Model</th>
                        <th className="px-4 py-3">Purchased</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Condition</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((a) => (
                        <tr key={a.id} className="border-b border-dark-50 transition hover:bg-dark-50/30">
                          <td className="px-4 py-3">
                            <p className="font-medium text-dark-900">{a.name}</p>
                            {a.challenges?.trim() && (
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-600">
                                <AlertTriangle size={10} /> Has challenges
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-dark-600">{a.model}</td>
                          <td className="px-4 py-3 text-dark-600">{formatDate(a.purchase_date)}</td>
                          <td className="px-4 py-3 text-dark-600">{a.department}</td>
                          <td className="px-4 py-3 font-semibold text-dark-800">{formatKES(Number(a.cost))}</td>
                          <td className="px-4 py-3">{conditionBadge(a.purchase_condition)}</td>
                          <td className="px-4 py-3">{statusBadge(a.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <AdminButton variant="outline" size="sm" onClick={() => setEditingAsset(a)}><Pencil size={14} /></AdminButton>
                              <AdminButton variant="ghost" size="sm" onClick={() => deleteAsset(a.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary-50/50 font-semibold text-dark-800">
                        <td className="px-4 py-3" colSpan={4}>Total ({filteredAssets.length} items)</td>
                        <td className="px-4 py-3">{formatKES(filteredAssets.reduce((s, a) => s + Number(a.cost), 0))}</td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "assets" && editingAsset && (
            <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-montserrat">{editingAsset.id ? "Edit Asset" : "Record New Asset"}</h3>
                <button type="button" onClick={() => setEditingAsset(null)} className="rounded-lg p-1 text-dark-400 hover:bg-dark-100"><X size={18} /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Asset Name" value={editingAsset.name || ""} onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })} placeholder="e.g. Dell Laptop" />
                <AdminInput label="Model" value={editingAsset.model || ""} onChange={(e) => setEditingAsset({ ...editingAsset, model: e.target.value })} placeholder="e.g. Latitude 5540" />
                <AdminInput label="Date of Purchase" type="date" value={editingAsset.purchase_date || ""} onChange={(e) => setEditingAsset({ ...editingAsset, purchase_date: e.target.value })} />
                <AdminSelect
                  label="Department in Use"
                  options={[
                    { value: "", label: "Select department" },
                    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
                  ]}
                  value={editingAsset.department || ""}
                  onChange={(e) => setEditingAsset({ ...editingAsset, department: e.target.value })}
                />
                <AdminInput label="Cost (KES)" type="number" min={0} value={editingAsset.cost ?? 0} onChange={(e) => setEditingAsset({ ...editingAsset, cost: Number(e.target.value) })} />
                <AdminSelect
                  label="Condition"
                  options={[
                    { value: "new", label: "New" },
                    { value: "refurbished", label: "Refurbished" },
                  ]}
                  value={editingAsset.purchase_condition || "new"}
                  onChange={(e) => setEditingAsset({ ...editingAsset, purchase_condition: e.target.value as AssetPurchaseCondition })}
                />
                <AdminInput label="Serial Number (optional)" value={editingAsset.serial_number || ""} onChange={(e) => setEditingAsset({ ...editingAsset, serial_number: e.target.value })} />
                <AdminSelect
                  label="Status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "under_repair", label: "Under Repair" },
                    { value: "retired", label: "Retired" },
                  ]}
                  value={editingAsset.status || "active"}
                  onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value as AssetStatus })}
                />
              </div>
              <AdminTextarea label="Notes" rows={2} value={editingAsset.notes || ""} onChange={(e) => setEditingAsset({ ...editingAsset, notes: e.target.value })} placeholder="Additional details for future reference..." />
              <AdminTextarea label="Challenges / Issues" rows={3} value={editingAsset.challenges || ""} onChange={(e) => setEditingAsset({ ...editingAsset, challenges: e.target.value })} placeholder="Document any problems, maintenance issues, or operational challenges..." hint="These will appear in the Challenges tab for easy reference" />
              <div className="flex gap-3">
                <AdminButton onClick={saveAsset} loading={saving}>Save Asset</AdminButton>
                <AdminButton variant="outline" onClick={() => setEditingAsset(null)}>Cancel</AdminButton>
              </div>
            </div>
          )}

          {/* ── SUBSCRIPTIONS ── */}
          {tab === "subscriptions" && !editingSub && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative max-w-xs flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    onClick={() => exportSubscriptionsToExcel(filteredSubs)}
                    disabled={filteredSubs.length === 0}
                  >
                    <FileSpreadsheet size={16} /> Download Excel
                  </AdminButton>
                  <AdminButton onClick={() => setEditingSub({ ...emptySubscription })}>
                    <Plus size={16} /> Add Subscription
                  </AdminButton>
                </div>
              </div>

              {filteredSubs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
                  <Wifi size={40} className="mx-auto text-dark-300" />
                  <p className="mt-3 text-dark-500">No subscriptions recorded yet</p>
                  <AdminButton className="mt-4" size="sm" onClick={() => setEditingSub({ ...emptySubscription })}>
                    <Plus size={14} /> Record first subscription
                  </AdminButton>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-dark-200/60 bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-dark-100 bg-dark-50/50 text-xs font-semibold uppercase tracking-wide text-dark-500">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Provider</th>
                        <th className="px-4 py-3">Acquired</th>
                        <th className="px-4 py-3">Renewal</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Cycle</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map((s) => (
                        <tr key={s.id} className="border-b border-dark-50 transition hover:bg-dark-50/30">
                          <td className="px-4 py-3">
                            <p className="font-medium text-dark-900">{s.name}</p>
                            {s.challenges?.trim() && (
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-600">
                                <AlertTriangle size={10} /> Has challenges
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                              s.subscription_type === "internet" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                            )}>
                              {s.subscription_type === "internet" ? <Wifi size={10} /> : <Monitor size={10} />}
                              {s.subscription_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-dark-600">{s.provider || "—"}</td>
                          <td className="px-4 py-3 text-dark-600">{formatDate(s.acquisition_date)}</td>
                          <td className="px-4 py-3">
                            <p className="text-dark-600">{formatDate(s.renewal_date)}</p>
                            {renewalBadge(s.renewal_date)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-dark-800">{formatKES(Number(s.cost))}</td>
                          <td className="px-4 py-3 capitalize text-dark-600">{s.billing_cycle.replace("_", " ")}</td>
                          <td className="px-4 py-3">{statusBadge(s.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <AdminButton variant="outline" size="sm" onClick={() => setEditingSub(s)}><Pencil size={14} /></AdminButton>
                              <AdminButton variant="ghost" size="sm" onClick={() => deleteSubscription(s.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "subscriptions" && editingSub && (
            <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-montserrat">{editingSub.id ? "Edit Subscription" : "Record New Subscription"}</h3>
                <button type="button" onClick={() => setEditingSub(null)} className="rounded-lg p-1 text-dark-400 hover:bg-dark-100"><X size={18} /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Name" value={editingSub.name || ""} onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })} placeholder="e.g. Safaricom Business Fiber" />
                <AdminSelect
                  label="Type"
                  options={[
                    { value: "internet", label: "Internet" },
                    { value: "software", label: "Software" },
                  ]}
                  value={editingSub.subscription_type || "internet"}
                  onChange={(e) => setEditingSub({ ...editingSub, subscription_type: e.target.value as SubscriptionType })}
                />
                <AdminInput label="Provider" value={editingSub.provider || ""} onChange={(e) => setEditingSub({ ...editingSub, provider: e.target.value })} placeholder="e.g. Safaricom, Microsoft" />
                <AdminInput label="Acquisition Date" type="date" value={editingSub.acquisition_date || ""} onChange={(e) => setEditingSub({ ...editingSub, acquisition_date: e.target.value })} />
                <AdminInput label="Renewal Date" type="date" value={editingSub.renewal_date || ""} onChange={(e) => setEditingSub({ ...editingSub, renewal_date: e.target.value })} hint="Set the next internet or license renewal date" />
                <AdminInput label="Cost (KES)" type="number" min={0} value={editingSub.cost ?? 0} onChange={(e) => setEditingSub({ ...editingSub, cost: Number(e.target.value) })} />
                <AdminSelect
                  label="Billing Cycle"
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "annual", label: "Annual" },
                    { value: "one_time", label: "One-time Purchase" },
                  ]}
                  value={editingSub.billing_cycle || "annual"}
                  onChange={(e) => setEditingSub({ ...editingSub, billing_cycle: e.target.value as SubscriptionBillingCycle })}
                />
                <AdminSelect
                  label="Status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                  value={editingSub.status || "active"}
                  onChange={(e) => setEditingSub({ ...editingSub, status: e.target.value as SubscriptionStatus })}
                />
              </div>
              <AdminTextarea label="Notes" rows={2} value={editingSub.notes || ""} onChange={(e) => setEditingSub({ ...editingSub, notes: e.target.value })} placeholder="License keys, account details reference, etc." />
              <AdminTextarea label="Challenges / Issues" rows={3} value={editingSub.challenges || ""} onChange={(e) => setEditingSub({ ...editingSub, challenges: e.target.value })} placeholder="Downtime, billing disputes, compatibility issues, renewal problems..." hint="These will appear in the Challenges tab for easy reference" />
              <div className="flex gap-3">
                <AdminButton onClick={saveSubscription} loading={saving}>Save Subscription</AdminButton>
                <AdminButton variant="outline" onClick={() => setEditingSub(null)}>Cancel</AdminButton>
              </div>
            </div>
          )}

          {/* ── CHALLENGES ── */}
          {tab === "challenges" && (
            <div className="space-y-4">
              {challengeItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
                  <AlertTriangle size={40} className="mx-auto text-dark-300" />
                  <p className="mt-3 text-dark-500">No challenges recorded yet</p>
                  <p className="mt-1 text-xs text-dark-400">Add challenges when recording assets or subscriptions to track issues here</p>
                </div>
              ) : (
                challengeItems.map((item, i) => (
                  <div key={`${item.type}-${item.id}`} className="rounded-2xl border border-amber-200/60 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          item.type === "asset" ? "bg-primary-100 text-primary-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {item.type === "asset" ? <Package size={18} /> : item.detail.startsWith("Internet") ? <Wifi size={18} /> : <Monitor size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-dark-900 font-montserrat">{item.name}</p>
                          <p className="text-xs text-dark-400">{item.detail}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                        item.type === "asset" ? "bg-primary-100 text-primary-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {item.type}
                      </span>
                    </div>
                    <div className="rounded-xl bg-amber-50/80 px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm text-dark-700">{item.challenges}</p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <AdminButton
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (item.type === "asset") {
                            const asset = assets.find((a) => a.id === item.id);
                            if (asset) { setTab("assets"); setEditingAsset(asset); }
                          } else {
                            const sub = subscriptions.find((s) => s.id === item.id);
                            if (sub) { setTab("subscriptions"); setEditingSub(sub); }
                          }
                        }}
                      >
                        <Pencil size={14} /> Edit
                      </AdminButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
