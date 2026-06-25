import type { TicketRow } from "@/lib/supabase/types";
import type { Ticket } from "@/lib/admin/ticketing/types";

export function mapTicketRow(row: TicketRow): Ticket {
  return {
    id: row.id,
    number: row.number,
    isUnread: row.is_unread,
    isFlagged: row.is_flagged,
    updatedAt: row.updated_at,
    requestType: row.request_type,
    requestCategory: row.request_category,
    requestDetail: row.description || row.subject,
    latestNote: row.latest_note,
    status: row.status,
    priority: row.priority,
    alertLevel: row.alert_level,
    assignee: row.assignee?.full_name ?? null,
    assigneeId: row.assignee_id,
    requester: row.requester_name,
    requesterEmail: row.requester_email,
    requesterPhone: row.requester_phone,
    department: row.department || "General",
    subject: row.subject,
    source: row.source,
    createdAt: row.created_at,
  };
}

export function mapTicketRows(rows: TicketRow[]): Ticket[] {
  return rows.map(mapTicketRow);
}
