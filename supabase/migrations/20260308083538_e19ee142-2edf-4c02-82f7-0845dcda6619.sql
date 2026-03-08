
-- Add invoice_url column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_url text DEFAULT '';

-- Create invoices storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read their own invoices
CREATE POLICY "Users can download their own invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow service role to upload invoices (edge functions use service role)
CREATE POLICY "Service role can upload invoices"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'invoices');
