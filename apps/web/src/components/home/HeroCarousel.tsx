'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@bharatmart/ui'
import type { BannerSummary } from '@bharatmart/services'

const AUTO_SLIDE_MS = 6000

function carouselImageSrc(url: string) {
  try {
    if (url.startsWith('/')) return url
    const parsed = new URL(url)
    if (
      parsed.hostname === 'bharatmart-uk.vercel.app' ||
      parsed.hostname.endsWith('.vercel.app')
    ) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    // keep original
  }
  return url
}

export function HeroCarousel({ banners }: { banners: BannerSummary[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (banners.length === 0) return
      const next = ((index % banners.length) + banners.length) % banners.length
      setActiveIndex(next)
    },
    [banners.length],
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    if (banners.length < 2 || isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length)
    }, AUTO_SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [banners.length, isPaused, activeIndex])

  if (banners.length === 0) {
    return (
      <section className="flex aspect-[16/9] w-full items-center bg-[#33302a] px-4 text-white sm:px-6 md:aspect-auto md:min-h-[420px] md:px-8 lg:min-h-[520px] lg:px-16">
        <div className="w-full max-w-xl">
          <h1 className="font-heading text-xl font-bold leading-snug sm:text-2xl md:text-4xl lg:text-5xl">
            The best of India, delivered across the UK
          </h1>
          <Button
            asChild
            className="mt-3 h-9 bg-[#e8a317] px-5 text-sm font-bold text-[#281900] hover:bg-[#ffba3e] md:mt-7 md:h-12 md:px-8"
          >
            <Link href="/products">Shop now</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-label="Featured collections"
      className="group/carousel relative aspect-[5/4] w-full overflow-hidden sm:aspect-[16/9] md:aspect-auto md:h-[420px] lg:h-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchEnd={(event) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start == null || banners.length < 2) return
        const delta = event.changedTouches[0]?.clientX ?? start
        const diff = delta - start
        if (Math.abs(diff) < 48) return
        if (diff < 0) goNext()
        else goPrev()
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
        setIsPaused(true)
      }}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <article className="relative h-full min-w-full" key={banner.id}>
            <Image
              alt=""
              className="object-cover object-center"
              fill
              priority={index === 0}
              sizes="100vw"
              src={carouselImageSrc(banner.imageUrl)}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15">
              <div className="flex h-full items-center px-4 sm:px-6 md:px-8 lg:px-16">
                <div className="max-w-[85%] text-white sm:max-w-lg md:max-w-xl">
                  {banner.comingSoon ? (
                    <span className="mb-1.5 inline-flex rounded-full bg-[#7f5700] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:mb-3 sm:px-4 sm:py-1.5 sm:text-sm md:mb-4">
                      Coming soon
                    </span>
                  ) : null}
                  <h1 className="font-heading text-base font-bold leading-snug sm:text-xl md:text-4xl md:leading-tight lg:text-5xl">
                    {banner.headline}
                  </h1>
                  {banner.subtext ? (
                    <p className="mt-1.5 line-clamp-2 max-w-lg text-[11px] leading-snug text-white/90 sm:mt-2 sm:line-clamp-3 sm:text-sm sm:leading-5 md:mt-4 md:line-clamp-none md:text-lg md:leading-6">
                      {banner.subtext}
                    </p>
                  ) : null}
                  {!banner.comingSoon && banner.ctaLink && banner.ctaText ? (
                    <Button
                      asChild
                      className="mt-2.5 h-8 bg-[#e8a317] px-4 text-xs font-bold text-[#281900] hover:bg-[#ffba3e] sm:mt-4 sm:h-10 sm:px-6 sm:text-sm md:mt-7 md:h-12 md:px-8 md:text-base"
                    >
                      <Link href={banner.ctaLink}>{banner.ctaText}</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {banners.length > 1 ? (
        <>
          <button
            aria-label="Previous banner"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a317] sm:left-3 sm:h-11 sm:w-11 md:left-6 md:opacity-0 md:group-hover/carousel:opacity-100"
            onClick={() => {
              setIsPaused(true)
              goPrev()
            }}
            type="button"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
          <button
            aria-label="Next banner"
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a317] sm:right-3 sm:h-11 sm:w-11 md:right-6 md:opacity-0 md:group-hover/carousel:opacity-100"
            onClick={() => {
              setIsPaused(true)
              goNext()
            }}
            type="button"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4 sm:gap-2 md:bottom-6">
            {banners.map((banner, index) => (
              <button
                aria-label={`Show banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all sm:h-2.5 ${
                  activeIndex === index ? 'w-5 bg-[#e8a317] sm:w-8' : 'w-1.5 bg-white/60 sm:w-2.5'
                }`}
                key={banner.id}
                onClick={() => {
                  setIsPaused(true)
                  setActiveIndex(index)
                }}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
