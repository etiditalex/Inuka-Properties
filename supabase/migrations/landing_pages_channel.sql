-- Only run this if landing_pages already exists and is missing the channel column.
-- If the table does not exist yet, run landing_pages.sql instead.

DO $$
BEGIN
  IF to_regclass('public.landing_pages') IS NULL THEN
    RAISE NOTICE 'landing_pages does not exist yet. Run landing_pages.sql instead.';
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'landing_pages'
      AND column_name = 'channel'
  ) THEN
    ALTER TABLE landing_pages
      ADD COLUMN channel TEXT NOT NULL DEFAULT 'facebook';
  END IF;

  ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_channel_check;
  ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_channel_check
    CHECK (channel IN ('facebook', 'instagram', 'google', 'tiktok', 'whatsapp', 'email', 'other'));
END $$;
