/** Roli / chawal (haldi-kumkum) pack offered with Rakhi checkout. */

export const RAKHI_CATEGORY_SLUG = 'rakhi'

/** Stable product slug for the ritual pack. */
export const RAKHI_KIT_SLUG = 'roli-chawal-haldi-kumkum-pack'

/** Paid price when fewer than the free threshold of rakhis are in the cart. */
export const RAKHI_KIT_PRICE_PENCE = 200

/** Buy this many rakhis and the kit is free. */
export const RAKHI_KIT_FREE_THRESHOLD = 10

export function isRakhiKitSlug(slug: string) {
  return slug === RAKHI_KIT_SLUG
}

export function isRakhiCartLine(item: {
  slug: string
  categorySlug?: string | null
}) {
  if (isRakhiKitSlug(item.slug)) return false
  return item.categorySlug === RAKHI_CATEGORY_SLUG
}

export function countRakhiQuantity(
  items: Array<{ slug: string; categorySlug?: string | null; quantity: number }>,
) {
  return items.reduce(
    (sum, item) => (isRakhiCartLine(item) ? sum + item.quantity : sum),
    0,
  )
}

export function rakhiKitUnitPriceInPence(rakhiQuantity: number) {
  return rakhiQuantity >= RAKHI_KIT_FREE_THRESHOLD ? 0 : RAKHI_KIT_PRICE_PENCE
}

/**
 * Unit price for a line after applying the free-kit rule.
 * `catalog` supplies slug + category for each productId (server uses DB; client uses cart).
 */
export function effectiveUnitPriceInPence(
  product: { id: string; slug: string; priceInPence: number },
  cartItems: Array<{ productId: string; quantity: number }>,
  catalog: Map<
    string,
    { slug: string; categorySlug?: string | null; priceInPence: number }
  >,
) {
  if (!isRakhiKitSlug(product.slug)) return product.priceInPence

  const lines = cartItems.map((item) => {
    const meta = catalog.get(item.productId)
    return {
      slug: meta?.slug ?? '',
      categorySlug: meta?.categorySlug ?? null,
      quantity: item.quantity,
    }
  })

  return rakhiKitUnitPriceInPence(countRakhiQuantity(lines))
}
