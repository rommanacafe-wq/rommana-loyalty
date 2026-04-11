'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent. Check your inbox.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-10 text-[#2f241f]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
          Account Recovery
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-[#4d3f38]">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-[#4d3f38]">{message}</p>
        )}

        <div className="mt-6">
          <Link
            href="/auth/login"
            className="text-sm text-[#620b0b] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}