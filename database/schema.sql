CREATE TABLE IF NOT EXISTS bookings (
  id bigint generated always as identity primary key,
  reference text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  pickup text NOT NULL,
  dropoff text NOT NULL,
  travel_date date NOT NULL,
  travel_time time NOT NULL,
  service text NOT NULL,
  vehicle text NOT NULL,
  passengers integer NOT NULL DEFAULT 1 CHECK (passengers > 0),
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'Pending approval',
  payment_status text NOT NULL DEFAULT 'Awaiting payment',
  payment_intent_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_email_idx ON bookings (email);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);

INSERT INTO bookings (reference, name, email, phone, pickup, dropoff, travel_date, travel_time, service, vehicle, passengers, total, status, payment_status, notes)
VALUES ('QR-DEMO01', 'Noura Al-Kuwari', 'noura@example.com', '+974 5555 0182', 'Hamad International Airport', 'The Pearl, Doha', CURRENT_DATE + 2, '14:30', 'Airport transfer', 'Mercedes-Benz S-Class', 2, 480, 'Pending approval', 'Awaiting payment', 'Meet and greet at arrivals')
ON CONFLICT (reference) DO NOTHING;