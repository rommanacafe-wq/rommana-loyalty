-- Create redemptions table to track reward claims
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE SET NULL,
  points_spent INTEGER NOT NULL,
  redemption_code TEXT UNIQUE NOT NULL,
  reward_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only view their own redemptions
CREATE POLICY "redemptions_select_own" ON public.redemptions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "redemptions_insert_own" ON public.redemptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "redemptions_update_own" ON public.redemptions 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_code ON public.redemptions(redemption_code);

-- Function to deduct points when a redemption is created
CREATE OR REPLACE FUNCTION public.deduct_points_on_redemption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has enough points
  IF (SELECT points_balance FROM public.profiles WHERE id = NEW.user_id) < NEW.points_spent THEN
    RAISE EXCEPTION 'Insufficient points balance';
  END IF;
  
  -- Deduct points from user's balance
  UPDATE public.profiles
  SET points_balance = points_balance - NEW.points_spent
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-deduct points on new redemption
DROP TRIGGER IF EXISTS on_redemption_created ON public.redemptions;

CREATE TRIGGER on_redemption_created
  BEFORE INSERT ON public.redemptions
  FOR EACH ROW
  EXECUTE FUNCTION public.deduct_points_on_redemption();
