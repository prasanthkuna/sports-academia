"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { formatInr, landingConfig, whatsappUrl } from "@/lib/landing-config";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { MotionCard } from "@/components/landing/motion/animate-on-scroll";

export function PricingSection() {
  const { setup, plans, footnote } = landingConfig.pricing;

  return (
    <section id="pricing" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Simple, transparent plans
          </h2>
          <p className="mt-4 text-body">
            One-time setup to go live, then a monthly plan that fits your academy size.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-brand/30 bg-brand-soft/30 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-brand">
                  {setup.title}
                </p>
                <p className="mt-1 font-mono-amount text-3xl font-semibold text-ink sm:text-4xl">
                  {formatInr(setup.amount)}
                </p>
                <p className="mt-1 text-sm text-body">{setup.subtitle}</p>
              </div>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-brand bg-canvas px-6 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                Talk to sales
              </a>
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {setup.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <MotionCard
              key={plan.id}
              delay={i * 0.12}
              className={`relative flex flex-col rounded-2xl border bg-canvas p-6 sm:p-8 ${
                plan.popular ? "border-brand shadow-md ring-1 ring-brand/20" : "border-hairline"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-warning px-3 py-0.5 text-xs font-semibold text-ink">
                  Popular
                </span>
              )}
              <p className="font-display text-lg font-semibold text-ink">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <p className="mt-2 text-xs font-medium text-brand">{plan.idealFor}</p>
              <p className="mt-4 font-mono-amount text-3xl font-semibold text-ink">
                {formatInr(plan.price)}
                <span className="text-base font-normal text-muted"> / {plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-body">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?role=owner"
                className={`mt-8 block rounded-md py-3 text-center text-sm font-semibold ${
                  plan.popular
                    ? "bg-ink text-white hover:bg-ink-active"
                    : "border border-hairline bg-canvas text-ink hover:bg-surface-soft"
                }`}
              >
                Start free demo
              </Link>
            </MotionCard>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">{footnote}</p>
      </div>
    </section>
  );
}
