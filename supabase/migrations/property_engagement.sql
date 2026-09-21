-- Property likes and star ratings (anonymous visitors, keyed by visitor_id)

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
