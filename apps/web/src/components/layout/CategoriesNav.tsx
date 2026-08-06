'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@bharatmart/utils'
import { MARKETING_NAV, type MarketingNavItem } from '@/lib/marketing-nav'

function ComingSoonBadge() {
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-[#eee7de] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7f5700]">
      Soon
    </span>
  )
}

function NavItem({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: MarketingNavItem
  expanded: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  const hasChildren = Boolean(item.children?.length)

  if (item.comingSoon && !hasChildren) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#837561]">
        <span className="min-w-0 truncate">{item.label}</span>
        <ComingSoonBadge />
      </div>
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
    <div>
      <button
        aria-expanded={expanded}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium transition',
          expanded
            ? 'bg-[#fff8f0] text-[#7f5700]'
            : 'text-[#514534] hover:bg-[#fff8f0] hover:text-[#7f5700]',
        )}
        onClick={onToggle}
        type="button"
      >
        {item.label}
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition', expanded && 'rotate-180')}
        />
      </button>
      {expanded && item.children ? (
        <ul className="border-t border-[#f0e6da] bg-[#fffcf8] py-1">
          {item.children.map((child) => (
            <li key={child.label}>
              {child.comingSoon ? (
                <div className="flex items-center justify-between gap-3 py-2 pl-8 pr-4 text-sm text-[#837561]">
                  <span className="min-w-0 truncate">{child.label}</span>
                  <ComingSoonBadge />
                </div>
              ) : (
                <Link
                  className="block py-2 pl-8 pr-4 text-sm text-[#514534] transition hover:bg-[#fff8f0] hover:text-[#7f5700]"
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
  const [expandedLabel, setExpandedLabel] = useState<string | null>('Festive Collections')
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative hidden lg:block" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-semibold text-[#514534] transition hover:bg-[#f4ede4] hover:text-[#7f5700]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Categories
        <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 w-[280px] pt-2" id={menuId}>
          <ul className="overflow-hidden rounded-xl border border-[#d6c4ad] bg-white py-1 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {MARKETING_NAV.map((item) => (
              <li className="border-b border-[#f4ede4] last:border-b-0" key={item.label}>
                <NavItem
                  expanded={expandedLabel === item.label}
                  item={item}
                  onNavigate={() => setOpen(false)}
                  onToggle={() =>
                    setExpandedLabel((current) =>
                      current === item.label ? null : item.label,
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
