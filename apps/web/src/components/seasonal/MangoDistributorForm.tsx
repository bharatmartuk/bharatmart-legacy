'use client'

import { useMemo, useState, useTransition } from 'react'
import { Button, Input, Label, toast } from '@bharatmart/ui'

type QtyKey =
  | 'qty_banganapally_2kg'
  | 'qty_banganapally_3kg'
  | 'qty_ratnagiri_2kg'
  | 'qty_ratnagiri_3kg'

const PRICE = {
  qty_banganapally_2kg: 13.5,
  qty_banganapally_3kg: 18.5,
  qty_ratnagiri_2kg: 13.5,
  qty_ratnagiri_3kg: 18.5,
} as const

export function MangoDistributorForm() {
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [fromLocation, setFromLocation] = useState('')
  const [selBanganapally, setSelBanganapally] = useState(false)
  const [selRatnagiri, setSelRatnagiri] = useState(false)
  const [qty, setQty] = useState<Record<QtyKey, number>>({
    qty_banganapally_2kg: 0,
    qty_banganapally_3kg: 0,
    qty_ratnagiri_2kg: 0,
    qty_ratnagiri_3kg: 0,
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [notes, setNotes] = useState('')

  const totalBoxes = useMemo(
    () =>
      qty.qty_banganapally_2kg +
      qty.qty_banganapally_3kg +
      qty.qty_ratnagiri_2kg +
      qty.qty_ratnagiri_3kg,
    [qty],
  )

  const estimatedTotal = useMemo(
    () =>
      (Object.keys(PRICE) as QtyKey[]).reduce(
        (sum, key) => sum + qty[key] * PRICE[key],
        0,
      ),
    [qty],
  )

  function adjust(key: QtyKey, delta: number) {
    setQty((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }))
  }

  function goStep2() {
    const types: string[] = []
    if (selBanganapally) types.push('banganapally')
    if (selRatnagiri) types.push('ratnagiri')
    if (!fromLocation.trim()) {
      toast.error('Please enter your location.')
      return
    }
    if (types.length < 1) {
      toast.error('Select at least one mango category.')
      return
    }
    if (totalBoxes < 100) {
      toast.error(`Minimum 100 boxes required. You selected ${totalBoxes}.`)
      return
    }
    setStep(2)
  }

  function submit() {
    startTransition(async () => {
      const mangoTypes = [
        selBanganapally ? 'banganapally' : null,
        selRatnagiri ? 'ratnagiri' : null,
      ]
        .filter(Boolean)
        .join(',')

      const response = await fetch('/api/leads/prebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_type: 'distributor_mango',
          campaign: 'mangoes-2027',
          source: 'mangoes-page',
          from_location: fromLocation,
          mango_types: mangoTypes,
          ...qty,
          name,
          email,
          phone,
          city,
          business_name: businessName,
          notes,
        }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        toast.error(data.error ?? 'Could not submit booking')
        return
      }
      toast.success('Distributor booking received. We will confirm by email.')
      setStep(1)
      setFromLocation('')
      setSelBanganapally(false)
      setSelRatnagiri(false)
      setQty({
        qty_banganapally_2kg: 0,
        qty_banganapally_3kg: 0,
        qty_ratnagiri_2kg: 0,
        qty_ratnagiri_3kg: 0,
      })
      setName('')
      setEmail('')
      setPhone('')
      setCity('')
      setBusinessName('')
      setNotes('')
    })
  }

  return (
    <div className="rounded-2xl border border-[#e8d9c8] bg-white p-5 md:p-6">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-[#FFD700]' : 'bg-[#eee7de]'}`}
            key={n}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="from-location">Where are you from?</Label>
            <Input
              disabled={pending}
              id="from-location"
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="Enter your location"
              value={fromLocation}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="rounded-xl border border-[#e8d9c8] p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#911F07]">
                <input
                  checked={selBanganapally}
                  onChange={(e) => setSelBanganapally(e.target.checked)}
                  type="checkbox"
                />
                Banganapally
              </label>
              {selBanganapally ? (
                <div className="mt-3 space-y-3 text-sm">
                  <QtyRow
                    label="2 KG · 5–6 mangoes · £13.50"
                    onDec={() => adjust('qty_banganapally_2kg', -1)}
                    onInc={() => adjust('qty_banganapally_2kg', 1)}
                    value={qty.qty_banganapally_2kg}
                  />
                  <QtyRow
                    label="3 KG · 7–8 mangoes · £18.50"
                    onDec={() => adjust('qty_banganapally_3kg', -1)}
                    onInc={() => adjust('qty_banganapally_3kg', 1)}
                    value={qty.qty_banganapally_3kg}
                  />
                </div>
              ) : null}
            </fieldset>

            <fieldset className="rounded-xl border border-[#e8d9c8] p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#911F07]">
                <input
                  checked={selRatnagiri}
                  onChange={(e) => setSelRatnagiri(e.target.checked)}
                  type="checkbox"
                />
                Ratnagiri Alphonso
              </label>
              {selRatnagiri ? (
                <div className="mt-3 space-y-3 text-sm">
                  <QtyRow
                    label="2 KG · 5–6 mangoes · £13.50"
                    onDec={() => adjust('qty_ratnagiri_2kg', -1)}
                    onInc={() => adjust('qty_ratnagiri_2kg', 1)}
                    value={qty.qty_ratnagiri_2kg}
                  />
                  <QtyRow
                    label="3 KG · 7–8 mangoes · £18.50"
                    onDec={() => adjust('qty_ratnagiri_3kg', -1)}
                    onInc={() => adjust('qty_ratnagiri_3kg', 1)}
                    value={qty.qty_ratnagiri_3kg}
                  />
                </div>
              ) : null}
            </fieldset>
          </div>

          <div className="rounded-lg border border-[#CDE8B8] bg-[#F7FFF0] px-4 py-3 text-sm text-[#2D3A2D]">
            Selected: <strong>{totalBoxes}</strong> boxes · Est.{' '}
            <strong>£{estimatedTotal.toFixed(2)}</strong>
            {totalBoxes > 0 && totalBoxes < 100 ? (
              <span className="ml-2 text-[#B71C1C]">(need {100 - totalBoxes} more)</span>
            ) : null}
          </div>

          <Button
            className="bg-[#4CAF50] text-white hover:bg-[#43a047]"
            onClick={goStep2}
            type="button"
          >
            Next
          </Button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <p className="font-semibold text-[#911F07]">Personal information</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mango-name">Full name</Label>
            <Input
              id="mango-name"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mango-email">Email</Label>
            <Input
              id="mango-email"
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mango-phone">Phone</Label>
            <Input
              id="mango-phone"
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              value={phone}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mango-city">City</Label>
            <Input
              id="mango-city"
              onChange={(e) => setCity(e.target.value)}
              required
              value={city}
            />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button onClick={() => setStep(1)} type="button" variant="outline">
              Back
            </Button>
            <Button
              className="bg-[#4CAF50] text-white hover:bg-[#43a047]"
              disabled={!name || !email || !phone || !city}
              onClick={() => setStep(3)}
              type="button"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <p className="font-semibold text-[#911F07]">Business details</p>
          <div className="space-y-1.5">
            <Label htmlFor="mango-business">Business name (optional)</Label>
            <Input
              id="mango-business"
              onChange={(e) => setBusinessName(e.target.value)}
              value={businessName}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mango-notes">Notes</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="mango-notes"
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              value={notes}
            />
          </div>
          <div className="rounded-lg bg-[#f9f3ea] p-3 text-sm text-[#514534]">
            {totalBoxes} boxes · £{estimatedTotal.toFixed(2)} · {name} · {city}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setStep(2)} type="button" variant="outline">
              Back
            </Button>
            <Button
              className="bg-[#911F07] text-white hover:bg-[#7a1a06]"
              disabled={pending}
              onClick={submit}
              type="button"
            >
              {pending ? 'Submitting…' : 'Submit booking'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function QtyRow({
  label,
  value,
  onInc,
  onDec,
}: {
  label: string
  value: number
  onInc: () => void
  onDec: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#555]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFD700] bg-[#FFFDE7] font-bold"
          onClick={onDec}
          type="button"
        >
          −
        </button>
        <span className="min-w-[1.5rem] text-center font-bold">{value}</span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFD700] bg-[#FFFDE7] font-bold"
          onClick={onInc}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  )
}
