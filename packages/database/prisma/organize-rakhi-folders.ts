/**
 * Move already-uploaded rakhi images into Media Library folders:
 * Home → bharatmart → rakhis → <each product folder> → images
 *
 * Run: pnpm --filter @bharatmart/database db:organize-rakhi-folders
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { organizeRakhiAssetsIntoFolders } from './lib/seed-cloudinary'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
loadEnv({ path: path.join(REPO_ROOT, '.env') })
loadEnv({ path: path.join(REPO_ROOT, '.env.local'), override: true })

async function main() {
  console.log('Organizing rakhi assets into bharatmart/rakhis/<product>/ …')
  const moved = await organizeRakhiAssetsIntoFolders()
  console.log(`Done. Updated asset_folder on ${moved} images.`)
  console.log('Refresh Cloudinary Media Library → Home → bharatmart → rakhis')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
