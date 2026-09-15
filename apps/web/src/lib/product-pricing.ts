/** Categories whose listed catalogue prices should not be shown (inaccurate / guide-only). */
const HIDDEN_PRICE_CATEGORY_SLUGS = new Set(['ganesh'])

export function shouldHideListedPrice(categorySlug?: string | null) {
  if (!categorySlug) return false
  return HIDDEN_PRICE_CATEGORY_SLUGS.has(categorySlug.toLowerCase())
}
