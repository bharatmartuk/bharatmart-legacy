import Link from 'next/link'
import { AuthService } from '@bharatmart/services'
import { CartLink } from '@/components/cart/CartLink'
import { CategoriesNav } from '@/components/layout/CategoriesNav'
import { HeaderAuthNav } from '@/components/layout/HeaderAuthNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { WishlistLink } from '@/components/wishlist/WishlistLink'
import { LocationChip } from '@/components/location/LocationChip'
import { BecomeSellerButton } from '@/components/layout/BecomeSellerButton'
import { getCurrentUser } from '@/auth'
import type { CustomerLocation } from '@/lib/customer-location-types'

export async function SiteHeader({ location }: { location?: CustomerLocation }) {
  const user = await getCurrentUser()
  const profile = user ? await AuthService.getProfile(user.id) : null

  return (
    <header className="sticky top-0 z-50 isolate border-b border-black/5 bg-[#fff8f0] shadow-[0_4px_12px_rgba(0,0,0,0.04)] [background-color:#fff8f0]">
      <div className="flex h-16 w-full items-center gap-2 px-3 md:h-20 md:gap-3 md:px-4 lg:px-5">
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <MobileNav isSignedIn={Boolean(user)} />
          <Link className="flex shrink-0 items-center justify-center bg-transparent" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="BharatMart"
              src="/bharatmart-logo.png"
              className="block h-11 w-auto max-w-[132px] bg-transparent object-contain md:h-14 md:max-w-[160px]"
              width={217}
              height={98}
            />
          </Link>
          <CategoriesNav />
          {location ? <LocationChip location={location} /> : null}
        </div>

        <nav className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
          <WishlistLink />
          <CartLink />
          <HeaderAuthNav displayName={profile?.name ?? null} isSignedIn={Boolean(user)} />
          {!user ? <BecomeSellerButton className="ml-1 hidden lg:inline-flex" /> : null}
        </nav>
      </div>
    </header>
  )
}
