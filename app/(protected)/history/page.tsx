import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { History, Coffee, Gift } from 'lucide-react'

type PurchaseItem = {
  id: string
  description: string | null
  amount: number | null
  points_earned: number | null
  created_at: string
}

type RedemptionItem = {
  id: string
  title: string
  redemption_code: string | null
  points_spent: number | null
  status: string
  created_at: string
}

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Purchase / points earning history
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Redeemed points rewards
  const { data: redemptions } = await supabase
    .from('redemptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'redeemed')
    .order('created_at', { ascending: false })

  // Redeemed special rewards (birthday, etc.)
  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'redeemed')
    .order('redeemed_at', { ascending: false })

  const purchaseHistory: PurchaseItem[] = (transactions || []).map((transaction) => ({
    id: transaction.id,
    description: transaction.description || 'Purchase',
    amount: transaction.amount ?? null,
    points_earned: transaction.points_earned ?? null,
    created_at: transaction.created_at,
  }))

  const redemptionHistory: RedemptionItem[] = [
    ...(redemptions || []).map((redemption) => ({
      id: redemption.id,
      title: redemption.reward_name || 'Reward',
      redemption_code: redemption.redemption_code || null,
      points_spent: redemption.points_spent ?? null,
      status: redemption.status || 'redeemed',
      created_at: redemption.redeemed_at || redemption.created_at,
    })),
    ...(userRewards || []).map((reward) => ({
      id: reward.id,
      title: reward.title || reward.reward_name || 'Reward',
      redemption_code: reward.redemption_code || null,
      points_spent: reward.points_cost ?? 0,
      status: reward.status || 'redeemed',
      created_at: reward.redeemed_at || reward.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function formatCurrency(amount: number | null) {
    if (amount === null || amount === undefined) return '—'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-8 text-[#2f241f]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <History className="h-7 w-7 text-[#620b0b]" />
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Activity History</h1>
              <p className="mt-1 text-sm text-[#4d3f38]">
                View your purchase and redemption history
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="purchases" className="gap-2">
              <Coffee className="h-4 w-4" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="gap-2">
              <Gift className="h-4 w-4" />
              Redemptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases">
            <Card className="rounded-3xl border-[#620b0b]/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#2f241f]">
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!purchaseHistory || purchaseHistory.length === 0 ? (
                  <div className="py-12 text-center text-[#4d3f38]">
                    <Coffee className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="font-medium">No purchases yet</p>
                    <p className="text-sm">Your purchase history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {purchaseHistory.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between border-b py-4 last:border-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-[#2f241f]">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-[#4d3f38]">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[#4d3f38]">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="font-semibold text-[#620b0b]">
                            +{transaction.points_earned || 0} pts
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions">
            <Card className="rounded-3xl border-[#620b0b]/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#2f241f]">
                  Redemption History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!redemptionHistory || redemptionHistory.length === 0 ? (
                  <div className="py-12 text-center text-[#4d3f38]">
                    <Gift className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="font-medium">No redemptions yet</p>
                    <p className="text-sm">Redeemed rewards will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {redemptionHistory.map((redemption) => (
                      <div
                        key={redemption.id}
                        className="flex items-center justify-between border-b py-4 last:border-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-[#2f241f]">
                            {redemption.title}
                          </p>
                          <p className="text-sm text-[#4d3f38]">
                            {formatDate(redemption.created_at)}
                          </p>

                          {redemption.redemption_code && (
                            <p className="inline-block rounded bg-[#f3eee8] px-2 py-0.5 font-mono text-xs text-[#620b0b]">
                              {redemption.redemption_code}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-[#620b0b]">
                            -{redemption.points_spent || 0} pts
                          </p>
                          <p className="inline-block rounded-full bg-[#f3eee8] px-2 py-0.5 text-xs text-[#4d3f38]">
                            {redemption.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}