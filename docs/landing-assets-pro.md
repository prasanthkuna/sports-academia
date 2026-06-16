# Landing Page — CSS-Only Visuals

The marketing landing page (`/`) uses **animated React UI mocks** — no image assets required.

## What's rendered in code

| Section | Component | `web/src/components/landing/ui-mocks.tsx` |
|---------|-----------|---------------------------------------------|
| Hero | `HeroPhoneMock` | Cycles QR → fee → dashboard → WhatsApp |
| QR section | `QrCheckInPhoneMock` | Scan animation → success check-in |
| Benefits | `BenefitMock` | 4 mini UI cards (attendance, fees, WhatsApp, QR) |
| Walkthrough | `HeroPhoneMock` | Same product story, scroll reinforcement |

## Social preview (OG)

Generated at runtime via `web/src/app/(marketing)/opengraph-image.tsx` — no static JPG to maintain.

## Optional static assets

Only needed for **academy public pages** (`/a/[slug]`), not the platform landing:

- `academy/hero-fallback-cricket.webp`
- `academy/hero-fallback-football.webp`
- `og/academy-og-template.jpg`
- `brand/logo-icon.svg`

## Removed from landing

`landing/*.webp` and `og/platform-og.jpg` are no longer referenced. Safe to delete from `public/assets/landing/`.
