import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { userId, amountSpent } = await req.json()

    if (!userId || amountSpent === undefined || amountSpent === null) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const amount = Number(amountSpent)

    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const pointsToAdd = Math.floor(amount)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, points_balance, total_points_earned')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const newPointsBalance = (profile.points_balance || 0) + pointsToAdd
    const newTotalEarned = (profile.total_points_earned || 0) + pointsToAdd

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points_balance: newPointsBalance,
        total_points_earned: newTotalEarned,
      })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pointsAdded: pointsToAdd,
      newPointsBalance,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}