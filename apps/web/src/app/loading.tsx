/**
 * Route-level loading UI so the peacock favicon is visible during RSC navigations.
 */
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff8f0]"
      role="status"
    >
      <img
        alt="BharatMart"
        className="h-16 w-16 animate-pulse rounded-full object-cover shadow-sm md:h-20 md:w-20"
        height={80}
        src="/favicon.png"
        width={80}
      />
      <span className="sr-only">Loading</span>
    </div>
  )
}
