import { GalleryGrid } from '@/components/gallery/GalleryGrid'

export const metadata = {
  title: 'Gallery | BharatMart UK',
  description:
    'Browse the BharatMart UK gallery featuring Ganesh idols and festive moments. Explore designs, sizes and styles across our collection.',
}

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
      <section className="mb-10 text-center md:mb-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#7f5700]">
          From BharatMart
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-[#7f5700] md:text-5xl">
          Our Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#514534] md:text-lg">
          Ganesh idols and festival moments from our collection - browse designs, sizes and styles.
        </p>
      </section>

      <GalleryGrid />
    </main>
  )
}
