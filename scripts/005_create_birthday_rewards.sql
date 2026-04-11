-- Create birthday_rewards table to track annual birthday claims
CREATE TABLE IF NOT EXISTS public.birthday_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  redemption_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, year)
);

-- Enable Row Level Security
ALTER TABLE public.birthday_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only view their own birthday rewards
CREATE POLICY "birthday_rewards_select_own" ON public.birthday_rewards 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "birthday_rewards_insert_own" ON public.birthday_rewards 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "birthday_rewards_update_own" ON public.birthday_rewards 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_birthday_rewards_user_id ON public.birthday_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_birthday_rewards_year ON public.birthday_rewards(year);
CREATE INDEX IF NOT EXISTS idx_birthday_rewards_code ON public.birthday_rewards(redemption_code);
