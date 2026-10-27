-- Inuka Survey: forms, questions, and responses.
-- Run this file in the Supabase SQL Editor.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  collect_identity BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  expires_at TIMESTAMPTZ,
  thank_you_message TEXT NOT NULL DEFAULT 'Thank you. Your response has been recorded.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  help_text TEXT,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'short_text', 'long_text', 'single_choice', 'multiple_choice', 'rating', 'yes_no'
  )),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_name TEXT,
  respondent_email TEXT,
  respondent_phone TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_surveys_slug ON surveys (slug);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys (status);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey ON survey_questions (survey_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses (survey_id, submitted_at DESC);

ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_phone TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_survey_responses_one_phone
  ON survey_responses (survey_id, respondent_phone)
  WHERE respondent_phone IS NOT NULL;

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read shared surveys" ON surveys;
CREATE POLICY "Public read shared surveys" ON surveys
  FOR SELECT USING (status IN ('open', 'closed'));

DROP POLICY IF EXISTS "Admin full access surveys" ON surveys;
CREATE POLICY "Admin full access surveys" ON surveys
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read shared survey questions" ON survey_questions;
CREATE POLICY "Public read shared survey questions" ON survey_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys s
      WHERE s.id = survey_id AND s.status IN ('open', 'closed')
    )
  );

DROP POLICY IF EXISTS "Admin full access survey questions" ON survey_questions;
CREATE POLICY "Admin full access survey questions" ON survey_questions
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access survey responses" ON survey_responses;
CREATE POLICY "Admin full access survey responses" ON survey_responses
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE surveys ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Public submit open survey responses" ON survey_responses;
CREATE POLICY "Public submit open survey responses" ON survey_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys s
      WHERE s.id = survey_id
        AND s.status = 'open'
        AND (s.expires_at IS NULL OR s.expires_at > NOW())
        AND (
          s.collect_identity = TRUE
          OR (respondent_name IS NULL AND respondent_email IS NULL)
        )
    )
  );

DROP TRIGGER IF EXISTS trg_surveys_updated ON surveys;
CREATE TRIGGER trg_surveys_updated BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS survey_report_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (survey_id, email)
);

CREATE INDEX IF NOT EXISTS idx_survey_report_recipients_survey ON survey_report_recipients (survey_id);

ALTER TABLE survey_report_recipients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access survey report recipients" ON survey_report_recipients;
CREATE POLICY "Admin full access survey report recipients" ON survey_report_recipients
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT SELECT ON surveys TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON surveys TO authenticated;
GRANT SELECT ON survey_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_questions TO authenticated;
GRANT INSERT ON survey_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_report_recipients TO authenticated;
GRANT ALL ON surveys, survey_questions, survey_responses, survey_report_recipients TO service_role;
