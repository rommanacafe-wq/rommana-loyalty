-- Seed initial rewards catalog
INSERT INTO public.rewards (name, description, points_cost, category) VALUES
  ('Free Drip Coffee', 'Any size house drip coffee', 50, 'drinks'),
  ('Free Latte', 'Any size classic latte', 80, 'drinks'),
  ('Free Specialty Drink', 'Any specialty drink up to $7', 120, 'drinks'),
  ('Fresh Pastry', 'Choice of daily pastry', 80, 'food'),
  ('Breakfast Sandwich', 'Any breakfast sandwich', 150, 'food'),
  ('Bag of Coffee Beans', '12oz bag of house blend', 250, 'merchandise'),
  ('Branded Mug', 'Ceramic café mug', 200, 'merchandise'),
  ('$5 Off', 'Redeem 100 points for $5 off any purchase', 100, 'discount'),
  ('$10 Off', 'Redeem 200 points for $10 off any purchase', 200, 'discount'),
  ('$25 Off', 'Redeem 500 points for $25 off any purchase', 500, 'discount')
ON CONFLICT DO NOTHING;
