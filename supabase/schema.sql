-- INUKA AFRIKA PROPERTIES — Admin Dashboard Schema
-- Run this in your Supabase SQL Editor

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  phone TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Properties / Land Listings ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'residential',
  price TEXT NOT NULL,
  price_amount NUMERIC,
  size TEXT NOT NULL,
  bedrooms INT,
  image TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'ongoing', 'sold')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  features JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  h1 TEXT,
  map_link TEXT,
  pricing JSONB NOT NULL DEFAULT '{}',
  payment_plan TEXT,
  quick_info JSONB NOT NULL DEFAULT '{}',
  total_units INT NOT NULL DEFAULT 0,
  sold_units INT NOT NULL DEFAULT 0,
  auto_sold_out BOOLEAN NOT NULL DEFAULT TRUE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto mark sold when all units are sold
CREATE OR REPLACE FUNCTION sync_property_sold_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.auto_sold_out AND NEW.total_units > 0 AND NEW.sold_units >= NEW.total_units THEN
    NEW.status := 'sold';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_property_sold_status ON properties;
CREATE TRIGGER trg_property_sold_status
  BEFORE INSERT OR UPDATE OF sold_units, total_units, auto_sold_out, status
  ON properties
  FOR EACH ROW
  EXECUTE FUNCTION sync_property_sold_status();

