'use client'

import { useState, useTransition } from 'react'
import { Button, Input, Label, toast } from '@bharatmart/ui'

export function DiwaliEnquiryForm() {
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [interest, setInterest] = useState('')
  const [notes, setNotes] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const response = await fetch('/api/leads/prebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_type: 'diwali_enquiry',
          campaign: 'diwali',
          source: 'diwali-page',
          name,
          email,
          phone,
          city,
          interest,
          notes,
        }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        toast.error(data.error ?? 'Could not submit enquiry')
        return
      }
      toast.success('Enquiry received - we will contact you soon.')
      setName('')
      setEmail('')
      setPhone('')
      setCity('')
      setInterest('')
      setNotes('')
    })
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
      <div className="space-y-1.5">
        <Label htmlFor="diwali-name">Full name</Label>
        <Input
          disabled={pending}
          id="diwali-name"
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="diwali-email">Email</Label>
        <Input
          disabled={pending}
          id="diwali-email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="diwali-phone">Phone</Label>
        <Input
          disabled={pending}
          id="diwali-phone"
          onChange={(e) => setPhone(e.target.value)}
          required
          type="tel"
          value={phone}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="diwali-city">City</Label>
        <Input
          disabled={pending}
          id="diwali-city"
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="diwali-interest">What are you interested in?</Label>
        <Input
          disabled={pending}
          id="diwali-interest"
          onChange={(e) => setInterest(e.target.value)}
          placeholder="e.g. Pooja kit, rangoli, diyas"
          value={interest}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="diwali-notes">Notes</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          disabled={pending}
          id="diwali-notes"
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          value={notes}
        />
      </div>
      <div className="md:col-span-2">
        <Button
          className="bg-[#a83635] text-white hover:bg-[#8f2e2d]"
          disabled={pending}
          type="submit"
        >
          {pending ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
