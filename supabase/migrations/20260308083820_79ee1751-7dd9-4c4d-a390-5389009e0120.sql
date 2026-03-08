
-- Create coupons table
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  min_order_amount numeric DEFAULT 0,
  max_uses integer DEFAULT NULL,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz DEFAULT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons"
ON public.coupons FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read active coupons by code"
ON public.coupons FOR SELECT
TO authenticated
USING (is_active = true);

-- Add coupon and fulfillment notes columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code text DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_discount numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_notes text DEFAULT '';

-- Create error_logs table for error monitoring
CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL DEFAULT 'general',
  message text NOT NULL DEFAULT '',
  details text DEFAULT '',
  user_id uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view error logs"
ON public.error_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert error logs"
ON public.error_logs FOR INSERT
WITH CHECK (true);
