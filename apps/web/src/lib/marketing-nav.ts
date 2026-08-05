export type MarketingNavChild = {
  label: string
  href: string
  comingSoon?: boolean
}

export type MarketingNavItem = {
  label: string
  href?: string
  comingSoon?: boolean
  children?: MarketingNavChild[]
}

/** Static marketing category tree for the seasonal storefront. */
export const MARKETING_NAV: MarketingNavItem[] = [
  {
    label: 'Festive Collections',
    children: [
      { label: 'Rakhi', href: '/products?category=rakhi' },
      { label: 'Diwali', href: '/diwali' },
    ],
  },
  {
    label: 'Seasonal Stuff',
    children: [{ label: 'Mangoes', href: '/mangoes' }],
  },
  { label: 'Homemade Foods', comingSoon: true },
  { label: 'Indian Clothing', comingSoon: true },
  { label: 'Indian Groceries', comingSoon: true },
  { label: 'Rice', comingSoon: true },
  { label: 'Organic Store', comingSoon: true },
  { label: 'Ayurveda', comingSoon: true },
]

export const SEASONAL_CTAS = [
  {
    title: 'Rakhi',
    description: 'Authentic rakhis and gift sets for Raksha Bandhan.',
    href: '/products?category=rakhi',
    image: '/seasonal/rakhi/rakhi_hot_selling.jpeg',
    accent: '#C2185B',
  },
  {
    title: 'Diwali',
    description: 'Diyas, pooja kits, rangoli and festive décor.',
    href: '/diwali',
    image: '/seasonal/diwali/diwali-pooja-kit-new.jpg',
    accent: '#B3472C',
  },
  {
    title: 'Mangoes',
    description: 'Premium A-grade Indian mangoes — pre-order now.',
    href: '/mangoes',
    image: '/seasonal/mangoes/bharatmart_mangoes.jpeg',
    accent: '#F9A825',
  },
] as const
