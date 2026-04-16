import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const CAMPAIGN = 'anniversary_1_year_2026'

type InventoryRow = {
  id: string
  reward_type: string
  title: string
  description: string | null
  quantity_remaining: number | string
  is_physical: boolean | null
}

function pickPrize(prizes: InventoryRow[]): InventoryRow | null {
  if (!prizes || prizes.length === 0) return null

  const pool: InventoryRow[] = []

  for (const prize of prizes) {
    const qty = Number(prize.quantity_remaining)
    if (qty > 0) {
      for (let i = 0; i < qty; i++) {
        pool.push(prize)
      }
    }
  }

  if (pool.length === 0) return null

  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // HARD LOCK: only one giveaway claim per user per campaign
    const { error: claimError } = await supabase
      .from('giveaway_claims')
      .insert({
        user_id: userId,
        campaign: CAMPAIGN,
      })

    if (claimError) {
      return NextResponse.json({ alreadyProcessed: true })
    }

    const { data: inventory, error: inventoryError } = await supabase
      .from('giveaway_inventory')
      .select('*')
      .eq('campaign', CAMPAIGN)
      .gt('quantity_remaining', 0)

    if (inventoryError) {
      return NextResponse.json({ error: inventoryError.message }, { status: 500 })
    }

    const prizes = (inventory || []) as InventoryRow[]
    const prize = pickPrize(prizes)

    if (!prize) {
      return NextResponse.json({ winner: false })
    }

    const currentQty = Number(prize.quantity_remaining)

    // SAFE decrement: only update if quantity is still exactly what we read
    const { data: updatedRows, error: inventoryUpdateError } = await supabase
      .from('giveaway_inventory')
      .update({
        quantity_remaining: currentQty - 1,
      })
      .eq('id', prize.id)
      .eq('quantity_remaining', currentQty)
      .select('id')

    if (inventoryUpdateError) {
      return NextResponse.json(
        { error: inventoryUpdateError.message },
        { status: 500 }
      )
    }

    // If no row updated, another request already took this prize
    if (!updatedRows || updatedRows.length === 0) {
      return NextResponse.json({ alreadyProcessed: true })
    }

    if (prize.reward_type === 'bonus_points') {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points_balance, total_points_earned')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      await supabase
        .from('profiles')
        .update({
          points_balance: (profile.points_balance || 0) + 10,
          total_points_earned: (profile.total_points_earned || 0) + 10,
        })
        .eq('id', userId)

      await supabase.from('transactions').insert({
        user_id: userId,
        description: 'Anniversary Giveaway Bonus',
        points_earned: 10,
        amount: 0,
      })
    } else {
      await supabase.from('user_rewards').insert({
        user_id: userId,
        title: prize.title,
        description: prize.description,
        status: 'available',
        reward_type: prize.reward_type,
        campaign: CAMPAIGN,
        reward_source: 'signup_giveaway',
      })
    }

    return NextResponse.json({
      winner: true,
      rewardType: prize.reward_type,
      rewardTitle: prize.title,
      rewardDescription: prize.description,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}