'use client'

import { useEffect, useRef, useState } from 'react'

type ScanResult = {
  userId?: string
  loyaltyCode?: string
}

type Customer = {
  id: string
  name: string
  points: number
  loyaltyCode: string
}

type CustomerReward = {
  id: string
  source: 'user_rewards' | 'redemptions'
  title?: string
  reward_name?: string
  description?: string
  redemption_code?: string | null
  status?: string
  reward_type?: string | null
}

export default function StaffPage() {
  const qrRef = useRef<any>(null)

  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [message, setMessage] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const [lookupCode, setLookupCode] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupMessage, setLookupMessage] = useState('')

  const [firstNameQuery, setFirstNameQuery] = useState('')
  const [nameSearchLoading, setNameSearchLoading] = useState(false)
  const [nameSearchMessage, setNameSearchMessage] = useState('')
  const [nameResults, setNameResults] = useState<Customer[]>([])

  const [code, setCode] = useState('')
  const [redeemMessage, setRedeemMessage] = useState('')
  const [redeeming, setRedeeming] = useState(false)

  const [amountSpent, setAmountSpent] = useState('')
  const [pointsMessage, setPointsMessage] = useState('')
  const [addingPoints, setAddingPoints] = useState(false)

  const [rewards, setRewards] = useState<CustomerReward[]>([])
  const [loadingRewards, setLoadingRewards] = useState(false)
  const [rewardActionMessage, setRewardActionMessage] = useState('')

  function parseQrPayload(decodedText: string): ScanResult | null {
    const raw = decodedText.trim()

    const params = new URLSearchParams(raw)
    const qsUserId = params.get('userId')
    const qsCode = params.get('code') || params.get('loyaltyCode')

    if (qsUserId || qsCode) {
      return {
        userId: qsUserId || undefined,
        loyaltyCode: qsCode || undefined,
      }
    }

    try {
      const cleaned = raw.replace(/^"+|"+$/g, '').replace(/\\"/g, '"')
      const parsed = JSON.parse(cleaned)

      if (parsed.userId || parsed.loyaltyCode || parsed.code) {
        return {
          userId: parsed.userId || undefined,
          loyaltyCode: parsed.loyaltyCode || parsed.code || undefined,
        }
      }
    } catch {
      // ignore parse failure
    }

    return null
  }

  async function loadCustomer(payload: ScanResult) {
    const res = await fetch('/api/staff/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Customer not found')
    }

    return data as Customer
  }

  async function fetchCustomerRewards(userId: string) {
    setLoadingRewards(true)
    setRewardActionMessage('')

    try {
      const res = await fetch('/api/staff/customer-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setRewards([])
        return
      }

      setRewards(data || [])
    } catch (error) {
      console.error('Fetch rewards error:', error)
      setRewards([])
    } finally {
      setLoadingRewards(false)
    }
  }

  async function loadAndSetCustomer(payload: ScanResult) {
    const customerData = await loadCustomer(payload)
    setCustomer(customerData)
    setScanResult({
      userId: customerData.id,
      loyaltyCode: customerData.loyaltyCode,
    })
    await fetchCustomerRewards(customerData.id)
  }

  async function handleScan(decodedText: string) {
    try {
      const parsed = parseQrPayload(decodedText)

      if (!parsed) {
        setMessage(`Invalid QR: ${decodedText}`)
        return
      }

      await loadAndSetCustomer(parsed)
      setMessage('Customer loaded successfully')
      setLookupMessage('')
      setNameSearchMessage('')
      setNameResults([])
      await stopScanner()
    } catch (error) {
      console.error('Scan error:', error)
      setMessage(error instanceof Error ? error.message : 'Scan failed')
    }
  }

  async function handleManualLookup() {
    if (!lookupCode.trim()) return

    setLookupLoading(true)
    setLookupMessage('')

    try {
      await loadAndSetCustomer({
        loyaltyCode: lookupCode.trim(),
      })
      setLookupMessage('Customer loaded successfully')
      setMessage('')
      setNameSearchMessage('')
      setNameResults([])
    } catch (error) {
      console.error('Lookup error:', error)
      setLookupMessage(error instanceof Error ? error.message : 'Lookup failed')
    } finally {
      setLookupLoading(false)
    }
  }

  async function handleFirstNameSearch() {
    if (!firstNameQuery.trim()) return

    setNameSearchLoading(true)
    setNameSearchMessage('')
    setNameResults([])

    try {
      const res = await fetch('/api/staff/search-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstNameQuery.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setNameSearchMessage(`❌ ${data.error || 'Search failed'}`)
        return
      }

      setNameResults(data)

      if (!data.length) {
        setNameSearchMessage('No matching customers found')
      } else {
        setNameSearchMessage(`Found ${data.length} match${data.length === 1 ? '' : 'es'}`)
      }
    } catch (error) {
      console.error('Name search error:', error)
      setNameSearchMessage('❌ Search failed')
    } finally {
      setNameSearchLoading(false)
    }
  }

  async function handleSelectCustomer(selected: Customer) {
    try {
      setCustomer(selected)
      setScanResult({
        userId: selected.id,
        loyaltyCode: selected.loyaltyCode,
      })
      await fetchCustomerRewards(selected.id)
      setNameSearchMessage('Customer loaded successfully')
    } catch (error) {
      console.error(error)
      setNameSearchMessage('❌ Failed to load customer rewards')
    }
  }

  async function startScanner() {
    if (isScanning || isStarting) return

    setIsStarting(true)
    setMessage('')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')

      const qr = new Html5Qrcode('reader')
      qrRef.current = qr

      const cameras = await Html5Qrcode.getCameras()

      if (!cameras || cameras.length === 0) {
        setMessage('No camera found')
        return
      }

      const backCamera =
        cameras.find((camera: any) => camera.label?.toLowerCase().includes('back')) ||
        cameras[0]

      await qr.start(
        { deviceId: { exact: backCamera.id } },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText: string) => {
          handleScan(decodedText)
        },
        () => {
          // ignore scan misses
        }
      )

      setIsScanning(true)
      setMessage('Camera started')
    } catch (error) {
      console.error('Camera error:', error)
      setMessage(
        error instanceof Error
          ? `Camera failed: ${error.message}`
          : 'Camera failed to start'
      )
    } finally {
      setIsStarting(false)
    }
  }

  async function stopScanner() {
    try {
      if (qrRef.current) {
        await qrRef.current.stop()
        await qrRef.current.clear()
        qrRef.current = null
      }
    } catch {
      // ignore stop errors
    } finally {
      setIsScanning(false)
    }
  }

  async function handleRedeem() {
    if (!code.trim()) return

    setRedeeming(true)
    setRedeemMessage('')

    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setRedeemMessage(`❌ ${data.error || 'Redeem failed'}`)
        return
      }

      setRedeemMessage('✅ Redeemed successfully')
      setCode('')
    } catch (error) {
      console.error('Redeem error:', error)
      setRedeemMessage('❌ Failed to redeem')
    } finally {
      setRedeeming(false)
    }
  }

  async function handleRedeemFromCustomer(reward: CustomerReward) {
    try {
      let res: Response

      if (reward.source === 'redemptions') {
        if (!reward.redemption_code) {
          setRewardActionMessage('❌ Reward does not have a redemption code')
          return
        }

        res = await fetch('/api/rewards/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: reward.redemption_code,
          }),
        })
      } else if (reward.source === 'user_rewards') {
        res = await fetch('/api/staff/redeem-user-reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rewardId: reward.id,
          }),
        })
      } else {
        setRewardActionMessage('❌ Unknown reward type')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setRewardActionMessage(`❌ ${data.error || 'Redeem failed'}`)
        return
      }

      setRewardActionMessage('✅ Reward redeemed successfully')

      if (customer?.id) {
        await fetchCustomerRewards(customer.id)
      }
    } catch (error) {
      console.error('Redeem from customer error:', error)
      setRewardActionMessage('❌ Failed to redeem reward')
    }
  }

  async function handleAddPoints() {
    if (!customer?.id || !amountSpent.trim()) return

    setAddingPoints(true)
    setPointsMessage('')

    try {
      const res = await fetch('/api/staff/add-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customer.id,
          amountSpent,
        }),
      })

      const text = await res.text()
      let data: any = null

      try {
        data = JSON.parse(text)
      } catch {
        setPointsMessage('❌ API did not return valid JSON')
        return
      }

      if (!res.ok) {
        setPointsMessage(`❌ ${data.error || 'Failed to add points'}`)
        return
      }

      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              points: data.newPointsBalance,
            }
          : prev
      )

      setPointsMessage(`✅ Added ${data.pointsAdded} points`)
      setAmountSpent('')
    } catch (error) {
      console.error('Add points error:', error)
      setPointsMessage('❌ Failed to add points')
    } finally {
      setAddingPoints(false)
    }
  }

  function handleClearCustomer() {
    setScanResult(null)
    setCustomer(null)
    setRewards([])
    setMessage('')
    setLookupMessage('')
    setNameSearchMessage('')
    setNameResults([])
    setPointsMessage('')
    setRewardActionMessage('')
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6 text-[#2f241f]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#620b0b]/70">
              Staff Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Scan or Lookup</h1>
            <p className="mt-2 text-sm text-[#4d3f38]">
              Scan customer QR codes, look up by loyalty code or first name, add points, or redeem rewards.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm lg:col-span-2">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                QR Scanner
              </p>
              <h2 className="mt-1 text-xl font-semibold">Scan customer QR</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={startScanner}
                disabled={isScanning || isStarting}
                className="rounded-2xl bg-[#620b0b] px-5 py-3 font-medium text-white disabled:opacity-50"
              >
                {isStarting ? 'Starting camera...' : isScanning ? 'Camera active' : 'Start Camera'}
              </button>

              <button
                onClick={stopScanner}
                disabled={!isScanning}
                className="rounded-2xl border border-[#620b0b]/15 px-5 py-3 font-medium text-[#620b0b] disabled:opacity-50"
              >
                Stop Camera
              </button>
            </div>

            <div id="reader" className="min-h-[320px] rounded-2xl bg-[#f3eee8]" />

            {message && (
              <div className="rounded-2xl border border-[#620b0b]/10 bg-[#fffdf9] p-4 text-sm">
                {message}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                  Manual Lookup
                </p>
                <h2 className="mt-1 text-xl font-semibold">Find by loyalty code</h2>
              </div>

              <input
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Enter loyalty code"
                className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
              />

              <button
                onClick={handleManualLookup}
                disabled={lookupLoading || !lookupCode.trim()}
                className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
              >
                {lookupLoading ? 'Looking up...' : 'Find Customer'}
              </button>

              {lookupMessage && <p className="text-sm">{lookupMessage}</p>}
            </div>

            <div className="space-y-4 rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                  Name Search
                </p>
                <h2 className="mt-1 text-xl font-semibold">Find by first name</h2>
              </div>

              <input
                value={firstNameQuery}
                onChange={(e) => setFirstNameQuery(e.target.value)}
                placeholder="Enter first name"
                className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
              />

              <button
                onClick={handleFirstNameSearch}
                disabled={nameSearchLoading || !firstNameQuery.trim()}
                className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
              >
                {nameSearchLoading ? 'Searching...' : 'Search Names'}
              </button>

              {nameSearchMessage && <p className="text-sm">{nameSearchMessage}</p>}

              {nameResults.length > 0 && (
                <div className="space-y-2">
                  {nameResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectCustomer(result)}
                      className="w-full rounded-2xl border border-[#620b0b]/10 bg-[#f8f5f0] p-3 text-left transition hover:bg-[#f3eee8]"
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="mt-1 text-sm text-[#4d3f38]">
                        {result.loyaltyCode || 'No loyalty code'} • {result.points} pts
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
                Customer Lookup
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {customer ? customer.name || 'Unnamed Member' : 'No customer loaded'}
              </h2>
            </div>

            <div className="rounded-2xl bg-[#f8f5f0] px-4 py-3 text-right">
              <p className="text-sm text-[#620b0b]/70">Points</p>
              <p className="text-2xl font-bold text-[#620b0b]">
                {customer ? customer.points : '—'}
              </p>
            </div>
          </div>

          {customer ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#f8f5f0] p-4">
                  <p className="text-sm text-[#620b0b]/70">User ID</p>
                  <p className="mt-1 break-all font-medium">{customer.id}</p>
                </div>

                <div className="rounded-2xl bg-[#f8f5f0] p-4">
                  <p className="text-sm text-[#620b0b]/70">Loyalty Code</p>
                  <p className="mt-1 font-medium">
                    {customer.loyaltyCode || scanResult?.loyaltyCode || '—'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-[#620b0b]/10 bg-[#fffdf9] p-4">
                <p className="font-medium text-[#2f241f]">Add Points</p>

                <input
                  value={amountSpent}
                  onChange={(e) => setAmountSpent(e.target.value)}
                  placeholder="Enter amount spent (e.g. 12.50)"
                  className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
                />

                <button
                  onClick={handleAddPoints}
                  disabled={addingPoints || !amountSpent.trim()}
                  className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
                >
                  {addingPoints ? 'Adding points...' : '+ Add Points'}
                </button>

                {pointsMessage && <p className="text-sm">{pointsMessage}</p>}
              </div>

              <div className="space-y-3 rounded-2xl border border-[#620b0b]/10 bg-[#fffdf9] p-4">
                <p className="font-medium text-[#2f241f]">Available Rewards</p>

                {loadingRewards && <p className="text-sm text-[#4d3f38]">Loading rewards...</p>}

                {!loadingRewards && rewards.length === 0 && (
                  <p className="text-sm text-[#4d3f38]">No available rewards</p>
                )}

                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-3"
                  >
                    <div>
                      <p className="font-medium text-[#2f241f]">
                        {reward.title || reward.reward_name || 'Reward'}
                      </p>
                      {reward.description && (
                        <p className="text-sm text-[#4d3f38]">{reward.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRedeemFromCustomer(reward)}
                      className="rounded-xl bg-[#620b0b] px-4 py-2 text-sm font-medium text-white"
                    >
                      {reward.source === 'user_rewards' ? 'Mark Used' : 'Redeem'}
                    </button>
                  </div>
                ))}

                {rewardActionMessage && <p className="text-sm">{rewardActionMessage}</p>}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-[#f8f5f0] p-4 text-sm text-[#4d3f38]">
              Scan a customer QR code, enter a loyalty code, or search by first name to load their profile.
            </div>
          )}

          <button
            onClick={handleClearCustomer}
            className="rounded-2xl border border-[#620b0b]/15 px-5 py-3 font-medium text-[#620b0b]"
          >
            Clear Customer
          </button>
        </div>

        <div className="space-y-4 rounded-3xl border border-[#620b0b]/10 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#620b0b]/70">
              Manual Redeem
            </p>
            <h2 className="mt-1 text-xl font-semibold">Redeem by code</h2>
          </div>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter redemption code"
            className="w-full rounded-2xl border border-[#620b0b]/15 px-4 py-3 outline-none focus:border-[#620b0b]"
          />

          <button
            onClick={handleRedeem}
            disabled={redeeming || !code.trim()}
            className="w-full rounded-2xl bg-[#620b0b] py-3 font-medium text-white disabled:opacity-50"
          >
            {redeeming ? 'Processing...' : 'Redeem'}
          </button>

          {redeemMessage && <p className="text-center text-sm">{redeemMessage}</p>}
        </div>
      </div>
    </div>
  )
}