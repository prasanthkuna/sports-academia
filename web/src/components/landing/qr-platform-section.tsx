"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { QrCheckInPhoneMock, QrUseCaseIcon } from "@/components/landing/ui-mocks";
import { landingConfig } from "@/lib/landing-config";

export function QrPlatformSection() {
  return (
    <section id="attendance-proof" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <AnimateOnScroll>
            <p className="text-sm font-medium uppercase tracking-wider text-brand">Attendance proof</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              QR supports renewal control — it&apos;s not the headline
            </h2>
            <p className="mt-4 text-body">
              On Pro, students scan at the gate so owners know who actually showed up — alongside who
              paid and who is overdue. QR is proof, not a separate register to chase.
            </p>
            <div className="mt-8 flex shrink-0 justify-center lg:justify-start">
              <div className="w-[280px] shrink-0">
                <QrCheckInPhoneMock />
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {landingConfig.qrUseCases.map((item, i) => (
              <MotionCard
                key={item.id}
                delay={i * 0.08}
                className="rounded-xl border border-hairline bg-canvas p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                    <QrUseCaseIcon id={item.id} className="h-5 w-5 text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm text-body">{item.description}</p>
                    {item.demoHref && (
                      <Link
                        href={item.demoHref}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                      >
                        Try in demo
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
