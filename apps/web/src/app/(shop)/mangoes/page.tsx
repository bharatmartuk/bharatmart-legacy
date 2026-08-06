import type { Metadata } from 'next'
import { MangoDistributorForm } from '@/components/seasonal/MangoDistributorForm'
import { WHATSAPP_URL } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Indian Mangoes - 2027 Distributors | BharatMart UK',
  description:
    '2026 customer mango bookings are closed. Bharat Mart UK is accepting 2027 wholesale distributors for premium A-Grade Indian mangoes.',
}

export default function MangoesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#1a1208]">
        <img
          alt="Premium Indian mangoes in a wooden crate"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src="/seasonal/mangoes/bharatmart_booking_form_mangoes.jpeg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1208]/95 via-[#1a1208]/80 to-[#1a1208]/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:px-16">
          <p className="inline-flex rounded-full bg-[#a83635] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            2026 season closed
          </p>
          <h1 className="mt-4 max-w-2xl font-heading text-3xl font-semibold text-white md:text-5xl">
            Indian Mangoes
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 md:text-base">
            Premium A-Grade Banganapally and Alphonso mangoes from India. The 2026 customer
            booking window has closed — stock for retail customers is sold out.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="inline-flex h-11 items-center rounded-full bg-[#FFD700] px-6 text-sm font-bold text-[#911F07] hover:bg-[#FFC300]"
              href="#distributor-form"
            >
              Apply as 2027 distributor
            </a>
            <a
              className="inline-flex h-11 items-center rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              href={WHATSAPP_URL}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e8d9c8] bg-[#fff8f0] p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[#a83635]">
              Customers · 2026
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-[#1e1b16]">
              Booking closed — out of stock
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#514534]">
              We are not taking mango orders for individual customers right now. The 2026 season
              allocation is fully booked and stock is unavailable for retail purchase.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#837561]">
              Customer pre-orders will reopen for a future season — watch this page or message us
              on WhatsApp for updates.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FFD700]/60 bg-[#fffaf0] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7f5700]">
              Distributors · 2027
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-[#911F07]">
              Wholesale registrations open
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#514534]">
              We are accepting <strong>2027 distributor partners only</strong> — shops,
              wholesalers and bulk buyers across the UK. This is not a customer checkout.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#514534]">
              <li>
                <strong>Guide wholesale rates:</strong> 2 KG boxes from £13.50 · 3 KG boxes from
                £18.50
              </li>
              <li>
                <strong>Minimum order:</strong> 100 boxes total
              </li>
              <li>
                Final prices can change with market conditions, freight and seasonal supply —
                we confirm the rate when we accept your booking.
              </li>
            </ul>
            <a
              className="mt-5 inline-flex h-10 items-center rounded-full bg-[#911F07] px-5 text-sm font-semibold text-white hover:bg-[#7a1a06]"
              href="#distributor-form"
            >
              Register interest
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8d9c8] bg-[#fffaf4] py-12" id="distributor-form">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7f5700]">
            Distributor application
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-[#911F07]">
            2027 wholesale booking
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#514534]">
            Tell us your location, mango types and box quantities. Guide rates are{' '}
            <strong>2 KG (£13.50)</strong> and <strong>3 KG (£18.50)</strong> per box — these are
            indicative and may vary with market situations. Minimum <strong>100 boxes</strong>.
          </p>
          <div className="mt-8">
            <MangoDistributorForm />
          </div>
        </div>
      </section>
    </main>
  )
}
