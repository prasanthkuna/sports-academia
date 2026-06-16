import { AnimatedWalkthrough } from "@/components/landing/animated-walkthrough";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

export function AnimatedWalkthroughSection() {
  return (
    <section id="walkthrough" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <AnimateOnScroll>
          <p className="text-sm font-medium uppercase tracking-wider text-brand">See it in action</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Gate to parent proof — on one phone
          </h2>
          <ol className="mt-8 space-y-4">
            {landingConfig.walkthroughSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-semibold text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.2} className="flex justify-center lg:justify-end">
          <AnimatedWalkthrough />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
