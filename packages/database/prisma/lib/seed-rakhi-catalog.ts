import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export type RakhiSeedProduct = {
  merchantSlug: string
  categorySlug: string
  name: string
  slug: string
  description: string
  priceInPence: number
  stockQuantity: number
  sku: string
  isFeatured?: boolean
  /** Absolute paths to local gallery images (sorted). */
  localImagePaths: string[]
}

type PriceEntry = {
  label: string
  pounds: number
  stock: number | null
  note: string
}

const IMAGE_EXT = /\.(webp|png|jpe?g|avif|gif)$/i
const OLD_PLACEHOLDER_RAKHI_SLUGS = [
  'premium-designer-rakhi-set',
  'traditional-thread-rakhi-pack',
  'kids-special-cartoon-rakhi',
  'sibling-gift-hamper-with-rakhi',
] as const

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenSet(value: string) {
  return new Set(normalize(value).split(' ').filter(Boolean))
}

function similarity(a: string, b: string) {
  const left = tokenSet(a)
  const right = tokenSet(b)
  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }
  const union = new Set([...left, ...right]).size
  return union === 0 ? 0 : intersection / union
}

function slugify(name: string) {
  const base = normalize(name).replace(/\s+/g, '-').slice(0, 72).replace(/-+$/g, '')
  return base || 'rakhi-product'
}

/** Deterministic stock in [min, max] so re-seeds stay stable. */
function stockForSlug(slug: string, min = 8, max = 12) {
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return min + (hash % (max - min + 1))
}

function parsePrices(pricesPath: string): PriceEntry[] {
  const text = readFileSync(pricesPath, 'utf8')
  const entries: PriceEntry[] = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const match = line.match(/^(.+?)\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*pounds(.*)$/i)
    if (!match) {
      throw new Error(`Unparseable rakhi price line: ${line}`)
    }

    const note = (match[3] ?? '').trim()
    const stockMatch = note.match(/stock\s*:\s*(\d+)/i)
    entries.push({
      label: match[1].trim(),
      pounds: Number(match[2]),
      stock: stockMatch ? Number(stockMatch[1]) : null,
      note,
    })
  }

  return entries
}

function listImagePaths(folderPath: string) {
  return readdirSync(folderPath)
    .filter((name) => IMAGE_EXT.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => path.join(folderPath, name))
}

function buildDescription(name: string, note: string) {
  const base = `${name} — festive Raksha Bandhan rakhi ready for UK delivery.`
  if (!note) return base

  const cleaned = note
    .replace(/[()]/g, ' ')
    .replace(/\bstock\s*:\s*\d+\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[,;.\s]+|[,;.\s]+$/g, '')
  if (!cleaned) return base

  // Capture promo notes such as "if selects 10 or more than that, then free".
  return `${base} Note: ${cleaned}.`
}

function isFeatured(pounds: number, name: string) {
  if (pounds >= 5) return true
  const n = normalize(name)
  return n.includes('set of') || n.includes('combo') || n.includes('gift')
}

/**
 * Discover rakhi products from `Rakhis/` folders + `prices.txt`.
 * Re-reads the filesystem each run so folder/image/price updates are picked up.
 */
export function loadRakhiSeedCatalog(repoRoot: string): RakhiSeedProduct[] {
  const rakhisRoot = path.join(repoRoot, 'Rakhis')
  const pricesPath = path.join(rakhisRoot, 'prices.txt')

  if (!existsSync(rakhisRoot)) {
    throw new Error(`Rakhis folder not found at ${rakhisRoot}`)
  }
  if (!existsSync(pricesPath)) {
    throw new Error(`Rakhis prices file not found at ${pricesPath}`)
  }

  const prices = parsePrices(pricesPath)
  const folders = readdirSync(rakhisRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  if (folders.length === 0) {
    throw new Error(`No rakhi product folders found in ${rakhisRoot}`)
  }

  const usedPriceIndexes = new Set<number>()
  const products: RakhiSeedProduct[] = []
  const usedSlugs = new Set<string>()

  folders.forEach((folderName, index) => {
    let bestIndex = -1
    let bestScore = -1

    prices.forEach((price, priceIndex) => {
      if (usedPriceIndexes.has(priceIndex)) return
      const score = similarity(folderName, price.label)
      if (score > bestScore) {
        bestScore = score
        bestIndex = priceIndex
      }
    })

    if (bestIndex < 0 || bestScore < 0.35) {
      throw new Error(`No price match for rakhi folder: ${folderName}`)
    }

    usedPriceIndexes.add(bestIndex)
    const price = prices[bestIndex]!
    const folderPath = path.join(rakhisRoot, folderName)
    const localImagePaths = listImagePaths(folderPath)
    if (localImagePaths.length === 0) {
      throw new Error(`No images found for rakhi folder: ${folderName}`)
    }

    let slug = slugify(folderName)
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${index + 1}`
    }
    usedSlugs.add(slug)

    const skuNumber = String(index + 1).padStart(3, '0')
    products.push({
      merchantSlug: 'festival-lights-emporium',
      categorySlug: 'rakhi',
      name: folderName,
      slug,
      description: buildDescription(folderName, price.note),
      priceInPence: Math.round(price.pounds * 100),
      stockQuantity: price.stock ?? stockForSlug(slug),
      sku: `FLE-RKH-${skuNumber}`,
      isFeatured: isFeatured(price.pounds, folderName),
      localImagePaths,
    })
  })

  const unused = prices
    .map((price, index) => ({ price, index }))
    .filter(({ index }) => !usedPriceIndexes.has(index))
  if (unused.length > 0) {
    throw new Error(
      `Unmatched rakhi price entries: ${unused.map(({ price }) => price.label).join(' | ')}`,
    )
  }

  return products
}

export function getOldPlaceholderRakhiSlugs() {
  return [...OLD_PLACEHOLDER_RAKHI_SLUGS]
}
