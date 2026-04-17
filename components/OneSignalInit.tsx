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
        appId: 'f82ff25f-3ee6-4aee-a160-fc3cf4b419a4',
        safari_web_id: 'web.onesignal.auto.37a4bd23-e633-4ae3-9e22-29e91fb790d4',
        notifyButton: { enable: false },
        serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerParam: { scope: '/push/onesignal/' },
      })

      if (externalId) {
        await OneSignal.login(externalId)
      }

      console.log('OneSignal initialized')
    })
  }, [externalId])

  return null
}