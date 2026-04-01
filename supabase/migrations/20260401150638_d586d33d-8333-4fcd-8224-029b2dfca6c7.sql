
-- 1. Add buying_price to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS buying_price numeric NOT NULL DEFAULT 0;

-- 2. Add location to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text DEFAULT '';

-- 3. Create cart_items table for persistent cart
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can add to own cart
CREATE POLICY "Users can add to own cart" ON public.cart_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update own cart
CREATE POLICY "Users can update own cart" ON public.cart_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can remove from own cart
CREATE POLICY "Users can remove from own cart" ON public.cart_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
