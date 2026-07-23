ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS service_mode text NOT NULL DEFAULT 'Self-drive';

UPDATE vehicles
SET service_mode = 'Self-drive'
WHERE service_mode IS NULL OR service_mode = '';

INSERT INTO vehicles (name, brand, category, price, hourly_price, image, badge, passengers, luggage, benefit, amenities, cancellation, service_mode)
VALUES
  ('Fiat 500', 'Fiat', 'City car', 220, 95, 'https://images.unsplash.com/photo-1525609004556-c46c7dcfb3d4?auto=format&fit=crop&w=1200&q=90', 'City favourite', 2, 1, 'Compact and effortless for short city journeys around Doha', '["Air conditioning", "Bluetooth", "City-friendly size"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW 3 Series', 'BMW', 'Premium sedan', 360, 140, 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=90', 'Everyday premium', 3, 2, 'Balanced performance and comfort for everyday Qatar travel', '["Bluetooth", "Leather interior", "Navigation"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('MINI Cooper', 'MINI', 'City car', 280, 110, 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=90', 'Distinctive choice', 4, 2, 'A spirited, stylish choice for exploring Doha and the coast', '["Bluetooth", "Panoramic roof", "Air conditioning"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW 5 Series', 'BMW', 'Premium sedan', 500, 185, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Business favourite', 3, 2, 'Quiet, composed comfort for business travel and daily journeys', '["Wi-Fi", "Leather interior", "Refreshments"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW X1', 'BMW', 'Premium SUV', 420, 160, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Premium choice', 4, 3, 'A refined and practical choice for city journeys and airport transfers', '["Wi-Fi", "Leather interior", "Bottled water"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW X2', 'BMW', 'Premium SUV', 450, 170, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Urban premium', 4, 3, 'Contemporary design with flexible space for city travel', '["Wi-Fi", "Leather interior", "Navigation"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW X3', 'BMW', 'Premium SUV', 490, 185, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Versatile SUV', 5, 4, 'Confident comfort for families, airport transfers and longer drives', '["Wi-Fi", "Leather interior", "Large luggage space"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('BMW X4', 'BMW', 'Luxury SUV', 540, 205, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Sporting luxury', 5, 3, 'A distinctive premium SUV for stylish Qatar journeys', '["Wi-Fi", "Leather interior", "Panoramic roof"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Self-drive'),
  ('Range Rover Velar', 'Range Rover', 'Luxury SUV', 690, 255, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=90', 'Modern luxury', 5, 4, 'Elegant refinement with a commanding view and exceptional comfort', '["Wi-Fi", "Panoramic roof", "Privacy glass"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('BMW X5', 'BMW', 'Luxury SUV', 680, 250, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Family luxury', 5, 5, 'Spacious, polished comfort for families and executive travel', '["Wi-Fi", "Leather interior", "Large luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('BMW X6', 'BMW', 'Luxury SUV', 720, 270, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Statement SUV', 5, 4, 'Distinctive coupe-SUV styling with premium long-distance comfort', '["Wi-Fi", "Privacy glass", "Panoramic roof"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('Land Rover Defender 110', 'Land Rover', 'Luxury SUV', 740, 275, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=90', 'Adventure ready', 5, 5, 'Capable, spacious luxury for groups, coast trips and special occasions', '["Wi-Fi", "Panoramic roof", "Large luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('BMW X7', 'BMW', 'Executive SUV', 820, 305, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Executive space', 6, 5, 'Three-row luxury with generous space for families and VIP travel', '["Wi-Fi", "Executive rear seats", "Panoramic roof"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('Range Rover Sport', 'Range Rover', 'Executive SUV', 850, 320, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=90', 'VIP favourite', 5, 4, 'Powerful presence and serene comfort for important arrivals', '["Wi-Fi", "Privacy glass", "Executive interior"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Self-drive'),
  ('Chauffeur Service BMW 5 Series', 'BMW', 'Premium sedan', 560, 210, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'Chauffeur included', 3, 2, 'Discreet, professional chauffeur service for business and airport travel', '["Professional chauffeur", "Wi-Fi", "Refreshments"]'::jsonb, 'Free cancellation up to 24 hours before pickup', 'Chauffeur service'),
  ('Chauffeur Service BMW 7 Series', 'BMW', 'Executive sedan', 720, 270, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90', 'VIP chauffeur', 3, 2, 'First-class rear-seat comfort with a dedicated professional chauffeur', '["Professional chauffeur", "Executive rear seats", "Privacy glass"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Chauffeur service'),
  ('Chauffeur Service Land Rover Defender 110', 'Land Rover', 'Luxury SUV', 820, 300, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=90', 'Chauffeur included', 5, 5, 'A confident and spacious chauffeur-led experience for groups and events', '["Professional chauffeur", "Panoramic roof", "Large luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Chauffeur service'),
  ('Chauffeur Service Rolls Royce Ghost', 'Rolls-Royce', 'Ultra-luxury sedan', 2200, 850, 'https://images.unsplash.com/photo-1631295868223-63265b40d9c8?auto=format&fit=crop&w=1200&q=90', 'Signature arrival', 3, 2, 'An unforgettable chauffeur experience for weddings, VIP arrivals and celebrations', '["Professional chauffeur", "Hand-finished interior", "Privacy glass"]'::jsonb, 'Free cancellation up to 72 hours before pickup', 'Chauffeur service'),
  ('Chauffeur Service Mercedes V Class', 'Mercedes-Benz', 'Luxury van', 680, 250, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=90', 'Best for groups', 6, 5, 'Flexible premium space with a professional chauffeur for families and teams', '["Professional chauffeur", "Captain seats", "Luggage space"]'::jsonb, 'Free cancellation up to 48 hours before pickup', 'Chauffeur service')
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
  service_mode = EXCLUDED.service_mode,
  updated_at = now();