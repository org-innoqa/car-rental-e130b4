ALTER TABLE bookings ADD COLUMN IF NOT EXISTS luggage integer NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS name_sign text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS child_seat boolean NOT NULL DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS additional_stop text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meet_greet boolean NOT NULL DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_instructions text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS preferred_contact text NOT NULL DEFAULT 'Email';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'Payment after approval';