-- Opt-in update signals for blogs, market research, and properties.
CREATE TABLE IF NOT EXISTS content_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('blog', 'market-research', 'property')),
  title TEXT NOT NULL,
  summary TEXT,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_signals_created ON content_signals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_signals_path ON content_signals (path, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_subscriptions (
  visitor_id TEXT PRIMARY KEY,
  endpoint TEXT,
  p256dh TEXT,
  auth_key TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_subscriptions_endpoint
  ON notification_subscriptions (endpoint)
  WHERE endpoint IS NOT NULL;

ALTER TABLE content_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read content signals" ON content_signals;
CREATE POLICY "Public read content signals" ON content_signals
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin insert content signals" ON content_signals;
CREATE POLICY "Admin insert content signals" ON content_signals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin read notification subscriptions" ON notification_subscriptions;
CREATE POLICY "Admin read notification subscriptions" ON notification_subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS trg_notification_subscriptions_updated ON notification_subscriptions;
CREATE TRIGGER trg_notification_subscriptions_updated BEFORE UPDATE ON notification_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
