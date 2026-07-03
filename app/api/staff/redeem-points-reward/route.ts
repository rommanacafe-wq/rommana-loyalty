import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: staffUser } = await supabase
      .from('staff_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!staffUser) {
      return NextResponse.json({ error: 'Staff access required' }, { status: 403 })
    }

    const { userId, rewardId } = await req.json()

    if (!userId || !rewardId) {
      return NextResponse.json({ error: 'Missing userId or rewardId' }, { status: 400 })
    }

    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('id, title, description, points_required, category, is_active')
      .eq('id', rewardId)
      .eq('is_active', true)
      .single()

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, points_balance')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const currentPoints = Number(profile.points_balance || 0)
    const cost = Number(reward.points_required || 0)

    if (currentPoints < cost) {
      return NextResponse.json(
        { error: 'Customer does not have enough points' },
        { status: 400 }
      )
    }

    const newBalance = currentPoints - cost

    const { data: updatedProfile, error: updateProfileError } = await supabase
      .from('profiles')
      .update({ points_balance: newBalance })
      .eq('id', userId)
      .select('id, points_balance')
      .single()

    if (updateProfileError || !updatedProfile) {
      return NextResponse.json(
        { error: updateProfileError?.message || 'Failed to update points balance' },
        { status: 500 }
      )
    }

    const { error: transactionError } = await supabase.from('transactions').insert({
      user_id: userId,
      description: `Redeemed: ${reward.title}`,
      points_earned: -cost,
      amount: 0,
    })

    if (transactionError) {
      return NextResponse.json({ error: transactionError.message }, { status: 500 })
    }

    const { error: userRewardError } = await supabase.from('user_rewards').insert({
      user_id: userId,
      title: reward.title,
      description: reward.description,
      status: 'redeemed',
      reward_type: reward.category,
      redeemed_at: new Date().toISOString(),
      reward_source: 'staff_points_redemption',
      points_cost: cost,
    })

    if (userRewardError) {
      return NextResponse.json({ error: userRewardError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      newPointsBalance: Number(updatedProfile.points_balance || 0),
      pointsDeducted: cost,
      rewardTitle: reward.title,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}