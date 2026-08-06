import Link from 'next/link'
import { SEASONAL_CTAS } from '@/lib/marketing-nav'

export function SeasonalCtaGrid() {
  return (
    <section
      aria-labelledby="seasonal-heading"
      className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-8 md:pt-8 lg:px-16"
    >
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold md:text-2xl" id="seasonal-heading">
          Seasonal Collections
        </h2>
        <p className="mt-1 text-sm text-[#514534]">
          Festival essentials and seasonal favourites delivered across the UK.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SEASONAL_CTAS.map((item) => (
          <Link
            className="group overflow-hidden rounded-2xl border border-[#e8d9c8] bg-[#fffaf4] shadow-sm transition hover:border-[#d6c4ad] hover:shadow-md"
            href={item.href}
            key={item.title}
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#f4ede4]">
              <img
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                src={item.image}
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-lg font-semibold" style={{ color: item.accent }}>
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[#514534]">{item.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-[#7f5700] group-hover:underline">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
