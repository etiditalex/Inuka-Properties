-- Daily coastal play: word list, letter sets, quiz, offer, and completions.
-- Run in the Supabase SQL editor. The site still plays from built-in Inuka content if these tables are empty.

CREATE TABLE IF NOT EXISTS play_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  hint TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS play_letter_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letters TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS play_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_index INT NOT NULL CHECK (correct_index >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS play_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  summary TEXT NOT NULL,
  path TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS play_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  play_date DATE NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('sudoku', 'word', 'quiz')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (visitor_id, play_date, game)
);

CREATE INDEX IF NOT EXISTS idx_play_completions_visitor_date
  ON play_completions (visitor_id, play_date);

ALTER TABLE play_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_letter_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access play words" ON play_words;
CREATE POLICY "Admin full access play words" ON play_words
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access play letter sets" ON play_letter_sets;
CREATE POLICY "Admin full access play letter sets" ON play_letter_sets
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access play quiz" ON play_quiz_questions;
CREATE POLICY "Admin full access play quiz" ON play_quiz_questions
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access play offers" ON play_offers;
CREATE POLICY "Admin full access play offers" ON play_offers
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access play completions" ON play_completions;
CREATE POLICY "Admin full access play completions" ON play_completions
  FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO play_words (word, hint)
VALUES
  ('PLOTS', 'What Inuka sells along the coast'),
  ('NYALI', 'Mombasa suburb where the Inuka office sits'),
  ('DIANI', 'A south-coast beach buyers ask about'),
  ('TITLE', 'The deed buyers want on their land'),
  ('BEACH', 'Coastal land beside the ocean'),
  ('SHORE', 'Where the sea meets a beach plot'),
  ('ACRES', 'How larger parcels are measured'),
  ('COAST', 'The region Inuka serves'),
  ('FENCE', 'A boundary around a gated project'),
  ('HAVEN', 'The second word in Tulivu Haven')
ON CONFLICT (word) DO NOTHING;

INSERT INTO play_letter_sets (letters, label)
VALUES
  ('ISLAND', 'Island'),
  ('MARINE', 'Marine'),
  ('BEACON', 'Beacon'),
  ('GARDEN', 'Garden'),
  ('MARKET', 'Market'),
  ('BRIDGE', 'Bridge')
ON CONFLICT (letters) DO NOTHING;

INSERT INTO play_quiz_questions (prompt, choices, correct_index, sort_order)
SELECT v.prompt, v.choices::jsonb, v.correct_index, v.sort_order
FROM (VALUES
  ('Where is the Inuka Afrika Properties head office?', '["Nyali, Mombasa","Nairobi CBD","Diani beach","Nakuru town"]', 0, 1),
  ('Tulivu Haven plots are in which area?', '["Nyali","Kibao Kiche, Mariakani","Diani","Nanyuki"]', 1, 2),
  ('What plot size does Tulivu Haven offer?', '["1 acre","5 acres","1/8 acre","50 x 100"]', 2, 3),
  ('Which counties does Inuka highlight for coastal buyers?', '["Mombasa, Kilifi and Kwale","Nairobi only","Nakuru only","Kisumu only"]', 0, 4),
  ('A common Inuka payment plan is:', '["Cash only","Deposit, then about 12 months","30-year bank mortgage only","Rent to own"]', 1, 5),
  ('Msabaha Phase 8 is near which town?', '["Malindi","Thika","Kitale","Nyeri"]', 0, 6),
  ('Miliki Tezo na Inuka is in which town?', '["Tezo","Karen","Juja","Konza"]', 0, 7),
  ('Which phone number is on the Inuka website?', '["0711 082084","020 123 456","0111 000 000","0790 300 300"]', 0, 8)
) AS v(prompt, choices, correct_index, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM play_quiz_questions q WHERE q.prompt = v.prompt
);

INSERT INTO play_offers (title, price, summary, path)
SELECT
  'Tulivu Haven',
  'KES 450,000',
  '1/8-acre plots in Kibao Kiche, Mariakani, with water and electricity on site. Deposit KES 150,000, then the balance over about 12 months.',
  '/for-sale/14'
WHERE NOT EXISTS (SELECT 1 FROM play_offers WHERE path = '/for-sale/14');
