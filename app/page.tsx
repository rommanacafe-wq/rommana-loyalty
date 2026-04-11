import Link from 'next/link'
import Image from 'next/image'
import { Coffee, Gift, Star, Cake, ArrowRight } from 'lucide-react'
import { RommanaLogo } from '@/components/rommana-logo'
import { RommanaRound } from '@/components/rommana-round'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2f241f]">
      
      {/* Top Nav */}
      <header className="border-b border-[#620b0b]/15 bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
  <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
    <RommanaRound size={50} variant="bare" />
  </div>

  <div>
    <p className="font-serif text-2xl font-semibold">Rommana Cafe</p>
    <p className="text-xs uppercase tracking-[0.18em] text-[#620b0b]/65">
      Café Rewards
    </p>
  </div>
</div>


          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-2xl border border-[#620b0b]/20 bg-white px-5 py-2.5 font-medium text-[#620b0b] hover:bg-[#f8f5f0]"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-[#620b0b] px-5 py-2.5 font-medium text-[#f8f5f0] shadow-md hover:opacity-95"
            >
              Join Free
            </Link>
          </div>
        </div>
      </header>

      {/* Intro Banner */}
<section className="mx-auto max-w-7xl px-6 pt-8 md:pt-10">
  <div className="tatreez-border rommana-card rounded-3xl p-6 md:p-8">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
        <RommanaRound size={100} variant="bare" />
      </div>

      <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
        Rommana Café Loyalty
      </p>

      <h1 className="max-w-4xl text-3xl font-semibold text-[#2f241f] md:text-4xl">
        Rooted in flavour. Rewarded with every visit.
      </h1>

      <p className="max-w-2xl text-sm text-[#4d3f38] md:text-base">
        A loyalty experience inspired by Palestinian hospitality, warm gathering,
        and the craft of every cup.
      </p>

      <p className="arabic-hero mt-6 text-[#620b0b]/90">
        أهلاً وسهلاً
      </p>

      <div className="mt-4 h-[2px] w-16 rounded-full bg-[#c8a96b]" />
    </div>
  </div>
</section>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.24em] text-[#620b0b]/75">
            Palestinian-Inspired Loyalty
          </p>

          <h2 className="font-serif text-5xl font-bold md:text-6xl">
            Every Sip Tells a Story.
            <br />
            Earn Rewards with Every Cup.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-[#4d3f38]">
            Join Rommana Rewards and turn your daily coffee ritual into free drinks,
            pastries, and exclusive perks. Earn 1 point for every $1 spent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-2xl bg-[#620b0b] px-8 py-4 text-[#f8f5f0]"
            >
              Start Earning Points
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-2xl border border-[#620b0b]/20 px-8 py-4 text-[#620b0b]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#fffdf9] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          
          <h3 className="font-serif text-4xl font-bold mb-12">
            Simple, warm, and rewarding
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="rommana-card rounded-3xl p-8">
              <Coffee className="mx-auto h-8 w-8 text-[#620b0b]" />
              <h4 className="mt-4 text-xl font-semibold">Earn Points</h4>
              <p className="mt-2 text-[#4d3f38]">
                Get 1 point for every $1 you spend.
              </p>
            </div>

            <div className="rommana-card rounded-3xl p-8">
              <Star className="mx-auto h-8 w-8 text-[#620b0b]" />
              <h4 className="mt-4 text-xl font-semibold">Track Progress</h4>
              <p className="mt-2 text-[#4d3f38]">
                Follow your rewards and progress.
              </p>
            </div>

            <div className="rommana-card rounded-3xl p-8">
              <Gift className="mx-auto h-8 w-8 text-[#620b0b]" />
              <h4 className="mt-4 text-xl font-semibold">Redeem Rewards</h4>
              <p className="mt-2 text-[#4d3f38]">
                Enjoy free drinks and perks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Rewards */}
      <section className="px-6 py-16 md:py-24 text-center">
        <h3 className="font-serif text-4xl font-bold mb-12">
          Rewards You’ll Love
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          <div className="rommana-card p-6 rounded-3xl">
            <Coffee className="mx-auto h-8 w-8 text-[#620b0b]" />
            <p className="mt-3 font-semibold">Free Coffee</p>
            <p className="text-2xl font-bold text-[#620b0b]">50 pts</p>
          </div>

          <div className="rommana-card p-6 rounded-3xl">
            <Gift className="mx-auto h-8 w-8 text-[#620b0b]" />
            <p className="mt-3 font-semibold">Free Pastry</p>
            <p className="text-2xl font-bold text-[#620b0b]">80 pts</p>
          </div>

          <div className="rommana-card p-6 rounded-3xl">
            <Star className="mx-auto h-8 w-8 text-[#620b0b]" />
            <p className="mt-3 font-semibold">Lunch Combo</p>
            <p className="text-2xl font-bold text-[#620b0b]">150 pts</p>
          </div>

          <div className="rommana-card p-6 rounded-3xl">
            <Cake className="mx-auto h-8 w-8 text-[#c8a96b]" />
            <p className="mt-3 font-semibold">Birthday Drink</p>
            <p className="text-2xl font-bold text-[#c8a96b]">FREE</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[#fffdf9] px-6 py-8 text-center text-sm text-[#4d3f38]">
        Rommana Café — Earn points. Enjoy every cup.
      </footer>
    </div>
  )
}