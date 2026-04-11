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

const POINTS_PER_DOLLAR = 20 // 100 points = $5 off
const MIN_POINTS = 50

export function DiscountRedemption({ userPoints, userId }: DiscountRedemptionProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState(MIN_POINTS)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const discountAmount = (pointsToRedeem / POINTS_PER_DOLLAR).toFixed(2)
  const canRedeem = userPoints >= MIN_POINTS
  const maxPoints = Math.floor(userPoints / 100) * 100 // Round down to nearest 100

  function adjustPoints(delta: number) {
    const newValue = pointsToRedeem + delta
    if (newValue >= MIN_POINTS && newValue <= maxPoints) {
      setPointsToRedeem(newValue)
    }
  }

  async function handleRedeem() {
    setLoading(true)

    // Generate redemption code
    const code = `DISC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // Valid for 30 days

    // Create redemption record (no reward_id for discount redemptions)
    const { error: redemptionError } = await supabase.from('redemptions').insert({
      user_id: userId,
      reward_id: null,
      points_spent: pointsToRedeem,
      redemption_code: code,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })

    if (redemptionError) {
      setLoading(false)
      return
    }

    // Update user points
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points_balance: userPoints - pointsToRedeem,
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
            100 points = $5 off your purchase
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
                    onClick={() => adjustPoints(-100)}
                    disabled={pointsToRedeem <= MIN_POINTS}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value) && value >= MIN_POINTS && value <= maxPoints) {
                        setPointsToRedeem(Math.floor(value / 100) * 100)
                      }
                    }}
                    className="text-center text-lg font-semibold"
                    step={100}
                    min={MIN_POINTS}
                    max={maxPoints}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPoints(100)}
                    disabled={pointsToRedeem >= maxPoints}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Max: {maxPoints} points (${(maxPoints / POINTS_PER_DOLLAR).toFixed(2)} off)
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">You&apos;ll get</p>
                <p className="text-3xl font-bold text-primary">${discountAmount} off</p>
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
                  You are about to redeem {pointsToRedeem} points
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">${discountAmount} off</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Using {pointsToRedeem} points
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Remaining: {userPoints - pointsToRedeem} points
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
                  <Check className="h-8 w-8 text-accent-foreground" />
                </div>
                <p className="text-3xl font-bold text-primary mb-2">${discountAmount} off</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Show this code at checkout:
                </p>
                <p className="text-2xl font-mono font-bold bg-secondary px-4 py-2 rounded-lg inline-block">
                  {redemptionCode}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
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
