"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  MousePointerClick,
  Phone,
  UserPlus,
  Calendar,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { formatAdminDate } from "@/lib/admin/utils";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID, FACEBOOK_PIXEL_ID } from "@/lib/facebook/pixel";

type PixelEvent = {
  id: string;
  event_name: string;
  property_name: string | null;
  page_path: string | null;
  event_data: Record<string, unknown>;
  created_at: string;
};

type FacebookLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_name: string | null;
  status: string;
  created_at: string;
};

type FacebookAdsData = {
  propertyId: number;
  property: { id: number; title: string; location: string; price: string } | null;
  days: number;
  stats: Record<string, number>;
  totalEvents: number;
  recentEvents: PixelEvent[];
  recentLeads: FacebookLead[];
};

const EVENT_LABELS: Record<string, string> = {
  PageView: "Page views",
  ViewContent: "Property views",
  Contact: "Contact clicks",
  Lead: "Leads",
  Schedule: "Site visit clicks",
};

export default function AdminFacebookAdsPage() {
  const [data, setData] = useState<FacebookAdsData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = async (rangeDays: number) => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/facebook-ads?property_id=${FACEBOOK_CAMPAIGN_PROPERTY_ID}&days=${rangeDays}`
    );
    const json = await res.json();
    if (res.ok) setData(json);
    setLoading(false);
  };

  useEffect(() => {
    load(days);
  }, [days]);

  const property = data?.property;
  const stats = data?.stats ?? {};
  const landingUrl = `https://www.inukaproperties.co.ke/for-sale/${FACEBOOK_CAMPAIGN_PROPERTY_ID}`;

  return (
    <AdminShell
      title="Facebook Ads"
      subtitle="Pixel tracking for your Meta ad campaigns"
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Megaphone className="text-primary-600" size={20} />
              <h3 className="text-lg font-bold font-montserrat text-dark-900">Active campaign</h3>
            </div>
            <p className="text-sm text-dark-600">
              Pixel ID <code className="rounded bg-white px-1.5 py-0.5 text-primary-800">{FACEBOOK_PIXEL_ID}</code> is
              installed on{" "}
              <a
                href={landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-700 hover:underline"
              >
                {property?.title ?? "Tulivu Haven"}
              </a>
              . Events are sent to Meta and mirrored here for your dashboard.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
              >
                <ExternalLink size={14} />
                View landing page
              </a>
              <a
                href="https://business.facebook.com/events_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-600 hover:underline"
              >
                <ExternalLink size={14} />
                Meta Events Manager
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-dark-600">
              {property ? (
                <>
                  <span className="font-semibold text-dark-900">{property.title}</span>
                  {" · "}
                  {property.location} · {property.price}
                </>
              ) : (
                "Tulivu Haven (property 14)"
              )}
            </p>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm text-dark-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Page views" value={stats.PageView ?? 0} icon={Eye} delay={0} />
            <StatCard
              title="Property views"
              value={stats.ViewContent ?? 0}
              icon={MousePointerClick}
              gradient="from-blue-500 to-blue-700"
              delay={0.05}
            />
            <StatCard
              title="Contact clicks"
              value={stats.Contact ?? 0}
              icon={Phone}
              gradient="from-emerald-500 to-emerald-700"
              delay={0.1}
            />
            <StatCard
              title="Site visit clicks"
              value={stats.Schedule ?? 0}
              icon={Calendar}
              gradient="from-secondary-500 to-secondary-700"
              delay={0.15}
            />
            <StatCard
              title="Form leads"
              value={stats.Lead ?? 0}
              change={`${data?.recentLeads?.length ?? 0} captured leads`}
              icon={UserPlus}
              gradient="from-violet-500 to-violet-700"
              delay={0.2}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-dark-900 font-montserrat">Recent pixel events</h3>
              {!data?.recentEvents?.length ? (
                <p className="py-8 text-center text-sm text-dark-400">
                  No events yet. Visit the landing page to test tracking.
                </p>
              ) : (
                <div className="max-h-[480px] space-y-2 overflow-y-auto">
                  {data.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-dark-100 bg-dark-50/50 p-3"
                    >
                      <div className="min-w-0">
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-700">
                          {EVENT_LABELS[event.event_name] ?? event.event_name}
                        </span>
                        {event.page_path && (
                          <p className="mt-1 truncate text-xs text-dark-500">{event.page_path}</p>
                        )}
                        {event.event_data?.action ? (
                          <p className="mt-0.5 text-xs text-dark-400">
                            {String(event.event_data.action)}
                          </p>
                        ) : null}
                      </div>
                      <span className="shrink-0 text-[10px] text-dark-400">
                        {formatAdminDate(event.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-dark-900 font-montserrat">
                Facebook ad leads
              </h3>
              {!data?.recentLeads?.length ? (
                <p className="py-8 text-center text-sm text-dark-400">
                  No leads from Facebook ads yet for this property.
                </p>
              ) : (
                <div className="max-h-[480px] space-y-3 overflow-y-auto">
                  {data.recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-xl border border-dark-100 bg-dark-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-dark-900">{lead.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            lead.status === "new"
                              ? "bg-secondary-100 text-secondary-800"
                              : "bg-dark-100 text-dark-600"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-dark-500">{lead.email}</p>
                      <p className="text-xs text-dark-500">{lead.phone}</p>
                      <p className="mt-2 text-[10px] text-dark-400">
                        {formatAdminDate(lead.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
