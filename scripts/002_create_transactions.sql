-- Create transactions table to track point-earning purchases
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  points_earned INTEGER NOT NULL,
  description TEXT,
  receipt_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only view their own transactions
CREATE POLICY "transactions_select_own" ON public.transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own" ON public.transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- Function to update user's points balance when a transaction is added
CREATE OR REPLACE FUNCTION public.update_points_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    points_balance = points_balance + NEW.points_earned,
    total_points_earned = total_points_earned + NEW.points_earned
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update points on new transaction
DROP TRIGGER IF EXISTS on_transaction_created ON public.transactions;

CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_points_on_transaction();
