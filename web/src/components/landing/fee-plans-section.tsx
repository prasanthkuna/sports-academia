import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { ProductFlowPhone } from "@/components/landing/ui-mocks";
import { landingConfig } from "@/lib/landing-config";

export function FeePlansSection() {
  return (
    <section id="fee-plans" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimateOnScroll>
            <p className="text-sm font-medium uppercase tracking-wider text-brand">Fee Plan Engine</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Not just monthly — every Hyderabad academy billing model
            </h2>
            <p className="mt-4 text-body">
              Create plans once, assign to students, and let the system generate renewal demands,
              track sessions remaining, and flag expired packages — before money leaks at the gate.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-hairline bg-canvas">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-soft">
                    <th className="px-4 py-3 font-medium text-muted">Plan type</th>
                    <th className="px-4 py-3 font-medium text-muted">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {landingConfig.feePlanTypes.map((row) => (
                    <tr key={row.type} className="border-b border-hairline last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{row.type}</td>
                      <td className="px-4 py-3 text-body">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-body">
              {landingConfig.feePlanBullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-brand">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1} className="flex shrink-0 justify-center lg:justify-end">
            <div className="w-[280px] shrink-0">
              <ProductFlowPhone flowId="fee_plans" />
            </div>
          </AnimateOnScroll>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {landingConfig.renewalDashboardWidgets.map((w, i) => (
            <MotionCard
              key={w.label}
              delay={i * 0.06}
              className="rounded-xl border border-hairline bg-canvas p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{w.label}</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{w.value}</p>
              <p className="mt-1 text-xs text-body">{w.hint}</p>
            </MotionCard>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Fee examples reflect Hyderabad academy listings (cricket, badminton, swimming, camps) — early 2026.
        </p>
      </div>
    </section>
  );
}
