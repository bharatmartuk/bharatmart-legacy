'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@bharatmart/utils'
import { FavoriteButton } from '@/components/product/FavoriteButton'
import type { WishlistItem } from '@/lib/store/wishlist-store'

interface ProductImageGalleryProps {
  images: Array<{ id: string; url: string }>
  productName: string
  favorite?: WishlistItem
}

export function ProductImageGallery({ images, productName, favorite }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const active = images[activeIndex] ?? images[0]

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return
      const next = ((index % images.length) + images.length) % images.length
      setActiveIndex(next)
    },
    [images.length],
  )

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-[#f4ede4] text-sm text-[#837561]">
        Image coming soon
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-xl bg-[#f9f3ea]"
        onTouchEnd={(event) => {
          const start = touchStartX.current
          touchStartX.current = null
          if (start == null || images.length < 2) return
          const endX = event.changedTouches[0]?.clientX ?? start
          const delta = endX - start
          if (Math.abs(delta) < 40) return
          if (delta < 0) goTo(activeIndex + 1)
          else goTo(activeIndex - 1)
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null
        }}
      >
        <Image
          alt={productName}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          src={active.url}
          unoptimized
        />
        {favorite ? (
          <FavoriteButton className="absolute right-3 top-3 z-10" item={favorite} size="lg" />
        ) : null}
        {images.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition',
                  activeIndex === index ? 'bg-white' : 'bg-white/50',
                )}
                key={image.id}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              aria-current={activeIndex === index}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                'relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 sm:h-16 sm:w-16',
                activeIndex === index ? 'border-[#7f5700]' : 'border-transparent',
              )}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image alt="" className="object-cover" fill sizes="64px" src={image.url} unoptimized />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
