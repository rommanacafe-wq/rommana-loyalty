'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(error.message)
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
            disabled={loading}
            className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-[#4d3f38]">{message}</p>
        )}
      </div>
      </div>
  )
}
