
-- Replace the overly permissive insert policy with a restrictive one
-- Only the trigger function (SECURITY DEFINER) inserts, so we can restrict to service_role
DROP POLICY IF EXISTS "System can insert status history" ON public.order_status_history;

-- Admins can also insert (covered by ALL policy already)
-- No additional INSERT policy needed since admin ALL policy covers it
-- and SECURITY DEFINER functions bypass RLS
