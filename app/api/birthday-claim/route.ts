import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const today = new Date()
    const rewardYear = today.getFullYear()

    const { data: existing, error: existingError } = await supabase
      .from('user_rewards')
      .select('id')
      .eq('user_id', user.id)
      .eq('reward_type', 'birthday_drink')
      .eq('reward_year', rewardYear)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyClaimed: true,
      })
    }
const expiresAt = new Date()
expiresAt.setDate(expiresAt.getDate() + 7)
    const { error: insertError } = await supabase.from('user_rewards').insert({
  user_id: user.id,
  reward_type: 'birthday_drink',
  title: 'Free Birthday Drink',
  description: 'Enjoy a free drink on us for your birthday.',
  points_cost: 0,
  status: 'available',
  reward_year: rewardYear,
  expires_at: expiresAt.toISOString(),
})

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    )
  }
}