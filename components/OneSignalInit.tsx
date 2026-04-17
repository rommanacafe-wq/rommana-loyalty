'use client'

import { useEffect } from 'react'

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // @ts-ignore
    window.OneSignalDeferred = window.OneSignalDeferred || []

    // @ts-ignore
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: 'f82ff25f-3ee6-4aee-a160-fc3cf4b419a4',
        safari_web_id: 'web.onesignal.auto.37a4bd23-e633-4ae3-9e22-29e91fb790d4',
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerPath: '/OneSignalSDKWorker.js',
      })

      console.log('OneSignal initialized')
    })
  }, [])

  return null
}