"use client";

import { Flag } from "lucide-react";
import { cn } from "@/lib/admin/utils";
import type { Ticket } from "@/lib/admin/ticketing/types";
import {
  alertBadgeClass,
  alertLabel,
  formatTicketDate,
  priorityBadgeClass,
  priorityLabel,
  statusBadgeClass,
  statusLabel,
} from "@/lib/admin/ticketing/utils";

type TicketTableProps = {
  tickets: Ticket[];
  selectedIds: Set<string>;
  activeId: string | null;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onToggleFlag: (id: string) => void;
};

export default function TicketTable({
  tickets,
  selectedIds,
  activeId,
  onToggleSelect,
  onToggleSelectAll,
  onSelectTicket,
  onToggleFlag,
}: TicketTableProps) {
  const allSelected = tickets.length > 0 && tickets.every((t) => selectedIds.has(t.id));

  return (
    <div className="overflow-x-auto border-x border-b border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-[#f4f5f6]">
            <th className="w-8 px-2 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 text-primary-600"
                aria-label="Select all tickets"
              />
            </th>
            <th className="w-4 px-1 py-2.5" />
            <th className="px-2 py-2.5 font-semibold text-slate-600">No.</th>
            <th className="w-8 px-2 py-2.5" />
            <th className="px-2 py-2.5 font-semibold text-slate-600">Updated</th>
            <th className="px-2 py-2.5 font-semibold text-slate-600">Request Type</th>
            <th className="min-w-[200px] px-2 py-2.5 font-semibold text-slate-600">Request Detail</th>
            <th className="min-w-[180px] px-2 py-2.5 font-semibold text-slate-600">Latest Notes</th>
            <th className="px-2 py-2.5 font-semibold text-slate-600">Status</th>
            <th className="px-2 py-2.5 font-semibold text-slate-600">Priority</th>
            <th className="px-2 py-2.5 font-semibold text-slate-600">Alert Level</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-16 text-center text-sm text-slate-400">
                No tickets match your filters
              </td>
            </tr>
          ) : (
            tickets.map((ticket, idx) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={cn(
                  "cursor-pointer border-b border-slate-100 transition hover:bg-sky-50/60",
                  idx % 2 === 1 && "bg-slate-50/50",
                  activeId === ticket.id && "bg-sky-50 ring-1 ring-inset ring-sky-200"
                )}
              >
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(ticket.id)}
                    onChange={() => onToggleSelect(ticket.id)}
                    className="rounded border-slate-300 text-primary-600"
                    aria-label={`Select ticket ${ticket.number}`}
                  />
                </td>
                <td className="px-1 py-2">
                  {ticket.isUnread && (
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-500" title="Unread" />
                  )}
                </td>
                <td className="px-2 py-2">
                  <span className="inline-flex min-w-[2rem] items-center justify-center rounded bg-sky-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {ticket.number}
                  </span>
                </td>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleFlag(ticket.id)}
                    className={cn(
                      "rounded p-0.5 transition",
                      ticket.isFlagged ? "text-amber-500" : "text-slate-300 hover:text-amber-400"
                    )}
                    aria-label={ticket.isFlagged ? "Unflag ticket" : "Flag ticket"}
                  >
                    <Flag className="h-3.5 w-3.5" fill={ticket.isFlagged ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                  {formatTicketDate(ticket.updatedAt)}
                </td>
                <td className="px-2 py-2">
                  <p className="font-medium text-slate-800">{ticket.requestType}</p>
                  <p className="text-[10px] text-slate-500">&gt; {ticket.requestCategory}</p>
                </td>
                <td className="px-2 py-2">
                  <p className="line-clamp-2 text-slate-700">{ticket.requestDetail}</p>
                </td>
                <td className="px-2 py-2">
                  {ticket.latestNote ? (
                    <div className="relative rounded-lg bg-sky-100 px-2.5 py-1.5 text-[11px] leading-snug text-sky-900">
                      <span className="absolute -left-1 top-2 h-0 w-0 border-y-[5px] border-r-[6px] border-y-transparent border-r-sky-100" />
                      <span className="line-clamp-2">{ticket.latestNote}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-2 py-2">
                  <span className={statusBadgeClass(ticket.status)}>{statusLabel[ticket.status]}</span>
                </td>
                <td className="px-2 py-2">
                  <span className={priorityBadgeClass(ticket.priority)}>
                    {priorityLabel[ticket.priority]}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={alertBadgeClass(ticket.alertLevel)}>
                    {alertLabel[ticket.alertLevel]}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
