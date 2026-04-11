if (isBirthday && user) {
  const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString()
  const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59).toISOString()

  const { data: existingBirthdayReward } = await supabase
    .from('user_rewards')
    .select('id')
    .eq('user_id', user.id)
    .eq('reward_type', 'birthday_drink')
    .gte('created_at', startOfYear)
    .lte('created_at', endOfYear)
    .maybeSingle()

  if (!existingBirthdayReward) {
    await supabase.from('user_rewards').insert({
      user_id: user.id,
      reward_type: 'birthday_drink',
      title: 'Free Birthday Drink',
      description: 'Enjoy a free drink on us for your birthday.',
      points_cost: 0,
      status: 'available',
    })
  }
}
const { data: birthdayReward } = await supabase
  .from('user_rewards')
  .select('*')
  .eq('user_id', user.id)
  .eq('reward_type', 'birthday_drink')
  .eq('status', 'available')
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle()