'use client'

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>
  }
}

export default function EnableNotificationsBanner() {
  const handleEnable = () => {
    if (typeof window === 'undefined') return

    window.OneSignalDeferred = window.OneSignalDeferred || []

    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        const supported = OneSignal.Notifications.isPushSupported()
        console.log('Push supported:', supported)

        if (!supported) {
          alert('Push notifications are not supported on this browser/device.')
          return
        }

        await OneSignal.Slidedown.promptPush({ force: true })
      } catch (error) {
        console.error('OneSignal prompt error:', error)
      }
    })
  }

  return (
    <div className="rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#620b0b]/70">Stay Updated</p>
          <p className="font-semibold">Enable notifications to receive exlusive offers!</p>
        </div>

        <button
          type="button"
          onClick={handleEnable}
          className="rounded-xl bg-[#620b0b] px-4 py-2 text-white"
        >
          Enable
        </button>
      </div>
    </div>
  )
}