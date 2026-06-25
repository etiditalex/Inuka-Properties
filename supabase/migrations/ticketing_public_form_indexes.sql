-- Optional: run AFTER ticketing.sql if you already applied the base migration
-- Adds indexes for public support form lookups

CREATE INDEX IF NOT EXISTS idx_tickets_source ON tickets(source);
CREATE INDEX IF NOT EXISTS idx_tickets_requester_email ON tickets(requester_email);
