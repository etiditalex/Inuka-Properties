-- Facebook ad landing pages (admin-built converting pages at /lp/[slug])

CREATE TABLE IF NOT EXISTS landing_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  campaign_name TEXT,
  utm_campaign TEXT,
  channel TEXT NOT NULL DEFAULT 'facebook'
    CHECK (channel IN ('facebook', 'instagram', 'google', 'tiktok', 'whatsapp', 'email', 'other')),
  template TEXT NOT NULL DEFAULT 'offer'
    CHECK (template IN ('offer', 'lead_magnet', 'urgency')),
  headline TEXT NOT NULL DEFAULT '',
  subheadline TEXT,
  badge_text TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Get Full Details Now',
  form_heading TEXT,
  form_subheading TEXT,
  thank_you_message TEXT,
  hero_image TEXT,
  highlights JSONB NOT NULL DEFAULT '[]',
  body_html TEXT,
  offer_price TEXT,
  offer_size TEXT,
  payment_plan_note TEXT,
  show_price BOOLEAN NOT NULL DEFAULT TRUE,
  show_plots_remaining BOOLEAN NOT NULL DEFAULT TRUE,
  show_whatsapp BOOLEAN NOT NULL DEFAULT TRUE,
  show_call BOOLEAN NOT NULL DEFAULT TRUE,
  show_testimonials BOOLEAN NOT NULL DEFAULT FALSE,
  pixel_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages (slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON landing_pages (published);
CREATE INDEX IF NOT EXISTS idx_landing_pages_property ON landing_pages (property_id);

ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published landing pages" ON landing_pages;
CREATE POLICY "Public read published landing pages" ON landing_pages
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Admin full access landing pages" ON landing_pages;
CREATE POLICY "Admin full access landing pages" ON landing_pages
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS trg_landing_pages_updated ON landing_pages;
CREATE TRIGGER trg_landing_pages_updated BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE property_leads
  ADD COLUMN IF NOT EXISTS landing_page_id INT REFERENCES landing_pages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_property_leads_landing_page ON property_leads (landing_page_id);
