'use client'

import { useState } from 'react'
import { Gift, Loader2, Check } from 'lucide-react'

interface BirthdayBannerProps {
  userId: string
  hasClaimedThisYear: boolean
  onClaim?: () => void
}

export function BirthdayBanner({
  userId,
  hasClaimedThisYear,
  onClaim,
}: BirthdayBannerProps) {
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState(hasClaimedThisYear)

  async function handleClaim() {
    if (claimed) return

    setLoading(true)

    const response = await fetch('/api/birthday-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })

    setLoading(false)

    if (response.ok) {
      setClaimed(true)
      onClaim?.() // 👈 THIS IS KEY
    }
  }

  return (
    <div className="rommana-premium rounded-[32px] p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
            Birthday Reward
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
            Your birthday drink is on us 🎉
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Celebrate with a free drink from Rommana. Claim it here and show it in-store.
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={claimed || loading}
          className="inline-flex items-center justify-center rounded-2xl bg-[#f8f5f0] px-6 py-3 font-medium text-[#620b0b] shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : claimed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Claimed
            </>
          ) : (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Claim Birthday Drink
            </>
          )}
        </button>
      </div>
    </div>
  )
}