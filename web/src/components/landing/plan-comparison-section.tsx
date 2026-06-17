"use client";

import { Check, X } from "lucide-react";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

export function PlanComparisonSection() {
  return (
    <section className="border-b border-hairline bg-canvas py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimateOnScroll className="text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Starter vs Pro at a glance
          </h2>
          <p className="mt-2 text-sm text-body">
            Both plans track renewals and receipts. Pro adds reminder queue, digest, QR attendance proof,
            and month-end exports.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1} className="mt-8 overflow-hidden rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="px-4 py-3 font-medium text-muted">Feature</th>
                <th className="px-4 py-3 text-center font-medium text-muted">Starter</th>
                <th className="px-4 py-3 text-center font-medium text-brand">Pro</th>
              </tr>
            </thead>
            <tbody>
              {landingConfig.planMatrix.map((row) => (
                <tr
                  key={row.feature}
                  className={cn(
                    "border-b border-hairline last:border-0",
                    row.highlight && "bg-brand-soft/20",
                  )}
                >
                  <td className="px-4 py-3 text-body">
                    {row.feature}
                    {"soon" in row && row.soon && (
                      <span className="ml-2 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-semibold text-warning">
                        Soon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {"soon" in row && row.soon ? (
                      <span className="text-xs text-muted">—</span>
                    ) : row.starter ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted/50" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {"soon" in row && row.soon ? (
                      <span className="text-xs text-muted">—</span>
                    ) : row.pro ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted/50" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
