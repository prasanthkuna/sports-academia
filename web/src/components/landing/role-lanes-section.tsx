"use client";

import { useState } from "react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { RolePhoneMock } from "@/components/landing/ui-mocks";
import { landingConfig, type RoleLaneId } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

export function RoleLanesSection() {
  const [active, setActive] = useState<RoleLaneId>("owner");
  const lane = landingConfig.roleLanes.find((r) => r.id === active)!;

  return (
    <section id="roles" className="border-b border-hairline py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Roles</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Right access for every person
          </h2>
          <p className="mt-4 text-body">
            Owners see everything. Staff run the desk. Coaches see only their batches — fees stay
            private from coaches.
          </p>
        </AnimateOnScroll>

        <div className="mt-8 flex flex-wrap gap-2">
          {landingConfig.roleLanes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActive(r.id)}
              className={cn(
                "rounded-lg border px-4 py-2 text-left transition-colors",
                active === r.id
                  ? "border-brand bg-brand-soft"
                  : "border-hairline bg-canvas hover:bg-surface-soft",
              )}
            >
              <p className="text-sm font-semibold text-ink">{r.title}</p>
              <p className="text-xs text-muted">{r.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <MotionCard className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-ink">{lane.title}</h3>
            <ul className="space-y-2">
              {lane.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-body">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </MotionCard>
          <div className="flex justify-center lg:justify-end">
            <RolePhoneMock roleId={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
