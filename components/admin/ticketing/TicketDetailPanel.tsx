"use client";

import { useState } from "react";
import { X, User, Building2, Clock, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";
import { AdminTextarea } from "@/components/admin/AdminForm";
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

type TicketDetailPanelProps = {
  ticket: Ticket | null;
  onClose: () => void;
  onAssign: (id: string) => void;
  onResolve: (id: string) => void;
  onAddNote: (id: string, note: string) => Promise<void>;
};

export default function TicketDetailPanel({
  ticket,
  onClose,
  onAssign,
  onResolve,
  onAddNote,
}: TicketDetailPanelProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddNote = async () => {
    if (!ticket || !note.trim()) return;
    setSaving(true);
    await onAddNote(ticket.id, note.trim());
    setNote("");
    setShowNoteForm(false);
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {ticket && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#1a1f26] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded bg-sky-600 px-2 py-1 text-sm font-bold text-white">
                  #{ticket.number}
                </span>
                <div>
                  <p className="text-sm font-bold text-white font-montserrat">{ticket.requestType}</p>
                  <p className="text-[11px] text-white/50">{ticket.requestCategory}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className={statusBadgeClass(ticket.status)}>{statusLabel[ticket.status]}</span>
                <span className={priorityBadgeClass(ticket.priority)}>{priorityLabel[ticket.priority]}</span>
                <span className={alertBadgeClass(ticket.alertLevel)}>{alertLabel[ticket.alertLevel]}</span>
              </div>

              <h3 className="mb-2 text-sm font-semibold text-slate-800">Request Detail</h3>
              <p className="mb-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {ticket.requestDetail}
              </p>

              <div className="mb-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <User className="h-4 w-4 text-primary-600" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Requester</p>
                    <p className="text-sm text-slate-800">{ticket.requester}</p>
                    {ticket.requesterEmail && (
                      <p className="text-xs text-slate-500">{ticket.requesterEmail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <Building2 className="h-4 w-4 text-primary-600" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Department</p>
                    <p className="text-sm text-slate-800">{ticket.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <User className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Assignee</p>
                    <p className={cn("text-sm", ticket.assignee ? "text-slate-800" : "text-slate-400 italic")}>
                      {ticket.assignee || "Unassigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Timeline</p>
                    <p className="text-xs text-slate-600">Created {formatTicketDate(ticket.createdAt)}</p>
                    <p className="text-xs text-slate-600">Updated {formatTicketDate(ticket.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {ticket.latestNote && (
                <div className="mb-5">
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <MessageSquare className="h-4 w-4 text-sky-500" />
                    Latest Note
                  </h3>
                  <div className="rounded-xl bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
                    {ticket.latestNote}
                  </div>
                </div>
              )}

              {showNoteForm && (
                <div className="mb-4 space-y-2">
                  <AdminTextarea
                    label="Add note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <AdminButton size="sm" loading={saving} onClick={handleAddNote}>
                      Save Note
                    </AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => setShowNoteForm(false)}>
                      Cancel
                    </AdminButton>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-slate-200 p-4">
              <AdminButton size="sm" className="flex-1" onClick={() => onAssign(ticket.id)}>
                Assign
              </AdminButton>
              <AdminButton size="sm" variant="outline" className="flex-1" onClick={() => setShowNoteForm(true)}>
                Add Note
              </AdminButton>
              <AdminButton size="sm" variant="secondary" className="flex-1" onClick={() => onResolve(ticket.id)}>
                Resolve
              </AdminButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
