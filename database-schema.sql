-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  total_savings_usd DECIMAL(10, 2) DEFAULT 0
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  specs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products"
ON products FOR SELECT
USING (true);

-- Prices Table
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer VARCHAR(100),
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'AED',
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  delivery_days INT,
  stock_status VARCHAR(50),
  url VARCHAR(500),
  scraped_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, retailer)
);

ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read prices"
ON prices FOR SELECT
USING (true);

-- Sustainability Metrics Table
CREATE TABLE sustainability_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer VARCHAR(100),
  carbon_footprint_kg DECIMAL(10, 2),
  durability_rating INT,
  recyclability_percentage INT,
  local_shipping BOOLEAN DEFAULT FALSE,
  calculated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read metrics"
ON sustainability_metrics FOR SELECT
USING (true);
