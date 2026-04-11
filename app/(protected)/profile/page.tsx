'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  User,
  Loader2,
  Check,
  QrCode,
  Phone,
  CalendarDays,
  CreditCard,
} from 'lucide-react'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  birthday: string | null
  loyalty_code?: string | null
  points_balance?: number | null
  email: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setPhone(data.phone || '')
        setBirthday(data.birthday || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        birthday: birthday || null,
        email,
      })
      .eq('id', profile.id)

    setSaving(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#620b0b]" />
        </div>
      </div>
    )
  }

  const memberName =
    `${firstName} ${lastName}`.trim() || 'Rommana Member'
  const loyaltyCode = profile?.loyalty_code || 'RMNA001'
  const points = profile?.points_balance || 0

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-8 text-[#2f241f]">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Intro Banner */}
        <div className="tatreez-border rommana-card rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
              Membership Profile
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2f241f]">
              Your Rommana membership card
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[#4d3f38]">
              Keep your profile up to date, carry your loyalty identity, and make
              every visit feel personal.
            </p>
            <p className="arabic-hero text-[#620b0b]/90 mt-2">أهلاً وسهلاً</p>
            <div className="h-[2px] w-16 rounded-full bg-[#c8a96b]" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Premium Member Card */}
          <div className="rommana-premium rounded-[32px] p-6 md:p-8 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white_0,transparent_40%)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                    Digital Member Card
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">
                    Rommana Rewards
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-sm text-white/70">Member</p>
                  <p className="mt-1 text-2xl font-medium text-white">
                    {memberName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/70">Loyalty Code</p>
                  <p className="mt-1 text-lg font-semibold tracking-[0.22em] text-white">
                    {loyaltyCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/70">Points Balance</p>
                  <p className="mt-1 text-5xl font-bold text-white">{points}</p>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-sm text-white/75">
                    Show this membership profile in-store to help staff identify your account
                    and loyalty details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <Card className="rommana-card rounded-3xl border-[#620b0b]/10 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-[#2f241f]">
                  <User className="h-5 w-5 text-[#620b0b]" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-[#4d3f38]">
                  Update your details so your Rommana experience stays personal.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="rounded-2xl border-[#620b0b]/15 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="rounded-2xl border-[#620b0b]/15 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#620b0b]" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-2xl border-[#620b0b]/15 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#620b0b]" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-2xl border-[#620b0b]/15 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#620b0b]" />
                      Birthday
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="rounded-2xl border-[#620b0b]/15 bg-white"
                    />
                    <p className="text-xs text-[#4d3f38]">
                      Add your birthday to receive a free drink every year.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#620b0b]/10 bg-white/70 p-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-5 w-5 text-[#620b0b]" />
                      <div>
                        <p className="font-medium text-[#2f241f]">Membership Note</p>
                        <p className="mt-1 text-sm text-[#4d3f38]">
                          Your loyalty code and point balance are connected to your Rommana
                          member account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl bg-[#620b0b] px-6 text-[#f8f5f0] hover:opacity-95"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Saved!
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}