/**
 * Strip inaccurate guide-price wording from Ganesh product descriptions.
 * Run: pnpm --filter @bharatmart/database exec tsx prisma/scrub-ganesh-prices.ts
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '../generated/client'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL
}

const prisma = new PrismaClient()

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'ganesh' } })
  if (!cat) throw new Error('Category ganesh not found.')

  const products = await prisma.product.findMany({ where: { categoryId: cat.id } })
  let updated = 0

  for (const product of products) {
    let cleaned = product.description
      .replace(/\s*Guide price[^.]*\./gi, '')
      .replace(/\s*Cart price from[^.]*\./gi, '')
      .replace(/\s*\(cart uses from[^)]*\)\.?/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!/contact us for current pricing/i.test(cleaned)) {
      cleaned = `${cleaned.replace(/\.\s*$/, '')}. Currently out of stock — contact us for current pricing.`
    }

    if (cleaned !== product.description) {
      await prisma.product.update({
        where: { id: product.id },
        data: { description: cleaned },
      })
      updated += 1
    }
  }

  console.log(`Scrubbed price wording from ${updated} ganesh description(s).`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
