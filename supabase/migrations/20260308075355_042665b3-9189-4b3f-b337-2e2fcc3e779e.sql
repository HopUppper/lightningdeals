
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS offer_badge text DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_label text DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_expires_at timestamptz DEFAULT NULL;
