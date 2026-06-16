"use client";

import { useState } from "react";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { ProductFlowPhone } from "@/components/landing/ui-mocks";
import { landingConfig, type ProductFlowId } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

export function FlowMapSection() {
  const [active, setActive] = useState<ProductFlowId>("qr");
  const flow = landingConfig.productFlows.find((f) => f.id === active)!;

  return (
    <section id="product" className="border-b border-hairline py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Product</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Every core flow — one platform
          </h2>
          <p className="mt-4 text-body">
            Tap a module to see how it works on a phone. No app install for parents or students.
          </p>
        </AnimateOnScroll>

        <div className="mt-10 flex flex-wrap gap-2">
          {landingConfig.productFlows.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                active === f.id
                  ? "border-brand bg-brand text-white"
                  : "border-hairline bg-canvas text-body hover:border-brand/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <AnimateOnScroll>
            <h3 className="font-display text-2xl font-semibold text-ink">{flow.title}</h3>
            <p className="mt-3 text-body">{flow.description}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1} className="flex justify-center lg:justify-end">
            <ProductFlowPhone flowId={active} />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
