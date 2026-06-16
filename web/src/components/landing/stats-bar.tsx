import { landingConfig } from "@/lib/landing-config";
import { CountUp } from "@/components/landing/motion/count-up";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";

export function StatsBar() {
  return (
    <section className="border-b border-hairline bg-surface-soft py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
        {landingConfig.stats.map((stat, i) => (
          <AnimateOnScroll key={stat.label} delay={i * 0.15} className="text-center">
            <p className="text-3xl font-semibold text-ink sm:text-4xl">
              <CountUp
                value={stat.value}
                prefix={"prefix" in stat ? stat.prefix : undefined}
                suffix={stat.suffix}
              />
            </p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
