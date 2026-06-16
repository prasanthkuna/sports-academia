"use client";

import { Star } from "lucide-react";
import { AssetImage } from "@/components/landing/asset-image";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";

function Avatar({
  name,
  initials,
  image,
}: {
  name: string;
  initials: string;
  image: string;
}) {
  return (
    <AssetImage
      src={image}
      alt={name}
      width={48}
      height={48}
      className="h-12 w-12 rounded-full object-cover"
      fallback={
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
          {initials}
        </div>
      }
    />
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="border-y border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Trusted by academy owners
          </h2>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {landingConfig.testimonials.map((item, i) => (
            <MotionCard
              key={item.name}
              delay={i * 0.1}
              className="flex flex-col rounded-xl border border-hairline bg-canvas p-6"
            >
              <StarRating count={item.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-body">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-medium text-brand">{item.metric}</p>
              <footer className="mt-6 flex items-center gap-3">
                <Avatar name={item.name} initials={item.initials} image={item.image} />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                  <p className="text-xs text-muted">{item.city}</p>
                </div>
              </footer>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
