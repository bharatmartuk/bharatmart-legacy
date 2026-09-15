import { existsSync, readdirSync } from 'node:fs'
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
  /** Prefer these public URLs when set (e.g. /gallery/01.jpg). */
  publicImageUrls?: string[]
}

/**
 * Sized idol SKUs + prices from the legacy HTML site
 * (suryaraj05/bharatmart prebook.html showInfoModal entries).
 * Range prices use the lower bound for cart; full range is in the description.
 */
const GANESH_SIZE_PRODUCTS = [
  {
    name: 'Eco-Friendly Ganesh Small (6\' - 8\')',
    slug: 'eco-friendly-ganesh-small',
    image: 'eco-small.jpg',
    priceInPence: 1800,
    sku: 'FLE-GNH-001',
    isFeatured: true,
    blurb: 'Eco-clay Ganesh for a simple, eco-conscious home celebration.',
  },
  {
    name: 'Eco-Friendly Ganesh Large 18\'',
    slug: 'eco-friendly-ganesh-large',
    image: 'eco_friendly_large.jpeg',
    priceInPence: 22900,
    sku: 'FLE-GNH-002',
    isFeatured: true,
    blurb: 'Large eco-friendly Ganesh murti for home pooja.',
  },
  {
    name: 'Normal Ganesh Small (6\' - 8\')',
    slug: 'normal-ganesh-small',
    image: 'normal-small.jpg',
    priceInPence: 1800,
    sku: 'FLE-GNH-003',
    isFeatured: false,
    blurb: 'Classic POP Ganesh idol for home pooja or gifting.',
  },
  {
    name: 'Normal Ganesh Large (18\' - 24\')',
    slug: 'normal-ganesh-large',
    image: 'normal_large.jpeg',
    priceInPence: 21000,
    sku: 'FLE-GNH-004',
    isFeatured: true,
    blurb: 'Large classic Ganesh murti for festive celebrations.',
  },
  {
    name: 'Premium Ganesh Small 8\'',
    slug: 'premium-ganesh-small',
    image: 'premium_small.png',
    priceInPence: 3000,
    sku: 'FLE-GNH-005',
    isFeatured: true,
    blurb: 'Premium finish small Ganesh idol.',
  },
  {
    name: 'Premium Ganesh Large (18\' - 24\')',
    slug: 'premium-ganesh-large',
    image: 'premium_large.png',
    priceInPence: 27500,
    sku: 'FLE-GNH-006',
    isFeatured: true,
    blurb: 'Premium large Ganesh murti — finish and size vary by piece.',
  },
] as const

/** Named gallery idols (keyed by gallery file stem: 01…28). */
const GALLERY_IDOL_NAMES: Record<string, { name: string; blurb: string }> = {
  '01': {
    name: 'Sapphire Crown Valampuri Ganpati',
    blurb: 'Seated blessing idol with emerald shawl, crimson dhoti and a sapphire-set golden mukut.',
  },
  '02': {
    name: 'White Pheta Royal Ganpati',
    blurb: 'Maharashtrian-style white turban with feather plume, blue-bordered white dhoti and calm blessing pose.',
  },
  '03': {
    name: 'Pink Dhoti Golden Throne Ganesh',
    blurb: 'Four-armed Ganesh on a carved gold throne with sky-blue backrest, pink dhoti and yellow stole.',
  },
  '04': {
    name: 'Pitambar Modak-Hasta Ganesh',
    blurb: 'Canary-yellow dhoti with deep red shawl, ornate golden mukut and modak held in the lower hand.',
  },
  '05': {
    name: 'Pearl Pheta Shree Ashirwad Ganpati',
    blurb: 'White satin turban with pearl and feather accents; palm marked Shree in Abhaya mudra.',
  },
  '06': {
    name: 'Suvarna Prabhavali Mukut Ganesh',
    blurb: 'Close portrait with multi-tier golden crown and wide filigree gold halo behind the head.',
  },
  '07': {
    name: 'Purple Halo Simhasana Ganpati',
    blurb: 'Regal red dhoti idol on a golden circular throne with vivid purple backrest.',
  },
  '08': {
    name: 'Shree-Hasta Purple Throne Ganesh',
    blurb: 'Full seated figure with Shree on the palm, green bolsters and mouse vahana on a blue base.',
  },
  '09': {
    name: 'Trishula Tilak Golden Aura Ganesh',
    blurb: 'Dramatic close-up with trishula-Om tilak and radiant gold circular prabhavali.',
  },
  '10': {
    name: 'Lal Pheta Maharashtrian Ganpati',
    blurb: 'Bold red turban with sarpech, orange shawl and maroon dhoti in classic festive style.',
  },
  '11': {
    name: 'Pitambar Abhaya Ganesh with Mushak',
    blurb: 'Yellow dhoti and red shawl, blessing mudra with Shree, purple foot cushion and mouse vahana.',
  },
  '12': {
    name: 'Magenta & Gold Blue-Throne Ganpati',
    blurb: 'Deep pink dhoti, yellow stole and bright blue circular throne back with heavy gold shringar.',
  },
  '13': {
    name: 'Lavender Angavastra Siddhi Ganesh',
    blurb: 'Purple vest over yellow trousers, right-curving trunk style, magenta seat on ornate gold frame.',
  },
  '14': {
    name: 'Padmasana Lotus Seat Ganpati',
    blurb: 'Seated on a bright pink lotus bloom with purple shawl, yellow dhoti and blessing palm.',
  },
  '15': {
    name: 'Peacock Teal Velvet Rajwadi Ganesh',
    blurb: 'Teal embroidered velvet shawl, red dhoti and jewel-studded multi-tier golden mukut.',
  },
  '16': {
    name: 'Kesari Dhoti Emerald Mukut Ganpati',
    blurb: 'Bright orange dhoti with peacock-teal shawl on a grand golden simhasana throne.',
  },
  '17': {
    name: 'Ruby Mukut Emerald Haar Ganesh',
    blurb: 'Close-up blessing idol with ruby-centred jewelled crown and green teardrop pendant.',
  },
  '18': {
    name: 'Turquoise Dhoti Ratnagiri Ganpati',
    blurb: 'Full seated idol in turquoise silk dhoti with gemstone mukut and mouse at the base.',
  },
  '19': {
    name: 'Mayuri Green Shawl Magenta Ganesh',
    blurb: 'Velvet magenta dhoti with shimmering green shawl and sapphire-centred golden crown.',
  },
  '20': {
    name: 'Bal Ganesh on Mushika Vahana',
    blurb: 'Youthful Bal Ganesh riding a large realistic mouse, pink dhoti and playful outdoor finish.',
  },
  '21': {
    name: 'Saffron Dhoti Neelmani Ganpati',
    blurb: 'Vibrant orange dhoti with blue-gem earrings and Abhaya mudra on a dark pedestal.',
  },
  '22': {
    name: 'Kesari-Rang Simhasana Ganesh',
    blurb: 'Yellow-orange dhoti, red sash and Om-palm blessing pose on a blue-and-gold throne.',
  },
  '23': {
    name: 'Teal Dhoti Rajneel Shawl Ganpati',
    blurb: 'Seafoam dhoti with royal-blue drapery, sunburst golden halo and magenta cushion seat.',
  },
  '24': {
    name: 'Lotus Bloom Mayur Mukut Ganesh',
    blurb: 'Seated on a large red flower with peacock-feather fan behind a delicate gold crown.',
  },
  '25': {
    name: 'Fifteen-Inch Clay Festival Line',
    blurb: 'Workshop shelf of 15-inch clay Ganesh idols in mixed festive colourways on lotus bases.',
  },
  '26': {
    name: 'Saffron & Midnight Clay Showcase',
    blurb: 'Display of large clay Ganpatis including saffron and antique dark finishes under festive nets.',
  },
  '27': {
    name: 'Jewel Mukut 24-Inch Clay Collection',
    blurb: 'Row of 24-inch clay idols with pink, saffron and magenta shringar and jewelled crowns.',
  },
  '28': {
    name: 'Rangoli Angavastra Ganpati Set',
    blurb: 'Bright seated clay idols in pink, orange and purple attire with carved wooden-style bases.',
  },
}

