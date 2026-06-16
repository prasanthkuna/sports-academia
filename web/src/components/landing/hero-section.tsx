import Link from "next/link";
import { AssetImage } from "@/components/landing/asset-image";
import { ProductMock } from "@/components/landing/product-mock";
import { assets } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(15,118,110,0.12),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage: `url('${assets.landing.textureGrain}')`,
          backgroundSize: "400px 400px",
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            Built for Indian sports academies
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            Collect fees. Mark attendance. Send receipts on WhatsApp.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-body">
            One phone-first app for academy owners and staff — no spreadsheets, no chasing
            parents, no missed follow-ups.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-active"
            >
              Start free demo
            </Link>
            <a
              href="#how-it-works"
              className="rounded-md border border-hairline bg-canvas px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-soft"
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-sm text-muted">
            UPI-ready receipts · Batch attendance · Lead capture page included
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <AssetImage
            src={assets.landing.heroProductMockup}
            alt="Academy Ops mobile app showing fee collection and attendance"
            width={1200}
            height={1440}
            priority
            className="w-full max-w-[340px] drop-shadow-2xl"
            fallback={<ProductMock />}
          />
        </div>
      </div>
    </section>
  );
}
