import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }

    const { data: redemption, error } = await supabase
      .from('redemptions')
      .select('*')
      .eq('redemption_code', code)
      .single()

    if (error || !redemption) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
    }

    if (redemption.status === 'redeemed') {
      return NextResponse.json({ error: 'Already redeemed' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('redemptions')
      .update({
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', redemption.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    )
  }
}