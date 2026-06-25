"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Building2,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  LifeBuoy,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { createClient } from "@/lib/supabase/client";
import type { Ticket, TicketingModule } from "@/lib/admin/ticketing/types";
import { statusLabel, priorityLabel, formatTicketDate } from "@/lib/admin/ticketing/utils";
import AdminButton from "@/components/admin/AdminButton";

type ModulePanelProps = {
  module: TicketingModule;
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onOpenTickets: () => void;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function TicketingModulePanel({
  module,
  tickets,
  onSelectTicket,
  onOpenTickets,
}: ModulePanelProps) {
  switch (module) {
    case "calendar":
      return <CalendarPanel tickets={tickets} onSelectTicket={onSelectTicket} />;
    case "clients":
      return <ClientsPanel tickets={tickets} onSelectTicket={onSelectTicket} />;
    case "assets":
      return <AssetsPanel />;
    case "reports":
      return <ReportsPanel tickets={tickets} />;
    case "messages":
      return <MessagesPanel tickets={tickets} onSelectTicket={onSelectTicket} />;
    case "setup":
      return <SetupPanel />;
    case "help":
      return <HelpPanel onOpenTickets={onOpenTickets} />;
    default:
      return null;
  }
}

function PanelShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="border-x border-b border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-[#f8f9fa] px-4 py-3">
        <h2 className="text-sm font-bold text-slate-800 font-montserrat">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function CalendarPanel({ tickets, onSelectTicket }: { tickets: Ticket[]; onSelectTicket: (t: Ticket) => void }) {
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, Ticket[]>();
    for (const t of tickets) {
      const d = new Date(t.updatedAt);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        map.set(day, [...(map.get(day) || []), t]);
      }
    }
    return map;
  }, [tickets, month, year]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const dayTickets = selectedDay ? eventsByDay.get(selectedDay) || [] : [];

  return (
    <PanelShell title="Calendar" subtitle="Ticket activity by update date">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="rounded-lg p-1.5 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-slate-800 font-montserrat">{MONTHS[month]} {year}</span>
            <button type="button" onClick={nextMonth} className="rounded-lg p-1.5 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const hasEvents = day !== null && eventsByDay.has(day);
              const isSelected = day === selectedDay;
              const isToday =
                day !== null &&
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();
              return (
                <button
                  key={i}
                  type="button"
                  disabled={day === null}
                  onClick={() => day && setSelectedDay(day)}
                  className={cn(
                    "relative min-h-[3rem] rounded-lg p-1 text-xs transition",
                    day === null && "invisible",
                    isSelected && "bg-primary-100 ring-2 ring-primary-400",
                    !isSelected && hasEvents && "bg-sky-50 hover:bg-sky-100",
                    !isSelected && !hasEvents && day !== null && "hover:bg-slate-50",
                    isToday && !isSelected && "font-bold text-primary-700"
                  )}
                >
                  {day}
                  {hasEvents && (
                    <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            {selectedDay ? `${MONTHS[month]} ${selectedDay}, ${year}` : "Select a day"}
          </h3>
          {selectedDay === null ? (
            <p className="text-xs text-slate-400">Click a highlighted day to view tickets.</p>
          ) : dayTickets.length === 0 ? (
            <p className="text-xs text-slate-400">No ticket activity on this day.</p>
          ) : (
            <ul className="space-y-2">
              {dayTickets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTicket(t)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-left text-xs hover:border-primary-300"
                  >
                    <span className="font-bold text-sky-600">#{t.number}</span> {t.subject || t.requestDetail.slice(0, 40)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PanelShell>
  );
}

function ClientsPanel({ tickets, onSelectTicket }: { tickets: Ticket[]; onSelectTicket: (t: Ticket) => void }) {
  const clients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string | null; tickets: Ticket[] }>();
    for (const t of tickets) {
      const key = t.requesterEmail || t.requester;
      const existing = map.get(key);
      if (existing) existing.tickets.push(t);
      else map.set(key, {
        name: t.requester,
        email: t.requesterEmail || "",
        phone: t.requesterPhone ?? null,
        tickets: [t],
      });
    }
    return Array.from(map.values()).sort((a, b) => b.tickets.length - a.tickets.length);
  }, [tickets]);

  const [search, setSearch] = useState("");
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PanelShell title="Clients" subtitle={`${clients.length} unique requesters from tickets`}>
      <input
        type="search"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
      />
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Contact</th>
              <th className="px-4 py-2.5 font-semibold">Tickets</th>
              <th className="px-4 py-2.5 font-semibold">Latest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No clients found</td></tr>
            ) : (
              filtered.map((c) => {
                const latest = c.tickets[0];
                return (
                  <tr key={c.email || c.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-primary-600">
                          <Mail className="h-3 w-3" />{c.email}
                        </a>
                      )}
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="mt-0.5 flex items-center gap-1 hover:text-primary-600">
                          <Phone className="h-3 w-3" />{c.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-700">
                        {c.tickets.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectTicket(latest)}
                        className="text-primary-600 hover:underline"
                      >
                        #{latest.number} — {statusLabel[latest.status]}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}

type PropertyAsset = { id: number; title: string; location: string; status: string };

function AssetsPanel() {
  const [properties, setProperties] = useState<PropertyAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("properties")
      .select("id, title, location, status")
      .eq("published", true)
      .order("title")
      .then(({ data }) => {
        setProperties((data as PropertyAsset[]) || []);
        setLoading(false);
      });
  }, []);

  const officeAssets = [
    { name: "Conference Room Projector", dept: "Operations", status: "Active" },
    { name: "Sales CRM Licenses", dept: "IT", status: "Active" },
    { name: "Company Vehicles (2)", dept: "Sales", status: "Active" },
    { name: "Legal Document Archive", dept: "Legal", status: "Active" },
  ];

  return (
    <PanelShell title="Assets" subtitle="Property listings and office assets linked to ticketing">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <MapPin className="h-4 w-4 text-primary-600" />
            Property Listings
          </h3>
          {loading ? (
            <div className="flex h-24 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : properties.length === 0 ? (
            <p className="text-xs text-slate-400">No published properties.</p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {properties.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <div>
                    <p className="font-medium text-slate-800">{p.title}</p>
                    <p className="text-slate-500">{p.location}</p>
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-emerald-700">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={adminPath("properties")}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
          >
            Manage listings <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Building2 className="h-4 w-4 text-primary-600" />
            Office &amp; IT Assets
          </h3>
          <ul className="space-y-2">
            {officeAssets.map((a) => (
              <li key={a.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <div>
                  <p className="font-medium text-slate-800">{a.name}</p>
                  <p className="text-slate-500">{a.dept}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{a.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelShell>
  );
}

function ReportsPanel({ tickets }: { tickets: Ticket[] }) {
  const byStatus = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of tickets) m[t.status] = (m[t.status] || 0) + 1;
    return m;
  }, [tickets]);

  const byPriority = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of tickets) m[t.priority] = (m[t.priority] || 0) + 1;
    return m;
  }, [tickets]);

  const byDept = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of tickets) m[t.department] = (m[t.department] || 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const maxStatus = Math.max(...Object.values(byStatus), 1);

  return (
    <PanelShell title="Reports" subtitle="Ticket volume and performance breakdown">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-500">By Status</h3>
          <div className="space-y-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status}>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="capitalize text-slate-700">{statusLabel[status as keyof typeof statusLabel] || status}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-500">By Priority</h3>
          <div className="space-y-2">
            {Object.entries(byPriority).map(([p, count]) => (
              <div key={p} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span>{priorityLabel[p as keyof typeof priorityLabel] || p}</span>
                <span className="font-bold text-slate-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-500">By Department</h3>
          <div className="space-y-2">
            {byDept.map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span>{dept}</span>
                <span className="font-bold text-slate-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total tickets", value: tickets.length },
          { label: "Open", value: tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length },
          { label: "Flagged", value: tickets.filter((t) => t.isFlagged).length },
          { label: "Unread", value: tickets.filter((t) => t.isUnread).length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gradient-to-br from-primary-50 to-white p-4 ring-1 ring-primary-100">
            <p className="text-[10px] font-semibold uppercase text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 font-montserrat">{s.value}</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function MessagesPanel({ tickets, onSelectTicket }: { tickets: Ticket[]; onSelectTicket: (t: Ticket) => void }) {
  const threads = useMemo(
    () =>
      tickets
        .filter((t) => t.latestNote || t.isUnread)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [tickets]
  );

  return (
    <PanelShell title="Messages" subtitle="Latest notes and unread ticket updates">
      {threads.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-slate-400">
          <Inbox className="mb-2 h-10 w-10" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelectTicket(t)}
                className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-sky-50/50"
              >
                <div className="relative shrink-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                    {t.requester.slice(0, 2).toUpperCase()}
                  </span>
                  {t.isUnread && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {t.requester}
                      <span className="ml-2 text-xs font-normal text-sky-600">#{t.number}</span>
                    </p>
                    <span className="shrink-0 text-[10px] text-slate-400">{formatTicketDate(t.updatedAt)}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{t.subject || t.requestType}</p>
                  {t.latestNote && (
                    <p className="mt-1 line-clamp-2 rounded-lg bg-sky-50 px-2 py-1 text-[11px] text-sky-900">
                      {t.latestNote}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}

function SetupPanel() {
  const inboundEmail = process.env.NEXT_PUBLIC_TICKETS_INBOUND_EMAIL || "tickets@inukaproperties.co.ke";

  return (
    <PanelShell title="Setup" subtitle="Ticketing configuration and integrations">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Mail className="h-4 w-4 text-primary-600" />
            Inbound Email
          </h3>
          <p className="mb-2 text-xs text-slate-600">
            Emails sent to this address are automatically converted into tickets.
          </p>
          <code className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">
            {inboundEmail}
          </code>
          <p className="mt-2 text-[10px] text-slate-400">
            Configure in Resend → Domains → Inbound, webhook → /api/webhooks/inbound-email
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Settings className="h-4 w-4 text-primary-600" />
            Quick Links
          </h3>
          <div className="space-y-2">
            {[
              { label: "Email Automation", href: adminPath("email") },
              { label: "SMS Settings", href: adminPath("sms") },
              { label: "Site Settings", href: adminPath("settings") },
              { label: "Inquiries", href: adminPath("inquiries") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Request Categories</h3>
          <p className="mb-3 text-xs text-slate-500">
            Categories are managed in Supabase (<code className="text-[10px]">ticket_categories</code> table).
            Run the ticketing migration SQL to seed default types.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Property Inquiry", "Legal Dept Request", "Finance Request", "IT Request", "Marketing Request", "Facilities Request"].map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function HelpPanel({ onOpenTickets }: { onOpenTickets: () => void }) {
  const faqs = [
    {
      q: "How do I create a new ticket?",
      a: 'Go to Tickets → click "New Ticket" in the toolbar, fill in the requester details and submit.',
    },
    {
      q: "How do emails become tickets?",
      a: "When a client emails your support address (tickets@inukaproperties.co.ke), Resend forwards it to the inbound webhook and a ticket is created automatically.",
    },
    {
      q: "How do I assign or resolve a ticket?",
      a: "Click any ticket row to open the detail panel. Use Assign, Add Note, or Resolve at the bottom.",
    },
    {
      q: "What is the difference between Inquiries and Ticketing?",
      a: "Inquiries are public contact form submissions. Ticketing is your internal help desk for tracking all requests, including email and manual entries.",
    },
  ];

  return (
    <PanelShell title="Help" subtitle="IAPL Ticketing guide and support">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <BookOpen className="h-4 w-4 text-primary-600" />
            Frequently Asked Questions
          </h3>
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-800 marker:content-none">
                {f.q}
              </summary>
              <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-primary-50 to-white p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
            <LifeBuoy className="h-4 w-4 text-primary-600" />
            Need more help?
          </h3>
          <p className="mb-4 text-xs text-slate-600">
            Contact the IAPL IT team or review the Supabase ticketing migration for backend setup.
          </p>
          <div className="flex flex-wrap gap-2">
            <AdminButton size="sm" onClick={onOpenTickets}>
              Back to Tickets
            </AdminButton>
            <a href="mailto:support@inukaproperties.co.ke">
              <AdminButton size="sm" variant="outline">Email Support</AdminButton>
            </a>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
