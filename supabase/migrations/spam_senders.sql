-- Flag inbound email as spam and remember the sender.
-- Run this file in the Supabase SQL Editor. It is safe to run more than once.

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS is_spam BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_tickets_spam ON tickets (is_spam) WHERE is_spam = TRUE;

CREATE TABLE IF NOT EXISTS spam_senders (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE spam_senders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access spam senders" ON spam_senders;
CREATE POLICY "Admin full access spam senders" ON spam_senders
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT SELECT, INSERT, UPDATE, DELETE ON spam_senders TO authenticated;
GRANT ALL ON spam_senders TO service_role;
