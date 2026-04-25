import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // 1. Purchases / points
    const { data: transactions } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // 2. Redemptions (points rewards)
    const { data: redemptions } = await supabase
      .from('redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'redeemed')
      .order('created_at', { ascending: false })

    // 3. User rewards (birthday etc)
    const { data: userRewards } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .not('redeemed_at', 'is', null)
      .order('redeemed_at', { ascending: false })

    // Normalize everything into one format
    const history = [
      ...(transactions || []).map((t) => ({
        type: 'purchase',
        title: 'Points Earned',
        points: t.points,
        date: t.created_at,
      })),

      ...(redemptions || []).map((r) => ({
        type: 'reward',
        title: r.reward_name,
        date: r.created_at,
      })),

      ...(userRewards || []).map((r) => ({
        type: 'reward',
        title: r.title || 'Reward',
        date: r.redeemed_at,
      })),
    ]

    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}