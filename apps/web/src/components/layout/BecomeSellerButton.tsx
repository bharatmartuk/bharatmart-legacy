'use client'

import { useState } from 'react'
import { cn } from '@bharatmart/utils'
import { BecomeSellerDialog } from '@/components/layout/BecomeSellerDialog'

export function BecomeSellerButton({
  className,
  onOpen,
}: {
  className?: string
  onOpen?: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={cn(
          'h-9 items-center justify-center rounded-md bg-[#a83635] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#8f2e2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a83635]/40',
          className,
        )}
        onClick={() => {
          onOpen?.()
          setOpen(true)
        }}
        type="button"
      >
        Become a Seller
      </button>
      <BecomeSellerDialog onOpenChange={setOpen} open={open} />
    </>
  )
}
