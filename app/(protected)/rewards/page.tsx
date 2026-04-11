import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { RewardCard } from '@/components/reward-card'
import { RommanaRound } from '@/components/rommana-round'
import { DiscountRedemption } from '@/components/discount-redemption'
import {
  Gift,
  Coffee,
  ArrowRight,
  Sparkles,
  Cake,
  Ticket,
} from 'lucide-react'

export default async function RewardsPage() {
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

  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('points_required', { ascending: true })

  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  const { data: redemptions } = await supabase
    .from('redemptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const userPoints = profile?.points_balance || 0
  const pointsValue = (userPoints / 20).toFixed(2)

  const { data: pastRedemptions } = await supabase
  .from('redemptions')
  .select('*')
  .eq('user_id', user.id)
  .eq('status', 'redeemed')
  .order('redeemed_at', { ascending: false })

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
                Rewards Catalogue
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#2f241f]">
                Redeem something worth coming back for
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-[#4d3f38]">
                Turn your loyalty into handcrafted drinks, pastries, and flexible
                discounts inspired by every visit to Rommana.
              </p>
              <p className="arabic-hero text-[#620b0b]/90 mt-2">أهلاً وسهلاً</p>
              <div className="h-[2px] w-16 rounded-full bg-[#c8a96b]" />
            </div>
          </div>
        </section>

        <section className="rommana-premium rounded-[32px] p-6 md:p-8 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white_0,transparent_40%)]" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Coffee className="h-8 w-8 text-white" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                  Your Balance
                </p>
                <p className="mt-1 text-4xl font-bold text-white">
                  {userPoints.toLocaleString()} points
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center sm:text-left">
                <p className="text-sm text-white/70">Approx. value</p>
                <p className="text-2xl font-semibold text-white">${pointsValue}</p>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl bg-[#f8f5f0] px-6 py-4 font-medium text-[#620b0b] shadow-md transition hover:opacity-95"
              >
                Back to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {((userRewards && userRewards.length > 0) || (redemptions && redemptions.length > 0)) && (
          <section className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                Ready to Use In-Store
              </p>
            
              <h2 className="mt-2 text-2xl font-semibold text-[#2f241f]">
                Your active rewards and redemptions
              </h2>
            </div>
          

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {userRewards?.map((reward) => (
                <div
                  key={`user-reward-${reward.id}`}
                  className="rommana-card rounded-3xl border border-[#620b0b]/10 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#620b0b]/10">
                      {reward.reward_type === 'birthday_drink' ? (
                        <Cake className="h-6 w-6 text-[#c8a96b]" />
                      ) : (
                        <Ticket className="h-6 w-6 text-[#620b0b]" />
                      )}
                    </div>

                    <span className="rounded-full bg-[#620b0b]/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-[#620b0b]">
                      {reward.status}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold text-[#2f241f]">
                    {reward.title}
                  </h3>

                  {reward.description && (
                    <p className="mt-2 text-sm leading-6 text-[#4d3f38]">
                      {reward.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-[#4d3f38]">
                    {reward.expires_at ? (
                      <p>
                        <span className="font-medium text-[#2f241f]">Expires:</span>{' '}
                        {new Date(reward.expires_at).toLocaleDateString()}
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium text-[#2f241f]">Status:</span>{' '}
                        Show this reward in-store to redeem
                      </p>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#620b0b]/10 bg-white/70 p-4">
                    <p className="text-sm text-[#4d3f38]">
                      Present this reward to staff at checkout for redemption.
                    </p>
                  </div>
                </div>
              ))}

              {redemptions?.map((redemption) => (
                <div
                  key={`redemption-${redemption.id}`}
                  className="rommana-card rounded-3xl border border-[#620b0b]/10 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#620b0b]/10">
                      <Ticket className="h-6 w-6 text-[#620b0b]" />
                    </div>

                    <span className="rounded-full bg-[#620b0b]/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-[#620b0b]">
                      {redemption.status}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold text-[#2f241f]">
                    {redemption.reward_name}
                  </h3>

                  {redemption.reward_description && (
                    <p className="mt-2 text-sm leading-6 text-[#4d3f38]">
                      {redemption.reward_description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-[#4d3f38]">
                    <p>
                      <span className="font-medium text-[#2f241f]">Code:</span>{' '}
                      <span className="font-mono font-semibold">{redemption.redemption_code}</span>
                    </p>

                    {redemption.expires_at && (
                      <p>
                        <span className="font-medium text-[#2f241f]">Expires:</span>{' '}
                        {new Date(redemption.expires_at).toLocaleDateString()}
                      </p>
                    )}

                    <p>
                      <span className="font-medium text-[#2f241f]">Points spent:</span>{' '}
                      {redemption.points_spent}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#620b0b]/10 bg-white/70 p-4">
                    <p className="text-sm text-[#4d3f38]">
                      Show this redemption code in-store to claim your reward.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      
        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                  Available Rewards
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2f241f]">
                  Choose your next treat
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rewards?.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={userPoints}
                  userId={user.id}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rommana-card rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#620b0b]/10">
                  <Sparkles className="h-6 w-6 text-[#620b0b]" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                    Flexible Discount
                  </p>
                  <h3 className="text-xl font-semibold text-[#2f241f]">
                    Convert points your way
                  </h3>
                </div>
              </div>

              <div className="mt-5">
                <DiscountRedemption userPoints={userPoints} userId={user.id} />
              </div>
            </div>

            <Card className="rommana-card rounded-3xl border-[#620b0b]/10 shadow-none">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                    How Redemption Works
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#2f241f]">
                    Simple and rewarding
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-[#4d3f38]">
                  <li className="flex gap-3">
                    <span className="min-w-6 font-bold text-[#620b0b]">1.</span>
                    Choose a reward or convert your points into a discount.
                  </li>
                  <li className="flex gap-3">
                    <span className="min-w-6 font-bold text-[#620b0b]">2.</span>
                    Claim or confirm the reward inside your account.
                  </li>
                  <li className="flex gap-3">
                    <span className="min-w-6 font-bold text-[#620b0b]">3.</span>
                    Show your reward in-store at checkout.
                  </li>
                  <li className="flex gap-3">
                    <span className="min-w-6 font-bold text-[#620b0b]">4.</span>
                    Enjoy your reward, your discount, or your next free treat.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#620b0b]/10 bg-[#fffdf9] shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-[#620b0b]" />
                  <div>
                    <h4 className="font-semibold text-[#2f241f]">Rommana Tip</h4>
                    <p className="mt-1 text-sm text-[#4d3f38]">
                      Save your points for larger rewards, or redeem smaller treats more often.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}