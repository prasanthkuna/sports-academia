# Landing Page v2 — Implementation Plan (3 Phases)

**Status:** Ready to build  
**Scope:** All items from `10x-landing-page.md` except Loom/video (replaced by animated `ProductMock`)  
**Decisions locked:**

| Topic | Decision |
|-------|----------|
| Testimonials | Keep + enhance (stars, city, metric per card) |
| Pricing | **One-time setup fee** + **2 subscription plans** with feature lists |
| Video | **Skip Loom** — use sequenced `ProductMock` animation instead |
| Motion | **Framer Motion** via shared wrappers |
| Stats copy | Aspirational framing: *"Built for academies managing…"* (not fake customer counts) |

---

## Design system (use only these — no new palette)

All landing UI must use existing CSS variables from `globals.css`. No purple gradients, no new brand colors.

| Token | Value / class | Use on landing |
|-------|---------------|----------------|
| Brand teal | `#0F766E` · `bg-brand` `text-brand` `border-brand` | CTAs accent, badges, pricing highlight ring |
| Brand soft | `bg-brand-soft` | Pills, active nav, card hover wash |
| Ink | `#111111` · `bg-ink` `text-ink` | Primary buttons, headings, dark CTA block |
| Canvas | `bg-canvas` | Page background |
| Surface | `bg-surface-soft` `bg-surface-card` | Alternating sections, cards |
| Body / muted | `text-body` `text-muted` | Paragraphs, labels |
| Hairline | `border-hairline` | Cards, dividers |
| Success | `text-success` `bg-success-soft` | WhatsApp badge, checkmarks in pricing |
| Warning | `text-warning` | “Popular” plan badge (optional) |
| Display font | `font-display` (Bricolage on marketing layout) | All `h1`–`h3` |
| Mono amounts | `font-mono-amount` | Pricing ₹ figures, stats bar numbers |

**Section rhythm:** white (`canvas`) → soft gray (`surface-soft`) → white → … Dark blocks only for CTA + footer (`#101010` already in footer).

**Motion:** respect `prefers-reduced-motion` — disable Framer animations, show static content.

---

## Central config (single source of truth)

Create **`web/src/lib/landing-config.ts`** — all copy, pricing, stats, WhatsApp. No magic strings in components.

```ts
export const landingConfig = {
  siteUrl: "https://sports-academia.vercel.app",
  whatsapp: {
    number: "919876543210", // ← replace with real sales number
    message: "Hi, I'm interested in Academy Ops for my sports academy.",
  },
  stats: [
    { value: 50, suffix: "+", label: "Academies onboarded" },
    { value: 5000, suffix: "+", label: "Students managed" },
    { value: 2, prefix: "₹", suffix: " Cr+", label: "Fees tracked on platform" },
  ],
  pricing: { /* see Pricing section below */ },
  features: [ /* 6–9 items for grid */ ],
  testimonials: [ /* stars, city, metric added */ ],
};
```

Components import from here. Marketing edits = one file.

---

## Pricing model (setup + 2 plans)

### Structure

```
┌─────────────────────────────────────────────────────────┐
│  ONE-TIME SETUP                                         │
│  ₹14,999  (example — edit in landing-config)            │
│  Onboarding · Excel import · Staff training · Go-live   │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  STARTER               │  │  PRO  ★ Popular      │
│  ₹2,499 / month        │  │  ₹4,999 / month      │
│  Single location       │  │  Growing academies   │
│  [Feature list]        │  │  [Feature list]      │
│  [Start demo]          │  │  [Start demo]        │
└──────────────────────┘  └──────────────────────┘
```

### Feature matrix (maps to shipped product)

| Feature | Setup (included) | Starter | Pro |
|---------|------------------|---------|-----|
| Student & batch management | ✓ | ✓ | ✓ |
| Daily attendance | ✓ | ✓ | ✓ |
| Fee collection + receipts | ✓ | ✓ | ✓ |
| WhatsApp receipt logging | ✓ | ✓ | ✓ |
| Public academy page + enquiries | ✓ | ✓ | ✓ |
| Excel student import | ✓ | ✓ | ✓ |
| Owner dashboard | — | ✓ | ✓ |
| Leads pipeline | — | ✓ | ✓ |
| Reports export | — | — | ✓ |
| Up to 3 staff users | — | ✓ | — |
| Unlimited staff users | — | — | ✓ |
| Priority onboarding support | — | — | ✓ |

Footnote under cards: *“All plans include secure cloud hosting and data isolation per academy.”*

CTA on each plan → `/login` (demo) or `wa.me` for “Talk to sales” on setup.

---

## Final page flow (no video section)

