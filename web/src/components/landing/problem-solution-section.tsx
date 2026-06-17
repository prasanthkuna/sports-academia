import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

export function ProblemSolutionSection() {
  return (
    <section className="border-b border-hairline py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Renewal control</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Daily leakage → one operating system
          </h2>
        </AnimateOnScroll>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {landingConfig.problemSolutions.map((item, i) => (
            <MotionCard
              key={item.problem}
              delay={i * 0.06}
              className="rounded-xl border border-hairline bg-canvas p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-error">
                {item.problem}
              </p>
              <p className="mt-2 text-sm text-body">{item.solution}</p>
            </MotionCard>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">{landingConfig.roadmapNote}</p>
      </div>
    </section>
  );
}
