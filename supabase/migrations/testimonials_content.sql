-- Testimonials section content: client testimonials, downloads, videos, newsletters

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

ALTER TABLE client_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

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
