
-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'order',
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view notifications
CREATE POLICY "Admins can view notifications"
ON public.admin_notifications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update (mark as read)
CREATE POLICY "Admins can update notifications"
ON public.admin_notifications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow inserts from triggers (service role) and admins
CREATE POLICY "Admins can insert notifications"
ON public.admin_notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

-- Trigger function to auto-create notification on new order
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
    'New Order Received',
    'Order from ' || NEW.customer_name || ' for ' || COALESCE(product_name, 'Unknown Product') || ' — ₹' || NEW.payment_amount || ' | Phone: ' || COALESCE(NEW.customer_phone, 'N/A'),
    'order',
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_order_notify
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_new_order();
