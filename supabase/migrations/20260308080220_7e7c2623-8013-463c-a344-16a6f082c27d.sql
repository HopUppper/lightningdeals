
-- Add 'refunded' to order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'refunded';

-- Create order_status_history table for timeline
CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  note text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage status history"
ON public.order_status_history FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their order status history"
ON public.order_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_status_history.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Allow insert from trigger (SECURITY DEFINER)
CREATE POLICY "System can insert status history"
ON public.order_status_history FOR INSERT
WITH CHECK (true);

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
    INSERT INTO public.order_status_history (order_id, status)
    VALUES (NEW.id, NEW.order_status::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_order_status_change();

-- Also log initial order creation status
CREATE OR REPLACE FUNCTION public.log_initial_order_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.order_status_history (order_id, status)
  VALUES (NEW.id, NEW.order_status::text);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_created_log_status
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_initial_order_status();

-- Update notification trigger to include email
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  product_name text;
BEGIN
  SELECT name INTO product_name FROM public.products WHERE id = NEW.product_id;
  
  INSERT INTO public.admin_notifications (title, message, type, order_id)
  VALUES (
    'New Order — ₹' || NEW.payment_amount,
    NEW.customer_name || ' ordered ' || COALESCE(product_name, 'Unknown') || ' | ₹' || NEW.payment_amount || ' | ' || COALESCE(NEW.customer_phone, 'No phone') || ' | ' || NEW.customer_email,
    'order',
    NEW.id
  );
  
  RETURN NEW;
END;
$$;
