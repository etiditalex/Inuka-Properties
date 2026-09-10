-- Additive: campaign channel so admins can create landing pages for Facebook now
-- and Google, Instagram, TikTok, WhatsApp, or email later.

ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'facebook';

ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_channel_check;
ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_channel_check
  CHECK (channel IN ('facebook', 'instagram', 'google', 'tiktok', 'whatsapp', 'email', 'other'));
