"use client";

import Link from "next/link";
import { AssetImage } from "@/components/landing/asset-image";
import { ProductMock } from "@/components/landing/product-mock";
import { AnimateOnMount } from "@/components/landing/motion/animate-on-scroll";
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
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:py-20 xl:py-24">
        <div className="max-w-xl">
          <AnimateOnMount delay={0}>
            <p className="mb-4 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              Built for Indian sports academies
            </p>
          </AnimateOnMount>
          <AnimateOnMount delay={0.1}>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              Collect fees. Mark attendance. Send receipts on WhatsApp.
            </h1>
          </AnimateOnMount>
          <AnimateOnMount delay={0.2}>
            <p className="mt-5 text-lg leading-relaxed text-body">
              One phone-first app for academy owners and staff — no spreadsheets, no chasing
              parents, no missed follow-ups.
            </p>
          </AnimateOnMount>
          <AnimateOnMount delay={0.3}>
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
          </AnimateOnMount>
          <AnimateOnMount delay={0.35}>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              WhatsApp-ready receipts
            </p>
          </AnimateOnMount>
          <AnimateOnMount delay={0.4}>
            <p className="mt-4 text-sm text-muted">
              Trusted by academy owners across Hyderabad, Pune &amp; Bangalore
            </p>
            <p className="mt-2 text-sm text-muted">
              UPI-ready receipts · Batch attendance · Lead capture page included
            </p>
          </AnimateOnMount>
        </div>
        <AnimateOnMount
          delay={0.25}
          className="relative flex items-center justify-center lg:justify-end"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(380px,88vw)] w-[min(380px,88vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.12)_0%,transparent_70%)] lg:left-auto lg:right-0 lg:translate-x-[8%]" />
          <div className="relative w-full max-w-[min(100%,19rem)] sm:max-w-[22rem] lg:max-w-[26rem] xl:max-w-[30rem]">
            <AssetImage
              src={assets.landing.heroProductMockup}
              alt="Academy Ops mobile app showing fee collection and attendance"
              width={1200}
              height={1440}
              priority
              unoptimized
              className="h-auto w-full object-contain drop-shadow-[0_24px_48px_rgba(17,17,17,0.12)]"
              fallback={<ProductMock />}
            />
          </div>
        </AnimateOnMount>
      </div>
    </section>
  );
}
