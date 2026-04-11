import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, TrendingUp } from 'lucide-react'

interface PointsCardProps {
  balance: number
  totalEarned: number
}

export function PointsCard({ balance, totalEarned }: PointsCardProps) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Your Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-5xl font-bold">{balance.toLocaleString()}</p>
          <p className="text-primary-foreground/80 text-sm mt-1">Available points</p>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-primary-foreground/20">
          <TrendingUp className="h-4 w-4 text-primary-foreground/80" />
          <p className="text-sm text-primary-foreground/80">
            <span className="font-semibold text-primary-foreground">{totalEarned.toLocaleString()}</span> total points earned
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
