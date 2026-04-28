import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StaffPage from './StaffPage'

export default async function StaffRoute() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: staffUser } = await supabase
    .from('staff_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!staffUser) {
    redirect('/dashboard')
  }

  return <StaffPage />
}