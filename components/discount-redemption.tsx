'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DollarSign, Loader2, Check, Minus, Plus } from 'lucide-react'

interface DiscountRedemptionProps {
  userPoints: number
  userId: string
}

const POINTS_PER_DOLLAR = 20 // 20 points = $1 off
const MIN_POINTS = 50
const STEP_POINTS = 50

export function DiscountRedemption({
  userPoints,
  userId,
}: DiscountRedemptionProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState(MIN_POINTS)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const canRedeem = userPoints >= MIN_POINTS
  const maxPoints = userPoints
  const safePointsToRedeem = Math.min(Math.max(pointsToRedeem, MIN_POINTS), maxPoints)
  const discountAmount = (safePointsToRedeem / POINTS_PER_DOLLAR).toFixed(2)

  function adjustPoints(delta: number) {
    const newValue = pointsToRedeem + delta
    const clamped = Math.min(Math.max(newValue, MIN_POINTS), maxPoints)
    setPointsToRedeem(clamped)
  }

  function handleInputChange(value: string) {
    if (value === '') {
      setPointsToRedeem(MIN_POINTS)
      return
    }

    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) return

    const clamped = Math.min(Math.max(parsed, MIN_POINTS), maxPoints)
    setPointsToRedeem(clamped)
  }

  async function handleRedeem() {
    setLoading(true)

    const code = `DISC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { error: redemptionError } = await supabase.from('redemptions').insert({
      user_id: userId,
      reward_id: null,
      points_spent: safePointsToRedeem,
      redemption_code: code,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })

    if (redemptionError) {
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points_balance: userPoints - safePointsToRedeem,
      })
      .eq('id', userId)

    setLoading(false)

    if (!updateError) {
      setSuccess(true)
      setRedemptionCode(code)
      router.refresh()
    }
  }

  function handleClose() {
    setShowConfirm(false)
    setSuccess(false)
    setRedemptionCode(null)
    setPointsToRedeem(MIN_POINTS)
  }

  return (
    <>
      <Card className={!canRedeem ? 'opacity-75' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            Convert Points to Discount
          </CardTitle>
          <CardDescription>
            20 points = $1 off your purchase
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {canRedeem ? (
            <>
              <div className="space-y-2">
                <Label>Points to redeem</Label>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPoints(-STEP_POINTS)}
                    disabled={pointsToRedeem <= MIN_POINTS}
                    type="button"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="text-center text-lg font-semibold"
                    step={STEP_POINTS}
                    min={MIN_POINTS}
                    max={maxPoints}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPoints(STEP_POINTS)}
                    disabled={pointsToRedeem >= maxPoints}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Min: {MIN_POINTS} points • Max: {maxPoints} points (${(maxPoints / POINTS_PER_DOLLAR).toFixed(2)} off)
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">You&apos;ll get</p>
                <p className="text-3xl font-bold text-primary">
                  ${discountAmount} off
                </p>
              </div>

              <Button className="w-full" onClick={() => setShowConfirm(true)}>
                Redeem for ${discountAmount} Off
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                You need at least {MIN_POINTS} points to redeem a discount.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You have {userPoints} points. Earn {MIN_POINTS - userPoints} more!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {!success ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Discount Redemption</DialogTitle>
                <DialogDescription>
                  You are about to redeem {safePointsToRedeem} points
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>

                <p className="text-3xl font-bold text-primary">${discountAmount} off</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Using {safePointsToRedeem} points
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Remaining: {userPoints - safePointsToRedeem} points
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
                <DialogTitle className="text-center">Discount Created!</DialogTitle>
              </DialogHeader>

              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Check className="h-8 w-8 text-accent-foreground" />
                </div>

                <p className="mb-2 text-3xl font-bold text-primary">${discountAmount} off</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Show this code at checkout:
                </p>

                <p className="inline-block rounded-lg bg-secondary px-4 py-2 text-2xl font-mono font-bold">
                  {redemptionCode}
                </p>

                <p className="mt-4 text-xs text-muted-foreground">
                  Valid for 30 days
                </p>
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