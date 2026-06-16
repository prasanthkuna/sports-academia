"use client";

import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { BenefitMock, type BenefitMockId } from "@/components/landing/ui-mocks";
import { landingConfig } from "@/lib/landing-config";

function FeatureCard({
  title,
  description,
  mock,
  delay,
}: {
  title: string;
  description: string;
  mock: BenefitMockId;
  delay: number;
}) {
  return (
    <MotionCard
      delay={delay}
      className="overflow-hidden rounded-xl border border-hairline bg-canvas transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] bg-gradient-to-b from-surface-soft to-canvas">
        <BenefitMock id={mock} />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
      </div>
    </MotionCard>
  );
}

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Daily ops</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything your front desk needs
          </h2>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {landingConfig.benefitCards.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
