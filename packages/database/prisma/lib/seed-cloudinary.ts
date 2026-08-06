import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })

const PRODUCT_FOLDER = 'bharatmart/products'
const SEED_PUBLIC_ID_PREFIX = `${PRODUCT_FOLDER}/seed`

function requireCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required to seed product images.',
    )
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  return cloudName
}

async function resourceExists(publicId: string) {
  try {
    await cloudinary.api.resource(publicId, { resource_type: 'image' })
    return true
  } catch {
    return false
  }
}

function seedPublicId(slug: string) {
  return `${SEED_PUBLIC_ID_PREFIX}/${slug}`
}

const FRIENDLY_ASSET_NAMES: Record<string, string> = {
  'handcrafted-brass-diya-set': 'Handcrafted Brass Diya Set.png',
  'premium-rangoli-colour-kit': 'Premium Rangoli Colour Kit.png',
  'festive-gift-hamper-classic': 'Festive Gift Hamper Classic.png',
  'banarasi-silk-saree-maroon-gold': 'Banarasi Silk Saree \u2014 Maroon Gold.png',
  'cotton-kurti-everyday-set': 'Cotton Kurti Everyday Set.png',
  'kids-festival-sherwani': "Kids' Festival Sherwani.png",
  'homestyle-garam-masala-100g': 'Homestyle Garam Masala.png',
  'toor-dal-premium-1kg': 'Toor Dal Premium.png',
  'ready-biryani-masala-kit': 'Ready Biryani Masala Kit.png',
  'aged-basmati-rice-5kg': 'Aged Basmati Rice.png',
  'sona-masoori-rice-5kg': 'Sona Masoori Rice.png',
  'idli-rice-specialty-2kg': 'Idli Rice Specialty.png',
  'alphonso-mango-box-seasonal': 'Alphonso Mango Box.png',
  'winter-jaggery-gift-pack': 'Winter Jaggery Gift Pack.png',
  'organic-moong-dal-1kg': 'Organic Moong Dal.png',
  'cold-pressed-groundnut-oil-1l': 'Cold-Pressed Groundnut Oil.png',
  'organic-millet-mix-1kg': 'Organic Millet Mix.png',
}

function friendlyAssetCandidates(repoRoot: string, slug: string) {
  const name = FRIENDLY_ASSET_NAMES[slug]
  if (!name) return [] as string[]
  return [path.join(repoRoot, 'assets', 'pickle', name)]
}

function seedDeliveryUrl(cloudName: string, publicId: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function uploadBuffer(
  buffer: Buffer,
  publicId: string,
  attempt = 1,
  options: { assetFolder?: string } = {},
): Promise<string> {
  requireCloudinary()
  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
          timeout: 180000,
          // Dynamic Folders: Media Library path is asset_folder, not public_id slashes.
          ...(options.assetFolder
            ? {
                asset_folder: options.assetFolder,
                display_name: path.basename(publicId),
              }
            : {}),
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error('Cloudinary upload failed'))
          else resolve({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id })
        },
      )
      stream.end(buffer)
    })
    return result.secure_url
  } catch (error) {
    if (attempt >= 4) throw error
    console.warn(`    Cloudinary retry ${attempt}/4 for ${publicId}…`)
    await sleep(2500 * attempt)
    return uploadBuffer(buffer, publicId, attempt + 1, options)
  }
}

async function uploadRemote(url: string, publicId: string) {
  requireCloudinary()
  const result = await cloudinary.uploader.upload(url, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  })
  return result.secure_url
}

/** Resolve a product image URL in Cloudinary for seeding (idempotent per slug). */
export async function resolveSeedProductImageUrl(slug: string, repoRoot: string) {
  const localCandidates = [
    path.join(repoRoot, 'assets', 'products', `${slug}.png`),
    path.join(repoRoot, 'apps', 'web', 'public', 'products', `${slug}.png`),
    // Human-readable filenames for the 17 new-category products (local only, gitignored).
    ...friendlyAssetCandidates(repoRoot, slug),
  ]

  if (!hasCloudinaryConfig()) {
    for (const localPath of localCandidates) {
      if (!existsSync(localPath)) continue
      const { copyFile, mkdir } = await import('node:fs/promises')
      const publicDir = path.join(REPO_ROOT, 'apps', 'web', 'public', 'seed', 'products')
      await mkdir(publicDir, { recursive: true })
      const ext = path.extname(localPath).toLowerCase() || '.png'
      const destName = `${slug}${ext}`
      await copyFile(localPath, path.join(publicDir, destName))
      return `/seed/products/${destName}`
    }
    return `https://picsum.photos/seed/${encodeURIComponent(slug)}/600/600`
  }

  const cloudName = requireCloudinary()
  const publicId = seedPublicId(slug)

  if (await resourceExists(publicId)) {
    return seedDeliveryUrl(cloudName, publicId)
  }

  for (const localPath of localCandidates) {
    if (!existsSync(localPath)) continue
    const buffer = await readFile(localPath)
    return uploadBuffer(buffer, publicId)
  }

  // No local asset - ingest a stable placeholder into our Cloudinary account (not picsum in DB).
  return uploadRemote(`https://picsum.photos/seed/${encodeURIComponent(slug)}/600/600`, publicId)
}

