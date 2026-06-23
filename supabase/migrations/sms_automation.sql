-- SMS automation: logs for automated and bulk SMS messages

CREATE TABLE IF NOT EXISTS sms_automation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type TEXT CHECK (lead_type IN ('lead', 'inquiry')),
  lead_id UUID,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT,
  sms_type TEXT NOT NULL CHECK (sms_type IN ('property_details', 'admin_alert', 'bulk_campaign', 'manual')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  message_body TEXT NOT NULL,
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_automation_log_created ON sms_automation_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_automation_log_phone ON sms_automation_log(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_sms_automation_log_type ON sms_automation_log(sms_type);

ALTER TABLE sms_automation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access sms automation log" ON sms_automation_log
  FOR ALL USING (auth.role() = 'authenticated');
