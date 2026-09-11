import { existsSync } from 'node:fs'
import path from 'node:path'

export type GaneshSeedProduct = {
  merchantSlug: string
  categorySlug: string
  name: string
  slug: string
  description: string
  priceInPence: number
  stockQuantity: number
  sku: string
  isFeatured?: boolean
  localImagePaths: string[]
}

/**
 * Previous-year Ganesh idol SKUs + prices from the legacy HTML site
 * (suryaraj05/bharatmart prebook.html showInfoModal entries).
 * Range prices use the lower bound for cart; full range is in the description.
 */
const GANESH_PRODUCTS = [
  {
    name: 'Eco-Friendly Ganesh Small (6\' - 8\')',
    slug: 'eco-friendly-ganesh-small',
    image: 'eco-small.jpg',
    priceInPence: 1800,
    priceNote: '£18 - £25',
    stockQuantity: 10,
    sku: 'FLE-GNH-001',
    isFeatured: true,
    blurb: 'Eco-clay Ganesh for a simple, eco-conscious home celebration.',
  },
  {
    name: 'Eco-Friendly Ganesh Large 18\'',
    slug: 'eco-friendly-ganesh-large',
    image: 'eco_friendly_large.jpeg',
    priceInPence: 22900,
    priceNote: '£229',
    stockQuantity: 4,
    sku: 'FLE-GNH-002',
    isFeatured: true,
    blurb: 'Large eco-friendly Ganesh murti for home pooja.',
  },
  {
    name: 'Normal Ganesh Small (6\' - 8\')',
    slug: 'normal-ganesh-small',
    image: 'normal-small.jpg',
    priceInPence: 1800,
    priceNote: '£18 - £24',
    stockQuantity: 12,
    sku: 'FLE-GNH-003',
    isFeatured: false,
    blurb: 'Classic POP Ganesh idol for home pooja or gifting.',
  },
  {
    name: 'Normal Ganesh Large (18\' - 24\')',
    slug: 'normal-ganesh-large',
    image: 'normal_large.jpeg',
    priceInPence: 21000,
    priceNote: '£210 - £350',
    stockQuantity: 5,
    sku: 'FLE-GNH-004',
    isFeatured: true,
    blurb: 'Large classic Ganesh murti for festive celebrations.',
  },
  {
    name: 'Premium Ganesh Small 8\'',
    slug: 'premium-ganesh-small',
    image: 'premium_small.png',
    priceInPence: 3000,
    priceNote: '£30',
    stockQuantity: 8,
    sku: 'FLE-GNH-005',
    isFeatured: true,
    blurb: 'Premium finish small Ganesh idol.',
  },
  {
    name: 'Premium Ganesh Large (18\' - 24\')',
    slug: 'premium-ganesh-large',
    image: 'premium_large.png',
    priceInPence: 27500,
    priceNote: '£275 - £550',
    stockQuantity: 3,
    sku: 'FLE-GNH-006',
    isFeatured: true,
    blurb: 'Premium large Ganesh murti — price varies by finish and size within range.',
  },
] as const

function resolveLegacyImgRoot(repoRoot: string) {
  const candidates = [
    path.join(repoRoot, 'Ganesh'),
    path.join(repoRoot, '..', '..', 'BharatMart', 'bharatmart', 'img'),
    path.join(repoRoot, '..', 'BharatMart', 'bharatmart', 'img'),
    path.join(
      process.env.USERPROFILE ?? '',
      'OneDrive',
      'Dokumentumok',
      'BharatMart',
      'bharatmart',
      'img',
    ),
  ]

  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) return candidate
  }

  throw new Error(
    'Ganesh image folder not found. Place images in Ganesh/ or keep the legacy BharatMart/bharatmart/img checkout.',
  )
}

export function loadGaneshSeedCatalog(repoRoot: string): GaneshSeedProduct[] {
  const imgRoot = resolveLegacyImgRoot(repoRoot)

  return GANESH_PRODUCTS.map((product) => {
    const localPath = path.join(imgRoot, product.image)
    if (!existsSync(localPath)) {
      throw new Error(`Missing Ganesh image: ${localPath}`)
    }

    return {
      merchantSlug: 'festival-lights-emporium',
      categorySlug: 'ganesh',
      name: product.name,
      slug: product.slug,
      description: `${product.blurb} Previous-year reference design. Guide price ${product.priceNote} (cart uses from £${(product.priceInPence / 100).toFixed(2)}).`,
      priceInPence: product.priceInPence,
      stockQuantity: product.stockQuantity,
      sku: product.sku,
      isFeatured: product.isFeatured,
      localImagePaths: [localPath],
    }
  })
}
