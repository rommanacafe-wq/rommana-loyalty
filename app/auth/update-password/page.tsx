'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function verifyRecoverySession() {
      try {
        const url = new URL(window.location.href)
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const code = url.searchParams.get('code')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type') ?? url.searchParams.get('type')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (!mounted) return

          if (error) {
            setMessage('This reset link is invalid or expired. Please request a new reset email.')
            setCheckingSession(false)
            return
          }

          setCheckingSession(false)
          return
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (!mounted) return

          if (error) {
            setMessage('This reset link is invalid or expired. Please request a new reset email.')
            setCheckingSession(false)
            return
          }

          setCheckingSession(false)
          return
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError || !session) {
          setMessage(
            type === 'recovery'
              ? 'Preparing your secure reset session...'
              : 'This reset link is missing a valid auth session. Please request a new reset email.'
          )
        }
      } catch {
        if (mounted) {
          setMessage(
            'Unable to verify the password reset session. Please request a new reset email.'
          )
        }
      } finally {
        if (mounted) setCheckingSession(false)
      }
    }

    verifyRecoverySession()

    return () => {
      mounted = false
    }
  }, [supabase])

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      setMessage(
        'Your reset session is missing or expired. Please request a new password reset link.'
      )
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setMessage(updateError.message)
      setLoading(false)
      return
    }

    setMessage('Password updated successfully. Redirecting to login...')

    setTimeout(() => {
      router.push('/auth/login')
    }, 1500)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-10 text-[#2f241f]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
          New Password
        </p>

        <h1 className="mt-2 text-2xl font-semibold">Set a new password</h1>

        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
          />

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
          />

          <button
            type="submit"
            disabled={loading || checkingSession}
            className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
          >
            {checkingSession
              ? 'Verifying reset link...'
              : loading
                ? 'Updating...'
                : 'Update password'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-[#4d3f38]">{message}</p>
        )}
      </div>
    </div>
  )
}
