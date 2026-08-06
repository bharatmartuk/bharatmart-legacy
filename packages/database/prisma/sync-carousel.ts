/**
 * Upsert homepage carousel slides from legacy BharatMart seasonal assets.
 * Images live in apps/web/public/seasonal (shipped with the storefront).
 * Run: pnpm --filter @bharatmart/database db:sync-carousel
 */
import { PrismaClient } from '../generated/client/index.js'
import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })
loadEnv({ path: path.join(REPO_ROOT, 'environment'), override: true })

const prisma = new PrismaClient()

const START_DATE = new Date('2026-01-01T00:00:00.000Z')
const END_DATE = new Date('2028-12-31T23:59:59.000Z')

const CAROUSEL_SLIDES = [
  {
    id: 'carousel_rakhi_legacy',
    imageUrl: '/seasonal/rakhi/banner_01_rakhi.jpg',
    headline: 'Raksha Bandhan — Celebrate the Bond of Love Across the UK',
    subtext:
      'Authentic Indian rakhis, gift hampers and festive essentials for brothers and sisters — delivered across the UK.',
    ctaText: 'Book Rakhis Now',
    ctaLink: '/products?category=rakhi',
    comingSoon: false,
    sortOrder: 1,
  },
  {
    id: 'carousel_rakhi_legacy_2',
    imageUrl: '/seasonal/rakhi/banner_02_rakhi.jpg',
    headline: 'Premium Rakhi & Gift Collection',
    subtext: 'Designer sets, kids specials and thoughtful sibling gift packs for Raksha Bandhan 2026.',
    ctaText: 'Shop Rakhi',
    ctaLink: '/products?category=rakhi',
    comingSoon: false,
    sortOrder: 2,
  },
  {
    id: 'carousel_diwali_legacy',
    imageUrl: '/seasonal/diwali/banner_2.png',
    headline: 'Diwali Collection — Festival Essentials',
    subtext: 'Diyas, pooja kits, rangoli and festive décor curated for UK celebrations.',
    ctaText: 'Explore Diwali',
    ctaLink: '/diwali',
    comingSoon: false,
    sortOrder: 3,
  },
  {
    id: 'carousel_mangoes_legacy',
    imageUrl: '/seasonal/mangoes/bharatmart_booking_form_mangoes.jpeg',
    headline: 'Indian Mangoes — Premium A-Grade',
    subtext: 'Banganapally and Alphonso mangoes. Pre-order for personal use or become a 2027 distributor.',
    ctaText: 'Book Mangoes',
    ctaLink: '/mangoes',
    comingSoon: false,
    sortOrder: 4,
  },
] as const

async function main() {
  for (const slide of CAROUSEL_SLIDES) {
    await prisma.banner.upsert({
      where: { id: slide.id },
      update: {
        imageUrl: slide.imageUrl,
        headline: slide.headline,
        subtext: slide.subtext,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        comingSoon: slide.comingSoon,
        startDate: START_DATE,
        endDate: END_DATE,
        isActive: true,
        sortOrder: slide.sortOrder,
      },
      create: {
        id: slide.id,
        imageUrl: slide.imageUrl,
        headline: slide.headline,
        subtext: slide.subtext,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        comingSoon: slide.comingSoon,
        startDate: START_DATE,
        endDate: END_DATE,
        isActive: true,
        sortOrder: slide.sortOrder,
      },
    })
    console.log(`✓ ${slide.headline} → ${slide.imageUrl}`)
  }

  const count = await prisma.banner.count({ where: { isActive: true } })
  console.log(`Done. Active banners: ${count}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
