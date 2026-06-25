"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mapTicketRow, mapTicketRows } from "@/lib/admin/ticketing/map";
import type { Ticket as TicketType, TicketCounts, TicketView, TicketingModule } from "@/lib/admin/ticketing/types";
import type { TicketRow } from "@/lib/supabase/types";
import {
  TicketingFilterPanel,
  TicketingModuleBar,
  TicketingToolbar,
} from "./TicketingChrome";
import TicketTable from "./TicketTable";
import TicketDetailPanel from "./TicketDetailPanel";
import NewTicketModal from "./NewTicketModal";
import { TicketingModulePanel } from "./TicketingModules";
import StatCard from "@/components/admin/StatCard";

const DEFAULT_COUNTS: TicketCounts = {
  myTickets: 0,
  groupTickets: 0,
  flagged: 0,
  messages: 0,
};

const TICKET_SELECT = "*, assignee:profiles!assignee_id(full_name)";

function filterByView(tickets: TicketType[], view: TicketView): TicketType[] {
  switch (view) {
    case "recent":
      return [...tickets].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    default:
      return tickets;
  }
}

function TicketingDashboardView({ tickets }: { tickets: TicketType[] }) {
  const stats = useMemo(() => {
    const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
    const overdue = tickets.filter((t) => t.alertLevel === "overdue").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const unassigned = tickets.filter((t) => !t.assignee).length;
    return { open, overdue, resolved, unassigned };
  }, [tickets]);

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Open Tickets" value={stats.open} icon={Ticket} change={`${tickets.length} total`} gradient="from-primary-500 to-primary-700" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} change="Needs attention" gradient="from-secondary-500 to-secondary-700" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} change="This period" gradient="from-emerald-500 to-emerald-700" />
        <StatCard title="Unassigned" value={stats.unassigned} icon={Clock} change="Awaiting assignee" gradient="from-accent-500 to-accent-700" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 font-montserrat">Ticket Activity</h3>
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            Live from database
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Open tickets", value: String(stats.open) },
            { label: "Flagged", value: String(tickets.filter((t) => t.isFlagged).length) },
            { label: "Unread", value: String(tickets.filter((t) => t.isUnread).length) },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-slate-800 font-montserrat">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-bold text-slate-800 font-montserrat">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {tickets.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3">
              <span className="inline-flex min-w-[2rem] items-center justify-center rounded bg-sky-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {t.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-800">{t.requestDetail}</p>
                <p className="text-[10px] text-slate-400">{t.requestType}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">
                {new Date(t.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TicketingDashboard() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [counts, setCounts] = useState<TicketCounts>(DEFAULT_COUNTS);
  const [activeModule, setActiveModule] = useState<TicketingModule>("tickets");
  const [activeView, setActiveView] = useState<TicketView>("group_tickets");
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTicket, setActiveTicket] = useState<TicketType | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ view: activeModule === "tickets" ? activeView : "group_tickets" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (priorityFilter !== "all") params.set("priority", priorityFilter);
    if (query.trim()) params.set("q", query.trim());

    try {
      const res = await fetch(`/api/admin/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(mapTicketRows((data.tickets as TicketRow[]) || []));
        if (data.counts) setCounts(data.counts as TicketCounts);
      } else {
        await loadTicketsDirect();
      }
    } catch {
      await loadTicketsDirect();
    }
    setLoading(false);
  }, [activeModule, activeView, statusFilter, priorityFilter, query]);

  const loadTicketsDirect = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("tickets")
      .select(TICKET_SELECT)
      .order("updated_at", { ascending: false });
    if (data) setTickets(mapTicketRows(data as TicketRow[]));
  };

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tickets-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => loadTickets())
      .on("postgres_changes", { event: "*", schema: "public", table: "ticket_notes" }, () => loadTickets())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTickets]);

  const filtered = useMemo(() => {
    let result = filterByView(tickets, activeView);
    if (activeView === "search" && !query.trim()) return [];
    return result;
  }, [tickets, activeView, query]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const patchTicket = async (id: string, updates: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      const mapped = mapTicketRow(data.ticket as TicketRow);
      setTickets((prev) => prev.map((t) => (t.id === id ? mapped : t)));
      if (activeTicket?.id === id) setActiveTicket(mapped);
      loadTickets();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (paginated.every((t) => selectedIds.has(t.id))) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((t) => next.add(t.id));
        return next;
      });
    }
  };

  const toggleFlag = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket) patchTicket(id, { is_flagged: !ticket.isFlagged });
  };

  const handleSelectTicket = (ticket: TicketType) => {
    setActiveTicket(ticket);
    if (ticket.isUnread) patchTicket(ticket.id, { is_unread: false });
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-slate-200/80">
      <TicketingModuleBar
        activeModule={activeModule}
        onModuleChange={(m) => { setActiveModule(m); setPage(1); }}
        activeView={activeView}
        counts={counts}
        onViewChange={(v) => { setActiveView(v); setPage(1); }}
      />

      {activeModule !== "tickets" ? (
        <TicketingModulePanel
          module={activeModule}
          tickets={tickets}
          onSelectTicket={(t) => {
            setActiveModule("tickets");
            handleSelectTicket(t);
          }}
          onOpenTickets={() => setActiveModule("tickets")}
        />
      ) : activeView === "dashboard" ? (
        <div className="border-x border-b border-slate-200 bg-white">
          {loading && tickets.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : (
            <TicketingDashboardView tickets={tickets} />
          )}
        </div>
      ) : (
        <>
          <TicketingToolbar
            query={query}
            onQueryChange={(q) => { setQuery(q); setPage(1); }}
            showFilter={showFilter}
            onToggleFilter={() => setShowFilter((f) => !f)}
            onNewTicket={() => setShowNewTicket(true)}
            onRefresh={loadTickets}
            loading={loading}
            selectedCount={selectedIds.size}
            totalCount={filtered.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
          />

          {showFilter && (
            <TicketingFilterPanel
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
              onPriorityChange={(v) => { setPriorityFilter(v); setPage(1); }}
            />
          )}

          {loading && tickets.length === 0 ? (
            <div className="flex h-48 items-center justify-center border-x border-b border-slate-200 bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : (
            <TicketTable
              tickets={paginated}
              selectedIds={selectedIds}
              activeId={activeTicket?.id ?? null}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onSelectTicket={handleSelectTicket}
              onToggleFlag={toggleFlag}
            />
          )}
        </>
      )}

      <TicketDetailPanel
        ticket={activeTicket}
        onClose={() => setActiveTicket(null)}
        onAssign={(id) => patchTicket(id, { status: "assigned" })}
        onResolve={(id) => patchTicket(id, { status: "resolved", alert_level: "on_track" })}
        onAddNote={async (id, note) => {
          await fetch(`/api/admin/tickets/${id}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: note }),
          });
          loadTickets();
        }}
      />

      <NewTicketModal
        open={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onCreated={loadTickets}
      />
    </div>
  );
}
