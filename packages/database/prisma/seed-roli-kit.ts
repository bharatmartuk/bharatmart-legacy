/**
 * Upsert the roli/chawal (haldi-kumkum) pack used for Rakhi checkout upsell.
 * Run: pnpm --filter @bharatmart/database db:seed-roli-kit
 */
import { PrismaClient, ProductStatus } from '../generated/client/index.js'
import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT_SLUG = 'roli-chawal-haldi-kumkum-pack'
const KIT_PRICE_PENCE = 200

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })
loadEnv({ path: path.join(REPO_ROOT, 'environment'), override: true })

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: 'rakhi' } })
  if (!category) {
    throw new Error('Category "rakhi" not found. Run full db:seed first.')
  }

  const merchant = await prisma.merchant.findUnique({
    where: { storeSlug: 'festival-lights-emporium' },
  })
  if (!merchant) {
    throw new Error('Merchant festival-lights-emporium not found. Run full db:seed first.')
  }

  const product = await prisma.product.upsert({
    where: { slug: KIT_SLUG },
    update: {
      name: 'Roli Chawal Haldi Kumkum Pack',
      description:
        'Traditional roli, chawal, haldi and kumkum pack for Raksha Bandhan tilak - usually bought with rakhis. Free when you buy 10 or more rakhis; otherwise £2.',
      priceInPence: KIT_PRICE_PENCE,
      stockQuantity: 0,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: category.id,
      merchantId: merchant.id,
      sku: 'FLE-RKH-KIT-001',
    },
    create: {
      slug: KIT_SLUG,
      name: 'Roli Chawal Haldi Kumkum Pack',
      description:
        'Traditional roli, chawal, haldi and kumkum pack for Raksha Bandhan tilak - usually bought with rakhis. Free when you buy 10 or more rakhis; otherwise £2.',
      priceInPence: KIT_PRICE_PENCE,
      stockQuantity: 0,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: category.id,
      merchantId: merchant.id,
      sku: 'FLE-RKH-KIT-001',
    },
  })

  console.log(`Upserted kit: ${product.slug} (${product.id}) @ £${(product.priceInPence / 100).toFixed(2)}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
