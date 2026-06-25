"use client";

import {
  Ticket,
  Calendar,
  Users,
  Building2,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  LayoutDashboard,
  User,
  UsersRound,
  Flag,
  Clock,
  Search,
  CheckSquare,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Columns3,
  Pencil,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import type { TicketCounts, TicketView, TicketingModule } from "@/lib/admin/ticketing/types";

const MODULE_IDS: TicketingModule[] = [
  "tickets", "calendar", "clients", "assets", "reports", "messages", "setup", "help",
];

const MODULE_META: Record<TicketingModule, { label: string; icon: typeof Ticket }> = {
  tickets: { label: "Tickets", icon: Ticket },
  calendar: { label: "Calendar", icon: Calendar },
  clients: { label: "Clients", icon: Users },
  assets: { label: "Assets", icon: Building2 },
  reports: { label: "Reports", icon: BarChart3 },
  messages: { label: "Messages", icon: MessageSquare },
  setup: { label: "Setup", icon: Settings },
  help: { label: "Help", icon: HelpCircle },
};

type SubNavItem = {
  id: TicketView;
  label: string;
  icon: typeof LayoutDashboard;
  count?: number;
};

function buildSubNavItems(counts: TicketCounts): SubNavItem[] {
  return [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my_tickets", label: "My Tickets", icon: User, count: counts.myTickets },
    { id: "group_tickets", label: "Group Tickets", icon: UsersRound, count: counts.groupTickets },
    { id: "flagged", label: "Flagged Tickets", icon: Flag, count: counts.flagged },
    { id: "recent", label: "Recent Tickets", icon: Clock },
    { id: "search", label: "Search Tickets", icon: Search },
    { id: "approvals", label: "My Approvals", icon: CheckSquare },
  ];
}

type TicketingModuleBarProps = {
  activeModule: TicketingModule;
  onModuleChange: (module: TicketingModule) => void;
  activeView: TicketView;
  onViewChange: (view: TicketView) => void;
  counts: TicketCounts;
};

export function TicketingModuleBar({
  activeModule,
  onModuleChange,
  activeView,
  onViewChange,
  counts,
}: TicketingModuleBarProps) {
  const subNavItems = buildSubNavItems(counts);
  const messageBadge = counts.messages;
  const showTicketSubNav = activeModule === "tickets";

  return (
    <div className="overflow-hidden rounded-t-xl border border-slate-700/50 bg-[#1a1f26] shadow-lg">
      <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
        <div className="mr-4 flex shrink-0 items-center gap-2 border-r border-white/10 pr-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
            <Ticket className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white font-montserrat">
            IAPL Ticketing
          </span>
        </div>
        {MODULE_IDS.map((id) => {
          const mod = MODULE_META[id];
          const Icon = mod.icon;
          const isActive = activeModule === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onModuleChange(id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition",
                isActive
                  ? "text-white after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-secondary-400"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {mod.label}
              {id === "messages" && messageBadge > 0 ? (
                <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {messageBadge > 99 ? "99+" : messageBadge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {showTicketSubNav ? (
        <div className="flex items-center gap-0.5 overflow-x-auto border-t border-white/5 bg-[#252b33] px-2">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-t-md px-3 py-2.5 text-xs font-medium transition",
                  isActive
                    ? "bg-[#3a4149] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
                {item.count !== undefined ? (
                  <span className={cn("text-[10px]", isActive ? "text-secondary-300" : "text-white/40")}>
                    ({item.count})
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="border-t border-white/5 bg-[#252b33] px-4 py-2.5">
          <p className="text-xs text-white/50">
            {MODULE_META[activeModule].label} module — use the tabs above to switch sections
          </p>
        </div>
      )}
    </div>
  );
}

type TicketingToolbarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  onNewTicket: () => void;
  onRefresh: () => void;
  loading?: boolean;
  selectedCount: number;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function TicketingToolbar({
  query,
  onQueryChange,
  showFilter,
  onToggleFilter,
  onNewTicket,
  onRefresh,
  loading,
  selectedCount,
  totalCount,
  page,
  pageSize,
  onPageChange,
}: TicketingToolbarProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center gap-2 border-x border-b border-slate-200 bg-[#eef0f2] px-3 py-2">
      <button
        type="button"
        onClick={onNewTicket}
        className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Plus className="h-3.5 w-3.5 text-primary-600" />
        New Ticket
      </button>
      <button
        type="button"
        onClick={onToggleFilter}
        className={cn(
          "inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold shadow-sm transition",
          showFilter
            ? "border-primary-300 bg-primary-50 text-primary-700"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        <Filter className="h-3.5 w-3.5" />
        {showFilter ? "Hide Filter" : "Show Filter"}
      </button>

      <button
        type="button"
        className="rounded border border-slate-300 bg-white p-1.5 text-slate-500 shadow-sm transition hover:bg-slate-50"
        aria-label="Settings"
      >
        <Settings2 className="h-3.5 w-3.5" />
      </button>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {selectedCount > 0 && (
          <span className="text-xs text-slate-500">{selectedCount} selected</span>
        )}
        <span className="text-xs text-slate-500">
          {start}–{end} of {totalCount}
        </span>

        <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm">
          <option>100</option>
          <option>50</option>
          <option>25</option>
        </select>
        <span className="text-xs text-slate-500">Items</span>

        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Query"
          className="w-32 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
        />

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="rounded border border-slate-300 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="First page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded border border-slate-300 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded border border-slate-300 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="rounded border border-slate-300 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="Last page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm">
          <option>5 min</option>
          <option>1 min</option>
          <option>Off</option>
        </select>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          Refresh
        </button>

        <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm">
          <option>Default Columns</option>
          <option>Compact View</option>
          <option>Full Detail</option>
        </select>
        <span className="text-xs text-slate-500">Column Set</span>

        <button
          type="button"
          className="rounded border border-slate-300 bg-white p-1.5 text-slate-500 shadow-sm transition hover:bg-slate-50"
          aria-label="Edit columns"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white p-1.5 text-slate-500 shadow-sm transition hover:bg-slate-50"
          aria-label="Add column"
        >
          <Columns3 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

type FilterPanelProps = {
  statusFilter: string;
  priorityFilter: string;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
};

export function TicketingFilterPanel({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: FilterPanelProps) {
  return (
    <div className="grid gap-3 border-x border-b border-slate-200 bg-white px-4 py-3 sm:grid-cols-4">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="assigned">Assigned</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Priority
        </label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Department
        </label>
        <select className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-700">
          <option value="all">All departments</option>
          <option value="sales">Sales</option>
          <option value="legal">Legal</option>
          <option value="finance">Finance</option>
          <option value="it">IT</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Assignee
        </label>
        <select className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-700">
          <option value="all">Anyone</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
    </div>
  );
}
