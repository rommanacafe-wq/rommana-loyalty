import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    const { data, error } = await supabase
      .from('rewards')
      .select('id, title, description, points_required, category')
      .eq('is_active', true)
      .order('points_required', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}