"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { landingConfig } from "@/lib/landing-config";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <AnimateOnScroll>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked questions
          </h2>
        </AnimateOnScroll>
        <div className="mt-10 divide-y divide-hairline">
          {landingConfig.faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <AnimateOnScroll key={faq.q} delay={i * 0.05}>
                <div className="py-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="font-display text-base font-semibold text-ink">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-200 ease-out",
                      open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-body">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