const GALLERY_GUIDE_PRICE_PENCE = 1800

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

function loadSizedProducts(repoRoot: string): GaneshSeedProduct[] {
  const imgRoot = resolveLegacyImgRoot(repoRoot)

  return GANESH_SIZE_PRODUCTS.map((product) => {
    const localPath = path.join(imgRoot, product.image)
    if (!existsSync(localPath)) {
      throw new Error(`Missing Ganesh image: ${localPath}`)
    }

    return {
      merchantSlug: 'festival-lights-emporium',
      categorySlug: 'ganesh',
      name: product.name,
      slug: product.slug,
      description: `${product.blurb} Previous-year reference design. Currently out of stock — contact us for current pricing.`,
      priceInPence: product.priceInPence,
      stockQuantity: 0,
      sku: product.sku,
      isFeatured: product.isFeatured,
      localImagePaths: [localPath],
    }
  })
}

function loadGalleryProducts(repoRoot: string): GaneshSeedProduct[] {
  const galleryDir = path.join(repoRoot, 'apps', 'web', 'public', 'gallery')
  if (!existsSync(galleryDir)) {
    console.warn(`Gallery folder missing at ${galleryDir} — skipping gallery Ganesh products.`)
    return []
  }

  const files = readdirSync(galleryDir)
    .filter((name) => /^\d{2}\.jpe?g$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  return files.map((fileName, index) => {
    const n = fileName.replace(/\.(jpe?g)$/i, '')
    const localPath = path.join(galleryDir, fileName)
    const skuNumber = String(index + 101).padStart(3, '0')
    const named = GALLERY_IDOL_NAMES[n] ?? {
      name: `Festive Ganpati ${n}`,
      blurb: 'Previous-year Ganesh idol from our collection gallery.',
    }

    return {
      merchantSlug: 'festival-lights-emporium',
      categorySlug: 'ganesh',
      name: named.name,
      // Stable slug keyed to gallery file so re-seeds update the same rows.
      slug: `ganesh-design-${n}`,
      description: `${named.blurb} Currently out of stock — contact us for current pricing.`,
      priceInPence: GALLERY_GUIDE_PRICE_PENCE,
      stockQuantity: 0,
      sku: `FLE-GNH-${skuNumber}`,
      isFeatured: index < 4,
      localImagePaths: [localPath],
      publicImageUrls: [`/gallery/${fileName}`],
    }
  })
}

export function loadGaneshSeedCatalog(repoRoot: string): GaneshSeedProduct[] {
  return [...loadSizedProducts(repoRoot), ...loadGalleryProducts(repoRoot)]
}

/** Gallery name map for live DB rename scripts. */
export function getGaneshGalleryNameMap() {
  return { ...GALLERY_IDOL_NAMES }
}
