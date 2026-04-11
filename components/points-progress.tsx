import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Gift } from 'lucide-react'

interface PointsProgressProps {
  currentPoints: number
  nextRewardPoints: number
  nextRewardName: string
}

export function PointsProgress({ currentPoints, nextRewardPoints, nextRewardName }: PointsProgressProps) {
  const progress = Math.min((currentPoints / nextRewardPoints) * 100, 100)
  const pointsNeeded = Math.max(nextRewardPoints - currentPoints, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          Next Reward
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{nextRewardName}</span>
          <span className="text-muted-foreground">{nextRewardPoints} pts</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {pointsNeeded > 0 ? (
            <>
              <span className="font-semibold text-foreground">{pointsNeeded}</span> more points to go
            </>
          ) : (
            <span className="font-semibold text-primary">Ready to redeem!</span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
