'use client'

import { useState } from 'react'
import { BecomeSellerDialog } from '@/components/layout/BecomeSellerDialog'

export function FooterBecomeSellerLink() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="text-sm text-[#514534] hover:underline"
        onClick={() => setOpen(true)}
        type="button"
      >
        Become a seller
      </button>
      <BecomeSellerDialog onOpenChange={setOpen} open={open} />
    </>
  )
}
