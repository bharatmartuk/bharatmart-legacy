'use client'

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { WHATSAPP_URL } from '@/lib/contact'

export function WhatsAppFloat() {
  return (
    <aside className="fixed bottom-5 right-5 z-40">
      <a
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:h-12 sm:w-auto sm:gap-2 sm:px-4"
        href={WHATSAPP_URL}
        rel="noreferrer"
        target="_blank"
      >
        <WhatsAppIcon className="h-7 w-7 shrink-0 sm:h-5 sm:w-5" />
        <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
      </a>
    </aside>
  )
}
