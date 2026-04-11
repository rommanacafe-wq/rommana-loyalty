import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data: userRewards, error: userRewardsError } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'available')

    if (userRewardsError) {
      return NextResponse.json({ error: userRewardsError.message }, { status: 500 })
    }

    const { data: redemptions, error: redemptionsError } = await supabase
      .from('redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (redemptionsError) {
      return NextResponse.json({ error: redemptionsError.message }, { status: 500 })
    }

    const results = [
      ...(userRewards || []).map((reward) => ({
        id: reward.id,
        source: 'user_rewards',
        title: reward.title || 'Reward',
        description: reward.description || '',
        status: reward.status,
        redemption_code: reward.redemption_code || null,
        reward_type: reward.reward_type || null,
      })),
      ...(redemptions || []).map((reward) => ({
        id: reward.id,
        source: 'redemptions',
        title: reward.reward_name || 'Reward',
        description: reward.reward_description || '',
        status: reward.status,
        redemption_code: reward.redemption_code || null,
        reward_type: 'points_reward',
      })),
    ]

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}