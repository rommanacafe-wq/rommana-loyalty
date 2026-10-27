
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { userId, amountSpent } = await req.json()

    if (!userId || amountSpent === undefined || amountSpent === null) {
      return NextResponse.json(
        { error: 'Missing data' },
        { status: 400 }
      )
    }

    const amount = Number(amountSpent)

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const pointsToAdd = Math.floor(amount)

    if (pointsToAdd < 1) {
      return NextResponse.json(
        { error: 'Amount must earn at least 1 point' },
        { status: 400 }
      )
    }

    // Confirm the customer exists.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Insert one transaction.
    // The Supabase trigger updates points_balance and
    // total_points_earned automatically.
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        description: 'In-store purchase',
        amount,
        points_earned: pointsToAdd,
      })

    if (transactionError) {
      console.error('ADD POINTS TRANSACTION ERROR:', transactionError)

      return NextResponse.json(
        { error: transactionError.message },
        { status: 500 }
      )
    }

    // Fetch the balance after the trigger runs.
    const { data: updatedProfile, error: updatedProfileError } =
      await supabase
        .from('profiles')
        .select('points_balance, total_points_earned')
        .eq('id', userId)
        .single()

    if (updatedProfileError || !updatedProfile) {
      return NextResponse.json(
        {
          success: true,
          pointsAdded: pointsToAdd,
          warning: 'Points were recorded, but the updated balance could not be retrieved.',
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      success: true,
      pointsAdded: pointsToAdd,
      newPointsBalance: updatedProfile.points_balance,
      newTotalPointsEarned: updatedProfile.total_points_earned,
    })
  } catch (error) {
    console.error('ADD POINTS API ERROR:', error)

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Server error',
      },
      { status: 500 }
    )
  }
}
