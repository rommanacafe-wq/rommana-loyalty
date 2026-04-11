'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Coffee, Gift, Star, Loader2, Check } from 'lucide-react'

interface Reward {
  id: string
  name?: string | null
  title?: string | null
  description?: string | null
  points_required: number
  category?: string | null
}

interface RewardCardProps {
  reward: Reward
  userPoints: number
  userId: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  drink: <Coffee className="h-8 w-8" />,
  food: <Gift className="h-8 w-8" />,
  combo: <Star className="h-8 w-8" />,
}

export function RewardCard({ reward, userPoints, userId }: RewardCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const rewardName = reward.name ?? reward.title ?? 'Reward'
  const rewardDescription = reward.description ?? ''
  const rewardCategory = reward.category ?? ''
  const canRedeem = userPoints >= reward.points_required

  async function handleRedeem() {
    setLoading(true)

    const code = `RWD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { error: redemptionError } = await supabase.from('redemptions').insert({
      user_id: userId,
      reward_id: reward.id,
      reward_name: rewardName,
      reward_description: rewardDescription,
      points_spent: reward.points_required,
      redemption_code: code,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })

    if (redemptionError) {
      console.error('Redemption error:', redemptionError)
      alert(`Redemption error: ${redemptionError.message}`)
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points_balance: userPoints - reward.points_required,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Profile update error:', updateError)
      alert(`Profile update error: ${updateError.message}`)
      setLoading(false)
      return
    }

    setLoading(false)
    setSuccess(true)
    setRedemptionCode(code)
    router.refresh()
  }

  function handleClose() {
    setShowConfirm(false)
    setSuccess(false)
    setRedemptionCode(null)
  }

  return (
    <>
      <Card className={`transition-all ${canRedeem ? 'hover:shadow-md' : 'opacity-75'}`}>
        <CardContent className="pt-6 pb-4 text-center space-y-3">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              canRedeem ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {categoryIcons[rewardCategory] || <Gift className="h-8 w-8" />}
          </div>

          <div>
            <h3 className="font-semibold text-lg">{rewardName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {rewardDescription || 'A special Rommana reward'}
            </p>
          </div>

          <p
            className={`text-2xl font-bold ${
              canRedeem ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {reward.points_required} pts
          </p>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            disabled={!canRedeem}
            onClick={() => setShowConfirm(true)}
          >
            {canRedeem ? 'Redeem' : `Need ${reward.points_required - userPoints} more pts`}
          </Button>
        </CardFooter>
      </Card>
<Dialog open={showConfirm} onOpenChange={handleClose}>
  <DialogContent className="sm:max-w-md rounded-3xl border border-[#620b0b]/10 bg-[#fffdf9] text-[#2f241f] shadow-2xl">
    {!success ? (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#2f241f]">
            Confirm Redemption
          </DialogTitle>
          <DialogDescription className="text-[#4d3f38]">
            You are about to redeem {reward.points_required} points for:
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-[#620b0b]/10 bg-[#f8f5f0] px-4 py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#620b0b]/10">
            {categoryIcons[rewardCategory] || <Gift className="h-8 w-8 text-[#620b0b]" />}
          </div>
          <h3 className="text-lg font-semibold text-[#2f241f]">{rewardName}</h3>
          <p className="mt-1 text-sm text-[#4d3f38]">
            {rewardDescription || 'A special Rommana reward'}
          </p>
          <p className="mt-4 text-2xl font-bold text-[#620b0b]">
            {reward.points_required} points
          </p>
          <p className="mt-1 text-sm text-[#4d3f38]">
            Remaining: {userPoints - reward.points_required} points
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRedeem} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Redemption'
            )}
          </Button>
        </DialogFooter>
      </>
    ) : (
      <>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-serif text-[#2f241f]">
            Redemption Successful!
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96b]/20">
            <Check className="h-8 w-8 text-[#620b0b]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#2f241f]">{rewardName}</h3>
          <p className="mb-4 text-sm text-[#4d3f38]">
            Show this code to redeem your reward:
          </p>
          <p className="inline-block rounded-2xl border border-[#620b0b]/10 bg-white px-5 py-3 text-2xl font-mono font-bold text-[#620b0b] shadow-sm">
            {redemptionCode}
          </p>
          <p className="mt-4 text-xs text-[#4d3f38]">Valid for 30 days</p>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </>
    )}
  </DialogContent>
</Dialog>
    </>
  )
}