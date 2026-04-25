import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()

    const search = String(body.search || body.firstName || '').trim()

    if (!search) {
      return NextResponse.json({ error: 'Missing search term' }, { status: 400 })
    }

    const cleanedPhone = search.replace(/\D/g, '')

    const filters = [
      `first_name.ilike.%${search}%`,
      `last_name.ilike.%${search}%`,
      `email.ilike.%${search}%`,
      `loyalty_code.ilike.%${search}%`,
    ]

    if (cleanedPhone) {
      filters.push(`phone.ilike.%${cleanedPhone}%`)
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, points_balance, loyalty_code')
      .or(filters.join(','))
      .order('first_name', { ascending: true })
      .limit(20)
console.log('SEARCH TERM:', search)
console.log('SEARCH RESULTS:', data)
console.log('SEARCH ERROR:', error)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      (data || []).map((row) => ({
        id: row.id,
        name:
          `${row.first_name || ''} ${row.last_name || ''}`.trim() ||
          row.email ||
          row.phone ||
          'Unnamed Member',
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