const RAKHI_CLOUDINARY_ROOT = 'bharatmart/rakhis'

/**
 * Cloudinary public_ids reject commas/& and very long paths.
 * Keep folders readable while mirroring one-folder-per-product layout.
 */
function sanitizeCloudinaryFolderName(folderName: string) {
  return folderName
    .replace(/[–—]/g, '-')
    .replace(/&/g, ' and ')
    .replace(/[\\/,]+/g, '-')
    .replace(/[^a-zA-Z0-9 _().'-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .replace(/[ ._-]+$/g, '')
}

/** bharatmart/rakhis/<Product Folder Name>/<original-basename> e.g. .../pic1 */
function rakhiGalleryPaths(folderName: string, localPath: string) {
  const safeFolder = sanitizeCloudinaryFolderName(folderName)
  const baseName = path
    .parse(localPath)
    .name.replace(/[^a-zA-Z0-9 _.-]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
  const assetFolder = `${RAKHI_CLOUDINARY_ROOT}/${safeFolder}`
  return {
    assetFolder,
    publicId: `${assetFolder}/${baseName}`,
    baseName,
  }
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

async function resolveLocalPublicGalleryUrls(
  folderName: string,
  localImagePaths: string[],
) {
  const { copyFile, mkdir } = await import('node:fs/promises')
  const safeFolder = sanitizeCloudinaryFolderName(folderName)
  const publicDir = path.join(REPO_ROOT, 'apps', 'web', 'public', 'seed', 'rakhis', safeFolder)
  await mkdir(publicDir, { recursive: true })

  const urls: string[] = []
  for (const localPath of localImagePaths) {
    const fileName = path.basename(localPath)
    const dest = path.join(publicDir, fileName)
    await copyFile(localPath, dest)
    urls.push(`/seed/rakhis/${encodeURIComponent(safeFolder).replace(/%20/g, ' ')}/${fileName}`)
  }
  return urls
}

/**
 * Move existing rakhi assets into Media Library folders:
 * Home → bharatmart → rakhis → <product> → images
 * (Required for Cloudinary Dynamic Folders — public_id slashes alone stay in Home.)
 */
export async function organizeRakhiAssetsIntoFolders() {
  requireCloudinary()
  let nextCursor: string | undefined
  let moved = 0

  do {
    const page = (await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: `${RAKHI_CLOUDINARY_ROOT}/`,
      max_results: 100,
      next_cursor: nextCursor,
    })) as {
      resources: Array<{ public_id: string; asset_folder?: string }>
      next_cursor?: string
    }

    for (const resource of page.resources) {
      const parts = resource.public_id.split('/')
      if (parts.length < 4) continue
      const assetFolder = parts.slice(0, -1).join('/')
      if (resource.asset_folder === assetFolder) continue

      await cloudinary.api.update(resource.public_id, {
        asset_folder: assetFolder,
        resource_type: 'image',
      })
      moved += 1
      console.log(`  ↪ folder ${assetFolder} ← ${resource.public_id}`)
      await sleep(200)
    }

    nextCursor = page.next_cursor
  } while (nextCursor)

  return moved
}

/**
 * Upload every local gallery image into its own product folder on Cloudinary:
 *   Home / bharatmart / rakhis / <Product Folder Name> / pic1
 * Uses asset_folder so Media Library shows the nested structure (Dynamic Folders).
 */
export async function resolveSeedProductGalleryUrls(
  slug: string,
  localImagePaths: string[],
  options: { forceUpload?: boolean; folderName?: string } = {},
) {
  if (localImagePaths.length === 0) {
    throw new Error(`No local images provided for product ${slug}`)
  }

  const folderName = options.folderName?.trim() || slug

  if (!hasCloudinaryConfig()) {
    console.warn(
      `  ⚠ Cloudinary env missing — storing ${localImagePaths.length} local public URLs for ${folderName}`,
    )
    return resolveLocalPublicGalleryUrls(folderName, localImagePaths)
  }

  const cloudName = requireCloudinary()
  const forceUpload = options.forceUpload ?? true
  const urls: string[] = []

  for (const localPath of localImagePaths) {
    const { assetFolder, publicId } = rakhiGalleryPaths(folderName, localPath)

    if (!forceUpload && (await resourceExists(publicId))) {
      // Ensure Media Library folder is correct even when skipping re-upload.
      await cloudinary.api.update(publicId, {
        asset_folder: assetFolder,
        resource_type: 'image',
      }).catch(() => undefined)
      urls.push(seedDeliveryUrl(cloudName, publicId))
      continue
    }

    if (!existsSync(localPath)) {
      throw new Error(`Missing seed image for ${slug}: ${localPath}`)
    }

    const buffer = await readFile(localPath)
    const url = await uploadBuffer(buffer, publicId, 1, { assetFolder })
    urls.push(url)
    console.log(`    ↑ ${path.basename(localPath)} → ${assetFolder}/${path.parse(localPath).name}`)
    await sleep(400)
  }

  return urls
}
