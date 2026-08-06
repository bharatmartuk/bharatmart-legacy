'use client'

import { useState } from 'react'
import { cn } from '@bharatmart/utils'
import { BecomeSellerDialog } from '@/components/layout/BecomeSellerDialog'

export function FooterBecomeSellerLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={cn('text-sm text-[#514534] hover:underline', className)}
        onClick={() => setOpen(true)}
        type="button"
      >
        Become a seller
      </button>
      <BecomeSellerDialog onOpenChange={setOpen} open={open} />
    </>
  )
}
