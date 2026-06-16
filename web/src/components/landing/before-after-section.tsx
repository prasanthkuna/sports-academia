"use client";

import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";

export function BeforeAfterSection() {
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
                <li>· Excel registers scattered across staff phones</li>
                <li>· Fee follow-ups on WhatsApp with no receipt trail</li>
                <li>· Owner calls staff daily for numbers</li>
                <li>· Enquiries lost in personal chat threads</li>
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">After</p>
              <ul className="mt-4 space-y-2 text-sm text-body">
                <li>· One app for attendance, fees, and receipts</li>
                <li>· Receipt sent to parent on WhatsApp in seconds</li>
                <li>· Owner dashboard with today&apos;s snapshot</li>
                <li>· Public enquiry page captures every lead</li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
