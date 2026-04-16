import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coffee, Mail } from 'lucide-react'
import { RommanaRound } from '@/components/rommana-round'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">

          <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
          <RommanaRound size={80} variant="bare" />
          </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Rommana Rewards! </CardTitle>
          <CardDescription>scan in store to start earning rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
          </p>
          <div className="rounded-lg bg-secondary p-4">
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
