-- Create rewards catalog table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  category TEXT DEFAULT 'item',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies - everyone can view active rewards
CREATE POLICY "rewards_select_active" ON public.rewards 
  FOR SELECT USING (is_active = true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rewards_points_cost ON public.rewards(points_cost);
CREATE INDEX IF NOT EXISTS idx_rewards_category ON public.rewards(category);
