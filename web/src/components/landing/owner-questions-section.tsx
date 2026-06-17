"use client";

import { useState } from "react";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { ProductFlowPhone } from "@/components/landing/ui-mocks";
import { landingConfig, type ProductFlowId } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

export function OwnerQuestionsSection() {
  const [active, setActive] = useState<ProductFlowId>(
    landingConfig.ownerQuestions[0]!.flowId,
  );

  return (
    <section id="owner-questions" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">The real problem</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Five questions every owner asks before the next batch
          </h2>
          <p className="mt-4 text-body">
            Not &ldquo;do we have enough features&rdquo; — but who paid, who expired, who showed up, and
            who still needs a WhatsApp follow-up.
          </p>
        </AnimateOnScroll>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-2">
            {landingConfig.ownerQuestions.map((q) => (
              <button
                key={q.question}
                type="button"
                onClick={() => setActive(q.flowId)}
                className={cn(
                  "w-full rounded-xl border px-4 py-4 text-left transition-colors",
                  active === q.flowId
                    ? "border-brand bg-canvas shadow-sm"
                    : "border-transparent bg-canvas/60 hover:border-hairline hover:bg-canvas",
                )}
              >
                <p className="font-display text-sm font-semibold text-ink">{q.question}</p>
                {active === q.flowId && (
                  <p className="mt-2 text-sm text-body">{q.answer}</p>
                )}
              </button>
            ))}
          </div>

          <AnimateOnScroll className="flex shrink-0 justify-center lg:justify-end">
            <div className="w-[280px] shrink-0">
              <ProductFlowPhone flowId={active} />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
