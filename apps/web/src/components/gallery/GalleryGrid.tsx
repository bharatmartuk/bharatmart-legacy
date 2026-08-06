'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@bharatmart/ui'
import { GALLERY_IMAGES } from '@/lib/gallery'

export function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
        )
      }
      if (event.key === 'ArrowRight') {
        setActive((current) =>
          current === null ? current : (current + 1) % GALLERY_IMAGES.length,
        )
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active])

  const current = active !== null ? GALLERY_IMAGES[active] : null

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {GALLERY_IMAGES.map((image, index) => (
          <li key={image.src}>
            <button
              aria-label={`View ${image.alt}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#e8d9c8] bg-[#f4ede4] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => setActive(index)}
              type="button"
            >
              <Image
                alt={image.alt}
                className="object-cover transition duration-300 group-hover:scale-105"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={image.src}
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        onOpenChange={(open) => {
          if (!open) setActive(null)
        }}
        open={active !== null}
      >
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:rounded-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">{current?.alt ?? 'Gallery image'}</DialogTitle>
          <DialogDescription className="sr-only">
            Full-size gallery image. Use arrow keys to browse.
          </DialogDescription>
          {current ? (
            <div className="relative">
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                onClick={() => setActive(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/75"
                onClick={() =>
                  setActive(
                    (currentIndex) =>
                      ((currentIndex ?? 0) - 1 + GALLERY_IMAGES.length) %
                      GALLERY_IMAGES.length,
                  )
                }
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/75"
                onClick={() =>
                  setActive(
                    (currentIndex) => ((currentIndex ?? 0) + 1) % GALLERY_IMAGES.length,
                  )
                }
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="relative mx-auto aspect-[3/4] max-h-[85vh] w-full overflow-hidden rounded-2xl bg-black/40 sm:aspect-[4/5]">
                <Image
                  alt={current.alt}
                  className="object-contain"
                  fill
                  priority
                  sizes="90vw"
                  src={current.src}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
