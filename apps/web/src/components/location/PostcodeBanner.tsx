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
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-16">
        <div className="flex items-center gap-2 text-sm text-[#514534]">
          <MapPin className="h-4 w-4 shrink-0 text-[#7f5700]" />
          <span className="font-medium text-[#1e1b16]">Your postcode</span>
        </div>

        {location.source === 'account' ? (
          <Button
            asChild
            className="shrink-0 bg-[#a83635] text-white hover:bg-[#8f2e2d]"
            size="sm"
          >
            <Link href="/account">Add delivery address</Link>
          </Button>
        ) : (
          <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center">
            <Input
              aria-label="UK postcode"
              className="uppercase sm:max-w-[11rem]"
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
            <div className="flex gap-2">
              <Button
                className="bg-[#a83635] text-white hover:bg-[#8f2e2d]"
                disabled={pending}
                onClick={save}
                size="sm"
                type="button"
              >
                Save
              </Button>
              {location.status === 'unknown' ? (
                <Button
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
                  Not now
                </Button>
              ) : null}
            </div>
            {error ? <p className="text-xs text-[#a83635] sm:col-span-2">{error}</p> : null}
          </div>
        )}
      </div>
    </div>
  )
}