```
MarketingNav          (+ mobile drawer, scroll spy)
HeroSection           (+ motion, WhatsApp badge, social line)
StatsBar              (count-up)
SportMarquee          (cricket · football · …)
HowItWorksSection     (staggered)
BenefitsSection       (3 deep cards — keep existing assets)
FeaturesGrid          (6 compact icon tiles — no duplicate of benefits visuals)
AnimatedWalkthrough   (ProductMock sequence — replaces Loom)
TestimonialsSection   (stars + city + metric)
PricingSection        (setup banner + 2 plans)
FaqSection            (accordion)
CtaSection            (social proof line)
MarketingFooter       (+ contact, social, Made in India)
FloatingWhatsApp
StickyMobileCta       (mobile only)
```

**11 sections + 2 floating elements** — long but each has a job. `FeaturesGrid` is text/icon-only (6 items) so it doesn’t repeat the 3 image cards above.

---

## Dependency

```powershell
cd web
bun add framer-motion
```

Import pattern (tree-shake friendly):

```ts
import { motion, useInView, useReducedMotion } from "framer-motion";
```

---

## Shared motion primitives

| File | Purpose |
|------|---------|
| `components/landing/motion/animate-on-scroll.tsx` | `fadeUp` variant, `whileInView`, `viewport: { once: true, margin: "-80px" }` |
| `components/landing/motion/count-up.tsx` | Animated number when in view |
| `components/landing/motion/motion-provider.tsx` | Optional: wrap marketing layout, pass `reducedMotion` |

**Default variants** (teal/ink only — no extra colors):

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};
```

**Rules:**
- Hero: animate on **mount**
- Everything else: animate on **scroll into view** (`once: true`)
- Stagger children with `custom` index × 0.1s
- If `useReducedMotion()` → render static children, skip `motion.*`

---

## Phase A — Foundation & mobile (≈ 1 session)

**Goal:** Fix broken mobile UX, SEO, conversion hooks. Page works without waiting for Phase B polish.

| # | Task | File(s) |
|---|------|---------|
| A1 | Add `framer-motion` | `package.json` |
| A2 | Central landing config | `lib/landing-config.ts` |
| A3 | Motion primitives | `components/landing/motion/*` |
| A4 | Mobile hamburger + drawer (anchor links + Sign in) | `marketing-nav.tsx` |
| A5 | FAQ accordion (client, chevron, height animation) | `faq-section.tsx` |
| A6 | Floating WhatsApp (`wa.me` from config) | `floating-whatsapp.tsx` |
| A7 | Sticky mobile CTA bar (“Try free demo”) | `sticky-mobile-cta.tsx` |
| A8 | SEO: `metadataBase`, Twitter, keywords, canonical | `(marketing)/layout.tsx` |
| A9 | JSON-LD: Organization, SoftwareApplication, FAQPage | `(marketing)/structured-data.tsx` |
| A10 | Wire new globals in `page.tsx` (whatsapp, sticky CTA) | `(marketing)/page.tsx` |
| A11 | `prefers-reduced-motion` in globals | `globals.css` |

**Exit criteria:** Mobile nav works at 375px; FAQ toggles; WhatsApp opens; build passes; no metadata warning.

---

## Phase B — Trust, features & pricing (≈ 1–2 sessions)

**Goal:** Full marketing story — stats, features, pricing, richer testimonials.

| # | Task | File(s) |
|---|------|---------|
| B1 | Stats bar with `CountUp` | `stats-bar.tsx` |
| B2 | Sport marquee (CSS infinite scroll, `text-muted`) | `sport-marquee.tsx` |
| B3 | Features grid (6 items from config, hover lift) | `features-grid.tsx` |
| B4 | Pricing: setup card + 2 plan cards | `pricing-section.tsx` |
| B5 | Testimonials: ⭐×5, city chip, metric line | `testimonials-section.tsx` + config |
| B6 | Hero: Framer mount animation + “WhatsApp-ready” badge | `hero-section.tsx` |
| B7 | Hero social line under CTAs (avatar stack optional) | `hero-section.tsx` |
| B8 | How it works + benefits: `AnimateOnScroll` stagger | `how-it-works.tsx`, `benefits-section.tsx` |
| B9 | CTA: “Join academies across Hyderabad, Pune & Bangalore” | `cta-section.tsx` |
| B10 | Before/After strip (Excel chaos → one app) | `before-after-section.tsx` |
| B11 | Compose sections in `page.tsx` | `(marketing)/page.tsx` |

**Exit criteria:** Pricing readable on mobile (stacked cards); stats animate once; testimonials show stars + metrics.

---

## Phase C — Delight & polish (≈ 1 session)

**Goal:** Premium feel, animated product story (Loom replacement), footer + nav polish.

| # | Task | File(s) |
|---|------|---------|
| C1 | `ProductMock` sequenced states (attendance → fee → WhatsApp) | `product-mock.tsx` → `animated-walkthrough.tsx` |
| C2 | Walkthrough section: phone frame + caption steps | `animated-walkthrough-section.tsx` |
| C3 | Product mock: subtle float (`motion` y oscillation) | `product-mock.tsx` or walkthrough |
| C4 | Feature/benefit card hover (`whileHover={{ y: -4 }}`) | `benefits-section.tsx`, `features-grid.tsx` |
| C5 | Nav scroll-spy (active section highlight) | `marketing-nav.tsx` |
| C6 | Footer: email, Instagram/YouTube placeholders, Made in India | `marketing-footer.tsx` |
| C7 | Testimonials + pricing scroll animations | motion wrappers |
| C8 | Lazy-load below-fold images (`loading="lazy"` on AssetImage) | `asset-image.tsx` |

**Animated walkthrough (replaces Loom):**

1. **0s** — Dashboard: Present `142`, Collected `₹8,240` (count-up)
2. **2s** — Transition to fee row: “Collect ₹2,500”
3. **4s** — WhatsApp receipt slides in (green chip)
4. Loop or pause on step 3

Use `AnimatePresence` + `motion` inside existing phone chrome. No external video assets.

**Exit criteria:** Walkthrough loops smoothly; reduced-motion shows final frame only; Lighthouse perf ≥ 85 mobile.

---

## File checklist (all phases)

### New files

```
web/src/lib/landing-config.ts
web/src/components/landing/motion/animate-on-scroll.tsx
web/src/components/landing/motion/count-up.tsx
web/src/components/landing/stats-bar.tsx
web/src/components/landing/sport-marquee.tsx
web/src/components/landing/features-grid.tsx
web/src/components/landing/pricing-section.tsx
web/src/components/landing/floating-whatsapp.tsx
web/src/components/landing/sticky-mobile-cta.tsx
web/src/components/landing/before-after-section.tsx
web/src/components/landing/animated-walkthrough-section.tsx
web/src/components/landing/animated-walkthrough.tsx
web/src/app/(marketing)/structured-data.tsx
```

### Modified files

```
web/src/app/(marketing)/layout.tsx
web/src/app/(marketing)/page.tsx
web/src/components/landing/hero-section.tsx
web/src/components/landing/how-it-works.tsx
web/src/components/landing/benefits-section.tsx
web/src/components/landing/testimonials-section.tsx
web/src/components/landing/faq-section.tsx
web/src/components/landing/cta-section.tsx
web/src/components/landing/marketing-nav.tsx
web/src/components/landing/marketing-footer.tsx
web/src/components/landing/product-mock.tsx
web/src/components/landing/asset-image.tsx
web/src/app/globals.css
web/package.json
```

### Explicitly NOT building

- `demo-video-section.tsx` / Loom embed
- Exit-intent popup
- Rotating/typing hero headline (hurts clarity — keep current h1)
- Third pricing tier (only setup + 2 plans)

---

## `page.tsx` composition (final)

```tsx
<MarketingNav />
<main>
  <HeroSection />
  <StatsBar />
  <SportMarquee />
  <HowItWorksSection />
  <BenefitsSection />
  <FeaturesGrid />
  <AnimatedWalkthroughSection />
  <TestimonialsSection />
  <PricingSection />
  <FaqSection />
  <CtaSection />
  <BeforeAfterSection />  {/* optional: merge into CTA if page feels long */}
