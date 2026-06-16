/**
 * Static asset paths under /public/assets
 * Landing page uses CSS UI mocks — no landing images required.
 * Academy public pages still use hero fallbacks when no custom image is set.
 */
export const assets = {
  brand: {
    logoIcon: "/assets/brand/logo-icon.svg",
    logoIconPng: "/assets/brand/logo-icon-512.png",
  },
  academy: {
    heroCricket: "/assets/academy/hero-fallback-cricket.webp",
    heroFootball: "/assets/academy/hero-fallback-football.webp",
  },
  og: {
    academy: "/assets/og/academy-og-template.jpg",
  },
} as const;
