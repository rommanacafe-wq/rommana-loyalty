'use client'

export default function EnableNotificationsBanner() {
  const handleEnable = async () => {
    // @ts-ignore
    const OneSignal = window.OneSignal

    if (!OneSignal) {
      console.error('OneSignal not loaded')
      return
    }

    await OneSignal.showSlidedownPrompt()
  }

  return (
    <div className="rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#620b0b]/70">Stay Updated</p>
          <p className="font-semibold">Enable notifications to receive exclusive offers!</p>
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