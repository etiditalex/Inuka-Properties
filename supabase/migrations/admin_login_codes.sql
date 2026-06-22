-- Admin login email verification (run in Supabase SQL Editor if schema already deployed)
CREATE TABLE IF NOT EXISTS admin_login_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  session_encrypted TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_login_codes_expires ON admin_login_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_login_codes_user ON admin_login_codes(user_id);

ALTER TABLE admin_login_codes ENABLE ROW LEVEL SECURITY;
