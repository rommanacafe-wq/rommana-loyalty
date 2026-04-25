import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { userId, loyaltyCode } = await req.json()

    if (!userId && !loyaltyCode) {
      return NextResponse.json({ error: 'Missing identifier' }, { status: 400 })
    }

    let query = supabase.from('profiles').select('*')

    if (userId) {
      query = query.eq('id', userId)
    } else {
      query = query.eq('loyalty_code', loyaltyCode)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unnamed Member',
      points: data.points_balance || 0,
      loyaltyCode: data.loyalty_code || '',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}