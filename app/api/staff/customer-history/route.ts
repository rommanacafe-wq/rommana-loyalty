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

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: redemptions } = await supabase
      .from('redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'redeemed')
      .order('created_at', { ascending: false })

    const { data: userRewards } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'redeemed')
      .order('redeemed_at', { ascending: false })

    return NextResponse.json({
      purchases: transactions || [],
      redemptions: [
        ...(redemptions || []),
        ...(userRewards || []),
      ],
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}