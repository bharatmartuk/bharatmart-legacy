/**
 * Seed previous-year Ganesh idol products (images + prices from legacy HTML site).
 *
 * Run: pnpm --filter @bharatmart/database db:seed-ganesh
 */
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import {
  BusinessType,
  MerchantVerificationStatus,
  PrismaClient,
  ProductStatus,
  UserRole,
} from '../generated/client'
import { loadGaneshSeedCatalog } from './lib/seed-ganesh-catalog'
import { copyFile, mkdir } from 'node:fs/promises'
import { basename } from 'node:path'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL
}

const prisma = new PrismaClient()
const DEMO_PASSWORD = 'Password123!'

async function ensureFestivalLightsMerchant() {
  const existing = await prisma.merchant.findUnique({
    where: { storeSlug: 'festival-lights-emporium' },
    select: { id: true },
  })
  if (existing) return existing.id

  console.log('Creating Festival Lights Emporium merchant…')
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  const user = await prisma.user.upsert({
    where: { email: 'meera.joshi@bharatmart.uk' },
    update: {
      name: 'Meera Joshi',
      phone: '+44 7700 900303',
      role: UserRole.MERCHANT,
      passwordHash,
      emailVerified: new Date('2026-01-02T09:00:00.000Z'),
    },
    create: {
      name: 'Meera Joshi',
      email: 'meera.joshi@bharatmart.uk',
      phone: '+44 7700 900303',
      role: UserRole.MERCHANT,
      passwordHash,
      emailVerified: new Date('2026-01-02T09:00:00.000Z'),
    },
  })

  const merchant = await prisma.merchant.upsert({
    where: { userId: user.id },
    update: {
      businessName: 'Festival Lights Emporium Ltd',
      businessType: BusinessType.TEMPLE_STORE,
      registrationNumber: 'UK-FL-20003',
      verificationStatus: MerchantVerificationStatus.APPROVED,
      storeName: 'Festival Lights Emporium',
      storeSlug: 'festival-lights-emporium',
      storeDescription:
        'Diwali, Holi and Navratri collections - diyas, rangoli kits, festive décor and gift hampers curated for UK celebrations.',
      deliveryPostcodes: ['HA1', 'HA2', 'UB1', 'UB5', 'NW9', 'NW10'],
      hasPhysicalStore: true,
    },
    create: {
      userId: user.id,
      businessName: 'Festival Lights Emporium Ltd',
      businessType: BusinessType.TEMPLE_STORE,
      registrationNumber: 'UK-FL-20003',
      verificationStatus: MerchantVerificationStatus.APPROVED,
      verificationDocumentUrls: [],
      hasPhysicalStore: true,
      storeName: 'Festival Lights Emporium',
      storeSlug: 'festival-lights-emporium',
      storeDescription:
        'Diwali, Holi and Navratri collections - diyas, rangoli kits, festive décor and gift hampers curated for UK celebrations.',
      deliveryPostcodes: ['HA1', 'HA2', 'UB1', 'UB5', 'NW9', 'NW10'],
    },
  })

  return merchant.id
}

async function ensureGaneshCategory() {
  const parent = await prisma.category.findUnique({
    where: { slug: 'festive-collections' },
    select: { id: true },
  })
  if (!parent) {
    throw new Error('Category festive-collections not found. Run the full db:seed first.')
  }

  const category = await prisma.category.upsert({
    where: { slug: 'ganesh' },
    update: {
      name: 'Ganesh',
      parentId: parent.id,
      sortOrder: 3,
      comingSoon: false,
    },
    create: {
      name: 'Ganesh',
      slug: 'ganesh',
      parentId: parent.id,
      sortOrder: 3,
      comingSoon: false,
    },
    select: { id: true },
  })

  return category.id
}

async function main() {
  const products = loadGaneshSeedCatalog(REPO_ROOT)
  console.log(`Seeding ${products.length} Ganesh products…`)

  const merchantId = await ensureFestivalLightsMerchant()
  const categoryId = await ensureGaneshCategory()

  for (const product of products) {
    console.log(
      `  → ${product.name} (£${(product.priceInPence / 100).toFixed(2)}, stock ${product.stockQuantity})`,
    )

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        merchantId,
        categoryId,
        name: product.name,
        description: product.description,
        priceInPence: product.priceInPence,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        status: ProductStatus.ACTIVE,
        isFeatured: Boolean(product.isFeatured),
      },
      create: {
        merchantId,
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceInPence: product.priceInPence,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        status: ProductStatus.ACTIVE,
        isFeatured: Boolean(product.isFeatured),
      },
    })

    const finalUrls =
      product.publicImageUrls && product.publicImageUrls.length > 0
        ? [...product.publicImageUrls]
        : []

    if (finalUrls.length === 0) {
      const publicDir = path.join(REPO_ROOT, 'apps', 'web', 'public', 'seasonal', 'ganesh')
      await mkdir(publicDir, { recursive: true })
      for (const localPath of product.localImagePaths) {
        const fileName = basename(localPath)
        await copyFile(localPath, path.join(publicDir, fileName))
        finalUrls.push(`/seasonal/ganesh/${fileName}`)
      }
    }

    const seededImageIds: string[] = []
    for (let index = 0; index < finalUrls.length; index += 1) {
      const sortOrder = index + 1
      const imageId = `seed_image_${product.slug}_${sortOrder}`
      seededImageIds.push(imageId)
      await prisma.productImage.upsert({
        where: { id: imageId },
        update: {
          productId: record.id,
          url: finalUrls[index]!,
          sortOrder,
        },
        create: {
          id: imageId,
          productId: record.id,
          url: finalUrls[index]!,
          sortOrder,
        },
      })
    }

    await prisma.productImage.deleteMany({
      where: {
        productId: record.id,
        id: { notIn: seededImageIds },
      },
    })
  }

  console.log(`Done. Seeded ${products.length} Ganesh products.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
