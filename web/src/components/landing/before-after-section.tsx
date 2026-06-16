"use client";

import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

export function BeforeAfterSection() {
  const { before, after } = landingConfig.beforeAfter;

  return (
    <section className="border-b border-hairline bg-canvas py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Before vs after Academy Ops
          </h2>
        </AnimateOnScroll>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <AnimateOnScroll delay={0.1}>
            <div className="rounded-xl border border-hairline bg-surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Before</p>
              <ul className="mt-4 space-y-2 text-sm text-body">
                {before.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">After</p>
              <ul className="mt-4 space-y-2 text-sm text-body">
                {after.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
