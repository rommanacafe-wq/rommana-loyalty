import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, History } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  points_earned: number
  created_at: string
}

interface TransactionListProps {
  transactions: Transaction[]
  showHeader?: boolean
  limit?: number
}

export function TransactionList({ transactions, showHeader = true, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (displayTransactions.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={showHeader ? '' : 'pt-6'}>
          <div className="text-center py-8 text-muted-foreground">
            <Coffee className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Make a purchase to start earning points!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? '' : 'pt-6'}>
        <div className="space-y-3">
          {displayTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.created_at)} • {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">+{transaction.points_earned}</p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
