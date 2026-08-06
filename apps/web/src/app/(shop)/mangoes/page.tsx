import type { Metadata } from 'next'
import { MangoDistributorForm } from '@/components/seasonal/MangoDistributorForm'
import { WHATSAPP_URL } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Indian Mangoes - Premium A-Grade | BharatMart UK',
  description:
    'Premium A-Grade Banganapally and Alphonso Indian mangoes delivered across the UK. Pre-order or become a distributor with Bharat Mart UK.',
}

export default function MangoesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#fff8f0]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:px-8 lg:px-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FF9800]">
              Seasonal favourite
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-[#911F07] md:text-4xl">
              Indian Mangoes
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#514534] md:text-base">
              Experience the taste of authentic Indian mangoes. Bharat Mart UK brings you premium
              A-Grade Banganapally and Premium Alphonso mangoes, fresh from India.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#514534] md:text-base">
              Carefully selected for superior quality, sweetness and authentic flavour — perfect for
              personal enjoyment or distribution partnerships across the UK.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center rounded-full bg-[#FFD700] px-6 text-sm font-bold text-[#911F07] hover:bg-[#FFC300]"
                href="#distributor-form"
              >
                2027 Distributors Only
              </a>
              <a
                className="inline-flex h-11 items-center rounded-full border border-[#d6c4ad] bg-white px-6 text-sm font-semibold text-[#7f5700] hover:bg-[#f4ede4]"
                href={WHATSAPP_URL}
                rel="noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-[#837561]">
              Customer mango orders reopen for the 2027 season. Distributor wholesale is open now
              (minimum 100 boxes).
            </p>
          </div>
          <img
            alt="Premium Indian mangoes"
            className="w-full rounded-2xl border border-[#e8d9c8] object-cover shadow-sm"
            src="/seasonal/mangoes/bharatmart_mangoes.jpeg"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <img
            alt="Mango banner"
            className="h-48 w-full rounded-xl object-cover md:h-56"
            src="/seasonal/mangoes/banner_01_mango.jpeg"
          />
          <img
            alt="Mango banner"
            className="h-48 w-full rounded-xl object-cover md:h-56"
            src="/seasonal/mangoes/banner_02_mango.jpeg"
          />
        </div>
      </section>

      <section
        className="border-t border-[#e8d9c8] bg-[#fffaf4] py-12"
        id="distributor-form"
      >
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8d9c8]">
            <img
              alt="Mango booking"
              className="max-h-56 w-full object-cover"
              src="/seasonal/mangoes/bharatmart_booking_form_mangoes.jpeg"
            />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-[#911F07]">
            2027 Distributors Only
          </h2>
          <p className="mt-2 text-sm text-[#514534]">
            Wholesale 2 KG (£13.50) and 3 KG (£18.50) boxes. Minimum <strong>100 boxes</strong>{' '}
            total per order.
          </p>
          <div className="mt-8">
            <MangoDistributorForm />
          </div>
        </div>
      </section>
    </main>
  )
}
