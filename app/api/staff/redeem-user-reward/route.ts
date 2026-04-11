import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
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