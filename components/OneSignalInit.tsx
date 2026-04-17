'use client'

import { useEffect } from 'react'

type Props = {
  externalId?: string
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>
    __onesignalInitialized?: boolean
  }
}

export default function OneSignalInit({ externalId }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.OneSignalDeferred = window.OneSignalDeferred || []

    window.OneSignalDeferred.push(async function (OneSignal) {
      if (window.__onesignalInitialized) return
      window.__onesignalInitialized = true

      await OneSignal.init({
  appId: "f82ff25f-3ee6-4aee-a160-fc3cf4b419a4",

  serviceWorkerPath: '/OneSignalSDKWorker.js',
  serviceWorkerUpdaterPath: '/OneSignalSDKWorker.js',
  serviceWorkerParam: { scope: '/' },

  notifyButton: { enable: true },
})

      if (externalId) {
        await OneSignal.login(externalId)
      }

      console.log('OneSignal initialized')
    })
  }, [externalId])

  return null
}