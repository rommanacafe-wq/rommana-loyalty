'use client'

import { useEffect, useState } from 'react'
import { Gift, Sparkles, Trophy } from 'lucide-react'

type GiveawayResponse = {
  winner?: boolean
  alreadyProcessed?: boolean
  rewardType?: string
  rewardTitle?: string
  rewardDescription?: string
  message?: string
  error?: string
}

function isBigPrize(rewardType?: string) {
  return rewardType === 'coffee_for_year' || rewardType === 'gift_basket' || rewardType === 'kuffeye'
}

export default function AnniversaryGiveawayBanner() {
  const [loading, setLoading] = useState(true)
  const [winner, setWinner] = useState(false)
  const [showNeutral, setShowNeutral] = useState(false)
  const [rewardType, setRewardType] = useState('')
  const [rewardTitle, setRewardTitle] = useState('')
  const [rewardDescription, setRewardDescription] = useState('')

  useEffect(() => {
    async function runGiveaway() {
      try {
        const res = await fetch('/api/giveaways/anniversary-signup', {
          method: 'POST',
        })

        const text = await res.text()
        let data: GiveawayResponse = {}

        try {
          data = text ? JSON.parse(text) : {}
        } catch {
          setLoading(false)
          return
        }

        if (!res.ok) {
          setLoading(false)
          return
        }

        if (data.alreadyProcessed) {
          setLoading(false)
          return
        }

        if (data.winner) {
          setWinner(true)
          setRewardType(data.rewardType || '')
          setRewardTitle(data.rewardTitle || 'Anniversary Giveaway Winner')
          setRewardDescription(
            data.rewardDescription || 'Please show staff to claim your prize.'
          )
        } else {
          setShowNeutral(true)
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }

    runGiveaway()
  }, [])

  if (loading) return null
  if (!winner && !showNeutral) return null

  if (winner) {
    const bigPrize = isBigPrize(rewardType)

    return (
      <div
        className={`rounded-3xl border p-6 shadow-sm ${
          bigPrize
            ? 'border-[#c8a96b]/40 bg-[#fff8ec]'
            : 'border-[#620b0b]/15 bg-[#fff7f2]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`rounded-2xl p-3 ${
              bigPrize ? 'bg-[#c8a96b] text-white' : 'bg-[#620b0b] text-white'
            }`}
          >
            {bigPrize ? <Trophy className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
          </div>

          <div className="flex-1">
            <p
              className={`text-sm uppercase tracking-[0.18em] ${
                bigPrize ? 'text-[#9d7c2f]' : 'text-[#620b0b]/70'
              }`}
            >
              Anniversary Giveaway
            </p>

            <h3 className="mt-1 text-2xl font-semibold text-[#2f241f]">
              🎉 You won: {rewardTitle}
            </h3>

            <p className="mt-2 text-sm text-[#4d3f38]">{rewardDescription}</p>

            <p className="mt-3 text-sm font-medium text-[#620b0b]">
              Staff can see this reward on their scanner page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-[#620b0b]/10 p-3 text-[#620b0b]">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
            Anniversary Giveaway
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[#2f241f]">
            You’re in today’s anniversary celebration
          </h3>
          <p className="mt-2 text-sm text-[#4d3f38]">
            Thanks for joining Rommana Rewards. Keep scanning in-store and watch for more surprises throughout the day.
          </p>
        </div>
      </div>
    </div>
  )
}