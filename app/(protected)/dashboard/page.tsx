import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowRight, Download } from 'lucide-react'
import QRCode from 'react-qr-code'
import { BirthdayBanner } from '@/components/birthday-banner'
import { RommanaRound } from '@/components/rommana-round'
import AnniversaryGiveawayBanner from '@/components/AnniversaryGiveawayBanner'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const firstName = profile?.first_name || ''
  const lastName = profile?.last_name || ''
  const memberName = `${firstName} ${lastName}`.trim() || user.email || 'Guest'
  const loyaltyCode =
    profile?.loyalty_code || `RMNA-${user.id.slice(0, 8).toUpperCase()}`
  const points = profile?.points_balance || 0

  const rewardGoal = 50
  const progress = Math.min((points / rewardGoal) * 100, 100)
  const pointsRemaining = Math.max(rewardGoal - points, 0)

  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  const birthdayRaw = profile?.birthday ?? null
  const birthdayString =
    typeof birthdayRaw === 'string'
      ? birthdayRaw
      : birthdayRaw
        ? String(birthdayRaw)
        : null

  const birthdayParts = birthdayString ? birthdayString.split('-') : null
  const birthdayMonth =
    birthdayParts && birthdayParts.length === 3 ? Number(birthdayParts[1]) : null
  const birthdayDay =
    birthdayParts && birthdayParts.length === 3 ? Number(birthdayParts[2]) : null

  const isBirthday = birthdayMonth === todayMonth && birthdayDay === todayDay

  const { data: existingBirthdayReward } = await supabase
    .from('user_rewards')
    .select('id')
    .eq('user_id', user.id)
    .eq('reward_type', 'birthday_drink')
    .eq('reward_year', new Date().getFullYear())
    .maybeSingle()

  const hasClaimedThisYear = !!existingBirthdayReward

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-8 text-[#2f241f]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <div className="tatreez-border rommana-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
                <RommanaRound size={100} variant="bare" />
              </div>

              <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
                Rommana Café Rewards
              </p>

              <h1 className="text-3xl font-semibold text-[#2f241f] md:text-4xl">
                Your loyalty, rooted in every visit
              </h1>

              <p className="max-w-2xl text-sm text-[#4d3f38] md:text-base">
                Track your points, unlock handcrafted rewards, and carry your Rommana
                membership with you every time you stop by.
              </p>

              <p className="arabic-hero mt-6 text-[#620b0b]/90">أهلاً وسهلاً</p>
              <div className="h-[2px] w-16 rounded-full bg-[#c8a96b]" />
            </div>
          </div>
        </section>

        {isBirthday && (
          <BirthdayBanner
            userId={user.id}
            hasClaimedThisYear={hasClaimedThisYear}
          />
        )}
        <AnniversaryGiveawayBanner />

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rommana-premium relative overflow-hidden rounded-[32px] p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white_0,transparent_40%)]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                    Member Card
                  </p>
                  <h2 className="text-2xl font-semibold text-white md:text-3xl">
                    Rommana Rewards
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm">
                  <QRCode
                    value={`userId=${user.id}&code=${loyaltyCode}`}
                    size={100}
                    bgColor="#FFFFFF"
                    fgColor="#620b0b"
                  />
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-white/70">Member</p>
                  <p className="mt-1 text-xl font-medium text-white">{memberName}</p>
                </div>

                <div>
                  <p className="text-sm text-white/70">Loyalty Code</p>
                  <p className="mt-1 text-lg font-semibold tracking-[0.2em] text-white">
                    {loyaltyCode}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/15 pt-6">
                <div>
                  <p className="text-sm text-white/70">Points Balance</p>
                  <p className="mt-1 text-5xl font-bold text-white">{points}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white/70">Next Reward</p>
                  <p className="mt-1 text-lg font-medium text-white">Free Coffee</p>
                  <p className="text-sm text-white/70">at 50 points</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rommana-card rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                Reward Progress
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#2f241f]">
                Free drink at 50 points
              </h3>

              <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-[#eadfd6]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#620b0b] to-[#c8a96b] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-[#4d3f38]">{points}/50 points</p>
                <p className="text-sm font-medium text-[#620b0b]">
                  {pointsRemaining > 0 ? `${pointsRemaining} points left` : 'Reward unlocked'}
                </p>
              </div>
            </div>

            <div className="rommana-card rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                Quick Actions
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/rewards"
                  className="inline-flex items-center justify-between rounded-2xl border border-[#620b0b]/10 bg-white px-4 py-4 transition hover:bg-[#f8f5f0]"
                >
                  <span className="font-medium text-[#2f241f]">View rewards</span>
                  <ArrowRight className="h-4 w-4 text-[#620b0b]" />
                </Link>

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-between rounded-2xl border border-[#620b0b]/10 bg-white px-4 py-4 transition hover:bg-[#f8f5f0]"
                >
                  <span className="font-medium text-[#2f241f]">Open profile</span>
                  <ArrowRight className="h-4 w-4 text-[#620b0b]" />
                </Link>

                <Link
                  href="/install"
                  className="inline-flex items-center justify-between rounded-2xl border border-[#620b0b]/10 bg-white px-4 py-4 transition hover:bg-[#f8f5f0]"
                >
                  <span className="flex items-center gap-2 font-medium text-[#2f241f]">
                    <Download className="h-4 w-4 text-[#620b0b]" />
                    Add to Home Screen
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#620b0b]" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#620b0b]/10 bg-[#fffdf9] p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Gift className="mt-0.5 h-5 w-5 text-[#620b0b]" />
                <div>
                  <p className="font-medium text-[#2f241f]">Tip</p>
                  <p className="mt-1 text-sm text-[#4d3f38]">
                    Add Rommana Rewards to your home screen for quicker access in-store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}