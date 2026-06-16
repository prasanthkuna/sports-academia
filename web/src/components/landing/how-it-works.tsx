"use client";

import { ClipboardCheck, IndianRupee, MessageCircle } from "lucide-react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Mark attendance in seconds",
    body: "Open your batch, tap present or absent. Parents see consistency — you see who showed up.",
  },
  {
    icon: IndianRupee,
    title: "Collect fee on the spot",
    body: "Cash or UPI — record payment, generate receipt number, done before the kid leaves the net.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp the receipt",
    body: "One tap sends a clean PDF receipt to the parent. No screenshots, no awkward follow-ups.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Three taps between practice and peace of mind
          </h2>
          <p className="mt-4 text-body">
            Designed around the real academy day — morning batches, fee day pressure, and parents
            who live on WhatsApp.
          </p>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <MotionCard
              key={step.title}
              delay={index * 0.12}
              className="relative list-none rounded-xl border border-hairline bg-canvas p-6 shadow-sm"
            >
              <span className="absolute -top-3 left-6 rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <step.icon className="mt-2 h-8 w-8 text-brand" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{step.body}</p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
