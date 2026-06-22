-- Optional seed data for INUKA AFRIKA Admin Dashboard
-- Run after schema.sql

INSERT INTO market_research_insights (icon, title, value, description, sort_order) VALUES
  ('TrendingUp', 'Market Growth', '15%', 'Year-over-year growth in coastal property values', 0),
  ('MapPin', 'Hot Locations', '9', 'Prime locations we serve across Kilifi County', 1),
  ('BarChart3', 'Investment Returns', '12-18%', 'Average annual returns on coastal properties', 2)
ON CONFLICT DO NOTHING;

INSERT INTO market_research_reports (title, description, report_date, report_type, sort_order) VALUES
  ('Kilifi County Real Estate Market Report 2024', 'Comprehensive analysis of property trends, prices, and investment opportunities in Kilifi County.', '2024-01-15', 'Market Report', 0),
  ('Coastal Property Investment Guide', 'Detailed guide on investing in coastal properties, including beachfront and residential developments.', '2024-01-10', 'Investment Guide', 1),
  ('Affordable Housing Market Analysis', 'In-depth analysis of the affordable housing sector and emerging opportunities.', '2024-01-05', 'Sector Analysis', 2)
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES (
  'general',
  '{"site_name":"Inuka Afrika Properties Limited","contact_email":"info@inukaproperties.co.ke","contact_phone":"+254 700 000 000","whatsapp_number":"+254700000000","office_address":"Nyali, Mombasa, Kenya","auto_sold_out_global":true,"notify_new_inquiries":true,"notify_new_leads":true}'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Example property with auto sold-out (72 units for Rafiki @10)
INSERT INTO properties (
  title, location, type, price, size, image, status, featured,
  features, description, total_units, sold_units, auto_sold_out, published
) VALUES (
  'Rafiki @10',
  'Tezo, Kilifi County',
  'residential',
  'KES 650,000',
  '10 Acres (72 Units)',
  'https://res.cloudinary.com/dyfnobo9r/image/upload/v1771129318/Rafriki_10_Prime_plots_for_sale_s89vom.jpg',
  'available',
  true,
  '["500m from Tezo Town","Off the Kilifi–Malindi Highway","Perimeter fence with common gated entrance"]'::jsonb,
  'Prime plots in Tezo, Kilifi County with flexible payment plans.',
  72,
  0,
  true,
  true
) ON CONFLICT DO NOTHING;
