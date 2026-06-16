# Landing Assets — Pro Update

Minimal asset brief for the post-Pro landing page. Drop files into `web/public/assets/` — components fall back to HTML mocks if missing.

## New / updated (generate these)

| File | Size | Format | Used on |
|------|------|--------|---------|
| `landing/feature-qr-checkin.webp` | **800 × 1000** (4:5) | WebP, ≤150 KB | QR section, benefits card |
| `landing/hero-product-mockup.webp` | **1200 × 1440** (4:5) | WebP, ≤250 KB | Hero — show QR count + dashboard |
| `og/platform-og.jpg` | **1200 × 630** | JPG, ≤200 KB | Social preview — headline: QR attendance |

## Existing (still used)

| File | Size | Used on |
|------|------|---------|
| `landing/feature-attendance.webp` | 800 × 600 | Benefits card |
| `landing/feature-fees.webp` | 800 × 600 | Benefits card |
| `landing/feature-whatsapp.webp` | 800 × 600 | Benefits card |
| `landing/texture-grain.webp` | 400 × 400 tile | Hero background |
| `brand/logo-icon.svg` | vector | Nav |

## Visual direction

- **Hero mockup:** Phone showing owner dashboard with "42 QR today" + fee row + WhatsApp receipt chip. Indian academy context (cricket nets or turf in soft blur).
- **QR check-in:** Student phone scanning ID card QR at academy gate; success screen with name + "Mark present". Teal brand (#0F766E), clean UI — not stock-photo generic.
- **OG image:** "Scan at the gate. Collect fees. Send receipts." + Academy Ops logo. No fake testimonials or inflated stats.

## Removed from landing

Testimonial portraits (`testimonials/owner-*.webp`) are no longer referenced. Safe to delete or keep for future use.

## Code reference

Paths live in `web/src/lib/assets.ts`. Copy and layout driven by `web/src/lib/landing-config.ts`.
