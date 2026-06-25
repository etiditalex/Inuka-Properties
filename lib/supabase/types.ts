export type PropertyStatus = "available" | "ongoing" | "sold";
export type ContentStatus = "draft" | "published";
export type InquiryStatus = "new" | "read" | "responded" | "archived";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor" | "viewer";
  phone: string | null;
  job_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  price_amount: number | null;
  size: string;
  bedrooms: number | null;
  image: string;
  gallery: string[];
  status: PropertyStatus;
  featured: boolean;
  features: string[];
  description: string | null;
  h1: string | null;
  map_link: string | null;
  pricing: Record<string, string>;
  payment_plan: string | Record<string, string> | null;
  quick_info: Record<string, string>;
  total_units: number;
  sold_units: number;
  auto_sold_out: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  slug: string;
  content_html: string | null;
  hero_title: string | null;
  hero_image_alt: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  published_at: string;
  category: string;
  image: string;
  featured: boolean;
  details: string[];
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface MarketResearchReport {
  id: number;
  title: string;
  description: string;
  report_date: string;
  report_type: string;
  file_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketResearchInsight {
  id: number;
  icon: string;
  title: string;
  value: string;
  description: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_id: number | null;
  property_name: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface ClientTestimonial {
  id: number;
  name: string;
  location: string;
  property: string;
  rating: number;
  text: string;
  image: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadItem {
  id: number;
  title: string;
  file_url: string;
  parent_id: number | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryVideo {
  id: number;
  youtube_id: string;
  title: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterIssue {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  published_at: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type NewsletterSubscriberStatus = "active" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterSubscriberStatus;
  subscribed_at: string;
  updated_at: string;
}

export interface DashboardStats {
  properties: number;
  availableProperties: number;
  soldProperties: number;
  blogs: number;
  news: number;
  newInquiries: number;
  newLeads: number;
}

export type TicketStatus = "new" | "assigned" | "pending" | "approved" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketAlertLevel = "on_track" | "due_soon" | "not_completed" | "overdue";
export type TicketSource = "manual" | "email" | "contact_form" | "inquiry" | "api";

export interface TicketRow {
  id: string;
  number: number;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  request_type: string;
  request_category: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  alert_level: TicketAlertLevel;
  department: string | null;
  assignee_id: string | null;
  is_flagged: boolean;
  is_unread: boolean;
  latest_note: string | null;
  source: TicketSource;
  source_reference: string | null;
  inbound_email_id: string | null;
  due_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  assignee?: { full_name: string | null } | null;
}

export interface TicketNoteRow {
  id: string;
  ticket_id: string;
  author_id: string | null;
  author_name: string | null;
  body: string;
  is_internal: boolean;
  source: "admin" | "email" | "system";
  created_at: string;
}

export interface TicketCategoryRow {
  id: number;
  parent_id: number | null;
  name: string;
  department: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface TicketInboundEmailRow {
  id: string;
  provider: string;
  provider_message_id: string;
  from_email: string;
  to_email: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  ticket_id: string | null;
  status: "processed" | "duplicate" | "failed" | "ignored";
  error_message: string | null;
  created_at: string;
}
