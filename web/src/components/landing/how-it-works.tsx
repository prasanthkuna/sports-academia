"use client";

import { QrCode, IndianRupee, LayoutDashboard, MessageCircle } from "lucide-react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

const stepIcons = [QrCode, IndianRupee, LayoutDashboard, MessageCircle];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From gate to parent proof in four steps
          </h2>
          <p className="mt-4 text-body">
            Designed around the real academy day — morning batches, fee pressure, and parents who
            live on WhatsApp.
          </p>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {landingConfig.howItWorks.map((step, index) => {
            const Icon = stepIcons[index] ?? QrCode;
            return (
              <MotionCard
                key={step.key}
                delay={index * 0.1}
                className="relative list-none rounded-xl border border-hairline bg-canvas p-6 shadow-sm"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <Icon className="mt-2 h-8 w-8 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{step.body}</p>
              </MotionCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
