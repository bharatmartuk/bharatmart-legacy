'use client'

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  toast,
} from '@bharatmart/ui'

type BecomeSellerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BecomeSellerDialog({ open, onOpenChange }: BecomeSellerDialogProps) {
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setEmail('')
    setPhone('')
    setBusinessName('')
    setPostcode('')
    setMessage('')
    setError(null)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch('/api/leads/seller', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            businessName,
            postcode,
            message,
          }),
        })
        const data = (await response.json()) as { error?: string }
        if (!response.ok) {
          setError(data.error ?? 'Something went wrong.')
          toast.error(data.error ?? 'Something went wrong.')
          return
        }
        toast.success('Thanks — we will be in touch soon.')
        reset()
        onOpenChange(false)
      } catch {
        setError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
      }
    })
  }

  function onTextChange(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value)
    }
  }

  return (
    <Dialog
      onOpenChange={(next: boolean) => {
        if (!next) reset()
        onOpenChange(next)
      }}
      open={open}
    >
      <DialogContent className="border-[#d6c4ad] bg-[#fffaf4] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-[#1e1b16]">
            Become a Seller
          </DialogTitle>
          <DialogDescription className="text-[#514534]">
            Tell us about your business. We will review your enquiry and follow up by email.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="seller-name">Full name</Label>
            <Input
              disabled={pending}
              id="seller-name"
              onChange={onTextChange(setName)}
              required
              value={name}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seller-email">Email</Label>
            <Input
              disabled={pending}
              id="seller-email"
              onChange={onTextChange(setEmail)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seller-phone">Phone</Label>
            <Input
              disabled={pending}
              id="seller-phone"
              onChange={onTextChange(setPhone)}
              required
              type="tel"
              value={phone}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seller-business">Business name</Label>
            <Input
              disabled={pending}
              id="seller-business"
              onChange={onTextChange(setBusinessName)}
              required
              value={businessName}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seller-postcode">UK postcode</Label>
            <Input
              className="uppercase"
              disabled={pending}
              id="seller-postcode"
              onChange={onTextChange(setPostcode)}
              required
              value={postcode}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seller-message">Message (optional)</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pending}
              id="seller-message"
              onChange={onTextChange(setMessage)}
              rows={3}
              value={message}
            />
          </div>
          {error ? <p className="text-sm text-[#a83635]">{error}</p> : null}
          <Button
            className="w-full bg-[#a83635] text-white hover:bg-[#8f2e2d]"
            disabled={pending}
            type="submit"
          >
            {pending ? 'Sending…' : 'Submit enquiry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
