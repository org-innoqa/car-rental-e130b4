CREATE TABLE IF NOT EXISTS email_templates (
  id bigint generated always as identity primary key,
  template_key text UNIQUE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_templates_key_idx ON email_templates (template_key);

CREATE TABLE IF NOT EXISTS email_outbox (
  id bigint generated always as identity primary key,
  booking_reference text NOT NULL,
  recipient_email text NOT NULL,
  template_key text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'Queued',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_outbox_booking_reference_idx ON email_outbox (booking_reference);
CREATE INDEX IF NOT EXISTS email_outbox_recipient_email_idx ON email_outbox (recipient_email);
CREATE INDEX IF NOT EXISTS email_outbox_status_idx ON email_outbox (status);

INSERT INTO email_templates (template_key, name, subject, body)
VALUES
  (
    'booking_created',
    'Booking created',
    'Your Qatar Rental booking request {{reference}} has been created',
    'Dear {{customer_name}},\n\nYour Qatar Rental booking request has been created successfully.\n\nBooking reference: {{reference}}\nVehicle: {{vehicle}}\nService: {{service}}\nPickup: {{pickup}}\nDestination: {{dropoff}}\nDate: {{travel_date}}\nPickup time: {{travel_time}}\nEstimated total: QAR {{total}}\n\nYour request is now being reviewed by our concierge team. No payment is required while your request is pending approval. We will contact you once availability has been confirmed.\n\nKind regards,\nQatar Rental Concierge\nconcierge@qatar-rental.com'
  ),
  (
    'booking_cancelled',
    'Booking cancelled',
    'Your Qatar Rental booking {{reference}} has been cancelled',
    'Dear {{customer_name}},\n\nYour Qatar Rental booking has been cancelled as requested or following an availability review.\n\nBooking reference: {{reference}}\nVehicle: {{vehicle}}\nService: {{service}}\nPickup: {{pickup}}\nDestination: {{dropoff}}\nDate: {{travel_date}}\nPickup time: {{travel_time}}\n\nIf you believe this was sent in error or need help arranging another journey, please contact our concierge team at concierge@qatar-rental.com.\n\nKind regards,\nQatar Rental Concierge\nconcierge@qatar-rental.com'
  )
ON CONFLICT (template_key) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  body = EXCLUDED.body,
  updated_at = now();