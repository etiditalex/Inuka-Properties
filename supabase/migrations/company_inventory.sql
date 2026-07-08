-- Company Inventory: physical assets, internet/software subscriptions, and challenge tracking

CREATE TABLE IF NOT EXISTS company_assets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  department TEXT NOT NULL,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  purchase_condition TEXT NOT NULL DEFAULT 'new' CHECK (purchase_condition IN ('new', 'refurbished')),
  serial_number TEXT,
  notes TEXT,
  challenges TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired', 'under_repair')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_subscriptions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('internet', 'software')),
  provider TEXT,
  acquisition_date DATE NOT NULL,
  renewal_date DATE,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'annual' CHECK (billing_cycle IN ('monthly', 'annual', 'one_time')),
  challenges TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_company_assets_updated ON company_assets;
CREATE TRIGGER trg_company_assets_updated BEFORE UPDATE ON company_assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_company_subscriptions_updated ON company_subscriptions;
CREATE TRIGGER trg_company_subscriptions_updated BEFORE UPDATE ON company_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE company_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access company assets" ON company_assets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access company subscriptions" ON company_subscriptions
  FOR ALL USING (auth.role() = 'authenticated');