</main>
<MarketingFooter />
<FloatingWhatsApp />
<StickyMobileCta />
```

*Note:* `BeforeAfterSection` can sit above FAQ if you want shorter scroll to pricing.

---

## Verification (all phases)

| Check | How |
|-------|-----|
| Build | `bun run build` |
| Mobile 375px | Hamburger, sticky CTA, pricing stack |
| Motion | Scroll sections once; hero on load |
| Reduced motion | OS setting → no animation |
| WhatsApp | Tap floating button → correct `wa.me` |
| Pricing | Setup + 2 plans, feature checkmarks |
| SEO | Rich results test for FAQ schema |
| Colors | No off-palette hex in new components |

---

## Implementation order (recommended)

```
Day 1:  A1–A11  (config, motion, mobile nav, FAQ, WhatsApp, SEO)
Day 2:  B1–B6  (stats, marquee, features, pricing, hero polish)
Day 3:  B7–B11 + C1–C4  (testimonials, animations, walkthrough)
Day 4:  C5–C8  (nav spy, footer, lazy images, QA + deploy)
```

---

## Open input needed before build

1. **WhatsApp sales number** → `landing-config.ts`
2. **Setup fee amount** (₹14,999 placeholder OK?)
3. **Starter / Pro monthly prices** (₹2,499 / ₹4,999 placeholder OK?)
4. **Stats numbers** — confirm aspirational copy is acceptable

Once confirmed, implementation can start Phase A immediately.

---

*Companion docs: `10x-landing-page.md` (original audit), `landing-assets.md` (images)*
