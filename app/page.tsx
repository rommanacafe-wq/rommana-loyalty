import Link from 'next/link'
import { Coffee, Gift, Star, Cake, ArrowRight } from 'lucide-react'
import { RommanaRound } from '@/components/rommana-round'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2f241f]">
      <header className="border-b border-[#620b0b]/15 bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
  <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
    <RommanaRound size={40} variant="bare" />
            </div>

            <div>
              <p className="font-serif text-2xl font-semibold">Rommana Cafe</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#620b0b]/65">
                Café Rewards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-2xl border border-[#620b0b]/20 bg-white px-5 py-2.5 font-medium text-[#620b0b] transition hover:bg-[#f8f5f0]"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-[#620b0b] px-5 py-2.5 font-medium text-[#f8f5f0] shadow-md transition hover:opacity-95"
            >
              Join Free
            </Link>
          </div>
        </div>
      </header>

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

            <p className="arabic-hero mt-6 text-[#620b0b]/90">أهلاً وسهلاً</p>

            <div className="mt-4 h-[2px] w-16 rounded-full bg-[#c8a96b]" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.24em] text-[#620b0b]/75">
            Palestinian-Inspired Loyalty
          </p>

          <h2 className="font-serif text-5xl font-bold leading-tight text-[#2f241f] md:text-6xl">
            Every Sip Tells a Story.
            <br />
            Earn Rewards with Every Cup.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#4d3f38] md:text-xl">
            Join Rommana Rewards and turn your daily coffee ritual into free drinks,
            pastries, and exclusive perks. Earn 1 point for every $1 spent.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-2xl bg-[#620b0b] px-8 py-4 text-base font-medium text-[#f8f5f0] shadow-lg transition hover:opacity-95"
            >
              Start Earning Points
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-2xl border border-[#620b0b]/20 bg-white px-8 py-4 text-base font-medium text-[#620b0b] transition hover:bg-[#f8f5f0]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf9] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
              How It Works
            </p>
            <h3 className="mt-3 font-serif text-4xl font-bold text-[#2f241f]">
              Simple, warm, and rewarding
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rommana-card rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#620b0b]/10">
                <Coffee className="h-8 w-8 text-[#620b0b]" />
              </div>
              <h4 className="mt-5 font-serif text-2xl font-semibold text-[#2f241f]">
                Earn Points
              </h4>
              <p className="mt-3 text-[#4d3f38]">
                Get 1 point for every $1 you spend. Your coffee ritual starts adding up fast.
              </p>
            </div>

            <div className="rommana-card rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#620b0b]/10">
                <Star className="h-8 w-8 text-[#620b0b]" />
              </div>
              <h4 className="mt-5 font-serif text-2xl font-semibold text-[#2f241f]">
                Track Progress
              </h4>
              <p className="mt-3 text-[#4d3f38]">
                Follow your balance, your reward milestones, and how close you are to your next treat.
              </p>
            </div>

            <div className="rommana-card rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#620b0b]/10">
                <Gift className="h-8 w-8 text-[#620b0b]" />
              </div>
              <h4 className="mt-5 font-serif text-2xl font-semibold text-[#2f241f]">
                Redeem Rewards
              </h4>
              <p className="mt-3 text-[#4d3f38]">
                Unlock free drinks, pastries, and special perks crafted for regulars.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
              Rewards You&apos;ll Love
            </p>
            <h3 className="mt-3 font-serif text-4xl font-bold text-[#2f241f]">
              Inspired by every visit
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rommana-card rounded-3xl p-6 text-center">
              <Coffee className="mx-auto h-10 w-10 text-[#620b0b]" />
              <h4 className="mt-4 font-serif text-xl font-semibold text-[#2f241f]">Free Coffee</h4>
              <p className="mt-2 text-3xl font-bold text-[#620b0b]">50 pts</p>
            </div>

            <div className="rommana-card rounded-3xl p-6 text-center">
              <Gift className="mx-auto h-10 w-10 text-[#620b0b]" />
              <h4 className="mt-4 font-serif text-xl font-semibold text-[#2f241f]">Free Pastry</h4>
              <p className="mt-2 text-3xl font-bold text-[#620b0b]">80 pts</p>
            </div>

            <div className="rommana-card rounded-3xl p-6 text-center">
              <Star className="mx-auto h-10 w-10 text-[#620b0b]" />
              <h4 className="mt-4 font-serif text-xl font-semibold text-[#2f241f]">Lunch Combo</h4>
              <p className="mt-2 text-3xl font-bold text-[#620b0b]">150 pts</p>
            </div>

            <div className="rommana-card rounded-3xl p-6 text-center">
              <Cake className="mx-auto h-10 w-10 text-[#c8a96b]" />
              <h4 className="mt-4 font-serif text-xl font-semibold text-[#2f241f]">Birthday Drink</h4>
              <p className="mt-2 text-3xl font-bold text-[#c8a96b]">FREE</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#620b0b]/10 bg-[#fffdf9] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-serif text-lg font-semibold text-[#2f241f]">Rommana</span>
          <p className="text-sm text-[#4d3f38]">
            Earn points. Redeem rewards. Enjoy every cup.
          </p>
        </div>
      </footer>
    </div>
  )
}