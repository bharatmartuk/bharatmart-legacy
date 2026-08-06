'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Button, Input, toast } from '@bharatmart/ui'
import {
  saveDeliveryPostcodeAction,
  skipDeliveryPostcodeAction,
} from '@/app/(shop)/location-actions'
import type { CustomerLocation } from '@/lib/customer-location-types'

export function PostcodeBanner({ location }: { location: CustomerLocation }) {
  const [postcode, setPostcode] = useState(location.postcode ?? '')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (location.status === 'set') return null

  function save() {
    setError(null)
    startTransition(async () => {
      const result = await saveDeliveryPostcodeAction(postcode)
      if (!result.ok) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success(`Delivery area set to ${result.postcode}`)
    })
  }

  return (
    <div className="border-b border-[#e8d9c8] bg-[#f9f3ea]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5 md:gap-3 md:px-8 md:py-2 lg:px-16">
        <MapPin
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 text-[#7f5700] md:h-4 md:w-4"
        />
        <span className="hidden shrink-0 text-sm font-medium text-[#1e1b16] sm:inline">
          Your postcode
        </span>

        {location.source === 'account' ? (
          <Button
            asChild
            className="ml-auto h-8 shrink-0 bg-[#a83635] px-3 text-xs text-white hover:bg-[#8f2e2d] md:h-9 md:text-sm"
            size="sm"
          >
            <Link href="/account">Add address</Link>
          </Button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:max-w-md sm:gap-2">
            <Input
              aria-label="UK postcode"
              className="h-8 min-w-0 flex-1 uppercase text-sm md:h-9 md:max-w-[11rem] md:flex-none"
              disabled={pending}
              onChange={(event) => setPostcode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  save()
                }
              }}
              placeholder="E14 8PX"
              value={postcode}
            />
            <Button
              className="h-8 shrink-0 bg-[#a83635] px-3 text-xs text-white hover:bg-[#8f2e2d] md:h-9 md:px-4 md:text-sm"
              disabled={pending}
              onClick={save}
              size="sm"
              type="button"
            >
              Save
            </Button>
            {location.status === 'unknown' ? (
              <Button
                className="h-8 shrink-0 px-2 text-xs text-[#514534] md:h-9 md:px-3 md:text-sm"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await skipDeliveryPostcodeAction()
                    toast.message('Browsing all areas')
                  })
                }
                size="sm"
                type="button"
                variant="ghost"
              >
                <span className="sm:hidden">Skip</span>
                <span className="hidden sm:inline">Not now</span>
              </Button>
            ) : null}
          </div>
        )}
      </div>
      {error ? (
        <p className="mx-auto max-w-7xl px-3 pb-1.5 text-xs text-[#a83635] md:px-8 lg:px-16">
          {error}
        </p>
      ) : null}
    </div>
  )
}
