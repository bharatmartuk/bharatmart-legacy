import type { Metadata } from 'next'
import Link from 'next/link'
import { DiwaliEnquiryForm } from '@/components/seasonal/DiwaliEnquiryForm'
import { WHATSAPP_URL } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Diwali Collection - Festival Essentials | BharatMart UK',
  description:
    'Shop authentic Diwali essentials - diyas, pooja kits, rangoli materials, and festive décor delivered across the UK.',
}

const kits = [
  {
    title: 'Diwali Pooja Kit',
    image: '/seasonal/diwali/diwali-pooja-kit-new.jpg',
    description: 'Curated pooja essentials for a complete Diwali ritual at home.',
  },
  {
    title: 'Diwali Rangoli Kit',
    image: '/seasonal/diwali/diwali-rangoli-kit.jpg',
    description: 'Vibrant colours and traditional patterns for festive doorways.',
  },
  {
    title: 'Rangoli Stencils Kit',
    image: '/seasonal/diwali/stencils-diwali-kit.jpg',
    description: 'Easy stencils for beautiful rangoli designs every time.',
  },
]

export default function DiwaliPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-16">
      <section className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3e0]">
            <span className="text-3xl" aria-hidden>
              ✦
            </span>
          </div>
          <p className="text-sm font-semibold text-[#E65100]">Festival Essentials</p>
          <h1 className="font-heading text-2xl font-semibold text-[#B3472C] md:text-3xl">
            Diwali Collection
          </h1>
        </div>
        <div className="space-y-3 text-sm leading-7 text-[#514534] md:text-base">
          <p>
            From elegant diyas and traditional pooja kits to vibrant rangoli materials and festive
            décor — our curated collection ensures your Diwali celebrations are both authentic and
            memorable.
          </p>
          <p>
            Each product is carefully selected to bring the warmth and joy of Indian traditions to
            your home across the UK.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              className="inline-flex h-10 items-center rounded-full bg-[#a83635] px-5 text-sm font-semibold text-white hover:bg-[#8f2e2d]"
              href={WHATSAPP_URL}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp us
            </a>
            <Link
              className="inline-flex h-10 items-center rounded-full border border-[#d6c4ad] bg-white px-5 text-sm font-semibold text-[#7f5700] hover:bg-[#f4ede4]"
              href="/products?category=rakhi"
            >
              Shop Rakhi too
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold text-[#1e1b16]">Featured kits</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((kit) => (
            <article
              className="overflow-hidden rounded-2xl border border-[#e8d9c8] bg-[#fffaf4]"
              key={kit.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={kit.title} className="aspect-square w-full object-cover" src={kit.image} />
              <div className="p-4">
                <h3 className="font-semibold text-[#E65100]">{kit.title}</h3>
                <p className="mt-1 text-sm text-[#514534]">{kit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-[#e8d9c8] bg-[#fff8f0] p-6 md:p-8">
        <h2 className="font-heading text-xl font-semibold text-[#1e1b16]">Enquire about Diwali</h2>
        <p className="mt-1 text-sm text-[#514534]">
          Tell us what you need — we will help with kits, quantities and UK delivery.
        </p>
        <div className="mt-6">
          <DiwaliEnquiryForm />
        </div>
      </section>
    </main>
  )
}