-- ─── Blog Posts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'IAPL Investment Team',
  published_at DATE NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_html TEXT,
  hero_title TEXT,
  hero_image_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── News Updates ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published_at DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  details JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Market Research ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_research_reports (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL,
  file_url TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE market_research_reports ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS market_research_insights (
  id SERIAL PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'TrendingUp',
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Inquiries Channel ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact_form',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'responded', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Lead Generation Channel ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  property_name TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'site_visit',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Increment sold_units when a lead is converted
CREATE OR REPLACE FUNCTION handle_lead_conversion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'converted' AND (OLD.status IS NULL OR OLD.status <> 'converted') THEN
    IF NEW.property_id IS NOT NULL THEN
      UPDATE properties
      SET sold_units = sold_units + 1
      WHERE id = NEW.property_id;
    END IF;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lead_conversion ON property_leads;
CREATE TRIGGER trg_lead_conversion
  BEFORE UPDATE OF status ON property_leads
  FOR EACH ROW
  EXECUTE FUNCTION handle_lead_conversion();

-- ─── Testimonials Section Content ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  property TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS download_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL DEFAULT '#',
  parent_id INT REFERENCES download_items(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_videos (
  id SERIAL PRIMARY KEY,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  published_at DATE NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_testimonials_updated ON client_testimonials;
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON client_testimonials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_downloads_updated ON download_items;
CREATE TRIGGER trg_downloads_updated BEFORE UPDATE ON download_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_videos_updated ON gallery_videos;
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON gallery_videos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_newsletter_issues_updated ON newsletter_issues;
CREATE TRIGGER trg_newsletter_issues_updated BEFORE UPDATE ON newsletter_issues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_newsletter_subscribers_updated ON newsletter_subscribers;
CREATE TRIGGER trg_newsletter_subscribers_updated BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Site Settings ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Updated-at triggers ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_blog_updated ON blog_posts;
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_news_updated ON news_items;
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON news_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_inquiries_updated ON inquiries;
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_research_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published properties" ON properties
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published blogs" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published news" ON news_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published reports" ON market_research_reports
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published insights" ON market_research_insights
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published testimonials" ON client_testimonials
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published downloads" ON download_items
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published videos" ON gallery_videos
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public read published newsletter issues" ON newsletter_issues
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public insert newsletter subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

-- Public insert for inquiries and leads
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public insert leads" ON property_leads
  FOR INSERT WITH CHECK (TRUE);

-- Auto-create profile on signup (runs when users are created in Dashboard or via auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile policies (trigger uses SECURITY DEFINER; users read/update own row)
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Admin full access profiles" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access properties" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access blogs" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access news" ON news_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access reports" ON market_research_reports
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access insights" ON market_research_insights
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access testimonials" ON client_testimonials
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access downloads" ON download_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access videos" ON gallery_videos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access newsletter issues" ON newsletter_issues
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access newsletter subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access leads" ON property_leads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── Storage bucket for uploads ────────────────────────────────────────────────
-- Create bucket "admin-uploads" in Supabase Dashboard (public read)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('admin-uploads', 'admin-uploads', true);

-- ─── Admin login email verification codes ─────────────────────────────────────
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

-- ─── Email automation log ─────────────────────────────────────────────────────
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

-- ─── SMS automation log ───────────────────────────────────────────────────────
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

-- ─── IAPL Ticketing (see supabase/migrations/ticketing.sql for full migration) ─
-- Tables: tickets, ticket_notes, ticket_categories, ticket_inbound_emails
-- Run supabase/migrations/ticketing.sql in SQL Editor to enable ticketing.

-- ─── Property likes & star ratings ─────────────────────────────────────────────
-- Also in supabase/migrations/property_engagement.sql for existing databases.

CREATE TABLE IF NOT EXISTS property_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id INT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS property_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id INT NOT NULL,
  visitor_id TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_property_likes_property ON property_likes (property_id);
CREATE INDEX IF NOT EXISTS idx_property_ratings_property ON property_ratings (property_id);

ALTER TABLE property_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read property likes" ON property_likes;
CREATE POLICY "Public read property likes" ON property_likes
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read property ratings" ON property_ratings;
CREATE POLICY "Public read property ratings" ON property_ratings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin full access property likes" ON property_likes;
CREATE POLICY "Admin full access property likes" ON property_likes
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access property ratings" ON property_ratings;
CREATE POLICY "Admin full access property ratings" ON property_ratings
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public insert property likes" ON property_likes;
CREATE POLICY "Public insert property likes" ON property_likes
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public delete property likes" ON property_likes;
CREATE POLICY "Public delete property likes" ON property_likes
  FOR DELETE USING (TRUE);

DROP POLICY IF EXISTS "Public insert property ratings" ON property_ratings;
CREATE POLICY "Public insert property ratings" ON property_ratings
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public update property ratings" ON property_ratings;
CREATE POLICY "Public update property ratings" ON property_ratings
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP TRIGGER IF EXISTS trg_property_ratings_updated ON property_ratings;
CREATE TRIGGER trg_property_ratings_updated BEFORE UPDATE ON property_ratings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION public.get_property_engagement(p_ids INT[], p_visitor TEXT DEFAULT NULL)
RETURNS TABLE (
  property_id INT,
  like_count BIGINT,
  rating_avg NUMERIC,
  rating_count BIGINT,
  liked BOOLEAN,
  my_rating INT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    i.property_id,
    COALESCE(l.like_count, 0),
    COALESCE(r.rating_avg, 0),
    COALESCE(r.rating_count, 0),
    COALESCE(lv.liked, FALSE),
    rv.rating
  FROM unnest(p_ids) AS i(property_id)
  LEFT JOIN (
    SELECT pl.property_id, COUNT(*)::bigint AS like_count
    FROM property_likes pl
    WHERE pl.property_id = ANY(p_ids)
    GROUP BY pl.property_id
  ) l ON l.property_id = i.property_id
  LEFT JOIN (
    SELECT pr.property_id, AVG(pr.rating)::numeric AS rating_avg, COUNT(*)::bigint AS rating_count
    FROM property_ratings pr
    WHERE pr.property_id = ANY(p_ids)
    GROUP BY pr.property_id
  ) r ON r.property_id = i.property_id
  LEFT JOIN (
    SELECT pl.property_id, TRUE AS liked
    FROM property_likes pl
    WHERE p_visitor IS NOT NULL
      AND pl.visitor_id = p_visitor
      AND pl.property_id = ANY(p_ids)
  ) lv ON lv.property_id = i.property_id
  LEFT JOIN (
    SELECT pr.property_id, pr.rating
    FROM property_ratings pr
    WHERE p_visitor IS NOT NULL
      AND pr.visitor_id = p_visitor
      AND pr.property_id = ANY(p_ids)
  ) rv ON rv.property_id = i.property_id
$$;

GRANT EXECUTE ON FUNCTION public.get_property_engagement(INT[], TEXT) TO anon, authenticated, service_role;

-- ─── Facebook ad landing pages (see supabase/migrations/landing_pages.sql) ────
CREATE TABLE IF NOT EXISTS landing_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  property_id INT,
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
