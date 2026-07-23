CREATE TABLE IF NOT EXISTS admin_users (
  id bigint generated always as identity primary key,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (email);

INSERT INTO admin_users (email, password, role, active)
VALUES ('admin@qatar-car-rental.com', 'Test1234.', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  active = EXCLUDED.active,
  updated_at = now();