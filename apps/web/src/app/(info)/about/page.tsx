import Link from 'next/link'
import { Heart, Handshake, Truck, Users } from 'lucide-react'
import { Button } from '@bharatmart/ui'
import { BecomeSellerButton } from '@/components/layout/BecomeSellerButton'

export const metadata = {
  title: 'About Us',
  description:
    'Learn how BharatMart UK connects the diaspora with authentic Indian merchants across the United Kingdom.',
}

const values = [
  {
    title: 'Authenticity',
    body: 'Sourced directly from creators and genuine high-street merchants.',
    icon: Heart,
    accent: 'bg-[#ffdad7]/40 text-[#a83635]',
  },
  {
    title: 'Community-First',
    body: 'Rooted in the local high street and the stories of the diaspora.',
    icon: Users,
    accent: 'bg-[#ffdeae]/50 text-[#7f5700]',
  },
  {
    title: 'Fair to Merchants',
    body: 'Empowering small businesses with the tools to compete digitally.',
    icon: Handshake,
    accent: 'bg-[#b1f2b4]/40 text-[#2e6a39]',
  },
  {
    title: 'Convenience',
    body: 'Home-grown taste, delivered safely right to your doorstep.',
    icon: Truck,
    accent: 'bg-[#ffdad7]/30 text-[#881e20]',
  },
] as const

export default function AboutPage() {
  return (
    <main>
      <section className="relative aspect-[16/9] w-full overflow-hidden md:aspect-auto md:min-h-[420px] lg:min-h-[520px]">
        <img
          alt="Friends celebrating Indian festival traditions in the UK"
          className="absolute inset-0 h-full w-full object-cover object-left"
          src="/seasonal/diwali/banner_2.png"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative z-10 flex h-full items-center px-4 py-10 md:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl text-white">
              <h1 className="font-heading text-2xl font-bold leading-snug sm:text-3xl md:text-5xl md:leading-tight">
                Bringing India Closer to Home
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base md:mt-6 md:text-xl">
                Connecting the UK&apos;s Indian community with the heritage, flavours, and
                craftsmanship they love.
              </p>
              <div className="mt-5 md:mt-8">
                <Button
                  asChild
                  className="h-9 bg-[#e8a317] px-5 text-sm font-semibold text-[#5b3d00] hover:bg-[#ffdeae] md:h-12 md:px-8 md:text-base"
                >
                  <Link href="/products?category=rakhi">Start Exploring</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff8f0] px-4 py-16 md:px-8 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-6">
            <h2 className="border-l-4 border-[#7f5700] pl-6 font-heading text-3xl font-semibold text-[#a83635]">
              Our Story
            </h2>
            <div className="space-y-4 text-base leading-8 text-[#514534]">
              <p>
                At Bharat Mart UK, we know how hard it is to find authentic, high-quality Indian
                pooja items, decor, wellness products, and everyday essentials in the UK. That&apos;s
                why we&apos;re bringing these products together online - so you can shop easily and get
                them delivered to your door.
              </p>
              <p>
                Our aim is to offer genuine Indian goods at fair prices, making it simple to keep
                traditions alive or add a touch of India to your home. Whether you&apos;re celebrating
                festivals or stocking seasonal favourites, Bharat Mart is your trusted partner
                across the UK.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8d9c8] bg-white p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7f5700]">Coming soon</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-[#1e1b16] md:text-3xl">
              Multi-vendor marketplace
            </h3>
            <p className="mt-4 text-base leading-7 text-[#514534]">
              We are soon launching a multi-vendor option with verified merchants, wider UK
              delivery, and more - so you can discover authentic Indian shops and makers in one
              place.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f9f3ea] px-4 py-16 md:px-8 md:py-20 lg:px-16">
        <div className="mx-auto mb-14 max-w-7xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-[#1e1b16]">What We Stand For</h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#7f5700]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div
                className="rounded-2xl bg-white p-8 text-center transition-all hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(168,54,53,0.1)]"
                key={value.title}
              >
                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${value.accent}`}
                >
                  <Icon aria-hidden className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#1e1b16]">{value.title}</h3>
                <p className="text-sm leading-6 text-[#514534]">{value.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#a83635] px-4 py-20 text-white md:px-8 lg:px-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-[#ffdeae]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full border-8 border-[#ffdeae]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-bold md:text-5xl">Ready to explore?</h2>
          <p className="mt-6 text-base leading-7 opacity-90 md:text-lg">
            Whether you&apos;re looking for the taste of home or a way to grow your business,
            BharatMart UK is your gateway.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button
              asChild
              className="bg-[#e8a317] px-10 py-6 text-base font-semibold text-[#5b3d00] hover:bg-[#ffdeae]"
            >
              <Link href="/products?category=rakhi">Shop Rakhi</Link>
            </Button>
            <BecomeSellerButton className="inline-flex h-auto border-2 border-[#e8a317] bg-transparent px-10 py-6 text-base font-semibold text-[#e8a317] shadow-none hover:bg-[#e8a317]/10" />
          </div>
        </div>
      </section>
    </main>
  )
}
