import type { AlertLevel, TicketPriority, TicketStatus } from "./types";
import { cn } from "@/lib/admin/utils";

export function formatTicketDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const statusLabel: Record<TicketStatus, string> = {
  new: "New",
  assigned: "Assigned",
  pending: "Pending",
  approved: "Approved",
  resolved: "Resolved",
  closed: "Closed",
};

export const priorityLabel: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const alertLabel: Record<AlertLevel, string> = {
  on_track: "On track",
  due_soon: "Due soon",
  not_completed: "Not completed",
  overdue: "Overdue",
};

export function statusBadgeClass(status: TicketStatus): string {
  return cn(
    "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold",
    status === "assigned" && "bg-emerald-600 text-white",
    status === "new" && "bg-sky-600 text-white",
    status === "pending" && "text-slate-700",
    status === "approved" && "text-slate-700",
    status === "resolved" && "text-slate-600",
    status === "closed" && "text-slate-500"
  );
}

export function priorityBadgeClass(priority: TicketPriority): string {
  return cn(
    "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold",
    priority === "low" && "bg-slate-100 text-slate-600",
    priority === "medium" && "bg-slate-400 text-white",
    priority === "high" && "bg-red-600 text-white",
    priority === "urgent" && "border border-slate-400 bg-white text-slate-800"
  );
}

export function alertBadgeClass(level: AlertLevel): string {
  return cn(
    "inline-flex items-center rounded px-2.5 py-1 text-[11px] font-semibold",
    level === "on_track" && "bg-emerald-100 text-emerald-700",
    level === "due_soon" && "bg-amber-100 text-amber-800",
    level === "not_completed" && "bg-red-600 text-white",
    level === "overdue" && "bg-orange-500 text-white"
  );
}
