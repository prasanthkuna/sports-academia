/**
 * Central asset paths under /public/assets
 * Generate images per docs/landing-assets.md — pages fall back if missing.
 */
export const assets = {
  brand: {
    logoIcon: "/assets/brand/logo-icon.svg",
    logoIconPng: "/assets/brand/logo-icon-512.png",
  },
  landing: {
    heroProductMockup: "/assets/landing/hero-product-mockup.webp",
    featureAttendance: "/assets/landing/feature-attendance.webp",
    featureFees: "/assets/landing/feature-fees.webp",
    featureWhatsapp: "/assets/landing/feature-whatsapp.webp",
    textureGrain: "/assets/landing/texture-grain.webp",
  },
  academy: {
    heroCricket: "/assets/academy/hero-fallback-cricket.webp",
    heroFootball: "/assets/academy/hero-fallback-football.webp",
  },
  og: {
    platform: "/assets/og/platform-og.jpg",
    academy: "/assets/og/academy-og-template.jpg",
  },
  testimonials: {
    owner1: "/assets/testimonials/owner-1.webp",
    owner2: "/assets/testimonials/owner-2.webp",
    owner3: "/assets/testimonials/owner-3.webp",
  },
} as const;
