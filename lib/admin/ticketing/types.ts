export type TicketStatus =
  | "new"
  | "assigned"
  | "pending"
  | "approved"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type AlertLevel = "on_track" | "due_soon" | "not_completed" | "overdue";

export type TicketView =
  | "dashboard"
  | "my_tickets"
  | "group_tickets"
  | "flagged"
  | "recent"
  | "search"
  | "approvals";

export type TicketingModule =
  | "tickets"
  | "calendar"
  | "clients"
  | "assets"
  | "reports"
  | "messages"
  | "setup"
  | "help";

export type Ticket = {
  id: string;
  number: number;
  isUnread: boolean;
  isFlagged: boolean;
  updatedAt: string;
  requestType: string;
  requestCategory: string;
  requestDetail: string;
  latestNote: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  alertLevel: AlertLevel;
  assignee: string | null;
  assigneeId?: string | null;
  requester: string;
  requesterEmail?: string;
  requesterPhone?: string | null;
  department: string;
  subject?: string;
  source?: string;
  createdAt: string;
};

export type TicketCounts = {
  myTickets: number;
  groupTickets: number;
  flagged: number;
  messages: number;
};
