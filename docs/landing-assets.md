# Landing Page Assets — Minimal Pro Set

**Purpose:** Image brief for generating assets into `web/public/assets/`.  
**Rule:** Use WebP for photos/UI mockups, SVG for logos/icons, JPG for OG/social only.  
**Fallback:** Landing pages work without images (HTML product mock + initials). Replace placeholders as you generate files.

---

## Folder structure (standard)

```
web/public/assets/
├── brand/                    # Product brand (platform)
│   ├── logo-icon.svg         # ✅ included — nav favicon-style mark
│   ├── logo-wordmark.svg     # optional text logo
│   └── logo-icon-512.png     # PWA / app icon source
├── landing/                  # Platform marketing (/)
│   ├── hero-product-mockup.webp
│   ├── feature-attendance.webp
│   ├── feature-fees.webp
│   ├── feature-whatsapp.webp
│   └── texture-grain.webp    # optional subtle background
├── academy/                  # Per-academy public pages (/a/[slug])
│   ├── hero-fallback-cricket.webp
│   ├── hero-fallback-football.webp
│   └── coach-portrait-placeholder.webp
├── og/                       # Social / link previews
│   ├── platform-og.jpg
│   └── academy-og-template.jpg
└── testimonials/             # optional P1
    ├── owner-1.webp
    ├── owner-2.webp
    └── owner-3.webp
```

**Drop generated files into these paths exactly** — code references them via `src/lib/assets.ts`.

---

## Asset inventory (minimal pro — 10 required + 3 optional)

### Priority P0 — generate these first

| # | File path | Dimensions | Format | Max size | Used on |
|---|-----------|------------|--------|----------|---------|
| 1 | `landing/hero-product-mockup.webp` | **1200 × 1440** px (4:5) | WebP | 250 KB | `/` hero right |
| 2 | `landing/feature-attendance.webp` | **800 × 600** px (4:3) | WebP | 120 KB | `/` benefits card |
| 3 | `landing/feature-fees.webp` | **800 × 600** px | WebP | 120 KB | `/` benefits card |
| 4 | `landing/feature-whatsapp.webp` | **800 × 600** px | WebP | 120 KB | `/` benefits card |
| 5 | `og/platform-og.jpg` | **1200 × 630** px | JPG | 200 KB | Open Graph / WhatsApp link preview |
| 6 | `academy/hero-fallback-cricket.webp` | **1600 × 900** px (16:9) | WebP | 300 KB | `/a/[slug]` when no custom hero |
| 7 | `og/academy-og-template.jpg` | **1200 × 630** px | JPG | 200 KB | Academy page shares |
| 8 | `brand/logo-icon-512.png` | **512 × 512** px | PNG | 80 KB | PWA, install prompt |

### Priority P1 — optional polish

| # | File path | Dimensions | Format | Used on |
|---|-----------|------------|--------|---------|
| 9 | `landing/texture-grain.webp` | **400 × 400** tile | WebP | Subtle hero background |
| 10 | `academy/hero-fallback-football.webp` | **1600 × 900** | WebP | Football academies |
| 11 | `testimonials/owner-1.webp` | **400 × 400** | WebP | Testimonial avatar (square crop) |

---

## Generation prompts (copy-paste ready)

Use these in Midjourney, DALL·E, Ideogram, or Flux. **Avoid text in images** — UI text is added in code.

### 1. `hero-product-mockup.webp`

```
Professional product marketing photo, modern Android smartphone floating at slight angle on clean white background, screen shows a minimal sports academy management app UI: dashboard with numbers "142 present", "₹8,240 collected", green and amber status chips, dark navigation bar, teal accent color #0F766E, Indian sports academy context, soft shadow under phone, studio lighting, no readable fake text gibberish, UI should look like real SaaS product screenshot, photorealistic device frame, 4:5 vertical composition, high-end Cal.com style product photography, white and light gray only, no purple gradients
```

**Negative prompt:** blurry text, purple gradient, gym bodybuilder, stock photo watermark, cluttered UI

---

### 2. `feature-attendance.webp`

