import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { firstName } = await req.json()

    if (!firstName || !String(firstName).trim()) {
      return NextResponse.json({ error: 'Missing first name' }, { status: 400 })
    }

    const query = String(firstName).trim()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, points_balance, loyalty_code')
      .ilike('first_name', `${query}%`)
      .order('first_name', { ascending: true })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      (data || []).map((row) => ({
        id: row.id,
        name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Unnamed Member',
        points: row.points_balance || 0,
        loyaltyCode: row.loyalty_code || '',
      }))
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}