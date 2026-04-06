CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  venue TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  tags TEXT NOT NULL,
  official_url TEXT NOT NULL,
  ticket_url TEXT,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  language TEXT NOT NULL,
  price_text TEXT,
  currency TEXT,
  confidence_score REAL NOT NULL,
  freshness_score REAL NOT NULL,
  dedupe_key TEXT NOT NULL,
  image_url TEXT,
  latitude REAL,
  longitude REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_country_region_city ON events(country, region, city);
CREATE INDEX IF NOT EXISTS idx_events_category_subcategory ON events(category, subcategory);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_dedupe ON events(dedupe_key);
