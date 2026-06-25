-- IAPL Ticketing — help desk tables, notes, inbound email & public support form
-- Run in Supabase SQL Editor or via migration
--
-- Public form (/support) → POST /api/support/tickets → inserts into `tickets`
--   source = 'contact_form', plus a row in `ticket_notes`
-- Inbound email → POST /api/webhooks/inbound-email → inserts into `tickets`
--   source = 'email', logged in `ticket_inbound_emails`

-- ─── Ticket number sequence ───────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START WITH 100;

-- ─── Request type categories ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_categories (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES ticket_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  department TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tickets ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT NOT NULL UNIQUE DEFAULT nextval('ticket_number_seq'),
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  request_type TEXT NOT NULL,
  request_category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'assigned', 'pending', 'approved', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  alert_level TEXT NOT NULL DEFAULT 'not_completed'
    CHECK (alert_level IN ('on_track', 'due_soon', 'not_completed', 'overdue')),
  department TEXT,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  is_unread BOOLEAN NOT NULL DEFAULT TRUE,
  latest_note TEXT,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'email', 'contact_form', 'inquiry', 'api')),
  source_reference TEXT,
  inbound_email_id TEXT,
  due_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_updated ON tickets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_flagged ON tickets(is_flagged) WHERE is_flagged = TRUE;
CREATE INDEX IF NOT EXISTS idx_tickets_inbound_email ON tickets(inbound_email_id) WHERE inbound_email_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_source ON tickets(source);
CREATE INDEX IF NOT EXISTS idx_tickets_requester_email ON tickets(requester_email);

-- ─── Ticket notes / activity ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  body TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT TRUE,
  source TEXT NOT NULL DEFAULT 'admin'
    CHECK (source IN ('admin', 'email', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_notes_ticket ON ticket_notes(ticket_id, created_at DESC);

-- ─── Inbound email log (dedupe + audit) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_inbound_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT NOT NULL UNIQUE,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'processed'
    CHECK (status IN ('processed', 'duplicate', 'failed', 'ignored')),
  error_message TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_inbound_emails_created ON ticket_inbound_emails(created_at DESC);

-- ─── Triggers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_ticket_latest_note()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tickets
  SET
    latest_note = NEW.body,
    updated_at = NOW()
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_note_sync ON ticket_notes;
CREATE TRIGGER trg_ticket_note_sync
  AFTER INSERT ON ticket_notes
  FOR EACH ROW
  EXECUTE FUNCTION sync_ticket_latest_note();

DROP TRIGGER IF EXISTS trg_tickets_updated ON tickets;
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-resolve timestamp
CREATE OR REPLACE FUNCTION sync_ticket_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('resolved', 'closed') AND (OLD.status IS NULL OR OLD.status NOT IN ('resolved', 'closed')) THEN
    NEW.resolved_at := NOW();
  ELSIF NEW.status NOT IN ('resolved', 'closed') THEN
    NEW.resolved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_resolved ON tickets;
CREATE TRIGGER trg_ticket_resolved
  BEFORE UPDATE OF status ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION sync_ticket_resolved_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access ticket categories" ON ticket_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access tickets" ON tickets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access ticket notes" ON ticket_notes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read inbound emails" ON ticket_inbound_emails
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role inserts inbound emails via API (bypasses RLS)

-- ─── Seed categories ──────────────────────────────────────────────────────────
INSERT INTO ticket_categories (name, department, sort_order)
SELECT v.name, v.department, v.sort_order
FROM (VALUES
  ('Property Inquiry', 'Sales', 1),
  ('Legal Dept Request', 'Legal', 2),
  ('Finance Request', 'Finance', 3),
  ('IT Request', 'IT', 4),
  ('Marketing Request', 'Marketing', 5),
  ('Facilities Request', 'Operations', 6)
) AS v(name, department, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM ticket_categories LIMIT 1);

INSERT INTO ticket_categories (parent_id, name, department, sort_order)
SELECT p.id, c.name, c.department, c.sort_order
FROM ticket_categories p
CROSS JOIN (VALUES
  ('Property Inquiry', 'Site Visit Request', 'Sales', 1),
  ('Property Inquiry', 'Pricing & Availability', 'Sales', 2),
  ('Property Inquiry', 'Diaspora Client', 'Sales', 3),
  ('Legal Dept Request', 'General Inquiry', 'Legal', 1),
  ('Legal Dept Request', 'Contract Review', 'Legal', 2),
  ('Legal Dept Request', 'Compliance', 'Legal', 3),
  ('Finance Request', 'Payment Confirmation', 'Finance', 1),
  ('Finance Request', 'Refund Processing', 'Finance', 2),
  ('IT Request', 'Software Support', 'IT', 1),
  ('IT Request', 'Hardware', 'IT', 2),
  ('Marketing Request', 'Campaign Assets', 'Marketing', 1),
  ('Facilities Request', 'Office Maintenance', 'Operations', 1)
) AS c(parent_name, name, department, sort_order)
WHERE p.name = c.parent_name AND p.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM ticket_categories child
    WHERE child.parent_id = p.id AND child.name = c.name
  );

-- ─── Sample tickets (only when table is empty) ────────────────────────────────
INSERT INTO tickets (
  requester_name, requester_email, request_type, request_category,
  subject, description, status, priority, alert_level, department, is_unread, latest_note
)
SELECT * FROM (VALUES
  (
    'James Ochieng', 'james@example.com',
    'Legal Dept Request', 'General Inquiry',
    'Title deed verification — Plot 47, Karen',
    'Title deed verification for Plot 47, Karen — client awaiting clearance letter',
    'assigned', 'high', 'not_completed', 'Sales', TRUE,
    'Forwarded to legal team for review. ETA 2 business days.'
  ),
  (
    'Sarah Wanjiku', 'sarah@example.com',
    'Property Inquiry', 'Site Visit Request',
    'Site visit — Ruiru Phase 2',
    'Client wants to schedule site visit for Ruiru Phase 2 plots this Saturday',
    'approved', 'medium', 'on_track', 'Sales', FALSE,
    'Site visit confirmed for Sat 10 AM. Transport arranged.'
  ),
  (
    'Mary Njeri', 'mary@example.com',
    'IT Request', 'Software Support',
    'CRM login issue',
    'CRM login issue — unable to access lead pipeline dashboard',
    'pending', 'medium', 'due_soon', 'Marketing', TRUE,
    'Password reset sent. Awaiting user confirmation.'
  )
) AS v(requester_name, requester_email, request_type, request_category, subject, description, status, priority, alert_level, department, is_unread, latest_note)
WHERE NOT EXISTS (SELECT 1 FROM tickets LIMIT 1);
