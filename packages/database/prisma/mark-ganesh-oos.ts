/**
 * Set every product in the ganesh category to stockQuantity = 0.
 * Also marks the Diwali category as coming soon.
 *
 * Run: pnpm --filter @bharatmart/database db:mark-ganesh-oos
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
  const ganesh = await prisma.category.findUnique({
    where: { slug: 'ganesh' },
    select: { id: true },
  })
  if (!ganesh) {
    throw new Error('Category ganesh not found.')
  }

  const result = await prisma.product.updateMany({
    where: { categoryId: ganesh.id },
    data: { stockQuantity: 0 },
  })
  console.log(`Marked ${result.count} ganesh product(s) out of stock.`)

  const diwali = await prisma.category.updateMany({
    where: { slug: 'diwali' },
    data: { comingSoon: true },
  })
  console.log(`Marked Diwali category coming soon (${diwali.count} row(s)).`)

  const diwaliCategory = await prisma.category.findUnique({
    where: { slug: 'diwali' },
    select: { id: true },
  })
  if (diwaliCategory) {
    const diwaliStock = await prisma.product.updateMany({
      where: { categoryId: diwaliCategory.id },
      data: { stockQuantity: 0 },
    })
    console.log(`Marked ${diwaliStock.count} diwali product(s) out of stock.`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
