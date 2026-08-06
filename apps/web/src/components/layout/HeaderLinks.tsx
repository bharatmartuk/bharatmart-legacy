'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@bharatmart/utils'
import { HEADER_LINKS } from '@/lib/marketing-nav'

export function HeaderLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Site" className="ml-1 hidden items-center gap-0.5 lg:flex">
      {HEADER_LINKS.map(({ href, label }) => {
        const active = pathname === href
        return (
          <Link
            className={cn(
              'whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-semibold transition',
              active
                ? 'bg-[#f4ede4] text-[#7f5700]'
                : 'text-[#514534] hover:bg-[#f4ede4] hover:text-[#7f5700]',
            )}
            href={href}
            key={href}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
