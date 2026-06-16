"use client";

import Link from "next/link";
import { HeroPhoneMock } from "@/components/landing/ui-mocks";
import { AnimateOnMount } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

export function HeroSection() {
  const { hero } = landingConfig;

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(15,118,110,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_80%_20%,rgba(15,118,110,0.06),transparent_50%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:py-20 xl:py-24">
        <div className="max-w-xl">
          <AnimateOnMount delay={0}>
            <p className="mb-4 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              {hero.badge}
            </p>
          </AnimateOnMount>
          <AnimateOnMount delay={0.1}>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              {hero.headline}
            </h1>
          </AnimateOnMount>
          <AnimateOnMount delay={0.2}>
            <p className="mt-5 text-lg leading-relaxed text-body">{hero.subhead}</p>
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
                href="#qr-attendance"
                className="rounded-md border border-hairline bg-canvas px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-soft"
              >
                See QR check-in
              </a>
            </div>
          </AnimateOnMount>
          <AnimateOnMount delay={0.35}>
            <div className="mt-4 flex flex-wrap gap-2">
              {hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-xs font-medium text-success"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {chip}
                </span>
              ))}
            </div>
          </AnimateOnMount>
          <AnimateOnMount delay={0.4}>
            <p className="mt-4 text-sm text-muted">{hero.trustLine}</p>
          </AnimateOnMount>
        </div>
        <AnimateOnMount delay={0.25} className="relative flex items-center justify-center lg:justify-end">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(380px,88vw)] w-[min(380px,88vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.12)_0%,transparent_70%)] lg:left-auto lg:right-0 lg:translate-x-[8%]" />
          <HeroPhoneMock />
        </AnimateOnMount>
      </div>
    </section>
  );
}