```
Clean UI screenshot style image of mobile attendance screen for sports academy, list of student names with present/absent toggle buttons green and red, batch name "Morning Cricket U12", minimal white interface, teal accent, Indian names, professional app UI mockup, flat design, no logo watermark, 4:3 aspect ratio, light gray card on white background
```

---

### 3. `feature-fees.webp`

```
Clean UI screenshot style, mobile fee collection screen, student name, amount ₹2,500 pending in monospace font, UPI payment mode selected, black primary button "Collect & Receipt", sports academy app, minimal Cal.com inspired aesthetic, white background, 4:3
```

---

### 4. `feature-whatsapp.webp`

```
Split composition: left side shows academy fee receipt PDF preview, right side shows WhatsApp chat bubble with payment confirmation message in green WhatsApp style, Indian parent name, professional product marketing, white background, sports academy context, 4:3, no real phone numbers
```

---

### 5. `og/platform-og.jpg`

```
Open graph social banner 1200x630, split layout, left: bold headline area empty for text overlay, right: stylized phone with academy ops app, colors white black teal #0F766E, minimal geometric, professional B2B SaaS, sports academy India, no text in image
```

---

### 6. `academy/hero-fallback-cricket.webp`

```
Wide cinematic photo 16:9, kids cricket practice at outdoor academy net session in Hyderabad India, golden hour warm light, coach in background slightly blurred, authentic not stocky, professional academy marketing hero, space on left third for text overlay, natural colors, no logos on clothing
```

---

### 7. `og/academy-og-template.jpg`

```
Social share card 1200x630, cricket academy training ground blurred background, dark gradient overlay bottom third for text, teal accent line, professional sports academy branding template, no text baked in
```

---

### 8. `brand/logo-icon-512.png`

```
Minimal app icon, flat vector style, abstract cricket ball seam curve merged with checkmark attendance tick, single color teal #0F766E on white OR white on teal square with rounded corners iOS style, simple geometric, no text, 512px
```

*Tip: Easier to export from SVG in Figma than AI — `brand/logo-icon.svg` is already in repo.*

---

### 9. `landing/texture-grain.webp` (optional)

```
Seamless subtle film grain noise texture, very light gray on white, 5% opacity feel, tileable, no objects, 400x400
```

---

### 10. `testimonials/owner-1.webp` (optional)

```
Professional headshot portrait Indian man age 40-50, academy owner casual smart polo, friendly confident, neutral blurred office background, square crop, natural lighting, not overly retouched
```

---

## Responsive image sizes (what Next.js serves)

| Asset | Display size (CSS) | `srcSet` recommendation |
|-------|-------------------|-------------------------|
| Hero mockup | 480px wide mobile, 560px desktop | Serve 1200w master |
| Feature cards | 100% card ~360px | Serve 800w master |
| Academy hero | full viewport width | Serve 1600w master |
| OG images | N/A (meta only) | Exact 1200×630 |

---

## Academy-specific assets (per client — future)

When an academy uploads branding in Settings, store in Supabase Storage:

```
{academy_id}/branding/logo.webp       — 400×400
{academy_id}/branding/hero.webp       — 1600×900
```

Public page uses: custom hero → sport fallback → `academy/hero-fallback-cricket.webp`.

---

## Checklist before marking assets done

- [ ] All WebP exported at 80–85% quality
- [ ] No embedded text (except UI mock screenshots where intentional)
- [ ] File names **exactly** match table above (lowercase, hyphens)
- [ ] OG images exactly **1200×630**
- [ ] Hero mockup has **transparent or white** edges (no gray letterboxing)
- [ ] Indian context where people appear (Hyderabad / South Asian)
- [ ] No purple gradients, no generic gym imagery

---

## After you generate

1. Place files in `web/public/assets/...`
2. Run `bun run dev` and open `/` and `/a/kca-hyderabad`
3. Images load automatically — no code change needed if paths match
4. Commit assets to git (WebP/JPG in `public/` are fine for repo size if under limits)

---

## What works without images today

| Section | Fallback |
|---------|----------|
| Hero phone | HTML `ProductMock` component (live UI chrome) |
| Feature cards | Gray cards + inline mini UI |
| Academy hero | Teal gradient + sport label |
| Testimonials | Initials avatars |
| OG tags | Default metadata until `og/*.jpg` added |

---

*End of landing assets spec*
