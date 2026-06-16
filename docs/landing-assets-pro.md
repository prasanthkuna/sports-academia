# Landing Page — CSS UI Mocks (10x layout)

The marketing landing (`/`) uses **iPhone 16 Pro-style frames** and **animated React UI mocks** — no landing image assets.

## Page sections

| Section | ID | Component |
|---------|-----|-----------|
| Hero | — | `hero-section.tsx` + `HeroPhoneMock` |
| Product flow map | `#product` | `flow-map-section.tsx` — 8 interactive tabs |
| QR platform | `#qr-platform` | `qr-platform-section.tsx` — 5 QR use cases |
| Role lanes | `#roles` | `role-lanes-section.tsx` — owner / staff / coach |
| Day timeline | `#day-timeline` | `day-timeline-section.tsx` |
| Live demo | `#demo` | `demo-playground-section.tsx` |
| Plan matrix | — | `plan-comparison-section.tsx` |
| Pricing | `#pricing` | `pricing-section.tsx` |
| FAQ | `#faq` | `faq-section.tsx` |

## Code locations

- Copy & config: `web/src/lib/landing-config.ts`
- Phone mocks: `web/src/components/landing/ui-mocks.tsx`
- OG image: `web/src/app/(marketing)/opengraph-image.tsx`

## Academy pages only (static assets)

`academy/hero-fallback-*.webp`, `brand/logo-icon.svg` — see `web/src/lib/assets.ts`
