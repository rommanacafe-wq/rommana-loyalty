import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NavHeader } from '@/components/nav-header'
import { Noto_Naskh_Arabic } from 'next/font/google'

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
})

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const userName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email
    : user.email

  return (
    <div className={`${notoNaskhArabic.variable} min-h-screen flex flex-col bg-background`}>
      <NavHeader userName={userName} />
      <main className="flex-1">{children}</main>
    </div>
  )
}