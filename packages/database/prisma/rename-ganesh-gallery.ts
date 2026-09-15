/**
 * Rename generic "Ganesh Design NN" products to distinctive idol names.
 * Run: pnpm --filter @bharatmart/database exec tsx prisma/rename-ganesh-gallery.ts
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '../generated/client'
import { getGaneshGalleryNameMap } from './lib/seed-ganesh-catalog'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL
}

const prisma = new PrismaClient()

async function main() {
  const names = getGaneshGalleryNameMap()
  let updated = 0

  for (const [n, named] of Object.entries(names)) {
    const slug = `ganesh-design-${n}`
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (!existing) {
      console.warn(`Missing product ${slug}`)
      continue
    }

    const description = `${named.blurb} Currently out of stock — contact us for current pricing.`
    await prisma.product.update({
      where: { slug },
      data: {
        name: named.name,
        description,
      },
    })
    updated += 1
    console.log(`  → ${slug}: ${named.name}`)
  }

  console.log(`Renamed ${updated} gallery Ganesh product(s).`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
