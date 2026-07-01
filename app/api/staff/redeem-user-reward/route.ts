import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getTorontoWeekRange() {
  const now = new Date()

  const torontoNow = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Toronto' })
  )

  const day = torontoNow.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(torontoNow)
  monday.setDate(torontoNow.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  }
}

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

    const { rewardId } = await req.json()

    if (!rewardId) {
      return NextResponse.json({ error: 'Missing rewardId' }, { status: 400 })
    }

    const { data: reward, error: rewardError } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('id', rewardId)
      .single()

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    if (reward.reward_type === 'coffee_for_year') {
      const nowIso = new Date().toISOString()

      if (reward.ends_at && new Date(nowIso) > new Date(reward.ends_at)) {
        return NextResponse.json({ error: 'This reward has expired' }, { status: 400 })
      }

      const { weekStart, weekEnd } = getTorontoWeekRange()

      const { data: existingUse } = await supabase
        .from('reward_usage_logs')
        .select('id, used_at')
        .eq('user_reward_id', reward.id)
        .eq('week_start', weekStart)
        .maybeSingle()

      if (existingUse) {
        return NextResponse.json(
          { error: 'This weekly drink has already been redeemed this week' },
          { status: 400 }
        )
      }

      const { error: usageError } = await supabase
        .from('reward_usage_logs')
        .insert({
          user_id: reward.user_id,
          user_reward_id: reward.id,
          staff_user_id: user.id,
          reward_type: reward.reward_type,
          week_start: weekStart,
          week_end: weekEnd,
          notes: 'Weekly Coffee for a Year redemption',
        })

      if (usageError) {
        return NextResponse.json({ error: usageError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        weeklyReward: true,
        message: 'Weekly drink redeemed successfully',
        weekStart,
        weekEnd,
      })
    }

    if (reward.redeemed_at) {
      return NextResponse.json({ error: 'Reward already redeemed' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('user_rewards')
      .update({
        redeemed_at: new Date().toISOString(),
        status: 'redeemed',
      })
      .eq('id', rewardId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('REDEEM USER REWARD API ERROR:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}