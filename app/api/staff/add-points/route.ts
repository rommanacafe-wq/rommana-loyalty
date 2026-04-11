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

    // Insert transaction only (trigger will update points)
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        description: 'In-store purchase',
        amount,
        points_earned: pointsToAdd,
      })

    if (transactionError) {
      return NextResponse.json({ error: transactionError.message }, { status: 500 })
    }

    // Fetch updated profile (after trigger ran)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, points_balance, total_points_earned')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      pointsAdded: pointsToAdd,
      newPointsBalance: profile.points_balance,
      newTotalPointsEarned: profile.total_points_earned,
    })
  } catch (error) {
    console.error('ADD POINTS API ERROR:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    )
  }
}