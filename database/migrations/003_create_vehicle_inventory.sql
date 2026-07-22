CREATE TABLE IF NOT EXISTS vehicles (
  id bigint generated always as identity primary key,
  name text UNIQUE NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  hourly_price numeric(10,2) NOT NULL,
  image text NOT NULL,
  badge text NOT NULL,
  passengers integer NOT NULL DEFAULT 1 CHECK (passengers > 0),
  luggage integer NOT NULL DEFAULT 0 CHECK (luggage >= 0),
  benefit text NOT NULL,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  cancellation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vehicles_brand_idx ON vehicles (brand);
CREATE INDEX IF NOT EXISTS vehicles_category_idx ON vehicles (category);

INSERT INTO vehicles (name, brand, category, price, hourly_price, image, badge, passengers, luggage, benefit, amenities, cancellation)
VALUES
  ('BMW X1', 'BMW', 'Premium SUV', 420, 160, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85', 'Premium choice', 4, 3, 'A refined and practical choice for city journeys and airport transfers', '["Wi-Fi", "Leather interior", "Bottled water"]'::jsonb, 'Free cancellation up to 24 hours before pickup'),
  ('BMW 5 Series', 'BMW', 'Premium sedan', 500, 185, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85', 'Business favourite', 3, 2, 'Quiet, composed comfort for business travel and daily chauffeur service', '["Wi-Fi", "Leather interior", "Refreshments"]'::jsonb, 'Free cancellation up to 24 hours before pickup'),
  ('BMW 7 Series', 'BMW', 'Executive sedan', 650, 240, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85', 'Executive choice', 3, 2, 'First-class executive comfort for important meetings and VIP arrivals', '["Wi-Fi", "Executive rear seats", "Privacy glass"]'::jsonb, 'Free cancellation up to 48 hours before pickup'),
  ('Land Rover Defender 130 XL', 'Land Rover', 'Luxury SUV', 780, 290, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85', 'Best for groups', 7, 5, 'Spacious, capable luxury for families, groups and longer journeys', '["Wi-Fi", "Panoramic roof", "Large luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup'),
  ('Mercedes V Class', 'Mercedes-Benz', 'Luxury van', 620, 230, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85', 'Best for groups', 6, 5, 'Flexible premium space for families, teams and larger luggage', '["Wi-Fi", "Captain seats", "Luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup')
ON CONFLICT (name) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  hourly_price = EXCLUDED.hourly_price,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge,
  passengers = EXCLUDED.passengers,
  luggage = EXCLUDED.luggage,
  benefit = EXCLUDED.benefit,
  amenities = EXCLUDED.amenities,
  cancellation = EXCLUDED.cancellation,
  updated_at = now();