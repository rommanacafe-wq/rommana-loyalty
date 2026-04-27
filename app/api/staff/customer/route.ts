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

    const { data: isStaff } = await supabase
      .from('staff_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!isStaff) {
      return NextResponse.json({ error: 'Staff access required' }, { status: 403 })
    }

    const body = await req.json()
    const userId = body.userId ? String(body.userId).trim() : ''
    const loyaltyCode = body.loyaltyCode ? String(body.loyaltyCode).trim() : ''

    if (!userId && !loyaltyCode) {
      return NextResponse.json(
        { error: 'Missing user ID or loyalty code' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('profiles')
      .select('id, first_name, last_name, points_balance, loyalty_code')

    if (userId) {
      query = query.eq('id', userId)
    } else {
      query = query.eq('loyalty_code', loyaltyCode)
    }

    const { data: profile, error } = await query.maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: profile.id,
      name:
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
        'Unnamed Member',
      points: profile.points_balance || 0,
      loyaltyCode: profile.loyalty_code || '',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}