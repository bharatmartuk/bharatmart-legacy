'use client'

import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@bharatmart/utils'
import { MARKETING_NAV, type MarketingNavItem } from '@/lib/marketing-nav'

function ComingSoonBadge() {
  return (
    <span className="rounded-full bg-[#eee7de] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7f5700]">
      Coming soon
    </span>
  )
}

function NavRow({
  item,
  onNavigate,
}: {
  item: MarketingNavItem
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const hasChildren = Boolean(item.children?.length)

  if (item.comingSoon && !hasChildren) {
    return (
      <span className="flex cursor-default items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#837561]">
        {item.label}
        <ComingSoonBadge />
      </span>
    )
  }

  if (!hasChildren && item.href) {
    return (
      <Link
        className="block px-4 py-2.5 text-sm text-[#514534] transition hover:bg-[#fff8f0] hover:text-[#7f5700]"
        href={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-[#514534] transition hover:bg-[#fff8f0] hover:text-[#7f5700]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {item.label}
        <ChevronRight className={cn('h-3.5 w-3.5 transition', open && 'rotate-90')} />
      </button>
      {open && item.children ? (
        <ul className="absolute left-full top-0 z-50 min-w-[180px] rounded-xl border border-[#d6c4ad] bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)] lg:left-full">
          {item.children.map((child) => (
            <li key={child.label}>
              {child.comingSoon ? (
                <span className="flex cursor-default items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#837561]">
                  {child.label}
                  <ComingSoonBadge />
                </span>
              ) : (
                <Link
                  className="block px-4 py-2.5 text-sm text-[#514534] transition hover:bg-[#fff8f0] hover:text-[#7f5700]"
                  href={child.href}
                  onClick={onNavigate}
                >
                  {child.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function CategoriesNav() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-semibold text-[#514534] transition hover:bg-[#f4ede4] hover:text-[#7f5700]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Categories
        <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 min-w-[240px] pt-2">
          <ul className="rounded-xl border border-[#d6c4ad] bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {MARKETING_NAV.map((item) => (
              <li key={item.label}>
                <NavRow item={item} onNavigate={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
