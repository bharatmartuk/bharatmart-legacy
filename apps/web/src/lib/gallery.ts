/** Legacy Bharatmart gallery — Ganesh idols & festival moments. */
export const GALLERY_IMAGES = Array.from({ length: 28 }, (_, index) => {
  const n = String(index + 1).padStart(2, '0')
  return {
    src: `/gallery/${n}.jpg`,
    alt: `Ganesh idol ${index + 1}`,
  }
})
