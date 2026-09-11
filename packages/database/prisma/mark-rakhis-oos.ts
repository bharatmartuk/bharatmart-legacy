/**
 * Set every product in the rakhi category to stockQuantity = 0.
 *
 * Run: pnpm --filter @bharatmart/database db:mark-rakhis-oos
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
  const category = await prisma.category.findUnique({
    where: { slug: 'rakhi' },
    select: { id: true },
  })
  if (!category) {
    throw new Error('Category rakhi not found.')
  }

  const result = await prisma.product.updateMany({
    where: { categoryId: category.id },
    data: { stockQuantity: 0 },
  })

  console.log(`Marked ${result.count} rakhi product(s) out of stock.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
