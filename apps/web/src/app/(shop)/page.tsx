import { BannerService } from '@bharatmart/services'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { SeasonalCtaGrid } from '@/components/home/SeasonalCtaGrid'
import { TrustStrip } from '@/components/home/TrustStrip'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const banners = await BannerService.getActiveBanners()

  return (
    <main>
      <HeroCarousel banners={banners} />
      <SeasonalCtaGrid />
      <TrustStrip />
    </main>
  )
}
