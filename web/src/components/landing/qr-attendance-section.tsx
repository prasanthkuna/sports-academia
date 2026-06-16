"use client";

import { ShieldCheck } from "lucide-react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { QrCheckInPhoneMock } from "@/components/landing/ui-mocks";
import { landingConfig } from "@/lib/landing-config";

export function QrAttendanceSection() {
  const { qrSection } = landingConfig;

  return (
    <section id="qr-attendance" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <AnimateOnScroll>
          <p className="text-sm font-medium uppercase tracking-wider text-brand">{qrSection.badge}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {qrSection.title}
          </h2>
          <p className="mt-4 text-body">{qrSection.subtitle}</p>
          <ol className="mt-8 space-y-5">
            {qrSection.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-semibold text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {qrSection.footnote}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15} className="flex flex-col items-center gap-4 lg:items-end">
          <MotionCard className="w-full max-w-sm">
            <QrCheckInPhoneMock />
          </MotionCard>
          <p className="w-full max-w-sm rounded-lg border border-brand/20 bg-brand-soft/40 px-4 py-2.5 text-center text-xs font-medium text-brand">
            42 QR check-ins today · 8 manual by coaches
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
