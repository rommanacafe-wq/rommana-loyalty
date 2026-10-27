import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
)

export async function POST(req: Request) {
  try {
    const { userId, amountSpent } = await req.json()

    if (!userId || amountSpent === undefined || amountSpent === null) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const amount = Number(amountSpent)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const pointsToAdd = Math.floor(amount)

    // 1) verify customer exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, points_balance, total_points_earned')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // 2) insert transaction
    const { error: transactionError } = await supabaseAdmin
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

    // 3) update profile directly with admin client
    const nextBalance = Number(profile.points_balance || 0) + pointsToAdd
    const nextTotal = Number(profile.total_points_earned || 0) + pointsToAdd

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        points_balance: nextBalance,
        total_points_earned: nextTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pointsAdded: pointsToAdd,
      newPointsBalance: nextBalance,
      newTotalPointsEarned: nextTotal,
    })
  } catch (error) {
    console.error('ADD POINTS API ERROR:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
