-- Email automation: logs for automated property detail emails and admin alerts

CREATE TABLE IF NOT EXISTS email_automation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type TEXT NOT NULL CHECK (lead_type IN ('lead', 'inquiry')),
  lead_id UUID,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT,
  email_type TEXT NOT NULL CHECK (email_type IN ('property_details', 'admin_alert', 'manual_resend')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_automation_log_created ON email_automation_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_automation_log_recipient ON email_automation_log(recipient_email);

ALTER TABLE email_automation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access email automation log" ON email_automation_log
  FOR ALL USING (auth.role() = 'authenticated');
