-- Storage bucket for admin image uploads
-- Run in Supabase SQL Editor after schema.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-uploads',
  'admin-uploads',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
CREATE POLICY "Public read admin uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'admin-uploads');

-- Authenticated upload
CREATE POLICY "Admin upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'admin-uploads'
  AND auth.role() = 'authenticated'
);

-- Authenticated update/delete own uploads
CREATE POLICY "Admin update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'admin-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'admin-uploads' AND auth.role() = 'authenticated');

-- Allow payment_plan to store JSON objects
ALTER TABLE properties
  ALTER COLUMN payment_plan TYPE JSONB
  USING CASE
    WHEN payment_plan IS NULL OR payment_plan = '' THEN '{}'::jsonb
    WHEN payment_plan::text ~ '^\{' THEN payment_plan::jsonb
    ELSE to_jsonb(payment_plan)
  END;

ALTER TABLE properties ALTER COLUMN payment_plan SET DEFAULT '{}'::jsonb;
