"use client";

import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { DayTimelineMiniMock } from "@/components/landing/ui-mocks";
import { landingConfig } from "@/lib/landing-config";

export function DayTimelineSection() {
  return (
    <section id="day-timeline" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">A day at the academy</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Gate to parent proof — before sunset
          </h2>
          <p className="mt-4 text-body">
            How a typical morning and evening look when attendance, fees, and owner updates run on
            one platform instead of WhatsApp threads and Excel.
          </p>
        </AnimateOnScroll>

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-hairline md:left-1/2 md:-translate-x-px" />
          <div className="space-y-10">
            {landingConfig.dayTimeline.map((step, i) => (
              <AnimateOnScroll key={step.time} delay={i * 0.08}>
                <div
                  className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${
                    i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className={`pl-10 md:pl-0 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                    <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand bg-canvas text-xs font-bold text-brand md:left-1/2 md:-translate-x-1/2">
                      {step.time}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm text-body">{step.body}</p>
                  </div>
                  <div className={`flex pl-10 md:pl-0 ${i % 2 === 1 ? "md:justify-start" : "md:justify-end"}`}>
                    <DayTimelineMiniMock mockId={step.mock} />
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
