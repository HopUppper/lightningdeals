
-- Referral codes: each user gets a unique code
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  wallet_balance numeric NOT NULL DEFAULT 0,
  total_earned numeric NOT NULL DEFAULT 0,
  total_referrals integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own referral code
CREATE POLICY "Users can view own referral code"
ON public.referral_codes FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own referral code (auto-generated on first visit)
CREATE POLICY "Users can create own referral code"
ON public.referral_codes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- System updates via triggers only; users can read
CREATE POLICY "Admins can manage referral codes"
ON public.referral_codes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Referral transactions log
CREATE TABLE public.referral_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  reward_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'credited',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own referral transactions
CREATE POLICY "Users can view own referral transactions"
ON public.referral_transactions FOR SELECT
USING (auth.uid() = referrer_id);

-- Admins can manage all
CREATE POLICY "Admins can manage referral transactions"
ON public.referral_transactions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add referred_by column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by text DEFAULT '';

-- Function to process referral reward after order is paid
CREATE OR REPLACE FUNCTION public.process_referral_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referrer_code text;
  referrer_user_id uuid;
  reward numeric;
BEGIN
  -- Only process when payment becomes 'paid'
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS DISTINCT FROM 'paid') THEN
    -- Check if the buyer has a referrer
    SELECT referred_by INTO referrer_code
    FROM public.profiles
    WHERE user_id = NEW.user_id;

    IF referrer_code IS NOT NULL AND referrer_code != '' THEN
      -- Find the referrer
      SELECT user_id INTO referrer_user_id
      FROM public.referral_codes
      WHERE code = referrer_code;

      IF referrer_user_id IS NOT NULL AND referrer_user_id != NEW.user_id THEN
        -- 10% reward (capped at ₹50)
        reward := LEAST(ROUND(NEW.payment_amount * 0.10, 2), 50);

        -- Insert transaction
        INSERT INTO public.referral_transactions (referrer_id, referred_id, order_id, reward_amount)
        VALUES (referrer_user_id, NEW.user_id, NEW.id, reward);

        -- Update referrer's wallet
        UPDATE public.referral_codes
        SET wallet_balance = wallet_balance + reward,
            total_earned = total_earned + reward,
            total_referrals = total_referrals + 1
        WHERE user_id = referrer_user_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on order update
CREATE TRIGGER trigger_referral_reward
AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION process_referral_reward();
