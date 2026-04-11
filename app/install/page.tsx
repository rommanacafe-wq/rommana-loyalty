'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Share2, Smartphone } from 'lucide-react'
import { RommanaRound } from '@/components/rommana-round'

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIos, setIsIos] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const iosCheck =
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
      !(window as any).MSStream

    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsIos(iosCheck)
    setIsStandalone(standaloneCheck)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  async function handleInstall() {
    if (isStandalone) {
      setStatusMessage('Rommana is already added to your home screen.')
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult?.outcome === 'accepted') {
        setStatusMessage('Rommana is being added to your device.')
      } else {
        setStatusMessage('Install was dismissed.')
      }

      setDeferredPrompt(null)
      return
    }

    if (isIos) {
      setStatusMessage('On iPhone, tap Share and then Add to Home Screen.')
      return
    }

    setStatusMessage(
      'Use your browser menu and choose Install App or Add to Home Screen.'
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 py-8 text-[#2f241f]">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#620b0b]/10 bg-white px-4 py-2 text-sm font-medium text-[#620b0b] transition hover:bg-[#f8f5f0]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <section>
          <div className="tatreez-border rommana-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-xl bg-[#620B0B] p-2 shadow-sm">
                <RommanaRound size={90} variant="bare" />
              </div>

              <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
                Install Rommana Rewards
              </p>

              <h1 className="text-3xl font-semibold text-[#2f241f] md:text-4xl">
                Add Rommana to your Home Screen
              </h1>

              <p className="max-w-2xl text-sm text-[#4d3f38] md:text-base">
                Get faster access to your loyalty QR, rewards, and points whenever you
                visit the café.
              </p>

              <button
                onClick={handleInstall}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#620b0b] px-6 py-3 font-medium text-[#f8f5f0] shadow-md transition hover:opacity-95"
              >
                <Download className="h-4 w-4" />
                Install App
              </button>

              {statusMessage && (
                <p className="max-w-xl text-sm text-[#4d3f38]">{statusMessage}</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rommana-card rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#620b0b]/10 p-3">
                <Share2 className="h-5 w-5 text-[#620b0b]" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                  iPhone / iPad
                </p>
                <h2 className="text-xl font-semibold text-[#2f241f]">
                  Add to Home Screen
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-[#4d3f38]">
              <p>
                1. Tap the <span className="font-medium text-[#2f241f]">Share</span> button
                in Safari.
              </p>
              <p>
                2. Scroll down and tap{' '}
                <span className="font-medium text-[#2f241f]">Add to Home Screen</span>.
              </p>
              <p>
                3. Tap <span className="font-medium text-[#2f241f]">Add</span>.
              </p>
            </div>
          </div>

          <div className="rommana-card rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#620b0b]/10 p-3">
                <Smartphone className="h-5 w-5 text-[#620b0b]" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                  Android
                </p>
                <h2 className="text-xl font-semibold text-[#2f241f]">
                  Install App
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-[#4d3f38]">
              <p>
                1. Tap the <span className="font-medium text-[#2f241f]">Install App</span>{' '}
                button above.
              </p>
              <p>
                2. If no prompt appears, open your browser menu.
              </p>
              <p>
                3. Tap{' '}
                <span className="font-medium text-[#2f241f]">Install App</span> or{' '}
                <span className="font-medium text-[#2f241f]">Add to Home Screen</span>.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#620b0b]/10 bg-[#fffdf9] p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
            Why install it
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium text-[#2f241f]">Faster access</p>
              <p className="mt-1 text-sm text-[#4d3f38]">
                Open your loyalty card in one tap.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium text-[#2f241f]">Quick rewards</p>
              <p className="mt-1 text-sm text-[#4d3f38]">
                Check points and rewards before you order.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium text-[#2f241f]">App-like feel</p>
              <p className="mt-1 text-sm text-[#4d3f38]">
                Launch Rommana like an app from your home screen.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}