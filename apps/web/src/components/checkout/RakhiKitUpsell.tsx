'use client'

import Image from 'next/image'
import {
  countRakhiQuantity,
  RAKHI_KIT_FREE_THRESHOLD,
  RAKHI_KIT_PRICE_PENCE,
  rakhiKitUnitPriceInPence,
} from '@bharatmart/utils'
import { Button } from '@bharatmart/ui'
import { useCartStore, type CartItem } from '@/lib/store/cart-store'

export type RakhiKitProduct = {
  productId: string
  slug: string
  name: string
  imageUrl: string | null
  priceInPence: number
  stockQuantity: number
  merchantId: string
  merchantName: string
  categorySlug: string
}

const priceFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

export function RakhiKitUpsell({ kit }: { kit: RakhiKitProduct }) {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)

  const rakhiQty = countRakhiQuantity(items)
  if (rakhiQty < 1) return null

  const inCart = items.some((item) => item.productId === kit.productId)
  const unitPrice = rakhiKitUnitPriceInPence(rakhiQty)
  const isFree = unitPrice === 0
  const neededForFree = Math.max(RAKHI_KIT_FREE_THRESHOLD - rakhiQty, 0)

  return (
    <div className="rounded-xl border border-[#FFD700]/70 bg-[#fffaf0] p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-[#7f5700]">
        Usually bought with rakhis
      </p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f4ede4]">
          {kit.imageUrl ? (
            <Image
              alt={kit.name}
              className="object-cover"
              fill
              sizes="80px"
              src={kit.imageUrl}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#837561]">
              Ritual pack
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold text-[#1e1b16]">{kit.name}</h3>
          <p className="mt-1 text-sm leading-5 text-[#514534]">
            Customers usually add this roli / chawal (haldi-kumkum) pack with their rakhis.
          </p>
          <p className="mt-2 text-sm font-semibold text-[#a83635]">
            {isFree ? (
              <>
                <span className="mr-2 text-[#837561] line-through">
                  {priceFormatter.format(RAKHI_KIT_PRICE_PENCE / 100)}
                </span>
                Free with {RAKHI_KIT_FREE_THRESHOLD}+ rakhis
              </>
            ) : (
              <>
                {priceFormatter.format(RAKHI_KIT_PRICE_PENCE / 100)} · add {neededForFree} more
                rakhi{neededForFree === 1 ? '' : 's'} to unlock free
              </>
            )}
          </p>
          <div className="mt-3">
            {inCart ? (
              <Button
                className="border-[#d6c4ad]"
                onClick={() => removeItem(kit.productId)}
                size="sm"
                type="button"
                variant="outline"
              >
                Remove from cart
              </Button>
            ) : (
              <Button
                className="bg-[#2e6a39] text-white hover:bg-[#135224]"
                onClick={() =>
                  addItem({
                    productId: kit.productId,
                    slug: kit.slug,
                    name: kit.name,
                    imageUrl: kit.imageUrl,
                    priceInPence: kit.priceInPence,
                    stockQuantity: kit.stockQuantity,
                    merchantId: kit.merchantId,
                    merchantName: kit.merchantName,
                    categorySlug: kit.categorySlug,
                  } satisfies Omit<CartItem, 'quantity'>)
                }
                size="sm"
                type="button"
              >
                {isFree ? 'Add free pack' : 'Add to order'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
