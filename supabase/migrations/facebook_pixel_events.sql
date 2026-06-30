-- Facebook Pixel event log (mirrored from site for admin dashboard)
CREATE TABLE IF NOT EXISTS facebook_pixel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  property_name TEXT,
  page_path TEXT,
  event_data JSONB NOT NULL DEFAULT '{}',
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facebook_pixel_events_created
  ON facebook_pixel_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_facebook_pixel_events_property
  ON facebook_pixel_events(property_id);

CREATE INDEX IF NOT EXISTS idx_facebook_pixel_events_name
  ON facebook_pixel_events(event_name);

ALTER TABLE facebook_pixel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access facebook pixel events" ON facebook_pixel_events;
CREATE POLICY "Admin full access facebook pixel events" ON facebook_pixel_events
  FOR ALL USING (auth.role() = 'authenticated');
